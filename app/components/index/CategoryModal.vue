<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-[2px]" @click="$emit('close')"></div>
        <div
            class="relative bg-white rounded-lg shadow-[8px_8px_0px_#0d0d0d] border-2 border-[#0d0d0d] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div class="flex justify-between items-center p-4 sm:p-5 border-b-2 border-[#0d0d0d]">
                <h2 class="text-base font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-tight break-words">"Buku per Topik"</h2>
                <button @click="$emit('close')" aria-label="Tutup modal"
                    class="cursor-pointer text-[#0d0d0d] rounded-[4px] border border-transparent p-1 transition-colors hover:border-[#0d0d0d] hover:bg-[#f3ede2] focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-4 sm:p-5 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
                <div v-if="booksPerCategory.length === 0" class="text-center font-mono text-xs font-bold uppercase text-[#57534e] py-4">
                    [BELUM ADA DATA BUKU]
                </div>
                <div v-for="cat in booksPerCategory" :key="cat.name"
                    class="flex justify-between items-center border-b border-[#e5dfd3] last:border-0 pb-3 last:pb-0 gap-2">
                    <span class="text-xs sm:text-sm font-bold text-[#0d0d0d] break-words pr-2 min-w-0">{{ cat.name }}</span>
                    <span
                        class="font-mono text-xs sm:text-sm font-bold tabular-nums text-[#0d0d0d] bg-[#f3ede2] border border-[#0d0d0d] px-2.5 py-0.5 rounded-[3px] shrink-0">
                        {{ cat.count }} <span class="font-bold text-[#57534e]">BUKU</span>
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5dfd3;
    border-radius: 0px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #57534e;
}
</style>
