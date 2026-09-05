<template>
    <section class="surface-hero rounded-2xl border border-white/14 p-5 sm:p-6 shadow-lg">
        <div class="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:gap-10">
            <div class="min-w-0 lg:w-64 lg:shrink-0">
                <div class="flex items-center gap-2.5">
                    <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                            stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <circle cx="12" cy="6" r="6" />
                            <circle cx="12" cy="2" r="2" />
                        </svg>
                    </div>
                    <h2 class="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
                        Target Membaca
                    </h2>
                </div>
                <p v-if="targetBooksCount > 0" class="mt-1.5 text-xs leading-relaxed text-white">
                    Selesaikan <span class="font-bold text-white tabular-nums">{{ targetBooksCount }}</span> buku pilihan prioritasmu.
                </p>
                <p v-else class="mt-1.5 text-xs leading-relaxed text-white">
                    Tentukan buku prioritas dari koleksimu untuk mulai memantau target membaca.
                </p>
            </div>

            <div class="min-w-0 flex-1">
                <template v-if="targetBooksCount > 0">
                    <div class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                        <p class="text-xs sm:text-sm font-semibold text-white">
                            <span class="tabular-nums font-extrabold text-white">{{ targetCompleted }}</span>
                            <span class="text-white"> / </span>
                            <span class="tabular-nums font-extrabold text-white">{{ targetBooksCount }}</span>
                            <span class="text-xs font-medium text-white"> buku selesai</span>
                        </p>
                        <span class="text-xs sm:text-sm font-extrabold tabular-nums"
                            :class="targetProgressPct >= 100 ? 'text-emerald-400' : 'text-amber-300'">
                            {{ targetProgressPct }}%
                        </span>
                    </div>
                    <div class="h-2.5 w-full rounded-full bg-black/40 overflow-hidden shadow-inner border border-white/[0.08]">
                        <div class="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                            :class="targetProgressPct >= 100 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 shadow-[0_0_12px_rgba(245,158,11,0.4)]'"
                            :style="{ width: `${Math.min(targetProgressPct, 100)}%` }">
                        </div>
                    </div>
                </template>
                <div v-else class="rounded-xl bg-black/15 border border-white/15 p-3.5 sm:p-4 text-center text-xs font-medium text-white/70">
                    Belum ada buku yang ditandai sebagai target aktif
                </div>
            </div>

            <div class="shrink-0 w-full sm:w-auto">
                <button @click="$emit('openTargetModal')"
                    class="btn-sunset-primary inline-flex w-full items-center justify-center px-4 py-2.5 text-xs font-semibold sm:w-auto shadow-md">
                    {{ targetBooksCount > 0 ? 'Kelola Target' : 'Tentukan Target' }}
                </button>
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
