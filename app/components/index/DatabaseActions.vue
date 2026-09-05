<template>
    <section class="mt-8">
        <div class="surface-card rounded-2xl border border-white/14 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-6 shadow-lg">
            <div class="min-w-0">
                <div class="flex items-center gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-5 h-5 shrink-0 text-sky-300">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    <h2 class="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
                        Cadangan & Pemulihan Data
                    </h2>
                </div>
                <p class="mt-1.5 max-w-xl text-xs sm:text-sm leading-relaxed text-white">
                    Ekspor seluruh arsip buku fisik dan riwayat sesi membaca sebagai file JSON lokal, atau impor kembali kapan saja secara privat tanpa ketergantungan server.
                </p>

                <div v-if="statusMessage"
                    class="mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
                    :class="statusMessage.type === 'success' ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-300' : 'bg-rose-500/20 border border-rose-500/30 text-rose-300'">
                    <span>{{ statusMessage.text }}</span>
                    <button type="button" @click="statusMessage = null" class="ml-1 text-white hover:text-rose-200">✕</button>
                </div>
            </div>

            <div class="flex w-full shrink-0 flex-col sm:flex-row gap-3 sm:w-auto">
                <button @click="exportDatabase"
                    class=" border border-amber-300/50  rounded-xl text-amber-100 bg-amber-400/10 hover:bg-amber-800/30 transition-colors inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Ekspor Cadangan
                </button>

                <button @click="triggerImport"
                    class=" border border-green-300/50  rounded-xl text-green-100 bg-green-500/10 hover:bg-green-800/30 transition-colors inline-flex w-full sm:w-auto items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Impor Data
                </button>
                <input type="file" ref="fileInput" accept=".json" class="hidden" @change="importDatabase" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const statusMessage = ref<{ type: 'success' | 'error', text: string } | null>(null)

const exportDatabase = async () => {
    const request = indexedDB.open('BookTrackerDB', 3)
    request.onsuccess = (e: any) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains('books')) return
        const tx = db.transaction('books', 'readonly')
        const store = tx.objectStore('books')
        const getAll = store.getAll()

        getAll.onsuccess = () => {
            const data = JSON.stringify(getAll.result, null, 2)
            const blob = new Blob([data], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `logbuku-backup-${new Date().toISOString().split('T')[0]}.json`
            a.click()
            URL.revokeObjectURL(url)
            statusMessage.value = { type: 'success', text: 'Data berhasil diekspor.' }
        }
    }
}

const triggerImport = () => {
    if (fileInput.value) fileInput.value.click()
}

const importDatabase = (event: any) => {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (e: any) => {
        try {
            const data = JSON.parse(e.target.result)
            if (!Array.isArray(data)) throw new Error('Format JSON tidak valid.')
            const request = indexedDB.open('BookTrackerDB', 3)
            request.onsuccess = (ev: any) => {
                const db = ev.target.result
                const tx = db.transaction('books', 'readwrite')
                const store = tx.objectStore('books')
                data.forEach((book: any) => store.put(book))
                tx.oncomplete = () => window.location.reload()
            }
        } catch (error) {
            statusMessage.value = { type: 'error', text: 'Gagal mengimpor file. Pastikan format JSON cadangan valid.' }
        } finally {
            if (fileInput.value) fileInput.value.value = ''
        }
    }
    reader.readAsText(file)
}
</script>
