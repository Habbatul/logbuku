<template>
    <section class="space-y-4">
        <div>
            <h2 class="text-lg sm:text-xl font-bold tracking-tight text-white leading-snug">
                Overview Koleksi
            </h2>
            <p class="mt-0.5 text-xs sm:text-sm leading-relaxed text-white/80">
                Ringkasan inventaris buku fisik dan aktivitas membaca arsip.
            </p>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            <LiquidGlassCard
                as="div"
                mode="webgl"
                :blur="10"
                blur-type="gaussian"
                :refraction="19"
                :bezel="56"
                :dispersion="20"
                :radius="20"
                tint-color="#0c2d48"
                :tint-opacity="0.2"
                prism-color="#38bdf8"
                :glow="0.15"
                :caustics="0"
                :specular="0.15"
                :shadow-size="20"
                :shadow-opacity="0.3"
                interactive
                @click="$emit('openCategoryModal')"
                custom-class="group flex flex-col justify-between p-4 sm:p-5 select-none"
            >
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-sky-300">
                        Total Koleksi
                    </span>
                    <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-sm transition-transform group-hover:scale-105">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round">
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                            <path d="M22 12A10 10 0 0 0 12 2v10z" />
                        </svg>
                    </div>
                </div>
                <div class="mt-3 flex items-baseline justify-between gap-1.5">
                    <div class="flex items-baseline gap-1.5">
                        <span class="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-white">
                            {{ totalBooks }}
                        </span>
                        <span class="text-xs font-semibold text-white">
                            buku
                        </span>
                    </div>
                </div>
            </LiquidGlassCard>

            <LiquidGlassCard
                as="div"
                mode="webgl"
                :blur="10"
                blur-type="gaussian"
                :refraction="19"
                :bezel="56"
                :dispersion="20"
                :radius="20"
                tint-color="#3a2007"
                :tint-opacity="0.2"
                prism-color="#fbbf24"
                :glow="0.15"
                :caustics="0"
                :specular="0.15"
                :shadow-size="20"
                :shadow-opacity="0.3"
                custom-class="flex flex-col justify-between p-4 sm:p-5 select-none"
            >
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-amber-300">
                        Sedang Dibaca
                    </span>
                    <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                        </svg>
                    </div>
                </div>
                <div class="mt-3 flex items-baseline gap-1.5">
                    <span class="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-white">
                        {{ readingBooksCount }}
                    </span>
                    <span class="text-xs font-semibold text-white">
                        buku
                    </span>
                </div>
            </LiquidGlassCard>

            <LiquidGlassCard
                as="div"
                mode="webgl"
                :blur="10"
                blur-type="gaussian"
                :refraction="19"
                :bezel="56"
                :dispersion="20"
                :radius="20"
                tint-color="#3d0c1c"
                :tint-opacity="0.2"
                prism-color="#fb7185"
                :glow="0.15"
                :caustics="0"
                :specular="0.15"
                :shadow-size="20"
                :shadow-opacity="0.3"
                custom-class="flex flex-col justify-between p-4 sm:p-5 select-none"
            >
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-rose-300">
                        Belum Dibaca
                    </span>
                    <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-300 border border-rose-400/30 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                        </svg>
                    </div>
                </div>
                <div class="mt-3 flex items-baseline gap-1.5">
                    <span class="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-white">
                        {{ unreadBooksCount }}
                    </span>
                    <span class="text-xs font-semibold text-white">
                        buku
                    </span>
                </div>
            </LiquidGlassCard>

            <LiquidGlassCard
                as="div"
                mode="webgl"
                :blur="10"
                blur-type="gaussian"
                :refraction="19"
                :bezel="56"
                :dispersion="20"
                :radius="20"
                tint-color="#062e24"
                :tint-opacity="0.2"
                prism-color="#34d399"
                :glow="0.15"
                :caustics="0"
                :specular="0.15"
                :shadow-size="20"
                :shadow-opacity="0.3"
                custom-class="flex flex-col justify-between p-4 sm:p-5 select-none"
            >
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-emerald-300">
                        Rata-Rata 7 Hari
                    </span>
                    <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                            <polyline points="16 7 22 7 22 13" />
                        </svg>
                    </div>
                </div>
                <div class="mt-3 flex items-baseline gap-1.5">
                    <span class="text-2xl sm:text-3xl font-extrabold tracking-tight tabular-nums text-white">
                        {{ avgPagesPerDay }}
                    </span>
                    <span class="text-xs font-semibold text-white">
                        hal/hari
                    </span>
                </div>
            </LiquidGlassCard>
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    totalBooks: number
    readingBooksCount: number
    unreadBooksCount: number
    avgPagesPerDay: number
}>()

defineEmits<{
    (e: 'openCategoryModal'): void
}>()
</script>
