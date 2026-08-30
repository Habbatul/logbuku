<template>
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-300 space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200/80 pb-6">
            <div class="min-w-0">
                <div class="mb-2 flex items-center gap-2">
                    <NuxtLink to="/" class="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Dashboard
                    </NuxtLink>
                    <span class="text-gray-300">/</span>
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Penulis</span>
                </div>

                <h1 class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    Manajemen Penulis
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Kelola daftar penulis dan relasi karya buku Anda.
                </p>
            </div>

            <div class="flex shrink-0 items-center gap-2.5">
                <button type="button" @click="openAddAuthorModal"
                    class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/15">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    Tambah Penulis
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-gray-200/80 bg-white p-4">
                <span class="text-xs font-medium text-gray-500">Total Penulis</span>
                <p class="mt-1 text-2xl font-bold text-gray-950">{{ allAuthorsList.length }}</p>
            </div>
            <div class="rounded-xl border border-gray-200/80 bg-white p-4">
                <span class="text-xs font-medium text-gray-500">Buku Terhubung</span>
                <p class="mt-1 text-2xl font-bold text-emerald-600">{{ booksWithAuthorCount }}</p>
            </div>
            <div class="col-span-2 sm:col-span-1 rounded-xl border border-gray-200/80 bg-white p-4">
                <span class="text-xs font-medium text-gray-500">Buku Tanpa Penulis</span>
                <p class="mt-1 text-2xl font-bold text-gray-400">{{ booksWithoutAuthorCount }}</p>
            </div>
        </div>

        <div class="relative">
            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <svg class="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                    stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </div>
            <input v-model="searchQuery" type="text" placeholder="Cari nama penulis..."
                class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5 shadow-xs" />
        </div>

        <div v-if="filteredAuthors.length === 0"
            class="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <svg class="mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
            <h3 class="mt-3 text-sm font-semibold text-gray-900">Belum ada penulis</h3>
            <p class="mt-1 text-xs text-gray-500">
                Tambahkan nama penulis atau tentukan penulis pada form buku.
            </p>
            <button type="button" @click="openAddAuthorModal"
                class="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black">
                Tambah Penulis Pertama
            </button>
        </div>

        <div v-else class="space-y-3">
            <div v-for="author in filteredAuthors" :key="author.name"
                class="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs transition-shadow duration-200 hover:shadow-sm">
                <div class="flex cursor-pointer select-none items-center justify-between gap-3 p-4 sm:p-5"
                    @click="toggleAccordion(author.name)">
                    <div class="flex min-w-0 items-center gap-3">
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 font-bold text-sm">
                            {{ author.name.charAt(0).toUpperCase() }}
                        </div>

                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 class="truncate text-sm font-bold text-gray-900 sm:text-base">
                                    {{ author.name }}
                                </h3>
                                <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 shrink-0">
                                    {{ author.books.length }} buku
                                </span>
                            </div>
                            <p class="mt-0.5 text-xs text-gray-400 truncate">
                                {{ author.books.length > 0 ? author.books.map(b => b.title).join(', ') : 'Belum ada buku terhubung' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex shrink-0 items-center gap-2">
                        <div class="flex items-center gap-1" @click.stop>
                            <button type="button" @click="openRenameModal(author.name)" title="Ubah Nama Penulis"
                                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                            </button>
                            <button type="button" @click="confirmDeleteAuthor(author.name)" title="Hapus Penulis"
                                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                            </button>
                        </div>

                        <button type="button" aria-label="Toggle accordion"
                            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-transform duration-200"
                            :class="expandedAuthors.includes(author.name) ? 'rotate-180 text-gray-900' : ''">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div v-show="expandedAuthors.includes(author.name)"
                    class="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-5">
                    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Daftar Karya Buku ({{ author.books.length }})
                        </span>

                        <button type="button" @click="openAssignModal(author.name)"
                            class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-2xs transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            Hubungkan Buku Lain
                        </button>
                    </div>

                    <div v-if="author.books.length === 0"
                        class="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-xs text-gray-400">
                        Belum ada buku yang terhubung dengan penulis ini.
                        <button type="button" @click="openAssignModal(author.name)"
                            class="block mx-auto mt-2 cursor-pointer font-semibold text-emerald-600 hover:text-emerald-800">
                            + Pilih buku untuk dihubungkan
                        </button>
                    </div>

                    <div v-else class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="book in author.books" :key="book.id"
                            class="group relative flex items-center gap-3 rounded-lg border border-gray-200/80 bg-white p-3 shadow-2xs transition-all hover:border-gray-300 hover:shadow-xs">
                            <div class="h-14 w-10 shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-200/70">
                                <img v-if="book.imageUrl" :src="book.imageUrl" class="h-full w-full object-cover" />
                                <div v-else class="flex h-full w-full items-center justify-center text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="1.8">
                                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    </svg>
                                </div>
                            </div>

                            <div class="min-w-0 flex-1">
                                <h4 class="truncate text-xs font-bold text-gray-900" :title="book.title">
                                    {{ book.title }}
                                </h4>
                                <p v-if="book.publisher" class="truncate text-[11px] text-gray-500">
                                    {{ book.publisher }}
                                </p>
                                <div class="mt-1 flex items-center gap-2 text-[10px] text-gray-400">
                                    <span>{{ book.totalPages }} hal</span>
                                    <span>•</span>
                                    <span>{{ formatCurrency(book.price) }}</span>
                                </div>
                            </div>

                            <button type="button" @click="unassignBook(book)" title="Lepas buku dari penulis ini"
                                class="shrink-0 cursor-pointer rounded p-1.5 text-gray-400 opacity-80 transition-all hover:bg-red-50 hover:text-red-600 focus:opacity-100 group-hover:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-950/40 backdrop-blur-[2px]" @click="isAddModalOpen = false"></div>
            <div class="relative w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-xl animate-in zoom-in-95">
                <h3 class="text-sm font-bold text-gray-900">Tambah Penulis Baru</h3>
                <p class="mt-1 text-xs text-gray-500">Masukkan nama penulis yang ingin ditambahkan.</p>

                <form @submit.prevent="saveNewAuthor" class="mt-4 space-y-4">
                    <input v-model="newAuthorName" type="text" required placeholder="Nama penulis..."
                        class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />

                    <div class="flex justify-end gap-2">
                        <button type="button" @click="isAddModalOpen = false"
                            class="cursor-pointer rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit"
                            class="cursor-pointer rounded-md bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="isRenameModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-950/40 backdrop-blur-[2px]" @click="isRenameModalOpen = false"></div>
            <div class="relative w-full max-w-sm rounded-xl border border-gray-200 bg-white p-5 shadow-xl animate-in zoom-in-95">
                <h3 class="text-sm font-bold text-gray-900">Ubah Nama Penulis</h3>
                <p class="mt-1 text-xs text-gray-500">Semua buku karya penulis ini akan otomatis diperbarui.</p>

                <form @submit.prevent="saveRenamedAuthor" class="mt-4 space-y-4">
                    <input v-model="renameAuthorNewName" type="text" required placeholder="Nama baru..."
                        class="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />

                    <div class="flex justify-end gap-2">
                        <button type="button" @click="isRenameModalOpen = false"
                            class="cursor-pointer rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                            Batal
                        </button>
                        <button type="submit"
                            class="cursor-pointer rounded-md bg-gray-900 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-black">
                            Perbarui
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <AuthorsAssignBooksModal
            :is-open="isAssignModalOpen"
            :author-name="activeAuthorName"
            :available-books="assignableBooks"
            @close="isAssignModalOpen = false"
            @assign="handleBulkAssign"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Book } from '~/types/book'

const { books, loadBooks, saveBook, saveBooks } = useBooks()

const searchQuery = ref('')
const expandedAuthors = ref<string[]>([])
const customAuthors = ref<string[]>([])

const isAddModalOpen = ref(false)
const newAuthorName = ref('')

const isRenameModalOpen = ref(false)
const renameAuthorOldName = ref('')
const renameAuthorNewName = ref('')

const isAssignModalOpen = ref(false)
const activeAuthorName = ref('')

if (typeof window !== 'undefined') {
    try {
        const saved = localStorage.getItem('booktracker_custom_authors')
        if (saved) {
            customAuthors.value = JSON.parse(saved)
        }
    } catch (e) {
        console.error('Failed to parse custom authors', e)
    }
}

const saveCustomAuthors = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('booktracker_custom_authors', JSON.stringify(customAuthors.value))
    }
}

const allAuthorsList = computed(() => {
    const set = new Set<string>()
    books.value.forEach((b: Book) => {
        if (b.author && b.author.trim()) {
            set.add(b.author.trim())
        }
    })
    customAuthors.value.forEach(a => {
        if (a && a.trim()) set.add(a.trim())
    })
    return Array.from(set).sort()
})

const booksWithAuthorCount = computed(() => {
    return books.value.filter((b: Book) => Boolean(b.author && b.author.trim())).length
})

const booksWithoutAuthorCount = computed(() => {
    return books.value.filter((b: Book) => !b.author || !b.author.trim()).length
})

const authorsWithBooks = computed(() => {
    return allAuthorsList.value.map(name => {
        const matchingBooks = books.value.filter(
            (b: Book) => b.author && b.author.trim().toLowerCase() === name.toLowerCase()
        )
        return {
            name,
            books: matchingBooks
        }
    })
})

const filteredAuthors = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return authorsWithBooks.value
    return authorsWithBooks.value.filter(a => a.name.toLowerCase().includes(q))
})

const toggleAccordion = (name: string) => {
    const idx = expandedAuthors.value.indexOf(name)
    if (idx >= 0) {
        expandedAuthors.value.splice(idx, 1)
    } else {
        expandedAuthors.value.push(name)
    }
}

const openAddAuthorModal = () => {
    newAuthorName.value = ''
    isAddModalOpen.value = true
}

const saveNewAuthor = () => {
    const trimmed = newAuthorName.value.trim()
    if (trimmed) {
        if (!customAuthors.value.includes(trimmed)) {
            customAuthors.value.push(trimmed)
            saveCustomAuthors()
        }
        if (!expandedAuthors.value.includes(trimmed)) {
            expandedAuthors.value.push(trimmed)
        }
    }
    isAddModalOpen.value = false
}

const openRenameModal = (name: string) => {
    renameAuthorOldName.value = name
    renameAuthorNewName.value = name
    isRenameModalOpen.value = true
}

const saveRenamedAuthor = async () => {
    const oldName = renameAuthorOldName.value.trim()
    const newName = renameAuthorNewName.value.trim()

    if (newName && oldName !== newName) {
        const cIdx = customAuthors.value.indexOf(oldName)
        if (cIdx >= 0) {
            customAuthors.value[cIdx] = newName
            saveCustomAuthors()
        } else if (!customAuthors.value.includes(newName)) {
            customAuthors.value.push(newName)
            saveCustomAuthors()
        }

        const eIdx = expandedAuthors.value.indexOf(oldName)
        if (eIdx >= 0) {
            expandedAuthors.value[eIdx] = newName
        }

        const booksToUpdate = books.value
            .filter((b: Book) => b.author && b.author.trim().toLowerCase() === oldName.toLowerCase())
            .map((b: Book) => ({ ...b, author: newName }))

        if (booksToUpdate.length > 0) {
            await saveBooks(booksToUpdate)
        }
    }
    isRenameModalOpen.value = false
}

const confirmDeleteAuthor = async (name: string) => {
    if (confirm(`Hapus penulis "${name}"? Buku yang terhubung tidak akan dihapus, tetapi relasi penulisnya akan dikosongkan.`)) {
        customAuthors.value = customAuthors.value.filter(a => a !== name)
        saveCustomAuthors()

        const eIdx = expandedAuthors.value.indexOf(name)
        if (eIdx >= 0) expandedAuthors.value.splice(eIdx, 1)

        const booksToUpdate = books.value
            .filter((b: Book) => b.author && b.author.trim().toLowerCase() === name.toLowerCase())
            .map((b: Book) => ({ ...b, author: '' }))

        if (booksToUpdate.length > 0) {
            await saveBooks(booksToUpdate)
        }
    }
}

const unassignBook = async (book: Book) => {
    const updated = { ...book, author: '' }
    await saveBook(updated)
}

const openAssignModal = (name: string) => {
    activeAuthorName.value = name
    isAssignModalOpen.value = true
}

const assignableBooks = computed(() => {
    if (!activeAuthorName.value) return []
    return books.value.filter(
        (b: Book) => !b.author || b.author.trim().toLowerCase() !== activeAuthorName.value.toLowerCase()
    )
})

const handleBulkAssign = async (selectedIds: (string | number)[]) => {
    const targetAuthor = activeAuthorName.value
    const booksToUpdate = books.value
        .filter((b: Book) => selectedIds.includes(b.id!))
        .map((b: Book) => ({ ...b, author: targetAuthor }))

    if (booksToUpdate.length > 0) {
        await saveBooks(booksToUpdate)
    }

    if (!expandedAuthors.value.includes(targetAuthor)) {
        expandedAuthors.value.push(targetAuthor)
    }

    isAssignModalOpen.value = false
}

onMounted(() => {
    loadBooks()
})
</script>
