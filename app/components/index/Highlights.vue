<template>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section
            class="min-w-0 overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                    <h3 class="text-sm font-semibold tracking-tight text-gray-950"> 3 Buku Termahal </h3>
                    <p class="mt-1 text-[13px] text-gray-500"> Koleksi dengan harga tertinggi. </p>
                </div>
                <span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400"> Harga </span>
            </div>
            <div class="px-5">
                <div v-if="top3Expensive.length === 0" class="py-10 text-center text-sm text-gray-400">
                    Belum ada data harga.
                </div>
                <div v-for="(book, i) in top3Expensive" :key="'exp-' + book.id"
                    class="group flex min-w-0 items-center gap-3.5 border-b border-gray-100 py-4 last:border-0">
                    <div
                        class="h-[68px] w-[48px] shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200/80">
                        <img v-if="book.imageUrl" :src="book.imageUrl"
                            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                            loading="lazy" />
                    </div>
                    <div class="w-5 shrink-0 text-xs font-bold tabular-nums text-gray-300">
                        {{ String(i + 1).padStart(2, '0') }}
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="truncate text-[13px] font-semibold text-gray-900"> {{ book.title }} </h4>
                        <div class="mt-1.5">
                            <span class="text-sm font-bold tracking-tight text-gray-950"> {{
                                formatCurrency(book.price) }} </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="min-w-0 overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-shadow duration-200 hover:shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div class="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                    <h3 class="text-sm font-semibold tracking-tight text-gray-950"> 3 Buku Terbaru </h3>
                    <p class="mt-1 text-[13px] text-gray-500"> Koleksi yang paling baru ditambahkan. </p>
                </div>
                <span class="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400"> Terbaru </span>
            </div>
            <div class="px-5">
                <div v-if="top3Newest.length === 0" class="py-10 text-center text-sm text-gray-400">
                    Belum ada data buku.
                </div>
                <div v-for="(book, i) in top3Newest" :key="'new-' + book.id"
                    class="group flex min-w-0 items-center gap-3.5 border-b border-gray-100 py-4 last:border-0">
                    <div
                        class="h-[68px] w-[48px] shrink-0 overflow-hidden rounded-md bg-gray-100 ring-1 ring-gray-200/80">
                        <img v-if="book.imageUrl" :src="book.imageUrl"
                            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                            loading="lazy" />
                    </div>
                    <div class="w-5 shrink-0 text-xs font-bold tabular-nums text-gray-300">
                        {{ String(i + 1).padStart(2, '0') }}
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="truncate text-[13px] font-semibold text-gray-900"> {{ book.title }} </h4>
                        <p class="mt-1.5 text-xs font-medium text-gray-500">
                            {{ new Date(book.date || book.createdAt).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }) }}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    top3Expensive: any[]
    top3Newest: any[]
}>()
</script>
