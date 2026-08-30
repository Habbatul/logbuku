<template>
    <section class="space-y-4">
        <div class="flex items-end justify-between gap-4">
            <div class="min-w-0">
                <h2 class="text-base font-semibold tracking-tight text-gray-950">
                    Analitik Detail
                </h2>
                <p class="mt-1 text-sm text-gray-500">
                    Grafik tren aktivitas dan pengeluaran berdasarkan periode yang dipilih.
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
                class="group flex min-w-0 flex-col overflow-visible rounded-xl border border-gray-200/80 bg-white p-5 transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div class="flex items-center justify-between gap-3">
                    <span class="truncate text-[13px] font-medium text-gray-500">Buku Selesai Dibaca</span>

                    <select v-model="filterCompleted"
                        class="shrink-0 cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900/5">
                        <option value="1M">1 Bulan Terakhir</option>
                        <option value="6M">6 Bulan Terakhir</option>
                        <option value="1Y">Tahun Ini</option>
                        <option value="ALL">Total Keseluruhan</option>
                    </select>
                </div>

                <div class="mt-2.5 flex items-baseline gap-1.5 flex-wrap">
                    <span
                        class="text-2xl font-bold tracking-[-0.03em] text-green-600 sm:text-3xl tabular-nums break-words">
                        {{ completedData.total }}
                    </span>
                    <span class="shrink-0 text-xs font-medium text-gray-400">buku</span>
                </div>

                <div class="mt-6 min-w-0">
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
                            <path :d="generatePath(processedCompletedChart)" fill="none" stroke="#16a34a"
                                stroke-width="2.25" vector-effect="non-scaling-stroke" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <div class="absolute inset-x-0 top-0 bottom-6 flex"
                            @touchmove.passive="e => handleChartTouch(e, 'comp')"
                            @touchstart.passive="e => handleChartTouch(e, 'comp')"
                            @touchend.passive="activeTooltip.comp = null" @mouseleave="activeTooltip.comp = null">
                            <div v-for="(point, index) in processedCompletedChart" :key="'comp-' + index"
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
                                    :class="activeTooltip.comp === index ? 'opacity-100' : 'opacity-0'"></div>

                                <div class="absolute left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full border border-white bg-green-600 shadow-[0_0_0_1px_rgba(22,163,74,0.12)] transition-transform duration-300 ease-out"
                                    :class="activeTooltip.comp === index ? 'scale-[1.35]' : 'scale-100'"
                                    :style="{ bottom: `calc(${point.percent}% - 4px)` }"></div>

                                <span v-if="processedCompletedChart.length <= 15"
                                    class="absolute -bottom-6 left-0 w-full truncate px-0.5 text-center text-[9px] font-medium text-gray-400 sm:text-[10px] md:text-[11px]">
                                    {{ point.label }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="group flex min-w-0 flex-col overflow-visible rounded-xl border border-gray-200/80 bg-white p-5 transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div class="flex items-center justify-between gap-3">
                    <span class="truncate text-[13px] font-medium text-gray-500">Total Halaman Dibaca</span>

                    <select v-model="filterPages"
                        class="shrink-0 cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900/5">
                        <option value="1D">Hari Ini</option>
                        <option value="1W">7 Hari Terakhir</option>
                        <option value="2W">14 Hari Terakhir</option>
                        <option value="1M">1 Bulan Terakhir</option>
                    </select>
                </div>

                <div class="mt-2.5 flex items-baseline gap-1.5 flex-wrap">
                    <span
                        class="text-2xl font-bold tracking-[-0.03em] text-gray-900 sm:text-3xl tabular-nums break-words">
                        {{ formatNumber(pagesData.total) }}
                    </span>
                    <span class="shrink-0 text-xs font-medium text-gray-400">halaman</span>
                </div>

                <div class="mt-6 min-w-0">
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
                            <path :d="generatePath(processedPagesChart)" fill="none" stroke="#111827"
                                stroke-width="2.25" vector-effect="non-scaling-stroke" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <div class="absolute inset-x-0 top-0 bottom-6 flex"
                            @touchmove.passive="e => handleChartTouch(e, 'page')"
                            @touchstart.passive="e => handleChartTouch(e, 'page')"
                            @touchend.passive="activeTooltip.page = null" @mouseleave="activeTooltip.page = null">
                            <div v-for="(point, index) in processedPagesChart" :key="'page-' + index"
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
                                    :class="activeTooltip.page === index ? 'opacity-100' : 'opacity-0'"></div>

                                <div class="absolute left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full border border-white bg-gray-900 shadow-[0_0_0_1px_rgba(17,24,39,0.1)] transition-transform duration-300 ease-out"
                                    :class="activeTooltip.page === index ? 'scale-[1.35]' : 'scale-100'"
                                    :style="{ bottom: `calc(${point.percent}% - 4px)` }"></div>

                                <span v-if="processedPagesChart.length <= 15"
                                    class="absolute -bottom-6 left-0 w-full truncate px-0.5 text-center text-[9px] font-medium text-gray-400 sm:text-[10px] md:text-[11px]">
                                    {{ point.label }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="group flex min-w-0 flex-col overflow-visible rounded-xl border border-gray-200/80 bg-white p-5 transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)] md:col-span-2 lg:col-span-1">
                <div class="flex items-center justify-between gap-3">
                    <span class="truncate text-[13px] font-medium text-gray-500">Uang Dihabiskan</span>

                    <select v-model="filterFinance"
                        class="shrink-0 cursor-pointer rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:bg-white focus:ring-2 focus:ring-gray-900/5">
                        <option value="1D">Hari Ini</option>
                        <option value="1W">7 Hari Terakhir</option>
                        <option value="2W">14 Hari Terakhir</option>
                        <option value="1M">1 Bulan Terakhir</option>
                        <option value="3M">3 Bulan Terakhir</option>
                        <option value="6M">6 Bulan Terakhir</option>
                        <option value="1Y">Tahun Ini</option>
                        <option value="ALL">Total Keseluruhan</option>
                    </select>
                </div>

                <div class="mt-2.5 flex items-baseline gap-1.5 flex-wrap">
                    <span
                        class="text-2xl font-bold tracking-[-0.03em] text-gray-900 sm:text-3xl tabular-nums break-words">
                        {{ formatCurrency(financeData.total) }}
                    </span>
                </div>

                <div class="mt-6 min-w-0">
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
                            <path :d="generatePath(processedFinanceChart)" fill="none" stroke="#2563eb"
                                stroke-width="2.25" vector-effect="non-scaling-stroke" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <div class="absolute inset-x-0 top-0 bottom-6 flex"
                            @touchmove.passive="e => handleChartTouch(e, 'fin')"
                            @touchstart.passive="e => handleChartTouch(e, 'fin')"
                            @touchend.passive="activeTooltip.fin = null" @mouseleave="activeTooltip.fin = null">
                            <div v-for="(point, index) in processedFinanceChart" :key="'fin-' + index"
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
                                    :class="activeTooltip.fin === index ? 'opacity-100' : 'opacity-0'"></div>

                                <div class="absolute left-1/2 z-20 h-2 w-2 -translate-x-1/2 rounded-full border border-white bg-blue-600 shadow-[0_0_0_1px_rgba(37,99,235,0.12)] transition-transform duration-300 ease-out"
                                    :class="activeTooltip.fin === index ? 'scale-[1.35]' : 'scale-100'"
                                    :style="{ bottom: `calc(${point.percent}% - 4px)` }"></div>

                                <span v-if="processedFinanceChart.length <= 15"
                                    class="absolute -bottom-6 left-0 w-full truncate px-0.5 text-center text-[9px] font-medium text-gray-400 sm:text-[10px] md:text-[11px]">
                                    {{ point.label }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface ChartPoint {
    label: string
    value: number
    percent: number
}

interface AnalyticsData {
    total: number
    chart: ChartPoint[]
}

const filterCompleted = defineModel<string>('filterCompleted', { default: '1M' })
const filterPages = defineModel<string>('filterPages', { default: '1W' })
const filterFinance = defineModel<string>('filterFinance', { default: '1M' })

const props = defineProps<{
    completedData: AnalyticsData
    pagesData: AnalyticsData
    financeData: AnalyticsData
}>()

const currentYear = computed(() => new Date().getFullYear())

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

const formatNumber = (val: number | undefined | null) => {
    return Number(val || 0).toLocaleString('id-ID')
}

const formatCurrency = (val: number | undefined | null) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(val || 0)
}

const activeTooltip = ref<Record<string, number | null>>({
    comp: null,
    page: null,
    fin: null
})

const normalizeChartData = (data: AnalyticsData, filter: string): ChartPoint[] => {
    if (!data) return []

    if (filter === 'ALL') {
        const totalVal = data.total || 0
        return [
            { label: 'Awal', value: 0, percent: 15 },
            { label: 'Total', value: totalVal, percent: 85 }
        ]
    }

    if (filter === '1Y') {
        const incoming = data.chart || []
        const maxVal = Math.max(...incoming.map(p => p?.value || 0), 1)

        return MONTH_LABELS.map((month, idx) => {
            const found = incoming.find(p => p.label?.toLowerCase().startsWith(month.toLowerCase()) || p.label === month) || incoming[idx]
            const val = found ? (found.value || 0) : 0
            const percent = (found && found.percent !== undefined)
                ? found.percent
                : (val > 0 ? Math.max(15, Math.min(95, Math.round((val / maxVal) * 80) + 15)) : 10)

            return {
                label: month,
                value: val,
                percent: percent
            }
        })
    }

    return data.chart || []
}

const processedCompletedChart = computed(() => {
    return normalizeChartData(props.completedData, filterCompleted.value)
})

const processedPagesChart = computed(() => {
    return normalizeChartData(props.pagesData, filterPages.value)
})

const processedFinanceChart = computed(() => {
    return normalizeChartData(props.financeData, filterFinance.value)
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

const generatePath = (chart: ChartPoint[]) => {
    if (!chart || !Array.isArray(chart) || chart.length === 0) return ''
    const N = chart.length
    const getY = (val: any) => {
        const num = Number(val)
        if (isNaN(num) || !isFinite(num)) return 100
        return Math.max(0, Math.min(100, Number((100 - num).toFixed(2))))
    }

    if (N === 1) {
        const y = getY(chart[0]?.percent)
        return `M 0 ${y} L 100 ${y}`
    }

    return chart
        .map((c, i) => {
            const x = Number((((i + 0.5) / N) * 100).toFixed(2))
            const y = getY(c?.percent)
            return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
        })
        .join(' ')
}
</script>