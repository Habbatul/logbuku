export const formatCurrency = (val: number): string => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val || 0)
}

export const formatNumber = (val: number): string => {
    return new Intl.NumberFormat('id-ID').format(val || 0)
}

export const getProgressColor = (read: number, total: number): string => {
    if (!total) return 'bg-gray-200'
    const pct = (read / total) * 100
    if (pct >= 100) return 'bg-green-600'
    if (pct >= 75) return 'bg-purple-500'
    if (pct >= 50) return 'bg-blue-500'
    if (pct >= 25) return 'bg-orange-500'
    return 'bg-red-500'
}
