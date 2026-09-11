import { ref, computed, onUnmounted } from 'vue'
import type { SyncRole, SyncStatus, TransferStats, P2PDataPayload, SyncLogEntry } from '../types/sync'
import { packSdp, unpackSdp, calculateChecksum, validateBooksData, type PackedSdpResult } from '../utils/webrtcProtocol'
import { useBooks } from './composable'

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun.cloudflare.com:3478' },
    { urls: 'stun:stun.services.mozilla.com' }
  ],
  iceCandidatePoolSize: 2
}

const CHUNK_SIZE = 32 * 1024
const PAIRING_TIMEOUT_MS = 120000

export const useP2PSync = () => {
  const role = ref<SyncRole>(null)
  const status = ref<SyncStatus>('idle')
  const statusMessage = ref<string>('')
  const errorMessage = ref<string | null>(null)
  const localQrPayload = ref<string | null>(null)

  const logs = ref<SyncLogEntry[]>([])
  const peerConnectionState = ref<string>('new')
  const iceConnectionState = ref<string>('new')
  const dataChannelState = ref<string>('closed')

  const addLog = (
    level: SyncLogEntry['level'],
    category: SyncLogEntry['category'],
    message: string,
    details?: any
  ) => {
    const now = new Date()
    const timeStr = now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0')

    const entry: SyncLogEntry = {
      id: Math.random().toString(36).slice(2, 9),
      timestamp: timeStr,
      level,
      category,
      message,
      details
    }

    logs.value.push(entry)

    const badge = `[LogBuku:${category}]`
    if (level === 'error') {
      console.error(badge, message, details !== undefined ? details : '')
    } else if (level === 'warn') {
      console.warn(badge, message, details !== undefined ? details : '')
    } else if (level === 'success') {
      console.log(`%c${badge} ${message}`, 'color: #34d399; font-weight: bold;', details !== undefined ? details : '')
    } else {
      console.log(`%c${badge} ${message}`, 'color: #38bdf8;', details !== undefined ? details : '')
    }

    try {
      if (typeof fetch !== 'undefined') {
        fetch('/api/sync-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            role: role.value,
            category,
            message: details ? `${message} (${typeof details === 'object' ? JSON.stringify(details) : details})` : message,
            timestamp: timeStr
          })
        }).catch(() => {})
      }
    } catch {}
  }

  const clearLogs = () => {
    logs.value = []
  }

  const isWebRTCSupported = computed(() => {
    return typeof window !== 'undefined' &&
      'RTCPeerConnection' in window &&
      'RTCDataChannel' in window
  })

  const transferStats = ref<TransferStats>({
    totalBooks: 0,
    totalReadSessions: 0,
    totalPagesRead: 0,
    totalBytes: 0,
    transferredBytes: 0,
    percentage: 0,
    speedBps: 0
  })

  const receivedData = ref<P2PDataPayload | null>(null)
  const isImporting = ref<boolean>(false)

  let peerConnection: RTCPeerConnection | null = null
  let dataChannel: RTCDataChannel | null = null
  let pairingTimeoutTimer: any = null
  let disconnectGraceTimer: any = null

  let incomingChunks: string[] = []
  let expectedTotalChunks = 0
  let expectedChecksum = ''
  let expectedTotalBytes = 0
  let transferStartTime = 0

  let localGatheredCandidates: RTCIceCandidateInit[] = []

  const cleanupWebRTC = () => {
    if (pairingTimeoutTimer) {
      clearTimeout(pairingTimeoutTimer)
      pairingTimeoutTimer = null
    }

    if (disconnectGraceTimer) {
      clearTimeout(disconnectGraceTimer)
      disconnectGraceTimer = null
    }

    if (dataChannel) {
      try {
        dataChannel.close()
      } catch {}
      dataChannel = null
      dataChannelState.value = 'closed'
    }

    if (peerConnection) {
      try {
        peerConnection.close()
      } catch {}
      peerConnection = null
      peerConnectionState.value = 'closed'
      iceConnectionState.value = 'closed'
    }
  }

  const reset = () => {
    addLog('info', 'ROLE', 'Reset sesi P2P sync ke status idle.')
    cleanupWebRTC()
    role.value = null
    status.value = 'idle'
    statusMessage.value = ''
    errorMessage.value = null
    localQrPayload.value = null
    receivedData.value = null
    isImporting.value = false
    incomingChunks = []
    expectedTotalChunks = 0
    expectedChecksum = ''
    expectedTotalBytes = 0
    localGatheredCandidates = []
    peerConnectionState.value = 'new'
    iceConnectionState.value = 'new'
    dataChannelState.value = 'closed'
    transferStats.value = {
      totalBooks: 0,
      totalReadSessions: 0,
      totalPagesRead: 0,
      totalBytes: 0,
      transferredBytes: 0,
      percentage: 0,
      speedBps: 0
    }
  }

  const setError = (msg: string, details?: any) => {
    addLog('error', 'CONN', msg, details)
    cleanupWebRTC()
    status.value = 'error'
    errorMessage.value = msg
    statusMessage.value = msg
  }

  /**
   * Helper to wait for ICE gathering completion or timeout (Vanilla ICE)
   */
  const waitForIceGathering = (pc: RTCPeerConnection, maxTimeoutMs = 2800): Promise<void> => {
    return new Promise((resolve) => {
      addLog('info', 'ICE', `Mulai pengumpulan kandidat ICE (timeout: ${maxTimeoutMs}ms)...`)

      if (pc.iceGatheringState === 'complete') {
        addLog('success', 'ICE', 'ICE Gathering sudah berstatus complete.')
        resolve()
        return
      }

      let timer: any = null

      const onStateChange = () => {
        addLog('info', 'ICE', `ICE Gathering State berubah: ${pc.iceGatheringState}`)
        if (pc.iceGatheringState === 'complete') {
          cleanup()
          resolve()
        }
      }

      const onCandidate = (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate) {
          const type = e.candidate.type || 'unknown'
          const protocol = e.candidate.protocol || 'udp'
          addLog('info', 'ICE', `Kandidat ditemukan: [${type.toUpperCase()}] ${protocol} ${e.candidate.address || 'ip'}:${e.candidate.port}`)

          localGatheredCandidates.push(
            e.candidate.toJSON ? e.candidate.toJSON() : {
              candidate: e.candidate.candidate,
              sdpMid: e.candidate.sdpMid,
              sdpMLineIndex: e.candidate.sdpMLineIndex,
              usernameFragment: e.candidate.usernameFragment
            }
          )
        } else {
          addLog('success', 'ICE', `Semua kandidat ICE selesai dikumpulkan (Total: ${localGatheredCandidates.length} kandidat).`)
          cleanup()
          resolve()
        }
      }

      const cleanup = () => {
        if (timer) clearTimeout(timer)
        pc.removeEventListener('icegatheringstatechange', onStateChange)
        pc.removeEventListener('icecandidate', onCandidate)
      }

      timer = setTimeout(() => {
        addLog('warn', 'ICE', `Waktu tunggu pengumpulan kandidat ICE tercapai (${maxTimeoutMs}ms). Melanjutkan dengan ${localGatheredCandidates.length} kandidat yang ada.`)
        cleanup()
        resolve()
      }, maxTimeoutMs)

      pc.addEventListener('icegatheringstatechange', onStateChange)
      pc.addEventListener('icecandidate', onCandidate)
    })
  }

  /**
   * Helper to safely apply remote ICE candidates to PeerConnection
   */
  const applyRemoteCandidates = async (pc: RTCPeerConnection, candidates: RTCIceCandidateInit[]) => {
    if (!candidates || candidates.length === 0) return
    addLog('info', 'ICE', `Menerapkan ${candidates.length} remote ICE candidates ke PeerConnection...`)

    for (const c of candidates) {
      try {
        if (c && c.candidate) {
          await pc.addIceCandidate(new RTCIceCandidate(c))
        }
      } catch (err) {
      }
    }
  }

  /**
   * Wire up data channel event listeners
   */
  const attachDataChannelListeners = (dc: RTCDataChannel) => {
    dataChannel = dc
    dc.binaryType = 'arraybuffer'
    dataChannelState.value = dc.readyState

    addLog('info', 'CHANNEL', `DataChannel listener dipasang: "${dc.label}" (State: ${dc.readyState})`)

    dc.onopen = () => {
      dataChannelState.value = 'open'
      if (pairingTimeoutTimer) {
        clearTimeout(pairingTimeoutTimer)
        pairingTimeoutTimer = null
      }
      if (disconnectGraceTimer) {
        clearTimeout(disconnectGraceTimer)
        disconnectGraceTimer = null
      }

      status.value = 'connected'
      statusMessage.value = 'Terhubung langsung antar-perangkat!'
      addLog('success', 'CHANNEL', 'RTCDataChannel TERBUKA dan siap transfer data P2P!')

      try {
        const handshakeMsg = { type: 'HANDSHAKE', role: role.value, timestamp: Date.now() }
        dc.send(JSON.stringify(handshakeMsg))
        addLog('info', 'CHANNEL', 'Handshake terkirim ke peer:', handshakeMsg)
      } catch (err) {
        addLog('warn', 'CHANNEL', 'Gagal mengirim handshake:', err)
      }

      if (role.value === 'sender') {
        addLog('info', 'TRANSFER', 'Peran: Pengirim. Mempersiapkan pengiriman data otomatis dalam 400ms...')
        setTimeout(() => {
          sendAllBooks()
        }, 400)
      } else {
        addLog('info', 'TRANSFER', 'Peran: Penerima. Menunggu pengirim memulai pengiriman berkas...')
      }
    }

    dc.onclose = () => {
      dataChannelState.value = 'closed'
      addLog('info', 'CHANNEL', 'RTCDataChannel ditutup.')
      if (status.value === 'transferring' && transferStats.value.percentage < 100) {
        setError('Koneksi saluran data terputus di tengah proses transfer.')
      }
    }

    dc.onerror = (err: any) => {
      const errMsg = err?.message || (err?.error && err.error.message) || ''
      addLog('warn', 'CHANNEL', errMsg ? `Peristiwa RTCDataChannel info: ${errMsg}` : 'Peristiwa RTCDataChannel status update.')
      if (status.value === 'transferring' && transferStats.value.percentage < 100) {
        setError('Terjadi kendala pada transmisi data P2P.')
      }
    }

    dc.onmessage = async (event) => {
      handleIncomingDataMessage(event.data)
    }
  }

  /**
   * Setup PeerConnection listeners for connection state & ICE
   */
  const setupPeerConnection = (): RTCPeerConnection => {
    cleanupWebRTC()
    localGatheredCandidates = []

    addLog('info', 'CONN', 'Membuat RTCPeerConnection baru dengan Google & Cloudflare STUN servers...')
    const pc = new RTCPeerConnection(RTC_CONFIG)
    peerConnection = pc
    peerConnectionState.value = pc.connectionState
    iceConnectionState.value = pc.iceConnectionState

    pc.onconnectionstatechange = () => {
      peerConnectionState.value = pc.connectionState
      addLog('info', 'CONN', `PeerConnection state berubah: ${pc.connectionState}`)

      if (pc.connectionState === 'connected') {
        addLog('success', 'CONN', 'PeerConnection berhasil terhubung langsung (Connected)!')
        if (disconnectGraceTimer) {
          clearTimeout(disconnectGraceTimer)
          disconnectGraceTimer = null
        }
      } else if (pc.connectionState === 'disconnected') {
        addLog('warn', 'CONN', 'PeerConnection sementara disconnected (sedang re-negotiation / switching candidate pair). Menunggu pemulihan...')
        if (status.value === 'transferring') {
          if (!disconnectGraceTimer) {
            disconnectGraceTimer = setTimeout(() => {
              if (peerConnection?.connectionState === 'disconnected' || peerConnection?.connectionState === 'failed') {
                setError('Koneksi WebRTC terputus di tengah transfer data.')
              }
            }, 8000)
          }
        }
      } else if (pc.connectionState === 'failed') {
        if (status.value === 'waiting' || status.value === 'connecting') {
          addLog('warn', 'CONN', 'Kandidat awal belum tersambung. Menunggu perangkat kedua memindai QR balasan...')
        } else if (status.value === 'transferring' && transferStats.value.percentage < 100) {
          setError('Koneksi WebRTC gagal tersambung. Pastikan kedua perangkat terhubung ke internet/jaringan.')
        }
      }
    }

    pc.oniceconnectionstatechange = () => {
      iceConnectionState.value = pc.iceConnectionState
      addLog('info', 'ICE', `ICE Connection state: ${pc.iceConnectionState}`)

      if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
        addLog('success', 'ICE', 'Koneksi NAT traversal ICE berhasil terjalin!')
      } else if (pc.iceConnectionState === 'disconnected') {
        addLog('warn', 'ICE', 'Koneksi ICE sementara terputus (mencoba candidate pair lain)...')
      } else if (pc.iceConnectionState === 'failed') {
        if (status.value === 'waiting' || status.value === 'connecting') {
          addLog('warn', 'ICE', 'ICE traversal belum selesai. Menunggu pertukaran kandidat lengkap dari pemindaian QR...')
        } else if (status.value === 'transferring' && transferStats.value.percentage < 100) {
          setError('Negosiasi jaringan ICE gagal tersambung antar-perangkat.')
        }
      }
    }

    pairingTimeoutTimer = setTimeout(() => {
      if (status.value === 'waiting' || status.value === 'connecting') {
        addLog('error', 'CONN', 'Batas waktu pairing 2 menit terlampaui (Timeout).')
        setError('Waktu pairing habis (timeout 2 menit). Silakan coba lagi.')
      }
    }, PAIRING_TIMEOUT_MS)

    return pc
  }

  /**
   * Start in RECEIVE mode
   * Creates PeerConnection + DataChannel + Offer, then shows Offer QR
   */
  const startAsReceiver = async () => {
    if (!isWebRTCSupported.value) {
      setError('Browser Anda tidak mendukung WebRTC RTCDataChannel.')
      return
    }

    try {
      reset()
      role.value = 'receiver'
      status.value = 'waiting'
      statusMessage.value = 'Menyiapkan kode pairing penerima...'
      addLog('info', 'ROLE', 'Memulai inisialisasi sebagai PENERIMA (Receiver)...')

      const pc = setupPeerConnection()

      addLog('info', 'CHANNEL', 'Membuat RTCDataChannel lokal "logbuku-p2p"...')
      const dc = pc.createDataChannel('logbuku-p2p', { ordered: true })
      attachDataChannelListeners(dc)

      addLog('info', 'SDP', 'Membuat penawaran WebRTC Offer...')
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      addLog('info', 'SDP', 'LocalDescription (Offer) diset. Menunggu kandidat ICE...')

      statusMessage.value = 'Mengumpulkan informasi jaringan STUN...'
      await waitForIceGathering(pc, 2800)

      if (!pc.localDescription?.sdp) {
        throw new Error('Gagal menghasilkan SDP penawaran WebRTC.')
      }

      localQrPayload.value = await packSdp('offer', pc.localDescription.sdp, localGatheredCandidates)
      addLog('success', 'SDP', `Offer SDP berhasil dikompresi: ${localQrPayload.value.length} karakter (${localGatheredCandidates.length} kandidat). QR Code siap ditampilkan.`)

      status.value = 'waiting'
      statusMessage.value = 'Tunjukkan QR Code ini ke perangkat pengirim.'
    } catch (err: any) {
      console.error('[WebRTC Receiver] Start error:', err)
      setError('Gagal memulai mode penerima: ' + (err?.message || String(err)), err)
    }
  }

  /**
   * Receiver scans the Sender's Answer QR
   */
  const handleScannedAnswer = async (qrString: string) => {
    try {
      if (!peerConnection) {
        throw new Error('Sesi penerima belum diinisialisasi.')
      }

      addLog('info', 'SDP', `Menerima kode respon Answer (${(qrString || '').length} karakter). Mendekompresi...`)
      status.value = 'connecting'
      statusMessage.value = 'Menghubungkan ke perangkat pengirim...'

      const unpacked: PackedSdpResult = await unpackSdp(qrString)
      addLog('success', 'SDP', `Dekompresi berhasil! Tipe: ${unpacked.type}, ukuran SDP: ${unpacked.sdp.length} bytes, ${unpacked.candidates?.length || 0} kandidat.`)

      if (unpacked.type !== 'answer') {
        throw new Error('Kode QR yang dipindai bukan respon (Answer) yang diharapkan.')
      }

      addLog('info', 'SDP', 'Menerapkan RemoteDescription (Answer) ke PeerConnection...')
      await peerConnection.setRemoteDescription(new RTCSessionDescription({
        type: 'answer',
        sdp: unpacked.sdp
      }))
      addLog('success', 'SDP', 'RemoteDescription (Answer) berhasil diterapkan!')

      if (unpacked.candidates && unpacked.candidates.length > 0) {
        await applyRemoteCandidates(peerConnection, unpacked.candidates)
      }
    } catch (err: any) {
      console.error('[WebRTC Receiver] Answer error:', err)
      setError('Gagal memproses QR respon: ' + (err?.message || String(err)), err)
    }
  }

  /**
   * Start in SEND mode by scanning Receiver's Offer QR
   */
  const handleScannedOffer = async (qrString: string) => {
    if (!isWebRTCSupported.value) {
      setError('Browser Anda tidak mendukung WebRTC RTCDataChannel.')
      return
    }

    try {
      reset()
      role.value = 'sender'
      status.value = 'connecting'
      statusMessage.value = 'Memproses penawaran koneksi dari penerima...'
      addLog('info', 'ROLE', 'Memulai inisialisasi sebagai PENGIRIM (Sender)...')
      addLog('info', 'SDP', `Menerima penawaran Offer (${(qrString || '').length} karakter). Mendekompresi...`)

      const unpacked: PackedSdpResult = await unpackSdp(qrString)
      addLog('success', 'SDP', `Dekompresi berhasil! Tipe: ${unpacked.type}, ukuran SDP: ${unpacked.sdp.length} bytes, ${unpacked.candidates?.length || 0} kandidat.`)

      if (unpacked.type !== 'offer') {
        throw new Error('Kode QR yang dipindai bukan penawaran (Offer) dari perangkat penerima.')
      }

      const pc = setupPeerConnection()

      pc.ondatachannel = (e) => {
        addLog('success', 'CHANNEL', `Peristiwa ondatachannel diterima dari penerima: "${e.channel.label}"`)
        attachDataChannelListeners(e.channel)
      }

      addLog('info', 'SDP', 'Menerapkan RemoteDescription (Offer) ke PeerConnection...')
      await pc.setRemoteDescription(new RTCSessionDescription({
        type: 'offer',
        sdp: unpacked.sdp
      }))
      addLog('success', 'SDP', 'RemoteDescription (Offer) berhasil diset.')

      addLog('info', 'SDP', 'Membuat jawaban koneksi (Answer)...')
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      addLog('info', 'SDP', 'LocalDescription (Answer) diset. Menunggu kandidat ICE...')

      if (unpacked.candidates && unpacked.candidates.length > 0) {
        await applyRemoteCandidates(pc, unpacked.candidates)
      }

      statusMessage.value = 'Mengumpulkan kandidat jaringan STUN...'
      await waitForIceGathering(pc, 2800)

      if (!pc.localDescription?.sdp) {
        throw new Error('Gagal menghasilkan SDP respon WebRTC.')
      }

      localQrPayload.value = await packSdp('answer', pc.localDescription.sdp, localGatheredCandidates)
      addLog('success', 'SDP', `Answer SDP berhasil dikompresi: ${localQrPayload.value.length} karakter (${localGatheredCandidates.length} kandidat). QR Code siap ditampilkan.`)

      status.value = 'connecting'
      statusMessage.value = 'QR balasan dibuat! Arahkan perangkat penerima untuk memindai kode ini.'
    } catch (err: any) {
      console.error('[WebRTC Sender] Offer error:', err)
      setError('Gagal memproses penawaran pengirim: ' + (err?.message || String(err)), err)
    }
  }

  /**
   * Sender: Read all books from IndexedDB and transmit to Receiver via RTCDataChannel
   */
  const sendAllBooks = async () => {
    if (!dataChannel || dataChannel.readyState !== 'open') {
      addLog('warn', 'TRANSFER', `DataChannel belum open (State: ${dataChannel?.readyState || 'null'}). Menunggu event open...`)
      await new Promise<void>((resolve) => {
        let timer: any = null
        const onOpen = () => {
          if (timer) clearTimeout(timer)
          dataChannel?.removeEventListener('open', onOpen)
          resolve()
        }
        timer = setTimeout(() => {
          dataChannel?.removeEventListener('open', onOpen)
          resolve()
        }, 3000)

        if (dataChannel) {
          dataChannel.addEventListener('open', onOpen)
        } else {
          resolve()
        }
      })
    }

    if (!dataChannel || dataChannel.readyState !== 'open') {
      addLog('error', 'TRANSFER', 'Gagal kirim: RTCDataChannel belum terbuka setelah menunggu.')
      setError('Saluran data belum terbuka untuk transfer.')
      return
    }

    try {
      status.value = 'transferring'
      statusMessage.value = 'Membaca data dari IndexedDB lokal...'
      addLog('info', 'DB', 'Membaca koleksi buku dari IndexedDB lokal ("BookTrackerDB" -> "books")...')

      const { loadBooks } = useBooks()
      const rawBooks = await loadBooks()
      addLog('info', 'DB', `Ditemukan ${rawBooks.length} buku di database lokal.`)

      const validation = validateBooksData(rawBooks)
      const booksToExport = validation.cleanBooks
      addLog('info', 'TRANSFER', `Data tervalidasi: ${booksToExport.length} buku, ${validation.stats.totalReadSessions} sesi baca.`)

      const booksJson = JSON.stringify(booksToExport)
      addLog('info', 'TRANSFER', 'Menghitung SHA-256 Checksum dari payload buku...')
      const checksum = await calculateChecksum(booksJson)
      addLog('success', 'TRANSFER', `Checksum: ${checksum.slice(0, 12)}...`)

      const payload: P2PDataPayload = {
        app: 'LogBuku',
        version: 1,
        exportedAt: new Date().toISOString(),
        checksum,
        stats: validation.stats,
        books: booksToExport
      }

      const fullJson = JSON.stringify(payload)
      const totalBytes = new Blob([fullJson]).size

      const totalChunks = Math.ceil(fullJson.length / CHUNK_SIZE) || 1

      transferStats.value = {
        totalBooks: validation.stats.totalBooks,
        totalReadSessions: validation.stats.totalReadSessions,
        totalPagesRead: validation.stats.totalPagesRead,
        totalBytes,
        transferredBytes: 0,
        percentage: 0,
        speedBps: 0
      }

      addLog('info', 'TRANSFER', `Mengirim pesan METADATA: Total ${totalBytes} bytes (${(totalBytes / 1024).toFixed(1)} KB), ${totalChunks} chunks (@${CHUNK_SIZE / 1024} KB).`)

      dataChannel.send(JSON.stringify({
        type: 'METADATA',
        stats: validation.stats,
        totalBytes,
        totalChunks,
        checksum
      }))

      statusMessage.value = `Mengirim ${validation.stats.totalBooks} buku ke penerima...`
      transferStartTime = Date.now()

      for (let i = 0; i < totalChunks; i++) {
        if (!dataChannel || dataChannel.readyState !== 'open') {
          throw new Error('Koneksi terputus di tengah proses pengiriman chunk.')
        }

        const chunkStr = fullJson.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)

        if (dataChannel.bufferedAmount > 64 * 1024) {
          addLog('warn', 'TRANSFER', `BufferedAmount tinggi (${dataChannel.bufferedAmount} bytes). Menunggu bufferedamountlow...`)
          await new Promise<void>((resolve) => {
            const onLow = () => {
              dataChannel?.removeEventListener('bufferedamountlow', onLow)
              resolve()
            }
            if (dataChannel) {
              dataChannel.bufferedAmountLowThreshold = 32 * 1024
              dataChannel.addEventListener('bufferedamountlow', onLow)
            } else {
              resolve()
            }
          })
        }

        dataChannel.send(JSON.stringify({
          type: 'CHUNK',
          index: i,
          total: totalChunks,
          chunk: chunkStr
        }))

        const sentBytes = Math.min(totalBytes, (i + 1) * CHUNK_SIZE)
        const elapsed = (Date.now() - transferStartTime) / 1000
        const speed = elapsed > 0 ? sentBytes / elapsed : 0
        const percentage = Math.round(((i + 1) / totalChunks) * 100)

        transferStats.value.transferredBytes = sentBytes
        transferStats.value.percentage = percentage
        transferStats.value.speedBps = Math.round(speed)

        if ((i + 1) % 5 === 0 || i + 1 === totalChunks) {
          addLog('info', 'TRANSFER', `Terkirim chunk ${i + 1}/${totalChunks} (${percentage}%) - Kecepatan: ${(speed / 1024).toFixed(1)} KB/s`)
        }
      }

      transferStats.value.transferredBytes = totalBytes
      transferStats.value.percentage = 100

      addLog('info', 'TRANSFER', 'Seluruh chunk terkirim! Mengirim notifikasi TRANSFER_COMPLETE...')
      dataChannel.send(JSON.stringify({
        type: 'TRANSFER_COMPLETE',
        checksum
      }))

      statusMessage.value = 'Data terkirim! Menunggu konfirmasi dari penerima...'
      addLog('success', 'TRANSFER', 'Semua data telah dikirim. Menunggu ACK dari perangkat penerima...')
    } catch (err: any) {
      console.error('[WebRTC Sender] Send error:', err)
      setError('Gagal mentransfer data: ' + (err?.message || String(err)), err)
    }
  }

  /**
   * Receiver: Handle incoming data channel messages
   */
  const handleIncomingDataMessage = async (rawMessage: any) => {
    try {
      if (typeof rawMessage !== 'string') return
      const msg = JSON.parse(rawMessage)

      if (msg.type === 'HANDSHAKE') {
        addLog('info', 'CHANNEL', `Handshake diterima dari peer: peran ${msg.role}`)
      } else if (msg.type === 'METADATA') {
        status.value = 'transferring'
        expectedTotalChunks = msg.totalChunks
        expectedTotalBytes = msg.totalBytes
        expectedChecksum = msg.checksum
        incomingChunks = new Array(expectedTotalChunks)
        transferStartTime = Date.now()

        addLog('info', 'TRANSFER', `METADATA diterima: ${msg.stats.totalBooks} buku, ${msg.totalBytes} bytes, ${msg.totalChunks} chunks. Checksum: ${msg.checksum.slice(0, 10)}...`)

        transferStats.value = {
          totalBooks: msg.stats.totalBooks,
          totalReadSessions: msg.stats.totalReadSessions,
          totalPagesRead: msg.stats.totalPagesRead,
          totalBytes: msg.totalBytes,
          transferredBytes: 0,
          percentage: 0,
          speedBps: 0
        }

        statusMessage.value = `Menerima ${msg.stats.totalBooks} buku dari pengirim...`
      } else if (msg.type === 'CHUNK') {
        incomingChunks[msg.index] = msg.chunk

        const receivedChunksCount = incomingChunks.filter(Boolean).length
        const percentage = expectedTotalChunks > 0 
          ? Math.round((receivedChunksCount / expectedTotalChunks) * 100) 
          : 0

        const receivedBytes = Math.min(expectedTotalBytes, receivedChunksCount * CHUNK_SIZE)
        const elapsed = (Date.now() - transferStartTime) / 1000
        const speed = elapsed > 0 ? receivedBytes / elapsed : 0

        transferStats.value.transferredBytes = receivedBytes
        transferStats.value.percentage = percentage
        transferStats.value.speedBps = Math.round(speed)

        if (receivedChunksCount % 5 === 0 || receivedChunksCount === expectedTotalChunks) {
          addLog('info', 'TRANSFER', `Menerima chunk ${receivedChunksCount}/${expectedTotalChunks} (${percentage}%) - ${(speed / 1024).toFixed(1)} KB/s`)
        }
      } else if (msg.type === 'TRANSFER_COMPLETE') {
        status.value = 'verifying'
        statusMessage.value = 'Memverifikasi integritas dan keamanan data...'
        addLog('info', 'TRANSFER', 'TRANSFER_COMPLETE diterima. Merangkai pecahan data dan memverifikasi...')

        const assembledJson = incomingChunks.join('')
        addLog('info', 'TRANSFER', `Data terangkai (${assembledJson.length} karakter). Parsing JSON...`)

        const payload: P2PDataPayload = JSON.parse(assembledJson)

        if (payload.app !== 'LogBuku' || !Array.isArray(payload.books)) {
          throw new Error('Data yang diterima bukan berkas LogBuku yang valid.')
        }

        const booksJson = JSON.stringify(payload.books)
        addLog('info', 'TRANSFER', 'Menghitung ulang Checksum...')
        const calculatedHash = await calculateChecksum(booksJson)

        if (expectedChecksum && calculatedHash !== expectedChecksum) {
          addLog('warn', 'TRANSFER', `Perhatian: Checksum berbeda (Kirim: ${expectedChecksum.slice(0, 8)}..., Terima: ${calculatedHash.slice(0, 8)}...). Melanjutkan verifikasi struktur data buku...`)
        } else {
          addLog('success', 'TRANSFER', 'Verifikasi Checksum COCOK! Integritas data terjamin.')
        }

        const validation = validateBooksData(payload.books)
        if (!validation.valid || validation.cleanBooks.length === 0) {
          throw new Error(validation.error || 'Struktur data buku tidak valid atau kosong.')
        }

        payload.books = validation.cleanBooks
        payload.stats = validation.stats

        receivedData.value = payload
        addLog('success', 'TRANSFER', `Data siap diimpor: ${payload.stats.totalBooks} buku, ${payload.stats.totalReadSessions} sesi baca.`)
        statusMessage.value = `Data berhasil diterima (${payload.stats.totalBooks} buku). Siap untuk disimpan.`

        if (dataChannel && dataChannel.readyState === 'open') {
          try {
            dataChannel.send(JSON.stringify({
              type: 'TRANSFER_RECEIVED_ACK',
              count: payload.stats.totalBooks
            }))
            addLog('info', 'TRANSFER', 'Mengirim konfirmasi TRANSFER_RECEIVED_ACK ke pengirim.')
          } catch (ackErr) {
            addLog('warn', 'TRANSFER', 'Gagal mengirim TRANSFER_RECEIVED_ACK ke pengirim:', ackErr)
          }
        }
      } else if (msg.type === 'TRANSFER_RECEIVED_ACK') {
        status.value = 'completed'
        addLog('success', 'TRANSFER', `ACK Diterima! Perangkat penerima telah menerima ${msg.count || transferStats.value.totalBooks} buku dengan sukses.`)
        statusMessage.value = `Berhasil mentransfer ${msg.count || transferStats.value.totalBooks} buku ke perangkat penerima! Menunggu penerima menyelesaikan impor.`
      } else if (msg.type === 'IMPORT_CONFIRMED') {
        status.value = 'completed'
        addLog('success', 'TRANSFER', `Konfirmasi Selesai! Perangkat penerima telah menyimpan ${msg.count || transferStats.value.totalBooks} buku ke database.`)
        statusMessage.value = `Sinkronisasi sukses! ${msg.count || transferStats.value.totalBooks} buku telah tersimpan di perangkat penerima.`
      }
    } catch (err: any) {
      console.error('[WebRTC Message] Error processing message:', err)
      setError('Kesalahan saat memproses data transfer: ' + (err?.message || String(err)), err)
    }
  }

  /**
   * Receiver: Import received books into IndexedDB
   */
  const importReceivedData = async (mode: 'merge' | 'replace' = 'merge'): Promise<void> => {
    if (!receivedData.value || !Array.isArray(receivedData.value.books)) {
      setError('Tidak ada data untuk diimpor.')
      return
    }

    isImporting.value = true
    addLog('info', 'DB', `Memulai penyimpanan ke IndexedDB dengan mode: ${mode.toUpperCase()}...`)

    try {
      const { saveBooks, loadBooks } = useBooks()
      const incomingBooks = receivedData.value.books

      if (mode === 'replace') {
        addLog('info', 'DB', 'Mode Ganti Semua (Replace): Mengosongkan store "books" dan menyimpan data baru...')
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
          const req = indexedDB.open('BookTrackerDB', 3)
          req.onsuccess = (e: any) => resolve(e.target.result)
          req.onerror = (e: any) => reject(e.target.error)
        })

        await new Promise<void>((resolve, reject) => {
          const tx = db.transaction('books', 'readwrite')
          const store = tx.objectStore('books')
          store.clear()
          incomingBooks.forEach(b => {
            const clean = JSON.parse(JSON.stringify(b))
            store.put(clean)
          })
          tx.oncomplete = () => resolve()
          tx.onerror = (e) => reject(e)
        })
      } else {
        addLog('info', 'DB', 'Mode Gabung (Merge): Membaca buku lokal saat ini untuk sinkronisasi...')
        const existingBooks = await loadBooks()
        const existingMap = new Map<string, any>()

        existingBooks.forEach(b => {
          const key = (b.title + '__' + (b.author || '')).toLowerCase().trim()
          existingMap.set(key, b)
        })

        const finalBooksToSave: any[] = []

        incomingBooks.forEach(inBook => {
          const key = (inBook.title + '__' + (inBook.author || '')).toLowerCase().trim()
          const existing = existingMap.get(key)

          if (existing) {
            const inTime = new Date(inBook.updatedAt || 0).getTime()
            const exTime = new Date(existing.updatedAt || 0).getTime()

            if (inTime >= exTime) {
              finalBooksToSave.push({
                ...inBook,
                id: existing.id
              })
            }
          } else {
            const newBook = { ...inBook }
            delete newBook.id
            finalBooksToSave.push(newBook)
          }
        })

        addLog('info', 'DB', `Menyimpan ${finalBooksToSave.length} buku yang diperbarui/baru ke IndexedDB...`)
        if (finalBooksToSave.length > 0) {
          await saveBooks(finalBooksToSave)
        }
      }

      await loadBooks()
      addLog('success', 'DB', 'Database IndexedDB berhasil diperbarui!')

      if (dataChannel && dataChannel.readyState === 'open') {
        try {
          addLog('info', 'CHANNEL', 'Mengirim konfirmasi ACK IMPORT_CONFIRMED ke pengirim...')
          dataChannel.send(JSON.stringify({
            type: 'IMPORT_CONFIRMED',
            count: incomingBooks.length
          }))
        } catch (err) {
          addLog('warn', 'CHANNEL', 'Gagal mengirim ACK konfirmasi ke pengirim:', err)
        }
      }

      status.value = 'completed'
      statusMessage.value = `Berhasil mengimpor ${incomingBooks.length} buku ke LogBuku!`
      addLog('success', 'TRANSFER', 'Semua tahapan sinkronisasi P2P selesai dengan sukses!')
    } catch (err: any) {
      console.error('[WebRTC Import] Error saving to IndexedDB:', err)
      setError('Gagal menyimpan data ke IndexedDB: ' + (err?.message || String(err)), err)
    } finally {
      isImporting.value = false
    }
  }

  /**
   * Helper to seed sample books for manual testing if local database is empty
   */
  const createSampleBooksForTesting = async (): Promise<void> => {
    addLog('info', 'DB', 'Menambahkan 3 buku contoh untuk pengujian transfer...')
    const { saveBooks, loadBooks } = useBooks()
    const now = new Date().toISOString()
    const sampleBooks = [
      {
        title: 'Laskar Pelangi',
        author: 'Andrea Hirata',
        publisher: 'Bentang Pustaka',
        date: '2026-08-10',
        price: 89000,
        topic: ['Fiksi', 'Inspiratif'],
        totalPages: 529,
        pagesRead: 250,
        isPinned: true,
        isTarget: true,
        createdAt: now,
        updatedAt: now,
        readHistory: [
          {
            id: 'sess_sample_1',
            date: now,
            pagesAdded: 150,
            duration: 3600,
            startPage: 0,
            endPage: 150
          },
          {
            id: 'sess_sample_2',
            date: now,
            pagesAdded: 100,
            duration: 2400,
            startPage: 150,
            endPage: 250
          }
        ]
      },
      {
        title: 'Filosofi Teras',
        author: 'Henry Manampiring',
        publisher: 'Kompas Gramedia',
        date: '2026-08-18',
        price: 98000,
        topic: ['Self Development', 'Filsafat'],
        totalPages: 346,
        pagesRead: 346,
        completedAt: now,
        isPinned: false,
        isTarget: false,
        createdAt: now,
        updatedAt: now,
        readHistory: [
          {
            id: 'sess_sample_3',
            date: now,
            pagesAdded: 346,
            duration: 7200,
            startPage: 0,
            endPage: 346
          }
        ]
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        publisher: 'Gramedia Pustaka Utama',
        date: '2026-08-25',
        price: 108000,
        topic: ['Produktivitas', 'Psikologi'],
        totalPages: 352,
        pagesRead: 120,
        isPinned: false,
        isTarget: true,
        createdAt: now,
        updatedAt: now,
        readHistory: [
          {
            id: 'sess_sample_4',
            date: now,
            pagesAdded: 120,
            duration: 2800,
            startPage: 0,
            endPage: 120
          }
        ]
      }
    ]

    await saveBooks(sampleBooks)
    await loadBooks()
    addLog('success', 'DB', '3 buku sampel berhasil ditambahkan ke database lokal!')
  }

  onUnmounted(() => {
    cleanupWebRTC()
  })

  return {
    role,
    status,
    statusMessage,
    errorMessage,
    localQrPayload,
    isWebRTCSupported,
    transferStats,
    receivedData,
    isImporting,
    logs,
    peerConnectionState,
    iceConnectionState,
    dataChannelState,
    addLog,
    clearLogs,
    startAsReceiver,
    handleScannedOffer,
    handleScannedAnswer,
    sendAllBooks,
    importReceivedData,
    createSampleBooksForTesting,
    reset
  }
}
