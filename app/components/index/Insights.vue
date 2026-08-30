<template>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <section
            class="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div class="border-b border-gray-100 px-5 py-4">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <h3 class="truncate text-sm font-semibold tracking-tight text-gray-950">
                            Aktivitas Teratas (7 Hari)
                        </h3>
                        <div tabindex="0"
                            class="group static sm:relative flex shrink-0 cursor-help items-center outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round"
                                class="text-gray-400 transition-colors group-hover:text-gray-700 group-focus:text-gray-700">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M12 16v-4" />
                                <path d="M12 8h.01" />
                            </svg>
                            <div
                                class="invisible absolute left-4 right-4 top-9 z-50 mx-auto mt-2 w-auto max-w-[320px] rounded-lg bg-gray-900 px-3.5 py-3 text-left text-xs font-medium leading-5 text-white opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 group-active:visible group-active:opacity-100 sm:left-1/2 sm:top-full sm:mx-0 sm:w-64 sm:-translate-x-1/2 sm:right-auto sm:max-w-none">
                                Sesi adalah tiap 1 jam anda mengubah halaman, dan hanya ketika halaman bertambah
                                sesi baru dihitung. Tiap minggu data histori dihapus otomatis.
                                <div
                                    class="hidden sm:block absolute -top-1.5 sm:left-1/2 sm:-translate-x-1/2 border-[6px] border-transparent border-b-gray-900">
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="mt-1 truncate text-[13px] text-gray-500">
                        Buku paling sering dibaca berdasarkan sesi.
                    </p>
                </div>
            </div>
            <div class="custom-scrollbar max-h-80 flex-1 overflow-y-auto px-5">
                <div v-if="mostReadBooksInsight.length === 0"
                    class="flex min-h-40 items-center justify-center py-6 text-center text-sm text-gray-400">
                    Belum ada aktivitas membaca.
                </div>
                <div v-for="(insight, idx) in mostReadBooksInsight" :key="'act-' + idx"
                    class="flex gap-3.5 border-b border-gray-100 py-4 last:border-0">
                    <div
                        class="h-[72px] w-[50px] shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200/80">
                        <img v-if="insight.book.imageUrl" :src="insight.book.imageUrl"
                            class="h-full w-full object-cover" loading="lazy" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="line-clamp-2 text-[13px] font-semibold leading-5 text-gray-900">
                            {{ insight.book.title }}
                        </h4>
                        <div class="mt-2.5 space-y-1.5 text-xs text-gray-500">
                            <div class="flex min-w-0 items-center gap-2">
                                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500"></span>
                                <span class="truncate">{{ insight.sessions }} sesi membaca</span>
                            </div>
                            <div class="flex min-w-0 items-center gap-2">
                                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span>
                                <span class="truncate">{{ insight.pagesAdded }} halaman dibaca</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div class="flex items-center justify-between gap-3 border-b border-gray-100 px-5 py-4">
                <h3 class="truncate text-sm font-semibold tracking-tight text-gray-950"> Sedang Dibaca </h3>
                <span
                    class="shrink-0 rounded-md bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-blue-600">
                    Top 3 </span>
            </div>
            <div class="custom-scrollbar max-h-80 flex-1 overflow-y-auto px-5">
                <div v-if="currentlyReadingList.length === 0"
                    class="flex min-h-40 items-center justify-center py-6 text-center text-sm text-gray-400">
                    Tidak ada buku yang sedang dibaca.
                </div>
                <div v-for="book in currentlyReadingList" :key="book.id"
                    class="flex gap-3.5 border-b border-gray-100 py-4 last:border-0">
                    <div class="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200/80">
                        <img v-if="book.imageUrl" :src="book.imageUrl" class="h-full w-full object-cover"
                            loading="lazy" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="truncate text-[13px] font-semibold text-gray-900"> {{ book.title }} </h4>
                        <div class="mt-2.5 flex items-center justify-between gap-3">
                            <span class="truncate text-[11px] font-medium text-gray-500">
                                {{ book.pagesRead }} / {{ book.totalPages }} hal
                            </span>
                            <span class="shrink-0 text-xs font-bold tabular-nums text-gray-900">
                                {{ Math.round((book.pagesRead / book.totalPages) * 100) }}%
                            </span>
                        </div>
                        <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div class="h-full rounded-full transition-all duration-300"
                                :class="getProgressColor(book.pagesRead, book.totalPages)"
                                :style="{ width: `${Math.min((book.pagesRead / book.totalPages) * 100, 100)}%` }">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div class="border-b border-gray-100 px-5 py-4">
                <div class="flex min-w-0 items-center gap-2">
                    <h3 class="truncate text-sm font-semibold tracking-tight text-gray-950"> Topik Dominan </h3>
                    <div tabindex="0"
                        class="group static sm:relative flex shrink-0 cursor-help items-center outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round"
                            class="text-gray-400 transition-colors group-hover:text-gray-700 group-focus:text-gray-700">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 16v-4" />
                            <path d="M12 8h.01" />
                        </svg>
                        <div
                            class="invisible absolute left-4 right-4 top-9 z-50 mx-auto mt-2 w-auto max-w-[320px] rounded-lg bg-gray-900 px-3.5 py-3 text-left text-xs font-medium leading-5 text-white opacity-0 shadow-xl transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus:visible group-focus:opacity-100 group-active:visible group-active:opacity-100 sm:left-1/2 sm:top-full sm:mx-0 sm:w-64 sm:-translate-x-1/2 sm:right-auto sm:max-w-none">
                            Skor dihitung dari: 100 poin tiap buku selesai, ditambah persentase progres buku yang
                            sedang dibaca.
                            <div
                                class="hidden sm:block absolute -top-1.5 sm:left-1/2 sm:-translate-x-1/2 border-[6px] border-transparent border-b-gray-900">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="p-5 overflow-y-auto max-h-80 space-y-5 custom-scrollbar">
                <div v-if="topicScores.length === 0" class="text-center text-gray-400 text-sm py-4">
                    Belum ada topik buku.
                </div>
                <div v-for="cat in topicScores" :key="cat.name" class="space-y-2">
                    <div class="flex items-center justify-between gap-3">
                        <span class="min-w-0 truncate text-[13px] font-semibold text-gray-700"> {{ cat.name }}
                        </span>
                        <span class="shrink-0 text-xs font-bold tabular-nums text-blue-600">
                            {{ cat.score }} <span class="font-medium text-gray-400">pts</span>
                        </span>
                    </div>
                    <div class="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div class="h-full rounded-full bg-gray-800 transition-all duration-500"
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
    background: #D1D5DB;
    border-radius: 0px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
}
</style>
