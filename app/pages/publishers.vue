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
                        <span class="h-1.5 w-1.5 rounded-full bg-[#0047ff]"></span>
                        PENERBIT
                    </span>
                </div>

                <h1 class="text-2xl font-extrabold uppercase tracking-tight text-[#0d0d0d] sm:text-3xl mt-5">
                    Manajemen Penerbit
                </h1>
                <p class="mt-1.5 max-w-3xl text-[0.8rem] leading-relaxed text-[#44403c]">
                    Kelola daftar penerbit dan relasi buku yang diterbitkan dalam arsip koleksi Anda.
                </p>
            </div>

            <div class="flex shrink-0 items-center gap-2.5">
                <button type="button" @click="openAddPublisherModal"
                    class="inline-flex cursor-pointer items-center gap-2 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[3px_3px_0px_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_#0047ff] hover:bg-[#262626] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d] active:translate-x-0 active:translate-y-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>
                    TAMBAH PENERBIT
                </button>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div class="rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d]">
                <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">[TOTAL PENERBIT]</span>
                    <span class="h-2 w-2 rounded-full border border-[#0d0d0d] bg-[#0d0d0d]"></span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl sm:text-[28px] font-bold tracking-tight tabular-nums text-[#0d0d0d]">
                        {{ allPublishersList.length }}
                    </span>
                    <span class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">PENERBIT</span>
                </div>
            </div>

            <div class="rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d]">
                <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">[BUKU TERHUBUNG]</span>
                    <span class="h-2 w-2 rounded-full border border-[#0d0d0d] bg-[#0047ff]"></span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl sm:text-[28px] font-bold tracking-tight tabular-nums text-[#0047ff]">
                        {{ booksWithPublisherCount }}
                    </span>
                    <span class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">BUKU</span>
                </div>
            </div>

            <div class="col-span-2 sm:col-span-1 rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d]">
                <div class="flex items-center justify-between">
                    <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">[TANPA PENERBIT]</span>
                    <span class="h-2 w-2 rounded-full border border-[#0d0d0d] bg-[#ff4800]"></span>
                </div>
                <div class="mt-2 flex items-baseline gap-2">
                    <span class="text-2xl sm:text-[28px] font-bold tracking-tight tabular-nums text-[#57534e]">
                        {{ booksWithoutPublisherCount }}
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
                <input v-model="searchQuery" type="text" placeholder="CARI NAMA PENERBIT..."
                    class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white py-2.5 pl-10 pr-4 font-mono text-xs sm:text-sm font-bold text-[#0d0d0d] outline-none shadow-[2px_2px_0px_#0d0d0d] placeholder:text-[#57534e] focus:border-[#0047ff] transition-all" />
            </div>

            <div v-if="searchQuery" class="flex items-center justify-between px-1">
                <span class="font-mono text-xs font-bold uppercase text-[#44403c]">
                    [MENAMPILKAN {{ filteredPublishers.length }} DARI {{ allPublishersList.length }} PENERBIT]
                </span>
                <button type="button" @click="searchQuery = ''"
                    class="font-mono text-xs font-bold uppercase text-[#ff4800] hover:underline">
                    RESET PENCARIAN
                </button>
            </div>
        </div>

        <div v-if="filteredPublishers.length === 0"
            class="rounded-lg border-2 border-dashed border-[#0d0d0d]/40 bg-[#f3ede2] p-10 sm:p-12 text-center">
            <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-white text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d]">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                    <path d="M9 22v-4h6v4" />
                    <path d="M8 6h.01" />
                    <path d="M16 6h.01" />
                </svg>
            </div>
            <h3 class="mt-3 text-base font-bold uppercase tracking-tight text-[#0d0d0d]">
                {{ searchQuery ? 'Penerbit Tidak Ditemukan' : 'Belum Ada Penerbit Terdaftar' }}
            </h3>
            <p class="mt-1 text-sm text-[#44403c]">
                {{ searchQuery ? 'Tidak ada penerbit yang sesuai dengan kata kunci pencarian Anda.' : 'Tambahkan nama penerbit baru atau tentukan nama penerbit pada form penambahan buku.' }}
            </p>
            <button v-if="!searchQuery" type="button" @click="openAddPublisherModal"
                class="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#262626] hover:shadow-[3px_3px_0px_#0047ff] transition-all">
                + TAMBAH PENERBIT PERTAMA
            </button>
            <button v-else type="button" @click="searchQuery = ''"
                class="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-white px-4 py-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#f3ede2] transition-all">
                BERSIHKAN PENCARIAN
            </button>
        </div>

        <div v-else class="space-y-3">
            <div v-for="pub in filteredPublishers" :key="pub.name"
                class="overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
                <div class="flex cursor-pointer select-none items-center justify-between gap-3 p-4 sm:p-5"
                    @click="toggleAccordion(pub.name)">
                    <div class="flex min-w-0 items-center gap-3.5">
                        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d] font-mono font-bold text-base shadow-[1px_1px_0px_#0d0d0d]">
                            {{ pub.name.charAt(0).toUpperCase() }}
                        </div>

                        <div class="min-w-0">
                            <div class="flex items-center gap-2 flex-wrap mb-2 md:mb-1">
                                <h3 class="truncate text-sm font-bold text-[#0d0d0d]">
                                    {{ pub.name }}
                                </h3>
                                <span class="rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-0.5 font-mono text-xs font-bold tabular-nums text-[#0d0d0d] shrink-0">
                                    {{ pub.books.length }} <span class="text-[#57534e]">BUKU</span>
                                </span>
                            </div>
                            <p class="mt-0.5 text-xs text-[#44403c] truncate font-medium">
                                {{ pub.books.length > 0 ? pub.books.map(b => b.title).join(', ') : 'Belum ada buku terhubung' }}
                            </p>
                        </div>
                    </div>

                    <div class="flex shrink-0 items-center gap-2">
                        <div class="flex items-center gap-1.5" @click.stop>
                            <button type="button" @click="openRenameModal(pub.name)" title="Ubah Nama Penerbit"
                                class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-white text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2] active:translate-x-0.5 active:translate-y-0.5 focus:outline-none">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                    <path d="m15 5 4 4" />
                                </svg>
                            </button>
                            <button type="button" @click="openDeletePublisherModal(pub.name)" title="Hapus Penerbit"
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
                                :class="expandedPublishers.includes(pub.name) ? 'rotate-180' : ''">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div v-show="expandedPublishers.includes(pub.name)"
                    class="border-t-2 border-[#0d0d0d] bg-[#faf8f5] p-4 sm:p-5">
                    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <span class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">
                            [BUKU TERHUBUNG: {{ pub.books.length }}]
                        </span>

                        <button type="button" @click="openAssignModal(pub.name)"
                            class="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0d0d0d] active:translate-x-0 active:translate-y-0 focus:outline-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>
                            HUBUNGKAN BUKU LAIN
                        </button>
                    </div>

                    <div v-if="pub.books.length === 0"
                        class="rounded-[4px] border-2 border-dashed border-[#0d0d0d]/30 bg-[#f3ede2] p-6 text-center font-mono text-xs sm:text-sm font-bold text-[#44403c]">
                        [BELUM ADA BUKU YANG TERHUBUNG DENGAN PENERBIT INI]
                        <button type="button" @click="openAssignModal(pub.name)"
                            class="block mx-auto mt-2 cursor-pointer font-bold text-[#0047ff] hover:underline uppercase">
                            + PILIH BUKU UNTUK DIHUBUNGKAN
                        </button>
                    </div>

                    <div v-else class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <div v-for="book in pub.books" :key="book.id"
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
                                <p v-if="book.author" class="truncate font-mono text-xs text-[#44403c]">
                                    {{ book.author }}
                                </p>
                                <div class="mt-1 flex items-center gap-2 font-mono text-xs text-[#57534e]">
                                    <span class="tabular-nums font-bold text-[#0d0d0d]">{{ book.totalPages }}</span> hal
                                    <span>•</span>
                                    <span class="font-bold tabular-nums text-[#0047ff]">{{ formatCurrency(book.price) }}</span>
                                </div>
                            </div>

                            <button type="button" @click="unassignBook(book)" title="Lepas buku dari penerbit ini"
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
                <h3 class="text-base font-bold uppercase tracking-tight text-[#0d0d0d]">Tambah Penerbit Baru</h3>
                <p class="mt-1 font-mono text-xs text-[#44403c]">Masukkan nama penerbit yang ingin ditambahkan ke sistem.</p>

                <form @submit.prevent="saveNewPublisher" class="mt-4 space-y-4">
                    <input v-model="newPublisherName" type="text" required placeholder="NAMA PENERBIT..."
                        class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3.5 py-2.5 font-mono text-sm font-bold text-[#0d0d0d] outline-none shadow-[2px_2px_0px_#0d0d0d] placeholder:text-[#57534e] focus:border-[#0047ff]" />

                    <div class="flex justify-end gap-2.5">
                        <button type="button" @click="isAddModalOpen = false"
                            class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2]">
                            BATAL
                        </button>
                        <button type="submit"
                            class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#262626] hover:shadow-[3px_3px_0px_#0047ff]">
                            SIMPAN
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <div v-if="isRenameModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-[2px]" @click="isRenameModalOpen = false"></div>
            <div class="relative w-full max-w-sm rounded-lg border-2 border-[#0d0d0d] bg-white p-6 shadow-[8px_8px_0px_#0d0d0d] animate-in zoom-in-95">
                <h3 class="text-base font-bold uppercase tracking-tight text-[#0d0d0d]">Ubah Nama Penerbit</h3>
                <p class="mt-1 font-mono text-xs text-[#44403c]">Semua buku di bawah penerbit ini akan otomatis diperbarui.</p>

                <form @submit.prevent="saveRenamedPublisher" class="mt-4 space-y-4">
                    <input v-model="renamePublisherNewName" type="text" required placeholder="NAMA BARU PENERBIT..."
                        class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3.5 py-2.5 font-mono text-sm font-bold text-[#0d0d0d] outline-none shadow-[2px_2px_0px_#0d0d0d] placeholder:text-[#57534e] focus:border-[#0047ff]" />

                    <div class="flex justify-end gap-2.5">
                        <button type="button" @click="isRenameModalOpen = false"
                            class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2]">
                            BATAL
                        </button>
                        <button type="submit"
                            class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#262626] hover:shadow-[3px_3px_0px_#0047ff]">
                            PERBARUI
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

        <div v-if="isDeletePublisherModalOpen && publisherToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-[2px]" @click="isDeletePublisherModalOpen = false"></div>
            <div class="relative w-full max-w-sm rounded-lg border-2 border-[#0d0d0d] bg-white p-5 sm:p-6 shadow-[8px_8px_0px_#0d0d0d] animate-in zoom-in-95 space-y-4">
                <div class="flex items-center justify-between border-b-2 border-[#0d0d0d] pb-3">
                    <h3 class="text-sm font-bold uppercase tracking-tight text-[#ff4800]">[HAPUS PENERBIT]</h3>
                    <button type="button" @click="isDeletePublisherModalOpen = false" class="text-sm font-bold text-[#0d0d0d] hover:text-[#ff4800] cursor-pointer">×</button>
                </div>
                <p class="font-mono text-xs text-[#44403c] leading-relaxed">
                    Yakin ingin menghapus penerbit <strong>"{{ publisherToDelete }}"</strong>? Buku yang terhubung tidak akan dihapus, tetapi relasi nama penerbitnya akan dikosongkan.
                </p>
                <div class="flex justify-end gap-2.5 pt-2 border-t border-[#e5dfd3]">
                    <button type="button" @click="isDeletePublisherModalOpen = false"
                        class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2]">
                        BATAL
                    </button>
                    <button type="button" @click="executeDeletePublisher"
                        class="cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-[#ff4800] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#d93d00]">
                        YA, HAPUS
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
