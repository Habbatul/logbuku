<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>
        <div
            class="liquid-glass-modal relative w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 shadow-2xl">
            <div class="flex justify-between items-center p-5 bg-white/[0.05]">
                <h2 class="text-base font-semibold tracking-tight text-white leading-tight">Buku per Topik</h2>
                <button @click="$emit('close')" aria-label="Tutup modal"
                    class="text-white hover:text-white p-1.5 rounded-lg hover:bg-white/15 transition-colors focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-5 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
                <div v-if="booksPerCategory.length === 0" class="text-center text-xs text-white font-medium py-6">
                    Belum ada data buku
                </div>
                <div v-for="cat in booksPerCategory" :key="cat.name"
                    class="flex justify-between items-center py-2 px-3 rounded-xl bg-white/[0.04]">
                    <span class="text-xs sm:text-sm font-semibold text-white break-words pr-2 min-w-0">{{ cat.name }}</span>
                    <span
                        class="text-xs font-bold tabular-nums text-white bg-white/20 px-2.5 py-1 rounded-full shrink-0">
                        {{ cat.count }} <span class="font-normal text-white">buku</span>
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    isOpen: boolean
    booksPerCategory: Array<{
        name: string
        count: number
    }>
}>()

defineEmits<{
    (e: 'close'): void
}>()
</script>
