export const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

export const formatNumber = (val: number): string => {
    return new Intl.NumberFormat('id-ID').format(val || 0)
}

export const getProgressColor = (read: number, total: number): string => {
    if (!total || read <= 0) return 'bg-gray-200'
    const pct = (read / total) * 100
    if (pct >= 100) return 'bg-emerald-600'
    return 'bg-gray-900'
}
