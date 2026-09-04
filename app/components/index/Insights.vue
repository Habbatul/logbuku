<template>
    <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <section class="surface-card rounded-2xl border border-white/14 flex min-w-0 flex-col overflow-visible shadow-lg">
            <div class="px-5 py-3.5 bg-white/[0.03] border-b border-white/[0.08]">
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <h3 class="text-sm font-bold text-white leading-snug">
                            Aktivitas Teratas
                        </h3>
                        <div class="relative flex shrink-0 items-center">
                            <button type="button" @click="activeInsightTooltip = activeInsightTooltip === 'activity' ? null : 'activity'"
                                class="cursor-pointer text-white transition-colors hover:text-sky-300 focus:outline-none"
                                aria-label="Info Aktivitas Teratas">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M12 16v-4" />
                                    <path d="M12 8h.01" />
                                </svg>
                            </button>

                            <Teleport to="body">
                                <div v-if="activeInsightTooltip === 'activity'"
                                    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                                    @click="activeInsightTooltip = null">
                                    <div @click.stop class="liquid-glass-tooltip relative w-full max-w-sm p-5 text-white shadow-2xl">
                                        <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-white/15">
                                            <span class="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                    <circle cx="12" cy="12" r="10"/>
                                                    <line x1="12" y1="16" x2="12" y2="12"/>
                                                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                                                </svg>
                                                Info Aktivitas Teratas
                                            </span>
                                            <button type="button" @click="activeInsightTooltip = null"
                                                class="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 hover:text-sky-300 transition-colors text-xs font-bold cursor-pointer"
                                                aria-label="Tutup">✕</button>
                                        </div>
                                        <p class="text-xs text-white leading-relaxed">
                                            Sesi pencatatan manual dihitung per rentang 1 jam, sedangkan sesi fitur Tracking dihitung per tiap sesi waktu membaca saat timer dihentikan.
                                        </p>
                                    </div>
                                </div>
                            </Teleport>
                        </div>
                    </div>
                    <span class="text-[11px] font-semibold uppercase tracking-wider text-white">
                        7 Hari Terakhir
                    </span>
                </div>
            </div>

            <div class="custom-scrollbar max-h-80 flex-1 overflow-y-auto px-5 py-1">
                <div v-if="mostReadBooksInsight.length === 0"
                    class="flex min-h-40 items-center justify-center py-6 text-center text-xs font-medium text-white">
                    Belum ada aktivitas membaca
                </div>
                <div v-for="(insight, idx) in mostReadBooksInsight" :key="'act-' + idx"
                    class="group flex gap-3.5 py-3 px-2 -mx-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.05]">
                    <div
                        class="h-[70px] w-[48px] shrink-0 overflow-hidden rounded-xl bg-white/10 shadow-sm border border-white/[0.08]">
                        <img v-if="insight.book.imageUrl" :src="insight.book.imageUrl"
                            class="h-full w-full object-cover" loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="line-clamp-2 text-xs sm:text-sm font-bold text-white leading-snug">
                            {{ insight.book.title }}
                        </h4>
                        <div class="mt-2 space-y-1 text-xs text-white">
                            <div class="flex items-center gap-1.5">
                                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"></span>
                                <span><strong class="font-extrabold tabular-nums text-white">{{ insight.sessions }}</strong> sesi baca</span>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400"></span>
                                <span><strong class="font-extrabold tabular-nums text-white">{{ insight.pagesAdded }}</strong> hal dibaca</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="surface-card rounded-2xl border border-white/14 flex min-w-0 flex-col overflow-hidden shadow-lg">
            <div class="flex items-center justify-between gap-2.5 px-5 py-3.5 bg-white/[0.03] border-b border-white/[0.08]">
                <h3 class="text-sm font-bold text-white leading-snug">
                    Sedang Dibaca
                </h3>
                <span class="rounded-full bg-amber-500/20 border border-amber-400/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                    Top 3
                </span>
            </div>
            <div class="custom-scrollbar max-h-80 flex-1 overflow-y-auto px-5 py-1">
                <div v-if="currentlyReadingList.length === 0"
                    class="flex min-h-40 items-center justify-center py-6 text-center text-xs font-medium text-white">
                    Tidak ada buku yang sedang dibaca
                </div>
                <div v-for="book in currentlyReadingList" :key="book.id"
                    class="group flex gap-3.5 py-3 px-2 -mx-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.05]">
                    <div class="h-[70px] w-[48px] shrink-0 overflow-hidden rounded-xl bg-white/10 shadow-sm border border-white/[0.08]">
                        <img v-if="book.imageUrl" :src="book.imageUrl" class="h-full w-full object-cover"
                            loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="line-clamp-2 text-xs sm:text-sm font-bold text-white leading-snug">
                            {{ book.title }}
                        </h4>
                        <div class="mt-2 flex flex-wrap items-center justify-between gap-1.5 text-xs">
                            <span class="text-white">
                                <strong class="tabular-nums font-bold text-white">{{ book.pagesRead }}</strong> / <span class="tabular-nums">{{ book.totalPages }}</span> hal
                            </span>
                            <span class="font-extrabold tabular-nums text-amber-300">
                                {{ Math.round((book.pagesRead / book.totalPages) * 100) }}%
                            </span>
                        </div>
                        <div class="mt-2 h-1.5 w-full rounded-full bg-black/40 overflow-hidden border border-white/[0.08]">
                            <div class="h-full rounded-full transition-all duration-300"
                                :class="Math.round((book.pagesRead / book.totalPages) * 100) >= 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-orange-400'"
                                :style="{ width: `${Math.min((book.pagesRead / book.totalPages) * 100, 100)}%` }">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="surface-card rounded-2xl border border-white/14 flex min-w-0 flex-col overflow-visible shadow-lg">
            <div class="px-5 py-3.5 bg-white/[0.03] border-b border-white/[0.08]">
                <div class="flex items-center gap-2">
                    <h3 class="text-sm font-bold text-white leading-snug">
                        Topik Dominan
                    </h3>
                    <div class="relative flex shrink-0 items-center">
                        <button type="button" @click="activeInsightTooltip = activeInsightTooltip === 'topic' ? null : 'topic'"
                            class="cursor-pointer text-white transition-colors hover:text-sky-300 focus:outline-none"
                            aria-label="Info Topik Dominan">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                        </button>

                        <Teleport to="body">
                            <div v-if="activeInsightTooltip === 'topic'"
                                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                                @click="activeInsightTooltip = null">
                                <div @click.stop class="liquid-glass-tooltip relative w-full max-w-sm p-5 text-white shadow-2xl">
                                    <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-white/15">
                                        <span class="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                <circle cx="12" cy="12" r="10"/>
                                                <line x1="12" y1="16" x2="12" y2="12"/>
                                                <line x1="12" y1="8" x2="12.01" y2="8"/>
                                            </svg>
                                            Info Topik Dominan
                                        </span>
                                        <button type="button" @click="activeInsightTooltip = null"
                                            class="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 hover:text-sky-300 transition-colors text-xs font-bold cursor-pointer"
                                            aria-label="Tutup">✕</button>
                                    </div>
                                    <p class="text-xs text-white leading-relaxed">
                                        100 poin tiap buku selesai + persentase progres buku aktif.
                                    </p>
                                </div>
                            </div>
                        </Teleport>
                    </div>
                </div>
            </div>
            <div class="p-5 pt-3 overflow-y-auto max-h-80 space-y-3 custom-scrollbar">
                <div v-if="topicScores.length === 0" class="text-center text-xs font-medium text-white py-6">
                    Belum ada topik buku
                </div>
                <div v-for="(cat, idx) in topicScores" :key="cat.name" class="group space-y-1.5 p-2 -mx-2 rounded-xl transition-colors duration-150 hover:bg-white/[0.05]">
                    <div class="flex items-center justify-between gap-3 text-xs sm:text-sm">
                        <span class="font-bold text-white line-clamp-1">
                            {{ cat.name }}
                        </span>
                        <span class="font-bold tabular-nums"
                            :class="[
                                'text-cyan-300',
                                'text-emerald-300',
                                'text-amber-300',
                                'text-pink-300',
                                'text-sky-300'
                            ][idx % 5]">
                            {{ cat.score }} <span class="text-xs font-normal text-white">pts</span>
                        </span>
                    </div>
                    <div class="h-1.5 w-full rounded-full bg-black/40 overflow-hidden border border-white/[0.08]">
                        <div class="h-full rounded-full transition-all duration-500"
                            :class="[
                                'bg-gradient-to-r from-cyan-500 to-sky-400',
                                'bg-gradient-to-r from-emerald-500 to-teal-400',
                                'bg-gradient-to-r from-amber-500 to-orange-400',
                                'bg-gradient-to-r from-pink-500 to-rose-400',
                                'bg-gradient-to-r from-sky-500 to-blue-500'
                            ][idx % 5]"
                            :style="{ width: `${(cat.score / maxTopicScore) * 100}%` }"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeInsightTooltip = ref<'activity' | 'topic' | null>(null)

defineProps<{
    mostReadBooksInsight: Array<{
        book: any
        sessions: number
        pagesAdded: number
    }>
    currentlyReadingList: any[]
    topicScores: Array<{
        name: string
        score: number
    }>
    maxTopicScore: number
}>()
</script>
