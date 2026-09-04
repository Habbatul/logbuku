<template>
    <div class="mt-6 flex flex-col gap-3">
        <div class="flex flex-col gap-2.5 sm:flex-row">
            <div class="relative min-w-0 flex-1">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg class="text-sky-300" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>

                <input v-model="searchQuery" type="text" placeholder="Cari judul atau penulis..."
                    class="glass-input w-full py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-white/75" />
            </div>

            <select v-model="selectedTopic"
                class="glass-input w-full cursor-pointer px-3 py-2.5 text-xs sm:text-sm font-semibold text-white sm:w-48">
                <option class="bg-[#245466] text-white" value="">Semua Topik</option>
                <option class="bg-[#245466] text-white" v-for="topic in uniqueTopics" :key="topic" :value="topic">
                    {{ topic }}
                </option>
            </select>

            <select v-model="sortBy"
                class="glass-input w-full cursor-pointer px-3 py-2.5 text-xs sm:text-sm font-semibold text-white sm:w-48">
                <option class="bg-[#245466] text-white" value="default">Urutkan: Default</option>
                <option class="bg-[#245466] text-white" value="terbaru">Terbaru (Tgl Beli)</option>
                <option class="bg-[#245466] text-white" value="terlama">Terlama (Tgl Beli)</option>
                <option class="bg-[#245466] text-white" value="harga_tinggi">Harga Tertinggi</option>
                <option class="bg-[#245466] text-white" value="harga_rendah">Harga Terendah</option>
            </select>

            <button @click="showFilters = !showFilters" type="button"
                class="inline-flex w-full shrink-0 cursor-pointer items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium transition-all sm:w-auto"
                :class="showFilters ? 'btn-sunset-primary' : 'btn-sunset-secondary'">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
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