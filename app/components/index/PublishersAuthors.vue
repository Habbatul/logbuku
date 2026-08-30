<template>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section
            class="flex min-w-0 flex-col overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
            <div class="flex items-center justify-between gap-2.5 sm:gap-3 border-b-2 border-[#0d0d0d] px-4 py-3.5 sm:px-5 sm:py-4">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0 text-[#0d0d0d]">
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
                        <h3 class="text-sm sm:text-base font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-snug break-words">
                            "Top 5 Penerbit"
                        </h3>
                    </div>
                    <p class="mt-1 text-xs sm:text-sm leading-relaxed text-[#44403c]">
                        Penerbit dengan jumlah arsip koleksi terbanyak.
                    </p>
                </div>

                <NuxtLink to="/publishers"
                    class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1 sm:px-3 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] transition-all hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] active:translate-x-0.5 active:translate-y-0.5"
                    title="Buka Manajemen Penerbit">
                    <span>[PENERBIT]</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </NuxtLink>
            </div>

            <div class="space-y-3 sm:space-y-3.5 p-4 sm:p-5">
                <div v-if="top5Publishers.length === 0" class="py-8 text-center font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">
                    [BELUM ADA DATA PENERBIT]
                </div>
                <div v-for="(item, idx) in top5Publishers" :key="item.name" class="space-y-1.5">
                    <div class="flex items-center justify-between gap-2.5 sm:gap-3">
                        <div class="flex min-w-0 items-center gap-2">
                            <span class="w-5 sm:w-6 shrink-0 font-mono text-xs sm:text-sm font-bold tabular-nums text-[#57534e]">
                                #{{ idx + 1 }}
                            </span>
                            <span class="truncate text-xs sm:text-sm font-bold text-[#0d0d0d]"
                                :class="item.name === 'Penerbit Lainnya' ? 'italic text-[#57534e]' : ''">
                                {{ item.name }}
                            </span>
                        </div>
                        <span class="shrink-0 font-mono text-xs sm:text-sm font-bold tabular-nums text-[#0d0d0d]">
                            {{ item.count }} <span class="font-bold text-[#57534e]">BUKU</span>
                        </span>
                    </div>
                    <div class="h-2.5 w-full border border-[#0d0d0d] bg-[#f3ede2] rounded-[2px] p-[1px]">
                        <div class="h-full transition-all duration-500"
                            :class="item.name === 'Penerbit Lainnya' ? 'bg-[#e5dfd3]' : 'bg-[#0d0d0d]'"
                            :style="{ width: `${(item.count / maxPublisherCount) * 100}%` }">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="flex min-w-0 flex-col overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
            <div class="flex items-center justify-between gap-2.5 sm:gap-3 border-b-2 border-[#0d0d0d] px-4 py-3.5 sm:px-5 sm:py-4">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0 text-[#0d0d0d]">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                        <h3 class="text-sm sm:text-base font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-snug break-words">
                            "Top 5 Penulis"
                        </h3>
                    </div>
                    <p class="mt-1 text-xs sm:text-sm leading-relaxed text-[#44403c]">
                        Penulis dengan karya terbanyak di katalog arsip.
                    </p>
                </div>

                <NuxtLink to="/authors"
                    class="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1 sm:px-3 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] transition-all hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] active:translate-x-0.5 active:translate-y-0.5"
                    title="Buka Manajemen Penulis">
                    <span>[PENULIS]</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </NuxtLink>
            </div>

            <div class="space-y-3 sm:space-y-3.5 p-4 sm:p-5">
                <div v-if="top5Authors.length === 0" class="py-8 text-center font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">
                    [BELUM ADA DATA PENULIS]
                </div>
                <div v-for="(item, idx) in top5Authors" :key="item.name" class="space-y-1.5">
                    <div class="flex items-center justify-between gap-2.5 sm:gap-3">
                        <div class="flex min-w-0 items-center gap-2">
                            <span class="w-5 sm:w-6 shrink-0 font-mono text-xs sm:text-sm font-bold tabular-nums text-[#57534e]">
                                #{{ idx + 1 }}
                            </span>
                            <span class="truncate text-xs sm:text-sm font-bold text-[#0d0d0d]">
                                {{ item.name }}
                            </span>
                        </div>
                        <span class="shrink-0 font-mono text-xs sm:text-sm font-bold tabular-nums text-[#0d0d0d]">
                            {{ item.count }} <span class="font-bold text-[#57534e]">BUKU</span>
                        </span>
                    </div>
                    <div class="h-2.5 w-full border border-[#0d0d0d] bg-[#f3ede2] rounded-[2px] p-[1px]">
                        <div class="h-full bg-[#0d0d0d] transition-all duration-500"
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
