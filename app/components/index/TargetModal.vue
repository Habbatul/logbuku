<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-xs" @click="$emit('close')"></div>
        <div
            class="relative bg-white rounded-lg shadow-[8px_8px_0px_#0d0d0d] border-2 border-[#0d0d0d] w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div class="p-5 border-b-2 border-[#0d0d0d] flex justify-between items-center bg-white z-10 shrink-0">
                <div class="min-w-0 pr-4">
                    <div class="flex items-center gap-2">
                        <h2 class="text-base font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-tight truncate">"Pilih Buku Target"</h2>
                        <span v-if="tempSelectedTargets.length > 0"
                            class="inline-flex items-center rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0d0d0d] tabular-nums">
                            [{{ tempSelectedTargets.length }} TERPILIH]
                        </span>
                    </div>
                    <p class="font-mono text-xs sm:text-sm text-[#44403c] mt-0.5 truncate uppercase">Pilih buku dari koleksi yang ingin Anda prioritaskan.</p>
                </div>
                <button @click="$emit('close')" aria-label="Tutup modal"
                    class="cursor-pointer text-[#0d0d0d] rounded-[4px] border border-transparent p-1 transition-colors hover:border-[#0d0d0d] hover:bg-[#f3ede2] shrink-0 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-4 border-b-2 border-[#0d0d0d] bg-[#f3ede2] shrink-0">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="text-[#57534e]" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <input v-model="targetSearchQuery" type="text" placeholder="CARI JUDUL BUKU..."
                        class="w-full pl-9 pr-4 py-2.5 bg-white border-1.5 border-[#0d0d0d] rounded-[4px] shadow-[2px_2px_0px_#0d0d0d] focus:border-[#0047ff] outline-none transition-all font-mono text-xs sm:text-sm font-bold text-[#0d0d0d]" />
                </div>
            </div>

            <div class="p-3 flex-1 overflow-y-auto bg-white custom-scrollbar space-y-1">
                <div v-if="filteredTargetBooks.length === 0" class="text-center py-8 font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">
                    [BUKU TIDAK DITEMUKAN]
                </div>
                <label v-for="book in filteredTargetBooks" :key="'tgt-' + book.id"
                    class="flex items-center gap-3.5 p-2.5 rounded-[4px] hover:bg-[#f3ede2] border border-transparent hover:border-[#0d0d0d] cursor-pointer transition-colors group">
                    <div class="shrink-0 flex items-center">
                        <input type="checkbox" :value="book.id" v-model="tempSelectedTargets"
                            class="w-4 h-4 accent-[#0d0d0d] cursor-pointer">
                    </div>
                    <div
                        class="h-12 w-8 bg-[#f3ede2] border border-[#0d0d0d] rounded-[2px] overflow-hidden flex-shrink-0 shadow-[1px_1px_0px_#0d0d0d]">
                        <img v-if="book.imageUrl" :src="book.imageUrl" class="w-full h-full object-cover" loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center text-[#57534e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="text-sm sm:text-base font-bold text-[#0d0d0d] truncate">{{ book.title }}</h4>
                        <div class="flex items-center gap-3 mt-1.5 font-mono text-xs sm:text-sm">
                            <div class="w-full bg-[#f3ede2] border border-[#0d0d0d] rounded-[2px] p-[1px] h-2.5 flex-1 overflow-hidden">
                                <div class="h-full"
                                    :class="Math.round((book.pagesRead / book.totalPages) * 100) >= 100 ? 'bg-[#00875a]' : 'bg-[#0d0d0d]'"
                                    :style="{ width: `${Math.min((book.pagesRead / book.totalPages) * 100, 100)}%` }">
                                </div>
                            </div>
                            <span class="font-bold tabular-nums text-[#0d0d0d] shrink-0">
                                [{{ Math.round((book.pagesRead / book.totalPages) * 100) || 0 }}%]
                            </span>
                        </div>
                    </div>
                </label>
            </div>

            <div class="p-4 border-t-2 border-[#0d0d0d] bg-[#f3ede2] shrink-0 flex gap-3">
                <button @click="$emit('close')"
                    class="flex-1 cursor-pointer bg-white border-2 border-[#0d0d0d] text-[#0d0d0d] font-mono text-xs sm:text-sm font-bold uppercase py-2.5 rounded-[4px] shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#e5dfd3] transition-all focus:outline-none">
                    "BATAL"
                </button>
                <button @click="handleSave"
                    class="flex-1 cursor-pointer bg-[#0d0d0d] border-2 border-[#0d0d0d] text-white font-mono text-xs sm:text-sm font-bold uppercase py-2.5 rounded-[4px] shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#262626] hover:shadow-[3px_3px_0px_#ff4800] transition-all focus:outline-none">
                    "SIMPAN TARGET {{ tempSelectedTargets.length > 0 ? `(${tempSelectedTargets.length} BUKU)` : '' }}"
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
    background: #e5dfd3;
    border-radius: 0px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #57534e;
}
</style>
