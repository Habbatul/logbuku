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
                        Penerbit
                    </span>
                </div>

                <h1 class="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
                    Manajemen Penerbit
                </h1>
                <p class="mt-1.5 max-w-3xl text-xs sm:text-sm leading-relaxed text-white">
                    Kelola daftar penerbit dan relasi buku yang diterbitkan dalam arsip koleksi Anda.
                </p>
            </div>

            <div class="flex shrink-0 items-center gap-2.5">
                <button type="button" @click="openAddPublisherModal"
                    class="btn-sunset-primary inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    Tambah Penerbit
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3">
            <div class="surface-stat rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-white">Total Penerbit</span>
                    <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]"></span>
                </div>
                <div class="flex items-baseline gap-1.5">
                    <span class="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-white">
                        {{ allPublishersList.length }}
                    </span>
                    <span class="text-xs font-medium text-white">penerbit</span>
                </div>
            </div>

            <div class="surface-stat rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-white">Buku Terhubung</span>
                    <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                </div>
                <div class="flex items-baseline gap-1.5">
                    <span class="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-white">
                        {{ booksWithPublisherCount }}
                    </span>
                    <span class="text-xs font-medium text-white">buku</span>
                </div>
            </div>

            <div class="col-span-2 sm:col-span-1 surface-stat rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3">
                <div class="flex items-start justify-between gap-2">
                    <span class="text-xs font-bold uppercase tracking-wider text-white">Tanpa Penerbit</span>
                    <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]"></span>
                </div>
                <div class="flex items-baseline gap-1.5">
                    <span class="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-white">
                        {{ booksWithoutPublisherCount }}
                    </span>
                    <span class="text-xs font-medium text-white">buku</span>
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
                <input v-model="searchQuery" type="text" placeholder="Cari nama penerbit..."
                    class="glass-input w-full py-2.5 pl-10 pr-4 text-xs sm:text-sm font-medium text-white placeholder:text-white/75 rounded-xl" />
            </div>

            <div v-if="searchQuery" class="flex items-center justify-between px-1">
                <span class="text-xs font-medium text-white">
                    Menampilkan <strong class="text-sky-300 tabular-nums">{{ filteredPublishers.length }}</strong> dari <strong class="text-sky-300 tabular-nums">{{ allPublishersList.length }}</strong> penerbit
                </span>
                <button type="button" @click="searchQuery = ''"
                    class="text-xs font-bold text-sky-300 hover:text-sky-200 hover:underline">
                    Reset Pencarian
                </button>
            </div>
        </div>

        <div v-if="filteredPublishers.length === 0"
            class="surface-card rounded-2xl p-10 sm:p-12 text-center space-y-4">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
            </div>
            <h3 class="text-base sm:text-lg font-bold tracking-tight text-white">
                {{ searchQuery ? 'Penerbit Tidak Ditemukan' : 'Belum Ada Penerbit Terdaftar' }}
            </h3>
            <p class="max-w-md mx-auto text-xs sm:text-sm text-white leading-relaxed font-medium">
                {{ searchQuery ? 'Tidak ada penerbit yang sesuai dengan kata kunci pencarian Anda.' : 'Tambahkan nama penerbit baru atau tentukan nama penerbit pada form penambahan buku.' }}
            </p>
            <button v-if="!searchQuery" type="button" @click="openAddPublisherModal"
                class="btn-sunset-primary inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold">
                + Tambah Penerbit Pertama
            </button>
            <button v-else type="button" @click="searchQuery = ''"
                class="btn-sunset-secondary inline-flex cursor-pointer items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white">
                Bersihkan Pencarian
            </button>
        </div>

        <div v-else class="space-y-3">
            <div v-for="pub in filteredPublishers" :key="pub.name"
                class="surface-card-interactive rounded-2xl overflow-hidden">
                <div class="flex cursor-pointer select-none items-center justify-between gap-3 p-4 sm:p-5 hover:bg-white/[0.12] transition-all duration-200"
                    @click="toggleAccordion(pub.name)">
                    <div class="flex min-w-0 items-center gap-3.5">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white font-bold text-base shadow-inner">
                            {{ pub.name.charAt(0).toUpperCase() }}
                        </div>

                        <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap mb-1">
                                <h3 class="truncate text-sm sm:text-base font-bold text-white">
                                    {{ pub.name }}
                                </h3>
                                <span class="liquid-glass-pill px-2.5 py-0.5 text-xs font-bold tabular-nums text-white shrink-0">
                                    {{ pub.books.length }} <span class="text-white font-normal">buku</span>
                                </span>
                            </div>
                            <p class="text-xs text-white truncate font-medium">
                                {{ pub.books.length > 0 ? pub.books.map(b => b.title).join(', ') : 'Belum ada buku terhubung' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex shrink-0 items-center gap-2">
                        <div class="flex items-center gap-1.5" @click.stop>
                            <button type="button" @click="openRenameModal(pub.name)" title="Ubah Nama Penerbit"
                                class="btn-sunset-secondary flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl text-white hover:scale-105 active:scale-95 transition-all focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                            </button>
                            <button type="button" @click="openDeletePublisherModal(pub.name)" title="Hapus Penerbit"
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
                                :class="expandedPublishers.includes(pub.name) ? 'rotate-180' : ''">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div v-show="expandedPublishers.includes(pub.name)"
                    class="bg-white/[0.04] backdrop-blur-md p-4 sm:p-5 space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <span class="text-xs font-bold text-white">
                            Buku Terhubung ({{ pub.books.length }})
                        </span>

                        <button type="button" @click="openAssignModal(pub.name)"
                            class="btn-sunset-primary inline-flex cursor-pointer items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            Hubungkan Buku Lain
                        </button>
                    </div>

                    <div v-if="pub.books.length === 0"
                        class="rounded-xl bg-white/[0.06] p-6 text-center text-xs sm:text-sm text-white font-medium">
                        Belum ada buku yang terhubung dengan penerbit ini
                        <button type="button" @click="openAssignModal(pub.name)"
                            class="block mx-auto mt-2 cursor-pointer font-bold text-sky-300 hover:text-sky-200 hover:underline">
                            + Pilih Buku Untuk Dihubungkan
                        </button>
                    </div>

                    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="book in pub.books" :key="book.id"
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
                                <p v-if="book.author" class="truncate text-xs text-white font-normal">
                                    {{ book.author }}
                                </p>
                                <div class="mt-1 flex items-center gap-2 text-xs text-white">
                                    <span class="tabular-nums font-semibold text-white">{{ book.totalPages }} hal</span>
                                    <span>•</span>
                                    <span class="font-bold tabular-nums text-sky-300">{{ formatCurrency(book.price) }}</span>
                                </div>
                            </div>

                            <button type="button" @click="unassignBook(book)" title="Lepas buku dari penerbit ini"
                                class="shrink-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 hover:text-red-200 hover:scale-105 active:scale-95 transition-all focus:outline-none">
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

        <!-- Modal Tambah Penerbit -->
        <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="isAddModalOpen = false"></div>
            <div class="liquid-glass-modal relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                <h3 class="text-base font-bold tracking-tight text-white">Tambah Penerbit Baru</h3>
                <p class="mt-1 text-xs text-white leading-relaxed">Masukkan nama penerbit yang ingin ditambahkan ke sistem.</p>

                <form @submit.prevent="saveNewPublisher" class="mt-4 space-y-4">
                    <input v-model="newPublisherName" type="text" required placeholder="Nama penerbit..."
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

        <!-- Modal Rename Penerbit -->
        <div v-if="isRenameModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="isRenameModalOpen = false"></div>
            <div class="liquid-glass-modal relative w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in zoom-in-95">
                <h3 class="text-base font-bold tracking-tight text-white">Ubah Nama Penerbit</h3>
                <p class="mt-1 text-xs text-white leading-relaxed">Semua buku di bawah penerbit ini akan otomatis diperbarui.</p>

                <form @submit.prevent="saveRenamedPublisher" class="mt-4 space-y-4">
                    <input v-model="renamePublisherNewName" type="text" required placeholder="Nama baru penerbit..."
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

        <PublishersAssignBooksModal
            :is-open="isAssignModalOpen"
            :publisher-name="activePublisherName"
            :available-books="assignableBooks"
            @close="isAssignModalOpen = false"
            @assign="handleBulkAssign"
        />

        <!-- Modal Hapus Penerbit -->
        <div v-if="isDeletePublisherModalOpen && publisherToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="isDeletePublisherModalOpen = false"></div>
            <div class="liquid-glass-modal relative w-full max-w-sm rounded-2xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 space-y-4">
                <div class="flex items-center justify-between pb-3">
                    <h3 class="text-sm font-bold text-red-300">Hapus Penerbit</h3>
                    <button type="button" @click="isDeletePublisherModalOpen = false" class="text-sm font-bold text-white hover:text-rose-300 cursor-pointer">×</button>
                </div>
                <p class="text-xs text-white leading-relaxed">
                    Yakin ingin menghapus penerbit <strong class="text-white font-bold">"{{ publisherToDelete }}"</strong>? Buku yang terhubung tidak akan dihapus, tetapi relasi nama penerbitnya akan dikosongkan.
                </p>
                <div class="flex justify-end gap-2.5 pt-2">
                    <button type="button" @click="isDeletePublisherModalOpen = false"
                        class="btn-sunset-secondary rounded-xl px-4 py-2 text-xs font-semibold text-white">
                        Batal
                    </button>
                    <button type="button" @click="executeDeletePublisher"
                        class="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg transition-colors hover:bg-red-500">
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

const isDeletePublisherModalOpen = ref(false)
const publisherToDelete = ref<string | null>(null)

const openDeletePublisherModal = (name: string) => {
    publisherToDelete.value = name
    isDeletePublisherModalOpen.value = true
}

const executeDeletePublisher = async () => {
    if (!publisherToDelete.value) return
    const name = publisherToDelete.value

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

    isDeletePublisherModalOpen.value = false
    publisherToDelete.value = null
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
