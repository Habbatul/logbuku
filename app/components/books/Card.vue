<template>
    <div
        class="surface-card relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/14 shadow-lg shadow-black/15 select-none transition-all duration-200 hover:border-white/30">
        <div v-show="!hideActionButtons">
            <button @click.stop="$emit('toggle-pin', book)" type="button"
                class="absolute right-3 top-3 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full shadow-md backdrop-blur-md focus:outline-none transition-all duration-150 hover:scale-110 active:scale-95"
                :class="book.isPinned ? 'bg-amber-400 text-amber-950 font-bold shadow-amber-500/30' : 'bg-black/35 text-white border border-white/30 hover:bg-black/50 hover:border-white/50 hover:text-white'"
                :aria-label="book.isPinned ? 'Lepas pin' : 'Pin buku'">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    :fill="book.isPinned ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>

            <button @click.stop="$emit('edit', book)" type="button" title="Edit Detail"
                class="absolute left-3 top-3 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-black/35 text-white border border-white/30 backdrop-blur-md shadow-md focus:outline-none transition-all duration-150 hover:scale-110 hover:bg-black/50 hover:border-white/50 hover:text-white active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                </svg>
            </button>
        </div>

        <div class="relative aspect-[2/2.5] w-full overflow-hidden p-2.5 shad">
            <div
                class="relative h-full w-full overflow-hidden rounded-xl bg-white/5 border border-white/[0.06] shadow-sm">
                <img v-if="book.imageUrl && !imageLoadError" :src="book.imageUrl" :alt="book.title"
                    class="h-full w-full object-cover brightness-95 transition-opacity duration-200 "
                    @error="handleImageError" loading="lazy" />

                <div v-else class="flex h-full w-full items-center justify-center bg-white/5 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                    </svg>
                </div>
            </div>
        </div>

        <div @click="$emit('open-progress', book)"
            role="button" tabindex="0" :aria-label="`Update progres baca ${book.title}`"
            @keydown.enter="$emit('open-progress', book)" @keydown.space.prevent="$emit('open-progress', book)"
            class="flex min-h-0 flex-1 cursor-pointer select-none flex-col pt-1 px-4 pb-4 focus:outline-none">
            <div class="mb-2 flex min-h-[20px] flex-wrap items-center gap-1.5">
                <template v-if="book.topic && book.topic.length > 0">
                    <span v-for="t in book.topic" :key="t" :title="t"
                        class="max-w-[110px] truncate rounded-xs  border px-2 py-0.5 text-[10px] font-bold"
                        :class="getTopicBadgeClass(t)">
                        {{ t }}
                    </span>
                </template>
                <template v-else>
                    <span class="rounded-full bg-white/15 border border-white/20 px-2 py-0.5 text-[10px] font-bold text-white">
                        Umum
                    </span>
                </template>

                <span v-if="percentage >= 100" class="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    ✓ Selesai
                </span>
                <span v-else-if="book.pagesRead > 0" class="rounded-full bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    ● Baca
                </span>
            </div>

            <h3 class="line-clamp-2 text-sm font-medium leading-snug tracking-tight text-white mt-1" :title="book.title">
                {{ book.title }}
            </h3>

            <div v-if="book.author" class="mt-1 flex flex-col gap-0.5">
                <span class="truncate text-xs font-base text-gray-300" :title="book.author">
                    {{ book.author }}
                </span>
            </div>

            <div class="mt-auto pt-3">
                <div class="flex w-full items-center justify-between gap-2 pt-2 text-left">
                    <div class="flex min-w-0 items-center gap-1.5 text-xs text-white">
                        <svg class="shrink-0 text-sky-300"
                            xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        <span class="truncate font-semibold">
                            <span class="tabular-nums font-bold text-white">{{ book.pagesRead }}</span> / <span class="tabular-nums font-bold text-white">{{ book.totalPages }}</span> hal
                        </span>
                    </div>
                    <span class="shrink-0 text-xs font-extrabold tabular-nums"
                        :class="book.pagesRead >= book.totalPages ? 'text-emerald-300' : 'text-amber-300'">
                        {{ percentage }}%
                    </span>
                </div>

                <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-black/40 border border-white/[0.06]">
                    <div class="h-full rounded-full transition-all duration-300 ease-out" :class="progressColor"
                        :style="{ width: `${progressWidth}%` }"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Book } from '~/types/book'

const props = defineProps<{
    book: Book
    hideActionButtons?: boolean
}>()

defineEmits<{
    (e: 'toggle-pin', book: Book): void
    (e: 'edit', book: Book): void
    (e: 'open-progress', book: Book): void
}>()

const imageLoadError = ref(false)

const handleImageError = () => {
    imageLoadError.value = true
}

const percentage = computed(() => {
    if (!props.book.totalPages) return 0
    return Math.round((props.book.pagesRead / props.book.totalPages) * 100) || 0
})

const progressWidth = computed(() => {
    if (!props.book.totalPages) return 0
    return Math.min((props.book.pagesRead / props.book.totalPages) * 100, 100)
})

const progressColor = computed(() => {
    const pct = percentage.value
    if (pct >= 100) return 'bg-emerald-400'
    if (pct > 0) return 'bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300'
    return 'bg-transparent'
})

const getTopicBadgeClass = (topic: string) => {
    const t = (topic || '').toLowerCase()
    if (t.includes('fiksi') || t.includes('novel') || t.includes('sastra') || t.includes('cerita') || t.includes('fantasi')) {
        return 'bg-pink-500/20 text-pink-300 border-pink-500/30'
    }
    if (t.includes('bisnis') || t.includes('finansial') || t.includes('uang') || t.includes('ekonomi') || t.includes('manajemen') || t.includes('investasi')) {
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
    if (t.includes('tech') || t.includes('teknologi') || t.includes('komputer') || t.includes('code') || t.includes('program') || t.includes('sains')) {
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30'
    }
    if (t.includes('diri') || t.includes('habit') || t.includes('psikologi') || t.includes('motivasi') || t.includes('produktivitas') || t.includes('self')) {
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    }
    if (t.includes('sejarah') || t.includes('filsafat') || t.includes('politik') || t.includes('sosial') || t.includes('agama')) {
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    }
    return 'bg-white/15 text-white border-white/20'
}
</script>