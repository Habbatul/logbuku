import { ref, computed, type Ref } from 'vue'

export const useDashboard = (books: Ref<any[]>) => {
    const filterCompleted = ref('1M')
    const filterPages = ref('1W')
    const filterFinance = ref('1M')

    const getStartDate = (filter: string) => {
        const now = new Date()
        switch (filter) {
            case '1D':
                return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
            case '1W':
                return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0)
            case '2W':
                return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 13, 0, 0, 0, 0)
            case '1M':
                return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29, 0, 0, 0, 0)
            case '3M':
                return new Date(now.getFullYear(), now.getMonth() - 2, 1, 0, 0, 0, 0)
            case '6M':
                return new Date(now.getFullYear(), now.getMonth() - 5, 1, 0, 0, 0, 0)
            case '1Y':
                return new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0)
            case 'ALL':
                return new Date(0)
            default:
                return new Date(0)
        }
    }

    const buildChartData = (
        dataArray: any[],
        dateKey: string,
        valueKey: string | null,
        filter: string,
        isTotalMetric: boolean = false
    ) => {
        const chartMap = new Map<string, { label: string; value: number }>()
        const now = new Date()
        const start = getStartDate(filter)
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

        let step: 'day' | 'month' = 'day'
        if (['3M', '6M', '1Y', 'ALL'].includes(filter)) {
            step = 'month'
        }

        const formatLocalDateKey = (d: Date) => {
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${y}-${m}-${day}`
        }

        const formatLocalMonthKey = (d: Date) => {
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            return `${y}-${m}`
        }

        if (step === 'day') {
            let days = 7
            if (filter === '1D') days = 1
            else if (filter === '1W') days = 7
            else if (filter === '2W') days = 14
            else if (filter === '1M') days = 30

            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(end.getFullYear(), end.getMonth(), end.getDate() - i)
                const key = formatLocalDateKey(d)
                const label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                chartMap.set(key, { label, value: 0 })
            }
        } else if (step === 'month') {
            if (filter === '1Y') {
                for (let m = 0; m < 12; m++) {
                    const d = new Date(now.getFullYear(), m, 1)
                    const key = formatLocalMonthKey(d)
                    const label = d.toLocaleDateString('id-ID', { month: 'short' })
                    chartMap.set(key, { label, value: 0 })
                }
            } else {
                let mCount = 12
                if (filter === '3M') mCount = 3
                else if (filter === '6M') mCount = 6
                else if (filter === 'ALL') {
                    if (dataArray.length > 0) {
                        const validTimestamps = dataArray
                            .map(item => {
                                const raw = item[dateKey] || item.createdAt || item.date || item.updatedAt
                                return raw ? new Date(raw).getTime() : NaN
                            })
                            .filter(t => !isNaN(t))

                        if (validTimestamps.length > 0) {
                            const oldest = new Date(Math.min(...validTimestamps))
                            mCount = (end.getFullYear() - oldest.getFullYear()) * 12 + (end.getMonth() - oldest.getMonth()) + 1
                            if (mCount > 24) mCount = 24
                            if (mCount < 6) mCount = 6
                        }
                    } else {
                        mCount = 12
                    }
                }

                for (let i = mCount - 1; i >= 0; i--) {
                    const d = new Date(end.getFullYear(), end.getMonth() - i, 1)
                    const key = formatLocalMonthKey(d)
                    const label = d.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })
                    chartMap.set(key, { label, value: 0 })
                }
            }
        }

        ;(dataArray || []).forEach(item => {
            const raw = item[dateKey] || item.createdAt || item.date || item.updatedAt
            if (!raw) return
            const itemDate = new Date(raw)
            if (isNaN(itemDate.getTime())) return

            if (itemDate >= start && itemDate <= end) {
                let key = ''
                if (typeof raw === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(raw)) {
                    key = step === 'day' ? raw : raw.slice(0, 7)
                } else {
                    key = step === 'day' ? formatLocalDateKey(itemDate) : formatLocalMonthKey(itemDate)
                }

                if (chartMap.has(key)) {
                    const current = chartMap.get(key)!
                    current.value += valueKey ? (Number(item[valueKey]) || 0) : 1
                }
            }
        })

        const result = Array.from(chartMap.values())

        const isCumulative = isTotalMetric && ['ALL', '1Y'].includes(filter)
        if (isCumulative) {
            let running = 0
            for (const point of result) {
                running += point.value
                point.value = running
            }
        }

        const maxValue = Math.max(...result.map(d => d.value), 0)

        return result.map(d => {
            let percent = 0
            if (maxValue > 0) {
                percent = (d.value / maxValue) * 100
            }
            if (isNaN(percent) || !isFinite(percent) || percent < 0) {
                percent = 0
            } else if (percent > 100) {
                percent = 100
            }

            return {
                label: String(d.label ?? ''),
                value: Number(d.value) || 0,
                percent: Number(percent.toFixed(2))
            }
        })
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
        const now = new Date()
        const startOf7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0)
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        const pagesLast7Days = allHistoryLogs.value
            .filter(log => {
                if (!log.date) return false
                const d = new Date(log.date)
                return !isNaN(d.getTime()) && d >= startOf7Days && d <= endOfToday
            })
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

    const getBookCompletedDate = (b: any): string | null => {
        const total = Number(b.totalPages) || 0
        const read = Number(b.pagesRead) || 0
        if (total <= 0 || read < total) return null

        if (b.completedAt) return b.completedAt

        if (b.readHistory && b.readHistory.length > 0) {
            const finishSession = b.readHistory.find((s: any) => (Number(s.endPage) || 0) >= total)
            if (finishSession && finishSession.date) return finishSession.date
            const lastSession = b.readHistory[b.readHistory.length - 1]
            if (lastSession && lastSession.date) return lastSession.date
        }

        return b.date || b.updatedAt || b.createdAt || null
    }

    const completedData = computed(() => {
        const start = getStartDate(filterCompleted.value)
        const now = new Date()
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)

        const completedBooksWithDate: any[] = []
        books.value.forEach(b => {
            const completedDate = getBookCompletedDate(b)
            if (completedDate) {
                const d = new Date(completedDate)
                if (!isNaN(d.getTime()) && d >= start && d <= end) {
                    completedBooksWithDate.push({
                        ...b,
                        completedDate
                    })
                }
            }
        })

        return {
            total: completedBooksWithDate.length,
            chart: buildChartData(completedBooksWithDate, 'completedDate', null, filterCompleted.value, false)
        }
    })

    const pagesData = computed(() => {
        const filter = ['1D', '1W', '2W', '1M'].includes(filterPages.value) ? filterPages.value : '1W'
        const start = getStartDate(filter)
        const now = new Date()
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        const validLogs = allHistoryLogs.value.filter(l => {
            const raw = l.date
            if (!raw) return false
            const d = new Date(raw)
            return !isNaN(d.getTime()) && d >= start && d <= end
        })
        return {
            total: validLogs.reduce((sum, l) => sum + (Number(l.pages) || 0), 0),
            chart: buildChartData(validLogs, 'date', 'pages', filter, false)
        }
    })

    const financeData = computed(() => {
        const start = getStartDate(filterFinance.value)
        const now = new Date()
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        const validBooks = books.value.filter(b => {
            const price = Number(b.price) || 0
            if (price <= 0) return false
            const raw = b.date || b.createdAt || b.updatedAt
            if (!raw) return false
            const d = new Date(raw)
            return !isNaN(d.getTime()) && d >= start && d <= end
        })
        return {
            total: validBooks.reduce((sum, b) => sum + (Number(b.price) || 0), 0),
            chart: buildChartData(validBooks, 'date', 'price', filterFinance.value, true)
        }
    })

    const mostReadBooksInsight = computed(() => {
        const now = new Date()
        const startOf7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0)
        const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
        const recentLogs = allHistoryLogs.value.filter(log => {
            if (!log.date) return false
            const d = new Date(log.date)
            return !isNaN(d.getTime()) && d >= startOf7Days && d <= endOfToday
        })
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

    const targetBooks = computed(() => books.value.filter(b => b.isTarget))
    const targetCompleted = computed(() => targetBooks.value.filter(b => b.pagesRead >= b.totalPages).length)
    const targetTotalPages = computed(() => targetBooks.value.reduce((sum, b) => sum + (b.totalPages || 0), 0))
    const targetReadPages = computed(() => targetBooks.value.reduce((sum, b) => sum + Math.min((b.pagesRead || 0), (b.totalPages || 0)), 0))

    const targetProgressPct = computed(() => {
        if (targetTotalPages.value === 0) return 0
        return Math.round((targetReadPages.value / targetTotalPages.value) * 100)
    })

    const top5Publishers = computed(() => {
        if (books.value.length === 0) return []
        const counts: Record<string, number> = {}
        books.value.forEach(b => {
            const pub = b.publisher && b.publisher.trim() ? b.publisher.trim() : 'Penerbit Lainnya'
            counts[pub] = (counts[pub] || 0) + 1
        })
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
    })
    const maxPublisherCount = computed(() => {
        return top5Publishers.value.length ? Math.max(...top5Publishers.value.map(p => p.count)) : 1
    })

    const top5Authors = computed(() => {
        if (books.value.length === 0) return []
        const counts: Record<string, number> = {}
        books.value.forEach(b => {
            if (b.author && b.author.trim()) {
                const aut = b.author.trim()
                counts[aut] = (counts[aut] || 0) + 1
            }
        })
        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
    })
    const maxAuthorCount = computed(() => {
        return top5Authors.value.length ? Math.max(...top5Authors.value.map(a => a.count)) : 1
    })

    const totalPublishers = computed(() => {
        const set = new Set<string>()
        books.value.forEach(b => {
            if (b.publisher && b.publisher.trim()) set.add(b.publisher.trim())
        })
        return set.size
    })

    const totalAuthors = computed(() => {
        const set = new Set<string>()
        books.value.forEach(b => {
            if (b.author && b.author.trim()) set.add(b.author.trim())
        })
        return set.size
    })

    return {
        filterCompleted,
        filterPages,
        filterFinance,
        totalBooks,
        booksPerCategory,
        readingBooksCount,
        unreadBooksCount,
        allHistoryLogs,
        avgPagesPerDay,
        readingStreak,
        completedData,
        pagesData,
        financeData,
        mostReadBooksInsight,
        currentlyReadingList,
        topicScores,
        maxTopicScore,
        top3Expensive,
        top3Newest,
        targetBooks,
        targetCompleted,
        targetTotalPages,
        targetReadPages,
        targetProgressPct,
        top5Publishers,
        maxPublisherCount,
        top5Authors,
        maxAuthorCount,
        totalPublishers,
        totalAuthors
    }
}
