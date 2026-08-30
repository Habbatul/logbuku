<template>
    <div
        class="group relative flex min-w-0 flex-col overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
        <div v-show="!hideActionButtons">
            <button @click.stop="$emit('toggle-pin', book)" type="button"
                class="absolute right-4 top-4 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] border border-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] transition-all hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d]"
                :class="book.isPinned ? 'bg-[#ff4800] text-white' : 'bg-white text-[#57534e] hover:bg-[#f3ede2] hover:text-[#0d0d0d]'"
                :aria-label="book.isPinned ? 'Lepas pin' : 'Pin buku'">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    :fill="book.isPinned ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2.5"
                    stroke-linecap="round" stroke-linejoin="round">
                    <polygon
                        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
            </button>

            <button @click.stop="$emit('edit', book)" type="button" title="Edit Detail"
                class="absolute left-4 top-4 z-20 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-white text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2] hover:scale-105 active:translate-x-0.5 active:translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d]">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                </svg>
            </button>
        </div>

        <div class="relative aspect-[2/2.5] w-full overflow-hidden bg-[#faf8f5] p-2 border-b-2 border-[#0d0d0d]">
            <div
                class="relative h-full w-full overflow-hidden rounded-[3px] border-[2.5px] border-[#696661] bg-white rounded-lg">
                <img v-if="book.imageUrl && !imageLoadError" :src="book.imageUrl" :alt="book.title"
                    class="h-full w-full object-cover"
                    @error="handleImageError" loading="lazy" />

                <div v-else class="flex h-full w-full items-center justify-center bg-[#f3ede2] text-[#57534e]">
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
            class="flex min-h-0 flex-1 cursor-pointer select-none flex-col p-3.5 sm:p-4 transition-colors hover:bg-[#faf8f5] focus:outline-none focus-visible:bg-[#f3ede2]">
            <div class="mb-2 flex min-h-[20px] flex-wrap items-center gap-1.5">
                <template v-if="book.topic && book.topic.length > 0">
                    <span v-for="t in book.topic" :key="t" :title="t"
                        class="max-w-[100px] truncate rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] px-1.5 py-0.5 font-mono text-xs font-bold text-[#0d0d0d]">
                        {{ t }}
                    </span>
                </template>
                <template v-else>
                    <span class="font-mono text-xs font-bold uppercase text-[#57534e]">
                        [UMUM]
                    </span>
                </template>
            </div>

            <h3 class="font-mono line-clamp-2 text-sm font-extrabold leading-snug tracking-[-0.015em] text-[#0d0d0d]" :title="book.title">
                {{ book.title }}
            </h3>

            <div v-if="book.author" class="mt-1 flex flex-col gap-0.5">
                <span v-if="book.author" class="truncate text-xs font-medium text-[#44403c]" :title="book.author">
                    {{ book.author }}
                </span>
            </div>

            <div class="mt-auto pt-3">
                <div
                    class="group/progress flex w-full items-center justify-between gap-2 border-t border-[#e5dfd3] pt-2.5 text-left">
                    <div class="flex min-w-0 items-center gap-1.5 font-mono text-xs text-[#44403c]">
                        <svg class="shrink-0 text-[#57534e] transition-colors group-hover/progress:text-[#0d0d0d]"
                            xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                        <span class="truncate font-medium">
                            <span class="tabular-nums font-bold text-[#0d0d0d]">{{ book.pagesRead }}</span> / <span class="tabular-nums font-bold text-[#57534e]">{{ book.totalPages }}</span> HAL
                        </span>
                    </div>
                    <span class="shrink-0 font-mono text-xs font-bold tabular-nums"
                        :class="book.pagesRead >= book.totalPages ? 'text-[#00875a]' : 'text-[#0d0d0d]'">
                        [{{ percentage }}%]
                    </span>
                </div>

                <div class="mt-2 h-2.5 w-full overflow-hidden rounded-[2px] border border-[#0d0d0d] bg-[#f3ede2] p-[1px]">
                    <div class="h-full transition-all duration-300 ease-out" :class="progressColor"
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
    if (pct >= 100) return 'bg-[#00875a]'
    if (pct > 0) return 'bg-[#0d0d0d]'
    return 'bg-transparent'
})
</script>