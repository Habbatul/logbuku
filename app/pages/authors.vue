<template>
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b-2 border-[#0d0d0d] pb-6">
            <div class="min-w-0">
                <div class="mb-2 flex items-center gap-2">
                    <NuxtLink to="/" class="inline-flex cursor-pointer items-center gap-1.5 font-mono text-xs font-bold text-[#0d0d0d] hover:text-[#0047ff] transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                        [DASHBOARD]
                    </NuxtLink>
                    <span class="font-mono text-xs font-bold text-[#57534e]">/</span>
                    <span class="inline-flex items-center gap-1.5 rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d]">
                        <span class="h-1.5 w-1.5 rounded-full bg-[#ff4800]"></span>
                        PENULIS
                    </span>
                </div>

                <h1 class="text-2xl font-extrabold uppercase tracking-tight text-[#0d0d0d] sm:text-3xl mt-5">
                    Manajemen Penulis
                </h1>
                <p class="mt-1 text-sm text-[#44403c]">
                    Kelola daftar penulis dan relasi karya buku fisik dalam arsip koleksi Anda.
                </p>
            </div>

            <div class="flex shrink-0 items-center gap-2.5">
                <button type="button" @click="openAddAuthorModal"
                    class="inline-flex cursor-pointer items-center gap-2 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[3px_3px_0px_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#ff4800] hover:bg-[#262626] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] active:translate-x-0 active:translate-y-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    TAMBAH PENULIS
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d]">
                <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">[TOTAL PENULIS]</span>
                    <span class="h-2 w-2 rounded-full border border-[#0d0d0d] bg-[#0d0d0d]"></span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl sm:text-[28px] font-bold tracking-tight tabular-nums text-[#0d0d0d]">
                        {{ allAuthorsList.length }}
                    </span>
                    <span class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">PENULIS</span>
                </div>
            </div>

            <div class="rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d]">
                <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">[BUKU TERHUBUNG]</span>
                    <span class="h-2 w-2 rounded-full border border-[#0d0d0d] bg-[#00875a]"></span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl sm:text-[28px] font-bold tracking-tight tabular-nums text-[#00875a]">
                        {{ booksWithAuthorCount }}
                    </span>
                    <span class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">BUKU</span>
                </div>
            </div>

            <div class="col-span-2 sm:col-span-1 rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d]">
                <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">[TANPA PENULIS]</span>
                    <span class="h-2 w-2 rounded-full border border-[#0d0d0d] bg-[#ff4800]"></span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl sm:text-[28px] font-bold tracking-tight tabular-nums text-[#57534e]">
                        {{ booksWithoutAuthorCount }}
                    </span>
                    <span class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">BUKU</span>
                </div>
            </div>
        </div>

        <div class="space-y-2">
            <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <svg class="text-[#57534e]" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                        stroke-linejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                </div>
                <input v-model="searchQuery" type="text" placeholder="CARI NAMA PENULIS..."
                    class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white py-2.5 pl-10 pr-4 font-mono text-xs sm:text-sm font-bold text-[#0d0d0d] outline-none shadow-[2px_2px_0px_#0d0d0d] placeholder:text-[#57534e] focus:border-[#0047ff] transition-all" />
            </div>

            <div v-if="searchQuery" class="flex items-center justify-between px-1">
                <span class="font-mono text-xs font-bold uppercase text-[#44403c]">
                    [MENAMPILKAN {{ filteredAuthors.length }} DARI {{ allAuthorsList.length }} PENULIS]
                </span>
                <button type="button" @click="searchQuery = ''"
                    class="font-mono text-xs font-bold uppercase text-[#ff4800] hover:underline">
                    RESET PENCARIAN
                </button>
            </div>
        </div>

        <div v-if="filteredAuthors.length === 0"
            class="rounded-lg border-2 border-dashed border-[#0d0d0d]/40 bg-[#f3ede2] p-10 sm:p-12 text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-white text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d]">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                </svg>
            </div>
            <h3 class="mt-3 text-base font-bold uppercase tracking-tight text-[#0d0d0d]">
                {{ searchQuery ? 'Penulis Tidak Ditemukan' : 'Belum Ada Penulis Terdaftar' }}
            </h3>
            <p class="mt-1 text-sm text-[#44403c]">
                {{ searchQuery ? 'Tidak ada penulis yang sesuai dengan kata kunci pencarian Anda.' : 'Tambahkan nama penulis baru atau tentukan nama penulis pada form penambahan buku.' }}
            </p>
            <button v-if="!searchQuery" type="button" @click="openAddAuthorModal"
                class="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#262626] hover:shadow-[3px_3px_0px_#ff4800] transition-all">
                + TAMBAH PENULIS PERTAMA
            </button>
            <button v-else type="button" @click="searchQuery = ''"
                class="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-white px-4 py-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#f3ede2] transition-all">
                BERSIHKAN PENCARIAN
            </button>
        </div>

        <div v-else class="space-y-3">
            <div v-for="author in filteredAuthors" :key="author.name"
                class="overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
                <div class="flex cursor-pointer select-none items-center justify-between gap-3 p-4 sm:p-5"
                    @click="toggleAccordion(author.name)">
                    <div class="flex min-w-0 items-center gap-3.5">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d] font-mono font-bold text-base shadow-[1px_1px_0px_#0d0d0d]">
                            {{ author.name.charAt(0).toUpperCase() }}
                        </div>

                        <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap  mb-2 md:mb-1">
                                <h3 class="truncate text-base font-bold text-[#0d0d0d]">
                                    {{ author.name }}
                                </h3>
                                <span class="rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-0.5 font-mono text-xs font-bold tabular-nums text-[#0d0d0d] shrink-0">
                                    {{ author.books.length }} <span class="text-[#57534e]">BUKU</span>
                                </span>
                            </div>
                            <p class="mt-0.5 text-xs text-[#44403c] truncate font-medium">
                                {{ author.books.length > 0 ? author.books.map(b => b.title).join(', ') : 'Belum ada buku terhubung' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex shrink-0 items-center gap-2">
                        <div class="flex items-center gap-1.5" @click.stop>
                            <button type="button" @click="openRenameModal(author.name)" title="Ubah Nama Penulis"
                                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-white text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2] active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                            </button>
                            <button type="button" @click="confirmDeleteAuthor(author.name)" title="Hapus Penulis"
                                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#fff0eb] text-[#ff4800] shadow-[1px_1px_0px_#0d0d0d] transition-all hover:bg-[#ff4800] hover:text-white active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                            </button>
                        </div>

                        <button type="button" aria-label="Buka tutup daftar buku"
                            class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] transition-all hover:bg-white active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                                class="transition-transform duration-200"
                                :class="expandedAuthors.includes(author.name) ? 'rotate-180' : ''">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div v-show="expandedAuthors.includes(author.name)"
                    class="border-t-2 border-[#0d0d0d] bg-[#faf8f5] p-4 sm:p-5">
                    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">
                            [KARYA BUKU TERHUBUNG: {{ author.books.length }}]
                        </span>

                        <button type="button" @click="openAssignModal(author.name)"
                            class="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0d0d0d] active:translate-x-0 active:translate-y-0 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            HUBUNGKAN BUKU LAIN
                        </button>
                    </div>

                    <div v-if="author.books.length === 0"
                        class="rounded-[4px] border-2 border-dashed border-[#0d0d0d]/30 bg-[#f3ede2] p-6 text-center font-mono text-xs sm:text-sm font-bold text-[#44403c]">
                        [BELUM ADA BUKU YANG TERHUBUNG DENGAN PENULIS INI]
                        <button type="button" @click="openAssignModal(author.name)"
                            class="block mx-auto mt-2 cursor-pointer font-bold text-[#0047ff] hover:underline uppercase">
                            + PILIH BUKU UNTUK DIHUBUNGKAN
                        </button>
                    </div>

                    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="book in author.books" :key="book.id"
                            class="group relative flex items-center gap-3 rounded-[4px] border-2 border-[#0d0d0d] bg-white p-3 shadow-[2px_2px_0px_#0d0d0d] transition-all hover:shadow-[3px_3px_0px_#0d0d0d]">
                            <div class="h-14 w-10 shrink-0 overflow-hidden rounded-[2px] border border-[#0d0d0d] bg-[#f3ede2] shadow-[1px_1px_0px_#0d0d0d]">
                                <img v-if="book.imageUrl" :src="book.imageUrl" class="h-full w-full object-cover" loading="lazy" />
                                <div v-else class="flex h-full w-full items-center justify-center text-[#57534e]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                                    </svg>
                                </div>
                            </div>

                            <div class="min-w-0 flex-1">
                                <h4 class="truncate text-xs sm:text-sm font-bold text-[#0d0d0d]" :title="book.title">
                                    {{ book.title }}
                                </h4>
                                <p v-if="book.publisher" class="truncate font-mono text-xs text-[#44403c]">
                                    {{ book.publisher }}
                                </p>
                                <div class="mt-1 flex items-center gap-2 font-mono text-xs text-[#57534e]">
                                    <span class="tabular-nums font-bold text-[#0d0d0d]">{{ book.totalPages }}</span> hal
                                    <span>•</span>
                                    <span class="font-bold tabular-nums text-[#0047ff]">{{ formatCurrency(book.price) }}</span>
                                </div>
                            </div>

                            <button type="button" @click="unassignBook(book)" title="Lepas buku dari penulis ini"
                                class="shrink-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] transition-all hover:bg-[#ff4800] hover:text-white active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
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
            <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-[2px]" @click="isAddModalOpen = false"></div>
            <div class="relative w-full max-w-sm rounded-lg border-2 border-[#0d0d0d] bg-white p-6 shadow-[8px_8px_0px_#0d0d0d] animate-in zoom-in-95">
                <h3 class="text-base font-bold uppercase tracking-tight text-[#0d0d0d]">Tambah Penulis Baru</h3>
                <p class="mt-1 font-mono text-xs text-[#44403c]">Masukkan nama penulis yang ingin ditambahkan ke sistem.</p>

                <form @submit.prevent="saveNewAuthor" class="mt-4 space-y-4">
                    <input v-model="newAuthorName" type="text" required placeholder="NAMA PENULIS..."
                        class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3.5 py-2.5 font-mono text-sm font-bold text-[#0d0d0d] outline-none shadow-[2px_2px_0px_#0d0d0d] placeholder:text-[#57534e] focus:border-[#0047ff]" />

                    <div class="flex justify-end gap-2.5">
                        <button type="button" @click="isAddModalOpen = false"
                            class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2]">
                            BATAL
                        </button>
                        <button type="submit"
                            class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#262626] hover:shadow-[3px_3px_0px_#ff4800]">
                            SIMPAN
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="isRenameModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-[2px]" @click="isRenameModalOpen = false"></div>
            <div class="relative w-full max-w-sm rounded-lg border-2 border-[#0d0d0d] bg-white p-6 shadow-[8px_8px_0px_#0d0d0d] animate-in zoom-in-95">
                <h3 class="text-base font-bold uppercase tracking-tight text-[#0d0d0d]">Ubah Nama Penulis</h3>
                <p class="mt-1 font-mono text-xs text-[#44403c]">Semua buku karya penulis ini akan otomatis diperbarui.</p>

                <form @submit.prevent="saveRenamedAuthor" class="mt-4 space-y-4">
                    <input v-model="renameAuthorNewName" type="text" required placeholder="NAMA BARU PENULIS..."
                        class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3.5 py-2.5 font-mono text-sm font-bold text-[#0d0d0d] outline-none shadow-[2px_2px_0px_#0d0d0d] placeholder:text-[#57534e] focus:border-[#0047ff]" />

                    <div class="flex justify-end gap-2.5">
                        <button type="button" @click="isRenameModalOpen = false"
                            class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2]">
                            BATAL
                        </button>
                        <button type="submit"
                            class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#262626] hover:shadow-[3px_3px_0px_#ff4800]">
                            PERBARUI
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
