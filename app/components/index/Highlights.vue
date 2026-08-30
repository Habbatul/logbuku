<template>
    <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section
            class="min-w-0 overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
            <div class="flex items-center justify-between gap-2.5 sm:gap-3 border-b-2 border-[#0d0d0d] px-4 py-3.5 sm:px-5 sm:py-4">
                <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-snug break-words"> "3 Buku Termahal" </h3>
                    <p class="mt-1 text-xs sm:text-sm leading-relaxed text-[#44403c]"> Koleksi dengan nilai perolehan tertinggi. </p>
                </div>
                <span class="shrink-0 rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2 py-0.5 sm:px-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0047ff] shadow-[1px_1px_0px_#0d0d0d]"> [VALUASI] </span>
            </div>
            <div class="px-4 sm:px-5 divide-y divide-[#e5dfd3]">
                <div v-if="top3Expensive.length === 0" class="py-8 sm:py-10 text-center font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">
                    [BELUM ADA DATA HARGA]
                </div>
                <div v-for="(book, i) in top3Expensive" :key="'exp-' + book.id"
                    class="group flex min-w-0 items-center gap-3 sm:gap-3.5 py-3.5 sm:py-4">
                    <div class="shrink-0 font-mono text-xs sm:text-sm font-bold tabular-nums text-[#0d0d0d] bg-[#f3ede2] border border-[#0d0d0d] px-1.5 py-0.5 sm:px-2 rounded-[2px] shadow-[1px_1px_0px_#0d0d0d]">
                        #{{ String(i + 1).padStart(2, '0') }}
                    </div>
                    <div
                        class="h-[64px] w-[44px] sm:h-[68px] sm:w-[48px] shrink-0 overflow-hidden rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] shadow-[1px_1px_0px_#0d0d0d]">
                        <img v-if="book.imageUrl" :src="book.imageUrl"
                            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                            loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center text-[#57534e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="line-clamp-2 text-xs sm:text-sm font-bold text-[#0d0d0d] font-mono leading-snug break-words"> {{ book.title }} </h4>
                        <div class="mt-1">
                            <span class="font-mono text-xs sm:text-base font-normal tracking-tight tabular-nums text-[#0047ff]">
                                {{ formatCurrency(book.price) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="min-w-0 overflow-hidden rounded-lg border-2 border-[#0d0d0d] bg-white shadow-[3px_3px_0px_#0d0d0d] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#0d0d0d]">
            <div class="flex items-center justify-between gap-2.5 sm:gap-3 border-b-2 border-[#0d0d0d] px-4 py-3.5 sm:px-5 sm:py-4">
                <div class="min-w-0">
                    <h3 class="text-sm sm:text-base font-bold uppercase tracking-[-0.015em] text-[#0d0d0d] leading-snug break-words"> "3 Buku Terbaru" </h3>
                    <p class="mt-1 text-xs sm:text-sm leading-relaxed text-[#44403c]"> Koleksi yang paling baru diarsipkan ke inventaris. </p>
                </div>
                <span class="shrink-0 rounded-[4px] border border-[#0d0d0d] bg-[#f3ede2] px-2 py-0.5 sm:px-2.5 font-mono text-xs font-bold uppercase tracking-wider text-[#0d0d0d] shadow-[1px_1px_0px_#0d0d0d]"> [AKUISISI] </span>
            </div>
            <div class="px-4 sm:px-5 divide-y divide-[#e5dfd3]">
                <div v-if="top3Newest.length === 0" class="py-8 sm:py-10 text-center font-mono text-xs sm:text-sm font-bold uppercase text-[#57534e]">
                    [BELUM ADA DATA BUKU]
                </div>
                <div v-for="(book, i) in top3Newest" :key="'new-' + book.id"
                    class="group flex min-w-0 items-center gap-3 sm:gap-3.5 py-3.5 sm:py-4">
                    <div class="shrink-0 font-mono text-xs sm:text-sm font-bold tabular-nums text-[#0d0d0d] bg-[#f3ede2] border border-[#0d0d0d] px-1.5 py-0.5 sm:px-2 rounded-[2px] shadow-[1px_1px_0px_#0d0d0d]">
                        #{{ String(i + 1).padStart(2, '0') }}
                    </div>
                    <div
                        class="h-[64px] w-[44px] sm:h-[68px] sm:w-[48px] shrink-0 overflow-hidden rounded-[3px] border border-[#0d0d0d] bg-[#f3ede2] shadow-[1px_1px_0px_#0d0d0d]">
                        <img v-if="book.imageUrl" :src="book.imageUrl"
                            class="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
                            loading="lazy" />
                        <div v-else class="flex h-full w-full items-center justify-center text-[#57534e]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 0-2.5-2.5A2.5 2.5 0 0 1 6.5 17H20" />
                            </svg>
                        </div>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="line-clamp-2 text-xs sm:text-sm font-bold text-[#0d0d0d] font-mono leading-snug break-words"> {{ book.title }} </h4>
                        <p class="mt-1 font-mono text-xs font-medium text-[#44403c]">
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
