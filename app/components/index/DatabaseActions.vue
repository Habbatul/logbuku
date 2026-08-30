<template>
    <section class="mt-10 border-t border-gray-200 pt-8">
        <div
            class="flex flex-col gap-6 rounded-xl border border-gray-200/80 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div class="min-w-0">
                <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="shrink-0 text-gray-500">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    <h2 class="truncate text-base font-semibold tracking-tight text-gray-950">
                        Database Management
                    </h2>
                </div>
                <p class="mt-1.5 max-w-[70ch] text-sm leading-6 text-gray-500">
                    Export seluruh koleksi dan riwayat membacamu sebagai file JSON untuk backup, atau Import untuk
                    memulihkannya.
                </p>
            </div>

            <div class="flex w-full shrink-0 flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
                <button @click="triggerImport"
                    class="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:flex-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" x2="12" y1="3" y2="15" />
                    </svg>
                    Import
                </button>
                <input type="file" ref="fileInput" accept=".json" class="hidden" @change="importDatabase" />

                <button @click="exportDatabase"
                    class="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:flex-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" x2="12" y1="15" y2="3" />
                    </svg>
                    Export
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)

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
            a.download = `booktracker-backup-${new Date().toISOString().split('T')[0]}.json`
            a.click()
            URL.revokeObjectURL(url)
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
            alert('Gagal melakukan import. Pastikan file JSON valid.')
        } finally {
            if (fileInput.value) fileInput.value.value = ''
        }
    }
    reader.readAsText(file)
}
</script>
