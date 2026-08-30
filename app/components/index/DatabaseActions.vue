<template>
    <section class="mt-8 sm:mt-10 border-t-2 border-[#0d0d0d] pt-6 sm:pt-8">
        <div
            class="flex flex-col gap-5 sm:gap-6 rounded-lg border-2 border-[#0d0d0d] bg-white p-4 sm:p-6 shadow-[3px_3px_0px_#0d0d0d] sm:flex-row sm:items-center sm:justify-between">
            <div class="min-w-0">
                <div class="flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round"
                        class="w-auto h-auto max-h-[30px] sm:max-h-[24px] shrink-0 text-[#0d0d0d]">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    <h2
                        class="text-lg sm:text-xl font-bold tracking-[-0.02em] text-[#0d0d0d] leading-snug uppercase break-words">
                        Cadangan & Pemulihan Data</h2>
                </div>
                <p class="mt-1.5 max-w-[70ch] text-xs sm:text-sm leading-relaxed text-[#44403c]">
                    Ekspor seluruh arsip buku fisik dan riwayat sesi membaca sebagai file JSON lokal, atau impor kembali kapan saja secara privat tanpa ketergantungan server.
                </p>

                <div v-if="statusMessage"
                    class="mt-3 inline-flex items-center gap-2 rounded-[4px] border border-[#0d0d0d] px-3 py-1 font-mono text-xs font-bold"
                    :class="statusMessage.type === 'success' ? 'bg-[#eafaf1] text-[#00875a] shadow-[1px_1px_0px_#00875a]' : 'bg-[#fff0eb] text-[#ff4800] shadow-[1px_1px_0px_#ff4800]'">
                    <span>[{{ statusMessage.text }}]</span>
                    <button type="button" @click="statusMessage = null" class="ml-1 text-current opacity-70 hover:opacity-100">✕</button>
                </div>
            </div>

            <div class="flex w-full shrink-0 flex-col sm:flex-row gap-2.5 sm:w-auto">
                <button @click="exportDatabase"
                    class="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-[4px] border-2 border-[#0d0d0d] bg-[#0d0d0d] px-4 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-[2px_2px_0px_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#ff4800] hover:bg-[#262626] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    EKSPOR CADANGAN
                </button>

                <button @click="triggerImport"
                    class="inline-flex w-full sm:w-auto cursor-pointer items-center justify-center gap-2 rounded-[4px] border-2 border-[#0d0d0d] bg-white px-4 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[2px_2px_0px_#0d0d0d] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_#0d0d0d] hover:bg-[#f3ede2] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0d0d0d]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    IMPOR DATA
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
