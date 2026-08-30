<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-[2px]" @click="$emit('close')"></div>
        <div
            class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[8px_8px_0px_#0d0d0d] animate-in zoom-in-95 duration-200">
            <div class="flex shrink-0 items-center justify-between border-b-2 border-[#0d0d0d] bg-[#faf8f5] px-5 py-4 sm:px-6">
                <div class="min-w-0 pr-4">
                    <h2 class="truncate text-base font-bold uppercase tracking-tight text-[#0d0d0d]">
                        Hubungkan Buku ke Penerbit
                    </h2>
                    <p class="mt-0.5 truncate font-mono text-xs text-[#57534e]">
                        [PENERBIT: <strong class="text-[#0d0d0d] uppercase">{{ publisherName }}</strong>]
                    </p>
                </div>
                <button @click="$emit('close')" type="button" aria-label="Tutup"
                    class="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-white text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] transition-colors hover:bg-[#f3ede2] active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div class="shrink-0 border-b-2 border-[#0d0d0d] bg-[#f3ede2] p-4">
                <div class="relative">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg class="text-[#57534e]" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                    </div>
                    <input v-model="searchQuery" type="text" placeholder="CARI JUDUL ATAU PENULIS BUKU..."
                        class="w-full rounded-[4px] border-1.5 border-[#0d0d0d] bg-white py-2 pl-9 pr-4 font-mono text-xs sm:text-sm font-bold text-[#0d0d0d] outline-none shadow-[2px_2px_0px_#0d0d0d] transition-colors placeholder:text-[#57534e] focus:border-[#0047ff]" />
                </div>

                <div class="mt-2.5 flex items-center justify-between font-mono text-xs">
                    <span class="font-bold text-[#44403c]">
                        [{{ filteredBooks.length }} BUKU TERSEDIA]
                    </span>
                    <button v-if="filteredBooks.length > 0" type="button" @click="toggleSelectAll"
                        class="cursor-pointer font-bold uppercase tracking-wider text-[#0047ff] hover:underline focus:outline-none">
                        {{ isAllSelected ? 'BATALKAN SEMUA' : 'PILIH SEMUA' }}
                    </button>
                </div>
            </div>

            <div class="custom-scrollbar flex-1 overflow-y-auto p-3 sm:p-4">
                <div v-if="filteredBooks.length === 0" class="py-10 text-center font-mono text-xs sm:text-sm font-bold text-[#57534e]">
                    <p v-if="searchQuery">[TIDAK ADA BUKU YANG SESUAI DENGAN PENCARIAN]</p>
                    <p v-else>[SEMUA BUKU SUDAH TERHUBUNG KE PENERBIT INI]</p>
                </div>

                <div v-else class="space-y-2">
                    <label v-for="book in filteredBooks" :key="book.id"
                        class="flex cursor-pointer items-center gap-3 rounded-[4px] border-2 p-2.5 transition-all select-none"
                        :class="selectedIds.includes(book.id!) ? 'border-[#0047ff] bg-[#edf2fe] shadow-[2px_2px_0px_#0047ff]' : 'border-[#0d0d0d] bg-white shadow-[1px_1px_0px_#0d0d0d] hover:bg-[#f3ede2]'">
                        <input type="checkbox" :value="book.id" v-model="selectedIds"
                            class="h-4 w-4 cursor-pointer accent-[#0d0d0d]" />

                        <div
                            class="h-12 w-9 shrink-0 overflow-hidden rounded-[2px] border border-[#0d0d0d] bg-[#f3ede2] shadow-[1px_1px_0px_#0d0d0d]">
                            <img v-if="book.imageUrl" :src="book.imageUrl" class="h-full w-full object-cover" loading="lazy" />
                            <div v-else class="flex h-full w-full items-center justify-center text-[#57534e]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                                </svg>
                            </div>
                        </div>

                        <div class="min-w-0 flex-1">
                            <h4 class="truncate text-xs sm:text-sm font-bold text-[#0d0d0d]">
                                {{ book.title }}
                            </h4>
                            <div class="mt-0.5 flex flex-wrap items-center gap-x-2 font-mono text-xs text-[#57534e]">
                                <span v-if="book.author" class="truncate font-semibold text-[#44403c]">
                                    {{ book.author }}
                                </span>
                                <span v-if="book.publisher" class="truncate text-[#57534e]">
                                    (saat ini: {{ book.publisher }})
                                </span>
                                <span v-else class="italic text-[#57534e]">
                                    (tanpa penerbit)
                                </span>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            <div class="flex shrink-0 items-center justify-between gap-3 border-t-2 border-[#0d0d0d] bg-[#faf8f5] p-4 sm:px-6">
                <span class="rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1 font-mono text-xs font-bold uppercase text-[#0d0d0d] tabular-nums shadow-[1px_1px_0px_#0d0d0d]">
                    [{{ selectedIds.length }} BUKU DIPILIH]
                </span>

                <div class="flex gap-2.5">
                    <button type="button" @click="$emit('close')"
                        class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3.5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2]">
                        BATAL
                    </button>
                    <button type="button" @click="handleAssign" :disabled="selectedIds.length === 0"
                        class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#262626] hover:shadow-[3px_3px_0px_#0047ff] disabled:cursor-not-allowed disabled:opacity-40">
                        HUBUNGKAN ({{ selectedIds.length }})
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
    publisherName: string
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
    background: #f3ede2;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #57534e;
    border-radius: 0px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #0d0d0d;
}
</style>
