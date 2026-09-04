<template>
    <div v-if="show" class="surface-card2 rounded-2xl border border-white/14 p-5 mt-4 animate-in fade-in slide-in-from-top-2">
        <div class="mb-5 flex flex-wrap items-center gap-3">
            <label for="pinOrder"
                class="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold select-none transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                :class="respectPinned
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                        : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
                    ">
                <span class="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <input type="checkbox" id="pinOrder" v-model="respectPinned"
                        class="peer absolute inset-0 m-0 cursor-pointer opacity-0" />

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="h-4 w-4" :class="respectPinned
                                ? 'fill-sky-400 text-sky-400'
                                : 'fill-none text-white'
                            " stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m12 17 5 3-1.5-5.7L20 10.5l-5.8-.4L12 5l-2.2 5.1-5.8.4 4.5 3.8L7 20l5-3Z" />
                    </svg>
                </span>
                <span>Utamakan Pin</span>
            </label>

            <label for="hideBtns"
                class="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-semibold select-none transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                :class="hideActionButtons
                        ? 'bg-white/25 text-white border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.15)]'
                        : 'bg-white/15 text-white border border-white/20 hover:bg-white/25'
                    ">
                <span class="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <input type="checkbox" id="hideBtns" v-model="hideActionButtons"
                        class="peer absolute inset-0 m-0 cursor-pointer opacity-0" />

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="h-4 w-4" :class="hideActionButtons
                                ? 'text-sky-400'
                                : 'text-white'
                            " fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                    </svg>
                </span>
                <span>Sembunyikan Tombol Kartu</span>
            </label>
        </div>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">
                    Tanggal Beli
                </label>
                <div class="flex min-w-0 items-center gap-2">
                    <input v-model="startDate" type="date"
                        class="glass-input min-w-0 w-full px-3 py-2 text-xs text-white" />
                    <span class="shrink-0 text-xs font-bold text-white">—</span>
                    <input v-model="endDate" type="date"
                        class="glass-input min-w-0 w-full px-3 py-2 text-xs text-white" />
                </div>
            </div>

            <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">
                    Range Harga (Rp)
                </label>
                <div class="flex min-w-0 items-center gap-2">
                    <input v-model.number="minPrice" type="number" placeholder="Min"
                        class="glass-input hide-arrows min-w-0 w-full px-3 py-2 text-xs text-white placeholder:text-white/75" />
                    <span class="shrink-0 text-xs font-bold text-white">—</span>
                    <input v-model.number="maxPrice" type="number" placeholder="Max"
                        class="glass-input hide-arrows min-w-0 w-full px-3 py-2 text-xs text-white placeholder:text-white/75" />
                </div>
            </div>

            <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">
                    Total Halaman
                </label>
                <div class="flex min-w-0 items-center gap-2">
                    <input v-model.number="minPages" type="number" placeholder="Min"
                        class="glass-input hide-arrows min-w-0 w-full px-3 py-2 text-xs text-white placeholder:text-white/75" />
                    <span class="shrink-0 text-xs font-bold text-white">—</span>
                    <input v-model.number="maxPages" type="number" placeholder="Max"
                        class="glass-input hide-arrows min-w-0 w-full px-3 py-2 text-xs text-white placeholder:text-white/75" />
                </div>
            </div>
        </div>

        <div class="mt-5 grid grid-cols-1 gap-5 pt-2 sm:grid-cols-2">
            <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">
                    Penulis
                </label>
                <select v-model="selectedAuthor"
                    class="glass-input min-w-0 w-full cursor-pointer px-3 py-2 text-xs font-semibold text-white">
                    <option class="bg-[#245466] text-white" value="">Semua Penulis</option>
                    <option class="bg-[#245466] text-white" v-for="author in uniqueAuthors" :key="author" :value="author">
                        {{ author }}
                    </option>
                </select>
            </div>

            <div>
                <label class="mb-1.5 block text-xs font-bold uppercase tracking-wider text-white">
                    Penerbit
                </label>
                <select v-model="selectedPublisher"
                    class="glass-input min-w-0 w-full cursor-pointer px-3 py-2 text-xs font-semibold text-white">
                    <option class="bg-[#245466] text-white" value="">Semua Penerbit</option>
                    <option class="bg-[#245466] text-white" v-for="pub in uniquePublishers" :key="pub" :value="pub">
                        {{ pub }}
                    </option>
                </select>
            </div>
        </div>

        <div class="mt-5 flex justify-end pt-2">
            <button @click="$emit('reset')" type="button" title="Reset Semua Filter"
                class="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-rose-300 bg-rose-500/20 border border-rose-500/30 hover:bg-rose-500/30 hover:scale-105 active:scale-95 transition-all">
                <svg class="h-3.5 w-3.5"
                    xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
                <span>Reset Filter</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    show: boolean
    uniqueAuthors?: string[]
    uniquePublishers?: string[]
}>()

defineEmits<{
    (e: 'reset'): void
}>()

const respectPinned = defineModel<boolean>('respectPinned', { default: true })
const hideActionButtons = defineModel<boolean>('hideActionButtons', { default: false })
const startDate = defineModel<string>('startDate', { default: '' })
const endDate = defineModel<string>('endDate', { default: '' })
const minPrice = defineModel<number | ''>('minPrice', { default: '' })
const maxPrice = defineModel<number | ''>('maxPrice', { default: '' })
const minPages = defineModel<number | ''>('minPages', { default: '' })
const maxPages = defineModel<number | ''>('maxPages', { default: '' })
const selectedAuthor = defineModel<string>('selectedAuthor', { default: '' })
const selectedPublisher = defineModel<string>('selectedPublisher', { default: '' })
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