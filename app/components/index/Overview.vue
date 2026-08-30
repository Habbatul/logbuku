<template>
    <section class="space-y-4">
        <div class="flex items-center justify-between">
            <div>
                <h2 class="text-lg sm:text-xl font-bold tracking-[-0.02em] text-[#0d0d0d] leading-snug uppercase"> OVERVIEW KOLEKSI </h2>
                <p class="mt-1 text-sm text-[#44403c]"> Ringkasan inventaris buku fisik dan aktivitas membaca arsip. </p>
            </div>
        </div>
        <div
            class="grid grid-cols-2 gap-px overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-[#0d0d0d] shadow-[3px_3px_0px_#0d0d0d] md:grid-cols-4">
            <div class="group relative min-w-0 bg-white p-4 sm:p-5">
                <div class="flex items-start justify-between gap-3">
                    <span class="min-w-0 truncate font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]"> [TOTAL KOLEKSI] </span>
                    <button @click="$emit('openCategoryModal')"
                        class="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] transition-all duration-100 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] active:translate-x-0.5 active:translate-y-0.5"
                        title="Detail Topik" aria-label="Lihat detail topik">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                            <path d="M22 12A10 10 0 0 0 12 2v10z" />
                        </svg>
                    </button>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl font-bold tracking-tight tabular-nums text-[#0d0d0d] sm:text-[28px]"> {{ totalBooks }}
                    </span>
                    <span class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]"> BUKU </span>
                </div>
            </div>
            <div class="min-w-0 bg-white p-4 sm:p-5">
                <div class="flex items-start justify-between">
                    <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]"> [SEDANG DIBACA] </span>
                    <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#0047ff] border border-[#0d0d0d]"></span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl font-bold tracking-tight tabular-nums text-[#0d0d0d] sm:text-[28px]"> {{
                        readingBooksCount }} </span>
                    <span class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]"> BUKU </span>
                </div>
            </div>
            <div class="min-w-0 bg-white p-4 sm:p-5">
                <div class="flex items-start justify-between">
                    <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]"> [BELUM DIBACA] </span>
                    <span class="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#e5dfd3] border border-[#0d0d0d]"></span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl font-bold tracking-tight tabular-nums text-[#0d0d0d] sm:text-[28px]"> {{
                        unreadBooksCount }} </span>
                    <span class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]"> BUKU </span>
                </div>
            </div>
            <div class="min-w-0 bg-white p-4 sm:p-5">
                <div class="flex items-start justify-between">
                    <span class="min-w-0 truncate font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]"> [RATA-RATA 7 HARI] </span>
                    <span class="ml-2 mt-1 h-2 w-2 shrink-0 rounded-full bg-[#00875a] border border-[#0d0d0d]"></span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl font-bold tracking-tight tabular-nums text-[#0d0d0d] sm:text-[28px]"> {{ avgPagesPerDay
                        }} </span>
                    <span class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]"> HAL/HARI </span>
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
