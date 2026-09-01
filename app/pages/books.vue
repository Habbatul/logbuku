<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        <div class="mb-6">
            <BooksHeader @add-book="openCreateModal" />

            <BooksFilterBar v-model:search-query="searchQuery" v-model:selected-topic="selectedTopic"
                v-model:sort-by="sortBy" v-model:show-filters="showFilters" :unique-topics="uniqueTopics" />

            <BooksAdvancedFilters :show="showFilters" v-model:respect-pinned="respectPinned"
                v-model:hide-action-buttons="hideActionButtons" v-model:start-date="filterStartDate"
                v-model:end-date="filterEndDate" v-model:min-price="filterMinPrice" v-model:max-price="filterMaxPrice"
                v-model:min-pages="filterMinPages" v-model:max-pages="filterMaxPages"
                v-model:selected-author="selectedAuthor" v-model:selected-publisher="selectedPublisher"
                :unique-authors="uniqueAuthors" :unique-publishers="uniquePublishers" @reset="resetFilters" />
        </div>

        <BooksEmptyState v-if="filteredBooks.length === 0" />

        <div v-else>
            <div class="mb-4 flex items-center justify-between font-mono text-[11px] font-bold text-[#57534e]">
                <span>[MENAMPILKAN {{ filteredBooks.length }} DARI {{ books.length }} ARSIP BUKU]</span>
            </div>

            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                <BooksCard v-for="book in filteredBooks" :key="book.id" :book="book" :hide-action-buttons="hideActionButtons"
                    @toggle-pin="handleTogglePin" @edit="openEditModal" @open-progress="openProgressModal" />
            </div>
        </div>

        <BooksProgressModal :is-open="isProgressModalOpen" :book="selectedProgressBook"
            @close="isProgressModalOpen = false" @save="handleSaveProgress" />

        <BooksFormModal :is-open="isFormModalOpen" :edit-book="selectedEditBook" @close="isFormModalOpen = false"
            @save="handleSaveBook" @delete="handleDeleteBook" @import-json="handleImportJson" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { Book, BookFormData, SortOption } from '~/types/book'

const { books, loadBooks, saveBook, deleteBook } = useBooks()

const searchQuery = ref('')
const selectedTopic = ref('')
const selectedAuthor = ref('')
const selectedPublisher = ref('')
const sortBy = ref<SortOption>('default')
const showFilters = ref(false)
const respectPinned = ref(true)
const hideActionButtons = ref(false)

const filterStartDate = ref('')
const filterEndDate = ref('')
const filterMinPrice = ref<number | ''>('')
const filterMaxPrice = ref<number | ''>('')
const filterMinPages = ref<number | ''>('')
const filterMaxPages = ref<number | ''>('')

if (typeof window !== 'undefined') {
    const savedHideState = localStorage.getItem('booktracker_hide_buttons')
    if (savedHideState !== null) {
        hideActionButtons.value = savedHideState === 'true'
    }
}

watch(hideActionButtons, (newVal) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('booktracker_hide_buttons', String(newVal))
    }
})

const resetFilters = () => {
    filterStartDate.value = ''
    filterEndDate.value = ''
    filterMinPrice.value = ''
    filterMaxPrice.value = ''
    filterMinPages.value = ''
    filterMaxPages.value = ''
    selectedTopic.value = ''
    selectedAuthor.value = ''
    selectedPublisher.value = ''
    searchQuery.value = ''
    sortBy.value = 'default'
}

const isProgressModalOpen = ref(false)
const selectedProgressBook = ref<Book | null>(null)

const isFormModalOpen = ref(false)
const selectedEditBook = ref<Book | null>(null)

const openCreateModal = () => {
    selectedEditBook.value = null
    isFormModalOpen.value = true
}

const openEditModal = (book: Book) => {
    selectedEditBook.value = book
    isFormModalOpen.value = true
}

const openProgressModal = (book: Book) => {
    selectedProgressBook.value = book
    isProgressModalOpen.value = true
}

const handleTogglePin = async (book: Book) => {
    book.isPinned = !book.isPinned
    await saveBook(book)
}

const handleSaveBook = async (formData: BookFormData) => {
    if (selectedEditBook.value) {
        const updatedBook: Book = {
            ...selectedEditBook.value,
            ...formData,
            topic: formData.topic || [],
            pagesRead: formData.pagesRead || 0,
            totalPages: formData.totalPages || 0,
            price: formData.price || 0
        }
        if (updatedBook.pagesRead > 0 && (!updatedBook.readHistory || updatedBook.readHistory.length === 0)) {
            const initialDate = updatedBook.date ? new Date(updatedBook.date).toISOString() : new Date().toISOString()
            updatedBook.readHistory = [{
                date: initialDate,
                pagesAdded: updatedBook.pagesRead,
                startPage: 0,
                endPage: updatedBook.pagesRead
            }]
        }
        if (updatedBook.pagesRead >= (updatedBook.totalPages || 0) && (updatedBook.totalPages || 0) > 0) {
            if (!updatedBook.completedAt) {
                updatedBook.completedAt = updatedBook.date ? new Date(updatedBook.date).toISOString() : new Date().toISOString()
            }
        } else {
            delete (updatedBook as any).completedAt
        }
        await saveBook(updatedBook)
    } else {
        const newBook: any = {
            ...formData,
            topic: formData.topic || [],
            pagesRead: formData.pagesRead || 0,
            totalPages: formData.totalPages || 0,
            price: formData.price || 0,
            isPinned: false,
            isTarget: false
        }
        if (newBook.pagesRead > 0) {
            const initialDate = newBook.date ? new Date(newBook.date).toISOString() : new Date().toISOString()
            newBook.readHistory = [{
                date: initialDate,
                pagesAdded: newBook.pagesRead,
                startPage: 0,
                endPage: newBook.pagesRead
            }]
        }
        if (newBook.pagesRead >= (newBook.totalPages || 0) && (newBook.totalPages || 0) > 0) {
            newBook.completedAt = newBook.date ? new Date(newBook.date).toISOString() : new Date().toISOString()
        }
        await saveBook(newBook)
    }
    isFormModalOpen.value = false
}

const handleDeleteBook = async (id: string | number) => {
    await deleteBook(Number(id))
    isFormModalOpen.value = false
}

const handleImportJson = async (newBooks: Partial<Book>[]) => {
    for (const item of newBooks) {
        const bookToSave: any = { ...item }
        if (bookToSave.pagesRead > 0 && (!bookToSave.readHistory || bookToSave.readHistory.length === 0)) {
            const initialDate = bookToSave.date ? new Date(bookToSave.date).toISOString() : new Date().toISOString()
            bookToSave.readHistory = [{
                date: initialDate,
                pagesAdded: bookToSave.pagesRead,
                startPage: 0,
                endPage: bookToSave.pagesRead
            }]
        }
        if (bookToSave.pagesRead >= (bookToSave.totalPages || 0) && (bookToSave.totalPages || 0) > 0) {
            bookToSave.completedAt = bookToSave.date ? new Date(bookToSave.date).toISOString() : new Date().toISOString()
        }
        await saveBook(bookToSave)
    }
    isFormModalOpen.value = false
}

const handleSaveProgress = async ({ book, newPages, date }: { book: Book; newPages: number; date?: string }) => {
    const oldPages = book.pagesRead || 0
    const pagesAdded = newPages - oldPages
    const updatedBook = { ...book, pagesRead: newPages }
    updatedBook.readHistory = updatedBook.readHistory ? [...updatedBook.readHistory] : []

    let sessionDate: Date
    if (date) {
        const todayStr = new Date().toISOString().split('T')[0]
        if (date === todayStr) {
            sessionDate = new Date()
        } else {
            const [y, m, d] = date.split('-').map(Number)
            sessionDate = new Date(y, m - 1, d, 12, 0, 0)
        }
    } else {
        sessionDate = new Date()
    }

    if (pagesAdded > 0) {
        const oneHour = 60 * 60 * 1000
        const lastSessionIndex = updatedBook.readHistory.length - 1
        let isMerged = false

        if (lastSessionIndex >= 0) {
            const lastSession = updatedBook.readHistory[lastSessionIndex]
            const lastSessionTime = new Date(lastSession.date).getTime()
            const lastSessionDateStr = new Date(lastSession.date).toISOString().split('T')[0]
            const sessionDateStr = sessionDate.toISOString().split('T')[0]

            if (lastSessionDateStr === sessionDateStr && Math.abs(sessionDate.getTime() - lastSessionTime) <= oneHour) {
                updatedBook.readHistory[lastSessionIndex].date = sessionDate.toISOString()
                updatedBook.readHistory[lastSessionIndex].pagesAdded += pagesAdded
                updatedBook.readHistory[lastSessionIndex].endPage = newPages
                isMerged = true
            }
        }
        if (!isMerged) {
            updatedBook.readHistory.push({
                date: sessionDate.toISOString(),
                pagesAdded: pagesAdded,
                startPage: oldPages,
                endPage: newPages
            })
        }
    } else if (pagesAdded < 0) {
        let deficit = Math.abs(pagesAdded)
        if (updatedBook.readHistory.length > 0) {
            for (let i = updatedBook.readHistory.length - 1; i >= 0; i--) {
                if (deficit <= 0) break
                const session = updatedBook.readHistory[i]
                if (session.pagesAdded <= deficit) {
                    deficit -= session.pagesAdded
                    updatedBook.readHistory.splice(i, 1)
                } else {
                    session.pagesAdded -= deficit
                    session.endPage -= deficit
                    deficit = 0
                }
            }
        }
    } else {
        // pagesAdded === 0 (user changed the reading date of the latest session or added initial history)
        if (date && updatedBook.readHistory.length > 0) {
            const lastSessionIndex = updatedBook.readHistory.length - 1
            updatedBook.readHistory[lastSessionIndex].date = sessionDate.toISOString()
        } else if (newPages > 0 && updatedBook.readHistory.length === 0) {
            updatedBook.readHistory.push({
                date: sessionDate.toISOString(),
                pagesAdded: newPages,
                startPage: 0,
                endPage: newPages
            })
        }
    }

    if (updatedBook.pagesRead >= (updatedBook.totalPages || 0) && (updatedBook.totalPages || 0) > 0) {
        updatedBook.completedAt = sessionDate.toISOString()
    } else {
        delete (updatedBook as any).completedAt
    }

    await saveBook(updatedBook)
    isProgressModalOpen.value = false
}

const uniqueTopics = computed(() => {
    const topics = new Set<string>()
    books.value.forEach((b: Book) => {
        if (Array.isArray(b.topic)) {
            b.topic.forEach((t: string) => topics.add(t))
        }
    })
    return Array.from(topics).sort()
})

const uniqueAuthors = computed(() => {
    const authors = new Set<string>()
    books.value.forEach((b: Book) => {
        if (b.author && b.author.trim()) {
            authors.add(b.author.trim())
        }
    })
    return Array.from(authors).sort()
})

const uniquePublishers = computed(() => {
    const publishers = new Set<string>()
    books.value.forEach((b: Book) => {
        if (b.publisher && b.publisher.trim()) {
            publishers.add(b.publisher.trim())
        }
    })
    return Array.from(publishers).sort()
})

const filteredBooks = computed(() => {
    const result = books.value.filter((book: Book) => {
        const query = searchQuery.value.toLowerCase().trim()
        const matchSearch = query
            ? book.title.toLowerCase().includes(query) ||
              (Boolean(book.author) && book.author!.toLowerCase().includes(query)) ||
              (Boolean(book.publisher) && book.publisher!.toLowerCase().includes(query))
            : true

        const matchTopic = selectedTopic.value
            ? Array.isArray(book.topic) && book.topic.includes(selectedTopic.value)
            : true

        const matchAuthor = selectedAuthor.value
            ? book.author === selectedAuthor.value
            : true

        const matchPublisher = selectedPublisher.value
            ? book.publisher === selectedPublisher.value
            : true

        let matchDate = true
        const bookDate = book.date || book.createdAt || ''
        if (filterStartDate.value && bookDate < filterStartDate.value) matchDate = false
        if (filterEndDate.value && bookDate > filterEndDate.value) matchDate = false

        let matchPrice = true
        const bookPrice = book.price || 0
        if (filterMinPrice.value !== '' && bookPrice < filterMinPrice.value) matchPrice = false
        if (filterMaxPrice.value !== '' && bookPrice > filterMaxPrice.value) matchPrice = false

        let matchPages = true
        const bookPages = book.totalPages || 0
        if (filterMinPages.value !== '' && bookPages < filterMinPages.value) matchPages = false
        if (filterMaxPages.value !== '' && bookPages > filterMaxPages.value) matchPages = false

        return matchSearch && matchTopic && matchAuthor && matchPublisher && matchDate && matchPrice && matchPages
    })

    result.sort((a: Book, b: Book) => {
        if (respectPinned.value) {
            if (a.isPinned && !b.isPinned) return -1
            if (!a.isPinned && b.isPinned) return 1
        }

        if (sortBy.value === 'terbaru') {
            return new Date(b.date || b.createdAt || '').getTime() - new Date(a.date || a.createdAt || '').getTime()
        }
        if (sortBy.value === 'terlama') {
            return new Date(a.date || a.createdAt || '').getTime() - new Date(b.date || b.createdAt || '').getTime()
        }
        if (sortBy.value === 'harga_tinggi') {
            return (b.price || 0) - (a.price || 0)
        }
        if (sortBy.value === 'harga_rendah') {
            return (a.price || 0) - (b.price || 0)
        }

        return 0
    })

    return result
})

onMounted(() => {
    loadBooks()
})
</script>