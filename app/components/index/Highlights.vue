<template>
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <!-- 3 Buku Termahal (Valuasi - Gold / Amber) -->
        <section class="surface-card rounded-2xl border border-white/14 overflow-hidden shadow-lg">
            <div class="flex items-center justify-between gap-3 px-5 py-4 bg-white/[0.06] border-b border-white/15">
                <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-bold tracking-tight text-white leading-snug">
                        3 Buku Termahal
                    </h3>
                    <p class="mt-0.5 text-xs text-white leading-relaxed">
                        Koleksi dengan nilai perolehan tertinggi.
                    </p>
                </div>
                <span class="rounded-full bg-amber-500/20 border border-amber-500/30 shrink-0 px-3 py-1 text-[11px] font-bold tracking-wider text-amber-300">
                    VALUASI
                </span>
            </div>
            <div class="p-4 space-y-1 divide-y divide-white/[0.06]">
                <div v-if="top3Expensive.length === 0" class="py-10 text-center text-xs font-semibold text-white">
                    Belum ada data harga
                </div>
                <div v-for="(book, i) in top3Expensive" :key="'exp-' + book.id"
                    class="group/item flex min-w-0 items-center gap-3.5 py-3 px-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.05]">
                    <div class="shrink-0 text-xs font-bold tabular-nums bg-amber-500/20 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded-lg">
                        #{{ String(i + 1).padStart(2, '0') }}
                    </div>
                    <div class="h-[64px] w-[44px] shrink-0 overflow-hidden rounded-lg bg-white/10 border border-white/[0.06]">
                        <img v-if="book.imageUrl" :src="book.imageUrl"
                            class="h-full w-full object-cover"
                            loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="line-clamp-2 text-xs sm:text-sm font-semibold text-white leading-snug break-words group-hover/item:text-amber-200 transition-colors">
                            {{ book.title }}
                        </h4>
                        <div class="mt-1">
                            <span class="text-xs sm:text-sm font-bold tracking-tight tabular-nums text-amber-300">
                                {{ formatCurrency(book.price) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- 3 Buku Terbaru (Akuisisi - Emerald) -->
        <section class="surface-card rounded-2xl border border-white/14 overflow-hidden shadow-lg">
            <div class="flex items-center justify-between gap-3 px-5 py-4 bg-white/[0.06] border-b border-white/15">
                <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-bold tracking-tight text-white leading-snug">
                        3 Buku Terbaru
                    </h3>
                    <p class="mt-0.5 text-xs text-white leading-relaxed">
                        Koleksi yang paling baru diarsipkan ke inventaris.
                    </p>
                </div>
                <span class="rounded-full bg-emerald-500/20 border border-emerald-500/30 shrink-0 px-3 py-1 text-[11px] font-bold tracking-wider text-emerald-300">
                    AKUISISI
                </span>
            </div>
            <div class="p-4 space-y-1 divide-y divide-white/[0.06]">
                <div v-if="top3Newest.length === 0" class="py-10 text-center text-xs font-semibold text-white">
                    Belum ada data buku
                </div>
                <div v-for="(book, i) in top3Newest" :key="'new-' + book.id"
                    class="group/item flex min-w-0 items-center gap-3.5 py-3 px-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.05]">
                    <div class="shrink-0 text-xs font-bold tabular-nums bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 px-2.5 py-1 rounded-lg">
                        #{{ String(i + 1).padStart(2, '0') }}
                    </div>
                    <div class="h-[64px] w-[44px] shrink-0 overflow-hidden rounded-lg bg-white/10 border border-white/[0.06]">
                        <img v-if="book.imageUrl" :src="book.imageUrl"
                            class="h-full w-full object-cover"
                            loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="line-clamp-2 text-xs sm:text-sm font-semibold text-white leading-snug break-words group-hover/item:text-emerald-200 transition-colors">
                            {{ book.title }}
                        </h4>
                        <p class="mt-1 text-xs font-semibold text-emerald-300 tabular-nums">
                            {{ new Date(book.date || book.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }) }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    top3Expensive: any[]
    top3Newest: any[]
}>()
</script>
