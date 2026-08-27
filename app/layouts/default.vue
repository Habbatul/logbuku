<template>
    <div
        class="min-h-screen overflow-x-hidden bg-gray-50 pb-16 font-sans text-gray-900 selection:bg-gray-900 selection:text-white">
        <nav class="border-b border-gray-200 bg-white">
            <div class="mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
                <div class="flex h-16 min-w-0 items-center justify-between gap-3">

                    <div class="flex min-w-0 shrink items-center gap-2">
                        <div
                            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-900 text-white sm:h-9 sm:w-9">
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="sm:h-5 sm:w-5">
                                <path
                                    d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>

                        <span class="min-w-0 truncate text-[16px] font-bold tracking-tight text-gray-900 sm:text-lg">
                            LogBuku
                        </span>
                    </div>

                    <div class="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
                        <NuxtLink to="/"
                            class="rounded-md px-2.5 py-2 text-[13px] font-semibold transition-colors sm:px-4 sm:text-sm"
                            active-class="bg-gray-900 text-white"
                            inactive-class="text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                            Dashboard
                        </NuxtLink>

                        <NuxtLink to="/books"
                            class="rounded-md px-2.5 py-2 text-[13px] font-semibold transition-colors sm:px-4 sm:text-sm"
                            active-class="bg-gray-900 text-white"
                            inactive-class="text-gray-600 hover:bg-gray-100 hover:text-gray-900">
                            Koleksi
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </nav>

        <main class="relative min-w-0">
            <slot />
        </main>

        <Transition enter-active-class="transition duration-150 ease-out"
            enter-from-class="translate-y-2 scale-90 opacity-0" enter-to-class="translate-y-0 scale-100 opacity-100"
            leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 scale-100 opacity-100"
            leave-to-class="translate-y-2 scale-90 opacity-0">
            <button v-if="showFloatingNav" type="button" @click="navigationOpen = true" aria-label="Buka navigasi"
                class="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-[0_4px_16px_rgba(15,23,42,0.12)] transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:bottom-5 sm:right-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                </svg>
            </button>
        </Transition>

        <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="navigationOpen"
                class="fixed inset-0 z-[60] flex items-end justify-center bg-gray-950/20 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur-[2px] sm:items-center sm:p-4"
                @click.self="navigationOpen = false">
                <div class="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-2 shadow-[0_16px_40px_rgba(15,23,42,0.16)]"
                    role="dialog" aria-modal="true" aria-label="Navigasi halaman">
                    <div class="flex items-center justify-between px-3 py-2.5">
                        <span class="text-sm font-semibold text-gray-900">
                            Pindah halaman
                        </span>

                        <button type="button" @click="navigationOpen = false" aria-label="Tutup navigasi"
                            class="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-1">
                        <NuxtLink to="/" @click="navigationOpen = false"
                            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                            :class="route.path === '/'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-50'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>

                            <span>Dashboard</span>

                            <svg v-if="route.path === '/'" class="ml-auto" xmlns="http://www.w3.org/2000/svg" width="15"
                                height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>

                        <NuxtLink to="/books" @click="navigationOpen = false"
                            class="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                            :class="route.path === '/books'
                                    ? 'bg-gray-900 text-white'
                                    : 'text-gray-700 hover:bg-gray-50'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>

                            <span>Koleksi</span>

                            <svg v-if="route.path === '/books'" class="ml-auto" xmlns="http://www.w3.org/2000/svg"
                                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useHead, useRoute } from '#imports'

const route = useRoute()

const showFloatingNav = ref(false)
const navigationOpen = ref(false)

const handleScroll = () => {
    showFloatingNav.value = window.scrollY > 100
}

onMounted(() => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

useHead({
    titleTemplate: (titleChunk) => {
        return titleChunk
            ? `${titleChunk} - BookTracker`
            : 'BookTracker'
    },
    link: [
        {
            rel: 'preconnect',
            href: 'https://fonts.googleapis.com'
        },
        {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: ''
        },
        {
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
        }
    ],
    bodyAttrs: {
        class: 'antialiased'
    }
})
</script>

<style>
body {
    font-family: 'Inter', sans-serif;
}

html,
body {
    max-width: 100%;
    overflow-x: hidden;
}

::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

::-webkit-scrollbar-track {
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 0;
}

::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}
</style>