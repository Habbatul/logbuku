<template>
    <div
        class="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
        <div v-show="!hideActionButtons">
            <button @click.stop="$emit('toggle-pin', book)" type="button"
                class="absolute right-2.5 top-2.5 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white/95 text-gray-400 shadow-sm ring-1 ring-gray-200/80 backdrop-blur-sm transition-colors hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                :class="book.isPinned ? 'text-amber-500 hover:text-amber-600' : ''"
                :aria-label="book.isPinned ? 'Lepas pin' : 'Pin buku'">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                    :fill="book.isPinned ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2.25"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>

            <button @click.stop="$emit('edit', book)" type="button" title="Edit Detail"
                class="absolute left-2.5 top-2.5 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-md bg-white/95 text-gray-400 shadow-sm ring-1 ring-gray-200/80 backdrop-blur-sm transition-colors hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                </svg>
            </button>
        </div>

        <div class="relative aspect-[2/2.5] w-full overflow-hidden bg-white p-1.5">
            <div
                class="relative h-full w-full overflow-hidden rounded-lg border-[0.5px] border-gray-400 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.3)]">
                <img v-if="book.imageUrl && !imageLoadError" :src="book.imageUrl" :alt="book.title"
                    class="h-full w-full object-cover brightness-[1] contrast-[0.8] saturate-[1]"
                    @error="handleImageError" loading="lazy" />

                <div v-else class="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-1.5-5H20" />
                    </svg>
                </div>
            </div>
        </div>

        <div class="flex min-h-0 flex-1 flex-col p-3.5 sm:p-4">
            <div class="mb-2 flex min-h-[18px] flex-wrap items-center gap-1.5">
                <template v-if="book.topic && book.topic.length > 0">
                    <span v-for="t in book.topic" :key="t" :title="t"
                        class="max-w-[90px] truncate rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                        {{ t }}
                    </span>
                </template>
                <template v-else>
                    <span class="text-[10px] font-medium text-gray-400">
                        Tanpa Topik
                    </span>
                </template>
            </div>

            <h3 class="line-clamp-2 text-[13px] font-semibold leading-5 tracking-tight text-gray-900 sm:text-sm">
                {{ book.title }}
            </h3>

            <div v-if="book.author || book.publisher" class="mt-1 flex flex-col gap-0.5 text-[11px] text-gray-500">
                <span v-if="book.author" class="truncate font-medium text-gray-600" :title="book.author">
                    {{ book.author }}
                </span>
                <span v-if="book.publisher" class="truncate text-[10px] text-gray-400" :title="book.publisher">
                    {{ book.publisher }}
                </span>
            </div>

            <div class="mt-auto pt-4">
                <button @click="$emit('open-progress', book)" type="button"
                    class="group/progress flex w-full cursor-pointer items-center justify-between gap-2 border-t border-gray-100 pt-3 text-left focus:outline-none">
                    <div class="flex min-w-0 items-center gap-1.5">
                        <svg class="shrink-0 text-gray-400 transition-colors group-hover/progress:text-gray-700"
                            xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        <span class="truncate text-[11px] font-medium text-gray-500 sm:text-xs">
                            {{ book.pagesRead }} / {{ book.totalPages }} hal
                        </span>
                    </div>
                    <span class="shrink-0 text-xs font-bold tabular-nums"
                        :class="book.pagesRead >= book.totalPages ? 'text-green-600' : 'text-gray-900'">
                        {{ percentage }}%
                    </span>
                </button>

                <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
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
    if (pct >= 100) return 'bg-green-600'
    if (pct >= 75) return 'bg-purple-500'
    if (pct >= 50) return 'bg-blue-500'
    if (pct >= 25) return 'bg-orange-500'
    return 'bg-red-500'
})
</script>