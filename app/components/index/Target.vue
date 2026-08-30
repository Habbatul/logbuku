<template>
    <section>
        <div class="border-y border-gray-200 py-5 sm:py-6">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
                <div class="min-w-0 lg:w-64 lg:shrink-0">
                    <div class="flex items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" class="shrink-0 text-gray-900">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>
                        <h2 class="truncate text-base font-semibold tracking-tight text-gray-950"> Target Membaca
                        </h2>
                    </div>
                    <p class="mt-1.5 text-sm leading-5 text-gray-500 max-w-[280px]">
                        Selesaikan {{ targetBooksCount }} buku pilihan prioritasmu.
                    </p>
                </div>

                <div class="min-w-0 flex-1">
                    <div class="mb-2.5 flex items-baseline justify-between gap-4">
                        <p class="min-w-0 truncate text-sm font-medium text-gray-700">
                            <span class="font-semibold text-gray-950"> {{ targetCompleted }} </span>
                            <span class="text-gray-400"> / </span>
                            {{ targetBooksCount }}
                            <span class="text-gray-400"> buku selesai</span>
                        </p>
                        <span class="shrink-0 text-sm font-bold tabular-nums"
                            :class="targetProgressPct >= 100 ? 'text-green-600' : 'text-gray-950'">
                            {{ targetProgressPct }}%
                        </span>
                    </div>
                    <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div class="h-full rounded-full transition-all duration-500 ease-out"
                            :class="getProgressColor(targetReadPages, targetTotalPages)"
                            :style="{ width: `${Math.min(targetProgressPct, 100)}%` }">
                        </div>
                    </div>
                </div>

                <div class="shrink-0">
                    <button @click="$emit('openTargetModal')"
                        class="inline-flex w-full cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:w-auto">
                        Pilih Buku
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    targetBooksCount: number
    targetCompleted: number
    targetProgressPct: number
    targetReadPages: number
    targetTotalPages: number
}>()

defineEmits<{
    (e: 'openTargetModal'): void
}>()
</script>
