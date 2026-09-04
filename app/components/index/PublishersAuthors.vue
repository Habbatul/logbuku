<template>
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- Top 5 Penerbit (Azure Blue) -->
        <section class="surface-card rounded-2xl border border-white/14 overflow-hidden flex flex-col shadow-lg">
            <div class="flex items-center justify-between gap-3 px-5 py-4 bg-white/[0.06] border-b border-white/15">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0 text-sky-400">
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
                        <h3 class="text-sm sm:text-base font-bold tracking-tight text-white leading-snug">
                            Top 5 Penerbit
                        </h3>
                    </div>
                    <p class="mt-0.5 text-xs text-white leading-relaxed">
                        Penerbit dengan jumlah arsip koleksi terbanyak.
                    </p>
                </div>

                <NuxtLink to="/publishers"
                    class="btn-sunset-secondary inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                    title="Buka Manajemen Penerbit">
                    <span>Penerbit</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </NuxtLink>
            </div>

            <div class="space-y-3.5 p-5">
                <div v-if="top5Publishers.length === 0" class="py-8 text-center text-xs font-semibold text-white">
                    Belum ada data penerbit
                </div>
                <div v-for="(item, idx) in top5Publishers" :key="item.name" class="group space-y-1.5 p-2 -mx-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.05]">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex min-w-0 items-center gap-2.5">
                            <span class="w-6 shrink-0 text-xs font-bold tabular-nums text-sky-300">
                                #{{ idx + 1 }}
                            </span>
                            <span class="truncate text-xs sm:text-sm font-semibold text-white"
                                :class="item.name === 'Penerbit Lainnya' ? 'italic text-sky-200' : ''">
                                {{ item.name }}
                            </span>
                        </div>
                        <span class="shrink-0 text-xs sm:text-sm font-bold tabular-nums text-white">
                            {{ item.count }} <span class="font-normal text-white text-xs">buku</span>
                        </span>
                    </div>
                    <div class="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/[0.06]">
                        <div class="h-full rounded-full transition-all duration-500"
                            :class="item.name === 'Penerbit Lainnya' ? 'bg-white/40' : 'bg-gradient-to-r from-blue-500 to-sky-400 shadow-[0_0_8px_rgba(59,130,246,0.4)]'"
                            :style="{ width: `${(item.count / maxPublisherCount) * 100}%` }">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Top 5 Penulis (Fuchsia / Rose) -->
        <section class="surface-card rounded-2xl border border-white/14 overflow-hidden flex flex-col shadow-lg">
            <div class="flex items-center justify-between gap-3 px-5 py-4 bg-white/[0.06] border-b border-white/15">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0 text-pink-400">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                        </svg>
                        <h3 class="text-sm sm:text-base font-bold tracking-tight text-white leading-snug">
                            Top 5 Penulis
                        </h3>
                    </div>
                    <p class="mt-0.5 text-xs text-white leading-relaxed">
                        Penulis dengan karya terbanyak di katalog arsip.
                    </p>
                </div>

                <NuxtLink to="/authors"
                    class="btn-sunset-secondary inline-flex shrink-0 items-center gap-1.5 px-3 py-1.5 text-xs font-semibold"
                    title="Buka Manajemen Penulis">
                    <span>Penulis</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                </NuxtLink>
            </div>

            <div class="space-y-3.5 p-5">
                <div v-if="top5Authors.length === 0" class="py-8 text-center text-xs font-semibold text-white">
                    Belum ada data penulis
                </div>
                <div v-for="(item, idx) in top5Authors" :key="item.name" class="group space-y-1.5 p-2 -mx-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.05]">
                    <div class="flex items-center justify-between gap-3">
                        <div class="flex min-w-0 items-center gap-2.5">
                            <span class="w-6 shrink-0 text-xs font-bold tabular-nums text-pink-300">
                                #{{ idx + 1 }}
                            </span>
                            <span class="truncate text-xs sm:text-sm font-semibold text-white">
                                {{ item.name }}
                            </span>
                        </div>
                        <span class="shrink-0 text-xs sm:text-sm font-bold tabular-nums text-white">
                            {{ item.count }} <span class="font-normal text-white text-xs">buku</span>
                        </span>
                    </div>
                    <div class="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/[0.06]">
                        <div class="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 shadow-[0_0_8px_rgba(244,63,94,0.4)] transition-all duration-500"
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
