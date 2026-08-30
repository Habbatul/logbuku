<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/30 backdrop-blur-sm" @click="close"></div>
        <div
            class="relative bg-white rounded-2xl shadow-2xl border border-gray-200/80 w-full max-w-xs overflow-hidden animate-in zoom-in-95 duration-200">
            <div class="p-4 sm:p-5 border-b border-gray-100/80 bg-white">
                <h2 class="text-[15px] font-semibold text-gray-900">Update Progres</h2>
                <p class="text-[13px] text-gray-500 mt-0.5 line-clamp-1">{{ book?.title }}</p>
            </div>

            <div class="p-4 sm:p-5 space-y-4">
                <div class="flex items-center justify-center gap-3">
                    <button type="button" @click="decrement"
                        class="w-10 h-10 cursor-pointer flex items-center justify-center bg-gray-50 border border-gray-200/80 rounded-lg hover:bg-gray-100 text-gray-700 font-semibold transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                        -
                    </button>

                    <input v-model.number="pagesRead" type="number"
                        class="w-20 h-10 text-center bg-white border border-gray-200/80 rounded-lg focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 outline-none text-[16px] font-semibold text-gray-900 transition-all hide-arrows"
                        @input="validate" />

                    <button type="button" @click="increment"
                        class="w-10 h-10 cursor-pointer flex items-center justify-center bg-gray-50 border border-gray-200/80 rounded-lg hover:bg-gray-100 text-gray-700 font-semibold transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                        +
                    </button>
                </div>

                <div class="text-center text-[12px] text-gray-500 font-medium">
                    dari total {{ totalPages }} halaman
                </div>

                <div class="pt-2 flex gap-3">
                    <button type="button" @click="close"
                        class="flex-1 cursor-pointer bg-white border border-gray-200/80 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-50 transition-colors text-[13px] shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10">
                        Batal
                    </button>
                    <button type="button" @click="handleSave"
                        class="flex-1 cursor-pointer bg-gray-900 text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition-colors text-[13px] shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20">
                        Simpan
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Book } from '~/types/book'

const props = defineProps<{
    isOpen: boolean
    book: Book | null
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'save', payload: { book: Book; newPages: number }): void
}>()

const pagesRead = ref(0)
const totalPages = ref(0)

watch(
    () => props.book,
    (newBook) => {
        if (newBook) {
            pagesRead.value = newBook.pagesRead || 0
            totalPages.value = newBook.totalPages || 0
        }
    },
    { immediate: true }
)

const validate = () => {
    if (pagesRead.value < 0) pagesRead.value = 0
    if (pagesRead.value > totalPages.value) pagesRead.value = totalPages.value
}

const increment = () => {
    if (pagesRead.value < totalPages.value) pagesRead.value++
}

const decrement = () => {
    if (pagesRead.value > 0) pagesRead.value--
}

const close = () => {
    emit('close')
}

const handleSave = () => {
    if (!props.book) return
    validate()
    emit('save', {
        book: props.book,
        newPages: pagesRead.value
    })
}
</script>

<style scoped>
.hide-arrows::-webkit-outer-spin-button,
.hide-arrows::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.hide-arrows {
    -moz-appearance: textfield;
}
</style>