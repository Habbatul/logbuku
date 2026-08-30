<template>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section
            class="relative flex min-w-0 flex-col overflow-visible rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
            <div class="border-b-2 border-[#0d0d0d] px-5 py-4">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <h3 class="truncate text-sm font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-snug">
                            "Aktivitas Teratas"
                        </h3>
                        <div tabindex="0"
                            class="group static sm:relative flex shrink-0 cursor-help items-center outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="text-[#57534e] transition-colors group-hover:text-[#0d0d0d] group-focus:text-[#0d0d0d]">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                            <div
                                class="invisible absolute left-4 right-4 top-9 z-50 mx-auto mt-2 w-auto max-w-[320px] rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-3.5 py-3 text-left font-mono text-xs font-medium leading-5 text-white opacity-0 shadow-[4px_4px_0px_#ff4800] transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 group-active:visible group-active:opacity-100 sm:left-1/2 sm:top-full sm:mx-0 sm:w-64 sm:-translate-x-1/2 sm:right-auto sm:max-w-none">
                                [SESI: TIAP 1 JAM PERUBAHAN HALAMAN BERTAMBAH]. Data historis mingguan terarsip otomatis.
                            </div>
                        </div>
                    </div>
                    <p class="mt-1 truncate font-mono text-xs font-bold text-[#57534e] uppercase">
                        [7 HARI TERAKHIR]
                    </p>
                </div>
            </div>
            <div class="custom-scrollbar max-h-80 flex-1 overflow-y-auto px-5 divide-y divide-[#e5dfd3]">
                <div v-if="mostReadBooksInsight.length === 0"
                    class="flex min-h-40 items-center justify-center py-6 text-center font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">
                    [BELUM ADA AKTIVITAS MEMBACA]
                </div>
                <div v-for="(insight, idx) in mostReadBooksInsight" :key="'act-' + idx"
                    class="flex gap-3.5 py-4">
                    <div
                        class="h-[72px] w-[50px] shrink-0 overflow-hidden rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] shadow-[1px_1px_0px_#0d0d0d]">
                        <img v-if="insight.book.imageUrl" :src="insight.book.imageUrl"
                            class="h-full w-full object-cover" loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center bg-[#f3ede2] text-[#57534e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="line-clamp-2 text-sm font-bold font-mono leading-snug text-[#0d0d0d]">
                            {{ insight.book.title }}
                        </h4>
                        <div class="mt-2 space-y-1 font-mono text-xs text-[#44403c]">
                            <div class="flex min-w-0 items-center gap-1.5">
                                <span class="h-2 w-2 shrink-0 rounded-full border border-[#0d0d0d] bg-[#ff4800]"></span>
                                <span class="truncate"><strong class="font-bold tabular-nums text-[#0d0d0d]">{{ insight.sessions }}</strong> SESI BACA</span>
                            </div>
                            <div class="flex min-w-0 items-center gap-1.5">
                                <span class="h-2 w-2 shrink-0 rounded-full border border-[#0d0d0d] bg-[#0d0d0d]"></span>
                                <span class="truncate"><strong class="font-bold tabular-nums text-[#0d0d0d]">{{ insight.pagesAdded }}</strong> HAL DIBACA</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="flex min-w-0 flex-col overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
            <div class="flex items-center justify-between gap-3 border-b-2 border-[#0d0d0d] px-5 py-4">
                <h3 class="truncate text-sm font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-snug"> "Sedang Dibaca" </h3>
                <span
                    class="shrink-0 rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0047ff] shadow-[1px_1px_0px_#0d0d0d]">
                    TOP 3 </span>
            </div>
            <div class="custom-scrollbar max-h-80 flex-1 overflow-y-auto px-5 divide-y divide-[#e5dfd3]">
                <div v-if="currentlyReadingList.length === 0"
                    class="flex min-h-40 items-center justify-center py-6 text-center font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">
                    [TIDAK ADA BUKU YANG SEDANG DIBACA]
                </div>
                <div v-for="book in currentlyReadingList" :key="book.id"
                    class="flex gap-3.5 py-4">
                    <div class="h-16 w-12 shrink-0 overflow-hidden rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] shadow-[1px_1px_0px_#0d0d0d]">
                        <img v-if="book.imageUrl" :src="book.imageUrl" class="h-full w-full object-cover"
                            loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center bg-[#f3ede2] text-[#57534e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="truncate text-sm font-bold text-[#0d0d0d] font-mono"> {{ book.title }} </h4>
                        <div class="mt-2 flex items-center justify-between gap-3 font-mono text-xs sm:text-sm">
                            <span class="truncate font-bold text-[#44403c]">
                                <span class="tabular-nums font-bold text-[#0d0d0d]">{{ book.pagesRead }}</span> / <span class="tabular-nums text-[#0d0d0d]">{{ book.totalPages }}</span> HAL
                            </span>
                            <span class="shrink-0 font-bold tabular-nums text-[#0d0d0d]">
                                [{{ Math.round((book.pagesRead / book.totalPages) * 100) }}%]
                            </span>
                        </div>
                        <div class="mt-2 h-2.5 w-full border border-[#0d0d0d] bg-[#f3ede2] rounded-[2px] p-[1px]">
                            <div class="h-full transition-all duration-300"
                                :class="Math.round((book.pagesRead / book.totalPages) * 100) >= 100 ? 'bg-[#00875a]' : 'bg-[#0d0d0d]'"
                                :style="{ width: `${Math.min((book.pagesRead / book.totalPages) * 100, 100)}%` }">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="relative flex min-w-0 flex-col overflow-visible rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
            <div class="border-b-2 border-[#0d0d0d] px-5 py-4">
                <div class="flex min-w-0 items-center gap-2">
                    <h3 class="truncate text-sm font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-snug"> "Topik Dominan" </h3>
                    <div tabindex="0"
                        class="group static sm:relative flex shrink-0 cursor-help items-center outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round"
                            class="text-[#57534e] transition-colors group-hover:text-[#0d0d0d] group-focus:text-[#0d0d0d]">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        <div
                            class="invisible absolute left-4 right-4 top-9 z-50 mx-auto mt-2 w-auto max-w-[320px] rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-3.5 py-3 text-left font-mono text-xs font-medium leading-5 text-white opacity-0 shadow-[4px_4px_0px_#0047ff] transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 group-active:visible group-active:opacity-100 sm:left-1/2 sm:top-full sm:mx-0 sm:w-64 sm:-translate-x-1/2 sm:right-auto sm:max-w-none">
                            [SKOR ARSIP]: 100 poin tiap buku selesai + persentase progres buku aktif.
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-5 overflow-y-auto max-h-80 space-y-4 custom-scrollbar">
                <div v-if="topicScores.length === 0" class="text-center font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e] py-4">
                    [BELUM ADA TOPIK BUKU]
                </div>
                <div v-for="cat in topicScores" :key="cat.name" class="space-y-1.5">
                    <div class="flex items-center justify-between gap-3 ">
                        <span class="min-w-0 truncate text-sm font-bold text-[#0d0d0d] font-mono"> {{ cat.name }}
                        </span>
                        <span class="shrink-0 font-mono text-xs sm:text-sm font-bold tabular-nums text-[#0d0d0d] font-mono">
                            {{ cat.score }} <span class="font-mono font-bold text-[#57534e]">PTS</span>
                        </span>
                    </div>
                    <div class="h-2.5 w-full border border-[#0d0d0d] bg-[#f3ede2] rounded-[2px] p-[1px]">
                        <div class="h-full bg-[#0d0d0d] transition-all duration-500"
                            :style="{ width: `${(cat.score / maxTopicScore) * 100}%` }"></div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
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

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #e5dfd3;
    border-radius: 0px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #57534e;
}
</style>
