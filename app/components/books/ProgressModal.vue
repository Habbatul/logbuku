<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-md" @click="close"></div>
        <div
            class="relative flex flex-col w-full max-w-sm max-h-[90dvh] sm:max-h-[88vh] overflow-hidden liquid-glass-modal rounded-2xl sm:rounded-3xl shadow-2xl animate-in zoom-in-95 duration-150">
            <div class="shrink-0 px-4 py-3 sm:px-5 sm:py-3.5 border-b border-white/10 flex items-center justify-between">
                <div class="min-w-0 pr-2">
                    <h2 class="text-sm sm:text-base font-bold tracking-tight text-white leading-tight truncate">Update Progres Baca</h2>
                    <p class="text-xs text-white/80 mt-0.5 line-clamp-1 font-medium">{{ book?.title }}</p>
                </div>
                <button @click="close" type="button" aria-label="Tutup modal"
                    class="btn-sunset-ghost h-8 w-8 rounded-lg flex items-center justify-center text-white hover:bg-white/15 transition-colors shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <form @submit.prevent="handleSave" class="flex flex-col min-h-0 flex-1 overflow-hidden">
                <div class="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-5 space-y-3.5 sm:space-y-4">
                    <div class="flex items-center justify-center gap-3">
                        <button type="button" @click="decrement"
                            :disabled="isRangeSpecified"
                            class="btn-sunset-secondary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
                            aria-label="Kurangi satu halaman">
                            -
                        </button>

                        <input v-model.number="pagesRead" type="number"
                            :disabled="isRangeSpecified"
                            class="w-24 h-10 text-center glass-input rounded-xl text-base font-bold tabular-nums text-white hide-arrows disabled:opacity-40 disabled:cursor-not-allowed"
                            @input="validate"
                            @keydown.enter.prevent="handleSave" />

                        <button type="button" @click="increment"
                            :disabled="isRangeSpecified"
                            class="btn-sunset-secondary w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform"
                            aria-label="Tambah satu halaman">
                            +
                        </button>
                    </div>

                    <div class="flex justify-center gap-1.5">
                        <button type="button" @click="addPages(5)"
                            :disabled="isRangeSpecified"
                            class="btn-sunset-secondary px-3 rounded-lg py-1.5 text-xs font-semibold text-white text-center disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform">
                            +5
                        </button>
                        <button type="button" @click="addPages(10)"
                            :disabled="isRangeSpecified"
                            class="btn-sunset-secondary px-3 rounded-lg py-1.5 text-xs font-semibold text-white text-center disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform">
                            +10
                        </button>
                        <button type="button" @click="addPages(25)"
                            :disabled="isRangeSpecified"
                            class="btn-sunset-secondary px-3 rounded-lg py-1.5 text-xs font-semibold text-white text-center disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-transform">
                            +25
                        </button>
                        <button type="button" @click="markCompleted"
                            :disabled="isRangeSpecified"
                            class="rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-bold text-emerald-300 text-center hover:bg-emerald-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95">
                            Selesai
                        </button>
                    </div>

                    <div v-if="isRangeSpecified" class="text-center text-[10px] text-sky-200 font-medium">
                        *Input diabaikan karena jumlah halaman dihitung otomatis dari rentang Mulai & Sampai
                    </div>

                    <div class="text-center text-xs text-white font-medium">
                        Dari total <span class="font-bold tabular-nums text-white">{{ book?.totalPages || 0 }}</span><template v-if="modalTotalPrefaceCount > 0"> + <span class="font-bold text-white">{{ intToRoman(modalTotalPrefaceCount, true) }}</span></template> halaman
                    </div>

                    <div class="space-y-1.5 pt-1">
                        <div class="flex items-center justify-between text-[11px]">
                            <span class="text-white/90">
                                Progres: <strong class="tabular-nums text-white font-bold">{{ modalBookPagesRead }}</strong> / <span class="tabular-nums text-white font-semibold">{{ effectiveTotalPages }}</span> hal
                            </span>
                            <span class="font-extrabold tabular-nums"
                                :class="effectiveTotalPages > 0 && modalBookPagesRead >= effectiveTotalPages ? 'text-emerald-300' : 'text-sky-300'">
                                {{ modalPercentage }}%
                            </span>
                        </div>
                        <div class="h-2 w-full overflow-hidden rounded-full bg-white/20 shadow-inner">
                            <div class="h-full rounded-full transition-all duration-300 ease-out"
                                :class="effectiveTotalPages > 0 && modalBookPagesRead >= effectiveTotalPages ? 'bg-emerald-400' : 'bg-gradient-to-r from-sky-400 to-cyan-400'"
                                :style="{ width: `${modalProgressWidth}%` }"></div>
                        </div>
                    </div>

                    <div v-if="lastSessionFormatted" class="text-center text-[11px] text-white/90">
                        Histori terakhir: <span class="font-bold text-sky-300">{{ lastSessionFormatted }}</span>
                        <span v-if="lastSession?.pagesAdded" class="text-emerald-300 font-semibold"> (+{{ lastSession.pagesAdded }} hal)</span>
                    </div>

                    <div class="pt-1 space-y-2">
                        <button type="button" @click="isRangeExpanded = !isRangeExpanded"
                            class="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white/10 hover:bg-white/15 px-3.5 py-2.5 text-xs font-semibold text-white transition-colors focus:outline-none">
                            <div class="flex items-center gap-2 min-w-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-sky-300">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                                <span class="truncate">
                                    Rentang: <span class="text-sky-300 font-bold tabular-nums">{{ formattedRangeDisplay }}</span>
                                </span>
                            </div>
                            <div class="flex items-center gap-1.5 shrink-0">
                                <span class="text-xs text-white font-semibold" v-if="!isRangeExpanded">Atur</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="transition-transform duration-200 text-white"
                                    :class="isRangeExpanded ? 'rotate-180' : ''">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </button>

                        <div v-show="isRangeExpanded"
                            class="space-y-2.5 rounded-xl bg-white/10 backdrop-blur-md p-3 shadow-inner animate-in fade-in zoom-in-95 duration-150">
                            <div class="flex items-center justify-between">
                                <label class="block text-[11px] font-bold tracking-wider text-white">
                                    Halaman Awal & Akhir:
                                </label>
                                <button v-if="startPageInput || endPageInput" type="button" @click="resetRangeToAuto"
                                    class="text-[10px] font-bold text-sky-300 hover:text-white underline cursor-pointer">
                                    Reset ke Otomatis
                                </button>
                            </div>

                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[10px] text-white/90 font-medium mb-1">Mulai (Start):</label>
                                    <input v-model="startPageInput" type="text"
                                        :placeholder="`Otomatis (${computedRange?.startPageRaw || (lastEndPage + 1)})`"
                                        class="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white" />
                                </div>
                                <div>
                                    <label class="block text-[10px] text-white/90 font-medium mb-1">Sampai (End):</label>
                                    <input v-model="endPageInput" type="text"
                                        :placeholder="`Otomatis (${computedRange?.endPageRaw || computedRange?.endPage || 0})`"
                                        class="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white" />
                                </div>
                            </div>

                            <div v-if="!progressResult.isValid && !progressResult.errorMessage?.includes('halaman pembuka')"
                                class="rounded-lg bg-red-500/20 border border-red-500/30 p-2 text-[11px] text-red-200 font-semibold leading-tight flex items-center gap-1.5 animate-in fade-in duration-150">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-red-300">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <span>{{ progressResult.errorMessage }}</span>
                            </div>

                            <p v-else class="text-[11px] text-white/90 leading-tight">
                                *Mendukung angka normal (1, 15) atau Romawi (iv, ix). Kosongkan untuk otomatis mengikuti halaman terakhir (Hal {{ computedRange?.endPageRaw || computedRange?.endPage || 0 }}).
                            </p>

                            <div class="pt-2 border-t border-white/10 space-y-2">
                                <label class="flex items-start gap-2 select-none text-white cursor-not-allowed opacity-80">
                                    <input type="checkbox" :checked="isPrefaceCheckboxActive" disabled
                                        class="mt-0.5 rounded border-white/30 text-sky-500 focus:ring-0 focus:ring-offset-0 shrink-0 cursor-not-allowed" />
                                    <span class="text-[11px] font-medium leading-snug">
                                        Tambah jumlah halaman dengan preface
                                    </span>
                                </label>
                                <p class="text-[10px] text-white/60 pl-5">
                                    <span v-if="isRomanDetected">
                                        *Otomatis aktif karena input halaman berupa Romawi.
                                    </span>
                                    <span v-else-if="isArabicRangeDetected">
                                        *Otomatis nonaktif (terkunci) untuk rentang penomoran Arab murni.
                                    </span>
                                    <span v-else>
                                        *Otomatis nonaktif (terkunci). Masukkan angka Romawi pada rentang halaman untuk mengaktifkan.
                                    </span>
                                </p>

                                <div v-if="isPrefaceCheckboxActive || (historicalTotalPreface > 0 && isRangeExpanded)" class="pt-1 space-y-1 animate-in fade-in duration-150">
                                    <label class="block text-[10px] font-bold"
                                        :class="isPrefaceCheckboxActive ? 'text-sky-200' : 'text-white/40'">
                                        Total Halaman Pembuka (Buku):
                                    </label>
                                    <input v-model="totalPrefacePagesInput" type="text" placeholder="Contoh: 5 atau v"
                                        :disabled="!isPrefaceCheckboxActive"
                                        class="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed" />
                                    
                                    <p v-if="!isPrefaceCheckboxActive" class="text-[10px] text-white/50 leading-relaxed pl-0.5">
                                        *Masukkan angka Romawi pada rentang halaman untuk mengisi atau mengubah.
                                    </p>
                                    <div v-else-if="isPrefaceReduced || (progressResult.errorMessage && progressResult.errorMessage.includes('halaman pembuka'))" class="rounded-lg bg-red-500/20 border border-red-500/30 p-2 text-[10px] text-red-200 font-semibold leading-tight flex items-start gap-1.5 animate-in fade-in duration-150">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-red-300 mt-0.5">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                        <span>{{ progressResult.errorMessage || `Total halaman pembuka (${parsedTotalPrefacePages}) tidak boleh lebih sedikit dari angka Romawi tertinggi di histori (${historicalTotalPreface} hal).` }}</span>
                                    </div>
                                    <div v-else-if="isPrefaceIncreased" class="rounded-lg bg-amber-500/20 border border-amber-500/30 p-2 text-[10px] text-amber-200 font-medium leading-tight flex items-start gap-1.5 animate-in fade-in duration-150">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-amber-300 mt-0.5">
                                            <circle cx="12" cy="12" r="10" />
                                        </svg>
                                        <span>Total halaman pembuka bertambah dari {{ historicalTotalPreface }} menjadi {{ parsedTotalPrefacePages }} hal. Anda akan diminta konfirmasi sebelum menyimpan.</span>
                                    </div>
                                    <p v-else class="text-[10px] text-white/80 leading-relaxed">
                                        *Wajib diisi jika menggunakan penomoran Romawi.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <button type="button" @click="isDateExpanded = !isDateExpanded"
                            class="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white/10 hover:bg-white/15 px-3.5 py-2.5 text-xs font-semibold text-white transition-colors focus:outline-none">
                            <div class="flex items-center gap-2 min-w-0">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="shrink-0 text-sky-300">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                                <span class="truncate">
                                    Tanggal: <span class="text-sky-300 font-bold">{{ formattedSelectedDate }}</span>
                                </span>
                            </div>
                            <div class="flex items-center gap-1.5 shrink-0">
                                <span class="text-xs text-white font-semibold" v-if="!isDateExpanded">Ubah</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="transition-transform duration-200 text-white"
                                    :class="isDateExpanded ? 'rotate-180' : ''">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </div>
                        </button>

                        <div v-show="isDateExpanded"
                            class="space-y-2.5 rounded-xl bg-white/10 backdrop-blur-md p-3 shadow-inner animate-in fade-in zoom-in-95 duration-150">
                            <div class="flex items-center justify-between">
                                <label class="block text-[11px] font-bold tracking-wider text-white">
                                    Pilih Tanggal Sesi:
                                </label>
                                <span v-if="lastSessionFormatted" class="text-[10px] text-sky-200">
                                    Sesi lalu: {{ lastSessionFormatted }}
                                </span>
                            </div>
                            <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                                <input v-model="selectedDate" type="date" :max="todayDateString"
                                    @change="userChangedDate = true"
                                    class="w-full sm:flex-1 glass-input rounded-lg px-3 py-1.5 text-xs font-semibold text-white" />
                                <div class="flex items-center gap-1.5 shrink-0" v-if="selectedDate !== todayDateString || (lastSessionDateString && selectedDate !== lastSessionDateString)">
                                    <button v-if="selectedDate !== todayDateString" type="button" @click="selectedDate = todayDateString; userChangedDate = true"
                                        title="Reset ke hari ini"
                                        class="btn-sunset-secondary flex-1 sm:flex-initial rounded-lg px-2.5 py-1.5 text-xs font-semibold text-white">
                                        Hari Ini
                                    </button>
                                    <button v-if="lastSessionDateString && selectedDate !== lastSessionDateString" type="button"
                                        @click="selectedDate = lastSessionDateString; userChangedDate = true"
                                        title="Samakan dengan tanggal sesi terakhir"
                                        class="btn-sunset-secondary flex-1 sm:flex-initial rounded-lg px-2.5 py-1.5 text-xs font-semibold text-sky-300">
                                        Sesi Lalu
                                    </button>
                                </div>
                            </div>
                            <p class="text-[10px] text-white/80">
                                *Otomatis tercatat untuk tanggal hari ini jika tidak diubah.
                            </p>
                        </div>
                    </div>

                    <button v-if="book" type="button" @click="handleGoToTracking"
                        class="flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-sky-500/20 border border-sky-500/30 py-2.5 text-xs font-bold text-sky-300 hover:bg-sky-500/30 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span>Buka Halaman Tracking & Timer</span>
                    </button>
                </div>

                <div class="shrink-0 px-4 py-3 sm:px-5 sm:py-3.5 border-t border-white/10 bg-black/15 backdrop-blur-md flex gap-2.5 sm:gap-3">
                    <button type="button" @click="close"
                        class="btn-sunset-secondary flex-1 py-2.5 rounded-xl text-xs font-semibold text-white active:scale-95 transition-transform">
                        Batal
                    </button>
                    <button type="submit" :disabled="!isSubmitValid"
                        class="btn-sunset-primary flex-1 py-2.5 rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-transform">
                        Simpan
                    </button>
                </div>
            </form>
        </div>

        <div v-if="showPrefaceConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <div class="absolute inset-0 bg-black/50 backdrop-blur-md" @click="showPrefaceConfirmModal = false"></div>
            <div class="relative liquid-glass-modal rounded-2xl w-full max-w-sm overflow-hidden p-4 sm:p-5 space-y-3.5 sm:space-y-4 animate-in zoom-in-95 duration-150 text-white shadow-2xl">
                <div class="flex items-center gap-2 text-amber-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    <h3 class="font-bold text-sm">Konfirmasi Perubahan</h3>
                </div>
                <p class="text-xs leading-relaxed text-white/90">
                    Anda mengubah total halaman pembuka (dari {{ historicalTotalPreface }} menjadi {{ parsedTotalPrefacePages }} halaman). Apakah Anda yakin mengubah total halaman pembuka?
                </p>
                <div class="flex gap-2.5 pt-1">
                    <button type="button" @click="showPrefaceConfirmModal = false"
                        class="btn-sunset-secondary flex-1 py-2 rounded-xl text-xs font-semibold text-white">
                        Batal
                    </button>
                    <button type="button" @click="confirmAndSave"
                        class="btn-sunset-primary flex-1 py-2 rounded-xl text-xs font-bold text-white">
                        Ya, Yakin
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Book } from '~/types/book'
import {
    getLastEndPage,
    calculateReadingProgress,
    parsePageInput,
    romanToInt,
    isRomanNumeral,
    intToRoman,
    getBookTotalPrefacePages,
    getBookIncludePreface,
    getEffectiveTotalPages,
    bookHasRomanHistory,
    getHistoricalTotalPrefacePages,
    calculateProgressPercentage,
    getReadAbsolutePages
} from '~/utils/readingProgress'

const props = defineProps<{
    isOpen: boolean
    book: Book | null
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', payload: {
        book: Book
        newPages: number
        date?: string
        isDateModified?: boolean
        startPage?: number
        endPage?: number
        startPageRaw?: string
        endPageRaw?: string
        displayRange?: string
        isRoman?: boolean
        includePrefacePages?: boolean
        totalPrefacePages?: number
        pagesAdded?: number
    }): void
}>()

const pagesRead = ref(1)
const userModifiedPagesRead = ref(false)
const isDateExpanded = ref(false)
const userChangedDate = ref(false)

const isRangeExpanded = ref(false)
const startPageInput = ref('')
const endPageInput = ref('')
const totalPrefacePagesInput = ref('')

const lastEndPage = computed(() => {
    return getLastEndPage(props.book)
})

const lastSession = computed(() => {
    if (props.book?.readHistory && props.book.readHistory.length > 0) {
        return props.book.readHistory[props.book.readHistory.length - 1]
    }
    return null
})

const lastSessionFormatted = computed(() => {
    if (!lastSession.value?.date) return null
    try {
        const d = new Date(lastSession.value.date)
        if (isNaN(d.getTime())) return null
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    } catch {
        return null
    }
})

const lastSessionDateString = computed(() => {
    if (!lastSession.value?.date) return null
    try {
        const d = new Date(lastSession.value.date)
        if (isNaN(d.getTime())) return null
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    } catch {
        return null
    }
})

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

const isRomanDetected = computed(() => {
    const pStart = parsePageInput(startPageInput.value)
    const pEnd = parsePageInput(endPageInput.value)
    return Boolean(pStart?.isRoman || pEnd?.isRoman)
})

const isArabicRangeDetected = computed(() => {
    const pStart = parsePageInput(startPageInput.value)
    const pEnd = parsePageInput(endPageInput.value)
    return Boolean(pStart && pEnd && !pStart.isRoman && !pEnd.isRoman)
})

const bookHasRoman = computed(() => {
    return bookHasRomanHistory(props.book)
})

const isRangeSpecified = computed(() => {
    return Boolean(startPageInput.value.trim() || endPageInput.value.trim())
})

const historicalTotalPreface = computed(() => {
    return getHistoricalTotalPrefacePages(props.book)
})

const isCheckboxLocked = computed(() => true)

const isPrefaceCheckboxActive = computed<boolean>(() => {
    return isRomanDetected.value
})

const includePrefacePages = computed(() => {
    return isPrefaceCheckboxActive.value
})

const parsedTotalPrefacePages = computed(() => {
    if (!isPrefaceCheckboxActive.value) {
        return 0
    }
    const str = (totalPrefacePagesInput.value || '').trim()
    if (!str) {
        return 0
    }
    if (isRomanNumeral(str)) {
        return romanToInt(str)
    }
    const num = parseInt(str, 10)
    return isNaN(num) ? 0 : num
})

const isPrefaceReduced = computed(() => {
    if (!isPrefaceCheckboxActive.value) return false
    if (historicalTotalPreface.value <= 0) return false
    if (!totalPrefacePagesInput.value.trim()) return true
    return parsedTotalPrefacePages.value < historicalTotalPreface.value
})

const isPrefaceIncreased = computed(() => {
    if (!isPrefaceCheckboxActive.value) return false
    const base = historicalTotalPreface.value > 0 ? historicalTotalPreface.value : (props.book?.totalPrefacePages ? Number(props.book.totalPrefacePages) : 0)
    if (base <= 0) return false
    return parsedTotalPrefacePages.value > base
})

const showPrefaceConfirmModal = ref(false)

const modalTotalPrefaceCount = computed(() => {
    if (parsedTotalPrefacePages.value > 0) {
        return parsedTotalPrefacePages.value
    }
    if (props.book?.totalPrefacePages && Number(props.book.totalPrefacePages) > 0) {
        return Number(props.book.totalPrefacePages)
    }
    return historicalTotalPreface.value || 0
})

const effectiveTotalPages = computed(() => {
    const base = Number(props.book?.totalPages) || 0
    const tp = modalTotalPrefaceCount.value
    if (tp > 0) {
        return base + tp
    }
    return base
})

const modalBookPagesRead = computed(() => {
    if (!props.book) return 0
    if (Array.isArray(props.book.readHistory) && props.book.readHistory.length > 0) {
        const tp = modalTotalPrefaceCount.value
        const readSet = getReadAbsolutePages(props.book.readHistory, tp, tp > 0)
        const eff = effectiveTotalPages.value
        return eff > 0 ? Math.min(readSet.size, eff) : readSet.size
    }
    const eff = effectiveTotalPages.value
    const val = Number(props.book.pagesRead) || 0
    return eff > 0 ? Math.min(val, eff) : val
})

const modalPercentage = computed(() => {
    if (!props.book || effectiveTotalPages.value <= 0) return 0
    return calculateProgressPercentage(modalBookPagesRead.value, effectiveTotalPages.value)
})

const modalProgressWidth = computed(() => {
    if (effectiveTotalPages.value <= 0) return 0
    if (modalBookPagesRead.value >= effectiveTotalPages.value) return 100
    return Math.min(99, (modalBookPagesRead.value / effectiveTotalPages.value) * 100)
})

const pagesDelta = computed(() => {
    return Math.max(1, Number(pagesRead.value) || 1)
})

const progressResult = computed(() => {
    return calculateReadingProgress({
        book: props.book,
        startInput: startPageInput.value,
        endInput: endPageInput.value,
        pagesDelta: pagesDelta.value,
        includePrefacePages: includePrefacePages.value || modalTotalPrefaceCount.value > 0,
        totalPrefaceInput: parsedTotalPrefacePages.value > 0 ? parsedTotalPrefacePages.value : modalTotalPrefaceCount.value
    })
})

const computedRange = computed(() => progressResult.value)

const formattedRangeDisplay = computed(() => {
    const range = progressResult.value
    if (!range.isValid) {
        // return range.errorMessage || 'Rentang tidak valid'
        return 'Rentang tidak valid'
    }
    return range.displayRange
})

const isSubmitValid = computed(() => {
    if (!props.book) return false
    if (isPrefaceReduced.value) return false
    return progressResult.value.isValid && progressResult.value.pagesAdded > 0
})

const resetRangeToAuto = () => {
    startPageInput.value = ''
    endPageInput.value = ''
    pagesRead.value = 1
    userModifiedPagesRead.value = false
}

watch([startPageInput, endPageInput, includePrefacePages, totalPrefacePagesInput], () => {
    if (isRangeSpecified.value) {
        const res = progressResult.value
        if (res.isValid && res.pagesAdded > 0) {
            pagesRead.value = res.pagesAdded
        }
    }
})

watch(
    () => [props.isOpen, props.book],
    ([newOpen, newBook]) => {
        if (newOpen && newBook) {
            const b = newBook as Book
            pagesRead.value = 1
            userModifiedPagesRead.value = false
            isDateExpanded.value = false
            userChangedDate.value = false
            selectedDate.value = getTodayDateString()
            isRangeExpanded.value = false
            startPageInput.value = ''
            endPageInput.value = ''
            showPrefaceConfirmModal.value = false

            const tp = getHistoricalTotalPrefacePages(b)
            totalPrefacePagesInput.value = tp > 0 ? String(tp) : ''
        }
    },
    { immediate: true }
)

const validate = () => {
    if (pagesRead.value < 1) pagesRead.value = 1
    const maxP = effectiveTotalPages.value > 0 ? effectiveTotalPages.value : 999999
    if (pagesRead.value > maxP) {
        pagesRead.value = maxP
    }
}

const increment = () => {
    if (isRangeSpecified.value) return
    userModifiedPagesRead.value = true
    const maxP = effectiveTotalPages.value > 0 ? effectiveTotalPages.value : 999999
    if (pagesRead.value < maxP) {
        pagesRead.value++
    }
}

const decrement = () => {
    if (isRangeSpecified.value) return
    userModifiedPagesRead.value = true
    if (pagesRead.value > 1) pagesRead.value--
}

const addPages = (amount: number) => {
    if (isRangeSpecified.value) return
    const current = Number(pagesRead.value) || 0
    const nextVal = (pagesRead.value === 1 && !userModifiedPagesRead.value) ? amount : current + amount
    userModifiedPagesRead.value = true
    const maxP = effectiveTotalPages.value > 0 ? effectiveTotalPages.value : 999999
    pagesRead.value = Math.min(maxP, Math.max(1, nextVal))
}

const markCompleted = () => {
    if (isRangeSpecified.value) return
    userModifiedPagesRead.value = true
    const remaining = Math.max(1, effectiveTotalPages.value - modalBookPagesRead.value)
    pagesRead.value = remaining
}

const close = () => {
    emit('close')
}

const handleGoToTracking = () => {
    const bookId = props.book?.id
    close()
    if (bookId !== undefined && bookId !== null) {
        navigateTo(`/tracking?id=${bookId}`)
    } else {
        navigateTo('/tracking')
    }
}

const handleSave = () => {
    if (!props.book || !isSubmitValid.value) return
    if (isPrefaceIncreased.value) {
        showPrefaceConfirmModal.value = true
        return
    }
    executeSave()
}

const confirmAndSave = () => {
    showPrefaceConfirmModal.value = false
    executeSave()
}

const executeSave = () => {
    if (!props.book) return
    validate()
    const result = progressResult.value
    emit('save', {
        book: props.book,
        newPages: result.projectedPagesRead,
        date: selectedDate.value,
        isDateModified: userChangedDate.value,
        startPage: result.startPage,
        endPage: result.endPage,
        startPageRaw: result.startPageRaw,
        endPageRaw: result.endPageRaw,
        displayRange: result.displayRange,
        isRoman: result.isRoman,
        includePrefacePages: result.includePrefacePages,
        totalPrefacePages: result.totalPrefacePages > 0 ? result.totalPrefacePages : undefined,
        pagesAdded: result.pagesAdded
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