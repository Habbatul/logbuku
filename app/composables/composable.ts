import { ref } from 'vue'

const DB_NAME = 'BookTrackerDB'
const STORE_NAME = 'books'
const DB_VERSION = 3

export const useBooks = () => {
  const books = ref<any[]>([])

  const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)
      
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
        }
      }
      
      request.onsuccess = (event: any) => resolve(event.target.result)
      request.onerror = (event: any) => reject(event.target.error)
    })
  }

  const loadBooks = (): Promise<any[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await initDB()
        const tx = db.transaction(STORE_NAME, 'readonly')
        const store = tx.objectStore(STORE_NAME)
        const request = store.getAll()
        
        request.onsuccess = () => {
          const loadedBooks = request.result || []
          
          loadedBooks.forEach((b: any) => {
            if (typeof b.topic === 'string') {
              b.topic = b.topic.trim() ? [b.topic.trim()] : []
            } else if (!b.topic) {
              b.topic = []
            }
            b.author = b.author ? String(b.author).trim() : ''
            b.publisher = b.publisher ? String(b.publisher).trim() : ''
          })
          
          books.value = loadedBooks.sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1
            if (!a.isPinned && b.isPinned) return 1
            return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
          })
          resolve(books.value)
        }
        request.onerror = (e) => reject(e)
      } catch (error) {
        console.error("Gagal memuat buku:", error)
        reject(error)
      }
    })
  }

  const recalculateBookProgress = (book: any) => {
    if (!Array.isArray(book.readHistory)) {
      book.readHistory = []
    }
    let runningPages = 0
    book.readHistory.forEach((s: any, idx: number) => {
      if (!s.id) {
        s.id = 'sess_' + (Date.now() + idx) + '_' + Math.random().toString(36).slice(2, 6)
      }
      s.pagesAdded = Number(s.pagesAdded) || 0
      s.startPage = runningPages
      s.endPage = runningPages + s.pagesAdded
      runningPages += s.pagesAdded
      if (s.duration === undefined) {
        s.duration = null
      }
    })
    
    book.pagesRead = runningPages
    if (book.totalPages > 0 && book.pagesRead >= book.totalPages) {
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
    session: { date: string; pagesAdded: number; duration?: number | null }
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
      startPage: 0,
      endPage: 0
    }
    
    updatedBook.readHistory.push(newSession)
    recalculateBookProgress(updatedBook)
    await saveBook(updatedBook)
  }

  const updateReadSession = async (
    bookId: number | string,
    sessionIdOrIndex: string | number,
    updatedData: { date: string; pagesAdded: number; duration?: number | null }
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
      updatedBook.readHistory[targetIdx] = {
        ...updatedBook.readHistory[targetIdx],
        date: updatedData.date,
        pagesAdded: Number(updatedData.pagesAdded) || 0,
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
    loadBooks,
    saveBook,
    saveBooks,
    deleteBook,
    updateTargets,
    recalculateBookProgress,
    addReadSession,
    updateReadSession,
    deleteReadSession
  }
}