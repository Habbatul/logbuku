<template>
  <div class="flex flex-col items-center w-full">
    <div class="relative group p-3.5 sm:p-5 rounded-3xl bg-slate-900/50 border border-white/20 backdrop-blur-md shadow-2xl max-w-full">
      <div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-sky-400/80 rounded-tl pointer-events-none"></div>
      <div class="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-sky-400/80 rounded-tr pointer-events-none"></div>
      <div class="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-sky-400/80 rounded-bl pointer-events-none"></div>
      <div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-sky-400/80 rounded-br pointer-events-none"></div>

      <div
        class="relative overflow-hidden rounded-2xl p-2.5 sm:p-4 shadow-inner flex items-center justify-center transition-colors duration-200"
        :class="isLoading ? 'bg-slate-950 border border-sky-500/30' : 'bg-white cursor-pointer'"
        @click="!isLoading && (showZoom = true)"
        :title="isLoading ? undefined : 'Klik untuk memperbesar QR'"
      >
        <div
          v-if="!isLoading && svgContent"
          class="w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:block"
          v-html="svgContent"
        ></div>

        <div
          v-else
          class="relative w-52 h-52 sm:w-64 sm:h-64 flex flex-col items-center justify-between p-4 overflow-hidden rounded-xl bg-slate-950 text-white select-none"
        >
          <div class="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:14px_14px] opacity-15 pointer-events-none"></div>

          <div class="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-sky-400 to-transparent shadow-[0_0_12px_rgba(56,189,248,0.9)] animate-pulse-scan pointer-events-none"></div>

          <div class="relative z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-[10px] sm:text-xs font-semibold text-sky-200">
            <span class="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping"></span>
            <span>Membuat Sinyal P2P</span>
          </div>

          <div class="relative flex items-center justify-center my-auto">
            <div class="absolute w-28 h-28 rounded-full border border-sky-400/30 animate-ping" style="animation-duration: 2.4s;"></div>
            <div class="absolute w-20 h-20 rounded-full border border-cyan-400/40 animate-ping" style="animation-duration: 1.8s; animation-delay: 0.5s;"></div>

            <div class="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/25 border border-sky-400/50 text-sky-300 shadow-[0_0_24px_rgba(56,189,248,0.4)]">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h.01" />
                <path d="M2 8.82a15 15 0 0 1 20 0" />
                <path d="M5 12.859a10 10 0 0 1 14 0" />
                <path d="M8.5 16.429a5 5 0 0 1 7 0" />
              </svg>
            </div>
          </div>

          <div class="relative z-10 w-full text-center">
            <div class="flex items-center justify-center gap-1.5 text-xs font-bold text-white tracking-tight">
              <svg class="animate-spin h-3.5 w-3.5 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span class="truncate">{{ loadingTitle }}</span>
            </div>
            <p class="text-[10px] sm:text-[11px] text-white/70 mt-1 truncate px-2 font-normal">
              {{ loadingSubtitle }}
            </p>

            <div class="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2.5 p-0.5">
              <div class="h-full w-2/3 bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!isLoading && svgContent" class="mt-4 flex flex-wrap items-center justify-center gap-2 max-w-sm w-full px-2">
      <button
        type="button"
        @click="copyPayload"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all shadow-sm"
      >
        <svg
          v-if="copied"
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-emerald-300"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-sky-300"
        >
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
        <span>{{ copied ? 'Tersalin ke Clipboard!' : 'Salin Kode Manual' }}</span>
      </button>

      <button
        type="button"
        @click="showZoom = true"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-sky-300"
        >
          <polyline points="15 3 21 3 21 9" />
          <polyline points="9 21 3 21 3 15" />
          <line x1="21" y1="3" x2="14" y2="10" />
          <line x1="3" y1="21" x2="10" y2="14" />
        </svg>
        <span>Perbesar</span>
      </button>

      <button
        type="button"
        @click="downloadQrSvg"
        class="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all shadow-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-sky-300"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span>Unduh SVG</span>
      </button>
    </div>

    <Teleport to="body">
      <div
        v-if="showZoom"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        @click="showZoom = false"
      >
        <div
          class="relative max-w-sm sm:max-w-md w-full p-5 sm:p-6 rounded-3xl bg-slate-900 border border-white/20 shadow-2xl flex flex-col items-center"
          @click.stop
        >
          <div class="w-full flex items-center justify-between mb-4">
            <h4 class="text-sm font-bold text-white tracking-tight">QR Code Layar Penuh</h4>
            <button
              type="button"
              @click="showZoom = false"
              class="h-8 w-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              ✕
            </button>
          </div>

          <div class="bg-white p-4 sm:p-6 rounded-2xl w-full aspect-square flex items-center justify-center shadow-lg [&>svg]:w-full [&>svg]:h-full">
            <div v-html="svgContent" class="w-full h-full flex items-center justify-center"></div>
          </div>

          <p class="mt-4 text-center text-xs text-white/70">
            Arahkan kamera perangkat lain ke kode ini untuk memindai sinyal WebRTC.
          </p>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { renderSVG } from 'uqr'

const props = withDefaults(
  defineProps<{
    value?: string | null
    title?: string
    loading?: boolean
    loadingTitle?: string
    loadingSubtitle?: string
  }>(),
  {
    value: null,
    loading: false,
    loadingTitle: 'Menyiapkan QR Code...',
    loadingSubtitle: 'Mengumpulkan kandidat jaringan ICE...'
  }
)

const copied = ref(false)
const showZoom = ref(false)

const isLoading = computed(() => {
  return props.loading || !props.value
})

const svgContent = computed(() => {
  if (!props.value) return ''
  try {
    return renderSVG(props.value, {
      border: 4,
      ecc: 'L',
      pixelSize: 8,
      whiteColor: '#ffffff',
      blackColor: '#0b132b'
    })
  } catch (err) {
    console.error('[QrCodeDisplay] Error rendering SVG:', err)
    return ''
  }
})

const copyPayload = async () => {
  if (!props.value) return
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(props.value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = props.value
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch (err) {
    console.warn('[QrCodeDisplay] Failed to copy to clipboard:', err)
  }
}

const downloadQrSvg = () => {
  if (!svgContent.value) return
  const blob = new Blob([svgContent.value], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `logbuku-sync-qr-${Date.now()}.svg`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
