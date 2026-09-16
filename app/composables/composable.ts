import { ref } from 'vue'
import {
  calculateUniquePages,
  parsePageInput,
  calculateBookProgressFromHistory,
  getBookTotalPrefacePages,
  getBookIncludePreface,
  getEffectiveTotalPages,
  bookHasRomanHistory,
  normalizeLegacyReadSessions
} from '~/utils/readingProgress'

const DB_NAME = 'BookTrackerDB'
const STORE_NAME = 'books'
const DB_VERSION = 3
const LEGACY_MIGRATION_KEY = 'logbuku_legacy_db_normalized_v2'

const books = ref<any[]>([])
const isLoaded = ref(false)
const isLoading = ref(false)

let isPersistChecked = false

const requestPersistentStorage = () => {
  if (isPersistChecked) return
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined' && navigator.storage?.persist) {
    isPersistChecked = true
    navigator.storage.persisted().then((isPersisted) => {
      if (!isPersisted) {
        navigator.storage.persist()
      }
    }).catch(() => {})
  }
}

export const useBooks = () => {
  const initDB = (): Promise<IDBDatabase> => {
    requestPersistentStorage()
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
        }
      }
      
      request.onsuccess = (event: any) => {
        resolve(event.target.result)
      }
      
      request.onerror = (event: any) => {
        reject(event.target.error)
      }
    })
  }

  const loadBooks = (): Promise<any[]> => {
    isLoading.value = true
    return new Promise(async (resolve, reject) => {
      try {
        const db = await initDB()
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const request = store.getAll()
        
        request.onsuccess = () => {
          const loadedBooks = request.result || []
          let hasMigratedAny = false
          
          loadedBooks.forEach((b: any) => {
            if (typeof b.topic === 'string') {
              b.topic = b.topic.trim() ? [b.topic.trim()] : []
            } else if (!b.topic) {
              b.topic = []
            }
            b.author = b.author ? String(b.author).trim() : ''
            b.publisher = b.publisher ? String(b.publisher).trim() : ''

            const oldPagesRead = b.pagesRead
            const oldCompletedAt = b.completedAt
            const oldTotalPreface = b.totalPrefacePages
            const oldIncludePreface = b.includePrefacePages

            if (!Array.isArray(b.readHistory)) {
              b.readHistory = []
            }

            if (Number(b.pagesRead) > 0 && b.readHistory.length === 0) {
              b.readHistory.push({
                id: 'sess_legacy_' + (b.id || Date.now()),
                date: b.updatedAt || b.createdAt || new Date().toISOString(),
                pagesAdded: Number(b.pagesRead) || 0,
                startPage: 1,
                endPage: Number(b.pagesRead) || 0,
                duration: null
              })
              hasMigratedAny = true
            }

            if (b.readHistory.length > 0) {
              const changed = normalizeLegacyReadSessions(b.readHistory, Number(b.totalPages) || 0)
              recalculateBookProgress(b)
              if (
                changed ||
                b.pagesRead !== oldPagesRead ||
                b.completedAt !== oldCompletedAt ||
                b.totalPrefacePages !== oldTotalPreface ||
                b.includePrefacePages !== oldIncludePreface
              ) {
                hasMigratedAny = true
              }
            }
          })

          const isMigratedFlag = typeof window !== 'undefined' ? localStorage.getItem(LEGACY_MIGRATION_KEY) : 'true'

          if (hasMigratedAny || !isMigratedFlag) {
            try {
              const writeTx = db.transaction(STORE_NAME, 'readwrite')
              const writeStore = writeTx.objectStore(STORE_NAME)
              loadedBooks.forEach((b: any) => {
                writeStore.put(JSON.parse(JSON.stringify(b)))
              })
              if (typeof window !== 'undefined') {
                localStorage.setItem(LEGACY_MIGRATION_KEY, 'true')
              }
            } catch (err) {
              console.warn('Auto-migration write error:', err)
            }
          }
          
          books.value = loadedBooks.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1
            if (!a.isPinned && b.isPinned) return 1
            return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
          })
          isLoaded.value = true
          isLoading.value = false
          resolve(books.value)
        }
        request.onerror = (e) => {
          isLoading.value = false
          reject(e)
        }
      } catch (error) {
        isLoading.value = false
        console.error("Gagal memuat buku:", error)
        reject(error)
      }
    })
  }

  const recalculateBookProgress = (book: any) => {
    if (!Array.isArray(book.readHistory)) {
      book.readHistory = []
    }
    normalizeLegacyReadSessions(book.readHistory, Number(book.totalPages) || 0)

    const hasRoman = bookHasRomanHistory(book)
    const hasExplicitPreface = Boolean(book.includePrefacePages && book.totalPrefacePages && Number(book.totalPrefacePages) > 0)
    let totalPrefacePages = 0
    let includePrefacePages = false

    if (hasRoman || hasExplicitPreface) {
      totalPrefacePages = getBookTotalPrefacePages(book)
      includePrefacePages = true
      book.totalPrefacePages = totalPrefacePages > 0 ? totalPrefacePages : undefined
      book.includePrefacePages = true
    } else {
      totalPrefacePages = 0
      includePrefacePages = false
      delete book.totalPrefacePages
      book.includePrefacePages = false
    }

    const effectiveTotalPages = getEffectiveTotalPages(book, totalPrefacePages, includePrefacePages)
    
    const { pagesRead } = calculateBookProgressFromHistory(
      book.readHistory,
      book.totalPages,
      totalPrefacePages,
      includePrefacePages
    )
    book.pagesRead = pagesRead

    if (effectiveTotalPages > 0 && book.pagesRead >= effectiveTotalPages) {
      if (!book.completedAt) {
        const lastSessionDate = book.readHistory.length > 0 ? book.readHistory[book.readHistory.length - 1].date : null
        book.completedAt = lastSessionDate || new Date().toISOString()
      }
    } else {
      delete book.completedAt
    }
  }

  const saveBook = (bookData: any): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await initDB()
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        
        const now = new Date().toISOString()
        
        const cleanData = JSON.parse(JSON.stringify(bookData))
        cleanData.author = cleanData.author ? String(cleanData.author).trim() : ''
        cleanData.publisher = cleanData.publisher ? String(cleanData.publisher).trim() : ''
        
        if (cleanData.id) {
          cleanData.updatedAt = now
          store.put(cleanData)
        } else {
          delete cleanData.id
          cleanData.createdAt = now
          cleanData.updatedAt = now
          cleanData.pagesRead = cleanData.pagesRead || 0
          cleanData.isPinned = cleanData.isPinned || false
          store.add(cleanData)
        }
        
        tx.oncomplete = async () => {
          await loadBooks()
          resolve()
        }
        tx.onerror = (e) => reject(e)
      } catch (error) {
        console.error("Gagal menyimpan buku:", error)
        reject(error)
      }
    })
  }

  const saveBooks = (booksList: any[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await initDB()
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const now = new Date().toISOString()

        booksList.forEach((b: any) => {
          const cleanData = JSON.parse(JSON.stringify(b))
          cleanData.author = cleanData.author ? String(cleanData.author).trim() : ''
          cleanData.publisher = cleanData.publisher ? String(cleanData.publisher).trim() : ''
          cleanData.updatedAt = now
          store.put(cleanData)
        })

        tx.oncomplete = async () => {
          await loadBooks()
          resolve()
        }
        tx.onerror = (e) => reject(e)
      } catch (error) {
        console.error("Gagal menyimpan daftar buku:", error)
        reject(error)
      }
    })
  }

  const deleteBook = (id: number): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await initDB()
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        store.delete(id)
        
        tx.oncomplete = async () => {
          await loadBooks()
          resolve()
        }
        tx.onerror = (e) => reject(e)
      } catch (error) {
        console.error("Gagal menghapus buku:", error)
        reject(error)
      }
    })
  }

  const updateTargets = (selectedIds: number[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await initDB()
        const tx = db.transaction(STORE_NAME, 'readwrite')
        const store = tx.objectStore(STORE_NAME)
        const request = store.getAll()
        
        request.onsuccess = () => {
          const loadedBooks = request.result || []
          loadedBooks.forEach((b: any) => {
            const isSelected = selectedIds.includes(b.id)
            if (!!b.isTarget !== isSelected) {
              b.isTarget = isSelected
              store.put(b)
            }
          })
        }
        
        tx.oncomplete = async () => {
          await loadBooks()
          resolve()
        }
        tx.onerror = (e) => reject(e)
      } catch (error) {
        console.error("Gagal update target:", error)
        reject(error)
      }
    })
  }

  const addReadSession = async (
    bookId: number | string,
    session: {
      date: string
      pagesAdded: number
      duration?: number | null
      startPage?: number
      endPage?: number
      startPageRaw?: string
      endPageRaw?: string
      isRoman?: boolean
      includePrefacePages?: boolean
      totalPrefacePages?: number
    }
  ) => {
    const book = books.value.find(b => String(b.id) === String(bookId))
    if (!book) return
    const updatedBook = JSON.parse(JSON.stringify(book))
    if (!Array.isArray(updatedBook.readHistory)) {
      updatedBook.readHistory = []
    }
    
    const newSession = {
      id: 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      date: session.date || new Date().toISOString(),
      pagesAdded: Number(session.pagesAdded) || 0,
      duration: session.duration !== undefined ? session.duration : null,
      startPage: session.startPage !== undefined ? Number(session.startPage) : undefined,
      endPage: session.endPage !== undefined ? Number(session.endPage) : undefined,
      startPageRaw: session.startPageRaw,
      endPageRaw: session.endPageRaw,
      isRoman: Boolean(session.isRoman),
      includePrefacePages: Boolean(session.includePrefacePages),
      totalPrefacePages: session.totalPrefacePages ? Number(session.totalPrefacePages) : undefined
    }
    
    updatedBook.readHistory.push(newSession)
    recalculateBookProgress(updatedBook)
    await saveBook(updatedBook)
  }

  const updateReadSession = async (
    bookId: number | string,
    sessionIdOrIndex: string | number,
    updatedData: {
      date: string
      pagesAdded?: number
      duration?: number | null
      startPage?: number
      endPage?: number
      startPageRaw?: string
      endPageRaw?: string
      displayRange?: string
      isRoman?: boolean
      includePrefacePages?: boolean
      totalPrefacePages?: number
    }
  ) => {
    const book = books.value.find(b => String(b.id) === String(bookId))
    if (!book) return
    const updatedBook = JSON.parse(JSON.stringify(book))
    if (!Array.isArray(updatedBook.readHistory)) return

    let targetIdx = -1
    if (typeof sessionIdOrIndex === 'number') {
      targetIdx = sessionIdOrIndex
    } else {
      targetIdx = updatedBook.readHistory.findIndex((s: any) => s.id === sessionIdOrIndex)
    }

    if (targetIdx >= 0 && targetIdx < updatedBook.readHistory.length) {
      const existing = updatedBook.readHistory[targetIdx]
      const newPagesAdded = updatedData.pagesAdded !== undefined ? (Number(updatedData.pagesAdded) || 0) : existing.pagesAdded
      const startPage = updatedData.startPage !== undefined ? updatedData.startPage : existing.startPage
      let endPage = updatedData.endPage !== undefined ? updatedData.endPage : existing.endPage
      if (startPage !== undefined && startPage > 0 && updatedData.endPage === undefined && updatedData.pagesAdded !== undefined) {
        endPage = startPage + newPagesAdded - 1
      }

      updatedBook.readHistory[targetIdx] = {
        ...existing,
        ...updatedData,
        date: updatedData.date,
        pagesAdded: newPagesAdded,
        startPage,
        endPage,
        duration: updatedData.duration !== undefined ? updatedData.duration : null
      }
      recalculateBookProgress(updatedBook)
      await saveBook(updatedBook)
    }
  }

  const deleteReadSession = async (
    bookId: number | string,
    sessionIdOrIndex: string | number
  ) => {
    const book = books.value.find(b => String(b.id) === String(bookId))
    if (!book) return
    const updatedBook = JSON.parse(JSON.stringify(book))
    if (!Array.isArray(updatedBook.readHistory)) return

    let targetIdx = -1
    if (typeof sessionIdOrIndex === 'number') {
      targetIdx = sessionIdOrIndex
    } else {
      targetIdx = updatedBook.readHistory.findIndex((s: any) => s.id === sessionIdOrIndex)
    }

    if (targetIdx >= 0 && targetIdx < updatedBook.readHistory.length) {
      updatedBook.readHistory.splice(targetIdx, 1)
      recalculateBookProgress(updatedBook)
      await saveBook(updatedBook)
    }
  }

  return {
    books,
    isLoaded,
    isLoading,
    loadBooks,
    saveBook,
    saveBooks,
    deleteBook,
    updateTargets,
    recalculateBookProgress,
    addReadSession,
    updateReadSession,
    deleteReadSession,
    requestPersistentStorage
  }
}