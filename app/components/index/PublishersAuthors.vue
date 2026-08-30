<template>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section
            class="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0 text-gray-600">
                            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                            <path d="M9 22v-4h6v4" />
                            <path d="M8 6h.01" />
                            <path d="M16 6h.01" />
                            <path d="M12 6h.01" />
                            <path d="M12 10h.01" />
                            <path d="M12 14h.01" />
                            <path d="M16 10h.01" />
                            <path d="M16 14h.01" />
                            <path d="M8 10h.01" />
                            <path d="M8 14h.01" />
                        </svg>
                        <h3 class="truncate text-sm font-semibold tracking-tight text-gray-950">
                            Top 5 Penerbit Terbanyak
                        </h3>
                    </div>
                    <p class="mt-1 text-[13px] text-gray-500">
                        Penerbit dengan jumlah koleksi terbanyak.
                    </p>
                </div>

                <NuxtLink to="/publishers"
                    class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/80 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    title="Buka Manajemen Penerbit">
                    <span>Penerbit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </NuxtLink>
            </div>

            <div class="space-y-4 p-5">
                <div v-if="top5Publishers.length === 0" class="py-8 text-center text-sm text-gray-400">
                    Belum ada data penerbit.
                </div>
                <div v-for="(item, idx) in top5Publishers" :key="item.name" class="space-y-2">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex min-w-0 items-center gap-2">
                            <span class="w-4 shrink-0 text-xs font-bold tabular-nums text-gray-400">
                                {{ idx + 1 }}.
                            </span>
                            <span class="truncate text-[13px] font-semibold text-gray-800"
                                :class="item.name === 'Penerbit Lainnya' ? 'italic text-gray-500' : ''">
                                {{ item.name }}
                            </span>
                        </div>
                        <span class="shrink-0 text-xs font-bold tabular-nums text-gray-900">
                            {{ item.count }} <span class="font-normal text-gray-400 text-[11px]">buku</span>
                        </span>
                    </div>
                    <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div class="h-full rounded-full transition-all duration-500"
                            :class="item.name === 'Penerbit Lainnya' ? 'bg-gray-400' : 'bg-blue-600'"
                            :style="{ width: `${(item.count / maxPublisherCount) * 100}%` }">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0 text-gray-600">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                        <h3 class="truncate text-sm font-semibold tracking-tight text-gray-950">
                            Top 5 Penulis Terbanyak
                        </h3>
                    </div>
                    <p class="mt-1 text-[13px] text-gray-500">
                        Penulis dengan jumlah karya terbanyak di koleksimu.
                    </p>
                </div>

                <NuxtLink to="/authors"
                    class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/80 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:text-gray-950 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                    title="Buka Manajemen Penulis">
                    <span>Penulis</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </NuxtLink>
            </div>

            <div class="space-y-4 p-5">
                <div v-if="top5Authors.length === 0" class="py-8 text-center text-sm text-gray-400">
                    Belum ada data penulis.
                </div>
                <div v-for="(item, idx) in top5Authors" :key="item.name" class="space-y-2">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex min-w-0 items-center gap-2">
                            <span class="w-4 shrink-0 text-xs font-bold tabular-nums text-gray-400">
                                {{ idx + 1 }}.
                            </span>
                            <span class="truncate text-[13px] font-semibold text-gray-800">
                                {{ item.name }}
                            </span>
                        </div>
                        <span class="shrink-0 text-xs font-bold tabular-nums text-gray-900">
                            {{ item.count }} <span class="font-normal text-gray-400 text-[11px]">buku</span>
                        </span>
                    </div>
                    <div class="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div class="h-full rounded-full bg-emerald-600 transition-all duration-500"
                            :style="{ width: `${(item.count / maxAuthorCount) * 100}%` }">
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    top5Publishers: Array<{
        name: string
        count: number
    }>
    maxPublisherCount: number
    top5Authors: Array<{
        name: string
        count: number
    }>
    maxAuthorCount: number
}>()
</script>
