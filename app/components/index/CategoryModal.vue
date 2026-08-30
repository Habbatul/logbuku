<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="$emit('close')"></div>
        <div
            class="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div class="flex justify-between items-center p-5 border-b border-gray-200">
                <h2 class="text-lg font-bold text-gray-900">Total Buku per Topik</h2>
                <button @click="$emit('close')"
                    class="cursor-pointer text-gray-400 hover:text-gray-900 transition-colors outline-none focus:ring-2 focus:ring-gray-900 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>
            <div class="p-5 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
                <div v-if="booksPerCategory.length === 0" class="text-center text-gray-500 text-sm py-4">
                    Belum ada data buku.
                </div>
                <div v-for="cat in booksPerCategory" :key="cat.name"
                    class="flex justify-between items-center border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <span class="text-sm font-medium text-gray-700 truncate pr-2">{{ cat.name }}</span>
                    <span
                        class="text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md shadow-sm shrink-0">
                        {{ cat.count }}
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
    background: #D1D5DB;
    border-radius: 0px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
}
</style>
