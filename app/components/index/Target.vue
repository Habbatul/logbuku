<template>
    <section>
        <div class="border-y-2 border-[#0d0d0d] py-5 sm:py-6">
            <div class="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
                <div class="min-w-0 lg:w-64 lg:shrink-0">
                    <div class="flex items-center gap-2.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round" class="shrink-0 text-[#0d0d0d]">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="12" r="6" />
                            <circle cx="12" cy="12" r="2" />
                        </svg>
                        <h2 class="truncate text-lg sm:text-xl font-bold tracking-[-0.02em] text-[#0d0d0d] leading-snug uppercase">
                            TARGET MEMBACA
                        </h2>
                    </div>
                    <p v-if="targetBooksCount > 0" class="mt-1.5 text-sm leading-5 text-[#44403c] max-w-[280px]">
                        Selesaikan <span class="font-bold text-[#0d0d0d] tabular-nums">{{ targetBooksCount }}</span> buku pilihan prioritasmu.
                    </p>
                    <p v-else class="mt-1.5 text-sm leading-5 text-[#44403c] max-w-[280px]">
                        Tentukan buku prioritas dari koleksimu untuk mulai memantau target membaca.
                    </p>
                </div>

                <div class="min-w-0 flex-1">
                    <template v-if="targetBooksCount > 0">
                        <div class="mb-2.5 flex items-baseline justify-between gap-4">
                            <p class="min-w-0 truncate text-sm sm:text-base font-medium text-[#0d0d0d]">
                                <span class="tabular-nums font-bold text-[#0d0d0d]">{{ targetCompleted }}</span>
                                <span class="text-[#57534e]"> / </span>
                                <span class="tabular-nums font-bold text-[#0d0d0d]">{{ targetBooksCount }}</span>
                                <span class="font-mono text-xs sm:text-sm font-bold text-[#57534e] uppercase"> BUKU SELESAI</span>
                            </p>
                            <span class="shrink-0 font-mono text-sm sm:text-base font-bold tabular-nums"
                                :class="targetProgressPct >= 100 ? 'text-[#00875a]' : 'text-[#0d0d0d]'">
                                [{{ targetProgressPct }}%]
                            </span>
                        </div>
                        <div class="h-3 w-full border border-[#0d0d0d] bg-[#f3ede2] rounded-[2px] p-[1px]">
                            <div class="h-full transition-all duration-300 ease-out"
                                :class="targetProgressPct >= 100 ? 'bg-[#00875a]' : 'bg-[#0d0d0d]'"
                                :style="{ width: `${Math.min(targetProgressPct, 100)}%` }">
                            </div>
                        </div>
                    </template>
                    <div v-else class="rounded-[4px] border-2 border-dashed border-[#0d0d0d]/30 bg-[#f3ede2] p-3 text-center font-mono text-xs sm:text-sm font-bold uppercase text-[#44403c]">
                        [BELUM ADA BUKU YANG DITANDAI SEBAGAI TARGET AKTIF]
                    </div>
                </div>

                <div class="shrink-0">
                    <button @click="$emit('openTargetModal')"
                        class="inline-flex w-full cursor-pointer items-center justify-center rounded-[4px] border-2 border-[#0d0d0d] bg-white px-4 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0d0d0d] hover:bg-[#f3ede2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] sm:w-auto">
                        {{ targetBooksCount > 0 ? 'KELOLA TARGET' : 'TENTUKAN TARGET' }}
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
