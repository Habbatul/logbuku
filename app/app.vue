<template>
  <div>
    <VitePwaManifest />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly fallback-tag="span">
      <Transition enter-active-class="transition duration-300 ease-out"
        enter-from-class="translate-y-8 opacity-0 sm:translate-y-10" enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in" leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-8 opacity-0 sm:translate-y-10">
        <div v-if="showInstallPrompt" class="pointer-events-none fixed inset-x-0 bottom-4 z-[100] px-4 sm:bottom-6">
          <div
            class="liquid-glass-modal pointer-events-auto mx-auto flex w-full max-w-md items-center gap-3.5 rounded-2xl p-3.5 sm:p-4 shadow-2xl">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-sky-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
              </svg>
            </div>

            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                <h4 class="truncate text-sm sm:text-base font-semibold tracking-tight text-white">
                  Pasang LogBuku
                </h4>
              </div>

              <p class="truncate text-xs text-white mt-0.5 font-medium">
                Akses cepat & offline dari perangkat Anda.
              </p>
            </div>

            <div class="flex shrink-0 items-center gap-2">
              <button type="button" @click="dismissInstall" aria-label="Tutup notifikasi pasang aplikasi"
                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-white hover:bg-white/20 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <button type="button" @click="installPWA"
                class="btn-sunset-primary inline-flex cursor-pointer items-center gap-1.5 px-3.5 py-2 text-xs font-semibold uppercase tracking-wider focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                PASANG
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <template #fallback>
        <span aria-hidden="true"></span>
      </template>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const showInstallPrompt = ref(false)

const handleBeforeInstallPrompt = (event: Event) => {
  console.log('[PWA] beforeinstallprompt fired')

  event.preventDefault()

  deferredPrompt.value = event as BeforeInstallPromptEvent
  showInstallPrompt.value = true
}

const handleAppInstalled = () => {
  console.log('[PWA] appinstalled')

  deferredPrompt.value = null
  showInstallPrompt.value = false
}

const installPWA = async () => {
  const prompt = deferredPrompt.value

  if (!prompt) {
    console.warn('[PWA] Tidak ada install prompt')
    return
  }

  try {
    await prompt.prompt()

    const { outcome } = await prompt.userChoice

    console.log('[PWA] outcome:', outcome)
  } catch (error) {
    console.error('[PWA] install error:', error)
  } finally {
    deferredPrompt.value = null
    showInstallPrompt.value = false
  }
}

const dismissInstall = () => {
  showInstallPrompt.value = false
}

onMounted(() => {
  console.log('[PWA] mounted')

  window.addEventListener(
    'beforeinstallprompt',
    handleBeforeInstallPrompt
  )

  window.addEventListener(
    'appinstalled',
    handleAppInstalled
  )
})

onUnmounted(() => {
  window.removeEventListener(
    'beforeinstallprompt',
    handleBeforeInstallPrompt
  )

  window.removeEventListener(
    'appinstalled',
    handleAppInstalled
  )
})
</script>