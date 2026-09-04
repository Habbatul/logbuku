<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="$emit('close')"></div>
        <div
            class="liquid-glass-modal relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div class="flex shrink-0 items-center justify-between bg-white/[0.05] px-5 py-4 sm:px-6">
                <div class="min-w-0 pr-4">
                    <h2 class="truncate text-base font-bold tracking-tight text-white">
                        Hubungkan Buku ke Penulis
                    </h2>
                    <p class="mt-0.5 truncate text-xs text-white">
                        Penulis: <strong class="text-sky-300 font-semibold">{{ authorName }}</strong>
                    </p>
                </div>
                <button @click="$emit('close')" type="button" aria-label="Tutup"
                    class="btn-sunset-secondary flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl text-white hover:bg-white/15 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div class="shrink-0 bg-white/[0.03] p-4 space-y-2.5">
                <div class="relative">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-sky-300">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text" placeholder="Cari judul atau penerbit buku..."
                        class="glass-input w-full rounded-xl py-2 pl-9 pr-4 text-xs sm:text-sm text-white placeholder:text-white/75 focus:outline-none" />
                </div>

                <div class="flex items-center justify-between text-xs">
                    <span class="font-medium text-white">
                        {{ filteredBooks.length }} buku tersedia
                    </span>
                    <button v-if="filteredBooks.length > 0" type="button" @click="toggleSelectAll"
                        class="cursor-pointer font-bold text-sky-300 hover:text-sky-200 hover:underline focus:outline-none">
                        {{ isAllSelected ? 'Batalkan Semua' : 'Pilih Semua' }}
                    </button>
                </div>
            </div>

            <div class="custom-scrollbar flex-1 overflow-y-auto p-3 sm:p-4">
                <div v-if="filteredBooks.length === 0" class="py-10 text-center text-xs sm:text-sm font-medium text-white">
                    <p v-if="searchQuery">Tidak ada buku yang sesuai dengan pencarian</p>
                    <p v-else>Semua buku sudah terhubung ke penulis ini</p>
                </div>

                <div v-else class="space-y-2">
                    <label v-for="book in filteredBooks" :key="book.id"
                        class="flex cursor-pointer items-center gap-3 rounded-xl p-2.5 select-none"
                        :class="selectedIds.includes(book.id!) ? 'bg-sky-500/20 shadow-sm' : 'bg-white/[0.04] hover:bg-white/[0.08]'">
                        <input type="checkbox" :value="book.id" v-model="selectedIds"
                            class="h-4 w-4 cursor-pointer rounded bg-white/10 accent-sky-500" />

                        <div
                            class="h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-white/10">
                            <img v-if="book.imageUrl" :src="book.imageUrl" class="h-full w-full object-cover" loading="lazy" />
                            <div v-else class="flex h-full w-full items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                                </svg>
                            </div>
                        </div>

                        <div class="min-w-0 flex-1">
                            <h4 class="truncate text-xs sm:text-sm font-semibold text-white">
                                {{ book.title }}
                            </h4>
                            <div class="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-white">
                                <span v-if="book.author" class="truncate font-semibold text-white">
                                    (saat ini: {{ book.author }})
                                </span>
                                <span v-else class="italic text-sky-200">
                                    (tanpa penulis)
                                </span>
                                <span v-if="book.publisher" class="truncate text-white">
                                    • {{ book.publisher }}
                                </span>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <div class="flex shrink-0 items-center justify-between gap-3 bg-white/[0.05] p-4 sm:px-6">
                <span class="liquid-glass-pill px-3 py-1 text-xs font-bold text-white tabular-nums">
                    {{ selectedIds.length }} buku dipilih
                </span>

                <div class="flex gap-2.5">
                    <button type="button" @click="$emit('close')"
                        class="btn-sunset-secondary rounded-xl px-3.5 py-2 text-xs font-semibold text-white">
                        Batal
                    </button>
                    <button type="button" @click="handleAssign" :disabled="selectedIds.length === 0"
                        class="btn-sunset-primary rounded-xl px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-40">
                        Hubungkan ({{ selectedIds.length }})
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Book } from '~/types/book'

const props = defineProps<{
    isOpen: boolean
    authorName: string
    availableBooks: Book[]
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'assign', selectedIds: (string | number)[]): void
}>()

const searchQuery = ref('')
const selectedIds = ref<(string | number)[]>([])

watch(
    () => props.isOpen,
    (open) => {
        if (open) {
            searchQuery.value = ''
            selectedIds.value = []
        }
    }
)

const filteredBooks = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return props.availableBooks
    return props.availableBooks.filter(b => {
        const titleMatch = b.title.toLowerCase().includes(q)
        const authorMatch = Boolean(b.author) && b.author!.toLowerCase().includes(q)
        const pubMatch = Boolean(b.publisher) && b.publisher!.toLowerCase().includes(q)
        return titleMatch || authorMatch || pubMatch
    })
})

const isAllSelected = computed(() => {
    if (filteredBooks.value.length === 0) return false
    return filteredBooks.value.every(b => selectedIds.value.includes(b.id!))
})

const toggleSelectAll = () => {
    if (isAllSelected.value) {
        const currentFilteredIds = new Set(filteredBooks.value.map(b => b.id!))
        selectedIds.value = selectedIds.value.filter(id => !currentFilteredIds.has(id))
    } else {
        const newIds = new Set([...selectedIds.value, ...filteredBooks.value.map(b => b.id!)])
        selectedIds.value = Array.from(newIds)
    }
}

const handleAssign = () => {
    if (selectedIds.value.length > 0) {
        emit('assign', selectedIds.value)
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.02);
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}
</style>
