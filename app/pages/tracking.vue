<template>
    <div class="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-300 space-y-6 sm:space-y-8">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4">
            <div class="flex items-center gap-2">
                <NuxtLink to="/books"
                    class="btn-sunset-secondary inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-semibold text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>Koleksi Buku</span>
                </NuxtLink>
                <span class="text-xs text-white">/</span>
                <span class="liquid-glass-pill inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-300">
                    <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
                    Live Tracking
                </span>
            </div>

            <div v-if="selectedBook" class="flex items-center gap-2">
                <button @click="showBookPicker = true" type="button"
                    class="btn-sunset-secondary inline-flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-semibold text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m16 3 5 5-5 5" />
                        <path d="M4 20v-7a4 4 0 0 1 4-4h13" />
                    </svg>
                    <span>Ganti Buku</span>
                </button>
            </div>
        </div>

        <div v-if="books.length === 0"
            class="surface-card rounded-2xl p-10 sm:p-12 text-center space-y-4">
            <div class="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                </svg>
            </div>
            <h2 class="text-lg font-bold tracking-tight text-white">Belum Ada Buku Dalam Koleksi</h2>
            <p class="max-w-md mx-auto text-xs sm:text-sm text-white leading-relaxed">Tambahkan buku terlebih dahulu untuk mulai melacak progres dan ritme membaca Anda.</p>
            <NuxtLink to="/books"
                class="btn-sunset-primary inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-semibold">
                Ke Halaman Koleksi
            </NuxtLink>
        </div>

        <div v-else-if="selectedBook" class="space-y-6 sm:space-y-8">
            <div class="surface-hero relative overflow-hidden rounded-2xl p-5 sm:p-6 transition-all duration-300 hover:shadow-2xl">
                <div class="flex flex-col sm:flex-row gap-5 items-start">
                    <div class="h-36 w-26 sm:h-36 sm:w-26 shrink-0 overflow-hidden rounded-xl bg-white/10 shadow-lg shadow-black/20">
                        <img v-if="selectedBook.imageUrl && !imageLoadError" :src="selectedBook.imageUrl"
                            :alt="selectedBook.title" class="h-full w-full object-cover" @error="imageLoadError = true" />
                        <div v-else class="flex h-full w-full items-center justify-center bg-white/5 text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>

                    <div class="min-w-0 flex-1 space-y-2.5">
                        <div class="flex flex-wrap items-center gap-2">
                            <span v-if="selectedBook.topic && selectedBook.topic.length > 0"
                                v-for="t in selectedBook.topic" :key="t"
                                class="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                                {{ t }}
                            </span>
                            <span v-else class="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-semibold text-white">
                                Umum
                            </span>
                            <span v-if="isBookCompleted"
                                class="rounded-full bg-emerald-500/25 px-2.5 py-0.5 text-[11px] font-bold text-emerald-300 shadow-sm">
                                ✓ Selesai Dibaca
                            </span>
                            <span v-else-if="selectedBook.pagesRead > 0"
                                class="rounded-full bg-sky-500/25 px-2.5 py-0.5 text-[11px] font-bold text-sky-200 shadow-sm">
                                ● Sedang Dibaca
                            </span>
                        </div>

                        <h1 class="text-xl sm:text-2xl font-bold text-white leading-snug break-words tracking-tight">
                            {{ selectedBook.title }}
                        </h1>

                        <p v-if="selectedBook.author" class="text-xs sm:text-sm text-white font-normal">
                            Penulis: <span class="font-semibold text-white">{{ selectedBook.author }}</span>
                            <span v-if="selectedBook.publisher" class="text-sky-300 font-medium"> · {{ selectedBook.publisher }}</span>
                        </p>

                        <div class="pt-2 space-y-2">
                            <div class="flex items-center justify-between text-xs">
                                <span class="text-white">
                                    Progres: <strong class="tabular-nums text-white font-bold">{{ selectedBook.pagesRead || 0 }}</strong> / <span class="text-white font-semibold">{{ selectedBook.totalPages || 0 }}</span> halaman
                                </span>
                                <span class="font-extrabold tabular-nums"
                                    :class="isBookCompleted ? 'text-emerald-300' : 'text-sky-300'">
                                    {{ bookPercentage }}%
                                </span>
                            </div>

                            <div class="h-2.5 w-full overflow-hidden rounded-full bg-white/20 shadow-inner">
                                <div class="h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                                    :class="isBookCompleted ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-sky-400 to-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.4)]'"
                                    :style="{ width: `${Math.min(bookPercentage, 100)}%` }"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="successNotification"
                class="rounded-xl bg-emerald-500/25 p-4 text-emerald-200 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>{{ successNotification }}</span>
                </div>
                <button @click="successNotification = ''" class="cursor-pointer font-bold text-base leading-none">×</button>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-6 surface-hero rounded-2xl p-5 sm:p-6 flex flex-col justify-between space-y-5 transition-all duration-300 hover:shadow-2xl">
                    <div>
                        <div class="flex items-center justify-between pb-3.5">
                            <div class="flex items-center gap-2">
                                <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 text-sky-300 text-xs font-bold">1</span>
                                <h2 class="text-sm font-bold tracking-tight text-white">Timer Sesi Membaca</h2>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <span v-if="currentBookTimer.isRunning"
                                    class="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/20 px-2.5 py-0.5 text-xs font-semibold text-sky-200">
                                    <span class="h-1.5 w-1.5 rounded-full bg-sky-400 animate-ping"></span>
                                    Berjalan
                                </span>
                                <span v-else-if="currentBookTimer.isPaused"
                                    class="inline-flex items-center gap-1.5 rounded-lg bg-sky-500/20 px-2.5 py-0.5 text-xs font-semibold text-sky-200">
                                    Jeda
                                </span>
                                <span v-else-if="trackingState === 'stopped'"
                                    class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                                    Selesai
                                </span>
                                <span v-else class="rounded-lg bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">
                                    Siap
                                </span>
                            </div>
                        </div>

                        <div class="my-6 text-center">
                            <div class="inline-block rounded-2xl bg-white/10 px-8 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl">
                                <span class="text-4xl sm:text-6xl font-bold tracking-widest tabular-nums text-white">
                                    {{ timerDisplay }}
                                </span>
                            </div>
                            <p class="mt-2 text-xs text-sky-200 font-medium">
                                Jam : Menit : Detik
                            </p>
                        </div>

                        <div v-if="currentBookTimer.isRunning || currentBookTimer.isPaused" class="mb-4">
                            <div v-if="currentElapsedSeconds < 60"
                                class="rounded-xl bg-sky-500/20 p-3 text-center text-xs font-medium text-sky-200">
                                <span>⏳ Wajib tracking minimal 1 menit (sisa {{ 60 - currentElapsedSeconds }} detik)</span>
                            </div>
                            <div v-else
                                class="rounded-xl bg-emerald-500/20 p-3 text-center text-xs font-medium text-emerald-200">
                                <span>✓ Durasi valid ({{ timer.formatDuration(currentElapsedSeconds) }}). Tekan Stop untuk input halaman.</span>
                            </div>
                        </div>

                        <div class="space-y-2.5">
                            <div v-if="trackingState === 'idle'">
                                <button type="button" @click="handleStart"
                                    class="border bg-green-500/15 border-green-600 w-full py-3.5 rounded-xl text-sm font-bold uppercase flex items-center justify-center gap-2 hover:border-green-500 hover:bg-green-500/40 hover:brightness-150 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                        <polygon points="5 3 19 12 5 21 5 3" />
                                    </svg>
                                    <span>Mulai Tracking Bacaan</span>
                                </button>
                            </div>

                            <div v-else-if="currentBookTimer.isRunning" class="grid grid-cols-2 gap-3">
                                <button type="button" @click="handlePause"
                                    class="btn-sunset-secondary py-3 rounded-xl text-xs sm:text-sm font-semibold uppercase text-white flex items-center justify-center gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                        <rect x="6" y="4" width="4" height="16" />
                                        <rect x="14" y="4" width="4" height="16" />
                                    </svg>
                                    <span>Jeda</span>
                                </button>
                               <button type="button" @click="handleStop" :disabled="currentElapsedSeconds < 60" class="cursor-pointer flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs sm:text-sm font-bold uppercase
           border transition-all duration-300 backdrop-blur-xl
           disabled:opacity-40 disabled:cursor-not-allowed" :class="currentElapsedSeconds >= 60
            ? 'bg-red-500/15 border-red-400/40 text-red-100 shadow-[0_0_15px_rgba(255,0,60,0.35),inset_0_0_20px_rgba(255,0,60,0.08)] hover:bg-red-500/25 hover:border-red-400/70 hover:shadow-[0_0_25px_rgba(255,0,60,0.6),inset_0_0_25px_rgba(255,0,60,0.12)]'
            : 'bg-white/10 border-white/10 text-white'">

                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                        fill="currentColor" class="drop-shadow-[0_0_6px_rgba(255,50,80,0.9)]">
                                        <rect x="4" y="4" width="16" height="16" />
                                    </svg>

                                    <span>Stop Tracking</span>
                                </button>
                            </div>

                            <div v-else-if="currentBookTimer.isPaused" class="space-y-2.5">
                                <div class="grid grid-cols-2 gap-3">
                                    <button type="button" @click="handleResume"
                                        class="btn-sunset-primary py-3 rounded-xl text-xs sm:text-sm font-bold uppercase flex items-center justify-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                            <polygon points="5 3 19 12 5 21 5 3" />
                                        </svg>
                                        <span>Lanjut</span>
                                    </button>
                                   <button type="button" @click="handleStop" :disabled="currentElapsedSeconds < 60"
                                        class="cursor-pointer flex items-center justify-center gap-1.5 rounded-xl py-3 text-xs sm:text-sm font-bold uppercase
           border border-white/10 backdrop-blur-xl transition-all duration-300
           disabled:opacity-40 disabled:cursor-not-allowed" :class="currentElapsedSeconds >= 60
            ? 'bg-red-500/50 border-red-400/40 text-red-100 shadow-[0_0_18px_rgba(255,0,60,0.4),inset_0_0_18px_rgba(255,0,60,0.08)] hover:bg-red-500/25 hover:border-red-400/70 hover:text-white hover:shadow-[0_0_30px_rgba(255,0,60,0.65),inset_0_0_25px_rgba(255,0,60,0.12)]'
            : 'bg-white/10 text-white'">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                            viewBox="0 0 24 24" fill="currentColor"
                                            class="drop-shadow-[0_0_7px_rgba(255,40,70,0.9)]">
                                            <rect x="4" y="4" width="16" height="16" />
                                        </svg>

                                        <span>Stop Tracking</span>
                                    </button>
                                </div>
                                <button type="button" @click="handleReset"
                                    class="btn-sunset-secondary w-full py-2.5 rounded-xl text-xs font-semibold uppercase text-white">
                                    ↺ Ulangi / Batalkan Sesi Ini
                                </button>
                            </div>

                            <div v-else-if="trackingState === 'stopped'">
                                <button type="button" @click="handleReset"
                                    class="btn-sunset-secondary w-full py-2.5 rounded-xl text-xs font-semibold uppercase text-white">
                                    ↺ Ulangi / Batalkan Sesi Ini
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="rounded-xl bg-white/10 p-3.5 text-xs leading-relaxed text-white">
                        <p class="font-semibold text-white">Alur Sesi Membaca:</p>
                        <p class="mt-0.5">Start → Membaca (timer berjalan di background, minimal 1 menit) → Stop → Masukkan jumlah halaman yang telah dibaca → Simpan.</p>
                    </div>
                </div>

                <div class="lg:col-span-6 surface-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
                    <div v-if="trackingState !== 'stopped'" class="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                        <div class="h-14 w-14 rounded-2xl bg-white/15 flex items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                            </svg>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-sm font-bold tracking-tight text-white">
                                {{ currentBookTimer.isRunning ? 'Sesi Membaca Sedang Berjalan' : 'Tekan Start Untuk Mulai' }}
                            </h3>
                            <p class="text-xs text-white max-w-sm leading-relaxed">
                                {{ currentBookTimer.isRunning
                                    ? 'Silakan membaca buku Anda. Setelah selesai (minimal 1 menit), tekan tombol Stop Tracking di sebelah kiri untuk memasukkan jumlah halaman yang telah dibaca.'
                                    : 'Mulai timer di sebelah kiri saat Anda siap membaca. Form input halaman akan terbuka otomatis setelah Anda menekan Stop.' }}
                            </p>
                        </div>
                    </div>

                    <form v-else @submit.prevent="handleSubmitSession" class="space-y-4">
                        <div class="pb-3.5 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 text-emerald-300 text-xs font-bold">2</span>
                                <h2 class="text-sm font-bold tracking-tight text-white">Input Hasil Bacaan</h2>
                            </div>
                            <span class="rounded-lg bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                                Siap Disimpan
                            </span>
                        </div>

                        <div class="rounded-xl bg-emerald-500/20 p-3.5 text-xs flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="text-emerald-400">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span class="font-semibold text-emerald-200">DURASI TERCATAT:</span>
                            </div>
                            <span class="text-sm font-bold text-emerald-200 tabular-nums">
                                {{ timer.formatDuration(lockedDurationSeconds) }}
                            </span>
                        </div>

                        <div class="space-y-2.5">
                            <label class="block text-xs font-semibold text-white">
                                Jumlah Halaman Yang Dibaca:
                            </label>

                            <div class="flex items-center gap-3">
                                <button type="button" @click="decrementPages"
                                    class="btn-sunset-secondary w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl text-white focus:outline-none"
                                    aria-label="Kurangi satu halaman">
                                    -
                                </button>

                                <div class="relative flex-1">
                                    <input v-model.number="sessionPagesAdded" type="number" min="1"
                                        placeholder="0"
                                        class="w-full h-11 text-center glass-input rounded-xl text-lg font-bold tabular-nums text-white" />
                                    <span class="absolute right-3 top-3 text-xs font-bold text-sky-300">HAL</span>
                                </div>

                                <button type="button" @click="incrementPages"
                                    class="btn-sunset-secondary w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xl text-white focus:outline-none"
                                    aria-label="Tambah satu halaman">
                                    +
                                </button>
                            </div>

                            <div class="flex flex-wrap items-center gap-2 pt-1">
                                <button type="button" @click="addQuickPages(5)"
                                    class="btn-sunset-secondary rounded-lg px-2.5 py-1 text-xs font-semibold text-white">
                                    +5 HAL
                                </button>
                                <button type="button" @click="addQuickPages(10)"
                                    class="btn-sunset-secondary rounded-lg px-2.5 py-1 text-xs font-semibold text-white">
                                    +10 HAL
                                </button>
                                <button type="button" @click="addQuickPages(25)"
                                    class="btn-sunset-secondary rounded-lg px-2.5 py-1 text-xs font-semibold text-white">
                                    +25 HAL
                                </button>
                                <button v-if="remainingPages > 0" type="button" @click="fillRemainingPages"
                                    class="rounded-lg bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-colors">
                                    Tamatkan ({{ remainingPages }} HAL)
                                </button>
                            </div>

                            <div class="rounded-xl bg-white/10 px-3.5 py-2.5 text-xs flex items-center justify-between">
                                <span class="text-white font-medium">Hasil Progres Buku:</span>
                                <span class="text-white">
                                    {{ selectedBook.pagesRead || 0 }} hal → <strong class="text-sky-300 font-bold">{{ projectedPagesRead }}</strong> / {{ selectedBook.totalPages || 0 }} hal
                                </span>
                            </div>
                        </div>

                        <div class="space-y-1.5 pt-3">
                            <label class="block text-xs font-semibold text-white">
                                Tanggal Sesi:
                            </label>
                            <input v-model="sessionDateString" type="date" :max="todayDateString"
                                class="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold text-white" />
                        </div>

                        <div class="pt-2">
                            <button type="submit" :disabled="!sessionPagesAdded || Number(sessionPagesAdded) <= 0"
                                class="btn-sunset-primary w-full py-3.5 rounded-xl text-sm font-bold uppercase disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
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

            <div class="space-y-4 pt-0">
                <div class="flex flex-wrap items-center gap-3 pt-4 pb-3 overflow-visible">
                    <button type="button" @click="activeTab = 'history'"
                        class="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer select-none transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                        :class="activeTab === 'history'
                            ? 'btn-sunset-primary shadow-lg shadow-sky-500/25'
                            : 'btn-sunset-secondary text-white hover:text-white'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0" :class="activeTab === 'history' ? 'text-white' : 'text-sky-300'">
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                        </svg>
                        <span>Riwayat Sesi</span>
                        <span class="rounded-full px-2 py-0.5 text-[11px] font-extrabold tabular-nums transition-colors"
                            :class="activeTab === 'history'
                                ? 'bg-white/25 text-white'
                                : 'bg-white/15 text-sky-200'">
                            {{ bookHistorySessions.length }}
                        </span>
                    </button>
                    <button type="button" @click="activeTab = 'stats'"
                        class="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer select-none transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                        :class="activeTab === 'stats'
                            ? 'btn-sunset-primary shadow-lg shadow-sky-500/25'
                            : 'btn-sunset-secondary text-white hover:text-white'">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"
                            class="shrink-0" :class="activeTab === 'stats' ? 'text-white' : 'text-sky-300'">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                        </svg>
                        <span>Statistik Global</span>
                    </button>
                </div>

                <div v-show="activeTab === 'history'" class="space-y-4">
                    <div>
                        <h3 class="text-sm font-bold text-white tracking-tight">
                            Riwayat Membaca: {{ selectedBook.title }}
                        </h3>
                        <p class="text-xs text-white mt-0.5">Menampilkan seluruh histori sesi baca buku ini.</p>
                    </div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div class="surface-stat relative rounded-2xl p-5 space-y-2 transition-all">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-semibold uppercase tracking-wider text-white">Reading Pace Buku</span>
                                <div class="relative">
                                    <button type="button" @click.stop="toggleHistoryTooltip('pace')"
                                        class="btn-sunset-secondary flex h-6 w-6 items-center justify-center rounded-lg text-xs font-semibold text-white"
                                        aria-label="Rumus Perhitungan Reading Pace">
                                        i
                                    </button>

                                    <Teleport to="body">
                                        <div v-if="activeHistoryTooltip === 'pace'"
                                            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                                            @click="activeHistoryTooltip = null">
                                            <div @click.stop
                                                class="liquid-glass-tooltip relative w-full max-w-sm p-5 text-white shadow-2xl">
                                                <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-white/15">
                                                    <span class="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                            <circle cx="12" cy="12" r="10"/>
                                                            <line x1="12" y1="16" x2="12" y2="12"/>
                                                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                                                        </svg>
                                                        Rumus Reading Pace
                                                    </span>
                                                    <button type="button" @click.stop="activeHistoryTooltip = null"
                                                        class="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 hover:text-sky-300 transition-colors text-xs font-bold cursor-pointer"
                                                        aria-label="Tutup">✕</button>
                                                </div>
                                                <div class="text-xs space-y-2 text-white">
                                                    <p class="font-semibold text-white">
                                                        = Total Durasi Sesi ÷ Total Halaman Dibaca
                                                    </p>
                                                    <p class="text-[11px] text-white/90 leading-relaxed">
                                                        Dihitung khusus dari seluruh riwayat sesi buku ini yang memiliki catatan durasi timer.
                                                    </p>
                                                    <div class="mt-2.5 rounded-xl bg-white/10 border border-white/15 p-3 space-y-1.5 text-xs">
                                                        <div class="flex justify-between items-center text-white">
                                                           <span class="text-white">Total Durasi:</span>
                                                           <span class="font-bold text-white tabular-nums">{{ timer.formatDuration(bookPaceStats.totalDuration) }}</span>
                                                        </div>
                                                        <div class="flex justify-between items-center text-white">
                                                           <span class="text-white">Total Halaman:</span>
                                                           <span class="font-bold text-white tabular-nums">{{ bookPaceStats.totalPages }} hal ({{ bookPaceStats.sessionsCount }} sesi)</span>
                                                        </div>
                                                        <div class="flex justify-between items-center pt-1.5 border-t border-white/15 text-sky-300">
                                                           <span class="font-bold">Hasil Pace:</span>
                                                           <span class="font-extrabold tabular-nums">{{ bookReadingPaceDisplay }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Teleport>
                                </div>
                            </div>

                            <div class="flex items-baseline gap-2 pt-0.5">
                                <span class="text-2xl sm:text-3xl font-bold tabular-nums text-sky-300">
                                    {{ bookReadingPaceDisplay }}
                                </span>
                            </div>
                            <p class="text-xs text-white">
                                {{ bookSpeedPerHourDisplay }}
                                <span v-if="bookPaceStats.sessionsCount > 0" class="text-sky-300 font-semibold">· {{ bookPaceStats.sessionsCount }} sesi timer</span>
                            </p>
                        </div>

                        <div class="surface-stat relative rounded-2xl p-5 space-y-2 transition-all">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-semibold uppercase tracking-wider text-white">Estimasi Sisa Waktu</span>
                                <div class="relative">
                                    <button type="button" @click.stop="toggleHistoryTooltip('estimate')"
                                        class="btn-sunset-secondary flex h-6 w-6 items-center justify-center rounded-lg text-xs font-semibold text-white"
                                        aria-label="Rumus Perhitungan Estimasi Waktu">
                                        i
                                    </button>

                                    <Teleport to="body">
                                        <div v-if="activeHistoryTooltip === 'estimate'"
                                            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
                                            @click="activeHistoryTooltip = null">
                                            <div @click.stop
                                                class="liquid-glass-tooltip relative w-full max-w-sm p-5 text-white shadow-2xl">
                                                <div class="flex items-center justify-between pb-2 mb-2.5 border-b border-white/15">
                                                    <span class="text-xs font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                            <circle cx="12" cy="12" r="10"/>
                                                            <line x1="12" y1="16" x2="12" y2="12"/>
                                                            <line x1="12" y1="8" x2="12.01" y2="8"/>
                                                        </svg>
                                                        Rumus Estimasi Waktu
                                                    </span>
                                                    <button type="button" @click.stop="activeHistoryTooltip = null"
                                                        class="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 hover:text-emerald-300 transition-colors text-xs font-bold cursor-pointer"
                                                        aria-label="Tutup">✕</button>
                                                </div>
                                                <div class="text-xs space-y-2 text-white">
                                                    <p class="font-semibold text-white">
                                                        = Sisa Halaman × Reading Pace Buku
                                                    </p>
                                                    <p class="text-[11px] text-white/90 leading-relaxed">
                                                        Memprediksi total waktu yang dibutuhkan untuk menuntaskan sisa halaman buku ini berdasarkan ritme baca historis Anda.
                                                    </p>
                                                    <div class="mt-2.5 rounded-xl bg-white/10 border border-white/15 p-3 space-y-1.5 text-xs">
                                                        <div class="flex justify-between items-center text-white">
                                                           <span class="text-white">Sisa Halaman:</span>
                                                           <span class="font-bold text-white tabular-nums">{{ remainingPages }} hal</span>
                                                        </div>
                                                        <div class="flex justify-between items-center text-white">
                                                           <span class="text-white">Reading Pace:</span>
                                                           <span class="font-bold text-white tabular-nums">{{ bookPaceStats.secondsPerPage > 0 ? `${Math.round(bookPaceStats.secondsPerPage)} dtk/hal` : '-' }}</span>
                                                        </div>
                                                        <div class="flex justify-between items-center pt-1.5 border-t border-white/15 text-emerald-300">
                                                           <span class="font-bold">Estimasi Selesai:</span>
                                                           <span class="font-extrabold tabular-nums">{{ bookEstimatedRemainingDisplay }}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Teleport>
                                </div>
                            </div>

                            <div class="flex items-baseline gap-2 pt-0.5">
                                <span class="text-2xl sm:text-3xl font-bold tabular-nums"
                                    :class="isBookCompleted ? 'text-emerald-300' : 'text-white'">
                                    {{ bookEstimatedRemainingDisplay }}
                                </span>
                            </div>
                            <p class="text-xs text-white">
                                <span v-if="isBookCompleted" class="text-emerald-300 font-semibold">✓ Buku telah selesai dibaca</span>
                                <span v-else>Sisa <strong class="text-white tabular-nums font-bold">{{ remainingPages }}</strong> dari {{ selectedBook?.totalPages || 0 }} hal</span>
                            </p>
                        </div>
                    </div>

                    <h3 class="mt-6 mb-5 pt-5 text-sm font-bold text-white tracking-tight">
                        Daftar Riwayat Sesi <span class="font-normal text-sky-300">({{ bookHistorySessions.length }} sesi tercatat)</span>
                    </h3>

                    <div v-if="bookHistorySessions.length === 0"
                        class="surface-card rounded-2xl p-8 text-center z-0">
                        <p class="text-sm font-semibold text-white">
                            Belum Ada Riwayat Sesi Baca
                        </p>
                        <p class="mt-1 text-xs text-white">Gunakan timer tracking di atas untuk mulai mencatat sesi baca buku ini.</p>
                    </div>
                    <div v-else class="space-y-2.5">
                        <div v-for="(session, idx) in reversedBookHistory" :key="session.id || idx"
                            class="surface-card-interactive rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div class="min-w-0 space-y-1">
                                <div class="flex flex-wrap items-center gap-2 text-xs">
                                    <span class="font-semibold text-white">{{ formatSessionDate(session.date) }}</span>
                                    <span class="rounded-lg bg-emerald-500/20 px-2 py-0.5 font-bold text-emerald-300">
                                        +{{ session.pagesAdded }} HAL
                                    </span>
                                    <span v-if="session.endPage !== undefined && session.startPage !== undefined"
                                        class="text-white font-medium">
                                        (Hal {{ session.startPage }} - {{ session.endPage }})
                                    </span>
                                </div>
                                <div class="flex flex-wrap items-center gap-2 text-xs text-white mt-2">
                                    <span class="inline-flex items-center gap-1.5">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        <span v-if="session.duration !== null && session.duration !== undefined && session.duration > 0" class="text-white font-semibold">
                                            Durasi: {{ timer.formatDuration(session.duration) }}
                                        </span>
                                        <span v-else class="text-sky-300 font-medium">
                                            Tanpa Timer / Manual
                                        </span>
                                    </span>
                                    <span v-if="session.duration && session.pagesAdded > 0" class="text-sky-300 font-semibold">
                                        · {{ timer.formatPace(session.duration / session.pagesAdded) }}
                                    </span>
                                </div>
                            </div>

                            <div class="flex items-center gap-2 shrink-0">
                                <button @click="openEditSessionModal(session)" type="button"
                                    class="btn-sunset-secondary rounded-lg px-3 py-1 text-xs font-semibold text-white">
                                    Edit
                                </button>
                                <button @click="openDeleteSessionModal(session)" type="button"
                                    class="rounded-lg bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-200 hover:bg-red-500/30 transition-colors">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div v-show="activeTab === 'stats'" class="space-y-6">
                    <div class="surface-card rounded-2xl p-5 sm:p-6 space-y-4 my-6">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5">
                            <div class="flex items-center gap-2.5">
                                <span class="flex h-6 w-6 items-center justify-center rounded-lg bg-sky-500/20 text-sky-300 text-xs font-bold">
                                    ✦
                                </span>
                                <h3 class="text-sm font-bold tracking-tight text-white">
                                    Ekspor Data Aktivitas (30 Hari Terakhir)
                                </h3>
                            </div>
                        </div>

                        <p class="text-xs sm:text-sm text-white leading-relaxed text-justify">
                            Data riwayat sesi membaca 30 hari terakhir dapat diekspor dalam format JSON atau langsung disalin bersama struktur template prompt kami untuk dikirimkan ke <strong class="text-white font-semibold">AI / LLM</strong> (seperti ChatGPT, Claude, Gemini, dll).
                        </p>

                        <div class="flex flex-wrap items-center gap-3 pt-1">
                            <button type="button" @click="handleExportJSON"
                                class="btn-sunset-secondary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="7 10 12 15 17 10" />
                                    <line x1="12" y1="15" x2="12" y2="3" />
                                </svg>
                                <span>Export JSON</span>
                            </button>

                            <button type="button" @click="handleCopyPrompt"
                                class="btn-sunset-primary inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold">
                                <svg v-if="!isPromptCopied" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                    class="text-emerald-400">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>{{ isPromptCopied ? '✓ Prompt Disalin' : 'Copy Prompt AI' }}</span>
                            </button>
                        </div>

                        <div v-if="statsAlertMessage"
                            class="rounded-xl p-3 text-xs font-semibold flex items-center justify-between animate-in fade-in duration-200"
                            :class="statsAlertMessage.includes('belum membaca')
                                ? 'bg-sky-500/20 text-sky-200'
                                : 'bg-emerald-500/20 text-emerald-300'">
                            <div class="flex items-center gap-2">
                                <span>{{ statsAlertMessage.includes('belum membaca') ? '⚠️' : '✓' }}</span>
                                <span>{{ statsAlertMessage }}</span>
                            </div>
                            <button type="button" @click="statsAlertMessage = ''"
                                class="cursor-pointer font-bold text-sm leading-none ml-2">×</button>
                        </div>
                    </div>

                    <div class="space-y-3">
                        <div class="flex items-center justify-between flex-wrap gap-2">
                            <div>
                                <h3 class="text-sm font-bold tracking-tight text-white">
                                    Ringkasan Aktivitas Membaca
                                </h3>
                                <p class="text-xs text-white">Dihitung dari hari ini ke belakang.</p>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button v-for="opt in metricRangeOptions" :key="opt.key" type="button"
                                    @click="selectedMetricRangeKey = opt.key"
                                    class="cursor-pointer rounded-lg px-2.5 py-1 text-xs font-semibold uppercase tracking-wider"
                                    :class="selectedMetricRangeKey === opt.key
                                        ? 'bg-white text-zinc-950 font-bold shadow-sm'
                                        : 'btn-sunset-secondary text-white'">
                                    {{ opt.label }}
                                </button>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="surface-card rounded-2xl p-5 space-y-1">
                                <span class="text-xs font-semibold uppercase tracking-wider text-white">Jumlah Halaman</span>
                                <div class="flex items-baseline gap-2 pt-1">
                                    <span class="text-2xl sm:text-3xl font-bold tabular-nums text-white">
                                        {{ independentMetricStats.totalPages }}
                                    </span>
                                    <span class="text-xs font-bold uppercase text-sky-300">HALAMAN</span>
                                </div>
                                <p class="text-xs text-white">Total seluruh buku ({{ currentMetricRangeLabel }} terakhir)</p>
                            </div>

                            <div class="surface-card rounded-2xl p-5 space-y-1">
                                <span class="text-xs font-semibold uppercase tracking-wider text-white">Total Durasi Membaca</span>
                                <div class="flex items-baseline gap-2 pt-1">
                                    <span class="text-2xl sm:text-3xl font-bold tabular-nums text-emerald-300">
                                        {{ independentMetricDurationDisplay }}
                                    </span>
                                </div>
                                <p class="text-xs text-white">Dari {{ independentMetricStats.sessionsWithDurationCount }} sesi berdurasi</p>
                            </div>

                            <div class="surface-card rounded-2xl p-5 space-y-1">
                                <span class="text-xs font-semibold uppercase tracking-wider text-white">Reading Pace</span>
                                <div class="flex items-baseline gap-2 pt-1">
                                    <span class="text-xl sm:text-2xl font-bold tabular-nums text-sky-300">
                                        {{ independentMetricPaceDisplay }}
                                    </span>
                                </div>
                                <p class="text-xs text-white">
                                    {{ independentMetricSpeedPerHourDisplay }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="surface-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3.5">
                        <div class="flex items-center gap-2">
                            <button @click="shift7DayPeriod(-1)" type="button"
                                class="btn-sunset-secondary h-8 w-8 rounded-xl flex items-center justify-center text-white"
                                title="7 Hari Sebelumnya" aria-label="7 Hari Sebelumnya">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m15 18-6-6 6-6" />
                                </svg>
                            </button>
                            <button @click="shift7DayPeriod(1)" type="button" :disabled="periodOffsetDays >= 0"
                                class="btn-sunset-secondary h-8 w-8 rounded-xl flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed"
                                title="7 Hari Berikutnya" aria-label="7 Hari Berikutnya">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="m9 18 6-6-6-6" />
                                </svg>
                            </button>
                            <span class="text-xs sm:text-sm font-semibold text-white">
                                Periode 7 Hari: <span class="text-sky-300 font-bold">{{ weekly7DayPeriodLabel }}</span>
                            </span>
                        </div>

                        <div v-if="periodOffsetDays < 0">
                            <button @click="resetPeriodToCurrent" type="button"
                                class="btn-sunset-secondary rounded-lg px-2.5 py-1 text-xs font-semibold text-white">
                                Kembali ke 7 Hari Terakhir
                            </button>
                        </div>
                    </div>

                    <div class="surface-card rounded-2xl p-5 sm:p-6 space-y-5">
                        <div class="flex items-center justify-between pb-3">
                            <h4 class="text-sm font-bold tracking-tight text-white">
                                Distribusi Harian (7 Hari)
                            </h4>
                            <span class="text-xs text-sky-300 font-semibold">
                                {{ weekly7DayPeriodLabel }}
                            </span>
                        </div>

                        <div class="grid grid-cols-7 gap-1.5 sm:gap-3 pt-2">
                            <div v-for="day in weekly7DayStats.dailyBreakdown" :key="day.dateStr"
                                class="flex flex-col items-center gap-2 min-w-0">
                                <span class="text-[11px] font-semibold tabular-nums text-white">
                                    {{ day.pages > 0 ? `${day.pages}h` : '-' }}
                                </span>
                                <div class="h-24 sm:h-28 w-full rounded-xl bg-white/15 p-1 flex items-end">
                                    <div class="w-full rounded-lg bg-gradient-to-t from-sky-500 via-cyan-400 to-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.35)] transition-all duration-300"
                                        :style="{ height: `${day.percent}%` }"></div>
                                </div>
                                <span class="text-[9px] sm:text-[11px] font-semibold text-white truncate">
                                    {{ day.dayLabel }}
                                </span>
                                <span class="text-[9px] sm:text-[10px] text-sky-200 truncate tabular-nums font-medium">
                                    {{ formatDailyDurationMinutes(day.durationSec) }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-2 rounded-xl bg-black/1 backdrop-blur-md p-4 text-xs">
                            <div class="flex items-center justify-between pb-2">
                                <span class="font-semibold uppercase tracking-wider text-white">
                                    Data Periode Ini:
                                </span>
                                <span class="font-semibold tabular-nums text-white">
                                    {{ weekly7DayStats.totalSessions }} Total Sesi
                                </span>
                            </div>

                            <div class="space-y-1.5 pt-1">
                                <div class="flex items-center justify-between gap-3 py-1">
                                    <span class="text-white">Jumlah Halaman:</span>
                                    <strong class="shrink-0 font-bold tabular-nums text-white">
                                        +{{ weekly7DayStats.totalPages }} HAL
                                    </strong>
                                </div>

                                <div class="flex items-center justify-between gap-3 py-1">
                                    <span class="text-white">Total Durasi:</span>
                                    <strong class="shrink-0 font-bold tabular-nums text-emerald-300">
                                        {{ weekly7DayDurationDisplay }}
                                    </strong>
                                </div>

                                <div class="flex items-center justify-between gap-3 py-1">
                                    <span class="text-white">Reading Pace:</span>
                                    <div class="flex shrink-0 items-center gap-1">
                                        <strong class="font-bold tabular-nums text-sky-300">
                                            {{ weekly7DayPaceDisplay }}
                                        </strong>
                                        <span v-if="weekly7DaySpeedPerHourDisplay" class="text-[11px] text-sky-200 font-medium">
                                            ({{ weekly7DaySpeedPerHourDisplay }})
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="surface-card rounded-2xl p-5 sm:p-6 space-y-4">
                        <h4 class="text-sm font-bold tracking-tight text-white">
                            Buku yang Dibaca dalam Periode Ini
                        </h4>

                        <div v-if="weekly7DayStats.booksInPeriod.length === 0" class="py-4 text-center text-xs text-white">
                            Tidak ada aktivitas membaca pada periode 7 hari ini
                        </div>

                        <div v-else class="space-y-1">
                            <div v-for="item in weekly7DayStats.booksInPeriod" :key="item.book.id"
                                class="py-3 flex items-center justify-between gap-3">
                                <div class="flex items-center gap-3 min-w-0">
                                    <div class="h-11 w-8 shrink-0 overflow-hidden rounded-lg bg-white/10">
                                        <img v-if="item.book.imageUrl" :src="item.book.imageUrl" class="h-full w-full object-cover" />
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-xs font-semibold text-white truncate">{{ item.book.title }}</p>
                                        <p class="text-[11px] text-sky-200 tabular-nums font-medium">{{ item.sessionsCount }} sesi baca</p>
                                    </div>
                                </div>
                                <div class="text-right shrink-0 text-xs">
                                    <span class="font-bold text-emerald-300 tabular-nums">+{{ item.pagesAdded }} HAL</span>
                                    <p class="text-[11px] text-white tabular-nums">
                                        {{ item.totalDuration > 0 ? timer.formatDuration(item.totalDuration) : 'Tanpa timer' }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="showBookPicker" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="showBookPicker = false"></div>
                <div class="relative liquid-glass-modal rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
                    <div class="p-4 sm:p-5 flex items-center justify-between">
                        <h2 class="text-sm font-bold tracking-tight text-white">Pilih Buku untuk Dilacak</h2>
                        <button @click="showBookPicker = false" type="button"
                            class="btn-sunset-ghost p-1.5 rounded-lg text-white hover:text-sky-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="px-4 sm:px-5 pb-2">
                        <div class="relative">
                            <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg class="text-sky-300" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <path d="m21 21-4.3-4.3" />
                                </svg>
                            </div>
                            <input v-model="bookPickerSearchQuery" type="text"
                                placeholder="Cari judul, pengarang, atau penerbit..."
                                class="glass-input w-full py-2 pl-9 pr-3 text-xs text-white placeholder:text-white/60" />
                        </div>
                    </div>

                    <div class="p-4 sm:p-5 pt-1 max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
                        <div v-if="filteredPickerBooks.length === 0" class="py-6 text-center text-xs text-white/70">
                            Tidak ada buku yang cocok dengan "{{ bookPickerSearchQuery }}".
                        </div>
                        <div v-for="b in filteredPickerBooks" :key="b.id" @click="selectBook(b)"
                            class="cursor-pointer flex items-center gap-3 p-3 rounded-xl transition-colors"
                            :class="selectedBook?.id === b.id
                                ? 'bg-sky-500/25'
                                : 'bg-white/[0.06] hover:bg-white/[0.12]'">
                            <div class="h-12 w-9 shrink-0 overflow-hidden rounded-lg bg-white/10">
                                <img v-if="b.imageUrl" :src="b.imageUrl" class="h-full w-full object-cover" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <h4 class="text-xs font-semibold text-white truncate">{{ b.title }}</h4>
                                <p class="text-[11px] text-white tabular-nums">
                                    {{ b.pagesRead || 0 }} / {{ b.totalPages || 0 }} HAL ({{ Math.round(((b.pagesRead || 0) / (b.totalPages || 1)) * 100) }}%)
                                </p>
                            </div>
                            <span v-if="selectedBook?.id === b.id" class="rounded-lg bg-sky-500/30 px-2 py-0.5 text-xs font-bold text-sky-200">
                                Aktif
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="isEditSessionModalOpen && editingSession" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="isEditSessionModalOpen = false"></div>
                <div class="relative liquid-glass-modal rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
                    <div class="p-4 sm:p-5 flex items-center justify-between">
                        <h2 class="text-sm font-bold tracking-tight text-white">Edit Sesi Membaca</h2>
                        <button @click="isEditSessionModalOpen = false" type="button"
                            class="btn-sunset-ghost p-1.5 rounded-lg text-white hover:text-sky-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="saveEditedSession" class="p-4 sm:p-5 space-y-4">
                        <div class="space-y-1.5">
                            <label class="block text-xs font-semibold text-white">Tanggal:</label>
                            <input v-model="editSessionDate" type="date"
                                class="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold text-white" />
                        </div>

                        <div class="space-y-1.5">
                            <label class="block text-xs font-semibold text-white">Jumlah Halaman Dibaca:</label>
                            <input v-model.number="editSessionPages" type="number" min="1"
                                class="w-full glass-input rounded-xl px-3 py-2 text-xs font-semibold tabular-nums text-white" />
                        </div>

                        <div class="space-y-1.5">
                            <div class="flex items-center justify-between">
                                <label class="block text-xs font-semibold text-white">Durasi (Menit & Detik):</label>
                                <button type="button" @click="clearEditDuration"
                                    class="text-[11px] text-sky-300 underline hover:text-white">
                                    Kosongkan / Null
                                </button>
                            </div>
                            <div class="grid grid-cols-2 gap-2">
                                <div>
                                    <label class="block text-[10px] text-white font-medium">Menit</label>
                                    <input v-model.number="editSessionMinutes" type="number" min="0" placeholder="0"
                                        class="w-full glass-input rounded-xl px-3 py-1.5 text-xs font-semibold tabular-nums text-white" />
                                </div>
                                <div>
                                    <label class="block text-[10px] text-white font-medium">Detik</label>
                                    <input v-model.number="editSessionSeconds" type="number" min="0" max="59" placeholder="0"
                                        class="w-full glass-input rounded-xl px-3 py-1.5 text-xs font-semibold tabular-nums text-white" />
                                </div>
                            </div>
                            <div v-if="historicalPaceSecondsPerPage > 0" class="pt-1">
                                <button type="button" @click="applyEditEstimateDuration"
                                    class="cursor-pointer text-left text-[11px] text-sky-300 hover:underline">
                                    ⚡ Gunakan Estimasi: ~{{ Math.max(1, Math.round(((Number(editSessionPages) || 1) * historicalPaceSecondsPerPage) / 60)) }} mnt
                                </button>
                            </div>
                        </div>

                        <div class="flex gap-2.5 pt-2">
                            <button type="button" @click="isEditSessionModalOpen = false"
                                class="btn-sunset-secondary flex-1 py-2.5 rounded-xl text-xs font-semibold text-white">
                                Batal
                            </button>
                            <button type="submit"
                                class="btn-sunset-primary flex-1 py-2.5 rounded-xl text-xs font-bold">
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-if="isDeleteSessionModalOpen && sessionToDelete" class="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="isDeleteSessionModalOpen = false"></div>
                <div class="relative liquid-glass-modal rounded-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
                    <div class="p-4 sm:p-5 flex items-center justify-between">
                        <h2 class="text-sm font-bold tracking-tight text-red-300">Hapus Riwayat Sesi</h2>
                        <button @click="isDeleteSessionModalOpen = false" type="button"
                            class="btn-sunset-ghost p-1.5 rounded-lg text-white hover:text-red-300 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M18 6 6 18" />
                                <path d="m6 6 12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="p-4 sm:p-5 space-y-4">
                        <div class="space-y-2 text-xs text-white">
                            <p class="leading-relaxed">
                                Yakin ingin menghapus riwayat sesi membaca ini?
                            </p>
                            <div class="rounded-xl bg-white/10 backdrop-blur-md p-3.5 space-y-1.5 text-white">
                                <div class="flex justify-between">
                                    <span class="text-white">Tanggal:</span>
                                    <span class="font-semibold text-white">{{ formatSessionDate(sessionToDelete.date) }}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span class="text-white">Halaman:</span>
                                    <span class="font-bold text-emerald-300 tabular-nums">+{{ sessionToDelete.pagesAdded }} HAL</span>
                                </div>
                                <div v-if="sessionToDelete.duration" class="flex justify-between">
                                    <span class="text-white">Durasi:</span>
                                    <span class="font-semibold tabular-nums text-white">{{ timer.formatDuration(sessionToDelete.duration) }}</span>
                                </div>
                            </div>
                            <p class="text-[11px] text-red-300 font-medium">
                                ⚠️ Tindakan ini akan mengupdate progres buku dan tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div class="flex gap-2.5 pt-1">
                            <button type="button" @click="isDeleteSessionModalOpen = false"
                                class="btn-sunset-secondary flex-1 py-2 rounded-xl text-xs font-semibold text-white">
                                Batal
                            </button>
                            <button type="button" @click="confirmDeleteSession"
                                class="flex-1 rounded-xl bg-red-600 hover:bg-red-500 py-2 text-xs font-bold text-white transition-all shadow-md">
                                Ya, Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
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
const bookPickerSearchQuery = ref('')
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

const filteredPickerBooks = computed(() => {
    const q = bookPickerSearchQuery.value.trim().toLowerCase()
    if (!q) return books.value
    return books.value.filter(b => {
        const matchTitle = b.title ? b.title.toLowerCase().includes(q) : false
        const matchAuthor = b.author ? b.author.toLowerCase().includes(q) : false
        const matchPublisher = b.publisher ? b.publisher.toLowerCase().includes(q) : false
        return matchTitle || matchAuthor || matchPublisher
    })
})

watch(showBookPicker, (open) => {
    if (open) {
        bookPickerSearchQuery.value = ''
    }
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

const isDeleteSessionModalOpen = ref(false)
const sessionToDelete = ref<ReadSession | null>(null)

const openDeleteSessionModal = (session: ReadSession) => {
    sessionToDelete.value = session
    isDeleteSessionModalOpen.value = true
}

const confirmDeleteSession = async () => {
    if (!selectedBook.value || !sessionToDelete.value) return
    const pgs = sessionToDelete.value.pagesAdded
    await deleteReadSession(selectedBook.value.id!, sessionToDelete.value.id || 0)
    isDeleteSessionModalOpen.value = false
    sessionToDelete.value = null
    successNotification.value = `Riwayat sesi ${pgs} halaman berhasil dihapus.`
    setTimeout(() => {
        if (successNotification.value.includes('berhasil dihapus')) {
            successNotification.value = ''
        }
    }, 4000)
}

const statsAlertMessage = ref('')
const isPromptCopied = ref(false)

const get30DaysReadingData = () => {
    const now = new Date()
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    const start = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 29, 0, 0, 0, 0)

    const result: Array<{
        title: string
        author: string
        publisher: string
        readHistory: Array<{
            date: string
            pagesAdded: number
            durationSeconds: number | null
            startPage?: number
            endPage?: number
        }>
    }> = []

    books.value.forEach(book => {
        if (Array.isArray(book.readHistory)) {
            const filteredSessions = book.readHistory
                .filter((s: ReadSession) => {
                    if (!s.date) return false
                    const d = new Date(s.date)
                    return !isNaN(d.getTime()) && d >= start && d <= end
                })
                .map((s: ReadSession) => {
                    const sess: any = {
                        date: s.date,
                        pagesAdded: Number(s.pagesAdded) || 0,
                        durationSeconds: s.duration !== null && s.duration !== undefined ? Number(s.duration) : null
                    }
                    if (s.startPage !== undefined) sess.startPage = s.startPage
                    if (s.endPage !== undefined) sess.endPage = s.endPage
                    return sess
                })

            if (filteredSessions.length > 0) {
                result.push({
                    title: book.title || 'Tanpa Judul',
                    author: book.author || '',
                    publisher: book.publisher || '',
                    readHistory: filteredSessions
                })
            }
        }
    })

    const startDateStr = start.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    const endDateStr = end.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

    return {
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        startDateFormatted: startDateStr,
        endDateFormatted: endDateStr,
        data: result
    }
}

const copyToClipboard = async (text: string) => {
    if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text)
    } else {
        const textarea = document.createElement('textarea')
        textarea.value = text
        textarea.style.position = 'fixed'
        textarea.style.left = '-999999px'
        textarea.style.top = '-999999px'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        textarea.remove()
    }
}

const handleExportJSON = () => {
    const { data, startDate, endDate } = get30DaysReadingData()
    if (data.length === 0) {
        statsAlertMessage.value = 'Anda belum membaca apapun 30 hari terakhir.'
        setTimeout(() => {
            if (statsAlertMessage.value === 'Anda belum membaca apapun 30 hari terakhir.') {
                statsAlertMessage.value = ''
            }
        }, 5000)
        return
    }

    const payload = {
        title: 'LogBuku - Riwayat Sesi Membaca 30 Hari Terakhir',
        period: '30_days',
        startDate,
        endDate,
        exportedAt: new Date().toISOString(),
        books: data
    }

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(payload, null, 2))}`
    const downloadAnchor = document.createElement('a')
    downloadAnchor.setAttribute('href', jsonString)
    downloadAnchor.setAttribute('download', `logbuku-reading-history-30-days-${startDate}-to-${endDate}.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()

    statsAlertMessage.value = '✓ Data JSON 30 hari terakhir berhasil diekspor!'
    setTimeout(() => {
        if (statsAlertMessage.value === '✓ Data JSON 30 hari terakhir berhasil diekspor!') {
            statsAlertMessage.value = ''
        }
    }, 4000)
}

const handleCopyPrompt = async () => {
    const { data, startDate, endDate, startDateFormatted, endDateFormatted } = get30DaysReadingData()
    if (data.length === 0) {
        statsAlertMessage.value = 'Anda belum membaca apapun 30 hari terakhir.'
        setTimeout(() => {
            if (statsAlertMessage.value === 'Anda belum membaca apapun 30 hari terakhir.') {
                statsAlertMessage.value = ''
            }
        }, 5000)
        return
    }

    const payload = {
        period: '30_days',
        startDate,
        endDate,
        books: data
    }

    const promptText = `Berikut adalah data histori aktivitas membaca saya selama 30 hari terakhir (${startDateFormatted} — ${endDateFormatted}) dalam format JSON dari aplikasi LogBuku:

\`\`\`json
${JSON.stringify(payload, null, 2)}
\`\`\`

Sebagai seorang reading coach dan analis data membaca, tolong berikan analisis mendalam dan personal mengenai kebiasaan membaca saya berdasarkan data di atas:

1. **Pola & Konsistensi Membaca**:
   - Analisis seberapa konsisten saya membaca dalam 30 hari terakhir (frekuensi harian, streak, hari paling produktif, atau jeda membaca).
   - Pola waktu atau ritme baca yang terlihat dari data sesi.

2. **Analisis Durasi & Reading Pace (Kecepatan Membaca)**:
   - Evaluasi total durasi waktu yang dihabiskan untuk membaca dan rata-rata waktu per sesi.
   - Analisis reading pace (kecepatan per halaman / estimasi halaman per jam) pada masing-masing buku atau keseluruhan.

3. **Fokus Buku & Preferensi Bacaan**:
   - Buku mana yang paling banyak mendapat progres dan perhatian?
   - Bagaimana dinamika pergantian buku atau progres penyelesaian buku?

4. **Kekuatan & Evaluasi Kebiasaan Membaca**:
   - Apa poin positif dan kelebihan dari pola membaca saya sejauh ini?
   - Apa hambatan atau aspek yang bisa dioptimalkan?

5. **Rekomendasi & Actionable Plan untuk 30 Hari ke Depan**:
   - Berikan rekomendasi target harian/mingguan yang realistis.
   - Tips praktis untuk menjaga konsistensi dan efektivitas membaca saya.

Sajikan analisis dalam format yang rapi, terstruktur, mudah dipahami, dan tajam!`

    try {
        await copyToClipboard(promptText)
        isPromptCopied.value = true
        statsAlertMessage.value = '✓ Prompt analisis AI berhasil disalin ke clipboard!'
        setTimeout(() => {
            isPromptCopied.value = false
            if (statsAlertMessage.value === '✓ Prompt analisis AI berhasil disalin ke clipboard!') {
                statsAlertMessage.value = ''
            }
        }, 4000)
    } catch (e) {
        console.error('Gagal menyalin prompt:', e)
        statsAlertMessage.value = 'Gagal menyalin ke clipboard. Silakan coba lagi.'
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

const formatDailyDurationMinutes = (seconds: number | null | undefined): string => {
    if (!seconds || seconds <= 0) return '-'
    const mins = Math.round(seconds / 60)
    if (mins < 60) {
        return mins > 0 ? `${mins} mnt` : '<1 mnt'
    }
    const hours = (mins / 60).toFixed(1).replace('.', ',')
    return `${hours}jm`
}

onMounted(async () => {
    await loadBooks()
    window.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
    window.removeEventListener('click', handleDocumentClick)
})
</script>
