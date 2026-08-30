<template>
    <header class="flex flex-col gap-5 border-b border-gray-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0 max-w-2xl">
            <div class="mb-2 flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                    Ringkasan Aktivitas
                </span>
            </div>

            <h1 class="text-[28px] font-bold tracking-[-0.035em] text-gray-950 sm:text-[32px]">
                Dashboard Analitik
            </h1>

            <p class="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                Pantau kebiasaan membaca, tren, dan pengeluaran.
            </p>
        </div>

        <div v-if="readingStreak > 0"
            class="flex shrink-0 items-center gap-3 rounded-xl border border-orange-200/80 bg-orange-50/70 px-3.5 py-3 sm:min-w-[210px]">
            <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path
                        d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
            </div>

            <div class="min-w-0">
                <p class="text-[11px] font-semibold uppercase tracking-wider text-orange-600">
                    Reading Streak
                </p>
                <p class="mt-0.5 text-sm font-bold tracking-tight text-orange-900">
                    {{ readingStreak }} hari berturut-turut
                </p>
            </div>
        </div>

        <div v-else
            class="flex shrink-0 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-3.5 py-3 sm:min-w-[210px]">
            <div
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm ring-1 ring-gray-200/70">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5A1.5 1.5 0 0 0 18.5 18H6.5A2.5 2.5 0 0 1 4 15.5z" />
                    <path d="M4 5.5v13A2.5 2.5 0 0 0 6.5 21H18" />
                </svg>
            </div>

            <div class="min-w-0">
                <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                    Reading Streak
                </p>
                <p class="mt-0.5 text-sm font-semibold leading-5 text-gray-700">
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
