<template>
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6">
            <div class="min-w-0">
                <div class="mb-3 flex items-center gap-2">
                    <NuxtLink to="/" class="btn-sunset-secondary inline-flex cursor-pointer items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white hover:bg-white/15 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        Dashboard
                    </NuxtLink>
                    <span class="text-xs text-sky-300 font-bold">/</span>
                    <span class="liquid-glass-pill inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-sky-300">
                        <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                        Penulis
                    </span>
                </div>

                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    Manajemen Penulis
                </h1>
                <p class="mt-1.5 max-w-3xl text-xs sm:text-sm leading-relaxed text-white">
                    Kelola daftar penulis dan relasi karya buku fisik dalam arsip koleksi Anda.
                </p>
            </div>

            <div class="flex shrink-0 items-center gap-2.5">
                <button type="button" @click="openAddAuthorModal"
                    class="btn-sunset-primary inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    Tambah Penulis
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
            <div class="surface-stat rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-white">Total Penulis</span>
                    <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-pink-400 shadow-[0_0_10px_rgba(244,114,182,0.8)]"></span>
                </div>
                <div class="flex items-baseline gap-1.5">
                    <span class="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-white">
                        {{ allAuthorsList.length }}
                    </span>
                    <span class="text-xs font-medium text-white">orang</span>
                </div>
            </div>

            <div class="surface-stat rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-white">Buku Terhubung</span>
                    <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                </div>
                <div class="flex items-baseline gap-1.5">
                    <span class="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-white">
                        {{ totalBooksWithAuthor }}
                    </span>
                    <span class="text-xs font-medium text-white">buku</span>
                </div>
            </div>

            <div class="surface-stat rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 col-span-2 sm:col-span-1">
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-white">Rata-rata Karya</span>
                    <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]"></span>
                </div>
                <div class="flex items-baseline gap-1.5">
                    <span class="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-white">
                        {{ avgBooksPerAuthor }}
                    </span>
                    <span class="text-xs font-medium text-white">buku/penulis</span>
                </div>
            </div>
        </div>

        <div class="space-y-2">
            <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sky-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>
                <input v-model="searchQuery" type="text" placeholder="Cari nama penulis..."
                    class="glass-input w-full py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-white placeholder:text-white/75 rounded-xl" />
            </div>

            <div v-if="searchQuery" class="flex items-center justify-between px-1">
                <span class="text-xs font-medium text-white">
                    Menampilkan <strong class="text-sky-300 tabular-nums">{{ filteredAuthors.length }}</strong> dari <strong class="text-sky-300 tabular-nums">{{ allAuthorsList.length }}</strong> penulis
                </span>
                <button type="button" @click="searchQuery = ''"
                    class="text-xs font-bold text-sky-300 hover:text-sky-200 hover:underline">
                    Reset Pencarian
                </button>
            </div>
        </div>

        <div v-if="filteredAuthors.length === 0"
            class="surface-card rounded-2xl p-10 sm:p-12 text-center space-y-4">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
            </div>
            <h3 class="text-base sm:text-lg font-bold tracking-tight text-white">
                {{ searchQuery ? 'Penulis Tidak Ditemukan' : 'Belum Ada Penulis Terdaftar' }}
            </h3>
            <p class="max-w-md mx-auto text-xs sm:text-sm text-white leading-relaxed font-medium">
                {{ searchQuery ? 'Tidak ada penulis yang sesuai dengan kata kunci pencarian Anda.' : 'Tambahkan nama penulis baru atau tentukan nama penulis pada form penambahan buku.' }}
            </p>
            <button v-if="!searchQuery" type="button" @click="openAddAuthorModal"
                class="btn-sunset-primary inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold">
                + Tambah Penulis Pertama
            </button>
            <button v-else type="button" @click="searchQuery = ''"
                class="btn-sunset-secondary inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white">
                Bersihkan Pencarian
            </button>
        </div>

        <div v-else class="space-y-3">
            <div v-for="author in filteredAuthors" :key="author.name"
                class="surface-card-interactive rounded-2xl overflow-hidden">
                <div class="flex cursor-pointer select-none items-center justify-between gap-3 p-4 sm:p-5 hover:bg-white/12 transition-all duration-200"
                    @click="toggleAccordion(author.name)">
                    <div class="flex min-w-0 items-center gap-3.5">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white font-bold text-base shadow-inner">
                            {{ author.name.charAt(0).toUpperCase() }}
                        </div>

                        <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <h3 class="truncate text-sm sm:text-base font-bold text-white">
                                    {{ author.name }}
                                </h3>
                                <span class="liquid-glass-pill px-2.5 py-0.5 text-xs font-bold tabular-nums text-white shrink-0">
                                    {{ author.books.length }} <span class="text-white font-normal">buku</span>
                                </span>
                            </div>
                            <p class="text-xs text-white truncate font-medium">
                                {{ author.books.length > 0 ? author.books.map(b => b.title).join(', ') : 'Belum ada buku terhubung' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex shrink-0 items-center gap-2">
                        <div class="flex items-center gap-1.5" @click.stop>
                            <button type="button" @click="openRenameModal(author.name)" title="Ubah Nama Penulis"
                                class="btn-sunset-secondary flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-white hover:scale-105 active:scale-95 transition-all focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                            </button>
                            <button type="button" @click="openDeleteAuthorModal(author.name)" title="Hapus Penulis"
                                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/35 hover:scale-105 active:scale-95 transition-all focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                            </button>
                        </div>

                        <button type="button" aria-label="Buka tutup daftar buku"
                            class="btn-sunset-secondary flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-white hover:scale-105 active:scale-95 transition-all focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="transition-transform duration-200"
                                :class="expandedAuthors.includes(author.name) ? 'rotate-180' : ''">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div v-show="expandedAuthors.includes(author.name)"
                    class="bg-white/[0.04] backdrop-blur-md p-4 sm:p-5 space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <span class="text-xs font-bold text-white">
                            Karya Buku Terhubung ({{ author.books.length }})
                        </span>

                        <button type="button" @click="openAssignModal(author.name)"
                            class="btn-sunset-primary inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            Hubungkan Buku Lain
                        </button>
                    </div>

                    <div v-if="author.books.length === 0"
                        class="rounded-xl bg-white/[0.06] p-6 text-center text-xs sm:text-sm text-white font-medium">
                        Belum ada buku yang terhubung dengan penulis ini
                        <button type="button" @click="openAssignModal(author.name)"
                            class="block mx-auto mt-2 cursor-pointer font-bold text-sky-300 hover:text-sky-200 hover:underline">
                            + Pilih Buku Untuk Dihubungkan
                        </button>
                    </div>

                    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="book in author.books" :key="book.id"
                            class="surface-card-interactive rounded-xl p-3 flex items-center gap-3 transition-colors duration-150 hover:bg-white/[0.10]">
                            <div class="h-14 w-10 shrink-0 overflow-hidden rounded-lg bg-white/10">
                                <img v-if="book.imageUrl" :src="book.imageUrl" class="h-full w-full object-cover" loading="lazy" />
                                <div v-else class="flex h-full w-full items-center justify-center text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    </svg>
                                </div>
                            </div>

                            <div class="min-w-0 flex-1">
                                <h4 class="truncate text-xs sm:text-sm font-semibold text-white" :title="book.title">
                                    {{ book.title }}
                                </h4>
                                <p v-if="book.publisher" class="truncate text-xs text-white font-normal">
                                    {{ book.publisher }}
                                </p>
                                <div class="mt-1 flex items-center gap-2 text-xs text-white">
                                    <span class="tabular-nums font-semibold text-white">{{ book.totalPages }} hal</span>
                                    <span>•</span>
                                    <span class="font-bold tabular-nums text-sky-300">{{ formatCurrency(book.price) }}</span>
                                </div>
                            </div>

                            <button type="button" @click="unassignBook(book)" title="Lepas buku dari penulis ini"
                                class="shrink-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
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

        <!-- Modal Tambah Penulis -->
        <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="isAddModalOpen = false"></div>
            <div class="liquid-glass-modal relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                <h3 class="text-base font-bold tracking-tight text-white">Tambah Penulis Baru</h3>
                <p class="mt-1 text-xs text-white leading-relaxed">Masukkan nama penulis yang ingin ditambahkan ke sistem.</p>

                <form @submit.prevent="saveNewAuthor" class="mt-4 space-y-4">
                    <input v-model="newAuthorName" type="text" required placeholder="Nama penulis..."
                        class="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/75" />

                    <div class="flex justify-end gap-2.5">
                        <button type="button" @click="isAddModalOpen = false"
                            class="btn-sunset-secondary rounded-xl px-4 py-2 text-xs font-semibold text-white">
                            Batal
                        </button>
                        <button type="submit"
                            class="btn-sunset-primary rounded-xl px-4 py-2 text-xs font-bold">
                            Simpan
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Modal Rename Penulis -->
        <div v-if="isRenameModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="isRenameModalOpen = false"></div>
            <div class="liquid-glass-modal relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                <h3 class="text-base font-bold tracking-tight text-white">Ubah Nama Penulis</h3>
                <p class="mt-1 text-xs text-white leading-relaxed">Semua buku karya penulis ini akan otomatis diperbarui.</p>

                <form @submit.prevent="saveRenamedAuthor" class="mt-4 space-y-4">
                    <input v-model="renameAuthorNewName" type="text" required placeholder="Nama baru penulis..."
                        class="glass-input w-full rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-white/75" />

                    <div class="flex justify-end gap-2.5">
                        <button type="button" @click="isRenameModalOpen = false"
                            class="btn-sunset-secondary rounded-xl px-4 py-2 text-xs font-semibold text-white">
                            Batal
                        </button>
                        <button type="submit"
                            class="btn-sunset-primary rounded-xl px-4 py-2 text-xs font-bold">
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

        <!-- Modal Hapus Penulis -->
        <div v-if="isDeleteAuthorModalOpen && authorToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="isDeleteAuthorModalOpen = false"></div>
            <div class="liquid-glass-modal relative w-full max-w-sm rounded-2xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
                <div class="flex items-center justify-between pb-3">
                    <h3 class="text-sm font-bold text-red-300">Hapus Penulis</h3>
                    <button type="button" @click="isDeleteAuthorModalOpen = false" class="text-sm font-bold text-white hover:text-rose-300 cursor-pointer">×</button>
                </div>
                <p class="text-xs text-white leading-relaxed">
                    Yakin ingin menghapus penulis <strong class="text-white font-bold">"{{ authorToDelete }}"</strong>? Buku yang terhubung tidak akan dihapus, tetapi relasi nama penulisnya akan dikosongkan.
                </p>
                <div class="flex justify-end gap-2.5 pt-2">
                    <button type="button" @click="isDeleteAuthorModalOpen = false"
                        class="btn-sunset-secondary rounded-xl px-4 py-2 text-xs font-semibold text-white">
                        Batal
                    </button>
                    <button type="button" @click="executeDeleteAuthor"
                        class="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg hover:bg-red-500">
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
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

const totalBooksWithAuthor = computed(() => {
    return books.value.filter((b: Book) => Boolean(b.author && b.author.trim())).length
})

const avgBooksPerAuthor = computed(() => {
    if (!allAuthorsList.value.length) return '0'
    return (totalBooksWithAuthor.value / allAuthorsList.value.length).toFixed(1)
})

const booksWithAuthorCount = totalBooksWithAuthor

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

const isDeleteAuthorModalOpen = ref(false)
const authorToDelete = ref<string | null>(null)

const openDeleteAuthorModal = (name: string) => {
    authorToDelete.value = name
    isDeleteAuthorModalOpen.value = true
}

const executeDeleteAuthor = async () => {
    if (!authorToDelete.value) return
    const name = authorToDelete.value

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

    isDeleteAuthorModalOpen.value = false
    authorToDelete.value = null
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
