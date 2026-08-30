<template>
    <div v-if="show" class="mt-3 rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5">
        <div class="mt-1 mb-5 flex flex-wrap items-center gap-x-4">
            <label for="pinOrder"
                class="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-transparent py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700">
                <span class="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <input type="checkbox" id="pinOrder" v-model="respectPinned"
                        class="peer absolute inset-0 m-0 cursor-pointer opacity-0" />

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="h-4 w-4 transition-all duration-150" :class="respectPinned
                                ? 'fill-gray-900 text-gray-900'
                                : 'fill-transparent text-gray-400 group-hover:text-gray-600'
                            " stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m12 17 5 3-1.5-5.7L20 10.5l-5.8-.4L12 5l-2.2 5.1-5.8.4 4.5 3.8L7 20l5-3Z" />
                    </svg>
                </span>
                <span>Utamakan buku yang di-Pin</span>
            </label>

            <label for="hideBtns"
                class="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-transparent py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700">
                <span class="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <input type="checkbox" id="hideBtns" v-model="hideActionButtons"
                        class="peer absolute inset-0 m-0 cursor-pointer opacity-0" />

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="h-4 w-4 transition-all duration-150" :class="hideActionButtons
                                ? 'fill-gray-900 text-gray-900'
                                : 'fill-transparent text-gray-400 group-hover:text-gray-600'
                            " stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                    </svg>
                </span>
                <span>Sembunyikan tombol</span>
            </label>
        </div>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
                <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Tanggal Beli
                </label>
                <div class="flex min-w-0 items-center gap-2">
                    <input v-model="startDate" type="date"
                        class="min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                    <span class="shrink-0 text-xs font-medium text-gray-300">—</span>
                    <input v-model="endDate" type="date"
                        class="min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                </div>
            </div>

            <div>
                <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Range Harga (Rp)
                </label>
                <div class="flex min-w-0 items-center gap-2">
                    <input v-model.number="minPrice" type="number" placeholder="Min"
                        class="hide-arrows min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                    <span class="shrink-0 text-xs font-medium text-gray-300">—</span>
                    <input v-model.number="maxPrice" type="number" placeholder="Max"
                        class="hide-arrows min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                </div>
            </div>

            <div>
                <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Total Halaman
                </label>
                <div class="flex min-w-0 items-center gap-2">
                    <input v-model.number="minPages" type="number" placeholder="Min"
                        class="hide-arrows min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                    <span class="shrink-0 text-xs font-medium text-gray-300">—</span>
                    <input v-model.number="maxPages" type="number" placeholder="Max"
                        class="hide-arrows min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                </div>
            </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-5 border-t border-gray-200/60 pt-4 sm:grid-cols-2">
            <div>
                <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Penulis
                </label>
                <select v-model="selectedAuthor"
                    class="min-w-0 w-full cursor-pointer rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5">
                    <option value="">Semua Penulis</option>
                    <option v-for="author in uniqueAuthors" :key="author" :value="author">
                        {{ author }}
                    </option>
                </select>
            </div>

            <div>
                <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                    Penerbit
                </label>
                <select v-model="selectedPublisher"
                    class="min-w-0 w-full cursor-pointer rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5">
                    <option value="">Semua Penerbit</option>
                    <option v-for="pub in uniquePublishers" :key="pub" :value="pub">
                        {{ pub }}
                    </option>
                </select>
            </div>
        </div>

        <div class="mt-5 flex justify-end border-t border-gray-200/80 pt-4">
            <button @click="$emit('reset')" type="button" title="Reset Semua Filter"
                class="group inline-flex cursor-pointer items-center gap-1.5 rounded px-2 py-1.5 text-[12px] font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                <svg class="h-3.5 w-3.5 transition-transform duration-200 group-hover:-rotate-45"
                    xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
                <span>Reset filter</span>
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