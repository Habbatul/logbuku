<template>
    <header class="flex flex-col gap-4 sm:gap-6 pb-6 sm:pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0 max-w-2xl space-y-1">
            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Dashboard Analitik
            </h1>

            <p class="text-xs sm:text-sm leading-relaxed text-white">
                Pantau kebiasaan membaca, tren volume halaman, dan arsip pengeluaran buku secara lokal.
            </p>
        </div>

        <div v-if="readingStreak > 0"
            class="surface-card flex w-full sm:w-auto shrink-0 items-center gap-3.5 rounded-2xl border border-amber-300/40 p-3.5 sm:px-4 sm:py-3 select-none shadow-lg sm:min-w-[230px]">
            <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-[0_0_16px_rgba(245,158,11,0.4)]">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
            </div>

            <div class="min-w-0">
                <div class="flex items-center gap-1.5">
                    <span class="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span class="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                        Streak Aktif
                    </span>
                </div>
                <p class="mt-0.5 text-sm font-extrabold tracking-tight tabular-nums text-white break-words">
                    {{ readingStreak }} Hari Berturut-turut
                </p>
            </div>
        </div>

        <div v-else
            class="surface-card flex w-full sm:w-auto shrink-0 items-center gap-3.5 rounded-2xl border border-white/20 p-3.5 sm:px-4 sm:py-3 sm:min-w-[220px]">
            <div
                class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5A1.5 1.5 0 0 0 18.5 18H6.5A2.5 2.5 0 0 1 4 15.5z" />
                    <path d="M4 5.5v13A2.5 2.5 0 0 0 6.5 21H18" />
                </svg>
            </div>

            <div class="min-w-0">
                <span class="text-[11px] font-semibold uppercase tracking-wider text-white">
                    Streak Belum Aktif
                </span>
                <p class="text-xs sm:text-sm font-medium text-white break-words">
                    Mulai baca hari ini
                </p>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
defineProps<{
    readingStreak: number
}>()
</script>
