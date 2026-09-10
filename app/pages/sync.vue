<template>
  <div class="mx-auto w-full max-w-4xl px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
    <div class="mb-5 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
      <div>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-200 hover:text-white transition-colors mb-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Dashboard
        </NuxtLink>

        <div class="flex items-start sm:items-center gap-2.5 sm:gap-3">
          <div class="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 20h.01" />
              <path d="M2 8.82a15 15 0 0 1 20 0" />
              <path d="M5 12.859a10 10 0 0 1 14 0" />
              <path d="M8.5 16.429a5 5 0 0 1 7 0" />
            </svg>
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <h1 class="text-lg sm:text-2xl font-bold tracking-tight text-white leading-tight">
                Transfer Data Antar-Perangkat
              </h1>
              <span class="inline-flex items-center gap-1 rounded-full bg-sky-400/20 border border-sky-400/30 px-2 py-0.5 text-[10px] font-bold text-sky-200 uppercase tracking-wider shrink-0">
                P2P Offline
              </span>
            </div>
            <p class="text-xs sm:text-sm text-white/80 mt-1 font-normal leading-relaxed -ml-10 md:ml-0">
              Sinkronisasi data buku langsung via WebRTC RTCDataChannel. Agar mengurangi kegagalan dalam transfer, gunakan jaringan atau wifi yang sama. 
            </p>
          </div>
        </div>
      </div>

      <button
        v-if="role !== null"
        type="button"
        @click="handleCancelOrReset"
        class="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 sm:py-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white transition-all shadow-sm shrink-0 min-h-[38px]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
        </svg>
        <span>Ganti Mode / Mulai Ulang</span>
      </button>
    </div>

    <div
      v-if="!isWebRTCSupported"
      class="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-white flex items-start gap-3 shadow-lg"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-rose-300 shrink-0 mt-0.5">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <div>
        <h3 class="text-sm font-bold text-white">Browser Tidak Mendukung WebRTC</h3>
        <p class="text-xs text-white/80 mt-1">
          Perangkat atau browser ini tidak menyediakan dukungan penuh untuk WebRTC RTCDataChannel. Silakan gunakan Google Chrome, Safari, Microsoft Edge, atau Mozilla Firefox versi terbaru.
        </p>
      </div>
    </div>

    <div class="mb-6 sm:mb-8 p-2.5 sm:p-3 rounded-2xl bg-slate-900/40 border border-white/16 backdrop-blur-md">
      <div class="flex items-center justify-between gap-1 sm:gap-2 text-[11px] sm:text-xs font-semibold">
        <div class="flex items-center gap-1 sm:gap-2" :class="stepIndex >= 1 ? 'text-sky-300' : 'text-white/50'">
          <span class="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border text-[10px] sm:text-xs font-bold shrink-0" :class="stepIndex >= 1 ? 'border-sky-400 bg-sky-400/20 text-sky-200' : 'border-white/30 text-white/50'">
            1
          </span>
          <span class="text-[10px] sm:text-xs font-medium">Peran</span>
        </div>

        <div class="h-0.5 flex-1 bg-white/15 mx-0.5 sm:mx-1" :class="{ '!bg-sky-400': stepIndex >= 2 }"></div>

        <div class="flex items-center gap-1 sm:gap-2" :class="stepIndex >= 2 ? 'text-sky-300' : 'text-white/50'">
          <span class="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border text-[10px] sm:text-xs font-bold shrink-0" :class="stepIndex >= 2 ? 'border-sky-400 bg-sky-400/20 text-sky-200' : 'border-white/30 text-white/50'">
            2
          </span>
          <span class="text-[10px] sm:text-xs font-medium">Pairing</span>
        </div>

        <div class="h-0.5 flex-1 bg-white/15 mx-0.5 sm:mx-1" :class="{ '!bg-sky-400': stepIndex >= 3 }"></div>

        <div class="flex items-center gap-1 sm:gap-2" :class="stepIndex >= 3 ? 'text-sky-300' : 'text-white/50'">
          <span class="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border text-[10px] sm:text-xs font-bold shrink-0" :class="stepIndex >= 3 ? 'border-sky-400 bg-sky-400/20 text-sky-200' : 'border-white/30 text-white/50'">
            3
          </span>
          <span class="text-[10px] sm:text-xs font-medium">Transfer</span>
        </div>

        <div class="h-0.5 flex-1 bg-white/15 mx-0.5 sm:mx-1" :class="{ '!bg-sky-400': stepIndex >= 4 }"></div>

        <div class="flex items-center gap-1 sm:gap-2" :class="stepIndex >= 4 ? 'text-emerald-300' : 'text-white/50'">
          <span class="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border text-[10px] sm:text-xs font-bold shrink-0" :class="stepIndex >= 4 ? 'border-emerald-400 bg-emerald-400/20 text-emerald-200' : 'border-white/30 text-white/50'">
            ✓
          </span>
          <span class="text-[10px] sm:text-xs font-medium">Selesai</span>
        </div>
      </div>
    </div>

    <div v-if="role === null && status !== 'error'" class="space-y-6">
      <div class="text-center max-w-md mx-auto mb-6">
        <h2 class="text-lg sm:text-xl font-bold text-white tracking-tight">
          Pilih Peran Perangkat Ini
        </h2>
        <p class="text-xs sm:text-sm text-white/80 mt-1">
          Tentukan apakah perangkat ini akan menerima data atau mengirim data ke perangkat lain.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <div
          @click="selectRole('receiver')"
          class="surface-card rounded-3xl p-4 sm:p-6 md:p-7 flex flex-col justify-between border border-white/20 hover:border-sky-300/40 cursor-pointer transition-colors duration-200 group relative overflow-hidden"
        >
          <div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-sky-400/20 blur-2xl pointer-events-none"></div>

          <div>
            <div class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-sky-500/20 border border-sky-400/30 text-sky-300 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>

            <h3 class="text-base sm:text-xl font-bold text-white tracking-tight mt-4 sm:mt-5">
              Mode Penerima (Receive)
            </h3>
            <p class="text-xs sm:text-sm text-white/80 mt-1.5 sm:mt-2 leading-relaxed font-normal">
              Perangkat ini akan menampilkan QR Code penawaran. Perangkat pengirim akan memindai QR ini untuk memulai transmisi data.
            </p>

            <ul class="mt-3.5 sm:mt-4 space-y-1.5 text-xs text-white/85 font-medium">
              <li class="flex items-center gap-2">
                <span class="text-sky-300 font-bold">✓</span>
                Menampilkan QR Code koneksi
              </li>
              <li class="flex items-center gap-2">
                <span class="text-sky-300 font-bold">✓</span>
                Memverifikasi checksum sebelum import
              </li>
              <li class="flex items-center gap-2">
                <span class="text-sky-300 font-bold">✓</span>
                Pilihan gabungkan (merge) atau ganti data
              </li>
            </ul>
          </div>

          <button
            type="button"
            class="mt-5 sm:mt-6 w-full py-3 px-4 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>Mulai Menerima Data</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div
          @click="selectRole('sender')"
          class="surface-card rounded-3xl p-4 sm:p-6 md:p-7 flex flex-col justify-between border border-white/20 hover:border-amber-300/40 cursor-pointer transition-colors duration-200 group relative overflow-hidden"
        >
          <div class="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-amber-400/20 blur-2xl pointer-events-none"></div>

          <div>
            <div class="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-400/30 text-amber-300 shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>

            <h3 class="text-base sm:text-xl font-bold text-white tracking-tight mt-4 sm:mt-5">
              Mode Pengirim (Send)
            </h3>
            <p class="text-xs sm:text-sm text-white/80 mt-1.5 sm:mt-2 leading-relaxed font-normal">
              Buka kamera di perangkat ini untuk memindai QR Code di perangkat penerima, lalu kirim seluruh arsip buku Anda secara langsung.
            </p>

            <ul class="mt-3.5 sm:mt-4 space-y-1.5 text-xs text-white/85 font-medium">
              <li class="flex items-center gap-2">
                <span class="text-amber-300 font-bold">✓</span>
                Pindai QR Code penerima dengan kamera
              </li>
              <li class="flex items-center gap-2">
                <span class="text-amber-300 font-bold">✓</span>
                Transfer P2P cepat dan langsung
              </li>
              <li class="flex items-center gap-2">
                <span class="text-amber-300 font-bold">✓</span>
                Data lokal tidak akan terhapus
              </li>
            </ul>
          </div>

          <button
            type="button"
            class="mt-5 sm:mt-6 w-full py-3 px-4 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-slate-950 text-xs sm:text-sm font-bold tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 min-h-[44px]"
          >
            <span>Mulai Mengirim Data</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </div>

      <div class="surface-card rounded-2xl p-5 border border-white/16 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center text-sky-200">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
            </svg>
          </div>
          <div>
            <h4 class="text-xs sm:text-sm font-bold text-white">Data Tersimpan Saat Ini</h4>
            <p class="text-xs text-white/70">Tersimpan di IndexedDB browser lokal Anda.</p>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <div>
            <div class="text-lg font-extrabold text-white tabular-nums">{{ localBooksCount }}</div>
            <div class="text-[11px] text-white/70 uppercase tracking-wider font-semibold">Total Buku</div>
          </div>
          <div class="h-8 w-px bg-white/20"></div>
          <div>
            <div class="text-lg font-extrabold text-white tabular-nums">{{ localSessionsCount }}</div>
            <div class="text-[11px] text-white/70 uppercase tracking-wider font-semibold">Sesi Baca</div>
          </div>
        </div>
      </div>

      <div v-if="localBooksCount === 0" class="p-3.5 sm:p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div class="flex items-center gap-2.5">
          <span class="text-lg">💡</span>
          <p class="text-xs text-amber-200">
            <strong class="text-white">Database Lokal Masih Kosong.</strong> Ingin menguji transfer antar-tab atau antar-device? Buat 3 buku sampel secara instan.
          </p>
        </div>
        <button
          type="button"
          @click="seedSampleBooks"
          class="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shrink-0 shadow-md transition-all"
        >
          + Buat 3 Buku Sampel
        </button>
      </div>
    </div>

    <div
      v-if="role !== null && (status === 'waiting' || status === 'connecting')"
      class="surface-card rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl space-y-5 sm:space-y-6"
    >
      <div v-if="role === 'receiver'" class="space-y-5 sm:space-y-6">
        <div v-if="status === 'connecting'" class="py-4 flex flex-col items-center justify-center space-y-4 text-center">
          <BluetoothRadar
            :active="true"
            variant="sky"
            title="Menghubungkan ke Pengirim..."
            :subtitle="statusMessage || 'Sedang melakukan negosiasi jaringan WebRTC dengan pengirim...'"
          />
          <div class="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-white/10 border border-white/16 text-xs text-sky-200 shadow-inner max-w-full">
            <svg class="animate-spin h-4 w-4 text-sky-400 shrink-0" viewBox="0 0 24 24" fill="none">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
            <span class="truncate">Menunggu pertukaran kandidat ICE & pembukaan saluran data P2P...</span>
          </div>
        </div>

        <div v-else-if="!receiverScanningAnswer">
          <BluetoothRadar
            :active="true"
            variant="sky"
            :title="localQrPayload ? 'Menunggu Perangkat Pengirim' : 'Menyiapkan QR Penawaran...'"
            :subtitle="statusMessage || 'Arahkan kamera perangkat pengirim ke QR Code di bawah.'"
          />

          <div class="mt-5 sm:mt-6 flex flex-col items-center">
            <QrCodeDisplay
              :value="localQrPayload"
              :loading="!localQrPayload"
              loading-title="Menyiapkan QR Penawaran..."
              loading-subtitle="Menghasilkan enkripsi WebRTC & kandidat ICE..."
              title="QR Penawaran Koneksi (Offer)"
            />

            <div
              v-if="localQrPayload"
              class="mt-5 sm:mt-6 p-4 sm:p-5 rounded-2xl bg-sky-500/15 border border-sky-400/40 max-w-md w-full text-center space-y-3.5 shadow-xl"
            >
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-bold uppercase tracking-wider">
                <span class="flex h-4 w-4 items-center justify-center rounded-full bg-sky-400 text-slate-950 text-[10px] font-black">2</span>
                <span>Langkah Selanjutnya</span>
              </div>

              <p class="text-xs text-white leading-relaxed font-medium">
                Setelah perangkat pengirim (HP) memindai QR di atas, HP akan menampilkan <strong class="text-sky-300">QR Balasan (Answer)</strong>.
              </p>

              <button
                type="button"
                @click="receiverScanningAnswer = true"
                class="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-xl flex items-center justify-center gap-2.5 min-h-[44px]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
                <span>Buka Kamera & Pindai QR Balasan</span>
              </button>
            </div>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div class="text-center max-w-sm mx-auto">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-200 text-xs font-bold mb-2">
              Langkah 2: Pindai Balasan
            </div>
            <h3 class="text-lg font-bold text-white tracking-tight">
              Pindai QR Balasan dari Pengirim
            </h3>
            <p class="text-xs text-white/80 mt-1">
              Arahkan kamera ke QR Code yang ditampilkan di layar perangkat pengirim.
            </p>
          </div>

          <QrScanner
            @scanned="handleReceiverScannedAnswer"
            @error="onScannerError"
            hint-text="Arahkan kamera ke QR balasan pengirim untuk meresmikan koneksi."
          />

          <div class="text-center">
            <button
              type="button"
              @click="receiverScanningAnswer = false"
              class="inline-flex items-center gap-1.5 text-xs text-sky-200 hover:text-white transition-colors py-2 px-3"
            >
              ← Kembali ke tampilan QR penawaran
            </button>
          </div>
        </div>
      </div>

      <div v-else-if="role === 'sender'" class="space-y-5 sm:space-y-6">
        <div v-if="!localQrPayload && !isGeneratingAnswer">
          <div class="text-center max-w-sm mx-auto mb-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-bold mb-2">
              Langkah 1: Pindai Penerima
            </div>
            <h3 class="text-lg font-bold text-white tracking-tight">
              Pindai QR Perangkat Penerima
            </h3>
            <p class="text-xs text-white/80 mt-1">
              Arahkan kamera Anda ke QR Code yang sedang ditampilkan di layar perangkat penerima.
            </p>
          </div>

          <QrScanner
            @scanned="handleSenderScannedOffer"
            @error="onScannerError"
            hint-text="Arahkan kamera ke QR Code di layar penerima."
          />
        </div>

        <div v-else>
          <BluetoothRadar
            :active="true"
            variant="amber"
            :title="localQrPayload ? 'QR Balasan Berhasil Dibuat' : 'Membuat QR Balasan...'"
            :subtitle="statusMessage || 'Tunjukkan kode ini ke perangkat penerima untuk menyelesaikan pairing.'"
          />

          <div class="mt-5 sm:mt-6 flex flex-col items-center">
            <QrCodeDisplay
              :value="localQrPayload"
              :loading="!localQrPayload"
              loading-title="Membuat QR Balasan..."
              loading-subtitle="Menyusun parameter koneksi P2P untuk penerima..."
              title="QR Jawaban Koneksi (Answer)"
            />

            <div
              v-if="localQrPayload"
              class="mt-5 p-4 rounded-2xl bg-amber-500/15 border border-amber-400/30 max-w-md w-full text-center space-y-2 shadow-md"
            >
              <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-bold uppercase tracking-wider">
                <span>Langkah 2: Selesaikan Pairing</span>
              </div>
              <p class="text-xs text-white leading-relaxed font-medium">
                Di layar perangkat penerima (Laptop), klik tombol <strong class="text-amber-300">"Buka Kamera & Pindai QR Balasan"</strong> lalu arahkan ke QR di atas.
              </p>
              <p class="text-[11px] text-white/75 pt-1">
                💡 Jika webcam laptop sulit membaca, klik tombol <strong>"Salin Kode Manual"</strong> di atas lalu gunakan opsi tempel di laptop.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="status === 'connected' || status === 'transferring'"
      class="surface-card rounded-3xl p-4 sm:p-6 md:p-8 border border-sky-400/30 shadow-2xl space-y-5 sm:space-y-6"
    >
      <div class="text-center max-w-md mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
          Koneksi P2P Terhubung Langsung
        </div>

        <h3 class="text-lg sm:text-xl font-bold text-white tracking-tight">
          {{ status === 'transferring' ? 'Mentransfer Koleksi Buku...' : 'Siap Mentransfer Data' }}
        </h3>
        <p class="text-xs sm:text-sm text-white/80 mt-1">
          {{ statusMessage || 'Saluran data WebRTC aktif. Mengirim arsip buku secara privat.' }}
        </p>
      </div>

      <div class="relative py-4 flex items-center justify-between max-w-md mx-auto px-2 sm:px-4">
        <div class="flex flex-col items-center gap-1.5 shrink-0">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <span class="text-[11px] font-bold text-amber-200">Pengirim</span>
        </div>

        <div class="flex-1 relative mx-2 sm:mx-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-amber-400 via-sky-400 to-emerald-400 transition-all duration-300"
            :style="{ width: `${transferStats.percentage}%` }"
          ></div>
          <div
            v-if="status === 'transferring'"
            class="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.8)_50%,transparent_100%)] animate-pulse"
          ></div>
        </div>

        <div class="flex flex-col items-center gap-1.5 shrink-0">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
              <path d="M12 18h.01" />
            </svg>
          </div>
          <span class="text-[11px] font-bold text-sky-200">Penerima</span>
        </div>
      </div>

      <div class="max-w-md mx-auto space-y-3 bg-black/20 p-3.5 sm:p-4 rounded-2xl border border-white/10">
        <div class="flex justify-between items-center text-xs font-bold text-white">
          <span>Progres Transfer</span>
          <span class="text-sky-300 tabular-nums text-sm">{{ transferStats.percentage }}%</span>
        </div>

        <div class="w-full h-2.5 sm:h-3 bg-white/10 rounded-full overflow-hidden p-0.5">
          <div
            class="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-200"
            :style="{ width: `${transferStats.percentage}%` }"
          ></div>
        </div>

        <div class="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1.5 text-center text-xs">
          <div>
            <div class="text-white/60 text-[10px] uppercase font-semibold">Total Buku</div>
            <div class="text-white font-bold tabular-nums text-xs sm:text-sm">{{ transferStats.totalBooks }}</div>
          </div>
          <div>
            <div class="text-white/60 text-[10px] uppercase font-semibold">Ukuran Data</div>
            <div class="text-white font-bold tabular-nums text-xs sm:text-sm">{{ formatBytes(transferStats.transferredBytes) }} / {{ formatBytes(transferStats.totalBytes) }}</div>
          </div>
          <div>
            <div class="text-white/60 text-[10px] uppercase font-semibold">Kecepatan</div>
            <div class="text-emerald-300 font-bold tabular-nums text-xs sm:text-sm">{{ formatBytes(transferStats.speedBps) }}/s</div>
          </div>
        </div>
      </div>

      <div v-if="role === 'sender'" class="pt-1 flex justify-center">
        <button
          type="button"
          @click="triggerManualSend"
          :disabled="status === 'transferring'"
          class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 min-h-[44px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{{ status === 'transferring' ? 'Sedang Mengirim...' : 'Kirim Ulang / Kirim Data Sekarang' }}</span>
        </button>
      </div>
    </div>

    <div
      v-if="(status === 'verifying' && role === 'receiver') || (receivedData && status !== 'completed' && status !== 'error')"
      class="surface-card rounded-3xl p-4 sm:p-6 md:p-8 border border-white/20 shadow-2xl space-y-5 sm:space-y-6"
    >
      <div class="text-center max-w-md mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-bold mb-3">
          ✓ Verifikasi Integritas Sukses
        </div>
        <h3 class="text-lg sm:text-xl font-bold text-white tracking-tight">
          Data Berhasil Diterima
        </h3>
        <p class="text-xs sm:text-sm text-white/80 mt-1">
          Seluruh berkas telah diperiksa dan siap diintegrasikan ke LogBuku di perangkat ini.
        </p>
      </div>

      <div v-if="receivedData" class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-lg mx-auto">
        <div class="p-3 sm:p-3.5 rounded-2xl bg-white/8 border border-white/14 text-center">
          <div class="text-lg sm:text-xl font-extrabold text-white tabular-nums">{{ receivedData.stats.totalBooks }}</div>
          <div class="text-[10px] text-white/70 uppercase font-bold mt-0.5">Buku Diterima</div>
        </div>
        <div class="p-3 sm:p-3.5 rounded-2xl bg-white/8 border border-white/14 text-center">
          <div class="text-lg sm:text-xl font-extrabold text-white tabular-nums">{{ receivedData.stats.totalReadSessions }}</div>
          <div class="text-[10px] text-white/70 uppercase font-bold mt-0.5">Sesi Membaca</div>
        </div>
        <div class="p-3 sm:p-3.5 rounded-2xl bg-white/8 border border-white/14 text-center">
          <div class="text-lg sm:text-xl font-extrabold text-white tabular-nums">{{ receivedData.stats.totalPagesRead }}</div>
          <div class="text-[10px] text-white/70 uppercase font-bold mt-0.5">Halaman</div>
        </div>
        <div class="p-3 sm:p-3.5 rounded-2xl bg-white/8 border border-white/14 text-center">
          <div class="text-lg sm:text-xl font-extrabold text-white tabular-nums">{{ receivedData.stats.totalCompletedBooks }}</div>
          <div class="text-[10px] text-white/70 uppercase font-bold mt-0.5">Buku Tamat</div>
        </div>
      </div>

      <div class="max-w-md mx-auto space-y-3">
        <label class="block text-xs font-bold text-white uppercase tracking-wider">
          Metode Penyimpanan Data:
        </label>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <label
            class="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl border cursor-pointer transition-all"
            :class="importMode === 'merge' ? 'border-sky-400 bg-sky-500/15 text-white shadow-sm' : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'"
          >
            <input type="radio" v-model="importMode" value="merge" class="mt-1 text-sky-400" />
            <div class="text-xs">
              <div class="font-bold text-white">Gabung (Merge)</div>
              <p class="text-[11px] text-white/75 mt-0.5 leading-snug">
                Pertahankan koleksi yang ada dan perbarui data yang lebih baru. (Disarankan)
              </p>
            </div>
          </label>

          <label
            class="flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl border cursor-pointer transition-all"
            :class="importMode === 'replace' ? 'border-rose-400 bg-rose-500/15 text-white shadow-sm' : 'border-white/15 bg-white/5 text-white/70 hover:bg-white/10'"
          >
            <input type="radio" v-model="importMode" value="replace" class="mt-1 text-rose-400" />
            <div class="text-xs">
              <div class="font-bold text-white">Ganti Semua</div>
              <p class="text-[11px] text-white/75 mt-0.5 leading-snug">
                Hapus data lokal saat ini dan ganti sepenuhnya dengan data yang baru ditransfer.
              </p>
            </div>
          </label>
        </div>
      </div>

      <div class="max-w-md mx-auto pt-2">
        <button
          type="button"
          @click="applyImport"
          :disabled="isImporting"
          class="w-full py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-slate-950 font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 min-h-[48px]"
        >
          <svg v-if="isImporting" class="animate-spin h-5 w-5 text-slate-950" viewBox="0 0 24 24" fill="none">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <span v-if="isImporting">Menyimpan ke Database...</span>
          <span v-else>Simpan ke Koleksi LogBuku</span>
        </button>
      </div>
    </div>

    <div
      v-if="status === 'completed'"
      class="surface-card rounded-3xl p-5 sm:p-8 md:p-10 border border-emerald-400/40 shadow-2xl text-center space-y-5 sm:space-y-6 max-w-lg mx-auto"
    >
      <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 flex items-center justify-center text-emerald-300 mx-auto shadow-[0_0_40px_rgba(16,185,129,0.35)] animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <div>
        <h3 class="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Transfer Selesai!
        </h3>
        <p class="text-xs sm:text-sm text-white/80 mt-1.5 leading-relaxed">
          {{ statusMessage || 'Seluruh data buku telah berhasil ditransfer dan disinkronkan langsung antar-perangkat.' }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-3 sm:pt-4 w-full">
        <NuxtLink
          to="/books"
          class="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-[0.98] text-white font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center justify-center gap-2 min-h-[44px]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
          </svg>
          <span>Buka Koleksi Buku</span>
        </NuxtLink>

        <NuxtLink
          to="/"
          class="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-[0.98] text-white font-semibold text-xs sm:text-sm transition-all border border-white/20 flex items-center justify-center min-h-[44px]"
        >
          Dashboard
        </NuxtLink>

        <button
          type="button"
          @click="reset"
          class="w-full sm:w-auto px-5 sm:px-6 py-3 rounded-2xl bg-transparent hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold transition-all min-h-[44px]"
        >
          Transfer Lagi
        </button>
      </div>
    </div>

    <div
      v-if="status === 'error'"
      class="surface-card rounded-3xl p-5 sm:p-8 border border-rose-500/40 shadow-2xl text-center space-y-5 max-w-md mx-auto"
    >
      <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>

      <div>
        <h3 class="text-lg font-bold text-white tracking-tight">
          Terjadi Kendala Sinkronisasi
        </h3>
        <p class="text-xs sm:text-sm text-rose-200/90 mt-1.5 leading-relaxed">
          {{ errorMessage || 'Terjadi kesalahan pada proses koneksi atau pemindahan data.' }}
        </p>
      </div>

      <div class="pt-2 flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
        <button
          type="button"
          @click="reset"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-md min-h-[40px]"
        >
          Coba Lagi
        </button>
        <NuxtLink
          to="/"
          class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all border border-white/20 flex items-center justify-center min-h-[40px]"
        >
          Batal
        </NuxtLink>
      </div>
    </div>

    <SyncLogConsole
      :logs="logs"
      :role="role"
      :peer-connection-state="peerConnectionState"
      :ice-connection-state="iceConnectionState"
      :data-channel-state="dataChannelState"
      @clear="clearLogs"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useP2PSync } from '~/composables/useP2PSync'
import { useBooks } from '~/composables/composable'
import BluetoothRadar from '~/components/sync/BluetoothRadar.vue'
import QrCodeDisplay from '~/components/sync/QrCodeDisplay.vue'
import QrScanner from '~/components/sync/QrScanner.vue'
import SyncLogConsole from '~/components/sync/SyncLogConsole.vue'

const {
  role,
  status,
  statusMessage,
  errorMessage,
  localQrPayload,
  isWebRTCSupported,
  transferStats,
  receivedData,
  isImporting,
  logs,
  peerConnectionState,
  iceConnectionState,
  dataChannelState,
  clearLogs,
  startAsReceiver,
  handleScannedOffer,
  handleScannedAnswer,
  sendAllBooks,
  importReceivedData,
  createSampleBooksForTesting,
  reset
} = useP2PSync()

const { books, loadBooks } = useBooks()

const receiverScanningAnswer = ref(false)
const isGeneratingAnswer = ref(false)
const importMode = ref<'merge' | 'replace'>('merge')

const seedSampleBooks = async () => {
  await createSampleBooksForTesting()
  await loadBooks()
}

const triggerManualSend = () => {
  sendAllBooks()
}

const localBooksCount = computed(() => books.value?.length || 0)
const localSessionsCount = computed(() => {
  return (books.value || []).reduce((acc, b) => acc + (b.readHistory?.length || 0), 0)
})

const stepIndex = computed(() => {
  if (status.value === 'completed') return 4
  if (status.value === 'transferring' || status.value === 'verifying' || receivedData.value) return 3
  if (status.value === 'waiting' || status.value === 'connecting' || status.value === 'connected') return 2
  return 1
})

const selectRole = (selectedRole: 'sender' | 'receiver') => {
  if (selectedRole === 'receiver') {
    receiverScanningAnswer.value = false
    isGeneratingAnswer.value = false
    startAsReceiver()
  } else {
    reset()
    isGeneratingAnswer.value = false
    role.value = 'sender'
    status.value = 'waiting'
    statusMessage.value = 'Pindai QR Code di layar perangkat penerima.'
  }
}

const handleSenderScannedOffer = async (offerPayload: string) => {
  isGeneratingAnswer.value = true
  try {
    await handleScannedOffer(offerPayload)
  } finally {
    isGeneratingAnswer.value = false
  }
}

const handleReceiverScannedAnswer = (answerPayload: string) => {
  receiverScanningAnswer.value = false
  handleScannedAnswer(answerPayload)
}

const onScannerError = (msg: string) => {
  console.warn('[Sync Scanner] Warning:', msg)
}

const handleCancelOrReset = () => {
  receiverScanningAnswer.value = false
  isGeneratingAnswer.value = false
  reset()
}

const applyImport = async () => {
  await importReceivedData(importMode.value)
}

const formatBytes = (bytes: number) => {
  if (!bytes || bytes <= 0) return '0 KB'
  const kb = bytes / 1024
  if (kb < 1024) {
    return `${kb.toFixed(1)} KB`
  }
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

onMounted(async () => {
  await loadBooks()
})
</script>
