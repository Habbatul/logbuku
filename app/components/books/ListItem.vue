<template>
    <div @click="$emit('open-progress', book)" role="button" tabindex="0"
        :aria-label="`Update progres baca ${book.title}`"
        @keydown.enter="$emit('open-progress', book)" @keydown.space.prevent="$emit('open-progress', book)"
        class="surface-card relative flex items-center justify-between gap-2.5 sm:gap-3 !rounded-lg sm:!rounded-xl border border-white/12 hover:border-white/30 cursor-pointer select-none transition-all duration-150 focus:outline-none"
        :class="hideActionButtons ? 'p-2.25 px-3 sm:px-3.5 sm:py-2.5' : 'px-3 py-2 sm:px-4 sm:py-3'">
        
        <div class="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div class="relative h-11.5 w-9 sm:h-12 sm:w-9 overflow-hidden !rounded-md sm:!rounded-lg bg-white/5 border border-white/10 shrink-0 shadow-sm">
                <img v-if="book.imageUrl && !imageLoadError" :src="book.imageUrl" :alt="book.title"
                    class="h-full w-full object-cover brightness-95"
                    @error="handleImageError" loading="lazy" />
                <div v-else class="flex h-full w-full items-center justify-center bg-white/5 text-white/50">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                    </svg>
                </div>
            </div>

            <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 flex-wrap">
                    <h3 class="text-xs sm:text-sm font-semibold tracking-tight text-white truncate max-w-full" :title="book.title">
                        {{ book.title }}
                    </h3>

                    <span v-if="isCompleted"
                        class="shrink-0 rounded-xs bg-emerald-500/20 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300">
                        ✓ Selesai
                    </span>
                </div>

                <div class="mt-0.5 flex items-center gap-2 text-[10.5px] text-white/70 truncate">
                    <span v-if="book.author" class="truncate " :title="book.author">
                        {{ book.author }}
                    </span>
                    <span v-if="book.topic && book.topic.length > 0"
                        class="truncate rounded-xs border px-1.5 py-0 text-[9px] font-semibold hidden xs:inline-block"
                        :class="getTopicBadgeClass(book.topic[0])">
                        {{ book.topic[0] }}
                        <span v-if="book.topic.length > 1" class="text-[8px] opacity-75">+{{ book.topic.length - 1 }}</span>
                    </span>
                </div>

                <div class="mt-1 sm:hidden flex items-center gap-2">
                    <div class="h-1 flex-1 overflow-hidden rounded-full bg-black/40 border border-white/[0.06]">
                        <div class="h-full rounded-full transition-all duration-300 ease-out" :class="progressColorClass"
                            :style="{ width: `${progressWidth}%` }"></div>
                    </div>
                    <span class="text-[10px] font-bold tabular-nums shrink-0" :class="progressTextClass">
                        {{ actualPagesRead }}/{{ displayTotalPages }} hal ({{ percentage }}%)
                    </span>
                </div>
            </div>
        </div>

        <div class="hidden sm:flex flex-col items-end gap-1 shrink-0 w-44 lg:w-56">
            <div class="flex items-center justify-between w-full text-xs font-semibold">
                <span class="text-white/80 text-[11px] font-medium">
                    <span class="tabular-nums font-bold text-white">{{ actualPagesRead }}</span> / <span class="tabular-nums font-semibold text-white/90">{{ displayTotalPages }}</span> hal
                </span>
                <span class="font-bold tabular-nums text-xs" :class="progressTextClass">
                    {{ percentage }}%
                </span>
            </div>

            <div class="h-1.5 w-full overflow-hidden rounded-full bg-black/40 border border-white/[0.06]">
                <div class="h-full rounded-full transition-all duration-300 ease-out" :class="progressColorClass"
                    :style="{ width: `${progressWidth}%` }"></div>
            </div>
        </div>

        <div v-show="!hideActionButtons" class="flex items-center gap-1.5 shrink-0" @click.stop>
            <button @click.stop="$emit('toggle-pin', book)" type="button"
                class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg shadow-sm backdrop-blur-md focus:outline-none transition-all duration-150 hover:scale-105 active:scale-95"
                :class="book.isPinned ? 'bg-amber-400 text-amber-950 font-bold shadow-amber-500/20' : 'bg-black/30 text-white/70 border border-white/20 hover:bg-black/50 hover:text-white'"
                :aria-label="book.isPinned ? 'Lepas pin' : 'Pin buku'"
                :title="book.isPinned ? 'Lepas pin' : 'Sematkan (Pin)'">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    :fill="book.isPinned ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>

            <button @click.stop="$emit('edit', book)" type="button" title="Edit Detail Buku"
                class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-black/30 text-white/70 border border-white/20 backdrop-blur-md shadow-sm focus:outline-none transition-all duration-150 hover:scale-105 hover:bg-black/50 hover:text-white active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Book } from '~/types/book'
import {
    getEffectiveTotalPages,
    calculateProgressPercentage,
    getBookTotalPrefacePages,
    getBookIncludePreface,
    getReadAbsolutePages,
    getReadingProgressColor
} from '~/utils/readingProgress'

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

const displayTotalPages = computed(() => {
    return getEffectiveTotalPages(props.book)
})

const actualPagesRead = computed(() => {
    if (Array.isArray(props.book.readHistory) && props.book.readHistory.length > 0) {
        const tp = getBookTotalPrefacePages(props.book)
        const inc = getBookIncludePreface(props.book)
        const readSet = getReadAbsolutePages(props.book.readHistory, tp, inc)
        const eff = displayTotalPages.value
        return eff > 0 ? Math.min(readSet.size, eff) : readSet.size
    }
    const eff = displayTotalPages.value
    const val = Number(props.book.pagesRead) || 0
    return eff > 0 ? Math.min(val, eff) : val
})

const percentage = computed(() => {
    return calculateProgressPercentage(actualPagesRead.value, displayTotalPages.value)
})

const isCompleted = computed(() => {
    return displayTotalPages.value > 0 && actualPagesRead.value >= displayTotalPages.value
})

const progressWidth = computed(() => {
    if (displayTotalPages.value <= 0) return 0
    if (isCompleted.value) return 100
    return Math.min(99, (actualPagesRead.value / displayTotalPages.value) * 100)
})

const progressColorConfig = computed(() => {
    return getReadingProgressColor(percentage.value, isCompleted.value)
})

const progressColorClass = computed(() => progressColorConfig.value.barClass)
const progressTextClass = computed(() => progressColorConfig.value.textClass)

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
