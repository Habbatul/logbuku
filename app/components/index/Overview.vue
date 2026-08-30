<template>
    <section class="space-y-4">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-base font-semibold tracking-tight text-gray-950"> Overview Koleksi </h2>
                <p class="mt-1 text-sm text-gray-500"> Ringkasan koleksi buku dan aktivitas membaca. </p>
            </div>
        </div>
        <div
            class="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200/80 bg-gray-200/80 md:grid-cols-4">
            <div class="group relative min-w-0 bg-white p-4 sm:p-5">
                <div class="flex items-start justify-between gap-3">
                    <span class="min-w-0 truncate text-[13px] font-medium text-gray-500"> Total Koleksi </span>
                    <button @click="$emit('openCategoryModal')"
                        class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-blue-500 bg-blue-500/90 text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:border-blue-700 hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                        title="Detail Topik" aria-label="Lihat detail topik">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                            <path d="M22 12A10 10 0 0 0 12 2v10z" />
                        </svg>
                    </button>
                </div>
                <div class="mt-1 flex items-baseline gap-1.5">
                    <span class="text-2xl font-bold tracking-[-0.03em] text-gray-950 sm:text-3xl"> {{ totalBooks }}
                    </span>
                    <span class="text-xs font-medium text-gray-400"> Buku </span>
                </div>
            </div>
            <div class="min-w-0 bg-white p-4 sm:p-5">
                <div class="flex items-start justify-between">
                    <span class="text-[13px] font-medium text-gray-500"> Sedang Dibaca </span>
                    <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span>
                </div>
                <div class="mt-3 flex items-baseline gap-1.5">
                    <span class="text-2xl font-bold tracking-[-0.03em] text-blue-600 sm:text-3xl"> {{
                        readingBooksCount }} </span>
                    <span class="text-xs font-medium text-blue-400"> Buku </span>
                </div>
            </div>
            <div class="min-w-0 bg-white p-4 sm:p-5">
                <div class="flex items-start justify-between">
                    <span class="text-[13px] font-medium text-gray-500"> Belum Dibaca </span>
                    <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"></span>
                </div>
                <div class="mt-3 flex items-baseline gap-1.5">
                    <span class="text-2xl font-bold tracking-[-0.03em] text-gray-500 sm:text-3xl"> {{
                        unreadBooksCount }} </span>
                    <span class="text-xs font-medium text-gray-400"> Buku </span>
                </div>
            </div>
            <div class="min-w-0 bg-white p-4 sm:p-5">
                <div class="flex items-start justify-between">
                    <span class="min-w-0 truncate text-[13px] font-medium text-gray-500"> Rata-rata 7 Hari </span>
                    <span class="ml-2 mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                </div>
                <div class="mt-3 flex items-baseline gap-1.5">
                    <span class="text-2xl font-bold tracking-[-0.03em] text-gray-950 sm:text-3xl"> {{ avgPagesPerDay
                        }} </span>
                    <span class="text-xs font-medium text-gray-400"> hal/hari </span>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    totalBooks: number
    readingBooksCount: number
    unreadBooksCount: number
    avgPagesPerDay: number
}>()

defineEmits<{
    (e: 'openCategoryModal'): void
}>()
</script>
