<template>
    <div
        class="min-h-screen overflow-x-hidden bg-gradient-to-b from-[#52788c] via-[#3a7f94] to-[#428194] pb-16 text-white relative selection:bg-sky-400/30 selection:text-white">

        <!-- Ambient Sunset Illumination (Pendaran cahaya matahari terbenam yang glowing & kaya warna) -->
        <div class="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
            <!-- Pendaran utama cahaya senja / golden hour di kanan atas -->
            <div
                class="absolute -top-[10%] right-[-5%] h-[850px] w-[850px] rounded-full bg-[radial-gradient(circle,rgba(254,215,170,0.45)_0%,rgba(249,115,22,0.25)_45%,transparent_70%)] blur-3xl">
            </div>

            <!-- Pendaran sekunder teal/cyan segar di kiri tengah untuk kontras kedalaman -->
            <div
                class="absolute top-[30%] -left-[10%] h-[750px] w-[750px] rounded-full bg-[radial-gradient(circle,rgba(186,230,253,0.30)_0%,rgba(56,189,248,0.15)_40%,transparent_65%)] blur-3xl">
            </div>

            <!-- Aksen lembut di bagian bawah -->
            <div
                class="absolute -bottom-[15%] right-[15%] h-[650px] w-[650px] rounded-full bg-[radial-gradient(circle,rgba(253,186,116,0.25)_0%,transparent_65%)] blur-2xl">
            </div>
        </div>

        <!-- Sticky Selective Liquid Glass Navigation -->
        <nav class="liquid-glass-nav sticky top-0 relative">
            <div class="mx-auto w-full max-w-6xl px-3.5 sm:px-6 lg:px-8">
                <div class="flex h-16 min-w-0 items-center justify-between gap-3">
                    <NuxtLink to="/" class="flex min-w-0 shrink items-center gap-2.5">
                        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/15 text-sky-300 shadow-sm sm:h-9 sm:w-9">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="sm:h-5 sm:w-5">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>

                        <div class="flex items-center gap-1.5 min-w-0">
                            <span class="min-w-0 truncate text-sm sm:text-base font-bold tracking-tight text-white">
                                LOGBUKU
                            </span>
                            <span class="h-1.5 w-1.5 rounded-full bg-sky-400 shrink-0 shadow-[0_0_8px_rgba(56,189,248,0.8)]"></span>
                        </div>
                    </NuxtLink>

                    <div class="flex shrink-0 items-center gap-1 sm:gap-1.5">
                        <NuxtLink to="/"
                            class="cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5"
                            active-class="bg-white/25 text-white shadow-sm"
                            inactive-class="text-white hover:bg-white/15">
                            Dashboard
                        </NuxtLink>

                        <NuxtLink to="/books"
                            class="cursor-pointer rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide transition-all duration-200 hover:-translate-y-0.5"
                            active-class="bg-white/25 text-white shadow-sm"
                            inactive-class="text-white hover:bg-white/15">
                            Koleksi
                        </NuxtLink>

                    </div>
                </div>
            </div>
        </nav>

        <main class="relative min-w-0 z-10">
            <slot />
        </main>

        <!-- Floating Quick Navigation Trigger -->
        <Transition enter-active-class="transition duration-150 ease-out"
            enter-from-class="translate-y-2 scale-90 opacity-0" enter-to-class="translate-y-0 scale-100 opacity-100"
            leave-active-class="transition duration-100 ease-in" leave-from-class="translate-y-0 scale-100 opacity-100"
            leave-to-class="translate-y-2 scale-90 opacity-0">
            <button v-if="showFloatingNav" type="button" @click="navigationOpen = true" aria-label="Buka navigasi"
                class="liquid-glass fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-white shadow-xl focus:outline-none transition-all duration-200 hover:scale-110 hover:bg-white/25 active:scale-95 sm:bottom-5 sm:right-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                </svg>
            </button>
        </Transition>

        <!-- Floating Navigation Modal (Liquid Glass Sheet - Borderless) -->
        <Transition enter-active-class="transition duration-150 ease-out" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="navigationOpen"
                class="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 px-3 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-4 backdrop-blur-md sm:items-center sm:p-4"
                @click.self="navigationOpen = false">
                <div class="liquid-glass-modal w-full max-w-sm rounded-3xl p-3 shadow-2xl"
                    role="dialog" aria-modal="true" aria-label="Navigasi halaman">
                    <div class="flex items-center justify-between px-3 py-2.5">
                        <span class="text-xs font-semibold uppercase tracking-wider text-white">
                            Navigasi Cepat
                        </span>

                        <button type="button" @click="navigationOpen = false" aria-label="Tutup navigasi"
                            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full text-white hover:bg-white/15 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-1 pt-2">
                        <NuxtLink to="/" @click="navigationOpen = false"
                            class="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide"
                            :class="route.path === '/'
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-white hover:bg-white/10'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                <polyline points="9 22 9 12 15 12 15 22" />
                            </svg>
                            <span>Dashboard</span>
                            <svg v-if="route.path === '/'" class="ml-auto text-sky-300" xmlns="http://www.w3.org/2000/svg" width="15"
                                height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>

                        <NuxtLink to="/books" @click="navigationOpen = false"
                            class="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide"
                            :class="route.path === '/books'
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-white hover:bg-white/10'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                            <span>Koleksi Buku</span>
                            <svg v-if="route.path === '/books'" class="ml-auto text-sky-300" xmlns="http://www.w3.org/2000/svg"
                                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>

                        <NuxtLink to="/tracking" @click="navigationOpen = false"
                            class="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide"
                            :class="route.path === '/tracking'
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-white hover:bg-white/10'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                            <span>Live Tracking</span>
                            <svg v-if="route.path === '/tracking'" class="ml-auto text-sky-300" xmlns="http://www.w3.org/2000/svg"
                                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>

                        <NuxtLink to="/authors" @click="navigationOpen = false"
                            class="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide"
                            :class="route.path === '/authors'
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-white hover:bg-white/10'
                                ">
                            <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M12 20h9" />
                                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                            </svg>
                            <span>Penulis</span>
                            <svg v-if="route.path === '/authors'" class="ml-auto text-sky-300" xmlns="http://www.w3.org/2000/svg"
                                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>

                        <NuxtLink to="/publishers" @click="navigationOpen = false"
                            class="flex cursor-pointer items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide"
                            :class="route.path === '/publishers'
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-white hover:bg-white/10'
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
                            <svg v-if="route.path === '/publishers'" class="ml-auto text-sky-300" xmlns="http://www.w3.org/2000/svg"
                                width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="m5 12 4 4L19 6" />
                            </svg>
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- Floating Active Timer Indicator (Static Pill - Borderless) -->
        <div v-if="route.path !== '/tracking' && activeTimersList.length > 0"
            class="fixed bottom-4 left-4 z-40 flex flex-col gap-2 max-w-[calc(100vw-2rem)] sm:max-w-xs md:max-w-sm pointer-events-none max-h-[60vh] overflow-y-auto custom-scrollbar p-1 -m-1">
            <TransitionGroup enter-active-class="transition duration-200 ease-out"
                enter-from-class="translate-y-4 opacity-0 scale-95" enter-to-class="translate-y-0 opacity-100 scale-100"
                leave-active-class="transition duration-150 ease-in" leave-from-class="translate-y-0 opacity-100 scale-100"
                leave-to-class="translate-y-4 opacity-0 scale-95">
                <NuxtLink v-for="item in activeTimersList" :key="item.bookId"
                    :to="`/tracking?id=${item.bookId}`"
                    class="liquid-glass-pill pointer-events-auto flex items-center justify-between gap-3 rounded-2xl p-3 text-white focus:outline-none cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:bg-white/20">
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="flex h-3 w-3 relative shrink-0">
                            <span v-if="item.isRunning"
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-3 w-3"
                                :class="item.isRunning ? 'bg-sky-400' : 'bg-slate-400'"></span>
                        </span>
                        <div class="min-w-0 text-left">
                            <p class="text-xs font-semibold truncate text-white max-w-[140px] sm:max-w-[190px]">
                                {{ item.title }}
                            </p>
                            <p class="text-[11px] text-white tabular-nums flex items-center gap-1.5 mt-0.5 font-semibold">
                                <span>{{ item.displayTime }}</span>
                                <span class="text-sky-300 font-bold">·</span>
                                <span :class="item.isRunning ? 'text-sky-300 font-bold' : 'text-white font-semibold'">
                                     {{ item.isRunning ? 'Berjalan' : 'Jeda' }}
                                </span>
                            </p>
                        </div>
                    </div>
                    <span class="shrink-0 rounded-lg bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">
                        Buka →
                    </span>
                </NuxtLink>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useHead, useRoute } from '#imports'

const route = useRoute()
const { books, loadBooks } = useBooks()
const timer = useReadingTimer()

interface ActiveTimerItem {
    bookId: string | number
    title: string
    isRunning: boolean
    isPaused: boolean
    elapsedSeconds: number
    displayTime: string
}

const activeTimersList = computed<ActiveTimerItem[]>(() => {
    const list: ActiveTimerItem[] = []
    const timerEntries = Object.entries(timer.timers.value)

    for (const [key, t] of timerEntries) {
        if (!t) continue
        if (t.isRunning || t.isPaused) {
            const book = books.value.find(b => String(b.id) === String(key))
            const elapsed = timer.getElapsedSecondsForBook(key)
            list.push({
                bookId: key,
                title: book?.title || `Buku #${key}`,
                isRunning: t.isRunning,
                isPaused: t.isPaused,
                elapsedSeconds: elapsed,
                displayTime: timer.formatTimer(elapsed)
            })
        }
    }

    return list.sort((a, b) => {
        if (a.isRunning && !b.isRunning) return -1
        if (!a.isRunning && b.isRunning) return 1
        return b.elapsedSeconds - a.elapsedSeconds
    })
})

const showFloatingNav = ref(false)
const navigationOpen = ref(false)

const handleScroll = () => {
    showFloatingNav.value = window.scrollY > 100
}

onMounted(async () => {
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    try {
        await loadBooks()
    } catch (e) {
        console.error('Failed to load books in layout', e)
    }
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
            href: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap'
        }
    ],
    bodyAttrs: {
        class: 'antialiased'
    }
})
</script>