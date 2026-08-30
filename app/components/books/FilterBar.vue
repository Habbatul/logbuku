<template>
    <div class="mt-6 flex flex-col gap-3">
        <div class="flex flex-col gap-2 sm:flex-row">
            <div class="relative min-w-0 flex-1">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg class="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>

                <input v-model="searchQuery" type="text" placeholder="Cari judul buku..."
                    class="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
            </div>

            <select v-model="selectedTopic"
                class="w-full cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5 sm:w-48">
                <option value="">Semua Topik</option>
                <option v-for="topic in uniqueTopics" :key="topic" :value="topic">
                    {{ topic }}
                </option>
            </select>

            <select v-model="sortBy"
                class="w-full cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5 sm:w-48">
                <option value="default">Urutkan: Default</option>
                <option value="terbaru">Terbaru (Tgl Beli)</option>
                <option value="terlama">Terlama (Tgl Beli)</option>
                <option value="harga_tinggi">Harga Tertinggi</option>
                <option value="harga_rendah">Harga Terendah</option>
            </select>

            <button @click="showFilters = !showFilters" type="button"
                class="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:w-auto"
                :class="showFilters
                        ? 'border-gray-900 bg-gray-900 text-white hover:bg-black'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                    ">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filter Lanjutan
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