<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="$emit('close')"></div>
        <div
            class="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div class="p-5 border-b border-gray-200 flex justify-between items-center bg-white z-10 shrink-0">
                <div class="min-w-0 pr-4">
                    <h2 class="text-lg font-bold text-gray-900 truncate">Pilih Buku Target</h2>
                    <p class="text-sm text-gray-500 mt-1 truncate">Pilih buku yang ingin diselesaikan.</p>
                </div>
                <button @click="$emit('close')"
                    class="cursor-pointer text-gray-400 hover:text-gray-900 transition-colors shrink-0 outline-none focus:ring-2 focus:ring-gray-900 rounded">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-4 border-b border-gray-200 bg-gray-50 shrink-0">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="text-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <input v-model="targetSearchQuery" type="text" placeholder="Cari judul buku..."
                        class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all text-sm font-medium text-gray-900 shadow-sm" />
                </div>
            </div>

            <div class="p-2 flex-1 overflow-y-auto bg-white custom-scrollbar">
                <div v-if="filteredTargetBooks.length === 0" class="text-center py-8 text-gray-500 text-sm font-medium">
                    Buku tidak ditemukan.
                </div>
                <label v-for="book in filteredTargetBooks" :key="'tgt-' + book.id"
                    class="flex items-center gap-4 p-3 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition-colors group">
                    <div class="shrink-0 flex items-center">
                        <input type="checkbox" :value="book.id" v-model="tempSelectedTargets"
                            class="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900 focus:ring-2 cursor-pointer transition-all">
                    </div>
                    <div
                        class="h-12 w-8 bg-gray-100 border border-gray-200 rounded overflow-hidden flex-shrink-0 shadow-sm">
                        <img v-if="book.imageUrl" :src="book.imageUrl" class="w-full h-full object-cover" />
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-bold text-gray-900 truncate">{{ book.title }}</h4>
                        <div class="flex items-center gap-3 mt-1.5">
                            <div class="w-full bg-gray-100 rounded-full h-1.5 flex-1 overflow-hidden shadow-inner">
                                <div class="h-1.5 rounded-full"
                                    :class="getProgressColor(book.pagesRead, book.totalPages)"
                                    :style="{ width: `${Math.min((book.pagesRead / book.totalPages) * 100, 100)}%` }">
                                </div>
                            </div>
                            <span class="text-xs font-bold text-gray-500 shrink-0">
                                {{ Math.round((book.pagesRead / book.totalPages) * 100) || 0 }}%
                            </span>
                        </div>
                    </div>
                </label>
            </div>

            <div class="p-4 border-t border-gray-200 bg-gray-50 shrink-0 flex gap-3">
                <button @click="$emit('close')"
                    class="flex-1 cursor-pointer bg-white border border-gray-300 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-100 transition-colors text-sm shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none">
                    Batal
                </button>
                <button @click="handleSave"
                    class="flex-1 cursor-pointer bg-gray-900 border border-transparent text-white font-semibold py-2 rounded-md hover:bg-black transition-colors text-sm shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none">
                    Simpan Target
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
    isOpen: boolean
    books: any[]
    targetBookIds: number[]
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', selectedIds: number[]): void
}>()

const targetSearchQuery = ref('')
const tempSelectedTargets = ref<number[]>([])

watch(
    () => props.isOpen,
    (isOpen) => {
        if (isOpen) {
            targetSearchQuery.value = ''
            tempSelectedTargets.value = [...props.targetBookIds]
        }
    },
    { immediate: true }
)

const filteredTargetBooks = computed(() => {
    if (!targetSearchQuery.value) return props.books
    return props.books.filter(b => b.title.toLowerCase().includes(targetSearchQuery.value.toLowerCase()))
})

const handleSave = () => {
    emit('save', tempSelectedTargets.value)
}
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
