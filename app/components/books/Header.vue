<template>
    <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-6">
        <div class="min-w-0">
            <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                Koleksi Buku
            </h1>

            <p class="mt-1 max-w-xl text-xs sm:text-sm leading-relaxed text-white">
                Kelola inventaris arsip buku fisik, status koleksi, dan progres membaca.
            </p>
        </div>

        <div class="flex w-full gap-3 sm:w-auto">
            <button @click="$emit('add-book')" type="button"
                class="btn-sunset-primary inline-flex min-w-0 flex-1 shrink-0 items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold sm:w-auto sm:flex-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="shrink-0">
                    <path d="M5 12h14" />
                    <path d="M12 5v14" />
                </svg>
                <span class="truncate">Tambah Buku</span>
            </button>

            <NuxtLink to="/tracking"
                class="btn-sunset-secondary inline-flex min-w-0 flex-1 shrink-0 items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium sm:w-auto sm:flex-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                <span class="truncate">Live Tracking</span>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup lang="ts">
defineEmits<{
    (e: 'add-book'): void
}>()
</script>