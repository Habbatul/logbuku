import type { P2PDataPayload } from '~/types/sync'

export interface PackedSdpResult {
  type: 'offer' | 'answer'
  sdp: string
  candidates: RTCIceCandidateInit[]
}

/**
 * Packs WebRTC SDP description and ICE candidates into a compact URL-safe string
 * Uses native CompressionStream (deflate-raw)
 */
export async function packSdp(
  type: 'offer' | 'answer',
  sdp: string,
  candidates: RTCIceCandidateInit[] = []
): Promise<string> {
  const roleCode = type === 'offer' ? 'O' : 'A'

  let fullSdp = sdp
  for (const c of candidates) {
    if (c.candidate && !fullSdp.includes(c.candidate.trim())) {
      fullSdp += `a=${c.candidate.trim()}\r\n`
    }
  }

  fullSdp = fullSdp.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n')

  const payloadObj = {
    t: roleCode,
    s: fullSdp,
    c: candidates.map(cand => ({
      candidate: cand.candidate,
      sdpMid: cand.sdpMid || '0',
      sdpMLineIndex: cand.sdpMLineIndex ?? 0
    }))
  }

  try {
    if (typeof CompressionStream !== 'undefined') {
      const jsonStr = JSON.stringify(payloadObj)
      const stream = new Blob([jsonStr]).stream().pipeThrough(new CompressionStream('deflate-raw'))
      const buffer = await new Response(stream).arrayBuffer()
      const bytes = new Uint8Array(buffer)
      let binary = ''
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      const b64 = btoa(binary)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')
      return 'LBS2:' + roleCode + ':' + b64
    }
  } catch (err) {
    console.warn('[WebRTC] CompressionStream failed, using raw fallback:', err)
  }

  return JSON.stringify({ app: 'LogBuku', type, sdp: fullSdp, candidates })
}

/**
 * Unpacks and decompresses WebRTC SDP description and ICE candidates
 */
export async function unpackSdp(raw: string): Promise<PackedSdpResult> {
  const trimmed = (raw || '').trim()

  if (trimmed.startsWith('LBS2:')) {
    const parts = trimmed.split(':')
    if (parts.length >= 3) {
      let b64 = parts.slice(2).join(':').replace(/-/g, '+').replace(/_/g, '/')
      while (b64.length % 4 !== 0) {
        b64 += '='
      }

      const binary = atob(b64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }

      if (typeof DecompressionStream !== 'undefined') {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
        const text = await new Response(stream).text()
        const parsed = JSON.parse(text)
        const type: 'offer' | 'answer' = parsed.t === 'O' ? 'offer' : 'answer'
        const sdp = (parsed.s || '').replace(/\r\n/g, '\n').replace(/\n/g, '\r\n')
        return {
          type,
          sdp,
          candidates: Array.isArray(parsed.c) ? parsed.c : []
        }
      }
    }
  }

  if (trimmed.startsWith('LBS1:')) {
    const parts = trimmed.split(':')
    if (parts.length >= 3) {
      const role = parts[1] === 'O' ? 'offer' : parts[1] === 'A' ? 'answer' : null
      if (!role) {
        throw new Error('Kode peran (Offer/Answer) tidak valid pada data QR.')
      }

      let b64 = parts.slice(2).join(':').replace(/-/g, '+').replace(/_/g, '/')
      while (b64.length % 4 !== 0) {
        b64 += '='
      }

      const binary = atob(b64)
      const bytes = new Uint8Array(binary.length)
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i)
      }

      if (typeof DecompressionStream !== 'undefined') {
        const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
        const sdp = (await new Response(stream).text()).replace(/\r\n/g, '\n').replace(/\n/g, '\r\n')
        return { type: role, sdp, candidates: [] }
      }
    }
  }

  try {
    const parsed = JSON.parse(trimmed)
    if (parsed.sdp && (parsed.type === 'offer' || parsed.type === 'answer')) {
      return {
        type: parsed.type,
        sdp: parsed.sdp.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'),
        candidates: Array.isArray(parsed.candidates) ? parsed.candidates : []
      }
    }
  } catch {
  }

  throw new Error('Format kode QR tidak valid atau bukan dari LogBuku Sync.')
}

/**
 * Calculate deterministic 64-bit dual FNV-1a checksum of text content.
 * Pure JavaScript, zero-dependency, and 100% identical on all devices and
 * contexts (HTTPS, HTTP, localhost, LAN IP).
 */
export async function calculateChecksum(text: string): Promise<string> {
  let hash1 = 2166136261
  let hash2 = 1000000007
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i)
    hash1 = Math.imul(hash1 ^ char, 16777619)
    hash2 = Math.imul(hash2 ^ char, 1000003)
  }
  return (hash1 >>> 0).toString(16).padStart(8, '0') + (hash2 >>> 0).toString(16).padStart(8, '0')
}

/**
 * Sanitize a single book record to conform to LogBuku schema
 */
export function sanitizeBook(b: any): any {
  const clean: any = {
    title: String(b.title || '').trim(),
    author: String(b.author || '').trim(),
    publisher: String(b.publisher || '').trim(),
    totalPages: Math.max(0, Number(b.totalPages) || 0),
    pagesRead: Math.max(0, Number(b.pagesRead) || 0),
    isPinned: Boolean(b.isPinned),
    isTarget: Boolean(b.isTarget),
    createdAt: b.createdAt || new Date().toISOString(),
    updatedAt: b.updatedAt || new Date().toISOString()
  }

  if (b.id !== undefined && b.id !== null) {
    clean.id = b.id
  }

  if (Array.isArray(b.topic)) {
    clean.topic = b.topic.map((t: any) => String(t).trim()).filter(Boolean)
  } else if (typeof b.topic === 'string' && b.topic.trim()) {
    clean.topic = [b.topic.trim()]
  } else {
    clean.topic = []
  }

  if (b.coverImage && typeof b.coverImage === 'string') {
    clean.coverImage = b.coverImage
  }

  if (b.notes && typeof b.notes === 'string') {
    clean.notes = b.notes
  }

  if (b.completedAt) {
    clean.completedAt = String(b.completedAt)
  }

  if (Array.isArray(b.readHistory)) {
    let runningPages = 0
    clean.readHistory = b.readHistory.map((s: any, idx: number) => {
      const pagesAdded = Math.max(0, Number(s.pagesAdded) || 0)
      const startPage = runningPages
      const endPage = runningPages + pagesAdded
      runningPages += pagesAdded

      return {
        id: s.id || ('sess_' + (Date.now() + idx) + '_' + Math.random().toString(36).slice(2, 6)),
        date: s.date || new Date().toISOString(),
        pagesAdded,
        duration: s.duration !== undefined && s.duration !== null ? Number(s.duration) : null,
        startPage,
        endPage
      }
    })
    clean.pagesRead = runningPages
  } else {
    clean.readHistory = []
  }

  if (clean.totalPages > 0 && clean.pagesRead >= clean.totalPages) {
    if (!clean.completedAt) {
      const lastSessionDate = clean.readHistory.length > 0 
        ? clean.readHistory[clean.readHistory.length - 1].date 
        : null
      clean.completedAt = lastSessionDate || new Date().toISOString()
    }
  } else {
    delete clean.completedAt
  }

  return clean
}

/**
 * Validates books dataset received from peer
 */
export function validateBooksData(rawBooks: any): {
  valid: boolean
  error?: string
  cleanBooks: any[]
  stats: P2PDataPayload['stats']
} {
  if (!Array.isArray(rawBooks)) {
    return {
      valid: false,
      error: 'Data buku bukan dalam format array yang valid.',
      cleanBooks: [],
      stats: { totalBooks: 0, totalReadSessions: 0, totalPagesRead: 0, totalCompletedBooks: 0 }
    }
  }

  const cleanBooks: any[] = []
  let totalReadSessions = 0
  let totalPagesRead = 0
  let totalCompletedBooks = 0

  for (let i = 0; i < rawBooks.length; i++) {
    const item = rawBooks[i]
    if (!item || typeof item !== 'object') {
      continue
    }

    if (!item.title || !String(item.title).trim()) {
      continue
    }

    const clean = sanitizeBook(item)
    cleanBooks.push(clean)

    totalReadSessions += clean.readHistory?.length || 0
    totalPagesRead += clean.pagesRead || 0
    if (clean.completedAt || (clean.totalPages > 0 && clean.pagesRead >= clean.totalPages)) {
      totalCompletedBooks++
    }
  }

  return {
    valid: true,
    cleanBooks,
    stats: {
      totalBooks: cleanBooks.length,
      totalReadSessions,
      totalPagesRead,
      totalCompletedBooks
    }
  }
}
