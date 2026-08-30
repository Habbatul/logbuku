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

  const loadBooks = async () => {
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
        
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        let needsCleanup = false
        
        loadedBooks.forEach((b: any) => {
          if (b.readHistory && b.readHistory.length > 0) {
            const originalLen = b.readHistory.length
            b.readHistory = b.readHistory.filter((h: any) => new Date(h.date) >= sevenDaysAgo)
            if (b.readHistory.length !== originalLen) needsCleanup = true
          }
        })
        
        if (needsCleanup) {
          const cleanupTx = db.transaction(STORE_NAME, 'readwrite')
          const cleanupStore = cleanupTx.objectStore(STORE_NAME)
          loadedBooks.forEach((b: any) => cleanupStore.put(b))
        }

        books.value = loadedBooks.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1
          if (!a.isPinned && b.isPinned) return 1
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        })
      }
    } catch (error) {
      console.error("Gagal memuat buku:", error)
    }
  }

  const saveBook = async (bookData: any) => {
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
      
      tx.oncomplete = () => loadBooks()
    } catch (error) {
      console.error("Gagal menyimpan buku:", error)
    }
  }

  const saveBooks = async (booksList: any[]) => {
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

      tx.oncomplete = () => loadBooks()
    } catch (error) {
      console.error("Gagal menyimpan daftar buku:", error)
    }
  }

  const deleteBook = async (id: number) => {
    try {
      const db = await initDB()
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      store.delete(id)
      
      tx.oncomplete = () => loadBooks()
    } catch (error) {
      console.error("Gagal menghapus buku:", error)
    }
  }

  const updateTargets = async (selectedIds: number[]) => {
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
      
      tx.oncomplete = () => loadBooks()
    } catch (error) {
      console.error("Gagal update target:", error)
    }
  }

  return {
    books,
    loadBooks,
    saveBook,
    saveBooks,
    deleteBook,
    updateTargets
  }
}