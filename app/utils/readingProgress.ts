import type { Book, ReadSession } from '~/types/book'

const ROMAN_VALUES: Record<string, number> = {
  i: 1,
  v: 5,
  x: 10,
  l: 50,
  c: 100,
  d: 500,
  m: 1000
}

/**
 * Checks if a string is a valid Roman numeral (case-insensitive).
 * Supports standard Roman numerals up to 3999 (e.g. i, ii, iv, ix, xiv, xl, cm, etc.)
 */
export function isRomanNumeral(str: string | null | undefined): boolean {
  if (!str || typeof str !== 'string') return false
  const trimmed = str.trim().toLowerCase()
  if (!trimmed) return false
  if (!/^[ivxlcdm]+$/i.test(trimmed)) return false
  const romanRegex = /^m{0,4}(cm|cd|d?c{0,3})(xc|xl|l?x{0,3})(ix|iv|v?i{0,3})$/i
  return romanRegex.test(trimmed)
}

/**
 * Converts a Roman numeral string to an integer.
 * Returns 0 if invalid.
 */
export function romanToInt(roman: string | null | undefined): number {
  if (!roman || !isRomanNumeral(roman)) return 0
  const s = roman.trim().toLowerCase()
  let total = 0
  let prevValue = 0

  for (let i = s.length - 1; i >= 0; i--) {
    const val = ROMAN_VALUES[s[i]] || 0
    if (val < prevValue) {
      total -= val
    } else {
      total += val
      prevValue = val
    }
  }
  return total
}

/**
 * Converts an integer (1 - 3999) to a Roman numeral.
 */
export function intToRoman(num: number, lowercase = false): string {
  if (num <= 0 || num >= 4000) return String(num)
  const lookup: [number, string][] = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I']
  ]
  let result = ''
  let n = num
  for (const [val, letter] of lookup) {
    while (n >= val) {
      result += letter
      n -= val
    }
  }
  return lowercase ? result.toLowerCase() : result
}

export interface ParsedPage {
  num: number
  isRoman: boolean
  raw: string
  isLowercase: boolean
}

/**
 * Parses a page input which could be a normal integer or a Roman numeral.
 */
export function parsePageInput(val: string | number | null | undefined): ParsedPage | null {
  if (val === null || val === undefined) return null
  const str = String(val).trim()
  if (!str) return null

  if (isRomanNumeral(str)) {
    const num = romanToInt(str)
    if (num > 0) {
      return {
        num,
        isRoman: true,
        raw: str,
        isLowercase: str === str.toLowerCase()
      }
    }
  }

  const num = parseInt(str, 10)
  if (!isNaN(num) && num > 0) {
    return {
      num,
      isRoman: false,
      raw: str,
      isLowercase: false
    }
  }

  return null
}

export interface Interval {
  start: number
  end: number
}

/**
 * Merges overlapping and adjacent intervals and calculates the total count of unique pages.
 * Handles reverse intervals automatically by taking min and max.
 */
export function calculateUniquePages(intervals: Interval[]): number {
  if (!intervals || intervals.length === 0) return 0

  const validIntervals: Interval[] = []
  for (const iv of intervals) {
    const start = Number(iv.start)
    const end = Number(iv.end)
    if (!isNaN(start) && !isNaN(end) && (start > 0 || end > 0)) {
      validIntervals.push({
        start: Math.min(start, end),
        end: Math.max(start, end)
      })
    }
  }

  if (validIntervals.length === 0) return 0

  validIntervals.sort((a, b) => a.start - b.start)

  const merged: Interval[] = []
  let current = { ...validIntervals[0] }

  for (let i = 1; i < validIntervals.length; i++) {
    const next = validIntervals[i]
    if (next.start <= current.end + 1) {
      current.end = Math.max(current.end, next.end)
    } else {
      merged.push(current)
      current = { ...next }
    }
  }
  merged.push(current)

  return merged.reduce((sum, iv) => sum + (iv.end - iv.start + 1), 0)
}

/**
/**
 * Checks if a session represents Roman numeral reading.
 */
export function isSessionRoman(session: ReadSession): boolean {
  if (!session) return false
  if (session.isRoman) return true
  if (session.startPageRaw && isRomanNumeral(session.startPageRaw)) return true
  if (session.endPageRaw && isRomanNumeral(session.endPageRaw)) return true
  return false
}

/**
 * Checks whether a book has at least one active Roman session in its readHistory.
 */
export function bookHasRomanHistory(book: Book | null | undefined): boolean {
  if (!book || !Array.isArray(book.readHistory) || book.readHistory.length === 0) {
    return false
  }
  return book.readHistory.some(isSessionRoman)
}

/**
 * Retrieves the highest Roman numeral page number read in this book's history.
 */
export function getHighestRomanPageInHistory(book: Book | null | undefined): number {
  if (!book || !Array.isArray(book.readHistory)) return 0
  let maxRoman = 0
  for (const s of book.readHistory) {
    const pStart = parsePageInput(s.startPageRaw ?? s.startPage)
    const pEnd = parsePageInput(s.endPageRaw ?? s.endPage)
    if (pStart?.isRoman && pStart.num > maxRoman) {
      maxRoman = pStart.num
    }
    if (pEnd?.isRoman && pEnd.num > maxRoman) {
      maxRoman = pEnd.num
    }
  }
  return maxRoman
}

/**
 * Retrieves historical total preface pages based on highest Roman page read in history.
 */
export function getHistoricalTotalPrefacePages(book: Book | null | undefined): number {
  if (!book) return 0
  let maxPreface = 0
  if (book.totalPrefacePages && Number(book.totalPrefacePages) > 0) {
    maxPreface = Math.max(maxPreface, Number(book.totalPrefacePages))
  }
  if (Array.isArray(book.readHistory)) {
    for (const s of book.readHistory) {
      if (s.totalPrefacePages && Number(s.totalPrefacePages) > 0) {
        maxPreface = Math.max(maxPreface, Number(s.totalPrefacePages))
      }
    }
  }
  const highestRoman = getHighestRomanPageInHistory(book)
  maxPreface = Math.max(maxPreface, highestRoman)
  return maxPreface
}

/**
 * Retrieves total preface pages from user input, book property, or history.
 * If all Roman sessions are deleted, returns 0 unless explicitly input.
 */
export function getBookTotalPrefacePages(
  book: Book | null | undefined,
  explicitInput?: string | number | null
): number {
  if (explicitInput !== undefined && explicitInput !== null && String(explicitInput).trim() !== '') {
    const s = String(explicitInput).trim()
    if (isRomanNumeral(s)) return romanToInt(s)
    const n = parseInt(s, 10)
    if (!isNaN(n) && n > 0) return n
  }

  if (book && !bookHasRomanHistory(book) && (!book.totalPrefacePages || Number(book.totalPrefacePages) <= 0)) {
    return 0
  }

  return getHistoricalTotalPrefacePages(book)
}

/**
 * Determines whether preface pages are included in book progress.
 * If all Roman sessions are deleted, returns false unless Roman is detected.
 */
export function getBookIncludePreface(
  book: Book | null | undefined,
  explicitInclude?: boolean | null,
  isRomanDetected = false
): boolean {
  if (isRomanDetected) {
    return true
  }

  if (explicitInclude !== undefined && explicitInclude !== null) {
    return Boolean(explicitInclude)
  }

  return bookHasRomanHistory(book)
}

/**
 * Calculates effective total pages of a book, including Roman preface pages if applicable.
 * Example: base 411 + 5 preface = 416 pages.
 */
export function getEffectiveTotalPages(
  book: Book | null | undefined,
  totalPrefacePages?: number,
  includePrefacePages?: boolean
): number {
  const baseTotal = Number(book?.totalPages) || 0
  const tp = totalPrefacePages !== undefined ? totalPrefacePages : getBookTotalPrefacePages(book)
  const inc = includePrefacePages !== undefined ? includePrefacePages : getBookIncludePreface(book)

  if (inc && tp > 0) {
    return baseTotal + tp
  }
  return baseTotal
}

/**
 * Calculates reading percentage based on effective total pages.
 */
export function calculateProgressPercentage(
  pagesRead: number,
  effectiveTotalPages: number
): number {
  if (effectiveTotalPages <= 0) return 0
  if (pagesRead <= 0) return 0
  if (pagesRead >= effectiveTotalPages) return 100
  const rounded = Math.round((pagesRead / effectiveTotalPages) * 100)
  return Math.min(99, Math.max(0, rounded))
}

/**
 * Maps a page (Roman or Arabic) to its 1-based absolute sequence position.
 * Roman I..P -> 1..P.
 * Arabic 1..K -> (P + 1)..(P + K).
 */
export function pageToAbsolute(
  page: ParsedPage | null,
  totalPrefacePages = 0,
  includePrefacePages = true
): number {
  if (!page || page.num <= 0) return 0

  const shouldInclude = includePrefacePages !== false && totalPrefacePages > 0
  if (shouldInclude) {
    if (page.isRoman) {
      return page.num
    } else {
      return totalPrefacePages + page.num
    }
  }

  return page.num
}

/**
 * Maps an absolute sequence position back to its display representation (Roman or Arabic).
 */
export function absoluteToPage(
  absNum: number,
  totalPrefacePages = 0,
  includePrefacePages = true,
  preferLowercase = false
): {
  raw: string
  isRoman: boolean
  displayNum: number
} {
  if (absNum <= 0) {
    return { raw: '1', isRoman: false, displayNum: 1 }
  }

  const shouldInclude = includePrefacePages !== false && totalPrefacePages > 0
  if (shouldInclude) {
    if (absNum <= totalPrefacePages) {
      return {
        raw: intToRoman(absNum, preferLowercase),
        isRoman: true,
        displayNum: absNum
      }
    } else {
      const arabicNum = absNum - totalPrefacePages
      return {
        raw: String(arabicNum),
        isRoman: false,
        displayNum: arabicNum
      }
    }
  }

  return {
    raw: String(absNum),
    isRoman: false,
    displayNum: absNum
  }
}

/**
 * Parses a formatted range string (e.g. "I & 1–4", "1–5", "II–5") back into absolute page numbers.
 */
export function parseRangeStringToAbsolutePages(
  rangeStr: string,
  totalPrefacePages = 0,
  includePrefacePages = true
): number[] {
  if (!rangeStr || typeof rangeStr !== 'string') return []
  const clean = rangeStr.replace(/^\s*(?:Halaman:?|Rentang:?|Hal\.?)\s*/i, '').trim()
  if (!clean || clean === '-') return []

  const parts = clean.split('&').map(p => p.trim()).filter(Boolean)
  const result: number[] = []

  for (const part of parts) {
    const dashMatch = part.split(/[–\—\-]/).map(s => s.trim()).filter(Boolean)
    if (dashMatch.length === 2) {
      const p1 = parsePageInput(dashMatch[0])
      const p2 = parsePageInput(dashMatch[1])
      if (p1 && p2) {
        const abs1 = pageToAbsolute(p1, totalPrefacePages, includePrefacePages)
        const abs2 = pageToAbsolute(p2, totalPrefacePages, includePrefacePages)
        if (abs1 > 0 && abs2 > 0) {
          const minA = Math.min(abs1, abs2)
          const maxA = Math.max(abs1, abs2)
          for (let i = minA; i <= maxA; i++) {
            result.push(i)
          }
        }
      }
    } else if (dashMatch.length === 1) {
      const p = parsePageInput(dashMatch[0])
      if (p) {
        const abs = pageToAbsolute(p, totalPrefacePages, includePrefacePages)
        if (abs > 0) {
          result.push(abs)
        }
      }
    }
  }

  return result
}

/**
 * Groups an array of 1-based absolute page numbers into contiguous runs
 * and formats them using '-' for contiguous runs and '&' for gaps.
 * Example: [1, 6, 7, 8, 9] with 5 preface pages -> "I & 1–4"
 * Example: [1, 2, 3, 4, 5] -> "1–5"
 * Example: [1, 2, 10, 11] with 5 preface pages -> "I–II & 5–6"
 */
export function formatPageRuns(
  absolutePages: number[],
  totalPrefacePages = 0,
  includePrefacePages = true
): string {
  if (!absolutePages || absolutePages.length === 0) return '-'

  const sorted = [...new Set(absolutePages)].sort((a, b) => a - b)
  if (sorted.length === 0) return '-'

  const runs: number[][] = []
  let currentRun: number[] = [sorted[0]]

  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1]
    const curr = sorted[i]
    if (curr === prev + 1) {
      currentRun.push(curr)
    } else {
      runs.push(currentRun)
      currentRun = [curr]
    }
  }
  runs.push(currentRun)

  const formattedRuns = runs.map(run => {
    const firstAbs = run[0]
    const lastAbs = run[run.length - 1]
    const startInfo = absoluteToPage(firstAbs, totalPrefacePages, includePrefacePages)
    if (run.length === 1) {
      return startInfo.raw
    }
    const endInfo = absoluteToPage(lastAbs, totalPrefacePages, includePrefacePages)
    return `${startInfo.raw}–${endInfo.raw}`
  })

  return formattedRuns.join(' & ')
}

/**
 * Extracts the set of all absolute page numbers that have already been read.
 */
export function getReadAbsolutePages(
  history: ReadSession[],
  totalPrefacePages = 0,
  includePrefacePages = true
): Set<number> {
  const readSet = new Set<number>()
  if (!Array.isArray(history)) return readSet

  let inferredTp = totalPrefacePages
  if (inferredTp <= 0) {
    for (const s of history) {
      if (s.totalPrefacePages && Number(s.totalPrefacePages) > 0) {
        inferredTp = Math.max(inferredTp, Number(s.totalPrefacePages))
      }
      const p1 = parsePageInput(s.startPageRaw ?? s.startPage)
      const p2 = parsePageInput(s.endPageRaw ?? s.endPage)
      if (p1?.isRoman) inferredTp = Math.max(inferredTp, p1.num)
      if (p2?.isRoman) inferredTp = Math.max(inferredTp, p2.num)
    }
  }

  for (const s of history) {
    const sTp = (totalPrefacePages > 0)
      ? totalPrefacePages
      : ((s.totalPrefacePages && s.totalPrefacePages > 0) ? s.totalPrefacePages : inferredTp)
    const sInclude = includePrefacePages !== false && (sTp > 0)

    let parsedPages: number[] = []
    if (s.displayRange) {
      parsedPages = parseRangeStringToAbsolutePages(s.displayRange, sTp, sInclude)
    } else if (s.startPageRaw && s.startPageRaw.includes('&')) {
      parsedPages = parseRangeStringToAbsolutePages(s.startPageRaw, sTp, sInclude)
    }

    if (parsedPages.length > 0) {
      for (const p of parsedPages) readSet.add(p)
    } else {
      const pStart = parsePageInput(s.startPageRaw ?? s.startPage)
      const pEnd = parsePageInput(s.endPageRaw ?? s.endPage)

      if (pStart && pEnd) {
        const isStartR = Boolean(pStart.isRoman || (s.isRoman && (!s.endPageRaw || isRomanNumeral(s.endPageRaw))))
        const isEndR = Boolean(pEnd.isRoman || (s.isRoman && (!s.startPageRaw || isRomanNumeral(s.startPageRaw))))
        let absStart = 0
        let absEnd = 0

        if (sInclude && sTp > 0) {
          absStart = isStartR ? pStart.num : (sTp + pStart.num)
          absEnd = isEndR ? pEnd.num : (sTp + pEnd.num)
        } else {
          absStart = pStart.num
          absEnd = pEnd.num
        }

        if (absStart > 0 && absEnd > 0) {
          const minA = Math.min(absStart, absEnd)
          const maxA = Math.max(absStart, absEnd)
          for (let i = minA; i <= maxA; i++) {
            readSet.add(i)
          }
        }
      } else if (s.startPage && s.endPage) {
        const st = Number(s.startPage)
        const ed = Number(s.endPage)
        if (st > 0 && ed > 0) {
          const minA = Math.min(st, ed)
          const maxA = Math.max(st, ed)
          const offset = (sInclude && sTp > 0 && !s.isRoman) ? sTp : 0
          for (let i = minA; i <= maxA; i++) {
            readSet.add(i + offset)
          }
        }
      }
    }
  }

  return readSet
}

export interface ResolvedReadingPages {
  actualPages: string[]
  pagesCount: number
  formattedRange: string
  newUniquePages: number
  nextUnreadPage: {
    displayNum: number
    raw: string
  }
  absolutePages: number[]
  startPage: number
  endPage: number
  startPageRaw: string
  endPageRaw: string
  isRoman: boolean
}

/**
 * Resolves exactly N unread pages in book sequence (Roman opening -> Arabic text),
 * skipping all previously read pages, and formats the range with '-' for contiguous pages
 * and '&' for gaps.
 */
export function resolvePagesFromPagesRead(
  pagesRead: number,
  readHistory: ReadSession[],
  openingPages = 0,
  baseTotalPages = 0
): ResolvedReadingPages {
  const count = Math.max(1, Number(pagesRead) || 1)
  const totalPreface = Math.max(0, Number(openingPages) || 0)
  const baseTotal = Math.max(0, Number(baseTotalPages) || 0)
  const effTotal = totalPreface > 0 ? (baseTotal > 0 ? baseTotal + totalPreface : 0) : baseTotal
  const readSet = getReadAbsolutePages(readHistory, totalPreface, totalPreface > 0)

  const unreadAbsList: number[] = []
  let current = 1
  const maxLimit = effTotal > 0 ? effTotal : 999999

  while (unreadAbsList.length < count && current <= maxLimit) {
    if (!readSet.has(current)) {
      unreadAbsList.push(current)
    }
    current++
  }

  if (unreadAbsList.length === 0) {
    unreadAbsList.push(effTotal > 0 ? effTotal : Math.max(1, current))
  }

  const formattedRange = formatPageRuns(unreadAbsList, totalPreface, totalPreface > 0)

  const actualPages = unreadAbsList.map(p => {
    return absoluteToPage(p, totalPreface, totalPreface > 0).raw
  })

  const lastPicked = unreadAbsList[unreadAbsList.length - 1]
  let nextAbs = lastPicked + 1
  while (readSet.has(nextAbs) && (effTotal <= 0 || nextAbs <= effTotal)) {
    nextAbs++
  }
  const nextInfo = absoluteToPage(nextAbs, totalPreface, totalPreface > 0)

  const firstInfo = absoluteToPage(unreadAbsList[0], totalPreface, totalPreface > 0)
  const lastInfo = absoluteToPage(lastPicked, totalPreface, totalPreface > 0)

  return {
    actualPages,
    pagesCount: unreadAbsList.length,
    formattedRange,
    newUniquePages: unreadAbsList.length,
    nextUnreadPage: {
      displayNum: nextInfo.displayNum,
      raw: nextInfo.raw
    },
    absolutePages: unreadAbsList,
    startPage: firstInfo.displayNum,
    endPage: lastInfo.displayNum,
    startPageRaw: firstInfo.raw,
    endPageRaw: lastInfo.raw,
    isRoman: unreadAbsList.some(p => p <= totalPreface)
  }
}

/**
 * Scans forward to pick the next `amount` of unread absolute pages,
 * skipping any pages that have already been read.
 */
export function getNextUnreadPages(
  book: Book | null | undefined,
  amount: number,
  totalPrefacePages = 0,
  includePrefacePages = false,
  startFromAbs?: number
): number[] {
  const count = Math.max(1, amount)
  const history = Array.isArray(book?.readHistory) ? book!.readHistory : []
  const readSet = getReadAbsolutePages(history, totalPrefacePages, includePrefacePages)
  const effTotal = getEffectiveTotalPages(book, totalPrefacePages, includePrefacePages)

  let cursor = startFromAbs
  if (cursor === undefined || cursor === null || cursor <= 0) {
    cursor = 1
  }

  const unread: number[] = []
  let current = cursor
  const maxSearch = effTotal > 0 ? effTotal : (cursor + count + 1000)

  while (unread.length < count && current <= maxSearch) {
    if (!readSet.has(current)) {
      unread.push(current)
    }
    current++
  }

  if (unread.length === 0) {
    unread.push(Math.max(1, cursor))
  }

  return unread
}

/**
 * Determines the last end page of a book for sequential reading calculation.
 */
export function getLastEndPage(book: Book | null | undefined): number {
  if (!book) return 0
  const history = Array.isArray(book.readHistory) ? book.readHistory : []
  if (history.length === 0) {
    return Number(book.pagesRead) || 0
  }

  const tp = getBookTotalPrefacePages(book)
  const inc = getBookIncludePreface(book)

  const nextUnread = getNextUnreadPages(book, 1, tp, inc)
  const nextAbs = nextUnread[0] || 1
  return Math.max(0, nextAbs - 1)
}

/**
 * Calculates unique Arabic and Roman pages from a session history list.
 */
export function calculateBookProgressFromHistory(
  readHistory: ReadSession[],
  baseTotalPages = 0,
  totalPrefacePages = 0,
  includePrefacePages = false
): {
  pagesRead: number
  effectiveTotalPages: number
  uniqueArabicPages: number
  uniqueRomanPages: number
  percentage: number
} {
  const hasRoman = Array.isArray(readHistory) && readHistory.some(s =>
    Boolean(s.isRoman || parsePageInput(s.startPageRaw ?? s.startPage)?.isRoman || parsePageInput(s.endPageRaw ?? s.endPage)?.isRoman)
  )

  let effPreface = totalPrefacePages
  if (effPreface <= 0 && Array.isArray(readHistory)) {
    for (const s of readHistory) {
      if (s.totalPrefacePages && Number(s.totalPrefacePages) > 0) {
        effPreface = Math.max(effPreface, Number(s.totalPrefacePages))
      }
      const p1 = parsePageInput(s.startPageRaw ?? s.startPage)
      const p2 = parsePageInput(s.endPageRaw ?? s.endPage)
      if (p1?.isRoman) effPreface = Math.max(effPreface, p1.num)
      if (p2?.isRoman) effPreface = Math.max(effPreface, p2.num)
    }
  }
  const effInclude = includePrefacePages || (hasRoman && effPreface > 0) || (effPreface > 0)

  const effTotal = getEffectiveTotalPages({ totalPages: baseTotalPages } as any, effPreface, effInclude)

  if (!Array.isArray(readHistory) || readHistory.length === 0) {
    return {
      pagesRead: 0,
      effectiveTotalPages: effTotal,
      uniqueArabicPages: 0,
      uniqueRomanPages: 0,
      percentage: 0
    }
  }

  if (effInclude && effPreface > 0) {
    const readSet = getReadAbsolutePages(readHistory, effPreface, true)
    let romanCount = 0
    let arabicCount = 0
    for (const p of readSet) {
      if (p <= effPreface) {
        romanCount++
      } else {
        arabicCount++
      }
    }
    const totalUnique = readSet.size
    const pagesRead = effTotal > 0 ? Math.min(totalUnique, effTotal) : totalUnique
    const percentage = calculateProgressPercentage(pagesRead, effTotal)

    return {
      pagesRead,
      effectiveTotalPages: effTotal,
      uniqueArabicPages: arabicCount,
      uniqueRomanPages: romanCount,
      percentage
    }
  }

  const arabicIntervals: Interval[] = []
  for (const s of readHistory) {
    const pStart = parsePageInput(s.startPageRaw ?? s.startPage)
    const pEnd = parsePageInput(s.endPageRaw ?? s.endPage)
    const isStartRoman = Boolean(pStart?.isRoman)
    const isEndRoman = Boolean(pEnd?.isRoman)

    if (isStartRoman && pEnd && !isEndRoman) {
      const st = pStart!.num
      const ed = pEnd.num
      arabicIntervals.push({ start: Math.min(st, ed), end: Math.max(st, ed) })
    } else if (isStartRoman || isEndRoman || s.isRoman) {
    } else {
      const st = Number(s.startPage) || 0
      const ed = Number(s.endPage) || 0
      if (st > 0 && ed >= st) {
        arabicIntervals.push({ start: st, end: ed })
      }
    }
  }

  const uniqueArabicPages = calculateUniquePages(arabicIntervals)
  const pagesRead = effTotal > 0 ? Math.min(uniqueArabicPages, effTotal) : uniqueArabicPages
  const percentage = calculateProgressPercentage(pagesRead, effTotal)

  return {
    pagesRead,
    effectiveTotalPages: effTotal,
    uniqueArabicPages,
    uniqueRomanPages: 0,
    percentage
  }
}

export interface ReadingProgressInput {
  book: Book | null | undefined
  startInput?: string | null
  endInput?: string | null
  pagesDelta?: number | null
  includePrefacePages?: boolean | null
  totalPrefaceInput?: string | number | null
}

export interface ReadingProgressOutput {
  isValid: boolean
  errorMessage: string | null
  isRangeSpecified: boolean
  startPage: number
  endPage: number
  startPageRaw: string
  endPageRaw: string
  displayRange: string
  pagesAdded: number
  prefacePagesRead: number
  arabicPagesRead: number
  isRoman: boolean
  isStartRoman: boolean
  isEndRoman: boolean
  isCrossRange: boolean
  includePrefacePages: boolean
  totalPrefacePages: number
  currentPagesRead: number
  projectedPagesRead: number
  effectiveTotalPages: number
  currentPercentage: number
  projectedPercentage: number
  nextStartPage: number
  nextStartPageRaw: string
  newUniquePagesAdded: number
}

/**
 * Unified calculation function used across Tracker and Koleksi.
 * Guarantees identical calculations for ranges, pages added, preface offset, and projected book progress.
 */
export function calculateReadingProgress(input: ReadingProgressInput): ReadingProgressOutput {
  const {
    book,
    startInput = '',
    endInput = '',
    pagesDelta = 1,
    totalPrefaceInput = ''
  } = input

  const rawStart = String(startInput || '').trim()
  const rawEnd = String(endInput || '').trim()
  const isRangeSpecified = Boolean(rawStart || rawEnd)

  const pStart = rawStart ? parsePageInput(rawStart) : null
  const pEnd = rawEnd ? parsePageInput(rawEnd) : null

  const isStartRoman = Boolean(pStart?.isRoman)
  const isEndRoman = Boolean(pEnd?.isRoman)
  let isRoman = isStartRoman || isEndRoman

  const hasRomanHistory = bookHasRomanHistory(book)

  const historicalPreface = getHistoricalTotalPrefacePages(book)
  const highestRomanInHistory = getHighestRomanPageInHistory(book)
  const minRequiredPreface = highestRomanInHistory

  let includePreface = false
  if (isRoman) {
    includePreface = true
  } else if (isRangeSpecified) {
    includePreface = false
  } else if (input.includePrefacePages !== undefined) {
    includePreface = Boolean(input.includePrefacePages)
  } else {
    includePreface = hasRomanHistory || (historicalPreface > 0)
  }

  let totalPrefacePages = 0
  if (isRoman || includePreface) {
    totalPrefacePages = getBookTotalPrefacePages(book, totalPrefaceInput)
  }

  let effectiveTotalPages = getEffectiveTotalPages(book, totalPrefacePages, includePreface)
  const totalBookPreface = Math.max(
    totalPrefacePages,
    historicalPreface,
    getBookTotalPrefacePages(book, totalPrefaceInput),
    highestRomanInHistory
  )
  const resolvedEffectiveTotal = (hasRomanHistory || historicalPreface > 0 || totalBookPreface > 0)
    ? getEffectiveTotalPages(book, totalBookPreface, true)
    : effectiveTotalPages

  const history = Array.isArray(book?.readHistory) ? book!.readHistory : []
  const activePreface = totalBookPreface > 0 ? totalBookPreface : totalPrefacePages
  const activeInclude = totalBookPreface > 0 || isRoman || includePreface
  const readSetBefore = getReadAbsolutePages(history, activePreface, activeInclude)

  const historyPagesRead = history.length > 0 ? readSetBefore.size : (Number(book?.pagesRead) || 0)
  const currentPagesRead = resolvedEffectiveTotal > 0 ? Math.min(historyPagesRead, resolvedEffectiveTotal) : historyPagesRead

  let isValid = true
  let errorMessage: string | null = null

  if (isRoman || includePreface) {
    if (totalPrefaceInput !== undefined && totalPrefaceInput !== null && String(totalPrefaceInput).trim() !== '') {
      let enteredTp = 0
      const tpStr = String(totalPrefaceInput).trim()
      if (isRomanNumeral(tpStr)) {
        enteredTp = romanToInt(tpStr)
      } else {
        const n = parseInt(tpStr, 10)
        if (!isNaN(n)) enteredTp = n
      }
      if (minRequiredPreface > 0 && enteredTp < minRequiredPreface) {
        isValid = false
        errorMessage = `Total halaman pembuka (${enteredTp}) tidak boleh lebih sedikit dari angka Romawi tertinggi di histori (${intToRoman(minRequiredPreface).toUpperCase()} / ${minRequiredPreface} hal)`
      }
    } else if (isRoman && minRequiredPreface > 0) {
      isValid = false
      errorMessage = `Total halaman pembuka wajib diisi minimal ${minRequiredPreface} hal (${intToRoman(minRequiredPreface).toUpperCase()})`
    }
  }

  let startPage = 0
  let endPage = 0
  let startPageRaw = ''
  let endPageRaw = ''
  let pagesAdded = 0
  let prefacePagesRead = 0
  let arabicPagesRead = 0
  let isCrossRange = false
  let nextStartPage = 1
  let nextStartPageRaw = '1'
  let displayRange = '-'

  if (!isValid) {
  } else if (isRangeSpecified) {
    if (rawStart && !rawEnd) {
      isValid = false
      errorMessage = 'Halaman akhir (sampai) wajib'
    } else if (!rawStart && rawEnd) {
      isValid = false
      errorMessage = 'Halaman awal (mulai) wajib'
    } else if (!pStart) {
      isValid = false
      errorMessage = 'Halaman awal tidak valid'
    } else if (!pEnd) {
      isValid = false
      errorMessage = 'Halaman akhir tidak valid'
    } else {
      const totalBookPages = Number(book?.totalPages) || 0

      if (isRoman) {
        if (!totalPrefacePages || totalPrefacePages <= 0) {
          isValid = false
          errorMessage = 'Total halaman pembuka wajib'
        } else {
          const P = totalPrefacePages

          if (isStartRoman && pStart.num > P) {
            isValid = false
            errorMessage = `Halaman Romawi awal (${pStart.raw.toUpperCase()}) melebihi total halaman pembuka (${intToRoman(P)} / ${P})`
          } else if (isEndRoman && pEnd.num > P) {
            isValid = false
            errorMessage = `Halaman Romawi akhir (${pEnd.raw.toUpperCase()}) melebihi total halaman pembuka (${intToRoman(P)} / ${P})`
          } else if (isStartRoman && isEndRoman) {
            if (pStart.num > pEnd.num) {
              isValid = false
              errorMessage = 'Halaman awal tidak boleh lebih besar dari halaman akhir'
            }
          } else if (!isStartRoman && isEndRoman) {
            isValid = false
            errorMessage = 'Rentang tidak valid: Halaman Romawi (pembuka) berada sebelum halaman Arab'
          } else if (isStartRoman && !isEndRoman) {
            if (totalBookPages > 0 && pEnd.num > totalBookPages) {
              isValid = false
              errorMessage = `Halaman akhir (${pEnd.num}) melebihi total halaman buku (${totalBookPages})`
            }
          }
        }
      } else {
        if (pStart.num > pEnd.num) {
          isValid = false
          errorMessage = 'Halaman awal tidak boleh lebih besar dari halaman akhir'
        } else if (totalBookPages > 0) {
          if (pStart.num > totalBookPages) {
            isValid = false
            errorMessage = `Halaman awal (${pStart.num}) melebihi total halaman buku (${totalBookPages})`
          } else if (pEnd.num > totalBookPages) {
            isValid = false
            errorMessage = `Halaman akhir (${pEnd.num}) melebihi total halaman buku (${totalBookPages})`
          }
        }
      }

      if (isValid) {
        if (isRoman && totalPrefacePages > 0) {
          const absStart = pageToAbsolute(pStart, totalPrefacePages, true)
          const absEnd = pageToAbsolute(pEnd, totalPrefacePages, true)

          startPage = pStart.num
          endPage = pEnd.num
          startPageRaw = pStart.raw
          endPageRaw = pEnd.raw
          pagesAdded = absEnd - absStart + 1
          isCrossRange = isStartRoman !== isEndRoman

          for (let i = absStart; i <= absEnd; i++) {
            if (i <= totalPrefacePages) prefacePagesRead++
            else arabicPagesRead++
          }

          const nextAbs = absEnd + 1
          const nextInfo = absoluteToPage(nextAbs, totalPrefacePages, true, false)
          nextStartPage = nextInfo.displayNum
          nextStartPageRaw = nextInfo.raw
        } else {
          startPage = pStart.num
          endPage = pEnd.num
          startPageRaw = pStart.raw
          endPageRaw = pEnd.raw
          pagesAdded = pEnd.num - pStart.num + 1
          arabicPagesRead = pagesAdded
          prefacePagesRead = 0
          nextStartPage = endPage + 1
          nextStartPageRaw = String(nextStartPage)
        }
        displayRange = `${startPageRaw}–${endPageRaw}`
      }
    }
  } else {
    const requestedCount = Number(pagesDelta) || 0
    if (requestedCount <= 0) {
      isValid = false
      errorMessage = 'Jumlah halaman harus lebih dari 0'
      pagesAdded = 0
    } else {
      const historicalPreface = getHistoricalTotalPrefacePages(book)
      const highestRomanInHistory = getHighestRomanPageInHistory(book)
      const bookPreface = getBookTotalPrefacePages(book, totalPrefaceInput)
      const openingPages = bookPreface > 0 ? bookPreface : Math.max(historicalPreface, highestRomanInHistory)

      const resolved = resolvePagesFromPagesRead(
        requestedCount,
        history,
        openingPages,
        Number(book?.totalPages) || 0
      )

      startPage = resolved.startPage
      endPage = resolved.endPage
      startPageRaw = resolved.startPageRaw
      endPageRaw = resolved.endPageRaw
      pagesAdded = resolved.pagesCount
      isRoman = resolved.isRoman
      isCrossRange = resolved.isRoman && !resolved.actualPages.every(p => isRomanNumeral(p))

      prefacePagesRead = resolved.absolutePages.filter(p => p <= openingPages).length
      arabicPagesRead = resolved.absolutePages.filter(p => p > openingPages).length

      if (openingPages > 0) {
        totalPrefacePages = openingPages
        includePreface = true
        effectiveTotalPages = getEffectiveTotalPages(book, totalPrefacePages, true)
      }

      nextStartPage = resolved.nextUnreadPage.displayNum
      nextStartPageRaw = resolved.nextUnreadPage.raw
      displayRange = resolved.formattedRange
    }
  }

  if (!isValid) {
    displayRange = errorMessage || 'Rentang tidak valid'
  }

  let projectedPagesRead = currentPagesRead
  if (isValid && pagesAdded > 0) {
    const historicalPreface = getHistoricalTotalPrefacePages(book)
    const highestRomanInHistory = getHighestRomanPageInHistory(book)
    const bookPreface = getBookTotalPrefacePages(book, totalPrefaceInput)
    const activeOpening = bookPreface > 0 ? bookPreface : Math.max(historicalPreface, highestRomanInHistory)

    const simulatedHistory: ReadSession[] = [...history]
    simulatedHistory.push({
      id: 'simulated_session',
      date: new Date().toISOString(),
      pagesAdded,
      startPage,
      endPage,
      startPageRaw,
      endPageRaw,
      displayRange,
      isRoman: isRoman || isCrossRange || prefacePagesRead > 0,
      includePrefacePages: Boolean(includePreface || activeOpening > 0),
      totalPrefacePages: activeOpening > 0 ? activeOpening : undefined
    })

    const calculated = calculateBookProgressFromHistory(
      simulatedHistory,
      Number(book?.totalPages) || 0,
      activeOpening > 0 ? activeOpening : totalPrefacePages,
      Boolean(includePreface || activeOpening > 0)
    )
    projectedPagesRead = calculated.pagesRead
  }



  const newUniquePagesAdded = Math.max(0, projectedPagesRead - currentPagesRead)
  const currentPercentage = calculateProgressPercentage(currentPagesRead, resolvedEffectiveTotal)
  const projectedPercentage = calculateProgressPercentage(projectedPagesRead, resolvedEffectiveTotal)

  return {
    isValid,
    errorMessage,
    isRangeSpecified,
    startPage,
    endPage,
    startPageRaw,
    endPageRaw,
    displayRange,
    pagesAdded,
    prefacePagesRead,
    arabicPagesRead,
    isRoman: isRoman || isCrossRange || (includePreface && prefacePagesRead > 0),
    isStartRoman: Boolean(pStart?.isRoman) || (includePreface && Boolean(startPageRaw && isRomanNumeral(startPageRaw))),
    isEndRoman: Boolean(pEnd?.isRoman) || (includePreface && Boolean(endPageRaw && isRomanNumeral(endPageRaw))),
    isCrossRange,
    includePrefacePages: Boolean(includePreface || (activePreface > 0 && !isRangeSpecified)),
    totalPrefacePages: activePreface > 0 ? activePreface : totalPrefacePages,
    currentPagesRead,
    projectedPagesRead,
    effectiveTotalPages: resolvedEffectiveTotal,
    currentPercentage,
    projectedPercentage,
    nextStartPage,
    nextStartPageRaw,
    newUniquePagesAdded
  }
}

export function computeReadingRange(params: {
  lastEndPage: number
  pagesAdded: number
  startInput?: string
  endInput?: string
  includePrefacePages?: boolean
  totalPrefacePages?: string | number
  book?: Book | null
}) {
  const result = calculateReadingProgress({
    book: params.book || { pagesRead: params.lastEndPage, totalPages: 0, title: '', topic: [], date: '', price: 0 },
    startInput: params.startInput,
    endInput: params.endInput,
    pagesDelta: params.pagesAdded,
    includePrefacePages: params.includePrefacePages,
    totalPrefaceInput: params.totalPrefacePages
  })

  return {
    isValid: result.isValid,
    errorMessage: result.errorMessage,
    isRangeSpecified: result.isRangeSpecified,
    startPage: result.startPage,
    endPage: result.endPage,
    startPageRaw: result.startPageRaw,
    endPageRaw: result.endPageRaw,
    pagesAdded: result.pagesAdded,
    isRoman: result.isRoman,
    isStartRoman: result.isStartRoman,
    isEndRoman: result.isEndRoman,
    isCrossRange: result.isCrossRange,
    includePrefacePages: result.includePrefacePages,
    totalPrefacePages: result.totalPrefacePages,
    displayRange: result.displayRange,
    projectedPagesRead: result.projectedPagesRead,
    effectiveTotalPages: result.effectiveTotalPages,
    nextStartPage: result.nextStartPage,
    nextStartPageRaw: result.nextStartPageRaw
  }
}

/**
 * Formats session page range for display in history lists.
 */
export function formatSessionRange(session: ReadSession): string {
  if (session.displayRange) {
    return session.displayRange.startsWith('Hal ') ? session.displayRange : `Hal ${session.displayRange}`
  }
  if (session.startPageRaw && session.endPageRaw) {
    return `Hal ${session.startPageRaw} – ${session.endPageRaw}`
  }
  if (session.startPage !== undefined && session.endPage !== undefined && session.startPage > 0) {
    return `Hal ${session.startPage} – ${session.endPage}`
  }
  if (session.startPage === 0 && session.endPage && session.endPage > 0) {
    return `Hal 1 – ${session.endPage}`
  }
  return `+${session.pagesAdded} HAL`
}

/**
 * Normalizes legacy 0-indexed read sessions (from commit 40e1726 or earlier)
 * to 1-based page intervals with displayRange and proper start/end pages.
 * Preserves modern sessions (Roman or sessions with displayRange/startPageRaw).
 * Returns true if any changes were made to the history.
 */
export function normalizeLegacyReadSessions(readHistory: any[], baseTotalPages = 0): boolean {
  if (!Array.isArray(readHistory) || readHistory.length === 0) return false

  let hasChanged = false
  let runningLegacyPage = 0

  readHistory.forEach((s, idx) => {
    if (!s.id) {
      s.id = 'sess_' + (Date.now() + idx) + '_' + Math.random().toString(36).slice(2, 6)
      hasChanged = true
    }
    s.pagesAdded = Number(s.pagesAdded) || 0
    if (s.duration === undefined) {
      s.duration = null
    }

    const isModern = Boolean(s.displayRange || s.startPageRaw || s.endPageRaw || s.isRoman)

    if (isModern) {
      const isRoman = isSessionRoman(s)
      if (!isRoman && baseTotalPages > 0) {
        const numEnd = Number(s.endPage)
        const numStart = Number(s.startPage) || 1
        if (numEnd > baseTotalPages) {
          s.endPage = baseTotalPages
          s.endPageRaw = String(baseTotalPages)
          if (numStart > baseTotalPages) {
            s.startPage = 1
            s.startPageRaw = '1'
          }
          s.pagesAdded = Math.max(1, s.endPage - s.startPage + 1)
          s.displayRange = s.startPage === s.endPage ? String(s.startPage) : `${s.startPage}–${s.endPage}`
          hasChanged = true
        }
      }

      const numEnd = Number(s.endPage)
      if (!isNaN(numEnd) && numEnd > 0) {
        runningLegacyPage = Math.max(runningLegacyPage, numEnd)
      }
      return
    }

    const hasStart = s.startPage !== undefined && s.startPage !== null && !isNaN(Number(s.startPage))
    const hasEnd = s.endPage !== undefined && s.endPage !== null && !isNaN(Number(s.endPage))
    let start = hasStart ? Number(s.startPage) : 0
    let end = hasEnd ? Number(s.endPage) : 0

    if (s.pagesAdded > 0) {
      if (start === 0 || start === runningLegacyPage || (!hasStart && !hasEnd)) {
        start = runningLegacyPage + 1
        end = runningLegacyPage + s.pagesAdded
      } else if (end >= start && (end - start === s.pagesAdded) && start > 0) {
        start = start + 1
        end = start + s.pagesAdded - 1
      } else if (start > 0 && end >= start) {
      } else {
        start = runningLegacyPage + 1
        end = runningLegacyPage + s.pagesAdded
      }

      if (baseTotalPages > 0 && end > baseTotalPages) {
        end = baseTotalPages
        start = Math.min(start, end)
        s.pagesAdded = Math.max(1, end - start + 1)
      }

      if (s.startPage !== start || s.endPage !== end || !s.displayRange || !s.startPageRaw || !s.endPageRaw) {
        hasChanged = true
      }

      s.startPage = start
      s.endPage = end
      s.startPageRaw = String(start)
      s.endPageRaw = String(end)
      s.displayRange = start === end ? String(start) : `${start}–${end}`
      s.isRoman = false
      runningLegacyPage = Math.max(runningLegacyPage, end)
    }
  })

  return hasChanged
}

