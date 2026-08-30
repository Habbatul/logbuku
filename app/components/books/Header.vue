<template>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
            <div class="mb-2 flex items-center gap-2">
                <span class="h-2 w-2 rounded-full border border-[#0d0d0d] bg-[#ff4800]"></span>
                <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-[#57534e]">
                    [KATALOG ARSIP]
                </span>
            </div>

            <h1 class="text-2xl sm:text-3xl font-extrabold tracking-[-0.03em] text-[#0d0d0d] leading-none uppercase">
                Koleksi Buku
            </h1>

            <p class="mt-2 text-sm text-[#44403c]">
                Kelola inventaris arsip buku fisik, status koleksi, dan progres membaca.
            </p>
        </div>

        <button @click="$emit('add-book')" type="button"
            class="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#ff4800] hover:bg-[#262626] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
            </svg>
            TAMBAH BUKU
        </button>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
    (e: 'add-book'): void
}>()
</script>