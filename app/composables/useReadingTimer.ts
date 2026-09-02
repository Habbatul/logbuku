import { ref, computed } from 'vue'

export interface BookTimer {
    isRunning: boolean
    isPaused: boolean
    startTime: number | null
    accumulatedSeconds: number
}

interface TimerStore {
    timers: Record<string, BookTimer>
    activeBookId: number | string | null
}

const STORAGE_KEY = 'booktracker_reading_timers_v2'

const timers = ref<Record<string, BookTimer>>({})
const activeBookId = ref<number | string | null>(null)
const nowTick = ref(Date.now())

let intervalId: any = null

const startTicker = () => {
    if (intervalId) clearInterval(intervalId)
    intervalId = setInterval(() => {
        nowTick.value = Date.now()
    }, 250)
}

const stopTicker = () => {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
}

const saveState = () => {
    if (typeof window === 'undefined') return
    try {
        const store: TimerStore = {
            timers: timers.value,
            activeBookId: activeBookId.value
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
    } catch (e) {
        console.error('Failed to save timer state to localStorage', e)
    }
}

const loadState = () => {
    if (typeof window === 'undefined') return
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
            const store: TimerStore = JSON.parse(raw)
            timers.value = store.timers || {}
            activeBookId.value = store.activeBookId ?? null
        }
        const hasRunning = Object.values(timers.value).some(t => t.isRunning)
        if (hasRunning && !intervalId) {
            startTicker()
        }
    } catch (e) {
        console.error('Failed to load timer state from localStorage', e)
    }
}

if (typeof window !== 'undefined') {
    loadState()
}

export const useReadingTimer = () => {
    const getBookTimer = (bookId: number | string | null | undefined): BookTimer => {
        if (!bookId) {
            return { isRunning: false, isPaused: false, startTime: null, accumulatedSeconds: 0 }
        }
        const key = String(bookId)
        if (!timers.value[key]) {
            timers.value[key] = { isRunning: false, isPaused: false, startTime: null, accumulatedSeconds: 0 }
        }
        return timers.value[key]
    }

    const getElapsedSecondsForBook = (bookId: number | string | null | undefined): number => {
        if (!bookId) return 0
        const key = String(bookId)
        const t = timers.value[key]
        if (!t) return 0
        if (t.isRunning && t.startTime) {
            const delta = Math.floor((nowTick.value - t.startTime) / 1000)
            return t.accumulatedSeconds + (delta > 0 ? delta : 0)
        }
        return t.accumulatedSeconds || 0
    }

    const formatTimer = (totalSeconds: number): string => {
        const total = Math.max(0, totalSeconds)
        const hrs = Math.floor(total / 3600)
        const mins = Math.floor((total % 3600) / 60)
        const secs = total % 60
        const hStr = String(hrs).padStart(2, '0')
        const mStr = String(mins).padStart(2, '0')
        const sStr = String(secs).padStart(2, '0')
        return `${hStr}:${mStr}:${sStr}`
    }

    const start = (bookId: number | string) => {
        const key = String(bookId)
        const t = getBookTimer(bookId)
        t.isRunning = true
        t.isPaused = false
        t.startTime = Date.now()
        activeBookId.value = bookId
        startTicker()
        saveState()
    }

    const pause = (bookId: number | string) => {
        const key = String(bookId)
        const t = getBookTimer(bookId)
        if (t.isRunning && t.startTime) {
            const delta = Math.floor((Date.now() - t.startTime) / 1000)
            t.accumulatedSeconds += (delta > 0 ? delta : 0)
        }
        t.isRunning = false
        t.isPaused = true
        t.startTime = null
        saveState()
    }

    const resume = (bookId: number | string) => {
        const key = String(bookId)
        const t = getBookTimer(bookId)
        if (t.isPaused) {
            t.isRunning = true
            t.isPaused = false
            t.startTime = Date.now()
            activeBookId.value = bookId
            startTicker()
            saveState()
        }
    }

    const stop = (bookId: number | string): number => {
        const key = String(bookId)
        const t = getBookTimer(bookId)
        let finalSeconds = t.accumulatedSeconds
        if (t.isRunning && t.startTime) {
            const delta = Math.floor((Date.now() - t.startTime) / 1000)
            finalSeconds += (delta > 0 ? delta : 0)
        }
        t.accumulatedSeconds = finalSeconds
        t.isRunning = false
        t.isPaused = false
        t.startTime = null
        saveState()
        return finalSeconds
    }

    const reset = (bookId: number | string) => {
        const key = String(bookId)
        if (timers.value[key]) {
            delete timers.value[key]
        }
        if (String(activeBookId.value) === key) {
            activeBookId.value = null
        }
        const hasRunning = Object.values(timers.value).some(t => t.isRunning)
        if (!hasRunning) {
            stopTicker()
        }
        saveState()
    }

    const formatDuration = (totalSecs: number | null | undefined): string => {
        if (totalSecs === null || totalSecs === undefined || totalSecs <= 0) return '-'
        const hrs = Math.floor(totalSecs / 3600)
        const mins = Math.floor((totalSecs % 3600) / 60)
        const secs = totalSecs % 60

        if (hrs > 0) {
            return mins > 0 ? `${hrs} jam ${mins} mnt` : `${hrs} jam`
        }
        if (mins > 0) {
            return secs > 0 ? `${mins} mnt ${secs} dtk` : `${mins} mnt`
        }
        return `${secs} dtk`
    }

    const formatPace = (secondsPerPage: number | null | undefined): string => {
        if (!secondsPerPage || secondsPerPage <= 0 || !isFinite(secondsPerPage)) return '-'
        if (secondsPerPage < 60) {
            return `${Math.round(secondsPerPage)} dtk/hal`
        }
        const mins = Math.floor(secondsPerPage / 60)
        const secs = Math.round(secondsPerPage % 60)
        return secs > 0 ? `${mins}m ${secs}s/hal` : `${mins} mnt/hal`
    }

    return {
        timers,
        activeBookId,
        nowTick,
        getBookTimer,
        getElapsedSecondsForBook,
        formatTimer,
        start,
        pause,
        resume,
        stop,
        reset,
        formatDuration,
        formatPace
    }
}
