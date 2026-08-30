<template>
    <div v-if="show" class="mt-4 rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d] animate-in fade-in slide-in-from-top-2 duration-150">
        <div class="mb-5 flex flex-wrap items-center gap-3">
            <label for="pinOrder"
                class="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-[4px] border border-[#0d0d0d] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all select-none"
                :class="respectPinned
                        ? 'bg-[#0d0d0d] text-white shadow-[2px_2px_0px_#0d0d0d]'
                        : 'bg-[#f3ede2] text-[#44403c] hover:bg-white hover:text-[#0d0d0d]'
                    ">
                <span class="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <input type="checkbox" id="pinOrder" v-model="respectPinned"
                        class="peer absolute inset-0 m-0 cursor-pointer opacity-0" />

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="h-4 w-4 transition-all duration-150" :class="respectPinned
                                ? 'fill-[#ff4800] text-[#ff4800]'
                                : 'fill-none text-[#57534e] group-hover:text-[#0d0d0d]'
                            " stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m12 17 5 3-1.5-5.7L20 10.5l-5.8-.4L12 5l-2.2 5.1-5.8.4 4.5 3.8L7 20l5-3Z" />
                    </svg>
                </span>
                <span>[UTAMAKAN PIN]</span>
            </label>

            <label for="hideBtns"
                class="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-[4px] border border-[#0d0d0d] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider transition-all select-none"
                :class="hideActionButtons
                        ? 'bg-[#0d0d0d] text-white shadow-[2px_2px_0px_#0d0d0d]'
                        : 'bg-[#f3ede2] text-[#44403c] hover:bg-white hover:text-[#0d0d0d]'
                    ">
                <span class="relative flex h-4 w-4 shrink-0 items-center justify-center">
                    <input type="checkbox" id="hideBtns" v-model="hideActionButtons"
                        class="peer absolute inset-0 m-0 cursor-pointer opacity-0" />

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        class="h-4 w-4 transition-all duration-150" :class="hideActionButtons
                                ? 'text-[#ff4800]'
                                : 'text-[#57534e] group-hover:text-[#0d0d0d]'
                            " fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                    </svg>
                </span>
                <span>[SEMBUNYIKAN TOMBOL KARTU]</span>
            </label>
        </div>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div>
                <label class="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-[#57534e]">
                    [TANGGAL BELI]
                </label>
                <div class="flex min-w-0 items-center gap-2">
                    <input v-model="startDate" type="date"
                        class="min-w-0 w-full rounded-[4px] border-1.5 border-[#0d0d0d] bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none transition-all focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff]" />
                    <span class="shrink-0 font-mono text-xs font-bold text-[#57534e]">—</span>
                    <input v-model="endDate" type="date"
                        class="min-w-0 w-full rounded-[4px] border-1.5 border-[#0d0d0d] bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none transition-all focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff]" />
                </div>
            </div>

            <div>
                <label class="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-[#57534e]">
                    [RANGE HARGA (RP)]
                </label>
                <div class="flex min-w-0 items-center gap-2">
                    <input v-model.number="minPrice" type="number" placeholder="Min"
                        class="hide-arrows min-w-0 w-full rounded-[4px] border-1.5 border-[#0d0d0d] bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none transition-all placeholder:text-[#57534e] placeholder:font-normal focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff]" />
                    <span class="shrink-0 font-mono text-xs font-bold text-[#57534e]">—</span>
                    <input v-model.number="maxPrice" type="number" placeholder="Max"
                        class="hide-arrows min-w-0 w-full rounded-[4px] border-1.5 border-[#0d0d0d] bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none transition-all placeholder:text-[#57534e] placeholder:font-normal focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff]" />
                </div>
            </div>

            <div>
                <label class="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-[#57534e]">
                    [TOTAL HALAMAN]
                </label>
                <div class="flex min-w-0 items-center gap-2">
                    <input v-model.number="minPages" type="number" placeholder="Min"
                        class="hide-arrows min-w-0 w-full rounded-[4px] border-1.5 border-[#0d0d0d] bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none transition-all placeholder:text-[#57534e] placeholder:font-normal focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff]" />
                    <span class="shrink-0 font-mono text-xs font-bold text-[#57534e]">—</span>
                    <input v-model.number="maxPages" type="number" placeholder="Max"
                        class="hide-arrows min-w-0 w-full rounded-[4px] border-1.5 border-[#0d0d0d] bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none transition-all placeholder:text-[#57534e] placeholder:font-normal focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff]" />
                </div>
            </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-5 border-t border-[#e5dfd3] pt-4 sm:grid-cols-2">
            <div>
                <label class="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-[#57534e]">
                    [PENULIS]
                </label>
                <select v-model="selectedAuthor"
                    class="min-w-0 w-full cursor-pointer rounded-[4px] border-1.5 border-[#0d0d0d] bg-white px-2.5 py-1.5 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none transition-colors hover:bg-[#f3ede2] focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff]">
                    <option value="">Semua Penulis</option>
                    <option v-for="author in uniqueAuthors" :key="author" :value="author">
                        {{ author }}
                    </option>
                </select>
            </div>

            <div>
                <label class="mb-1.5 block font-mono text-[11px] font-bold uppercase tracking-wider text-[#57534e]">
                    [PENERBIT]
                </label>
                <select v-model="selectedPublisher"
                    class="min-w-0 w-full cursor-pointer rounded-[4px] border-1.5 border-[#0d0d0d] bg-white px-2.5 py-1.5 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none transition-colors hover:bg-[#f3ede2] focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff]">
                    <option value="">Semua Penerbit</option>
                    <option v-for="pub in uniquePublishers" :key="pub" :value="pub">
                        {{ pub }}
                    </option>
                </select>
            </div>
        </div>

        <div class="mt-5 flex justify-end border-t border-[#e5dfd3] pt-4">
            <button @click="$emit('reset')" type="button" title="Reset Semua Filter"
                class="group inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#ff4800] shadow-[1.5px_1.5px_0px_#0d0d0d] transition-all hover:bg-white hover:text-[#0d0d0d] hover:shadow-[2px_2px_0px_#0d0d0d] active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
                <svg class="h-3.5 w-3.5 transition-transform duration-200 group-hover:-rotate-45"
                    xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                </svg>
                <span>RESET FILTER</span>
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