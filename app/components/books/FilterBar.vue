<template>
    <div class="mt-6 flex flex-col gap-3">
        <div class="flex flex-col gap-2.5 sm:flex-row">
            <div class="relative min-w-0 flex-1">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="text-[#57534e]" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>

                <input v-model="searchQuery" type="text" placeholder="CARI JUDUL / PENULIS..."
                    class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white py-2 pl-9 pr-4 font-mono text-xs font-bold text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] placeholder:text-[#57534e] placeholder:font-normal outline-none transition-all focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff]" />
            </div>

            <select v-model="selectedTopic"
                class="w-full cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-2 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] outline-none transition-colors hover:bg-[#f3ede2] focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff] sm:w-48">
                <option value="">Semua Topik</option>
                <option v-for="topic in uniqueTopics" :key="topic" :value="topic">
                    {{ topic }}
                </option>
            </select>

            <select v-model="sortBy"
                class="w-full cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-2 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] outline-none transition-colors hover:bg-[#f3ede2] focus:border-[#0047ff] focus:shadow-[2px_2px_0px_#0047ff] sm:w-48">
                <option value="default">Urutkan: Default</option>
                <option value="terbaru">Terbaru (Tgl Beli)</option>
                <option value="terlama">Terlama (Tgl Beli)</option>
                <option value="harga_tinggi">Harga Tertinggi</option>
                <option value="harga_rendah">Harga Terendah</option>
            </select>

            <button @click="showFilters = !showFilters" type="button"
                class="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[4px] border-2 border-[#0d0d0d] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] sm:w-auto"
                :class="showFilters
                        ? 'bg-[#0d0d0d] text-white hover:bg-[#262626] hover:shadow-[3px_3px_0px_#ff4800]'
                        : 'bg-white text-[#0d0d0d] hover:bg-[#f3ede2] hover:shadow-[3px_3px_0px_#0d0d0d]'
                    ">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                FILTER LANJUTAN
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { SortOption } from '~/types/book'

defineProps<{
    uniqueTopics: string[]
}>()

const searchQuery = defineModel<string>('searchQuery', { default: '' })
const selectedTopic = defineModel<string>('selectedTopic', { default: '' })
const sortBy = defineModel<SortOption | string>('sortBy', { default: 'default' })
const showFilters = defineModel<boolean>('showFilters', { default: false })
</script>