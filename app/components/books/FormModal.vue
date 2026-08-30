<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-gray-950/40 backdrop-blur-[3px]" @click="close"></div>
        <div
            class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.18)] animate-in zoom-in-95 duration-200">
            <div class="flex shrink-0 items-center justify-between border-b border-gray-100 bg-white px-5 py-4 sm:px-6">
                <div class="min-w-0">
                    <h2 class="truncate text-base font-semibold tracking-tight text-gray-950">
                        {{ form.id ? 'Edit Buku' : 'Tambah Buku Baru' }}
                    </h2>
                    <p class="mt-0.5 text-xs text-gray-400">
                        {{ form.id ? 'Perbarui informasi buku.' : 'Tambahkan buku baru ke koleksimu.' }}
                    </p>
                </div>
                <button @click="close" type="button" aria-label="Tutup"
                    class="ml-4 flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
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
                        class="flex-1 cursor-pointer rounded py-1.5 text-xs font-semibold transition-all focus:outline-none">
                        Form Biasa
                    </button>
                    <button type="button" @click="addMode = 'json'"
                        :class="addMode === 'json' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'"
                        class="flex-1 cursor-pointer rounded py-1.5 text-xs font-semibold transition-all focus:outline-none">
                        Data JSON
                    </button>
                </div>

                <form v-if="addMode === 'form'" @submit.prevent="handleSubmitForm" class="space-y-5">
                    <div>
                        <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                            Judul Buku
                            <span class="text-red-500">*</span>
                        </label>
                        <input v-model="form.title" type="text" required
                            class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                    </div>

                    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                Penulis
                                <span class="ml-1 text-[11px] font-normal text-gray-400">(opsional)</span>
                            </label>
                            <input v-model="form.author" type="text" placeholder="Nama penulis..."
                                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                        </div>
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                Penerbit
                                <span class="ml-1 text-[11px] font-normal text-gray-400">(opsional)</span>
                            </label>
                            <input v-model="form.publisher" type="text" placeholder="Nama penerbit..."
                                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                Tanggal Beli
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.date" type="date" required
                                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
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
                                        class="shrink-0 cursor-pointer text-gray-400 transition-colors hover:text-red-500 focus:outline-none">
                                        &times;
                                    </button>
                                </span>
                            </div>
                            <input v-if="form.topic.length < 3" v-model="topicInput" type="text"
                                @keydown.enter.prevent="addTopic" @keydown.comma.prevent="addTopic" @blur="addTopic"
                                placeholder="Ketik lalu Enter..."
                                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                Total Halaman
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model.number="form.totalPages" type="number" min="1" required
                                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                        </div>
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                                Harga (Rp)
                                <span class="text-red-500">*</span>
                            </label>
                            <input v-model.number="form.price" type="number" min="0" required
                                class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                        </div>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-semibold text-gray-700">
                            URL Gambar Cover
                            <span class="ml-1 text-[11px] font-normal text-gray-400">(opsional)</span>
                        </label>
                        <input v-model="form.imageUrl" type="url" placeholder="https://..."
                            class="w-full rounded-md border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5" />
                    </div>

                    <div
                        class="mt-7 flex flex-col-reverse gap-2 border-t border-gray-100 pt-5 sm:flex-row sm:items-center">
                        <button v-if="form.id" type="button" @click="showDeleteConfirm = true"
                            class="w-full cursor-pointer rounded-md px-3.5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500/10 sm:mr-auto sm:w-auto">
                            Hapus
                        </button>
                        <div class="flex w-full gap-2 sm:w-auto">
                            <button type="button" @click="close"
                                class="flex-1 cursor-pointer rounded-md border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900/10 sm:flex-none">
                                Batal
                            </button>
                            <button type="submit"
                                class="flex-1 cursor-pointer rounded-md bg-gray-950 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/15 sm:flex-none">
                                Simpan
                            </button>
                        </div>
                    </div>
                </form>

                <div v-if="addMode === 'json'" class="space-y-4">
                    <div
                        class="rounded-lg border border-blue-100 bg-blue-50/60 p-3.5 text-xs leading-relaxed text-black/80">
                        <p class="mb-2">
                            Isi data buku dengan format JSON berikut. Anda juga bisa meminta AI untuk membuat datanya
                            dengan format yang sama.
                            <span class="font-semibold">Contoh prompt:</span>
                        </p>

                        <p class="mb-2 italic text-blue-700/80">
                            {{ jsonPromptText }}
                        </p>

                        <div class="relative">
                            <button type="button" @click="copyJsonTemplate" title="Salin prompt dan JSON"
                                class="absolute right-2 top-2 z-10 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-blue-100 bg-white/85 px-2 py-1.5 text-[11px] font-medium text-blue-700 backdrop-blur-sm transition-colors hover:border-blue-200 hover:bg-white hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-900/10">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                                Copy
                            </button>

                            <pre
                                class="overflow-x-auto rounded border border-blue-100 bg-white/70 p-2.5 pr-16 font-mono text-[11px] leading-5 text-blue-950 select-all">{{ jsonTemplateText }}</pre>
                        </div>
                    </div>

                    <div>
                        <textarea v-model="jsonInput" rows="6"
                            class="w-full text-[13px] font-mono p-3.5 border border-gray-200 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-gray-900/5 outline-none transition-all placeholder:text-gray-400 custom-scrollbar"
                            placeholder="Paste data JSON di sini..."></textarea>
                    </div>

                    <div v-if="jsonErrorMessage"
                        class="rounded-md bg-red-50 p-3 text-xs text-red-700 border border-red-200">
                        {{ jsonErrorMessage }}
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-5">
                        <div class="flex items-center gap-2.5">
                            <span class="text-xs font-medium text-gray-500">atau upload file:</span>
                            <input type="file" accept=".json" class="hidden" ref="jsonFileRef"
                                @change="handleJsonFile" />
                            <button type="button" @click="triggerJsonFile"
                                class="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold bg-white hover:bg-gray-50 text-gray-700 py-1.5 px-3 rounded-md transition-colors border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900/10">
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

                        <button type="button" @click="handleProcessJson"
                            class="rounded-md cursor-pointer bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black focus:outline-none focus:ring-2 focus:ring-gray-900/15 w-full sm:w-auto">
                            Proses JSON
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDeleteConfirm"
            class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-xs">
            <div class="bg-white rounded-xl max-w-sm w-full p-5 border border-gray-200 shadow-xl space-y-4">
                <h3 class="font-bold text-gray-900 text-sm">Konfirmasi Hapus</h3>
                <p class="text-xs text-gray-600 leading-relaxed">
                    Yakin ingin menghapus buku <strong>"{{ form.title }}"</strong>? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" @click="showDeleteConfirm = false"
                        class="cursor-pointer px-3 py-1.5 rounded-md text-xs font-semibold text-gray-600 hover:bg-gray-100">
                        Batal
                    </button>
                    <button type="button" @click="confirmDelete"
                        class="cursor-pointer px-3 py-1.5 rounded-md text-xs font-semibold bg-red-600 text-white hover:bg-red-700">
                        Ya, Hapus
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Book, BookFormData } from '~/types/book'

const props = defineProps<{
    isOpen: boolean
    editBook: Book | null
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', bookData: BookFormData): void
    (e: 'delete', bookId: string | number): void
    (e: 'import-json', books: Partial<Book>[]): void
}>()

const addMode = ref<'form' | 'json'>('form')
const topicInput = ref('')
const jsonInput = ref('')
const jsonFileRef = ref<HTMLInputElement | null>(null)
const jsonErrorMessage = ref('')
const showDeleteConfirm = ref(false)

const defaultForm: BookFormData = {
    id: null,
    title: '',
    author: '',
    publisher: '',
    date: new Date().toISOString().split('T')[0],
    topic: [],
    totalPages: null,
    pagesRead: 0,
    price: null,
    imageUrl: ''
}

const form = ref<BookFormData>({ ...defaultForm })

watch(
    () => props.isOpen,
    (open) => {
        if (open) {
            addMode.value = 'form'
            jsonInput.value = ''
            jsonErrorMessage.value = ''
            showDeleteConfirm.value = false
            topicInput.value = ''
            if (props.editBook) {
                form.value = {
                    id: props.editBook.id || null,
                    title: props.editBook.title || '',
                    author: props.editBook.author || '',
                    publisher: props.editBook.publisher || '',
                    date: props.editBook.date || new Date().toISOString().split('T')[0],
                    topic: props.editBook.topic ? [...props.editBook.topic] : [],
                    totalPages: props.editBook.totalPages || null,
                    pagesRead: props.editBook.pagesRead || 0,
                    price: props.editBook.price || null,
                    imageUrl: props.editBook.imageUrl || ''
                }
            } else {
                form.value = {
                    ...defaultForm,
                    author: '',
                    publisher: '',
                    topic: [],
                    date: new Date().toISOString().split('T')[0]
                }
            }
        }
    }
)

const close = () => {
    emit('close')
}

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

const handleSubmitForm = () => {
    addTopic()
    emit('save', { ...form.value })
}

const confirmDelete = () => {
    if (form.value.id) {
        emit('delete', form.value.id)
        showDeleteConfirm.value = false
    }
}

const triggerJsonFile = () => {
    if (jsonFileRef.value) jsonFileRef.value.click()
}

const handleJsonFile = (e: Event) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev: ProgressEvent<FileReader>) => {
        jsonInput.value = (ev.target?.result as string) || ''
    }
    reader.readAsText(file)
}

const handleProcessJson = () => {
    jsonErrorMessage.value = ''
    if (!jsonInput.value.trim()) {
        jsonErrorMessage.value = 'Teks JSON masih kosong!'
        return
    }

    try {
        let parsed = JSON.parse(jsonInput.value)
        if (!Array.isArray(parsed)) parsed = [parsed]

        const validBooks: Partial<Book>[] = []

        for (const item of parsed) {
            if (!item.title || !item.totalPages || item.price === undefined) {
                continue
            }
            validBooks.push({
                title: item.title,
                author: item.author || '',
                publisher: item.publisher || '',
                date: item.date || new Date().toISOString().split('T')[0],
                topic: Array.isArray(item.topic) ? item.topic.slice(0, 3) : item.topic ? [item.topic] : [],
                totalPages: parseInt(item.totalPages) || 1,
                pagesRead: parseInt(item.pagesRead) || 0,
                price: parseInt(item.price) || 0,
                imageUrl: item.imageUrl || ''
            })
        }

        if (validBooks.length > 0) {
            emit('import-json', validBooks)
        } else {
            jsonErrorMessage.value = 'Tidak ada buku yang valid. Pastikan format memiliki title, totalPages, dan price.'
        }
    } catch (err) {
        jsonErrorMessage.value = 'Format JSON tidak valid! Silakan cek kembali sintaks JSON kamu.'
    }
}

const jsonPromptText = 'Buatkan data buku menggunakan format JSON berikut:'

const jsonTemplateText = `[
  {
    "title": "Nama Buku",
    "author": "Nama Penulis",
    "publisher": "Nama Penerbit",
    "totalPages": 300,
    "price": 95000,
    "topic": ["Self-Help", "Bisnis"],
    "date": "2024-10-15",
    "imageUrl": "https://..."
  }
]`

const copyJsonTemplate = () => {
    const textToCopy = `${jsonPromptText}\n\n${jsonTemplateText}`
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
    } catch (e) {
        console.error('Copy fallback error', e)
    } finally {
        document.body.removeChild(textarea)
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
</style>