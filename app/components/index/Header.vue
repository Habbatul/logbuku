<template>
    <header class="flex flex-col gap-5 border-b-2 border-[#0d0d0d] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0 max-w-2xl">
            <h1 class="text-2xl font-extrabold tracking-[-0.035em] text-[#0d0d0d] sm:text-[28px] lg:text-[32px] leading-[1.15] text-balance">
                DASHBOARD ANALITIK
            </h1>

            <p class="mt-1.5 max-w-xl text-sm leading-6 text-[#44403c]">
                Pantau kebiasaan membaca, tren volume halaman, dan arsip pengeluaran buku secara lokal.
            </p>
        </div>

        <div v-if="readingStreak > 0"
            class="flex shrink-0 items-center gap-3 rounded-lg border-2 border-[#0d0d0d] bg-[#fff0eb] px-4 py-3 shadow-[3px_3px_0px_#0d0d0d] sm:min-w-[220px]">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#ff4800] text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
            </div>

            <div class="min-w-0">
                <p class="font-mono text-xs font-bold uppercase tracking-wider text-[#ff4800]">
                    [STREAK: AKTIF]
                </p>
                <p class="mt-0.5 text-xs font-bold tracking-tight tabular-nums text-[#0d0d0d]">
                    {{ readingStreak }} HARI BERTURUT-TURUT
                </p>
            </div>
        </div>

        <div v-else
            class="flex shrink-0 items-center gap-3 rounded-lg border-2 border-[#0d0d0d] bg-white px-4 py-3 shadow-[3px_3px_0px_#0d0d0d] sm:min-w-[220px]">
            <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d]">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5A1.5 1.5 0 0 0 18.5 18H6.5A2.5 2.5 0 0 1 4 15.5z" />
                    <path d="M4 5.5v13A2.5 2.5 0 0 0 6.5 21H18" />
                </svg>
            </div>

            <div class="min-w-0">
                <p class="font-mono text-xs font-bold uppercase tracking-wider text-[#57534e]">
                    [STREAK: IDLE]
                </p>
                <p class="mt-0.5 text-sm font-bold uppercase text-[#0d0d0d]">
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
