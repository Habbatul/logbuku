<template>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
            <div class="mb-2 flex items-center gap-2">
                <span class="h-2 w-2 rounded-full border border-[#0d0d0d] bg-[#ff4800]"></span>
                <span class="font-mono text-[11px] font-bold uppercase tracking-wider text-[#57534e]">
                    [KATALOG ARSIP]
                </span>
            </div>

            <h1 class="text-2xl font-extrabold uppercase leading-none tracking-[-0.03em] text-[#0d0d0d] sm:text-3xl">
                Koleksi Buku
            </h1>

            <p class="mt-1.5 max-w-xl text-[0.8rem] leading-relaxed text-[#44403c]">
                Kelola inventaris arsip buku fisik, status koleksi, dan progres membaca.
            </p>
        </div>

        <div class="flex w-full gap-2 sm:w-auto">
            <button @click="$emit('add-book')" type="button"
                class="inline-flex min-w-0 flex-1 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-3 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#c27c7c] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#262626] hover:shadow-[3px_3px_0px_#ff4800] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] sm:w-auto sm:flex-none sm:px-4 sm:text-xs">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                    class="shrink-0">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                </svg>
                <span class="truncate">TAMBAH BUKU</span>
            </button>

            <NuxtLink to="/tracking"
                class="inline-flex min-w-0 flex-1 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[4px] border-2 border-[#1c1b19] bg-[#f3d079]/80 px-3 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-[#2f2d2a] shadow-[2px_2px_0px_#1c1b19] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-[#f5f1e8] hover:shadow-[3px_3px_0px_#1c1b19] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_#1c1b19] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a847b] sm:w-auto sm:flex-none sm:px-4 sm:text-xs">
                <span class="truncate">TIME TRACKING</span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
    (e: 'add-book'): void
}>()
</script>