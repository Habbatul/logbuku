<template>
    <div class="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-300 space-y-6 sm:space-y-8">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#0d0d0d] pb-4">
            <div class="flex items-center gap-2.5">
                <NuxtLink to="/books"
                    class="cursor-pointer inline-flex items-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-1.5 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:bg-[#f3ede2] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                    <span>Koleksi Buku</span>
                </NuxtLink>
                <span class="font-mono text-xs font-bold text-[#57534e]">/</span>
                <span class="font-mono text-xs font-bold uppercase text-[#0d0d0d]">[TRACKING BACAAN]</span>
            </div>

            <div v-if="selectedBook" class="flex items-center gap-2">
                <button @click="showBookPicker = true" type="button"
                    class="cursor-pointer inline-flex items-center gap-1.5 rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-3 py-1.5 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] transition-all hover:bg-white active:translate-x-0.5 active:translate-y-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 3h5v5" />
                        <path d="M8 3H3v5" />
                        <path d="M12 21v-8" />
                        <path d="M8 7l4 4 4-4" />
                    </svg>
                    <span>Ganti Buku</span>
                </button>
            </div>
        </div>

        <div v-if="books.length === 0"
            class="rounded-lg border-2 border-[#0d0d0d] bg-white p-8 text-center shadow-[4px_4px_0px_#0d0d0d] space-y-4">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-[4px] border-2 border-[#0d0d0d] bg-[#f3ede2]">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                </svg>
            </div>
            <h2 class="font-mono text-base font-bold uppercase text-[#0d0d0d]">Belum Ada Buku Dalam Koleksi</h2>
            <p class="text-sm text-[#57534e]">Tambahkan buku terlebih dahulu untuk mulai melacak progres membaca.</p>
            <NuxtLink to="/books"
                class="inline-flex cursor-pointer items-center gap-2 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#262626]">
                Ke Halaman Koleksi
            </NuxtLink>
        </div>

        <div v-else-if="selectedBook" class="space-y-6 sm:space-y-8">
            <div
                class="relative overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d]">
                <div class="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start">
                    <div
                        class="h-36 w-25 sm:h-32 sm:w-24 shrink-0 overflow-hidden rounded-[3px] border-2 border-[#0d0d0d] bg-[#f3ede2] shadow-[2px_2px_0px_#0d0d0d]">
                        <img v-if="selectedBook.imageUrl && !imageLoadError" :src="selectedBook.imageUrl"
                            :alt="selectedBook.title" class="h-full w-full object-cover" @error="imageLoadError = true" />
                        <div v-else class="flex h-full w-full items-center justify-center bg-[#f3ede2] text-[#57534e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>

                    <div class="min-w-0 flex-1 space-y-2">
                        <div class="flex flex-wrap items-center gap-1.5">
                            <span v-if="selectedBook.topic && selectedBook.topic.length > 0"
                                v-for="t in selectedBook.topic" :key="t"
                                class="rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#0d0d0d]">
                                {{ t }}
                            </span>
                            <span v-else class="font-mono text-[11px] font-bold uppercase text-[#57534e]">
                                [UMUM]
                            </span>
                            <span v-if="isBookCompleted"
                                class="rounded-[3px] border border-[#00875a] bg-[#eafaf1] px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-[#00875a]">
                                ✓ SELESAI
                            </span>
                            <span v-else-if="selectedBook.pagesRead > 0"
                                class="rounded-[3px] border border-[#0047ff] bg-[#f0f4ff] px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-[#0047ff]">
                                ● SEDANG DIBACA
                            </span>
                        </div>

                        <h1 class="font-mono text-base sm:text-lg font-bold text-[#0d0d0d] leading-snug break-words">
                            {{ selectedBook.title }}
                        </h1>

                        <p v-if="selectedBook.author" class="text-xs sm:text-sm text-[#44403c] font-medium">
                            Penulis: <span class="font-bold text-[#0d0d0d]">{{ selectedBook.author }}</span>
                            <span v-if="selectedBook.publisher" class="text-[#57534e]"> · {{ selectedBook.publisher }}</span>
                        </p>

                        <div class="pt-2 space-y-1.5">
                            <div class="flex items-center justify-between font-mono text-xs">
                                <span class="font-bold text-[#44403c]">
                                    Progres: <strong class="tabular-nums text-[#0d0d0d]">{{ selectedBook.pagesRead || 0 }}</strong> / <span class="text-[#57534e]">{{ selectedBook.totalPages || 0 }}</span> HAL
                                </span>
                                <span class="font-bold tabular-nums"
                                    :class="isBookCompleted ? 'text-[#00875a]' : 'text-[#0d0d0d]'">
                                    [{{ bookPercentage }}%]
                                </span>
                            </div>

                            <div class="h-3 w-full overflow-hidden rounded-[2px] border border-[#0d0d0d] bg-[#f3ede2] p-[1px]">
                                <div class="h-full transition-all duration-300 ease-out"
                                    :class="isBookCompleted ? 'bg-[#00875a]' : 'bg-[#0d0d0d]'"
                                    :style="{ width: `${Math.min(bookPercentage, 100)}%` }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="successNotification"
                class="rounded-lg border-2 border-[#00875a] bg-[#eafaf1] p-4 text-[#00875a] font-mono text-xs font-bold uppercase flex items-center justify-between shadow-[3px_3px_0px_#00875a] animate-in fade-in duration-200">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{{ successNotification }}</span>
                </div>
                <button @click="successNotification = ''" class="cursor-pointer font-bold text-base leading-none">×</button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div
                    class="lg:col-span-6 rounded-lg border-2 border-[#0d0d0d] bg-white p-5 shadow-[3px_3px_0px_#0d0d0d] flex flex-col justify-between space-y-5">
                    <div>
                        <div class="flex items-center justify-between border-b-2 border-[#0d0d0d] pb-3">
                            <h2 class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">
                                [1. TIMER TRACKING BACAAN]
                            </h2>
                            <div class="flex items-center gap-1.5">
                                <span v-if="currentBookTimer.isRunning"
                                    class="inline-flex items-center gap-1 rounded-[3px] border border-[#ff4800] bg-[#fff0eb] px-2 py-0.5 font-mono text-[11px] font-bold text-[#ff4800]">
                                    <span class="h-1.5 w-1.5 rounded-full bg-[#ff4800] animate-ping"></span>
                                    BERJALAN
                                </span>
                                <span v-else-if="currentBookTimer.isPaused"
                                    class="inline-flex items-center gap-1 rounded-[3px] border border-[#ffb800] bg-[#fffbf0] px-2 py-0.5 font-mono text-[11px] font-bold text-[#d97706]">
                                    JEDA
                                </span>
                                <span v-else-if="trackingState === 'stopped'"
                                    class="inline-flex items-center gap-1 rounded-[3px] border border-[#00875a] bg-[#eafaf1] px-2 py-0.5 font-mono text-[11px] font-bold text-[#00875a]">
                                    SELESAI (STOPPED)
                                </span>
                                <span v-else class="font-mono text-[11px] font-bold text-[#57534e]">
                                    [READY / IDLE]
                                </span>
                            </div>
                        </div>

                        <div class="my-6 text-center">
                            <div
                                class="inline-block rounded-[4px] border-2 border-[#0d0d0d] bg-[#faf8f5] px-6 py-4 shadow-[3px_3px_0px_#0d0d0d]">
                                <span
                                    class="font-mono text-3xl sm:text-5xl font-bold tracking-wider tabular-nums text-[#0d0d0d]">
                                    {{ timerDisplay }}
                                </span>
                            </div>
                            <p class="mt-2 text-xs text-[#57534e] font-mono">
                                Jam : Menit : Detik
                            </p>
                        </div>

                        <div v-if="currentBookTimer.isRunning || currentBookTimer.isPaused" class="mb-4">
                            <div v-if="currentElapsedSeconds < 60"
                                class="rounded-[4px] border border-[#ff4800] bg-[#fff0eb] p-2.5 text-center font-mono text-xs font-bold text-[#ff4800]">
                                <span>⏳ Wajib tracking minimal 1 menit (sisa {{ 60 - currentElapsedSeconds }} detik)</span>
                            </div>
                            <div v-else
                                class="rounded-[4px] border border-[#00875a] bg-[#eafaf1] p-2.5 text-center font-mono text-xs font-bold text-[#00875a]">
                                <span>✓ Durasi valid ({{ timer.formatDuration(currentElapsedSeconds) }}). Anda dapat menekan Stop untuk input halaman.</span>
                            </div>
                        </div>

                        <div class="space-y-2.5">
                            <div v-if="trackingState === 'idle'">
                                <button type="button" @click="handleStart"
                                    class="w-full cursor-pointer flex items-center justify-center gap-2 rounded-[4px] border-2 border-[#893c1e] bg-[#0d0d0d] py-3.5 font-mono text-sm font-bold uppercase text-white shadow-[3px_3px_0px_#893c1e] transition-all hover:bg-[#262626] hover:shadow-[4px_4px_0px_#ff4800] active:translate-x-0.5 active:translate-y-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    <span>Mulai Tracking Bacaan</span>
                                </button>
                            </div>

                            <div v-else-if="currentBookTimer.isRunning" class="grid grid-cols-2 gap-2.5">
                                <button type="button" @click="handlePause"
                                    class="cursor-pointer flex items-center justify-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-[#f3ede2] py-3 font-mono text-xs sm:text-sm font-bold uppercase text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <rect x="6" y="4" width="4" height="16" />
                                        <rect x="14" y="4" width="4" height="16" />
                                    </svg>
                                    <span>Jeda</span>
                                </button>
                                <button type="button" @click="handleStop" :disabled="currentElapsedSeconds < 60"
                                    class="cursor-pointer flex items-center justify-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] py-3 font-mono text-xs sm:text-sm font-bold uppercase text-white shadow-[2px_2px_0px_#0d0d0d] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5"
                                    :class="currentElapsedSeconds >= 60 ? 'bg-[#ff4800] hover:bg-[#e03f00]' : 'bg-[#57534e]'">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <rect x="4" y="4" width="16" height="16" />
                                    </svg>
                                    <span>Stop Tracking</span>
                                </button>
                            </div>

                            <div v-else-if="currentBookTimer.isPaused" class="space-y-2.5">
                                <div class="grid grid-cols-2 gap-2.5">
                                    <button type="button" @click="handleResume"
                                        class="cursor-pointer flex items-center justify-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] py-3 font-mono text-xs sm:text-sm font-bold uppercase text-white shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#262626] active:translate-x-0.5 active:translate-y-0.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                            fill="currentColor">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                        <span>Lanjut</span>
                                    </button>
                                    <button type="button" @click="handleStop" :disabled="currentElapsedSeconds < 60"
                                        class="cursor-pointer flex items-center justify-center gap-1.5 rounded-[4px] border-2 border-[#0d0d0d] py-3 font-mono text-xs sm:text-sm font-bold uppercase text-white shadow-[2px_2px_0px_#0d0d0d] transition-all disabled:opacity-40 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5"
                                        :class="currentElapsedSeconds >= 60 ? 'bg-[#ff4800] hover:bg-[#e03f00]' : 'bg-[#57534e]'">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                            fill="currentColor">
                                            <rect x="4" y="4" width="16" height="16" />
                                        </svg>
                                        <span>Stop Tracking</span>
                                    </button>
                                </div>
                                <button type="button" @click="handleReset"
                                    class="w-full cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white py-2.5 font-mono text-xs font-bold uppercase text-[#57534e] hover:text-[#0d0d0d] hover:bg-[#f3ede2] shadow-[2px_2px_0px_#0d0d0d] transition-colors active:translate-x-0.5 active:translate-y-0.5">
                                    ↺ Ulangi / Batalkan Sesi Ini
                                </button>
                            </div>

                            <div v-else-if="trackingState === 'stopped'">
                                <button type="button" @click="handleReset"
                                    class="w-full cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white py-2.5 font-mono text-xs font-bold uppercase text-[#57534e] hover:text-[#0d0d0d] hover:bg-[#f3ede2] shadow-[2px_2px_0px_#0d0d0d]">
                                    ↺ Ulangi / Batalkan Sesi Ini
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-[4px] border border-[#e5dfd3] bg-[#faf8f5] p-3 text-xs leading-relaxed text-[#57534e]">
                        <p class="font-bold text-[#44403c]">[FLOW TRACKING]:</p>
                        <p class="mt-0.5">Start → Membaca (timer berjalan di background, minimal 1 menit) → Stop → Masukkan halaman yang dibaca → Submit.</p>
                    </div>
                </div>

                <div class="lg:col-span-6 rounded-lg border-2 border-[#0d0d0d] bg-white p-5 shadow-[3px_3px_0px_#0d0d0d] flex flex-col justify-between">
                    <div v-if="trackingState !== 'stopped'" class="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <div class="h-14 w-14 rounded-full border-2 border-[#0d0d0d] bg-[#f3ede2] flex items-center justify-center text-[#0d0d0d]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div class="space-y-1">
                            <h3 class="font-mono text-sm font-bold uppercase text-[#0d0d0d]">
                                {{ currentBookTimer.isRunning ? 'Sesi Membaca Sedang Berjalan' : 'Tekan Start Untuk Mulai' }}
                            </h3>
                            <p class="text-xs text-[#57534e] max-w-sm">
                                {{ currentBookTimer.isRunning
                                    ? 'Silakan membaca buku Anda. Setelah selesai (minimal 1 menit), tekan tombol Stop Tracking di sebelah kiri untuk memasukkan jumlah halaman yang telah dibaca.'
                                    : 'Mulai timer di sebelah kiri saat Anda siap membaca. Form input halaman akan terbuka otomatis setelah Anda menekan Stop.' }}
                            </p>
                        </div>
                    </div>

                    <form v-else @submit.prevent="handleSubmitSession" class="space-y-4">
                        <div class="border-b-2 border-[#0d0d0d] pb-3 flex items-center justify-between">
                            <h2 class="font-mono text-xs font-bold uppercase tracking-wider text-[#44403c]">
                                [2. INPUT HASIL BACAAN]
                            </h2>
                            <span class="font-mono text-[11px] font-bold text-[#00875a]">
                                SIAP DISIMPAN
                            </span>
                        </div>

                        <div class="rounded-[4px] border-2 border-[#00875a] bg-[#eafaf1] p-3 font-mono text-xs flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                                    class="text-[#00875a]">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span class="font-bold text-[#00875a]">DURASI TERCATAT:</span>
                            </div>
                            <span class="text-sm font-bold text-[#00875a] tabular-nums">
                                {{ timer.formatDuration(lockedDurationSeconds) }}
                            </span>
                        </div>

                        <div class="space-y-2">
                            <label class="block font-mono text-xs font-bold uppercase text-[#0d0d0d]">
                                Masukkan Jumlah Halaman Yang Dibaca:
                            </label>

                            <div class="flex items-center gap-3">
                                <button type="button" @click="decrementPages"
                                    class="w-11 h-11 cursor-pointer flex items-center justify-center bg-[#f3ede2] border-2 border-[#0d0d0d] rounded-[4px] hover:bg-white text-[#0d0d0d] font-mono font-bold text-xl shadow-[2px_2px_0px_#0d0d0d] active:translate-x-0.5 active:translate-y-0.5 focus:outline-none"
                                    aria-label="Kurangi satu halaman">
                                    -
                                </button>

                                <div class="relative flex-1">
                                    <input v-model.number="sessionPagesAdded" type="number" min="1"
                                        placeholder="0"
                                        class="w-full h-11 text-center bg-white border-2 border-[#0d0d0d] rounded-[4px] font-mono text-lg font-bold tabular-nums text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] outline-none focus:border-[#0047ff]" />
                                    <span class="absolute right-3 top-3 font-mono text-xs font-bold text-[#57534e]">HAL</span>
                                </div>

                                <button type="button" @click="incrementPages"
                                    class="w-11 h-11 cursor-pointer flex items-center justify-center bg-[#f3ede2] border-2 border-[#0d0d0d] rounded-[4px] hover:bg-white text-[#0d0d0d] font-mono font-bold text-xl shadow-[2px_2px_0px_#0d0d0d] active:translate-x-0.5 active:translate-y-0.5 focus:outline-none"
                                    aria-label="Tambah satu halaman">
                                    +
                                </button>
                            </div>

                            <div class="flex flex-wrap items-center gap-1.5 pt-1">
                                <button type="button" @click="addQuickPages(5)"
                                    class="cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5">
                                    +5 HAL
                                </button>
                                <button type="button" @click="addQuickPages(10)"
                                    class="cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5">
                                    +10 HAL
                                </button>
                                <button type="button" @click="addQuickPages(25)"
                                    class="cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5">
                                    +25 HAL
                                </button>
                                <button v-if="remainingPages > 0" type="button" @click="fillRemainingPages"
                                    class="cursor-pointer rounded-[4px] border border-[#00875a] bg-[#eafaf1] px-2.5 py-1 font-mono text-xs font-bold text-[#00875a] shadow-[1px_1px_0px_#00875a] hover:bg-[#d1f5e0] active:translate-x-0.5 active:translate-y-0.5">
                                    TAMATKAN ({{ remainingPages }} HAL)
                                </button>
                            </div>

                            <div class="rounded-[4px] border border-[#e5dfd3] bg-[#faf8f5] px-3 py-2 font-mono text-xs flex items-center justify-between">
                                <span class="text-[#57534e]">Hasil Progres Buku:</span>
                                <span class="font-bold text-[#0d0d0d]">
                                    {{ selectedBook.pagesRead || 0 }} hal → <strong class="text-[#0047ff]">{{ projectedPagesRead }}</strong> / {{ selectedBook.totalPages || 0 }} hal
                                </span>
                            </div>
                        </div>

                        <div class="space-y-1.5 border-t border-[#e5dfd3] pt-3">
                            <label class="block font-mono text-xs font-bold uppercase text-[#0d0d0d]">
                                Tanggal Sesi:
                            </label>
                            <input v-model="sessionDateString" type="date" :max="todayDateString"
                                class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-2 font-mono text-xs font-bold text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] outline-none focus:border-[#0047ff]" />
                        </div>

                        <div class="pt-2">
                            <button type="submit" :disabled="!sessionPagesAdded || Number(sessionPagesAdded) <= 0"
                                class="w-full cursor-pointer flex items-center justify-center gap-2 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] py-3.5 font-mono text-sm font-bold uppercase text-white shadow-[3px_3px_0px_#0d0d0d] transition-all hover:bg-[#262626] hover:shadow-[4px_4px_0px_#ff4800] disabled:opacity-50 disabled:cursor-not-allowed active:translate-x-0.5 active:translate-y-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                                    <polyline points="17 21 17 13 7 13 7 21" />
                                    <polyline points="7 3 7 8 15 8" />
                                </svg>
                                <span>Simpan Sesi Tracking</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div class="space-y-4 pt-4">
                <div class="flex items-center gap-2 border-b-2 border-[#0d0d0d] pb-2 overflow-x-auto">
                    <button type="button" @click="activeTab = 'history'"
                        class="cursor-pointer rounded-[4px] px-3.5 py-2 font-mono text-xs sm:text-sm font-bold uppercase transition-all"
                        :class="activeTab === 'history'
                            ? 'bg-[#0d0d0d] text-white border border-[#86755d]'
                            : 'bg-white border border-[#b7ab86] text-[#0d0d0d] hover:bg-[#f3ede2]'">
                        Riwayat Sesi Buku ({{ bookHistorySessions.length }})
                    </button>
                    <button type="button" @click="activeTab = 'stats'"
                        class="cursor-pointer rounded-[4px] px-3.5 py-2 font-mono text-xs sm:text-sm font-bold uppercase transition-all"
                        :class="activeTab === 'stats'
                            ? 'bg-[#0d0d0d] text-white border border-[#86755d]'
                            : 'bg-white border border-[#b7ab86] text-[#0d0d0d] hover:bg-[#f3ede2]'">
                        Statistik Global
                    </button>
                </div>
                <div v-show="activeTab === 'history'" class="space-y-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="font-mono text-sm font-bold uppercase text-[#0d0d0d]">
                                Riwayat Membaca: {{ selectedBook.title }}
                            </h3>
                            <p class="text-xs text-[#57534e]">Menampilkan seluruh histori sesi baca buku ini.</p>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div class="relative rounded-lg border-2 border-[#0d0d0d] bg-white p-4 shadow-[3px_3px_0px_#0d0d0d] space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="font-mono text-xs font-bold uppercase text-[#44403c]">[READING PACE BUKU]</span>
                                <div class="relative">
                                    <button type="button" @click.stop="toggleHistoryTooltip('pace')"
                                        class="cursor-pointer flex h-6 w-6 items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d] font-mono text-xs font-bold shadow-[1px_1px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5"
                                        title="Rumus Perhitungan Reading Pace" aria-label="Rumus Perhitungan Reading Pace">
                                        i
                                    </button>

                                    <div v-if="activeHistoryTooltip === 'pace'" @click.stop
                                        class="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 max-w-[calc(100vw-2.5rem)] rounded-lg border-2 border-[#0d0d0d] bg-[#0d0d0d] p-3 text-white shadow-[4px_4px_0px_#0047ff] animate-in fade-in zoom-in-95 duration-150">
                                        <div class="flex items-center justify-between border-b border-[#333] pb-1.5 mb-2">
                                            <span class="font-mono text-[11px] font-bold text-[#0047ff] uppercase">[RUMUS READING PACE]</span>
                                            <button type="button" @click.stop="activeHistoryTooltip = null"
                                                class="text-white hover:text-[#ff4800] text-sm font-bold leading-none cursor-pointer">×</button>
                                        </div>
                                        <div class="font-mono text-[11px] space-y-1.5 text-[#e5dfd3]">
                                            <p class="font-semibold text-white">
                                                = Total Durasi Sesi ÷ Total Halaman Dibaca
                                            </p>
                                            <p class="text-[10px] text-[#a8a29e] leading-normal">
                                                Dihitung khusus dari seluruh riwayat sesi buku ini yang memiliki catatan durasi timer.
                                            </p>
                                            <div class="mt-2 rounded-[4px] border border-[#333] bg-[#1a1a1a] p-2 space-y-1 text-[10px]">
                                                <div class="flex justify-between">
                                                    <span class="text-[#a8a29e]">Total Durasi:</span>
                                                    <span class="font-bold text-white tabular-nums">{{ timer.formatDuration(bookPaceStats.totalDuration) }}</span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span class="text-[#a8a29e]">Total Halaman:</span>
                                                    <span class="font-bold text-white tabular-nums">{{ bookPaceStats.totalPages }} hal ({{ bookPaceStats.sessionsCount }} sesi)</span>
                                                </div>
                                                <div class="flex justify-between border-t border-[#333] pt-1 text-[#0047ff]">
                                                    <span class="font-bold">Hasil Pace:</span>
                                                    <span class="font-bold tabular-nums">{{ bookReadingPaceDisplay }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-baseline gap-2 pt-0.5">
                                <span class="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#0047ff]">
                                    {{ bookReadingPaceDisplay }}
                                </span>
                            </div>
                            <p class="text-xs text-[#57534e] font-mono">
                                {{ bookSpeedPerHourDisplay }}
                                <span v-if="bookPaceStats.sessionsCount > 0" class="text-[#78716c]">· {{ bookPaceStats.sessionsCount }} sesi timer</span>
                            </p>
                        </div>

                        <div class="relative rounded-lg border-2 border-[#0d0d0d] bg-white p-4 shadow-[3px_3px_0px_#0d0d0d] space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="font-mono text-xs font-bold uppercase text-[#44403c]">[ESTIMASI SISA WAKTU]</span>
                                <div class="relative">
                                    <button type="button" @click.stop="toggleHistoryTooltip('estimate')"
                                        class="cursor-pointer flex h-6 w-6 items-center justify-center rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d] font-mono text-xs font-bold shadow-[1px_1px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5"
                                        title="Rumus Perhitungan Estimasi Waktu" aria-label="Rumus Perhitungan Estimasi Waktu">
                                        i
                                    </button>

                                    <div v-if="activeHistoryTooltip === 'estimate'" @click.stop
                                        class="absolute right-0 top-full mt-2 z-50 w-72 sm:w-80 max-w-[calc(100vw-2.5rem)] rounded-lg border-2 border-[#0d0d0d] bg-[#0d0d0d] p-3 text-white shadow-[4px_4px_0px_#00875a] animate-in fade-in zoom-in-95 duration-150">
                                        <div class="flex items-center justify-between border-b border-[#333] pb-1.5 mb-2">
                                            <span class="font-mono text-[11px] font-bold text-[#00875a] uppercase">[RUMUS ESTIMASI WAKTU]</span>
                                            <button type="button" @click.stop="activeHistoryTooltip = null"
                                                class="text-white hover:text-[#ff4800] text-sm font-bold leading-none cursor-pointer">×</button>
                                        </div>
                                        <div class="font-mono text-[11px] space-y-1.5 text-[#e5dfd3]">
                                            <p class="font-semibold text-white">
                                                = Sisa Halaman × Reading Pace Buku
                                            </p>
                                            <p class="text-[10px] text-[#a8a29e] leading-normal">
                                                Memprediksi total waktu yang dibutuhkan untuk menuntaskan sisa halaman buku ini berdasarkan ritme baca historis Anda.
                                            </p>
                                            <div class="mt-2 rounded-[4px] border border-[#333] bg-[#1a1a1a] p-2 space-y-1 text-[10px]">
                                                <div class="flex justify-between">
                                                    <span class="text-[#a8a29e]">Sisa Halaman:</span>
                                                    <span class="font-bold text-white tabular-nums">{{ remainingPages }} hal</span>
                                                </div>
                                                <div class="flex justify-between">
                                                    <span class="text-[#a8a29e]">Reading Pace:</span>
                                                    <span class="font-bold text-white tabular-nums">{{ bookPaceStats.secondsPerPage > 0 ? `${Math.round(bookPaceStats.secondsPerPage)} dtk/hal` : '-' }}</span>
                                                </div>
                                                <div class="flex justify-between border-t border-[#333] pt-1 text-[#00875a]">
                                                    <span class="font-bold">Estimasi Selesai:</span>
                                                    <span class="font-bold tabular-nums">{{ bookEstimatedRemainingDisplay }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-baseline gap-2 pt-0.5">
                                <span class="font-mono text-2xl sm:text-3xl font-bold tabular-nums"
                                    :class="isBookCompleted ? 'text-[#00875a]' : (bookEstimatedRemainingSeconds ? 'text-[#0d0d0d]' : 'text-[#57534e]')">
                                    {{ bookEstimatedRemainingDisplay }}
                                </span>
                            </div>
                            <p class="text-xs text-[#57534e] font-mono">
                                <span v-if="isBookCompleted" class="text-[#00875a] font-bold">✓ Buku telah selesai dibaca</span>
                                <span v-else>Sisa <strong class="text-[#0d0d0d] tabular-nums">{{ remainingPages }}</strong> dari {{ selectedBook?.totalPages || 0 }} hal</span>
                            </p>
                        </div>
                    </div>

                    <h3 class="font-mono text-xs uppercase text-[#0d0d0d] mt-8 border-[#0d0d0d] border-t-2 pt-3">
                        Daftar Riwayat Sesi Baca Buku Ini ({{ bookHistorySessions.length }} sesi)
                    </h3>

                    <div v-if="bookHistorySessions.length === 0"
                        class="rounded-lg border-2 border-[#0d0d0d] bg-white p-8 text-center shadow-[3px_3px_0px_#0d0d0d]">
                        <p class="font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">
                            [BELUM ADA RIWAYAT SESI BACA UNTUK BUKU INI]
                        </p>
                        <p class="mt-1 text-xs text-[#57534e]">Gunakan timer tracking di atas untuk mulai mencatat sesi baca.</p>
                    </div>
                    <div v-else class="space-y-2.5">
                        <div v-for="(session, idx) in reversedBookHistory" :key="session.id || idx"
                            class="rounded-lg border-2 border-[#0d0d0d] bg-white p-3.5 sm:p-4 shadow-[2px_2px_0px_#0d0d0d] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:bg-[#faf8f5]">
                            <div class="min-w-0 space-y-1">
                                <div class="flex flex-wrap items-center gap-2 font-mono text-xs">
                                    <span class="font-bold text-[#0d0d0d]">{{ formatSessionDate(session.date) }}</span>
                                    <span class="rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] px-1.5 py-0.5 font-bold text-[#00875a]">
                                        +{{ session.pagesAdded }} HAL
                                    </span>
                                    <span v-if="session.endPage !== undefined && session.startPage !== undefined"
                                        class="text-[#57534e]">
                                        (Hal {{ session.startPage }} - {{ session.endPage }})
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-2 font-mono text-xs text-[#57534e] mt-2">
                                    <span class="inline-flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span v-if="session.duration !== null && session.duration !== undefined && session.duration > 0" class="text-[#0d0d0d] font-bold">
                                            Durasi: {{ timer.formatDuration(session.duration) }}
                                        </span>
                                        <span v-else class="text-[#57534e]">
                                            Tanpa Timer / Manual
                                        </span>
                                    </span>
                                    <span v-if="session.duration && session.pagesAdded > 0" class="text-[#0047ff] font-bold">
                                        · {{ timer.formatPace(session.duration / session.pagesAdded) }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <button @click="openEditSessionModal(session)" type="button"
                                    class="cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-white px-2.5 py-1 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] hover:bg-[#f3ede2] active:translate-x-0.5 active:translate-y-0.5">
                                    Edit
                                </button>
                                <button @click="handleDeleteSession(session)" type="button"
                                    class="cursor-pointer rounded-[4px] border border-[#ff4800] bg-white px-2.5 py-1 font-mono text-xs font-bold text-[#ff4800] shadow-[1px_1px_0px_#ff4800] hover:bg-[#fff0eb] active:translate-x-0.5 active:translate-y-0.5">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-show="activeTab === 'stats'" class="space-y-6">

                    <div class="space-y-3">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <h3 class="font-mono text-xs sm:text-sm font-bold uppercase text-[#0d0d0d]">
                                    [RINGKASAN DATA METRIK]
                                </h3>
                                <p class="text-xs text-[#57534e]">Dihitung dari hari ini ke belakang.</p>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button v-for="opt in metricRangeOptions" :key="opt.key" type="button"
                                    @click="selectedMetricRangeKey = opt.key"
                                    class="cursor-pointer rounded-[4px] px-2.5 py-1 font-mono text-xs font-bold uppercase transition-all"
                                    :class="selectedMetricRangeKey === opt.key
                                        ? 'bg-[#0d0d0d] text-white border border-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d]'
                                        : 'bg-[#f3ede2] text-[#0d0d0d] border border-[#0d0d0d] hover:bg-white'">
                                    {{ opt.label }}
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div
                                class="rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d] space-y-1">
                                <span class="font-mono text-xs font-bold uppercase text-[#44403c]">[JUMLAH HALAMAN]</span>
                                <div class="flex items-baseline gap-2 pt-1">
                                    <span class="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#0d0d0d]">
                                        {{ independentMetricStats.totalPages }}
                                    </span>
                                    <span class="font-mono text-xs font-bold uppercase text-[#57534e]">HALAMAN</span>
                                </div>
                                <p class="text-xs text-[#57534e] font-mono">Total seluruh buku ({{ currentMetricRangeLabel }} terakhir)</p>
                            </div>

                            <div
                                class="rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d] space-y-1">
                                <span class="font-mono text-xs font-bold uppercase text-[#44403c]">[TOTAL DURASI MEMBACA]</span>
                                <div class="flex items-baseline gap-2 pt-1">
                                    <span class="font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#00875a]">
                                        {{ independentMetricDurationDisplay }}
                                    </span>
                                </div>
                                <p class="text-xs text-[#57534e] font-mono">Dari {{ independentMetricStats.sessionsWithDurationCount }} sesi berdurasi</p>
                            </div>

                            <div
                                class="rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d] space-y-1">
                                <span class="font-mono text-xs font-bold uppercase text-[#44403c]">[READING PACE]</span>
                                <div class="flex items-baseline gap-2 pt-1">
                                    <span class="font-mono text-xl sm:text-2xl font-bold tabular-nums text-[#0047ff]">
                                        {{ independentMetricPaceDisplay }}
                                    </span>
                                </div>
                                <p class="text-xs text-[#57534e] font-mono">
                                    {{ independentMetricSpeedPerHourDisplay }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex flex-wrap items-center justify-between gap-3.5 rounded-lg border-2 border-[#0d0d0d] bg-white p-3.5 sm:p-4 shadow-[3px_3px_0px_#0d0d0d]">
                        <div class="flex items-center gap-2">
                            <button @click="shift7DayPeriod(-1)" type="button"
                                class="cursor-pointer flex h-8 w-8 items-center justify-center rounded-[4px] border-2 border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5"
                                title="7 Hari Sebelumnya" aria-label="7 Hari Sebelumnya">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            </button>
                            <button @click="shift7DayPeriod(1)" type="button" :disabled="periodOffsetDays >= 0"
                                class="cursor-pointer flex h-8 w-8 items-center justify-center rounded-[4px] border-2 border-[#0d0d0d] bg-[#f3ede2] text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
                                title="7 Hari Berikutnya" aria-label="7 Hari Berikutnya">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                            <span class="font-mono text-xs sm:text-sm font-bold text-[#0d0d0d] uppercase">
                                PERIODE 7 HARI: <span class="text-[#0047ff]">{{ weekly7DayPeriodLabel }}</span>
                            </span>
                        </div>

                        <div v-if="periodOffsetDays < 0">
                            <button @click="resetPeriodToCurrent" type="button"
                                class="cursor-pointer rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2.5 py-1 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d] hover:bg-white active:translate-x-0.5 active:translate-y-0.5">
                                Kembali ke 7 Hari Terakhir
                            </button>
                        </div>
                    </div>

                    <div
                        class="rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d] space-y-4">
                        <div class="flex items-center justify-between border-b-2 border-[#0d0d0d] pb-2.5">
                            <h4 class="font-mono text-xs font-bold uppercase text-[#0d0d0d]">
                                [DISTRIBUSI HARIAN: 7 HARI]
                            </h4>
                            <span class="font-mono text-xs font-bold text-[#57534e]">
                                {{ weekly7DayPeriodLabel }}
                            </span>
                        </div>

                        <div class="grid grid-cols-7 gap-1.5 sm:gap-2 pt-2">
                            <div v-for="day in weekly7DayStats.dailyBreakdown" :key="day.dateStr"
                                class="flex flex-col items-center gap-1.5 min-w-0">
                                <span class="font-mono text-[11px] font-bold tabular-nums text-[#0d0d0d]">
                                    {{ day.pages > 0 ? `${day.pages}h` : '-' }}
                                </span>
                                <div class="h-24 sm:h-28 w-full rounded-[2px] border border-[#0d0d0d] bg-[#f3ede2] p-[1px] flex items-end">
                                    <div class="w-full bg-[#0d0d0d] transition-all duration-300"
                                        :style="{ height: `${day.percent}%` }"></div>
                                </div>
                                <span class="font-mono text-[9px] sm:text-[11px] font-bold text-[#44403c] truncate [word-spacing:-4px]">
                                    |{{ day.dayLabel }}|
                                </span>
                                <span class="font-mono text-[9px] text-[#57534e] truncate">
                                    {{ day.durationSec > 0 ? timer.formatDuration(day.durationSec) : '-' }}
                                </span>
                            </div>
                        </div>

                        <div
                            class="space-y-2 rounded-[4px] border-2 border-[#0d0d0d] bg-[#faf8f5] p-3.5 font-mono text-xs">
                            <div class="flex items-center justify-between border-b border-[#e5dfd3] pb-1.5">
                                <span class="font-bold uppercase text-[#44403c]">
                                    [DATA PERIODE 7 HARI INI]:
                                </span>

                                <span class="font-bold tabular-nums text-[#57534e]">
                                    {{ weekly7DayStats.totalSessions }} Total Sesi
                                </span>
                            </div>

                            <div class="space-y-1 pt-0.5">
                                <div class="flex items-center justify-between gap-3 border-b border-[#eee9e0] py-1">
                                    <span class="text-[#57534e]">
                                        Jumlah Halaman:
                                    </span>
                                    <strong class="shrink-0 font-bold tabular-nums text-[#0d0d0d]">
                                        +{{ weekly7DayStats.totalPages }} HAL
                                    </strong>
                                </div>

                                <div class="flex items-center justify-between gap-3 border-b border-[#eee9e0] py-1">
                                    <span class="text-[#57534e]">
                                        Total Durasi:
                                    </span>
                                    <strong class="shrink-0 font-bold tabular-nums text-[#00875a]">
                                        {{ weekly7DayDurationDisplay }}
                                    </strong>
                                </div>

                                <div class="flex items-center justify-between gap-3 py-1">
                                    <span class="text-[#57534e]">
                                        Reading Pace:
                                    </span>

                                    <div class="flex shrink-0 items-center gap-1">
                                        <strong class="font-bold tabular-nums text-[#0047ff]">
                                            {{ weekly7DayPaceDisplay }}
                                        </strong>

                                        <span v-if="weekly7DaySpeedPerHourDisplay" class="text-[11px] text-[#57534e]">
                                            ({{ weekly7DaySpeedPerHourDisplay }})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        class="rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-5 shadow-[3px_3px_0px_#0d0d0d] space-y-3">
                        <h4 class="font-mono text-xs font-bold uppercase text-[#0d0d0d]">
                            [BUKU YANG DIBACA DALAM PERIODE 7 HARI INI]
                        </h4>

                        <div v-if="weekly7DayStats.booksInPeriod.length === 0" class="py-4 text-center text-xs font-mono text-[#57534e]">
                            [TIDAK ADA AKTIVITAS MEMBACA PADA PERIODE 7 HARI INI]
                        </div> 

                        <div v-else class="divide-y divide-[#e5dfd3]">
                            <div v-for="item in weekly7DayStats.booksInPeriod" :key="item.book.id"
                                class="py-2.5 flex items-center justify-between gap-3">
                                <div class="flex items-center gap-2.5 min-w-0">
                                    <div class="h-10 w-8 shrink-0 overflow-hidden rounded-[2px] border border-[#0d0d0d] bg-[#f3ede2]">
                                        <img v-if="item.book.imageUrl" :src="item.book.imageUrl" class="h-full w-full object-cover" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="font-mono text-xs font-bold text-[#0d0d0d] truncate">{{ item.book.title }}</p>
                                        <p class="font-mono text-[11px] text-[#57534e]">{{ item.sessionsCount }} sesi baca</p>
                                    </div>
                                </div>
                                <div class="text-right shrink-0 font-mono text-xs">
                                    <span class="font-bold text-[#00875a]">+{{ item.pagesAdded }} HAL</span>
                                    <p class="text-[11px] text-[#57534e]">
                                        {{ item.totalDuration > 0 ? timer.formatDuration(item.totalDuration) : 'Tanpa timer' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showBookPicker" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-[2px]" @click="showBookPicker = false"></div>
            <div
                class="relative bg-white rounded-lg shadow-[8px_8px_0px_#0d0d0d] border-2 border-[#0d0d0d] w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
                <div class="p-4 border-b-2 border-[#0d0d0d] flex items-center justify-between bg-white">
                    <h2 class="font-mono text-sm font-bold uppercase text-[#0d0d0d]">[PILIH BUKU UNTUK DILACAK]</h2>
                    <button @click="showBookPicker = false" type="button"
                        class="cursor-pointer rounded-[4px] border border-transparent p-1 hover:border-[#0d0d0d] hover:bg-[#f3ede2]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>
                <div class="p-4 max-h-96 overflow-y-auto space-y-2">
                    <div v-for="b in books" :key="b.id" @click="selectBook(b)"
                        class="cursor-pointer flex items-center gap-3 p-2.5 rounded-[4px] border-2 transition-all"
                        :class="selectedBook?.id === b.id
                            ? 'border-[#0047ff] bg-[#f0f4ff]'
                            : 'border-[#0d0d0d] bg-white hover:bg-[#f3ede2]'">
                        <div class="h-12 w-9 shrink-0 overflow-hidden rounded-[2px] border border-[#0d0d0d] bg-[#f3ede2]">
                            <img v-if="b.imageUrl" :src="b.imageUrl" class="h-full w-full object-cover" />
                        </div>
                        <div class="min-w-0 flex-1">
                            <h4 class="font-mono text-xs font-bold text-[#0d0d0d] truncate">{{ b.title }}</h4>
                            <p class="font-mono text-[11px] text-[#57534e]">
                                {{ b.pagesRead || 0 }} / {{ b.totalPages || 0 }} HAL ({{ Math.round(((b.pagesRead || 0) / (b.totalPages || 1)) * 100) }}%)
                            </p>
                        </div>
                        <span v-if="selectedBook?.id === b.id" class="font-mono text-xs font-bold text-[#0047ff]">
                            [AKTIF]
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="isEditSessionModalOpen && editingSession" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-[#0d0d0d]/60 backdrop-blur-[2px]" @click="isEditSessionModalOpen = false"></div>
            <div
                class="relative bg-white rounded-lg shadow-[8px_8px_0px_#0d0d0d] border-2 border-[#0d0d0d] w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
                <div class="p-4 border-b-2 border-[#0d0d0d] flex items-center justify-between bg-white">
                    <h2 class="font-mono text-sm font-bold uppercase text-[#0d0d0d]">[EDIT SESI BACA]</h2>
                    <button @click="isEditSessionModalOpen = false" type="button"
                        class="cursor-pointer rounded-[4px] border border-transparent p-1 hover:border-[#0d0d0d] hover:bg-[#f3ede2]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="saveEditedSession" class="p-4 space-y-4">
                    <div class="space-y-1">
                        <label class="block font-mono text-xs font-bold uppercase text-[#0d0d0d]">Tanggal:</label>
                        <input v-model="editSessionDate" type="date"
                            class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] outline-none focus:border-[#0047ff]" />
                    </div>

                    <div class="space-y-1">
                        <label class="block font-mono text-xs font-bold uppercase text-[#0d0d0d]">Jumlah Halaman Dibaca:</label>
                        <input v-model.number="editSessionPages" type="number" min="1"
                            class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] outline-none focus:border-[#0047ff]" />
                    </div>

                    <div class="space-y-1.5">
                        <div class="flex items-center justify-between">
                            <label class="block font-mono text-xs font-bold uppercase text-[#0d0d0d]">Durasi (Menit & Detik):</label>
                            <button type="button" @click="clearEditDuration"
                                class="font-mono text-[11px] text-[#ff4800] underline hover:text-[#0d0d0d]">
                                [Kosongkan / Null]
                            </button>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div>
                                <label class="block font-mono text-[10px] text-[#57534e]">Menit</label>
                                <input v-model.number="editSessionMinutes" type="number" min="0" placeholder="0"
                                    class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none focus:border-[#0047ff]" />
                            </div>
                            <div>
                                <label class="block font-mono text-[10px] text-[#57534e]">Detik</label>
                                <input v-model.number="editSessionSeconds" type="number" min="0" max="59" placeholder="0"
                                    class="w-full rounded-[4px] border-2 border-[#0d0d0d] bg-white px-3 py-1.5 font-mono text-xs font-bold text-[#0d0d0d] shadow-[1.5px_1.5px_0px_#0d0d0d] outline-none focus:border-[#0047ff]" />
                            </div>
                        </div>
                        <div v-if="historicalPaceSecondsPerPage > 0" class="pt-1">
                            <button type="button" @click="applyEditEstimateDuration"
                                class="cursor-pointer text-left font-mono text-[11px] text-[#0047ff] hover:underline">
                                ⚡ Gunakan Estimasi: ~{{ Math.max(1, Math.round(((Number(editSessionPages) || 1) * historicalPaceSecondsPerPage) / 60)) }} mnt
                            </button>
                        </div>
                    </div>

                    <div class="flex gap-2.5 pt-2">
                        <button type="button" @click="isEditSessionModalOpen = false"
                            class="flex-1 cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-white py-2 font-mono text-xs font-bold uppercase text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#f3ede2]">
                            Batal
                        </button>
                        <button type="submit"
                            class="flex-1 cursor-pointer rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] py-2 font-mono text-xs font-bold uppercase text-white shadow-[2px_2px_0px_#0d0d0d] hover:bg-[#262626]">
                            Simpan Perubahan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from '#imports'
import type { Book, ReadSession } from '~/types/book'

useHead({
    title: 'Tracking Bacaan'
})

const route = useRoute()
const router = useRouter()
const { books, loadBooks, saveBook, recalculateBookProgress, updateReadSession, deleteReadSession } = useBooks()
const timer = useReadingTimer()

const imageLoadError = ref(false)
const showBookPicker = ref(false)
const activeTab = ref<'history' | 'stats'>('history')
const successNotification = ref<string>('')

const sessionPagesAdded = ref<number | ''>('')
const lockedDurationSeconds = ref<number>(0)

const getTodayDateString = () => {
    const d = new Date()
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

const todayDateString = computed(() => getTodayDateString())
const sessionDateString = ref<string>(getTodayDateString())

const selectedBook = computed<Book | null>(() => {
    if (books.value.length === 0) return null
    const queryId = route.query.id || route.query.bookId
    if (queryId) {
        const found = books.value.find(b => String(b.id) === String(queryId))
        if (found) return found
    }
    const reading = books.value.find(b => (b.pagesRead || 0) > 0 && (b.pagesRead || 0) < (b.totalPages || 0))
    if (reading) return reading
    return books.value[0]
})

const selectBook = (b: Book) => {
    showBookPicker.value = false
    lockedDurationSeconds.value = 0
    sessionPagesAdded.value = ''
    successNotification.value = ''
    router.replace({ query: { ...route.query, id: b.id } })
}

const bookPercentage = computed(() => {
    if (!selectedBook.value || !selectedBook.value.totalPages) return 0
    return Math.round(((selectedBook.value.pagesRead || 0) / selectedBook.value.totalPages) * 100) || 0
})

const isBookCompleted = computed(() => {
    if (!selectedBook.value || !selectedBook.value.totalPages) return false
    return (selectedBook.value.pagesRead || 0) >= selectedBook.value.totalPages
})

const remainingPages = computed(() => {
    if (!selectedBook.value) return 0
    const total = selectedBook.value.totalPages || 0
    const read = selectedBook.value.pagesRead || 0
    return Math.max(0, total - read)
})

const projectedPagesRead = computed(() => {
    if (!selectedBook.value) return 0
    return (selectedBook.value.pagesRead || 0) + (Number(sessionPagesAdded.value) || 0)
})

const currentBookTimer = computed(() => {
    if (!selectedBook.value) {
        return { isRunning: false, isPaused: false, startTime: null, accumulatedSeconds: 0 }
    }
    return timer.getBookTimer(selectedBook.value.id)
})

const currentElapsedSeconds = computed(() => {
    if (!selectedBook.value) return 0
    return timer.getElapsedSecondsForBook(selectedBook.value.id)
})

const trackingState = computed<'idle' | 'running' | 'paused' | 'stopped'>(() => {
    if (lockedDurationSeconds.value > 0) return 'stopped'
    if (currentBookTimer.value.isRunning) return 'running'
    if (currentBookTimer.value.isPaused) return 'paused'
    return 'idle'
})

const timerDisplay = computed(() => {
    if (currentBookTimer.value.isRunning || currentBookTimer.value.isPaused) {
        return timer.formatTimer(currentElapsedSeconds.value)
    }
    if (lockedDurationSeconds.value > 0) {
        return timer.formatTimer(lockedDurationSeconds.value)
    }
    return '00:00:00'
})

const handleStart = () => {
    if (selectedBook.value) {
        lockedDurationSeconds.value = 0
        sessionPagesAdded.value = ''
        timer.start(selectedBook.value.id)
    }
}

const handlePause = () => {
    if (selectedBook.value) {
        timer.pause(selectedBook.value.id)
    }
}

const handleResume = () => {
    if (selectedBook.value) {
        timer.resume(selectedBook.value.id)
    }
}

const handleStop = () => {
    if (!selectedBook.value || currentElapsedSeconds.value < 60) return
    const finalSecs = timer.stop(selectedBook.value.id)
    lockedDurationSeconds.value = finalSecs
}

const handleReset = () => {
    if (selectedBook.value) {
        timer.reset(selectedBook.value.id)
    }
    lockedDurationSeconds.value = 0
    sessionPagesAdded.value = ''
    sessionDateString.value = getTodayDateString()
}

const incrementPages = () => {
    const current = Number(sessionPagesAdded.value) || 0
    sessionPagesAdded.value = current + 1
}

const decrementPages = () => {
    const current = Number(sessionPagesAdded.value) || 0
    if (current > 1) {
        sessionPagesAdded.value = current - 1
    } else {
        sessionPagesAdded.value = ''
    }
}

const addQuickPages = (amount: number) => {
    const current = Number(sessionPagesAdded.value) || 0
    sessionPagesAdded.value = current + amount
}

const fillRemainingPages = () => {
    if (remainingPages.value > 0) {
        sessionPagesAdded.value = remainingPages.value
    }
}

const historicalPaceSecondsPerPage = computed(() => {
    if (selectedBook.value && Array.isArray(selectedBook.value.readHistory)) {
        const bookSessionsWithDuration = selectedBook.value.readHistory.filter(
            (s: ReadSession) => s.duration !== null && s.duration !== undefined && s.duration > 0 && s.pagesAdded > 0
        )
        if (bookSessionsWithDuration.length > 0) {
            const totalDur = bookSessionsWithDuration.reduce((sum, s) => sum + Number(s.duration), 0)
            const totalPgs = bookSessionsWithDuration.reduce((sum, s) => sum + Number(s.pagesAdded), 0)
            if (totalPgs > 0) return totalDur / totalPgs
        }
    }
    let globalDur = 0
    let globalPgs = 0
    books.value.forEach(b => {
        if (Array.isArray(b.readHistory)) {
            b.readHistory.forEach((s: ReadSession) => {
                if (s.duration !== null && s.duration !== undefined && s.duration > 0 && s.pagesAdded > 0) {
                    globalDur += Number(s.duration)
                    globalPgs += Number(s.pagesAdded)
                }
            })
        }
    })
    return globalPgs > 0 ? globalDur / globalPgs : 0
})

const handleSubmitSession = async () => {
    const pagesToAdd = Number(sessionPagesAdded.value) || 0
    if (!selectedBook.value || pagesToAdd <= 0) return

    const duration = lockedDurationSeconds.value > 0 ? lockedDurationSeconds.value : null

    let sessionDate: Date
    if (sessionDateString.value) {
        const todayStr = getTodayDateString()
        if (sessionDateString.value === todayStr) {
            sessionDate = new Date()
        } else {
            const [y, m, d] = sessionDateString.value.split('-').map(Number)
            sessionDate = new Date(y, m - 1, d, 12, 0, 0)
        }
    } else {
        sessionDate = new Date()
    }

    const updatedBook = JSON.parse(JSON.stringify(selectedBook.value))
    if (!Array.isArray(updatedBook.readHistory)) {
        updatedBook.readHistory = []
    }

    const startPage = updatedBook.pagesRead || 0
    const endPage = startPage + pagesToAdd

    const newSession: ReadSession = {
        id: 'sess_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
        date: sessionDate.toISOString(),
        pagesAdded: pagesToAdd,
        duration: duration,
        startPage,
        endPage
    }

    updatedBook.readHistory.push(newSession)
    recalculateBookProgress(updatedBook)

    await saveBook(updatedBook)

    successNotification.value = `Sesi tracking berhasil disimpan: +${pagesToAdd} halaman (${timer.formatDuration(duration)})!`
    setTimeout(() => {
        if (successNotification.value) successNotification.value = ''
    }, 4000)

    if (selectedBook.value) {
        timer.reset(selectedBook.value.id)
    }
    lockedDurationSeconds.value = 0
    sessionPagesAdded.value = ''
    sessionDateString.value = getTodayDateString()
}

const activeHistoryTooltip = ref<'pace' | 'estimate' | null>(null)

const toggleHistoryTooltip = (type: 'pace' | 'estimate') => {
    if (activeHistoryTooltip.value === type) {
        activeHistoryTooltip.value = null
    } else {
        activeHistoryTooltip.value = type
    }
}

const bookPaceStats = computed(() => {
    if (!selectedBook.value || !Array.isArray(selectedBook.value.readHistory)) {
        return {
            totalDuration: 0,
            totalPages: 0,
            sessionsCount: 0,
            secondsPerPage: 0,
            pagesPerHour: 0
        }
    }

    const timedSessions = selectedBook.value.readHistory.filter(
        (s: ReadSession) => s.duration !== null && s.duration !== undefined && Number(s.duration) > 0 && Number(s.pagesAdded) > 0
    )

    const totalDuration = timedSessions.reduce((sum, s) => sum + Number(s.duration), 0)
    const totalPages = timedSessions.reduce((sum, s) => sum + Number(s.pagesAdded), 0)
    const secondsPerPage = totalPages > 0 ? totalDuration / totalPages : 0
    const pagesPerHour = totalDuration > 0 ? Math.round((totalPages / totalDuration) * 3600) : 0

    return {
        totalDuration,
        totalPages,
        sessionsCount: timedSessions.length,
        secondsPerPage,
        pagesPerHour
    }
})

const bookReadingPaceDisplay = computed(() => {
    if (bookPaceStats.value.secondsPerPage > 0) {
        return timer.formatPace(bookPaceStats.value.secondsPerPage)
    }
    return '-'
})

const bookSpeedPerHourDisplay = computed(() => {
    if (bookPaceStats.value.pagesPerHour > 0) {
        return `Kecepatan: ~${bookPaceStats.value.pagesPerHour} hal/jam`
    }
    return 'Belum ada sesi timer'
})

const bookEstimatedRemainingSeconds = computed(() => {
    if (!selectedBook.value) return 0
    const rem = remainingPages.value
    if (rem <= 0) return 0
    if (bookPaceStats.value.secondsPerPage > 0) {
        return Math.round(rem * bookPaceStats.value.secondsPerPage)
    }
    return null
})

const bookEstimatedRemainingDisplay = computed(() => {
    if (isBookCompleted.value || remainingPages.value <= 0) {
        return 'Selesai ✓'
    }
    if (bookEstimatedRemainingSeconds.value === null) {
        return 'Butuh Sesi Timer'
    }
    return timer.formatDuration(bookEstimatedRemainingSeconds.value)
})

const bookHistorySessions = computed<ReadSession[]>(() => {
    if (!selectedBook.value || !Array.isArray(selectedBook.value.readHistory)) return []
    return selectedBook.value.readHistory
})

const reversedBookHistory = computed<ReadSession[]>(() => {
    return [...bookHistorySessions.value].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const formatSessionDate = (dateStr: string) => {
    try {
        const d = new Date(dateStr)
        if (isNaN(d.getTime())) return dateStr
        return d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return dateStr
    }
}

const isEditSessionModalOpen = ref(false)
const editingSession = ref<ReadSession | null>(null)
const editSessionDate = ref('')
const editSessionPages = ref<number | ''>('')
const editSessionMinutes = ref<number | ''>('')
const editSessionSeconds = ref<number | ''>('')

const openEditSessionModal = (session: ReadSession) => {
    editingSession.value = session
    try {
        const d = new Date(session.date)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        editSessionDate.value = `${y}-${m}-${day}`
    } catch {
        editSessionDate.value = getTodayDateString()
    }
    editSessionPages.value = session.pagesAdded || ''

    if (session.duration !== null && session.duration !== undefined && session.duration > 0) {
        editSessionMinutes.value = Math.floor(session.duration / 60) || ''
        editSessionSeconds.value = (session.duration % 60) || ''
    } else {
        editSessionMinutes.value = ''
        editSessionSeconds.value = ''
    }

    isEditSessionModalOpen.value = true
}

const clearEditDuration = () => {
    editSessionMinutes.value = ''
    editSessionSeconds.value = ''
}

const applyEditEstimateDuration = () => {
    const pgs = Number(editSessionPages.value) || 1
    const totalSecs = Math.round(pgs * historicalPaceSecondsPerPage.value)
    editSessionMinutes.value = Math.floor(totalSecs / 60) || ''
    editSessionSeconds.value = (totalSecs % 60) || ''
}

const saveEditedSession = async () => {
    if (!selectedBook.value || !editingSession.value) return

    let dur: number | null = null
    const m = Number(editSessionMinutes.value) || 0
    const s = Number(editSessionSeconds.value) || 0
    const totalSecs = m * 60 + s
    if (totalSecs > 0) {
        dur = totalSecs
    }

    let sessionIso = editingSession.value.date
    if (editSessionDate.value) {
        const [y, m, d] = editSessionDate.value.split('-').map(Number)
        sessionIso = new Date(y, m - 1, d, 12, 0, 0).toISOString()
    }

    await updateReadSession(selectedBook.value.id!, editingSession.value.id || 0, {
        date: sessionIso,
        pagesAdded: Number(editSessionPages.value) || 0,
        duration: dur
    })

    isEditSessionModalOpen.value = false
    editingSession.value = null
}

const handleDeleteSession = async (session: ReadSession) => {
    if (!selectedBook.value) return
    if (confirm(`Hapus riwayat sesi ${session.pagesAdded} halaman ini?`)) {
        await deleteReadSession(selectedBook.value.id!, session.id || 0)
    }
}

type MetricRangeKey = '7D' | '14D' | '1M' | '3M'
const selectedMetricRangeKey = ref<MetricRangeKey>('7D')

const metricRangeOptions: { key: MetricRangeKey; label: string; days: number }[] = [
    { key: '7D', label: '7 Hari', days: 7 },
    { key: '14D', label: '14 Hari', days: 14 },
    { key: '1M', label: '1 Bulan', days: 30 },
    { key: '3M', label: '3 Bulan', days: 90 }
]

const currentMetricRangeLabel = computed(() => {
    const found = metricRangeOptions.find(o => o.key === selectedMetricRangeKey.value)
    return found ? found.label : '7 Hari'
})

const currentMetricDays = computed(() => {
    const found = metricRangeOptions.find(o => o.key === selectedMetricRangeKey.value)
    return found ? found.days : 7
})

const independentMetricStats = computed(() => {
    const now = new Date()
    const days = currentMetricDays.value
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - (days - 1), 0, 0, 0, 0)

    let totalPages = 0
    let totalDuration = 0
    let durationSessionsCount = 0
    let pacePages = 0
    let paceDuration = 0

    books.value.forEach(book => {
        if (Array.isArray(book.readHistory)) {
            book.readHistory.forEach((s: ReadSession) => {
                if (!s.date) return
                const d = new Date(s.date)
                if (!isNaN(d.getTime()) && d >= start && d <= end) {
                    const pgs = Number(s.pagesAdded) || 0
                    totalPages += pgs
                    const dur = s.duration !== null && s.duration !== undefined ? Number(s.duration) : 0
                    if (dur > 0) {
                        totalDuration += dur
                        durationSessionsCount++
                        if (pgs > 0) {
                            pacePages += pgs
                            paceDuration += dur
                        }
                    }
                }
            })
        }
    })

    return {
        totalPages,
        totalDuration,
        sessionsWithDurationCount: durationSessionsCount,
        pacePages,
        paceDuration
    }
})

const independentMetricDurationDisplay = computed(() => {
    const dur = independentMetricStats.value.totalDuration
    if (dur <= 0) return '0 mnt'
    return timer.formatDuration(dur)
})

const independentMetricPaceDisplay = computed(() => {
    const { pacePages, paceDuration } = independentMetricStats.value
    if (pacePages > 0 && paceDuration > 0) {
        const secPerPage = paceDuration / pacePages
        return timer.formatPace(secPerPage)
    }
    return 'Tanpa Durasi'
})

const independentMetricSpeedPerHourDisplay = computed(() => {
    const { pacePages, paceDuration } = independentMetricStats.value
    if (pacePages > 0 && paceDuration > 0) {
        const pagesPerHour = Math.round((pacePages / paceDuration) * 3600)
        return `Kecepatan: ~${pagesPerHour} hal/jam`
    }
    return 'Belum ada sesi dengan timer pada rentang ini'
})

const periodOffsetDays = ref<number>(0)

const shift7DayPeriod = (direction: number) => {
    periodOffsetDays.value += direction * 7
    if (periodOffsetDays.value > 0) periodOffsetDays.value = 0
}

const resetPeriodToCurrent = () => {
    periodOffsetDays.value = 0
}

const current7DayPeriodRange = computed(() => {
    const now = new Date()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + periodOffsetDays.value, 23, 59, 59, 999)
    const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 6, 0, 0, 0, 0)
    return { start, end }
})

const weekly7DayPeriodLabel = computed(() => {
    const { start, end } = current7DayPeriodRange.value
    const startStr = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    const endStr = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    return `${startStr} — ${endStr}`
})

const weekly7DayStats = computed(() => {
    const { start, end } = current7DayPeriodRange.value
    const sessionsInWindow: { session: ReadSession; book: Book }[] = []

    books.value.forEach(book => {
        if (Array.isArray(book.readHistory)) {
            book.readHistory.forEach((s: ReadSession) => {
                if (!s.date) return
                const d = new Date(s.date)
                if (!isNaN(d.getTime()) && d >= start && d <= end) {
                    sessionsInWindow.push({ session: s, book })
                }
            })
        }
    })

    let totalPages = 0
    let totalDuration = 0
    let durationSessionsCount = 0
    let pacePages = 0
    let paceDuration = 0

    const bookMap: Record<string | number, { book: Book; pagesAdded: number; totalDuration: number; sessionsCount: number }> = {}

    const daysMap = new Map<string, { dateStr: string; dayLabel: string; pages: number; durationSec: number }>()
    for (let i = 6; i >= 0; i--) {
        const d = new Date(end.getFullYear(), end.getMonth(), end.getDate() - i)
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        const key = `${y}-${m}-${day}`
        const dayLabel = d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric' })
        daysMap.set(key, { dateStr: key, dayLabel, pages: 0, durationSec: 0 })
    }

    sessionsInWindow.forEach(({ session, book }) => {
        const pgs = Number(session.pagesAdded) || 0
        totalPages += pgs

        const dur = session.duration !== null && session.duration !== undefined ? Number(session.duration) : 0
        if (dur > 0) {
            totalDuration += dur
            durationSessionsCount++
            if (pgs > 0) {
                pacePages += pgs
                paceDuration += dur
            }
        }

        const bId = book.id!
        if (!bookMap[bId]) {
            bookMap[bId] = { book, pagesAdded: 0, totalDuration: 0, sessionsCount: 0 }
        }
        bookMap[bId].pagesAdded += pgs
        bookMap[bId].totalDuration += dur
        bookMap[bId].sessionsCount++

        try {
            const d = new Date(session.date)
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            const dateKey = `${y}-${m}-${day}`
            if (daysMap.has(dateKey)) {
                const dayObj = daysMap.get(dateKey)!
                dayObj.pages += pgs
                dayObj.durationSec += dur
            }
        } catch {
        }
    })

    const rawDaily = Array.from(daysMap.values())
    const maxDayPages = Math.max(...rawDaily.map(d => d.pages), 1)
    const dailyBreakdown = rawDaily.map(d => ({
        ...d,
        percent: d.pages > 0 ? Math.max(15, Math.round((d.pages / maxDayPages) * 100)) : 0
    }))

    const booksInPeriod = Object.values(bookMap).sort((a, b) => b.pagesAdded - a.pagesAdded)

    return {
        totalPages,
        totalDuration,
        totalSessions: sessionsInWindow.length,
        sessionsWithDurationCount: durationSessionsCount,
        pacePages,
        paceDuration,
        dailyBreakdown,
        booksInPeriod
    }
})

const weekly7DayDurationDisplay = computed(() => {
    const dur = weekly7DayStats.value.totalDuration
    if (dur <= 0) return '0 mnt'
    return timer.formatDuration(dur)
})

const weekly7DayPaceDisplay = computed(() => {
    const { pacePages, paceDuration } = weekly7DayStats.value
    if (pacePages > 0 && paceDuration > 0) {
        const secPerPage = paceDuration / pacePages
        return timer.formatPace(secPerPage)
    }
    return 'Tanpa Durasi'
})

const weekly7DaySpeedPerHourDisplay = computed(() => {
    const { pacePages, paceDuration } = weekly7DayStats.value
    if (pacePages > 0 && paceDuration > 0) {
        const pagesPerHour = Math.round((pacePages / paceDuration) * 3600)
        return `~${pagesPerHour} hal/jam`
    }
    return ''
})

const handleDocumentClick = () => {
    activeHistoryTooltip.value = null
}

onMounted(async () => {
    await loadBooks()
    window.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
    window.removeEventListener('click', handleDocumentClick)
})
</script>
