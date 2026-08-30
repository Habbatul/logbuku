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
                    <span class="text-xs font-semibold uppercase tracking-wider text-gray-400">Penerbit</span>
                </div>

                <h1 class="text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
                    Manajemen Penerbit
                </h1>
                <p class="mt-1 text-sm text-gray-500">
                    Kelola daftar penerbit dan relasi buku yang diterbitkan.
                </p>
            </div>

            <div class="flex shrink-0 items-center gap-2.5">
                <button type="button" @click="openAddPublisherModal"
                    class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/15">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    Tambah Penerbit
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="rounded-xl border border-gray-200/80 bg-white p-4">
                <span class="text-xs font-medium text-gray-500">Total Penerbit</span>
                <p class="mt-1 text-2xl font-bold text-gray-950">{{ allPublishersList.length }}</p>
            </div>
            <div class="rounded-xl border border-gray-200/80 bg-white p-4">
                <span class="text-xs font-medium text-gray-500">Buku Terhubung</span>
                <p class="mt-1 text-2xl font-bold text-blue-600">{{ booksWithPublisherCount }}</p>
            </div>
            <div class="col-span-2 sm:col-span-1 rounded-xl border border-gray-200/80 bg-white p-4">
                <span class="text-xs font-medium text-gray-500">Buku Tanpa Penerbit</span>
                <p class="mt-1 text-2xl font-bold text-gray-400">{{ booksWithoutPublisherCount }}</p>
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
            <input v-model="searchQuery" type="text" placeholder="Cari nama penerbit..."
                class="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5 shadow-xs" />
        </div>

        <div v-if="filteredPublishers.length === 0"
            class="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <svg class="mx-auto text-gray-400" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="1.5">
                <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                <path d="M9 22v-4h6v4" />
                <path d="M8 6h.01" />
                <path d="M16 6h.01" />
            </svg>
            <h3 class="mt-3 text-sm font-semibold text-gray-900">Belum ada penerbit</h3>
            <p class="mt-1 text-xs text-gray-500">
                Tambahkan nama penerbit atau tentukan penerbit pada form buku.
            </p>
            <button type="button" @click="openAddPublisherModal"
                class="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black">
                Tambah Penerbit Pertama
            </button>
        </div>

        <div v-else class="space-y-3">
            <div v-for="pub in filteredPublishers" :key="pub.name"
                class="overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-xs transition-shadow duration-200 hover:shadow-sm">
                <div class="flex cursor-pointer select-none items-center justify-between gap-3 p-4 sm:p-5"
                    @click="toggleAccordion(pub.name)">
                    <div class="flex min-w-0 items-center gap-3">
                        <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-sm">
                            {{ pub.name.charAt(0).toUpperCase() }}
                        </div>

                        <div class="min-w-0">
                            <div class="flex items-center gap-2">
                                <h3 class="truncate text-sm font-bold text-gray-900 sm:text-base">
                                    {{ pub.name }}
                                </h3>
                                <span class="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 shrink-0">
                                    {{ pub.books.length }} buku
                                </span>
                            </div>
                            <p class="mt-0.5 text-xs text-gray-400 truncate">
                                {{ pub.books.length > 0 ? pub.books.map(b => b.title).join(', ') : 'Belum ada buku terhubung' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex shrink-0 items-center gap-2">
                        <div class="flex items-center gap-1" @click.stop>
                            <button type="button" @click="openRenameModal(pub.name)" title="Ubah Nama Penerbit"
                                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                            </button>
                            <button type="button" @click="confirmDeletePublisher(pub.name)" title="Hapus Penerbit"
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
                            :class="expandedPublishers.includes(pub.name) ? 'rotate-180 text-gray-900' : ''">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div v-show="expandedPublishers.includes(pub.name)"
                    class="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-5">
                    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <span class="text-xs font-semibold uppercase tracking-wider text-gray-500">
                            Daftar Buku Terhubung ({{ pub.books.length }})
                        </span>

                        <button type="button" @click="openAssignModal(pub.name)"
                            class="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-2xs transition-colors hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            Hubungkan Buku Lain
                        </button>
                    </div>

                    <div v-if="pub.books.length === 0"
                        class="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-center text-xs text-gray-400">
                        Belum ada buku yang terhubung dengan penerbit ini.
                        <button type="button" @click="openAssignModal(pub.name)"
                            class="block mx-auto mt-2 cursor-pointer font-semibold text-blue-600 hover:text-blue-800">
                            + Pilih buku untuk dihubungkan
                        </button>
                    </div>

                    <div v-else class="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="book in pub.books" :key="book.id"
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
                                <p v-if="book.author" class="truncate text-[11px] text-gray-500">
                                    {{ book.author }}
                                </p>
                                <div class="mt-1 flex items-center gap-2 text-[10px] text-gray-400">
                                    <span>{{ book.totalPages }} hal</span>
                                    <span>•</span>
                                    <span>{{ formatCurrency(book.price) }}</span>
                                </div>
                            </div>

                            <button type="button" @click="unassignBook(book)" title="Lepas buku dari penerbit ini"
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
                <h3 class="text-sm font-bold text-gray-900">Tambah Penerbit Baru</h3>
                <p class="mt-1 text-xs text-gray-500">Masukkan nama penerbit yang ingin ditambahkan.</p>

                <form @submit.prevent="saveNewPublisher" class="mt-4 space-y-4">
                    <input v-model="newPublisherName" type="text" required placeholder="Nama penerbit..."
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
                <h3 class="text-sm font-bold text-gray-900">Ubah Nama Penerbit</h3>
                <p class="mt-1 text-xs text-gray-500">Semua buku di bawah penerbit ini akan otomatis diperbarui.</p>

                <form @submit.prevent="saveRenamedPublisher" class="mt-4 space-y-4">
                    <input v-model="renamePublisherNewName" type="text" required placeholder="Nama baru..."
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

        <PublishersAssignBooksModal
            :is-open="isAssignModalOpen"
            :publisher-name="activePublisherName"
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
const expandedPublishers = ref<string[]>([])
const customPublishers = ref<string[]>([])

const isAddModalOpen = ref(false)
const newPublisherName = ref('')

const isRenameModalOpen = ref(false)
const renamePublisherOldName = ref('')
const renamePublisherNewName = ref('')

const isAssignModalOpen = ref(false)
const activePublisherName = ref('')

if (typeof window !== 'undefined') {
    try {
        const saved = localStorage.getItem('booktracker_custom_publishers')
        if (saved) {
            customPublishers.value = JSON.parse(saved)
        }
    } catch (e) {
        console.error('Failed to parse custom publishers', e)
    }
}

const saveCustomPublishers = () => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('booktracker_custom_publishers', JSON.stringify(customPublishers.value))
    }
}

const allPublishersList = computed(() => {
    const set = new Set<string>()
    books.value.forEach((b: Book) => {
        if (b.publisher && b.publisher.trim()) {
            set.add(b.publisher.trim())
        }
    })
    customPublishers.value.forEach(p => {
        if (p && p.trim()) set.add(p.trim())
    })
    return Array.from(set).sort()
})

const booksWithPublisherCount = computed(() => {
    return books.value.filter((b: Book) => Boolean(b.publisher && b.publisher.trim())).length
})

const booksWithoutPublisherCount = computed(() => {
    return books.value.filter((b: Book) => !b.publisher || !b.publisher.trim()).length
})

const publishersWithBooks = computed(() => {
    return allPublishersList.value.map(name => {
        const matchingBooks = books.value.filter(
            (b: Book) => b.publisher && b.publisher.trim().toLowerCase() === name.toLowerCase()
        )
        return {
            name,
            books: matchingBooks
        }
    })
})

const filteredPublishers = computed(() => {
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return publishersWithBooks.value
    return publishersWithBooks.value.filter(p => p.name.toLowerCase().includes(q))
})

const toggleAccordion = (name: string) => {
    const idx = expandedPublishers.value.indexOf(name)
    if (idx >= 0) {
        expandedPublishers.value.splice(idx, 1)
    } else {
        expandedPublishers.value.push(name)
    }
}

const openAddPublisherModal = () => {
    newPublisherName.value = ''
    isAddModalOpen.value = true
}

const saveNewPublisher = () => {
    const trimmed = newPublisherName.value.trim()
    if (trimmed) {
        if (!customPublishers.value.includes(trimmed)) {
            customPublishers.value.push(trimmed)
            saveCustomPublishers()
        }
        if (!expandedPublishers.value.includes(trimmed)) {
            expandedPublishers.value.push(trimmed)
        }
    }
    isAddModalOpen.value = false
}

const openRenameModal = (name: string) => {
    renamePublisherOldName.value = name
    renamePublisherNewName.value = name
    isRenameModalOpen.value = true
}

const saveRenamedPublisher = async () => {
    const oldName = renamePublisherOldName.value.trim()
    const newName = renamePublisherNewName.value.trim()

    if (newName && oldName !== newName) {
        const cIdx = customPublishers.value.indexOf(oldName)
        if (cIdx >= 0) {
            customPublishers.value[cIdx] = newName
            saveCustomPublishers()
        } else if (!customPublishers.value.includes(newName)) {
            customPublishers.value.push(newName)
            saveCustomPublishers()
        }

        const eIdx = expandedPublishers.value.indexOf(oldName)
        if (eIdx >= 0) {
            expandedPublishers.value[eIdx] = newName
        }

        const booksToUpdate = books.value
            .filter((b: Book) => b.publisher && b.publisher.trim().toLowerCase() === oldName.toLowerCase())
            .map((b: Book) => ({ ...b, publisher: newName }))

        if (booksToUpdate.length > 0) {
            await saveBooks(booksToUpdate)
        }
    }
    isRenameModalOpen.value = false
}

const confirmDeletePublisher = async (name: string) => {
    if (confirm(`Hapus penerbit "${name}"? Buku yang terhubung tidak akan dihapus, tetapi relasi penerbitnya akan dikosongkan.`)) {
        customPublishers.value = customPublishers.value.filter(p => p !== name)
        saveCustomPublishers()

        const eIdx = expandedPublishers.value.indexOf(name)
        if (eIdx >= 0) expandedPublishers.value.splice(eIdx, 1)

        const booksToUpdate = books.value
            .filter((b: Book) => b.publisher && b.publisher.trim().toLowerCase() === name.toLowerCase())
            .map((b: Book) => ({ ...b, publisher: '' }))

        if (booksToUpdate.length > 0) {
            await saveBooks(booksToUpdate)
        }
    }
}

const unassignBook = async (book: Book) => {
    const updated = { ...book, publisher: '' }
    await saveBook(updated)
}

const openAssignModal = (name: string) => {
    activePublisherName.value = name
    isAssignModalOpen.value = true
}

const assignableBooks = computed(() => {
    if (!activePublisherName.value) return []
    return books.value.filter(
        (b: Book) => !b.publisher || b.publisher.trim().toLowerCase() !== activePublisherName.value.toLowerCase()
    )
})

const handleBulkAssign = async (selectedIds: (string | number)[]) => {
    const targetPublisher = activePublisherName.value
    const booksToUpdate = books.value
        .filter((b: Book) => selectedIds.includes(b.id!))
        .map((b: Book) => ({ ...b, publisher: targetPublisher }))

    if (booksToUpdate.length > 0) {
        await saveBooks(booksToUpdate)
    }

    if (!expandedPublishers.value.includes(targetPublisher)) {
        expandedPublishers.value.push(targetPublisher)
    }

    isAssignModalOpen.value = false
}

onMounted(() => {
    loadBooks()
})
</script>
