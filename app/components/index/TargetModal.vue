<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>
        <div
            class="liquid-glass-modal relative w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] shadow-2xl">
            <div class="p-5 flex justify-between items-center bg-white/5 z-10 shrink-0">
                <div class="min-w-0 pr-4">
                    <div class="flex flex-wrap items-center gap-2">
                        <h2 class="text-base font-semibold tracking-tight text-white leading-tight">Pilih Target Membaca</h2>
                        <span v-if="tempSelectedTargets.length > 0"
                            class="inline-flex items-center rounded-full bg-sky-500/20 px-2.5 py-0.5 text-xs font-semibold text-sky-300 tabular-nums">
                            {{ tempSelectedTargets.length }} Terpilih
                        </span>
                    </div>
                    <p class="text-xs text-white mt-1 leading-relaxed">Pilih buku dari koleksi yang ingin Anda prioritaskan.</p>
                </div>
                <button @click="$emit('close')" aria-label="Tutup modal"
                    class="text-white hover:text-white p-1.5 rounded-lg hover:bg-white/15 shrink-0 transition-colors focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div class="p-4 bg-white/5 shrink-0">
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <svg class="text-sky-300" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <input v-model="targetSearchQuery" type="text" placeholder="Cari judul buku..."
                        class="glass-input w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-white/75" />
                </div>
            </div>

            <div class="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-2">
                <div v-if="filteredTargetBooks.length === 0" class="text-center py-10 text-xs text-white font-medium">
                    Buku tidak ditemukan
                </div>
                <label v-for="book in filteredTargetBooks" :key="'tgt-' + book.id"
                    class="flex items-center gap-3.5 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors group">
                    <div class="shrink-0 flex items-center">
                        <input type="checkbox" :value="book.id" v-model="tempSelectedTargets"
                            class="w-4 h-4 accent-sky-500 cursor-pointer rounded">
                    </div>
                    <div
                        class="h-13 w-9 rounded-lg overflow-hidden bg-white/15 shrink-0 shadow-sm">
                        <img v-if="book.imageUrl" :src="book.imageUrl" class="w-full h-full object-cover" loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="flex-1 min-w-0">
                        <h4 class="line-clamp-2 text-xs sm:text-sm font-semibold text-white leading-snug break-words">{{ book.title }}</h4>
                        <div class="flex items-center gap-3 mt-1.5 text-xs">
                            <div class="w-full bg-white/15 rounded-full h-1.5 flex-1 overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-300"
                                    :class="Math.round((book.pagesRead / book.totalPages) * 100) >= 100 ? 'bg-emerald-400' : 'bg-sky-400'"
                                    :style="{ width: `${Math.min((book.pagesRead / book.totalPages) * 100, 100)}%` }">
                                </div>
                            </div>
                            <span class="font-bold tabular-nums text-white shrink-0">
                                {{ Math.round((book.pagesRead / book.totalPages) * 100) || 0 }}%
                            </span>
                        </div>
                    </div>
                </label>
            </div>

            <div class="p-4 bg-white/5 shrink-0 flex gap-3">
                <button @click="$emit('close')"
                    class="btn-sunset-secondary flex-1 py-2.5 px-3 text-xs sm:text-sm">
                    Batal
                </button>
                <button @click="handleSave"
                    class="btn-sunset-primary flex-1 py-2.5 px-3 text-xs sm:text-sm font-semibold">
                    Simpan Target {{ tempSelectedTargets.length > 0 ? `(${tempSelectedTargets.length})` : '' }}
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
