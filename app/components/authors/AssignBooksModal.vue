<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-gray-950/40 backdrop-blur-[3px]" @click="$emit('close')"></div>
        <div
            class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] animate-in zoom-in-95 duration-200">
            <div class="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
                <div class="min-w-0 pr-4">
                    <h2 class="truncate text-base font-semibold tracking-tight text-gray-950">
                        Hubungkan Buku ke Penulis
                    </h2>
                    <p class="mt-0.5 truncate text-xs text-gray-500">
                        Penulis: <strong class="text-gray-900">{{ authorName }}</strong>
                    </p>
                </div>
                <button @click="$emit('close')" type="button" aria-label="Tutup"
                    class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div class="shrink-0 border-b border-gray-100 bg-gray-50/70 p-4">
                <div class="relative">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text" placeholder="Cari judul atau penerbit buku..."
                        class="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                </div>

                <div class="mt-2.5 flex items-center justify-between text-xs">
                    <span class="text-gray-500">
                        {{ filteredBooks.length }} buku tersedia
                    </span>
                    <button v-if="filteredBooks.length > 0" type="button" @click="toggleSelectAll"
                        class="cursor-pointer font-semibold text-emerald-600 hover:text-emerald-800 focus:outline-none">
                        {{ isAllSelected ? 'Batalkan Semua' : 'Pilih Semua' }}
                    </button>
                </div>
            </div>

            <div class="custom-scrollbar flex-1 overflow-y-auto p-3 sm:p-4">
                <div v-if="filteredBooks.length === 0" class="py-10 text-center text-xs text-gray-400">
                    <p v-if="searchQuery">Tidak ada buku yang sesuai dengan pencarian.</p>
                    <p v-else>Semua buku sudah terhubung ke penulis ini.</p>
                </div>

                <div v-else class="space-y-1.5">
                    <label v-for="book in filteredBooks" :key="book.id"
                        class="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-2.5 transition-colors hover:border-gray-200 hover:bg-gray-50"
                        :class="selectedIds.includes(book.id!) ? 'border-gray-200 bg-emerald-50/30' : ''">
                        <input type="checkbox" :value="book.id" v-model="selectedIds"
                            class="h-4 w-4 cursor-pointer rounded border-gray-300 text-gray-900 focus:ring-gray-900" />

                        <div
                            class="h-12 w-9 shrink-0 overflow-hidden rounded border border-gray-200 bg-gray-100 shadow-xs">
                            <img v-if="book.imageUrl" :src="book.imageUrl" class="h-full w-full object-cover" />
                            <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="1.8">
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                                </svg>
                            </div>
                        </div>

                        <div class="min-w-0 flex-1">
                            <h4 class="truncate text-xs font-bold text-gray-900">
                                {{ book.title }}
                            </h4>
                            <div class="mt-0.5 flex flex-wrap items-center gap-x-2 text-[11px] text-gray-500">
                                <span v-if="book.author" class="truncate font-medium text-gray-600">
                                    (saat ini: {{ book.author }})
                                </span>
                                <span v-else class="italic text-gray-400">
                                    (tanpa penulis)
                                </span>
                                <span v-if="book.publisher" class="truncate text-gray-400">
                                    • {{ book.publisher }}
                                </span>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <div class="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/50 p-4 sm:px-6">
                <span class="text-xs font-medium text-gray-600">
                    {{ selectedIds.length }} buku dipilih
                </span>

                <div class="flex gap-2">
                    <button type="button" @click="$emit('close')"
                        class="cursor-pointer rounded-md border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                        Batal
                    </button>
                    <button type="button" @click="handleAssign" :disabled="selectedIds.length === 0"
                        class="cursor-pointer rounded-md bg-gray-950 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-gray-900/15">
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
    width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 2px;
}
</style>
