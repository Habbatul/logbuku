<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-[2px]" @click="close"></div>
        <div
            class="relative bg-white rounded-lg shadow-[8px_8px_0px_#0d0d0d] border-2 border-[#0d0d0d] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div class="p-4 sm:p-5 border-b-2 border-[#0d0d0d] bg-white flex items-center justify-between">
                <div class="min-w-0 pr-2">
                    <h2 class="text-base font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-tight truncate">Update Progres</h2>
                    <p class="font-mono text-xs text-[#57534e] mt-1 line-clamp-1 uppercase">{{ book?.title }}</p>
                </div>
                <button @click="close" type="button" aria-label="Tutup modal"
                    class="cursor-pointer text-[#0d0d0d] rounded-[4px] border border-transparent p-1 transition-colors hover:border-[#0d0d0d] hover:bg-[#f3ede2] focus:outline-none shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="handleSave" class="p-4 sm:p-5 space-y-4">
                <div class="flex items-center justify-center gap-3">
                    <button type="button" @click="decrement"
                        class="w-10 h-10 cursor-pointer flex items-center justify-center bg-[#f3ede2] border-2 border-[#0d0d0d] rounded-[4px] hover:bg-white text-[#0d0d0d] font-mono font-bold text-lg shadow-[2px_2px_0px_#0d0d0d] transition-all active:translate-x-0.5 active:translate-y-0.5 focus:outline-none"
                        aria-label="Kurangi satu halaman">
                        -
                    </button>

                    <input v-model.number="pagesRead" type="number"
                        class="w-24 h-10 text-center bg-white border-2 border-[#0d0d0d] rounded-[4px] font-mono text-base font-bold tabular-nums text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] outline-none transition-all focus:border-[#0047ff] hide-arrows"
                        @input="validate"
                        @keydown.enter.prevent="handleSave" />

                    <button type="button" @click="increment"
                        class="w-10 h-10 cursor-pointer flex items-center justify-center bg-[#f3ede2] border-2 border-[#0d0d0d] rounded-[4px] hover:bg-white text-[#0d0d0d] font-mono font-bold text-lg shadow-[2px_2px_0px_#0d0d0d] transition-all active:translate-x-0.5 active:translate-y-0.5 focus:outline-none"
                        aria-label="Tambah satu halaman">
                        +
                    </button>
                </div>

                <div class="flex items-center justify-center gap-1.5">
                    <button type="button" @click="addPages(5)"
                        class="cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2 py-1 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] hover:bg-white transition-all active:translate-x-0.5 active:translate-y-0.5">
                        +5
                    </button>
                    <button type="button" @click="addPages(10)"
                        class="cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2 py-1 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] hover:bg-white transition-all active:translate-x-0.5 active:translate-y-0.5">
                        +10
                    </button>
                    <button type="button" @click="addPages(25)"
                        class="cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2 py-1 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] hover:bg-white transition-all active:translate-x-0.5 active:translate-y-0.5">
                        +25
                    </button>
                    <button type="button" @click="markCompleted"
                        class="cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#eafaf1] px-2.5 py-1 font-mono text-xs font-bold text-[#00875a] shadow-[1px_1px_0px_#00875a] hover:bg-[#d1f5e0] transition-all active:translate-x-0.5 active:translate-y-0.5">
                        SELESAI
                    </button>
                </div>

                <div class="text-center font-mono text-xs text-[#57534e]">
                    DARI TOTAL <span class="font-bold tabular-nums text-[#0d0d0d]">{{ totalPages }}</span> HALAMAN
                </div>

                <div class="border-t-2 border-[#0d0d0d] pt-3.5 space-y-2">
                    <button type="button" @click="isDateExpanded = !isDateExpanded"
                        class="flex w-full cursor-pointer items-center justify-between rounded-[4px] border-2 border-[#0d0d0d] bg-[#f3ede2] px-3 py-2 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-white active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
                        <div class="flex items-center gap-2 min-w-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-[#0d0d0d]">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                            </svg>
                            <span class="truncate">
                                TANGGAL: <span class="text-[#0047ff]">{{ formattedSelectedDate }}</span>
                            </span>
                        </div>
                        <div class="flex items-center gap-1.5 shrink-0">
                            <span class="text-xs text-[#57534e] underline" v-if="!isDateExpanded">[UBAH]</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                                class="transition-transform duration-200"
                                :class="isDateExpanded ? 'rotate-180' : ''">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </button>

                    <div v-show="isDateExpanded"
                        class="space-y-2 rounded-[4px] border-2 border-[#0d0d0d] bg-[#faf8f5] p-3 shadow-[2px_2px_0px_#0d0d0d] animate-in fade-in zoom-in-95 duration-150">
                        <label class="block font-mono text-xs font-bold uppercase text-[#44403c]">
                            PILIH TANGGAL SESI:
                        </label>
                        <div class="flex items-center gap-2">
                            <input v-model="selectedDate" type="date" :max="todayDateString"
                                class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] outline-none transition-colors focus:border-[#0047ff]" />
                            <button v-if="selectedDate !== todayDateString" type="button" @click="selectedDate = todayDateString"
                                title="Reset ke hari ini"
                                class="shrink-0 cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2 py-1.5 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5">
                                HARI INI
                            </button>
                        </div>
                        <p class="font-mono text-xs text-[#57534e]">
                            *Otomatis tercatat untuk tanggal hari ini jika tidak diubah.
                        </p>
                    </div>
                </div>

                <NuxtLink v-if="book" :to="`/tracking?id=${book.id}`" @click="close"
                    class="flex w-full items-center justify-center gap-1.5 rounded-[4px] border-2 border-[#0047ff] bg-[#f0f4ff] py-2 font-mono text-xs font-bold uppercase text-[#0047ff] shadow-[2px_2px_0px_#0047ff] hover:bg-[#e0eaff] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>Buka Halaman Tracking & Timer</span>
                </NuxtLink>

                <div class="pt-2 flex gap-3">
                    <button type="button" @click="close"
                        class="flex-1 cursor-pointer bg-white border-2 border-[#0d0d0d] text-[#0d0d0d] font-mono text-xs font-bold uppercase py-2.5 rounded-[4px] shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#f3ede2] transition-all focus:outline-none">
                        BATAL
                    </button>
                    <button type="submit"
                        class="flex-1 cursor-pointer bg-[#0d0d0d] border-2 border-[#0d0d0d] text-white font-mono text-xs font-bold uppercase py-2.5 rounded-[4px] shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#262626] hover:shadow-[3px_3px_0px_#ff4800] transition-all focus:outline-none">
                        SIMPAN
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Book } from '~/types/book'

const props = defineProps<{
    isOpen: boolean
    book: Book | null
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', payload: { book: Book; newPages: number; date?: string }): void
}>()

const pagesRead = ref(0)
const totalPages = ref(0)
const isDateExpanded = ref(false)

const getTodayDateString = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const todayDateString = computed(() => getTodayDateString())
const selectedDate = ref(getTodayDateString())

const formattedSelectedDate = computed(() => {
    if (!selectedDate.value || selectedDate.value === todayDateString.value) {
        return 'HARI INI'
    }
    try {
        const [y, m, d] = selectedDate.value.split('-')
        return `${d}/${m}/${y}`
    } catch {
        return selectedDate.value
    }
})

watch(
    () => [props.isOpen, props.book],
    ([newOpen, newBook]) => {
        if (newOpen && newBook) {
            const b = newBook as Book
            pagesRead.value = b.pagesRead || 0
            totalPages.value = b.totalPages || 0
            isDateExpanded.value = false
            selectedDate.value = getTodayDateString()
        }
    },
    { immediate: true }
)

const validate = () => {
    if (pagesRead.value < 0) pagesRead.value = 0
    if (pagesRead.value > totalPages.value) pagesRead.value = totalPages.value
}

const increment = () => {
    if (pagesRead.value < totalPages.value) pagesRead.value++
}

const decrement = () => {
    if (pagesRead.value > 0) pagesRead.value--
}

const addPages = (amount: number) => {
    pagesRead.value = Math.min(totalPages.value, Math.max(0, pagesRead.value + amount))
}

const markCompleted = () => {
    pagesRead.value = totalPages.value
}

const close = () => {
    emit('close')
}

const handleSave = () => {
    if (!props.book) return
    validate()
    emit('save', {
        book: props.book,
        newPages: pagesRead.value,
        date: selectedDate.value
    })
}
</script>

<style scoped>
.hide-arrows::-webkit-outer-spin-button,
.hide-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.hide-arrows {
    -moz-appearance: textfield;
}
</style>