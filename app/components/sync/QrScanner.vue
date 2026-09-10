<template>
  <div class="flex flex-col items-center w-full max-w-sm sm:max-w-md mx-auto">
    <div class="relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-950 border border-white/20 shadow-2xl flex items-center justify-center">
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="w-full h-full object-cover"
        :class="{ 'opacity-0': !isStreaming || cameraError }"
      ></video>

      <canvas ref="canvasRef" class="hidden"></canvas>

      <div v-if="isStreaming && !cameraError" class="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
        <div class="absolute inset-0 bg-black/25"></div>

        <div class="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl border border-white/30 flex items-center justify-center">
          <div class="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.9)] animate-pulse-scan"></div>

          <div class="absolute -top-1 -left-1 w-6 h-6 border-t-3 border-l-3 border-sky-400 rounded-tl shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
          <div class="absolute -top-1 -right-1 w-6 h-6 border-t-3 border-r-3 border-sky-400 rounded-tr shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
          <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-3 border-l-3 border-sky-400 rounded-bl shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
          <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-3 border-r-3 border-sky-400 rounded-br shadow-[0_0_8px_rgba(56,189,248,0.8)]"></div>
        </div>
      </div>

      <div
        v-if="isLoadingCamera && !cameraError"
        class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950/90 text-white p-4 text-center"
      >
        <svg class="animate-spin h-8 w-8 text-sky-400" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        <span class="text-xs sm:text-sm font-semibold text-white/90">Mengakses kamera...</span>
      </div>

      <div
        v-if="cameraError"
        class="absolute inset-0 flex flex-col items-center justify-center p-6 bg-slate-900/95 text-center text-white gap-3 z-20"
      >
        <div class="w-12 h-12 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34" />
            <circle cx="12" cy="13" r="3" />
          </svg>
        </div>
        <div>
          <h4 class="text-sm font-bold text-white">Kamera Tidak Tersedia</h4>
          <p class="mt-1 text-xs text-white/75 max-w-xs">
            {{ cameraErrorMessage || 'Izin kamera ditolak atau perangkat tidak memiliki kamera aktif.' }}
          </p>
        </div>

        <div class="flex flex-col gap-2 w-full max-w-xs mt-2">
          <button
            type="button"
            @click="startCamera"
            class="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-xs font-bold text-white transition-all shadow-md"
          >
            Coba Aktifkan Kembali
          </button>
          <button
            type="button"
            @click="triggerImageUpload"
            class="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-all border border-white/20"
          >
            Pilih Foto QR dari Galeri
          </button>
        </div>
      </div>
    </div>

    <div class="mt-4 flex flex-wrap items-center justify-center gap-2 w-full">
      <button
        v-if="hasMultipleCameras && isStreaming"
        type="button"
        @click="toggleCameraFacing"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-300">
          <path d="M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
          <path d="M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" />
          <polyline points="15 9 18 6 21 9" />
          <polyline points="9 15 6 18 3 15" />
        </svg>
        <span>Balik Kamera</span>
      </button>

      <button
        v-if="hasTorchSupport && isStreaming"
        type="button"
        @click="toggleTorch"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" :class="isTorchOn ? 'text-amber-400' : 'text-sky-300'">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
        <span>{{ isTorchOn ? 'Lampu: Nyala' : 'Lampu Senter' }}</span>
      </button>

      <button
        type="button"
        @click="triggerImageUpload"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-300">
          <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
          <circle cx="9" cy="9" r="2" />
          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
        </svg>
        <span>Unggah Foto QR</span>
      </button>

      <button
        type="button"
        @click="showManualPaste = !showManualPaste"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-sky-300">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
          <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
        </svg>
        <span>{{ showManualPaste ? 'Tutup Input Teks' : 'Tempel Teks Manual' }}</span>
      </button>
    </div>

    <input
      type="file"
      ref="fileInputRef"
      accept="image/*"
      class="hidden"
      @change="handleImageFileSelected"
    />

    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="showManualPaste"
        class="w-full mt-3 p-4 rounded-2xl bg-slate-900/80 border border-white/16 backdrop-blur-md shadow-lg"
      >
        <label class="block text-xs font-bold text-white mb-1.5">
          Tempel Kode Sinyal (SDP):
        </label>
        <textarea
          v-model="manualCode"
          rows="3"
          placeholder="Tempel kode sinyal di sini (misal: LBS1:O:...)"
          class="w-full p-2.5 rounded-xl bg-white/8 border border-white/20 text-xs font-mono text-white placeholder:text-white/50 focus:outline-none focus:border-sky-400"
        ></textarea>
        <div class="mt-2.5 flex justify-end gap-2">
          <button
            type="button"
            @click="submitManualCode"
            :disabled="!manualCode.trim()"
            class="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white transition-all shadow-md"
          >
            Gunakan Kode
          </button>
        </div>
      </div>
    </Transition>

    <p v-if="hintText" class="mt-3 text-center text-xs text-white/70">
      {{ hintText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import jsQR from 'jsqr'

const props = withDefaults(
  defineProps<{
    hintText?: string
  }>(),
  {
    hintText: 'Arahkan kamera ke QR Code di perangkat pasangan Anda.'
  }
)

const emit = defineEmits<{
  (e: 'scanned', result: string): void
  (e: 'error', message: string): void
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const isStreaming = ref(false)
const isLoadingCamera = ref(true)
const cameraError = ref(false)
const cameraErrorMessage = ref('')
const facingMode = ref<'environment' | 'user'>('environment')
const hasMultipleCameras = ref(false)
const hasTorchSupport = ref(false)
const isTorchOn = ref(false)

const showManualPaste = ref(false)
const manualCode = ref('')

let stream: MediaStream | null = null
let animationFrameId: number | null = null
let isScanning = true

const startCamera = async () => {
  stopCamera()
  cameraError.value = false
  isLoadingCamera.value = true

  try {
    if (!navigator?.mediaDevices?.getUserMedia) {
      throw new Error('Browser ini tidak mendukung akses kamera getUserMedia.')
    }

    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter((d) => d.kind === 'videoinput')
      hasMultipleCameras.value = videoDevices.length > 1
    } catch {}

    const constraints: MediaStreamConstraints = {
      video: {
        facingMode: facingMode.value,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      },
      audio: false
    }

    stream = await navigator.mediaDevices.getUserMedia(constraints)

    if (videoRef.value) {
      videoRef.value.srcObject = stream
      await videoRef.value.play()
      isStreaming.value = true
      isLoadingCamera.value = false

      const track = stream.getVideoTracks()[0]
      if (track) {
        const capabilities: any = track.getCapabilities?.() || {}
        hasTorchSupport.value = Boolean(capabilities.torch)
      }

      isScanning = true
      startScanningLoop()
    }
  } catch (err: any) {
    console.error('[QrScanner] Camera start error:', err)
    cameraError.value = true
    isLoadingCamera.value = false
    cameraErrorMessage.value = err?.name === 'NotAllowedError'
      ? 'Izin akses kamera ditolak. Berikan izin di browser Anda atau gunakan opsi unggah foto/manual.'
      : (err?.message || 'Tidak dapat mengaktifkan kamera pada perangkat ini.')
    emit('error', cameraErrorMessage.value)
  }
}

const stopCamera = () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  isScanning = false

  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }

  if (videoRef.value) {
    videoRef.value.srcObject = null
  }

  isStreaming.value = false
  isTorchOn.value = false
}

const toggleCameraFacing = async () => {
  facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
  await startCamera()
}

const toggleTorch = async () => {
  if (!stream) return
  const track = stream.getVideoTracks()[0]
  if (!track) return

  try {
    const nextState = !isTorchOn.value
    await (track as any).applyConstraints({
      advanced: [{ torch: nextState }]
    })
    isTorchOn.value = nextState
  } catch (err) {
    console.warn('[QrScanner] Torch error:', err)
  }
}

const startScanningLoop = () => {
  const scan = async () => {
    if (!isScanning || !isStreaming.value || !videoRef.value || !canvasRef.value) {
      return
    }

    const video = videoRef.value
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.value
      const ctx = canvas.getContext('2d', { willReadFrequently: true })

      if (ctx) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        let detectedData: string | null = null

        if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
          try {
            const detector = new (window as any).BarcodeDetector({ formats: ['qr_code'] })
            const barcodes = await detector.detect(canvas)
            if (barcodes && barcodes.length > 0 && barcodes[0].rawValue) {
              detectedData = barcodes[0].rawValue
            }
          } catch {
          }
        }

        if (!detectedData) {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth'
          })
          if (qrCode && qrCode.data) {
            detectedData = qrCode.data
          }
        }

        if (detectedData) {
          handleSuccessScan(detectedData)
          return
        }
      }
    }

    if (isScanning) {
      animationFrameId = requestAnimationFrame(scan)
    }
  }

  animationFrameId = requestAnimationFrame(scan)
}

const handleSuccessScan = (resultString: string) => {
  isScanning = false
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    try {
      navigator.vibrate(120)
    } catch {}
  }
  emit('scanned', resultString)
}

const triggerImageUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
    fileInputRef.value.click()
  }
}

const handleImageFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target?.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e: any) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'attemptBoth'
      })

      if (qrCode && qrCode.data) {
        handleSuccessScan(qrCode.data)
      } else {
        alert('Tidak dapat mendeteksi QR Code dari gambar yang dipilih. Pastikan gambar jelas dan tidak buram.')
      }
    }
    img.src = e.target.result
  }
  reader.readAsDataURL(file)
}

const submitManualCode = () => {
  if (!manualCode.value.trim()) return
  handleSuccessScan(manualCode.value.trim())
}

onMounted(() => {
  nextTick(() => {
    startCamera()
  })
})

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
@keyframes pulseScan {
  0%, 100% {
    top: 10%;
    opacity: 0.2;
  }
  50% {
    top: 85%;
    opacity: 1;
  }
}

.animate-pulse-scan {
  animation: pulseScan 2.4s ease-in-out infinite;
}
</style>
