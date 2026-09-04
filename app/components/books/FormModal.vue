<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-md" @click="close"></div>
        <div
            class="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden liquid-glass-modal animate-in zoom-in-95 duration-150">
            <div class="flex shrink-0 items-center justify-between px-5 py-4 sm:px-6">
                <div class="min-w-0 pr-3">
                    <h2 class="truncate text-base font-bold text-white leading-tight">
                        {{ form.id ? 'Edit Buku' : 'Tambah Buku Baru' }}
                    </h2>
                    <p class="mt-1 text-xs text-white">
                        {{ form.id ? 'Perbarui informasi dan metadata buku koleksi.' : 'Tambahkan data buku fisik baru ke arsip inventaris.' }}
                    </p>
                </div>
                <button @click="close" type="button" aria-label="Tutup modal"
                    class="btn-sunset-ghost flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-white hover:bg-white/15 transition-colors focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                    </svg>
                </button>
            </div>

            <div class="custom-scrollbar overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                <div v-if="!form.id" class="mb-5 flex rounded-xl bg-white/10 backdrop-blur-md p-1">
                    <button type="button" @click="addMode = 'form'"
                        :class="addMode === 'form' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-white hover:bg-white/10'"
                        class="flex-1 cursor-pointer rounded-lg py-1.5 text-xs font-semibold transition-all focus:outline-none">
                        Form Biasa
                    </button>
                    <button type="button" @click="addMode = 'json'"
                        :class="addMode === 'json' ? 'bg-white text-zinc-950 font-bold shadow-sm' : 'text-white hover:bg-white/10'"
                        class="flex-1 cursor-pointer rounded-lg py-1.5 text-xs font-semibold transition-all focus:outline-none">
                        Data JSON
                    </button>
                </div>

                <form v-if="addMode === 'form'" @submit.prevent="handleSubmitForm" class="space-y-4">
                    <div>
                        <label class="mb-1.5 block text-xs font-semibold text-white">
                            Judul Buku <span class="text-sky-300">*</span>
                        </label>
                        <input v-model="form.title" type="text" required placeholder="Contoh: Filosofi Teras..."
                            class="w-full rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-white placeholder:text-white/75" />
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-white">
                                Penulis <span class="text-[10px] font-normal text-white">(Opsional)</span>
                            </label>
                            <input v-model="form.author" type="text" placeholder="Nama penulis..."
                                class="w-full rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-white placeholder:text-white/75" />
                        </div>
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-white">
                                Penerbit <span class="text-[10px] font-normal text-white">(Opsional)</span>
                            </label>
                            <input v-model="form.publisher" type="text" placeholder="Nama penerbit..."
                                class="w-full rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-white placeholder:text-white/75" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-white">
                                Tanggal Beli <span class="text-sky-300">*</span>
                            </label>
                            <input v-model="form.date" type="date" required
                                class="w-full rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-white" />
                        </div>
                        <div class="min-w-0">
                            <label class="mb-1.5 block text-xs font-semibold text-white">
                                Topik <span class="text-[10px] font-normal text-white">(Maks. 3)</span>
                            </label>
                            <div v-if="form.topic.length > 0" class="mb-2 flex flex-wrap gap-1.5">
                                <span v-for="(t, idx) in form.topic" :key="idx"
                                    class="inline-flex max-w-full items-center gap-1.5 rounded-lg bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white">
                                    <span class="max-w-[120px] truncate">{{ t }}</span>
                                    <button type="button" @click="removeTopic(idx)"
                                        class="shrink-0 cursor-pointer text-white transition-colors hover:text-rose-300 focus:outline-none">
                                        &times;
                                    </button>
                                </span>
                            </div>
                            <input v-if="form.topic.length < 3" v-model="topicInput" type="text"
                                @keydown.enter.prevent="addTopic" @keydown.comma.prevent="addTopic" @blur="addTopic"
                                placeholder="Ketik lalu tekan Enter..."
                                class="w-full rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-white placeholder:text-white/75" />
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-white">
                                Total Halaman <span class="text-sky-300">*</span>
                            </label>
                            <input v-model.number="form.totalPages" type="number" min="1" required
                                class="w-full rounded-xl glass-input px-3.5 py-2 text-xs font-medium tabular-nums text-white" />
                        </div>
                        <div>
                            <label class="mb-1.5 block text-xs font-semibold text-white">
                                Harga (Rp) <span class="text-sky-300">*</span>
                            </label>
                            <input v-model.number="form.price" type="number" min="0" required
                                class="w-full rounded-xl glass-input px-3.5 py-2 text-xs font-medium tabular-nums text-white" />
                        </div>
                    </div>

                    <div>
                        <label class="mb-1.5 block text-xs font-semibold text-white">
                            URL Gambar Cover <span class="text-[10px] font-normal text-white">(Opsional)</span>
                        </label>
                        <input v-model="form.imageUrl" type="url" placeholder="https://..."
                            class="w-full rounded-xl glass-input px-3.5 py-2 text-xs font-medium text-white placeholder:text-white/75" />
                    </div>

                    <div
                        class="mt-6 flex flex-col-reverse gap-2.5 pt-4 sm:flex-row sm:items-center">
                        <button v-if="form.id" type="button" @click="showDeleteConfirm = true"
                            class="w-full cursor-pointer rounded-xl bg-red-500/20 px-3.5 py-2 text-xs font-semibold text-red-200 hover:bg-red-500/30 transition-all focus:outline-none sm:mr-auto sm:w-auto">
                            Hapus Buku
                        </button>
                        <div class="flex w-full gap-2.5 sm:w-auto">
                            <button type="button" @click="close"
                                class="btn-sunset-secondary flex-1 rounded-xl px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition-all sm:flex-none">
                                Batal
                            </button>
                            <button type="submit"
                                class="btn-sunset-primary flex-1 rounded-xl px-5 py-2 text-xs font-bold sm:flex-none">
                                Simpan
                            </button>
                        </div>
                    </div>
                </form>

                <div v-if="addMode === 'json'" class="space-y-4">
                    <div
                        class="rounded-xl bg-white/10 backdrop-blur-md p-4 text-xs leading-relaxed text-white">
                        <p class="mb-2 font-bold text-white">
                            Format Data Buku JSON
                        </p>
                        <p class="mb-2 text-white text-xs">
                            Isi data buku dengan struktur JSON berikut. Anda juga dapat meminta AI membuat datanya dengan format yang sama:
                        </p>

                        <p class="mb-2 italic text-sky-300 text-xs font-medium">
                            "{{ jsonPromptText }}"
                        </p>

                        <div class="relative">
                            <button type="button" @click="copyJsonTemplate" title="Salin prompt dan JSON"
                                class="btn-sunset-secondary absolute right-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                </svg>
                                Salin Template
                            </button>

                            <pre
                                class="overflow-x-auto rounded-lg bg-white/[0.08] backdrop-blur-sm p-3 pr-16 text-[11px] leading-5 text-white select-all custom-scrollbar font-mono">{{ jsonTemplateText }}</pre>
                        </div>
                    </div>

                    <div>
                        <textarea v-model="jsonInput" rows="6"
                            class="w-full text-xs p-3.5 glass-input rounded-xl text-white placeholder:text-white/75 custom-scrollbar"
                            placeholder="Paste data JSON di sini..."></textarea>
                    </div>

                    <div v-if="jsonErrorMessage"
                        class="rounded-xl bg-red-500/20 border border-red-500/30 p-3 text-xs font-semibold text-red-200">
                        {{ jsonErrorMessage }}
                    </div>

                    <div class="flex flex-wrap items-center justify-between gap-3 pt-4">
                        <div class="flex items-center gap-2.5">
                            <span class="text-xs font-semibold text-white">Upload File:</span>
                            <input type="file" accept=".json" class="hidden" ref="jsonFileRef"
                                @change="handleJsonFile" />
                            <button type="button" @click="triggerJsonFile"
                                class="btn-sunset-secondary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold py-2 px-3.5 rounded-xl text-white">
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
                            class="btn-sunset-primary rounded-xl px-5 py-2 text-xs font-bold w-full sm:w-auto">
                            Proses JSON
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showDeleteConfirm"
            class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
            <div class="liquid-glass-modal rounded-2xl max-w-sm w-full p-5 space-y-4 animate-in zoom-in-95 duration-150">
                <h3 class="text-sm font-bold text-red-300">Konfirmasi Hapus Buku</h3>
                <p class="text-xs text-white leading-relaxed">
                    Yakin ingin menghapus buku <strong class="text-white font-bold">"{{ form.title }}"</strong> dari arsip? Tindakan ini tidak dapat dibatalkan.
                </p>
                <div class="flex justify-end gap-2.5 pt-3">
                    <button type="button" @click="showDeleteConfirm = false"
                        class="btn-sunset-secondary px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white">
                        Batal
                    </button>
                    <button type="button" @click="confirmDelete"
                        class="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-xs font-bold text-white transition-all shadow-md">
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
    background: rgba(255, 255, 255, 0.15);
    border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}
</style>