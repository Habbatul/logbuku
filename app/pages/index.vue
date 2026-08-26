<template>
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300 space-y-8">

        <header
            class="flex flex-col gap-5 border-b border-gray-200/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div class="min-w-0 max-w-2xl">
                <div class="mb-2 flex items-center gap-2">
                    <span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                    <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                        Ringkasan Aktivitas
                    </span>
                </div>

                <h1 class="text-[28px] font-bold tracking-[-0.035em] text-gray-950 sm:text-[32px]">
                    Dashboard Analitik
                </h1>

                <p class="mt-2 max-w-xl text-sm leading-6 text-gray-500">
                    Pantau kebiasaan membaca, tren, dan pengeluaran.
                </p>
            </div>

            <div v-if="readingStreak > 0"
                class="flex shrink-0 items-center gap-3 rounded-xl border border-orange-200/80 bg-orange-50/70 px-3.5 py-3 sm:min-w-[210px]">
                <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path
                            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                </div>

                <div class="min-w-0">
                    <p class="text-[11px] font-semibold uppercase tracking-wider text-orange-600">
                        Reading Streak
                    </p>
                    <p class="mt-0.5 text-sm font-bold tracking-tight text-orange-900">
                        {{ readingStreak }} hari berturut-turut
                    </p>
                </div>
            </div>

            <div v-else
                class="flex shrink-0 items-center gap-3 rounded-xl border border-gray-200 bg-gray-50/80 px-3.5 py-3 sm:min-w-[210px]">
                <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400 shadow-sm ring-1 ring-gray-200/70">
                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16.5A1.5 1.5 0 0 0 18.5 18H6.5A2.5 2.5 0 0 1 4 15.5z" />
                        <path d="M4 5.5v13A2.5 2.5 0 0 0 6.5 21H18" />
                    </svg>
                </div>

                <div class="min-w-0">
                    <p class="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                        Reading Streak
                    </p>
                    <p class="mt-0.5 text-sm font-semibold leading-5 text-gray-700">
                        Mulai baca hari ini
                    </p>
                </div>
            </div>
        </header>

        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h2 class="text-base font-semibold tracking-tight text-gray-950"> Overview Koleksi </h2>
                    <p class="mt-1 text-sm text-gray-500"> Ringkasan koleksi buku dan aktivitas membaca. </p>
                </div>
            </div>
            <div
                class="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-gray-200/80 bg-gray-200/80 md:grid-cols-4">
                <div class="group relative min-w-0 bg-white p-4 sm:p-5">
                    <div class="flex items-start justify-between gap-3">
                        <span class="min-w-0 truncate text-[13px] font-medium text-gray-500"> Total Koleksi </span>
                        <button @click="isCategoryModalOpen = true"
                            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 bg-gray-50 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                            title="Detail Topik">
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                                <path d="M22 12A10 10 0 0 0 12 2v10z" />
                            </svg>
                        </button>
                    </div>
                    <div class="mt-3 flex items-baseline gap-1.5">
                        <span class="text-2xl font-bold tracking-[-0.03em] text-gray-950 sm:text-3xl"> {{ totalBooks }}
                        </span>
                        <span class="text-xs font-medium text-gray-400"> Buku </span>
                    </div>
                </div>
                <div class="min-w-0 bg-white p-4 sm:p-5">
                    <div class="flex items-start justify-between">
                        <span class="text-[13px] font-medium text-gray-500"> Sedang Dibaca </span>
                        <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500"></span>
                    </div>
                    <div class="mt-3 flex items-baseline gap-1.5">
                        <span class="text-2xl font-bold tracking-[-0.03em] text-blue-600 sm:text-3xl"> {{
                            readingBooksCount }} </span>
                        <span class="text-xs font-medium text-blue-400"> Buku </span>
                    </div>
                </div>
                <div class="min-w-0 bg-white p-4 sm:p-5">
                    <div class="flex items-start justify-between">
                        <span class="text-[13px] font-medium text-gray-500"> Belum Dibaca </span>
                        <span class="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300"></span>
                    </div>
                    <div class="mt-3 flex items-baseline gap-1.5">
                        <span class="text-2xl font-bold tracking-[-0.03em] text-gray-500 sm:text-3xl"> {{
                            unreadBooksCount }} </span>
                        <span class="text-xs font-medium text-gray-400"> Buku </span>
                    </div>
                </div>
                <div class="min-w-0 bg-white p-4 sm:p-5">
                    <div class="flex items-start justify-between">
                        <span class="min-w-0 truncate text-[13px] font-medium text-gray-500"> Rata-rata 7 Hari </span>
                        <span class="ml-2 mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500"></span>
                    </div>
                    <div class="mt-3 flex items-baseline gap-1.5">
                        <span class="text-2xl font-bold tracking-[-0.03em] text-gray-950 sm:text-3xl"> {{ avgPagesPerDay
                            }} </span>
                        <span class="text-xs font-medium text-gray-400"> hal/hari </span>
                    </div>
                </div>
            </div>
        </section>

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
                            Selesaikan {{ targetBooks.length }} buku pilihan prioritasmu.
                        </p>
                    </div>

                    <div class="min-w-0 flex-1">
                        <div class="mb-2.5 flex items-baseline justify-between gap-4">
                            <p class="min-w-0 truncate text-sm font-medium text-gray-700">
                                <span class="font-semibold text-gray-950"> {{ targetCompleted }} </span>
                                <span class="text-gray-400"> / </span>
                                {{ targetBooks.length }}
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
                        <button @click="openTargetModal"
                            class="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:w-auto">
                            Pilih Buku
                        </button>
                    </div>
                </div>
            </div>
        </section>

        <section class="space-y-4">
            <div class="flex items-end justify-between gap-4">
                <div class="min-w-0">
                    <h2 class="text-base font-semibold tracking-tight text-gray-950"> Analitik Detail </h2>
                    <p class="mt-1 text-sm text-gray-500"> Grafik tren aktivitas dan pengeluaran berdasarkan periode
                        yang dipilih. </p>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                <div
                    class="group flex min-w-0 flex-col overflow-visible rounded-xl border border-gray-200/80 bg-white p-5 transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                    <div class="flex min-w-0 flex-wrap items-start justify-between gap-3">
                        <div class="min-w-0">
                            <span class="text-[13px] font-medium text-gray-500"> Buku Selesai Dibaca </span>
                            <div class="mt-2 flex items-baseline gap-2">
                                <span class="text-3xl font-bold tracking-[-0.03em] text-green-600"> {{
                                    completedData.total }} </span>
                                <span class="text-xs font-medium text-gray-400"> buku </span>
                            </div>
                        </div>
                        <select v-model="filterCompleted"
                            class="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900/5">
                            <option value="1M">1 Bulan Terakhir</option>
                            <option value="6M">6 Bulan Terakhir</option>
                            <option value="1Y">1 Tahun Terakhir</option>
                            <option value="ALL">Total Keseluruhan</option>
                        </select>
                    </div>
                    <div class="mt-7 min-w-0">
                        <div class="relative h-[150px] sm:h-[165px] w-full">
                            <div
                                class="pointer-events-none absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between">
                                <div class="border-t border-dashed border-gray-100"></div>
                                <div class="border-t border-dashed border-gray-100"></div>
                                <div class="border-t border-dashed border-gray-100"></div>
                                <div class="border-t border-gray-200"></div>
                            </div>
                            <svg class="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible"
                                preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path :d="generatePath(completedData.chart)" fill="none" stroke="#16a34a"
                                    stroke-width="2.25" vector-effect="non-scaling-stroke" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            <div class="absolute inset-x-0 top-0 bottom-6 flex"
                                @touchmove.passive="e => handleChartTouch(e, 'comp')"
                                @touchstart.passive="e => handleChartTouch(e, 'comp')"
                                @touchend.passive="activeTooltip.comp = null" @mouseleave="activeTooltip.comp = null">
                                <div v-for="(point, index) in completedData.chart" :key="'comp-' + index"
                                    class="chart-col relative flex h-full min-w-0 flex-1 items-end outline-none cursor-pointer"
                                    :data-index="index" @mouseenter="activeTooltip.comp = index">

                                    <div class="pointer-events-none absolute left-1/2 bottom-full z-30 -translate-x-1/2 pb-2 transition-all duration-300 ease-out"
                                        :class="activeTooltip.comp === index ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'">
                                        <div
                                            class="whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg">
                                            {{ point.label }} · {{ point.value }} Buku
                                        </div>
                                    </div>

                                    <div class="absolute inset-0 rounded-t-md bg-green-500/[0.025] transition-opacity duration-300 ease-out"
                                        :class="activeTooltip.comp === index ? 'opacity-100' : 'opacity-0'">
                                    </div>

                                    <div class="absolute left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full border border-white bg-green-600 shadow-[0_0_0_1px_rgba(22,163,74,0.12)] transition-transform duration-300 ease-out"
                                        :class="activeTooltip.comp === index ? 'scale-[1.35]' : 'scale-100'"
                                        :style="{ bottom: `calc(${point.percent}% - 4px)` }">
                                    </div>

                                    <span v-if="completedData.chart.length <= 15"
                                        class="absolute -bottom-6 left-0 w-full truncate px-0.5 text-center text-[10px] font-medium text-gray-400 sm:text-[11px]">
                                        {{ point.label }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="group flex min-w-0 flex-col overflow-visible rounded-xl border border-gray-200/80 bg-white p-5 transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                    <div class="flex min-w-0 flex-wrap items-start justify-between gap-3">
                        <div class="min-w-0">
                            <span class="text-[13px] font-medium text-gray-500"> Total Halaman Dibaca </span>
                            <div class="mt-2 flex items-baseline gap-2">
                                <span class="text-3xl font-bold tracking-[-0.03em] text-gray-900"> {{
                                    formatNumber(pagesData.total) }} </span>
                                <span class="text-xs font-medium text-gray-400"> halaman </span>
                            </div>
                        </div>
                        <select v-model="filterPages"
                            class="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900/5">
                            <option value="1D">Hari Ini</option>
                            <option value="1W">7 Hari Terakhir</option>
                            <option value="2W">14 Hari Terakhir</option>
                            <option value="1M">1 Bulan Terakhir</option>
                            <option value="3M">3 Bulan Terakhir</option>
                            <option value="6M">6 Bulan Terakhir</option>
                            <option value="1Y">1 Tahun Terakhir</option>
                            <option value="ALL">Total Keseluruhan</option>
                        </select>
                    </div>
                    <div class="mt-7 min-w-0">
                        <div class="relative h-[150px] sm:h-[165px] w-full">
                            <div
                                class="pointer-events-none absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between">
                                <div class="border-t border-dashed border-gray-100"></div>
                                <div class="border-t border-dashed border-gray-100"></div>
                                <div class="border-t border-dashed border-gray-100"></div>
                                <div class="border-t border-gray-200"></div>
                            </div>
                            <svg class="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible"
                                preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path :d="generatePath(pagesData.chart)" fill="none" stroke="#111827"
                                    stroke-width="2.25" vector-effect="non-scaling-stroke" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            <div class="absolute inset-x-0 top-0 bottom-6 flex"
                                @touchmove.passive="e => handleChartTouch(e, 'page')"
                                @touchstart.passive="e => handleChartTouch(e, 'page')"
                                @touchend.passive="activeTooltip.page = null" @mouseleave="activeTooltip.page = null">
                                <div v-for="(point, index) in pagesData.chart" :key="'page-' + index"
                                    class="chart-col relative flex h-full min-w-0 flex-1 items-end outline-none cursor-pointer"
                                    :data-index="index" @mouseenter="activeTooltip.page = index">

                                    <div class="pointer-events-none absolute left-1/2 bottom-full z-30 -translate-x-1/2 pb-2 transition-all duration-300 ease-out"
                                        :class="activeTooltip.page === index ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'">
                                        <div
                                            class="whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg">
                                            {{ point.label }} · {{ formatNumber(point.value) }} hal
                                        </div>
                                    </div>

                                    <div class="absolute inset-0 rounded-t-md bg-gray-900/[0.025] transition-opacity duration-300 ease-out"
                                        :class="activeTooltip.page === index ? 'opacity-100' : 'opacity-0'">
                                    </div>

                                    <div class="absolute left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full border border-white bg-gray-900 shadow-[0_0_0_1px_rgba(17,24,39,0.1)] transition-transform duration-300 ease-out"
                                        :class="activeTooltip.page === index ? 'scale-[1.35]' : 'scale-100'"
                                        :style="{ bottom: `calc(${point.percent}% - 4px)` }">
                                    </div>

                                    <span v-if="pagesData.chart.length <= 15"
                                        class="absolute -bottom-6 left-0 w-full truncate px-0.5 text-center text-[10px] font-medium text-gray-400 sm:text-[11px]">
                                        {{ point.label }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    class="group flex min-w-0 flex-col overflow-visible rounded-xl border border-gray-200/80 bg-white p-5 transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                    <div class="flex min-w-0 flex-wrap items-start justify-between gap-3">
                        <div class="min-w-0">
                            <span class="text-[13px] font-medium text-gray-500"> Uang Dihabiskan </span>
                            <div class="mt-2 flex min-w-0 items-baseline gap-2">
                                <span class="truncate text-2xl font-bold tracking-[-0.03em] text-gray-900 sm:text-3xl">
                                    {{ formatCurrency(financeData.total) }}
                                </span>
                            </div>
                        </div>
                        <select v-model="filterFinance"
                            class="shrink-0 rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900/5">
                            <option value="1D">Hari Ini</option>
                            <option value="1W">7 Hari Terakhir</option>
                            <option value="2W">14 Hari Terakhir</option>
                            <option value="1M">1 Bulan Terakhir</option>
                            <option value="3M">3 Bulan Terakhir</option>
                            <option value="6M">6 Bulan Terakhir</option>
                            <option value="1Y">1 Tahun Terakhir</option>
                            <option value="ALL">Total Keseluruhan</option>
                        </select>
                    </div>
                    <div class="mt-7 min-w-0">
                        <div class="relative h-[150px] sm:h-[165px] w-full">
                            <div
                                class="pointer-events-none absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between">
                                <div class="border-t border-dashed border-gray-100"></div>
                                <div class="border-t border-dashed border-gray-100"></div>
                                <div class="border-t border-dashed border-gray-100"></div>
                                <div class="border-t border-gray-200"></div>
                            </div>
                            <svg class="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible"
                                preserveAspectRatio="none" viewBox="0 0 100 100">
                                <path :d="generatePath(financeData.chart)" fill="none" stroke="#2563eb"
                                    stroke-width="2.25" vector-effect="non-scaling-stroke" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>
                            <div class="absolute inset-x-0 top-0 bottom-6 flex"
                                @touchmove.passive="e => handleChartTouch(e, 'fin')"
                                @touchstart.passive="e => handleChartTouch(e, 'fin')"
                                @touchend.passive="activeTooltip.fin = null" @mouseleave="activeTooltip.fin = null">
                                <div v-for="(point, index) in financeData.chart" :key="'fin-' + index"
                                    class="chart-col relative flex h-full min-w-0 flex-1 items-end outline-none cursor-pointer"
                                    :data-index="index" @mouseenter="activeTooltip.fin = index">

                                    <div class="pointer-events-none absolute left-1/2 bottom-full z-30 -translate-x-1/2 pb-2 transition-all duration-300 ease-out"
                                        :class="activeTooltip.fin === index ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'">
                                        <div
                                            class="whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg">
                                            {{ point.label }} · {{ formatCurrency(point.value) }}
                                        </div>
                                    </div>

                                    <div class="absolute inset-0 rounded-t-md bg-blue-500/[0.025] transition-opacity duration-300 ease-out"
                                        :class="activeTooltip.fin === index ? 'opacity-100' : 'opacity-0'">
                                    </div>

                                    <div class="absolute left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full border border-white bg-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,0.12)] transition-transform duration-300 ease-out"
                                        :class="activeTooltip.fin === index ? 'scale-[1.35]' : 'scale-100'"
                                        :style="{ bottom: `calc(${point.percent}% - 4px)` }">
                                    </div>

                                    <span v-if="financeData.chart.length <= 15"
                                        class="absolute -bottom-6 left-0 w-full truncate px-0.5 text-center text-[10px] font-medium text-gray-400 sm:text-[11px]">
                                        {{ point.label }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <section
                class="relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div class="border-b border-gray-100 px-5 py-4">
                    <div class="min-w-0">
                        <div class="flex items-center gap-2">
                            <h3 class="truncate text-sm font-semibold tracking-tight text-gray-950"> Aktivitas Teratas
                                (7 Hari) </h3>
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
                        <p class="mt-1 truncate text-[13px] text-gray-500"> Buku paling sering dibaca berdasarkan sesi.
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
                            <h4 class="line-clamp-2 text-[13px] font-semibold leading-5 text-gray-900"> {{
                                insight.book.title }} </h4>
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
                                <span class="truncate text-[11px] font-medium text-gray-500"> {{ book.pagesRead }} / {{
                                    book.totalPages }} hal </span>
                                <span class="shrink-0 text-xs font-bold tabular-nums text-gray-900"> {{
                                    Math.round((book.pagesRead / book.totalPages) * 100) }}% </span>
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

        <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <section
                class="min-w-0 overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h3 class="text-sm font-semibold tracking-tight text-gray-950"> 3 Buku Termahal </h3>
                        <p class="mt-1 text-[13px] text-gray-500"> Koleksi dengan harga tertinggi. </p>
                    </div>
                    <span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400"> Harga </span>
                </div>
                <div class="px-5">
                    <div v-if="top3Expensive.length === 0" class="py-10 text-center text-sm text-gray-400">
                        Belum ada data harga.
                    </div>
                    <div v-for="(book, i) in top3Expensive" :key="'exp-' + book.id"
                        class="group flex min-w-0 items-center gap-3.5 border-b border-gray-100 py-4 last:border-0">
                        <div
                            class="h-[68px] w-[48px] shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200/80">
                            <img v-if="book.imageUrl" :src="book.imageUrl"
                                class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                                loading="lazy" />
                        </div>
                        <div class="w-5 shrink-0 text-xs font-bold tabular-nums text-gray-300">
                            {{ String(i + 1).padStart(2, '0') }}
                        </div>
                        <div class="min-w-0 flex-1">
                            <h4 class="truncate text-[13px] font-semibold text-gray-900"> {{ book.title }} </h4>
                            <div class="mt-1.5">
                                <span class="text-sm font-bold tracking-tight text-gray-950"> {{
                                    formatCurrency(book.price) }} </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                class="min-w-0 overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div>
                        <h3 class="text-sm font-semibold tracking-tight text-gray-950"> 3 Buku Terbaru </h3>
                        <p class="mt-1 text-[13px] text-gray-500"> Koleksi yang paling baru ditambahkan. </p>
                    </div>
                    <span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400"> Terbaru </span>
                </div>
                <div class="px-5">
                    <div v-if="top3Newest.length === 0" class="py-10 text-center text-sm text-gray-400">
                        Belum ada data buku.
                    </div>
                    <div v-for="(book, i) in top3Newest" :key="'new-' + book.id"
                        class="group flex min-w-0 items-center gap-3.5 border-b border-gray-100 py-4 last:border-0">
                        <div
                            class="h-[68px] w-[48px] shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200/80">
                            <img v-if="book.imageUrl" :src="book.imageUrl"
                                class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                                loading="lazy" />
                        </div>
                        <div class="w-5 shrink-0 text-xs font-bold tabular-nums text-gray-300">
                            {{ String(i + 1).padStart(2, '0') }}
                        </div>
                        <div class="min-w-0 flex-1">
                            <h4 class="truncate text-[13px] font-semibold text-gray-900"> {{ book.title }} </h4>
                            <p class="mt-1.5 text-xs font-medium text-gray-500">
                                {{ new Date(book.date || book.createdAt).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                }) }}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <section class="mt-10 border-t border-gray-200 pt-8">
            <div
                class="flex flex-col gap-6 rounded-xl border border-gray-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div class="min-w-0">
                    <div class="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0 text-gray-500">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                        <h2 class="truncate text-base font-semibold tracking-tight text-gray-950"> Database Management
                        </h2>
                    </div>
                    <p class="mt-1.5 max-w-[70ch] text-sm leading-6 text-gray-500">
                        Export seluruh koleksi dan riwayat membacamu sebagai file JSON untuk backup, atau Import untuk
                        memulihkannya.
                    </p>
                </div>

                <div class="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
                    <button @click="triggerImport"
                        class="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:flex-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" x2="12" y1="3" y2="15" />
                        </svg>
                        Import
                    </button>
                    <input type="file" ref="fileInput" accept=".json" class="hidden" @change="importDatabase" />

                    <button @click="exportDatabase"
                        class="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:flex-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        Export
                    </button>
                </div>
            </div>
        </section>

        <div v-if="isCategoryModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="isCategoryModalOpen = false"></div>
            <div
                class="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                <div class="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 class="text-lg font-bold text-gray-900">Total Buku per Topik</h2>
                    <button @click="isCategoryModalOpen = false"
                        class="text-gray-400 hover:text-gray-900 transition-colors outline-none focus:ring-2 focus:ring-gray-900 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-5 max-h-[60vh] overflow-y-auto space-y-3 custom-scrollbar">
                    <div v-if="booksPerCategory.length === 0" class="text-center text-gray-500 text-sm py-4">Belum ada
                        data buku.</div>
                    <div v-for="cat in booksPerCategory" :key="cat.name"
                        class="flex justify-between items-center border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                        <span class="text-sm font-medium text-gray-700 truncate pr-2">{{ cat.name }}</span>
                        <span
                            class="text-sm font-bold text-gray-900 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-md shadow-sm shrink-0">{{
                                cat.count }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isTargetModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="isTargetModalOpen = false"></div>
            <div
                class="relative bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div class="p-5 border-b border-gray-200 flex justify-between items-center bg-white z-10 shrink-0">
                    <div class="min-w-0 pr-4">
                        <h2 class="text-lg font-bold text-gray-900 truncate">Pilih Buku Target</h2>
                        <p class="text-sm text-gray-500 mt-1 truncate">Pilih buku yang ingin diselesaikan.</p>
                    </div>
                    <button @click="isTargetModalOpen = false"
                        class="text-gray-400 hover:text-gray-900 transition-colors shrink-0 outline-none focus:ring-2 focus:ring-gray-900 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-4 border-b border-gray-200 bg-gray-50 shrink-0">
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="text-gray-500" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                        <input v-model="targetSearchQuery" type="text" placeholder="Cari judul buku..."
                            class="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all text-sm font-medium text-gray-900 shadow-sm" />
                    </div>
                </div>

                <div class="p-2 flex-1 overflow-y-auto bg-white custom-scrollbar">
                    <div v-if="filteredTargetBooks.length === 0"
                        class="text-center py-8 text-gray-500 text-sm font-medium">Buku tidak ditemukan.</div>
                    <label v-for="book in filteredTargetBooks" :key="'tgt-' + book.id"
                        class="flex items-center gap-4 p-3 rounded-md hover:bg-gray-50 border border-transparent hover:border-gray-200 cursor-pointer transition-colors group">
                        <div class="shrink-0 flex items-center">
                            <input type="checkbox" :value="book.id" v-model="tempSelectedTargets"
                                class="w-4 h-4 text-gray-900 bg-gray-100 border-gray-300 rounded focus:ring-gray-900 focus:ring-2 cursor-pointer transition-all">
                        </div>
                        <div
                            class="h-12 w-8 bg-gray-100 border border-gray-200 rounded overflow-hidden flex-shrink-0 shadow-sm">
                            <img v-if="book.imageUrl" :src="book.imageUrl" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <h4 class="text-sm font-bold text-gray-900 truncate">{{ book.title }}</h4>
                            <div class="flex items-center gap-3 mt-1.5">
                                <div class="w-full bg-gray-100 rounded-full h-1.5 flex-1 overflow-hidden shadow-inner">
                                    <div class="h-1.5 rounded-full"
                                        :class="getProgressColor(book.pagesRead, book.totalPages)"
                                        :style="{ width: `${Math.min((book.pagesRead / book.totalPages) * 100, 100)}%` }">
                                    </div>
                                </div>
                                <span class="text-xs font-bold text-gray-500 shrink-0">{{ Math.round((book.pagesRead /
                                    book.totalPages) * 100) || 0 }}%</span>
                            </div>
                        </div>
                    </label>
                </div>

                <div class="p-4 border-t border-gray-200 bg-gray-50 shrink-0 flex gap-3">
                    <button @click="isTargetModalOpen = false"
                        class="flex-1 bg-white border border-gray-300 text-gray-700 font-semibold py-2 rounded-md hover:bg-gray-100 transition-colors text-sm shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none">Batal</button>
                    <button @click="saveTargetSelection"
                        class="flex-1 bg-gray-900 border border-transparent text-white font-semibold py-2 rounded-md hover:bg-black transition-colors text-sm shadow-sm focus:ring-2 focus:ring-gray-900 focus:outline-none">Simpan
                        Target</button>
                </div>
            </div>
        </div>

    </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
const { books, loadBooks, updateTargets } = useBooks()

const getProgressColor = (read: number, total: number) => {
    if (!total) return 'bg-gray-200'
    const pct = (read / total) * 100
    if (pct >= 100) return 'bg-green-600'
    if (pct >= 75) return 'bg-purple-500'
    if (pct >= 50) return 'bg-blue-500'
    if (pct >= 25) return 'bg-orange-500'
    return 'bg-red-500'
}

const isCategoryModalOpen = ref(false)
const isTargetModalOpen = ref(false)

const targetSearchQuery = ref('')
const tempSelectedTargets = ref<number[]>([])

const targetBooks = computed(() => books.value.filter(b => b.isTarget))
const targetCompleted = computed(() => targetBooks.value.filter(b => b.pagesRead >= b.totalPages).length)
const targetTotalPages = computed(() => targetBooks.value.reduce((sum, b) => sum + (b.totalPages || 0), 0))
const targetReadPages = computed(() => targetBooks.value.reduce((sum, b) => sum + Math.min((b.pagesRead || 0), (b.totalPages || 0)), 0))

const targetProgressPct = computed(() => {
    if (targetTotalPages.value === 0) return 0
    return Math.round((targetReadPages.value / targetTotalPages.value) * 100)
})

const filteredTargetBooks = computed(() => {
    if (!targetSearchQuery.value) return books.value
    return books.value.filter(b => b.title.toLowerCase().includes(targetSearchQuery.value.toLowerCase()))
})

const openTargetModal = () => {
    targetSearchQuery.value = ''
    tempSelectedTargets.value = targetBooks.value.map(b => b.id)
    isTargetModalOpen.value = true
}

const saveTargetSelection = async () => {
    await updateTargets(tempSelectedTargets.value)
    isTargetModalOpen.value = false
}

const fileInput = ref<HTMLInputElement | null>(null)

const exportDatabase = async () => {
    const request = indexedDB.open('BookTrackerDB', 3)
    request.onsuccess = (e: any) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains('books')) return
        const tx = db.transaction('books', 'readonly')
        const store = tx.objectStore('books')
        const getAll = store.getAll()

        getAll.onsuccess = () => {
            const data = JSON.stringify(getAll.result, null, 2)
            const blob = new Blob([data], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `booktracker-backup-${new Date().toISOString().split('T')[0]}.json`
            a.click()
            URL.revokeObjectURL(url)
        }
    }
}

const triggerImport = () => { if (fileInput.value) fileInput.value.click() }

const importDatabase = (event: any) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (e: any) => {
        try {
            const data = JSON.parse(e.target.result)
            if (!Array.isArray(data)) throw new Error('Format JSON tidak valid.')
            const request = indexedDB.open('BookTrackerDB', 3)
            request.onsuccess = (ev: any) => {
                const db = ev.target.result
                const tx = db.transaction('books', 'readwrite')
                const store = tx.objectStore('books')
                data.forEach((book: any) => store.put(book))
                tx.oncomplete = () => window.location.reload()
            }
        } catch (error) {
            alert("Gagal melakukan import. Pastikan file JSON valid.")
        } finally {
            if (fileInput.value) fileInput.value.value = ''
        }
    }
    reader.readAsText(file)
}

const filterCompleted = ref('1M')
const filterPages = ref('1W')
const filterFinance = ref('1M')

const activeTooltip = ref<Record<string, number | null>>({
    comp: null,
    page: null,
    fin: null
})

const handleChartTouch = (e: TouchEvent, chart: string) => {
    const touch = e.touches[0]
    const target = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement | null
    if (target) {
        const col = target.closest('.chart-col') as HTMLElement | null
        if (col && col.dataset.index) {
            activeTooltip.value[chart] = parseInt(col.dataset.index)
        }
    }
}

const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}
const formatNumber = (val: number) => {
    return new Intl.NumberFormat('id-ID').format(val || 0)
}

const getStartDate = (filter: string) => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    switch (filter) {
        case '1D': return d
        case '1W': d.setDate(d.getDate() - 6); return d
        case '2W': d.setDate(d.getDate() - 13); return d
        case '1M': d.setDate(d.getDate() - 29); return d
        case '3M': d.setMonth(d.getMonth() - 3); return d
        case '6M': d.setMonth(d.getMonth() - 6); return d
        case '1Y': d.setFullYear(d.getFullYear() - 1); return d
        default: return new Date(0)
    }
}

const buildChartData = (dataArray: any[], dateKey: string, valueKey: string | null, filter: string) => {
    const chartMap = new Map()
    const start = getStartDate(filter)
    const end = new Date()

    let step = 'day'
    if (['3M', '6M', '1Y', 'ALL'].includes(filter)) step = 'month'

    if (step === 'day') {
        const days = filter === '1W' ? 7 : filter === '2W' ? 14 : filter === '1M' ? 30 : filter === '1D' ? 1 : 0
        if (days > 0) {
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(end)
                d.setDate(d.getDate() - i)
                const key = d.toISOString().split('T')[0]
                chartMap.set(key, { label: d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }), value: 0 })
            }
        }
    } else if (step === 'month') {
        let mCount = filter === '3M' ? 3 : filter === '6M' ? 6 : filter === '1Y' ? 12 : 12
        if (filter === 'ALL') {
            if (dataArray.length > 0) {
                const oldest = new Date(Math.min(...dataArray.map(d => new Date(d[dateKey]).getTime())))
                mCount = (end.getFullYear() - oldest.getFullYear()) * 12 + (end.getMonth() - oldest.getMonth()) + 1
                if (mCount > 24) mCount = 24
            }
        }
        for (let i = mCount - 1; i >= 0; i--) {
            const d = new Date(end)
            d.setMonth(d.getMonth() - i)
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
            chartMap.set(key, { label: d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' }), value: 0 })
        }
    }

    dataArray.forEach(item => {
        const itemDate = new Date(item[dateKey])
        if (itemDate >= start && itemDate <= end) {
            let key = ''
            if (step === 'day') key = itemDate.toISOString().split('T')[0]
            if (step === 'month') key = `${itemDate.getFullYear()}-${String(itemDate.getMonth() + 1).padStart(2, '0')}`

            if (chartMap.has(key)) {
                const current = chartMap.get(key)
                current.value += valueKey ? (item[valueKey] || 0) : 1
            }
        }
    })

    const result = Array.from(chartMap.values())
    const maxVal = Math.max(...result.map(d => d.value), 1)

    return result.map(d => ({
        ...d,
        percent: (d.value / maxVal) * 100
    }))
}

const generatePath = (chart: any[]) => {
    if (!chart || chart.length === 0) return ''
    const N = chart.length
    if (N === 1) return `M 0 ${100 - chart[0].percent} L 100 ${100 - chart[0].percent}`

    return chart.map((c, i) => {
        const x = ((i + 0.5) / N) * 100
        const y = 100 - (c.percent || 0)
        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    }).join(' ')
}

const totalBooks = computed(() => books.value.length)

const booksPerCategory = computed(() => {
    const counts: Record<string, number> = {}
    books.value.forEach(b => {
        const topics = Array.isArray(b.topic) && b.topic.length > 0 ? b.topic : ['Tanpa Kategori']
        topics.forEach((t: string) => {
            const clean = t.trim()
            counts[clean] = (counts[clean] || 0) + 1
        })
    })
    return Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
})

const readingBooksCount = computed(() => books.value.filter(b => b.pagesRead > 0 && b.pagesRead < b.totalPages).length)
const unreadBooksCount = computed(() => books.value.filter(b => b.pagesRead === 0).length)

const allHistoryLogs = computed(() => {
    const logs: { date: string, pages: number, bookId: number }[] = []
    books.value.forEach(book => {
        if (book.readHistory && book.readHistory.length > 0) {
            book.readHistory.forEach((h: any) => {
                if (h.pagesAdded > 0) logs.push({ date: h.date, pages: h.pagesAdded, bookId: book.id })
            })
        }
    })
    return logs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const avgPagesPerDay = computed(() => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const pagesLast7Days = allHistoryLogs.value
        .filter(log => new Date(log.date) >= sevenDaysAgo)
        .reduce((sum, log) => sum + log.pages, 0)
    return Math.round((pagesLast7Days / 7) * 10) / 10
})

const readingStreak = computed(() => {
    if (allHistoryLogs.value.length === 0) return 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const formatDate = (d: Date) => {
        const offset = d.getTimezoneOffset()
        return new Date(d.getTime() - (offset * 60 * 1000)).toISOString().split('T')[0]
    }

    const readDates = new Set(allHistoryLogs.value.map(log => formatDate(new Date(log.date))))
    let streak = 0
    const todayStr = formatDate(today)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayStr = formatDate(yesterday)

    if (!readDates.has(todayStr) && !readDates.has(yesterdayStr)) return 0

    let d = readDates.has(todayStr) ? new Date(today) : new Date(yesterday)
    while (readDates.has(formatDate(d))) {
        streak++
        d.setDate(d.getDate() - 1)
    }
    return streak
})

const completedData = computed(() => {
    const start = getStartDate(filterCompleted.value)
    const validBooks = books.value.filter(b => b.pagesRead >= b.totalPages && new Date(b.updatedAt) >= start)
    return {
        total: validBooks.length,
        chart: buildChartData(validBooks, 'updatedAt', null, filterCompleted.value)
    }
})

const pagesData = computed(() => {
    const start = getStartDate(filterPages.value)
    const validLogs = allHistoryLogs.value.filter(l => new Date(l.date) >= start)
    return {
        total: validLogs.reduce((sum, l) => sum + l.pages, 0),
        chart: buildChartData(validLogs, 'date', 'pages', filterPages.value)
    }
})

const financeData = computed(() => {
    const start = getStartDate(filterFinance.value)
    const validBooks = books.value.filter(b => (b.price || 0) > 0 && new Date(b.date || b.createdAt) >= start)
    return {
        total: validBooks.reduce((sum, b) => sum + (b.price || 0), 0),
        chart: buildChartData(validBooks, 'date', 'price', filterFinance.value)
    }
})

const mostReadBooksInsight = computed(() => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentLogs = allHistoryLogs.value.filter(log => new Date(log.date) >= sevenDaysAgo)
    if (recentLogs.length === 0) return []

    const bookStats: Record<number, { sessions: number, pagesAdded: number }> = {}
    recentLogs.forEach(log => {
        if (!bookStats[log.bookId]) bookStats[log.bookId] = { sessions: 0, pagesAdded: 0 }
        bookStats[log.bookId].sessions++
        bookStats[log.bookId].pagesAdded += log.pages
    })

    const result: any[] = []
    for (const [id, stats] of Object.entries(bookStats)) {
        const book = books.value.find(b => b.id === Number(id))
        if (book) result.push({ book, sessions: stats.sessions, pagesAdded: stats.pagesAdded })
    }

    return result.sort((a, b) => b.sessions - a.sessions).slice(0, 2)
})

const currentlyReadingList = computed(() => {
    return books.value
        .filter(b => b.pagesRead > 0 && b.pagesRead < b.totalPages)
        .sort((a, b) => {
            const pctA = (a.pagesRead / (a.totalPages || 1))
            const pctB = (b.pagesRead / (b.totalPages || 1))
            return pctB - pctA
        })
        .slice(0, 3)
})

const topicScores = computed(() => {
    const scores: Record<string, number> = {}
    books.value.forEach(b => {
        const topics = Array.isArray(b.topic) && b.topic.length > 0 ? b.topic : ['Tanpa Kategori']
        let pts = 0
        if (b.totalPages > 0) {
            if (b.pagesRead >= b.totalPages) {
                pts = 100
            } else {
                pts = (b.pagesRead / b.totalPages) * 100
            }
        }

        topics.forEach((t: string) => {
            const clean = t.trim()
            if (!scores[clean]) scores[clean] = 0
            scores[clean] += pts
        })
    })

    return Object.entries(scores)
        .map(([name, score]) => ({ name, score: Math.round(score) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
})
const maxTopicScore = computed(() => topicScores.value.length ? Math.max(...topicScores.value.map(c => c.score)) : 1)

const top3Expensive = computed(() => {
    return [...books.value].filter(b => (b.price || 0) > 0).sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 3)
})

const top3Newest = computed(() => {
    return [...books.value].sort((a, b) => new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()).slice(0, 3)
})

onMounted(() => loadBooks())
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