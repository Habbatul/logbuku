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
            class="pointer-events-auto mx-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-gray-200/80 bg-white/95 p-3.5 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
              </svg>
            </div>

            <div class="min-w-0 flex-1">
              <h4 class="text-[13px] font-bold tracking-tight text-gray-900">
                Install LogBuku
              </h4>

              <p class="truncate text-[11px] font-medium text-gray-500">
                Akses cepat dari perangkatmu.
              </p>
            </div>

            <div class="flex shrink-0 items-center gap-1.5">
              <button type="button" @click="dismissInstall" aria-label="Tutup banner install"
                class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>

              <button type="button" @click="installPWA"
                class="rounded-md bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/20">
                Install
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