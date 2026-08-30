<template>
    <div
        class="min-h-screen overflow-x-hidden bg-[#faf8f5] pb-16 text-[#0d0d0d] selection:bg-[#0d0d0d] selection:text-white">
        <nav class="border-b-2 border-[#0d0d0d] bg-white">
            <div class="mx-auto w-full max-w-6xl px-3 sm:px-6 lg:px-8">
                <div class="flex h-16 min-w-0 items-center justify-between gap-3">

                    <div class="flex min-w-0 shrink items-center gap-2.5">
                        <div
                            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#0d0d0d] text-white shadow-[2px_2px_0px_#0d0d0d] sm:h-9 sm:w-9">
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="sm:h-5 sm:w-5">
                                <path
                                    d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>

                        <span class="min-w-0 truncate text-xs font-extrabold tracking-wide text-[#0d0d0d] sm:text-base">
                            LOGBUKU
                        </span>
                    </div>

                    <div class="flex shrink-0 items-center gap-1 sm:gap-2">
                        <NuxtLink to="/"
                            class="cursor-pointer rounded-[4px] px-2.5 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-all sm:px-3 sm:text-[13px]"
                            active-class="bg-[#0d0d0d] text-white border border-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d]"
                            inactive-class="text-[#0d0d0d] hover:bg-[#f3ede2] border border-transparent">
                            Dashboard
                        </NuxtLink>

                        <NuxtLink to="/books"
                            class="cursor-pointer rounded-[4px] px-2.5 py-1.5 text-[12px] font-bold uppercase tracking-wider transition-all sm:px-3 sm:text-[13px]"
                            active-class="bg-[#0d0d0d] text-white border border-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d]"
                            inactive-class="text-[#0d0d0d] hover:bg-[#f3ede2] border border-transparent">
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
                class="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-2 border-[#0d0d0d] bg-white text-[#0d0d0d] shadow-[3px_3px_0px_#0d0d0d] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0d0d0d] focus:outline-none focus:ring-2 focus:ring-[#0d0d0d]/20 sm:bottom-5 sm:right-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                class="fixed inset-0 z-[60] flex items-end justify-center bg-[#0d0d0d]/40 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur-xs sm:items-center sm:p-4"
                @click.self="navigationOpen = false">
                <div class="w-full max-w-sm rounded-lg border-2 border-[#0d0d0d] bg-white p-2 shadow-[6px_6px_0px_#0d0d0d]"
                    role="dialog" aria-modal="true" aria-label="Navigasi halaman">
                    <div class="flex items-center justify-between px-3 py-2.5 border-b border-[#0d0d0d]/10">
                        <span class="text-xs font-bold uppercase tracking-wider text-[#0d0d0d]">
                            [PINDAH HALAMAN]
                        </span>

                        <button type="button" @click="navigationOpen = false" aria-label="Tutup navigasi"
                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] border border-transparent text-[#0d0d0d] transition-colors hover:border-[#0d0d0d] hover:bg-[#f3ede2] focus:outline-none">
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
                            class="flex cursor-pointer items-center gap-3 rounded-[4px] px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                            :class="route.path === '/'
                                    ? 'bg-[#0d0d0d] text-white border border-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d]'
                                    : 'text-[#0d0d0d] hover:bg-[#f3ede2]'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>

                            <span>Dashboard</span>

                            <svg v-if="route.path === '/'" class="ml-auto" xmlns="http://www.w3.org/2000/svg" width="15"
                                height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>

                        <NuxtLink to="/books" @click="navigationOpen = false"
                            class="flex cursor-pointer items-center gap-3 rounded-[4px] px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                            :class="route.path === '/books'
                                    ? 'bg-[#0d0d0d] text-white border border-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d]'
                                    : 'text-[#0d0d0d] hover:bg-[#f3ede2]'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path
                                    d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>

                            <span>Koleksi</span>

                            <svg v-if="route.path === '/books'" class="ml-auto" xmlns="http://www.w3.org/2000/svg"
                                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>

                        <NuxtLink to="/authors" @click="navigationOpen = false"
                            class="flex cursor-pointer items-center gap-3 rounded-[4px] px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                            :class="route.path === '/authors'
                                    ? 'bg-[#0d0d0d] text-white border border-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d]'
                                    : 'text-[#0d0d0d] hover:bg-[#f3ede2]'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>

                            <span>Penulis</span>

                            <svg v-if="route.path === '/authors'" class="ml-auto" xmlns="http://www.w3.org/2000/svg"
                                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>

                        <NuxtLink to="/publishers" @click="navigationOpen = false"
                            class="flex cursor-pointer items-center gap-3 rounded-[4px] px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                            :class="route.path === '/publishers'
                                    ? 'bg-[#0d0d0d] text-white border border-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d]'
                                    : 'text-[#0d0d0d] hover:bg-[#f3ede2]'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                                <path d="M9 22v-4h6v4" />
                                <path d="M8 6h.01" />
                                <path d="M16 6h.01" />
                                <path d="M12 6h.01" />
                                <path d="M12 10h.01" />
                                <path d="M12 14h.01" />
                                <path d="M16 10h.01" />
                                <path d="M16 14h.01" />
                                <path d="M8 10h.01" />
                                <path d="M8 14h.01" />
                            </svg>

                            <span>Penerbit</span>

                            <svg v-if="route.path === '/publishers'" class="ml-auto" xmlns="http://www.w3.org/2000/svg"
                                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
            ? `${titleChunk} - LogBuku`
            : 'LogBuku'
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
            href: 'https://fonts.googleapis.com/css2?family=Azeret+Mono:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap'
        }
    ],
    bodyAttrs: {
        class: 'antialiased'
    }
})
</script>

<style>
body {
    font-family: 'JetBrains Mono', monospace;
}

h1, h2, h3, h4, h5, h6, .font-display {
    font-family: 'Azeret Mono', monospace;
}

.tabular-nums, .font-mono, .font-data {
    font-family: 'JetBrains Mono', monospace;
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
    background: #e5dfd3;
    border-radius: 0;
}

::-webkit-scrollbar-thumb:hover {
    background: #57534e;
}
</style>