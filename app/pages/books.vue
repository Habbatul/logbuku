<template>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        <div class="mb-10">
            <div class="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div class="min-w-0">
                    <div class="mb-2 flex items-center gap-2">
                        <span class="h-1.5 w-1.5 rounded-full bg-gray-400"></span>
                        <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-400">
                            Library
                        </span>
                    </div>

                    <h1 class="text-[28px] font-bold tracking-[-0.035em] text-gray-950 sm:text-[32px]">
                        Koleksi Buku
                    </h1>

                    <p class="mt-1.5 max-w-[65ch] text-sm leading-6 text-gray-500">
                        Kelola koleksi buku dan progres bacaan.
                    </p>
                </div>

                <button @click="openModal()"
                    class="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-md bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/15 sm:w-auto">

                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14" />
                        <path d="M12 5v14" />
                    </svg>

                    Tambah Buku
                </button>
            </div>

            <div class="mt-6 flex flex-col gap-3">
                <div class="flex flex-col gap-2 sm:flex-row">
                    <div class="relative min-w-0 flex-1">
                        <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                            <svg class="text-gray-400" xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>

                        <input v-model="searchQuery" type="text" placeholder="Cari judul buku..."
                            class="w-full rounded-md border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                    </div>

                    <select v-model="selectedTopic"
                        class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5 sm:w-48">
                        <option value="">Semua Topik</option>
                        <option v-for="topic in uniqueTopics" :key="topic" :value="topic">
                            {{ topic }}
                        </option>
                    </select>

                    <select v-model="sortBy"
                        class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5 sm:w-48">
                        <option value="default">Urutkan: Default</option>
                        <option value="terbaru">Terbaru (Tgl Beli)</option>
                        <option value="terlama">Terlama (Tgl Beli)</option>
                        <option value="harga_tinggi">Harga Tertinggi</option>
                        <option value="harga_rendah">Harga Terendah</option>
                    </select>

                    <button @click="showFilters = !showFilters" type="button"
                        class="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-md border px-4 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:w-auto"
                        :class="showFilters
                            ? 'border-gray-900 bg-gray-900 text-white hover:bg-black'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                            ">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                        </svg>
                        Filter Lanjutan
                    </button>
                </div>
            </div>

            <div v-if="showFilters" class="mt-3 rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:p-5">
                <div class="flex flex-wrap items-center gap-x-4 mt-1 mb-5">
                    <label for="pinOrder"
                        class="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-transparent py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700">
                        <span class="relative flex h-4 w-4 shrink-0 items-center justify-center">
                            <input type="checkbox" id="pinOrder" v-model="respectPinned"
                                class="peer absolute inset-0 m-0 cursor-pointer opacity-0" />

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                class="h-4 w-4 transition-all duration-150" :class="respectPinned
                                    ? 'fill-gray-900 text-gray-900'
                                    : 'fill-transparent text-gray-400 group-hover:text-gray-600'
                                    " stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="m12 17 5 3-1.5-5.7L20 10.5l-5.8-.4L12 5l-2.2 5.1-5.8.4 4.5 3.8L7 20l5-3Z" />
                            </svg>
                        </span>
                        <span>Utamakan buku yang di-Pin</span>
                    </label>

                    <label for="hideBtns"
                        class="group inline-flex w-fit cursor-pointer items-center gap-2 rounded-md border border-transparent py-1.5 text-[13px] font-medium text-gray-500 transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700">
                        <span class="relative flex h-4 w-4 shrink-0 items-center justify-center">
                            <input type="checkbox" id="hideBtns" v-model="hideActionButtons"
                                class="peer absolute inset-0 m-0 cursor-pointer opacity-0" />

                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                class="h-4 w-4 transition-all duration-150" :class="hideActionButtons
                                    ? 'fill-gray-900 text-gray-900'
                                    : 'fill-transparent text-gray-400 group-hover:text-gray-600'
                                    " stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                stroke-linejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                            </svg>
                        </span>
                        <span>Sembunyikan tombol</span>
                    </label>
                </div>

                <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div>
                        <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                            Tanggal Beli
                        </label>
                        <div class="flex min-w-0 items-center gap-2">
                            <input v-model="filterStartDate" type="date"
                                class="min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                            <span class="shrink-0 text-xs font-medium text-gray-300">—</span>
                            <input v-model="filterEndDate" type="date"
                                class="min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                        </div>
                    </div>

                    <div>
                        <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                            Range Harga (Rp)
                        </label>
                        <div class="flex min-w-0 items-center gap-2">
                            <input v-model.number="filterMinPrice" type="number" placeholder="Min"
                                class="hide-arrows min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                            <span class="shrink-0 text-xs font-medium text-gray-300">—</span>
                            <input v-model.number="filterMaxPrice" type="number" placeholder="Max"
                                class="hide-arrows min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                        </div>
                    </div>

                    <div>
                        <label class="mb-2 block text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-400">
                            Total Halaman
                        </label>
                        <div class="flex min-w-0 items-center gap-2">
                            <input v-model.number="filterMinPages" type="number" placeholder="Min"
                                class="hide-arrows min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                            <span class="shrink-0 text-xs font-medium text-gray-300">—</span>
                            <input v-model.number="filterMaxPages" type="number" placeholder="Max"
                                class="hide-arrows min-w-0 w-full rounded-md border border-gray-200 bg-white px-2.5 py-2 text-sm font-medium text-gray-700 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                        </div>
                    </div>
                </div>

                <div class="mt-5 flex justify-end border-t border-gray-200/80 pt-4">
                    <button @click="resetFilters" type="button" title="Reset Semua Filter"
                        class="group inline-flex items-center gap-1.5 px-2 py-1.5 rounded text-[12px] font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none">
                        <svg class="h-3.5 w-3.5 transition-transform duration-200 group-hover:-rotate-45"
                            xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        <span>Reset filter</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-if="filteredBooks.length === 0"
            class="mt-6 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 px-6 py-16 text-center">
            <div
                class="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 ring-1 ring-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                </svg>
            </div>
            <p class="mt-4 text-sm font-semibold text-gray-800">
                Tidak ada buku ditemukan
            </p>
            <p class="mx-auto mt-1 max-w-[60ch] text-sm leading-6 text-gray-500">
                Tambahkan buku baru atau sesuaikan kata kunci filtermu.
            </p>
        </div>

        <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            <div v-for="book in filteredBooks" :key="book.id"
                class="group relative flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)]">

                <div v-show="!hideActionButtons">
                    <button @click="togglePin(book)"
                        class="absolute right-2.5 top-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-md bg-white/95 text-gray-400 shadow-sm ring-1 ring-gray-200/80 backdrop-blur-sm transition-colors hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                        :class="book.isPinned ? 'text-amber-500 hover:text-amber-600' : ''"
                        :aria-label="book.isPinned ? 'Lepas pin' : 'Pin buku'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                            :fill="book.isPinned ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2.25"
                            stroke-linecap="round" stroke-linejoin="round">
                            <polygon
                                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </button>

                    <button @click="openModal(book)" title="Edit Detail"
                        class="absolute left-2.5 top-2.5 z-20 flex h-7 w-7 items-center justify-center rounded-md bg-white/95 text-gray-400 shadow-sm ring-1 ring-gray-200/80 backdrop-blur-sm transition-colors hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            <path d="m15 5 4 4" />
                        </svg>
                    </button>
                </div>

              <div class="relative aspect-[2/2.5] w-full overflow-hidden bg-white p-1.5">
                    <div
                        class="relative h-full w-full overflow-hidden rounded-lg border-[0.5px] border-gray-400 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.3)]">
                        <img v-if="book.imageUrl" :src="book.imageUrl" :alt="book.title"
                            class="h-full w-full object-cover  brightness-[1] contrast-[0.8] saturate-[1]" @error="handleImageError" loading="lazy" />

                        <div v-else class="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-1.5-5H20" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="flex min-h-0 flex-1 flex-col p-3.5 sm:p-4">
                    <div class="mb-2 flex min-h-[18px] flex-wrap items-center gap-1.5">
                        <template v-if="book.topic && book.topic.length > 0">
                            <span v-for="t in book.topic" :key="t" :title="t"
                                class="max-w-[90px] truncate rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                                {{ t }}
                            </span>
                        </template>
                        <template v-else>
                            <span class="text-[10px] font-medium text-gray-400">
                                Tanpa Topik
                            </span>
                        </template>
                    </div>

                    <h3
                        class="line-clamp-2 text-[13px] font-semibold leading-5 tracking-tight text-gray-900 sm:text-sm">
                        {{ book.title }}
                    </h3>

                    <div class="mt-auto pt-4">
                        <button @click="openProgressModal(book)"
                            class="group/progress flex w-full items-center justify-between gap-2 border-t border-gray-100 pt-3 text-left focus:outline-none">
                            <div class="flex min-w-0 items-center gap-1.5">
                                <svg class="shrink-0 text-gray-400 transition-colors group-hover/progress:text-gray-700"
                                    xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                                </svg>
                                <span class="truncate text-[11px] font-medium text-gray-500 sm:text-xs">
                                    {{ book.pagesRead }} / {{ book.totalPages }} hal
                                </span>
                            </div>
                            <span class="shrink-0 text-xs font-bold tabular-nums"
                                :class="book.pagesRead >= book.totalPages ? 'text-green-600' : 'text-gray-900'">
                                {{ Math.round((book.pagesRead / book.totalPages) * 100) || 0 }}%
                            </span>
                        </button>

                        <div class="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                            <div class="h-full rounded-full transition-all duration-300 ease-out"
                                :class="getProgressColor(book.pagesRead, book.totalPages)"
                                :style="{ width: `${Math.min((book.pagesRead / book.totalPages) * 100, 100)}%` }"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isProgressModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" @click="closeProgressModal"></div>
            <div
                class="relative bg-white rounded-2xl shadow-2xl border border-gray-200/80 w-full max-w-xs overflow-hidden animate-in zoom-in-95 duration-200">
                <div class="p-4 sm:p-5 border-b border-gray-100/80 bg-white">
                    <h2 class="text-[15px] font-semibold text-gray-900">Update Progres</h2>
                    <p class="text-[13px] text-gray-500 mt-0.5 line-clamp-1">{{ progressForm.book?.title }}</p>
                </div>
                <div class="p-4 sm:p-5 space-y-4">
                    <div class="flex items-center justify-center gap-3">
                        <button type="button" @click="decrementProgress"
                            class="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200/80 rounded-lg hover:bg-gray-100 text-gray-700 font-semibold transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10">-</button>
                        <input v-model.number="progressForm.pagesRead" type="number"
                            class="w-20 h-10 text-center bg-white border border-gray-200/80 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none text-[16px] font-semibold text-gray-900 transition-all hide-arrows"
                            @input="validateProgress">
                        <button type="button" @click="incrementProgress"
                            class="w-10 h-10 flex items-center justify-center bg-gray-50 border border-gray-200/80 rounded-lg hover:bg-gray-100 text-gray-700 font-semibold transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10">+</button>
                    </div>
                    <div class="text-center text-[12px] text-gray-500 font-medium">
                        dari total {{ progressForm.totalPages }} halaman
                    </div>
                    <div class="pt-2 flex gap-3">
                        <button type="button" @click="closeProgressModal"
                            class="flex-1 bg-white border border-gray-200/80 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors text-[13px] shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">Batal</button>
                        <button type="button" @click="submitProgress"
                            class="flex-1 bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition-colors text-[13px] shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20">Simpan</button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div class="absolute inset-0 bg-gray-950/40 backdrop-blur-[3px]" @click="isModalOpen = false"></div>
            <div
                class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] animate-in zoom-in-95 duration-200">

                <div
                    class="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
                    <div class="min-w-0">
                        <h2 class="truncate text-base font-semibold tracking-tight text-gray-950">
                            {{ form.id ? 'Edit Buku' : 'Tambah Buku Baru' }}
                        </h2>
                        <p class="mt-0.5 text-xs text-gray-400">
                            {{ form.id ? 'Perbarui informasi buku.' : 'Tambahkan buku baru ke koleksimu.' }}
                        </p>
                    </div>
                    <button @click="isModalOpen = false" type="button" aria-label="Tutup"
                        class="ml-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                <div class="custom-scrollbar overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">

                    <div v-if="!form.id" class="mb-5 flex rounded-md bg-gray-100 p-1">
                        <button type="button" @click="addMode = 'form'"
                            :class="addMode === 'form' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                            class="flex-1 rounded py-1.5 text-xs font-semibold transition-all focus:outline-none">Form
                            Biasa</button>
                        <button type="button" @click="addMode = 'json'"
                            :class="addMode === 'json' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                            class="flex-1 rounded py-1.5 text-xs font-semibold transition-all focus:outline-none">Data
                            JSON</button>
                    </div>

                    <form v-if="addMode === 'form'" @submit.prevent="submitForm" class="space-y-5">
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                Judul Buku
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.title" type="text" required
                                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5">
                        </div>

                        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                    Tanggal Beli
                                    <span class="text-red-500">*</span>
                                </label>
                                <input v-model="form.date" type="date" required
                                    class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5">
                            </div>
                            <div class="min-w-0">
                                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                    Topik
                                    <span class="ml-1 text-[11px] font-normal text-gray-400">(maks. 3)</span>
                                </label>
                                <div v-if="form.topic.length > 0" class="mb-2 flex flex-wrap gap-1.5">
                                    <span v-for="(t, idx) in form.topic" :key="idx"
                                        class="inline-flex max-w-full items-center gap-1.5 rounded-md bg-gray-100 px-2 py-1 text-[11px] font-medium text-gray-700 border border-gray-200/80">
                                        <span class="max-w-[120px] truncate">{{ t }}</span>
                                        <button type="button" @click="removeTopic(idx)"
                                            class="shrink-0 text-gray-400 transition-colors hover:text-red-500 focus:outline-none">&times;</button>
                                    </span>
                                </div>
                                <input v-if="form.topic.length < 3" v-model="topicInput" type="text"
                                    @keydown.enter.prevent="addTopic" @keydown.comma.prevent="addTopic" @blur="addTopic"
                                    placeholder="Ketik lalu Enter..."
                                    class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                    Total Halaman
                                    <span class="text-red-500">*</span>
                                </label>
                                <input v-model.number="form.totalPages" type="number" min="1" required
                                    class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5">
                            </div>
                            <div>
                                <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                    Harga (Rp)
                                    <span class="text-red-500">*</span>
                                </label>
                                <input v-model.number="form.price" type="number" min="0" required
                                    class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5">
                            </div>
                        </div>

                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                URL Gambar Cover
                                <span class="ml-1 text-[11px] font-normal text-gray-400">(opsional)</span>
                            </label>
                            <input v-model="form.imageUrl" type="url" placeholder="https://..."
                                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5">
                        </div>

                        <div
                            class="mt-7 flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
                            <button v-if="form.id" type="button" @click="handleDelete"
                                class="w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/10 sm:mr-auto sm:w-auto">
                                Hapus
                            </button>
                            <div class="flex w-full gap-2 sm:w-auto">
                                <button type="button" @click="isModalOpen = false"
                                    class="flex-1 rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:flex-none">
                                    Batal
                                </button>
                                <button type="submit"
                                    class="flex-1 rounded-md bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/15 sm:flex-none">
                                    Simpan
                                </button>
                            </div>
                        </div>
                    </form>

                    <div v-if="addMode === 'json'" class="space-y-4">
                        <div
                            class="rounded-lg border border-blue-100 bg-blue-50/60 p-3.5 text-xs leading-relaxed text-black/80">
                            <p class="mb-2">
                                Isi data buku dengan format JSON berikut. Anda juga bisa
                                meminta AI untuk membuat datanya dengan format yang sama.
                                <span class="font-semibold">Contoh prompt:</span>
                            </p>

                            <p class="mb-2 italic text-blue-700/80">
                                {{ jsonPromptText }}
                            </p>

                            <div class="relative">
                                <button type="button" @click="copyJsonTemplate" title="Salin prompt dan JSON"
                                    class="absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-md border border-blue-100 bg-white/85 px-2 py-1.5 text-[11px] font-medium text-blue-700 backdrop-blur-sm transition-colors hover:border-blue-200 hover:bg-white hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                    Copy
                                </button>

                                <pre
                                    class="overflow-x-auto rounded border border-blue-100 bg-white/70 p-2.5 pr-16 font-mono text-[11px] leading-5 text-blue-950 select-all">
                            {{ jsonTemplateText }}</pre>
                            </div>
                        </div>


                        <div>
                            <textarea v-model="jsonInput" rows="6"
                                class="w-full text-[13px] font-mono p-3.5 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5 outline-none transition-all placeholder:text-gray-400 custom-scrollbar"
                                placeholder="Paste data JSON di sini..."></textarea>
                        </div>

                        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
                            <div class="flex items-center gap-2.5">
                                <span class="text-xs font-medium text-gray-500">atau upload file:</span>
                                <input type="file" accept=".json" class="hidden" ref="jsonFileRef"
                                    @change="handleJsonFile" />
                                <button type="button" @click="triggerJsonFile"
                                    class="inline-flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 py-1.5 px-3 rounded-md transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="17 8 12 3 7 8" />
                                        <line x1="12" y1="3" x2="12" y2="15" />
                                    </svg>
                                    Pilih .json
                                </button>
                            </div>

                            <button type="button" @click="processJsonSubmit"
                                class="rounded-md bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/15 w-full sm:w-auto">
                                Proses JSON
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
const { books, loadBooks, saveBook, deleteBook } = useBooks()

const getProgressColor = (read: number, total: number) => {
    if (!total) return 'bg-gray-200'
    const pct = (read / total) * 100
    if (pct >= 100) return 'bg-green-600'
    if (pct >= 75) return 'bg-purple-500'
    if (pct >= 50) return 'bg-blue-500'
    if (pct >= 25) return 'bg-orange-500'
    return 'bg-red-500'
}

const searchQuery = ref('')
const selectedTopic = ref('')
const isModalOpen = ref(false)
const hideActionButtons = ref(false)

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

const showFilters = ref(false)
const filterStartDate = ref('')
const filterEndDate = ref('')
const filterMinPrice = ref<number | ''>('')
const filterMaxPrice = ref<number | ''>('')
const filterMinPages = ref<number | ''>('')
const filterMaxPages = ref<number | ''>('')

const sortBy = ref('default')
const respectPinned = ref(true)

const resetFilters = () => {
    filterStartDate.value = ''
    filterEndDate.value = ''
    filterMinPrice.value = ''
    filterMaxPrice.value = ''
    filterMinPages.value = ''
    filterMaxPages.value = ''
    selectedTopic.value = ''
    searchQuery.value = ''
    sortBy.value = 'default'
}

const isProgressModalOpen = ref(false)
const progressForm = ref({ pagesRead: 0, totalPages: 0, book: null as any })

const openProgressModal = (book: any) => {
    progressForm.value = { pagesRead: book.pagesRead || 0, totalPages: book.totalPages, book: book }
    isProgressModalOpen.value = true
}
const closeProgressModal = () => isProgressModalOpen.value = false
const validateProgress = () => {
    if (progressForm.value.pagesRead < 0) progressForm.value.pagesRead = 0
    if (progressForm.value.pagesRead > progressForm.value.totalPages) progressForm.value.pagesRead = progressForm.value.totalPages
}
const incrementProgress = () => { if (progressForm.value.pagesRead < progressForm.value.totalPages) progressForm.value.pagesRead++ }
const decrementProgress = () => { if (progressForm.value.pagesRead > 0) progressForm.value.pagesRead-- }

const submitProgress = async () => {
    if (progressForm.value.book) {
        validateProgress()
        const oldPages = progressForm.value.book.pagesRead || 0
        const newPages = progressForm.value.pagesRead
        const pagesAdded = newPages - oldPages
        const updatedBook = { ...progressForm.value.book, pagesRead: newPages }

        if (pagesAdded > 0) {
            updatedBook.readHistory = updatedBook.readHistory || []
            const now = new Date()
            const oneHour = 60 * 60 * 1000
            const lastSessionIndex = updatedBook.readHistory.length - 1
            let isMerged = false

            if (lastSessionIndex >= 0) {
                const lastSession = updatedBook.readHistory[lastSessionIndex]
                const lastSessionTime = new Date(lastSession.date).getTime()
                if (now.getTime() - lastSessionTime <= oneHour) {
                    updatedBook.readHistory[lastSessionIndex].date = now.toISOString()
                    updatedBook.readHistory[lastSessionIndex].pagesAdded += pagesAdded
                    updatedBook.readHistory[lastSessionIndex].endPage = newPages
                    isMerged = true
                }
            }
            if (!isMerged) {
                updatedBook.readHistory.push({
                    date: now.toISOString(),
                    pagesAdded: pagesAdded,
                    startPage: oldPages,
                    endPage: newPages
                })
            }
        } else if (pagesAdded < 0) {
            let deficit = Math.abs(pagesAdded)
            if (updatedBook.readHistory && updatedBook.readHistory.length > 0) {
                for (let i = updatedBook.readHistory.length - 1; i >= 0; i--) {
                    if (deficit <= 0) break;
                    let session = updatedBook.readHistory[i];
                    if (session.pagesAdded <= deficit) {
                        deficit -= session.pagesAdded;
                        updatedBook.readHistory.splice(i, 1);
                    } else {
                        session.pagesAdded -= deficit;
                        session.endPage -= deficit;
                        deficit = 0;
                    }
                }
            }
        }
        await saveBook(updatedBook)
        closeProgressModal()
    }
}

const addMode = ref('form')
const jsonInput = ref('')
const jsonFileRef = ref<HTMLInputElement | null>(null)

const defaultForm = {
    id: null,
    title: '',
    date: new Date().toISOString().split('T')[0],
    topic: [] as string[],
    totalPages: null as number | null,
    pagesRead: 0,
    price: null as number | null,
    imageUrl: ''
}

const form = ref({ ...defaultForm })

const topicInput = ref('')
const addTopic = () => {
    const val = topicInput.value.trim().replace(/,/g, '')
    if (val && form.value.topic.length < 3 && !form.value.topic.includes(val)) {
        form.value.topic.push(val)
    }
    topicInput.value = ''
}
const removeTopic = (idx: number) => {
    form.value.topic.splice(idx, 1)
}

const openModal = (book: any = null) => {
    addMode.value = 'form'
    jsonInput.value = ''
    if (book) {
        form.value = { ...book, topic: book.topic ? [...book.topic] : [] }
    } else {
        form.value = { ...defaultForm, topic: [], date: new Date().toISOString().split('T')[0] }
    }
    topicInput.value = ''
    isModalOpen.value = true
}

const submitForm = async () => {
    addTopic()
    await saveBook(form.value)
    isModalOpen.value = false
}

const triggerJsonFile = () => {
    if (jsonFileRef.value) jsonFileRef.value.click()
}
const handleJsonFile = (e: any) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev: any) => {
        jsonInput.value = ev.target.result
    }
    reader.readAsText(file)
}
const processJsonSubmit = async () => {
    if (!jsonInput.value.trim()) {
        alert('Teks JSON masih kosong!')
        return
    }
    try {
        let parsed = JSON.parse(jsonInput.value)
        if (!Array.isArray(parsed)) parsed = [parsed]

        let addedCount = 0
        for (const item of parsed) {
            if (!item.title || !item.totalPages || item.price === undefined) {
                console.warn(`Buku dilewati karena format tidak lengkap: ${item.title || 'Tanpa Judul'}`)
                continue
            }
            const newBook = {
                ...defaultForm,
                title: item.title,
                date: item.date || new Date().toISOString().split('T')[0],
                topic: Array.isArray(item.topic) ? item.topic.slice(0, 3) : (item.topic ? [item.topic] : []),
                totalPages: parseInt(item.totalPages) || 1,
                pagesRead: parseInt(item.pagesRead) || 0,
                price: parseInt(item.price) || 0,
                imageUrl: item.imageUrl || '',
            }
            await saveBook(newBook)
            addedCount++
        }

        if (addedCount > 0) {
            isModalOpen.value = false
            jsonInput.value = ''
            if (jsonFileRef.value) jsonFileRef.value.value = ''
        } else {
            alert('Tidak ada buku yang ditambahkan. Pastikan JSON memiliki struktur: title, totalPages, dan price.')
        }
    } catch (error) {
        alert('Format JSON tidak valid! Silakan cek kembali sintaks JSON kamu.')
    }
}

const handleDelete = async () => {
    if (confirm('Yakin ingin menghapus buku ini?')) {
        await deleteBook(form.value.id)
        isModalOpen.value = false
    }
}

const togglePin = async (book: any) => {
    book.isPinned = !book.isPinned
    await saveBook(book)
}

const handleImageError = (e: any) => {
    e.target.style.display = 'none'
    if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex'
}

const uniqueTopics = computed(() => {
    const topics = new Set<string>()
    books.value.forEach(b => {
        if (Array.isArray(b.topic)) {
            b.topic.forEach((t: string) => topics.add(t))
        }
    })
    return Array.from(topics).sort()
})

const filteredBooks = computed(() => {
    let result = books.value.filter(book => {
        const matchSearch = book.title.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchTopic = selectedTopic.value ? (Array.isArray(book.topic) && book.topic.includes(selectedTopic.value)) : true

        let matchDate = true
        const bookDate = book.date || book.createdAt
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

        return matchSearch && matchTopic && matchDate && matchPrice && matchPages
    })

    result.sort((a, b) => {
        if (respectPinned.value) {
            if (a.isPinned && !b.isPinned) return -1
            if (!a.isPinned && b.isPinned) return 1
        }

        if (sortBy.value === 'terbaru') {
            return new Date(b.date || b.createdAt).getTime() - new Date(a.date || a.createdAt).getTime()
        }
        if (sortBy.value === 'terlama') {
            return new Date(a.date || a.createdAt).getTime() - new Date(b.date || b.createdAt).getTime()
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

const jsonPromptText =
    'Buatkan data buku menggunakan format JSON berikut:'

const jsonTemplateText = `[
  {
    "title": "Nama Buku",
    "totalPages": 300,
    "price": 95000,
    "topic": ["Self-Help", "Bisnis"],
    "date": "2024-10-15",
    "imageUrl": "https://..."
  }
]`

const copyJsonTemplate = async () => {
    const textToCopy = `${jsonPromptText}\n\n${jsonTemplateText}`

    try {
        await navigator.clipboard.writeText(textToCopy)
    } catch (error) {
        console.error('Gagal menyalin template JSON:', error)

        const textarea = document.createElement('textarea')
        textarea.value = textToCopy
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.top = '0'

        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()

        try {
            document.execCommand('copy')
        } catch (fallbackError) {
            console.error('Fallback copy gagal:', fallbackError)
        } finally {
            document.body.removeChild(textarea)
        }
    }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 0px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #9CA3AF;
}

.hide-arrows::-webkit-outer-spin-button,
.hide-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.hide-arrows {
    -moz-appearance: textfield;
}
</style>