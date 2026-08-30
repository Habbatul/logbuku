<template>
    <section class="space-y-4">
        <div class="flex items-end justify-between gap-4">
            <div class="min-w-0">
                <h2 class="text-lg sm:text-xl font-bold tracking-[-0.02em] text-[#0d0d0d] leading-snug uppercase">
                    ANALITIK DETAIL
                </h2>
                <p class="mt-1 text-sm text-[#44403c]">
                    Grafik tren aktivitas dan pengeluaran berdasarkan periode yang dipilih.
                </p>
            </div>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div
                class="group flex min-w-0 flex-col overflow-visible rounded-lg border-2 border-[#0d0d0d] bg-white p-5 shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
                <div class="flex items-center justify-between gap-3">
                    <span class="truncate font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">[BUKU
                        SELESAI DIBACA]</span>

                    <select v-model="filterCompleted"
                        class="shrink-0 cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1.5 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] outline-none transition-colors hover:bg-white focus:ring-2 focus:ring-[#0d0d0d]/15">
                        <option value="1M">1 Bulan Terakhir</option>
                        <option value="6M">6 Bulan Terakhir</option>
                        <option value="1Y">Tahun Ini</option>
                        <option value="ALL">Total Keseluruhan</option>
                    </select>
                </div>

                <div class="mt-2.5 flex items-baseline gap-2 flex-wrap">
                    <span
                        class="text-2xl font-bold tracking-tight text-[#00875a] sm:text-[28px] tabular-nums break-words">
                        {{ completedData.total }}
                    </span>
                    <span class="shrink-0 font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">BUKU</span>
                </div>

                <div class="mt-6 min-w-0">
                    <div class="relative h-[150px] sm:h-[165px] w-full">
                        <div
                            class="pointer-events-none absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between">
                            <div class="border-t border-dashed border-[#e5dfd3]"></div>
                            <div class="border-t border-dashed border-[#e5dfd3]"></div>
                            <div class="border-t border-dashed border-[#e5dfd3]"></div>
                            <div class="border-t border-[#0d0d0d]"></div>
                        </div>

                        <svg class="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible"
                            preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path :d="generatePath(processedCompletedChart)" fill="none" stroke="#00875a"
                                stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <div class="absolute inset-x-0 top-0 bottom-6 flex"
                            @touchmove.passive="e => handleChartTouch(e, 'comp')"
                            @touchstart.passive="e => handleChartTouch(e, 'comp')"
                            @touchend.passive="activeTooltip.comp = null" @mouseleave="activeTooltip.comp = null">
                            <div v-for="(point, index) in processedCompletedChart" :key="'comp-' + index"
                                class="chart-col relative flex h-full min-w-0 flex-1 items-end outline-none cursor-pointer"
                                :data-index="index" @mouseenter="activeTooltip.comp = index">
                                <div class="pointer-events-none absolute left-1/2 bottom-full z-30 -translate-x-1/2 pb-2 transition-all duration-200 ease-out"
                                    :class="activeTooltip.comp === index ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'">
                                    <div
                                        class="whitespace-nowrap rounded-[4px] border border-[#0d0d0d] bg-[#0d0d0d] px-2.5 py-1.5 font-mono text-xs font-bold text-white shadow-[2px_2px_0px_#ff4800]">
                                        {{ point.label }} · {{ point.value }} BUKU
                                    </div>
                                </div>

                                <div class="absolute inset-0 rounded-t-md bg-[#00875a]/5 transition-opacity duration-200 ease-out"
                                    :class="activeTooltip.comp === index ? 'opacity-100' : 'opacity-0'"></div>

                                <div class="absolute left-1/2 z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-[#0d0d0d] bg-[#00875a] transition-transform duration-200 ease-out"
                                    :class="activeTooltip.comp === index ? 'scale-150' : 'scale-100'"
                                    :style="{ bottom: `calc(${point.percent}% - 3px)` }"></div>

                                <span v-if="processedCompletedChart.length <= 15"
                                    class="absolute -bottom-6 left-0 w-full truncate px-0.5 text-center font-mono text-xs font-bold uppercase text-[#44403c]">
                                    {{ point.label }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="group flex min-w-0 flex-col overflow-visible rounded-lg border-2 border-[#0d0d0d] bg-white p-5 shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
                <div class="flex items-center justify-between gap-3">
                    <span class="truncate font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">[TOTAL
                        HALAMAN DIBACA]</span>

                    <select v-model="filterPages"
                        class="shrink-0 cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1.5 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] outline-none transition-colors hover:bg-white focus:ring-2 focus:ring-[#0d0d0d]/15">
                        <option value="1D">Hari Ini</option>
                        <option value="1W">7 Hari Terakhir</option>
                    </select>
                </div>

                <div class="mt-2.5 flex items-baseline gap-2 flex-wrap">
                    <span
                        class="text-2xl font-bold tracking-tight text-[#0d0d0d] sm:text-[28px] tabular-nums break-words">
                        {{ formatNumber(pagesData.total) }}
                    </span>
                    <span
                        class="shrink-0 font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">HALAMAN</span>
                </div>

                <div class="mt-6 min-w-0">
                    <div class="relative h-[150px] sm:h-[165px] w-full">
                        <div
                            class="pointer-events-none absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between">
                            <div class="border-t border-dashed border-[#e5dfd3]"></div>
                            <div class="border-t border-dashed border-[#e5dfd3]"></div>
                            <div class="border-t border-dashed border-[#e5dfd3]"></div>
                            <div class="border-t border-[#0d0d0d]"></div>
                        </div>

                        <svg class="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible"
                            preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path :d="generatePath(processedPagesChart)" fill="none" stroke="#0d0d0d" stroke-width="2.5"
                                vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>

                        <div class="absolute inset-x-0 top-0 bottom-6 flex"
                            @touchmove.passive="e => handleChartTouch(e, 'page')"
                            @touchstart.passive="e => handleChartTouch(e, 'page')"
                            @touchend.passive="activeTooltip.page = null" @mouseleave="activeTooltip.page = null">
                            <div v-for="(point, index) in processedPagesChart" :key="'page-' + index"
                                class="chart-col relative flex h-full min-w-0 flex-1 items-end outline-none cursor-pointer"
                                :data-index="index" @mouseenter="activeTooltip.page = index">
                                <div class="pointer-events-none absolute left-1/2 bottom-full z-30 -translate-x-1/2 pb-2 transition-all duration-200 ease-out"
                                    :class="activeTooltip.page === index ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'">
                                    <div
                                        class="whitespace-nowrap rounded-[4px] border border-[#0d0d0d] bg-[#0d0d0d] px-2.5 py-1.5 font-mono text-xs font-bold text-white shadow-[2px_2px_0px_#ff4800]">
                                        {{ point.label }} · {{ formatNumber(point.value) }} HAL
                                    </div>
                                </div>

                                <div class="absolute inset-0 rounded-t-md bg-[#0d0d0d]/5 transition-opacity duration-200 ease-out"
                                    :class="activeTooltip.page === index ? 'opacity-100' : 'opacity-0'"></div>

                                <div class="absolute left-1/2 z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-[#0d0d0d] bg-[#0d0d0d] transition-transform duration-200 ease-out"
                                    :class="activeTooltip.page === index ? 'scale-150' : 'scale-100'"
                                    :style="{ bottom: `calc(${point.percent}% - 3px)` }"></div>

                                <span v-if="processedPagesChart.length <= 15"
                                    class="absolute -bottom-6 left-0 w-full truncate px-0.5 text-center font-mono text-xs font-bold uppercase text-[#44403c]">
                                    {{ point.label }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="group flex min-w-0 flex-col overflow-visible rounded-lg border-2 border-[#0d0d0d] bg-white p-5 shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d] md:col-span-2 lg:col-span-1">
                <div class="flex items-center justify-between gap-3">
                    <span class="truncate font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">[UANG
                        DIHABISKAN]</span>

                    <select v-model="filterFinance"
                        class="shrink-0 cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1.5 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] outline-none transition-colors hover:bg-white focus:ring-2 focus:ring-[#0d0d0d]/15">
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

                <div class="mt-2.5 flex items-baseline gap-2 flex-wrap">
                    <span
                        class="text-2xl font-bold tracking-tight text-[#0047ff] sm:text-[28px] tabular-nums break-words">
                        {{ formatCurrency(financeData.total) }}
                    </span>
                </div>

                <div class="mt-6 min-w-0">
                    <div class="relative h-[150px] sm:h-[165px] w-full">
                        <div
                            class="pointer-events-none absolute inset-x-0 bottom-6 top-0 flex flex-col justify-between">
                            <div class="border-t border-dashed border-[#e5dfd3]"></div>
                            <div class="border-t border-dashed border-[#e5dfd3]"></div>
                            <div class="border-t border-dashed border-[#e5dfd3]"></div>
                            <div class="border-t border-[#0d0d0d]"></div>
                        </div>

                        <svg class="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%-24px)] w-full overflow-visible"
                            preserveAspectRatio="none" viewBox="0 0 100 100">
                            <path :d="generatePath(processedFinanceChart)" fill="none" stroke="#0047ff"
                                stroke-width="2.5" vector-effect="non-scaling-stroke" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>

                        <div class="absolute inset-x-0 top-0 bottom-6 flex"
                            @touchmove.passive="e => handleChartTouch(e, 'fin')"
                            @touchstart.passive="e => handleChartTouch(e, 'fin')"
                            @touchend.passive="activeTooltip.fin = null" @mouseleave="activeTooltip.fin = null">
                            <div v-for="(point, index) in processedFinanceChart" :key="'fin-' + index"
                                class="chart-col relative flex h-full min-w-0 flex-1 items-end outline-none cursor-pointer"
                                :data-index="index" @mouseenter="activeTooltip.fin = index">
                                <div class="pointer-events-none absolute left-1/2 bottom-full z-30 -translate-x-1/2 pb-2 transition-all duration-200 ease-out"
                                    :class="activeTooltip.fin === index ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-1'">
                                    <div
                                        class="whitespace-nowrap rounded-[4px] border border-[#0d0d0d] bg-[#0d0d0d] px-2.5 py-1.5 font-mono text-xs font-bold text-white shadow-[2px_2px_0px_#ff4800]">
                                        {{ point.label }} · {{ formatCurrency(point.value) }}
                                    </div>
                                </div>

                                <div class="absolute inset-0 rounded-t-md bg-[#0047ff]/5 transition-opacity duration-200 ease-out"
                                    :class="activeTooltip.fin === index ? 'opacity-100' : 'opacity-0'"></div>

                                <div class="absolute left-1/2 z-20 h-1.5 w-1.5 -translate-x-1/2 rounded-full border border-[#0d0d0d] bg-[#0047ff] transition-transform duration-200 ease-out"
                                    :class="activeTooltip.fin === index ? 'scale-150' : 'scale-100'"
                                    :style="{ bottom: `calc(${point.percent}% - 3px)` }"></div>

                                <span v-if="processedFinanceChart.length <= 15"
                                    class="absolute -bottom-6 left-0 w-full truncate px-0.5 text-center font-mono text-xs font-bold uppercase text-[#44403c]">
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

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

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

const parseMonthIndex = (rawLabel: any): number => {
    if (rawLabel === undefined || rawLabel === null) return -1
    const str = String(rawLabel).trim().toLowerCase()

    const isoMatch = str.match(/\d{4}-(\d{1,2})/)
    if (isoMatch) {
        const m = parseInt(isoMatch[1], 10)
        if (m >= 1 && m <= 12) return m - 1
    }

    const slashMatch = str.match(/(?:^|\/)(\d{1,2})\/(?:\d{4}|\d{2})$/)
    if (slashMatch) {
        const m = parseInt(slashMatch[1], 10)
        if (m >= 1 && m <= 12) return m - 1
    }

    if (/^\d{1,2}$/.test(str)) {
        const m = parseInt(str, 10)
        if (m >= 1 && m <= 12) return m - 1
        if (m >= 0 && m <= 11) return m
    }

    const aliases: string[][] = [
        ['jan', 'januari', 'january'],
        ['feb', 'februari', 'february'],
        ['mar', 'maret', 'march'],
        ['apr', 'april'],
        ['mei', 'may'],
        ['jun', 'juni', 'june'],
        ['jul', 'juli', 'july'],
        ['agu', 'ags', 'agustus', 'aug', 'august'],
        ['sep', 'september', 'sept'],
        ['okt', 'oct', 'oktober', 'october'],
        ['nov', 'nop', 'november', 'nopember'],
        ['des', 'dec', 'desember', 'december']
    ]

    for (let i = 0; i < aliases.length; i++) {
        for (const alias of aliases[i]) {
            if (str === alias || str.startsWith(alias) || str.includes(alias)) {
                return i
            }
        }
    }

    return -1
}

const normalizeChartData = (data: AnalyticsData, filter: string): ChartPoint[] => {
    if (!data) return []

    if (filter === 'ALL') {
        const totalVal = Number(data.total) || 0
        return [
            { label: 'Awal', value: 0, percent: 0 },
            { label: 'Total', value: totalVal, percent: totalVal > 0 ? 85 : 0 }
        ]
    }

    if (filter === '1Y') {
        const currentMonthIdx = new Date().getMonth()
        const incoming = Array.isArray(data.chart) ? data.chart : []
        const monthlyValues = new Array(12).fill(0)
        const totalVal = Number(data.total) || 0

        const raw12 = incoming.length === 12 ? incoming.map(item => Number(item?.value) || 0) : null
        const sumRaw12 = raw12 ? raw12.reduce((acc, val) => acc + val, 0) : 0
        const isCumulative = raw12 && totalVal > 0 && sumRaw12 > totalVal * 1.15

        if (isCumulative && raw12) {
            for (let i = 0; i < 12; i++) {
                if (i > currentMonthIdx) {
                    monthlyValues[i] = 0
                } else if (i === 0) {
                    monthlyValues[0] = Math.max(0, raw12[0])
                } else {
                    const diff = raw12[i] - raw12[i - 1]
                    monthlyValues[i] = diff > 0 ? diff : 0
                }
            }
        } else {
            incoming.forEach((item, idx) => {
                if (!item) return
                const val = Number(item.value) || 0
                const mIdx = parseMonthIndex(item.label ?? (item as any).date)

                if (mIdx >= 0 && mIdx < 12) {
                    if (mIdx <= currentMonthIdx) {
                        monthlyValues[mIdx] += val
                    }
                } else if (incoming.length === 12 && idx >= 0 && idx < 12) {
                    if (idx <= currentMonthIdx) {
                        monthlyValues[idx] += val
                    }
                }
            })
        }

        const maxVal = Math.max(...monthlyValues, 0)

        return MONTH_LABELS.map((monthName, idx) => {
            const val = monthlyValues[idx]
            const percent = (val > 0 && maxVal > 0)
                ? Math.max(20, Math.min(85, Math.round((val / maxVal) * 65) + 20))
                : 0

            return {
                label: monthName,
                value: val,
                percent: percent
            }
        })
    }

    const incomingChart = Array.isArray(data.chart) ? data.chart : []
    if (incomingChart.length === 0) return []

    const maxVal = Math.max(...incomingChart.map(p => Number(p?.value) || 0), 0)

    return incomingChart.map(p => {
        const val = Number(p?.value) || 0
        let pct = p?.percent
        if (typeof pct !== 'number' || isNaN(pct)) {
            pct = (val > 0 && maxVal > 0)
                ? Math.max(20, Math.min(85, Math.round((val / maxVal) * 65) + 20))
                : 0
        }
        return {
            label: p?.label || '',
            value: val,
            percent: pct
        }
    })
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