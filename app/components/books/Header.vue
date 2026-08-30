<template>
    <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div class="min-w-0">
            <div class="mb-2 flex items-center gap-2">
                <span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                    Library
                </span>
            </div>

            <h1 class="text-[28px] font-bold tracking-[-0.035em] text-gray-950 sm:text-[32px]">
                Koleksi Buku
            </h1>

            <p class="mt-1.5 max-w-[65ch] text-sm leading-6 text-gray-500">
                Kelola koleksi buku dan progres bacaan.
            </p>
        </div>

        <button @click="$emit('add-book')" type="button"
            class="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/15 sm:w-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
            </svg>
            Tambah Buku
        </button>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
    (e: 'add-book'): void
}>()
</script>