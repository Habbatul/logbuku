<template>
    <div class="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-8 animate-in fade-in duration-300 space-y-6 sm:space-y-8">
        <IndexHeader :reading-streak="readingStreak" />

        <IndexOverview
            :total-books="totalBooks"
            :reading-books-count="readingBooksCount"
            :unread-books-count="unreadBooksCount"
            :avg-pages-per-day="avgPagesPerDay"
            @open-category-modal="isCategoryModalOpen = true"
        />

        <IndexTarget
            :target-books-count="targetBooks.length"
            :target-completed="targetCompleted"
            :target-progress-pct="targetProgressPct"
            :target-read-pages="targetReadPages"
            :target-total-pages="targetTotalPages"
            @open-target-modal="openTargetModal"
        />

        <IndexAnalytics
            v-model:filter-completed="filterCompleted"
            v-model:filter-pages="filterPages"
            v-model:filter-finance="filterFinance"
            :completed-data="completedData"
            :pages-data="pagesData"
            :finance-data="financeData"
        />

        <IndexInsights
            :most-read-books-insight="mostReadBooksInsight"
            :currently-reading-list="currentlyReadingList"
            :topic-scores="topicScores"
            :max-topic-score="maxTopicScore"
        />

        <IndexHighlights
            :top3-expensive="top3Expensive"
            :top3-newest="top3Newest"
        />

        <IndexPublishersAuthors
            :top5-publishers="top5Publishers"
            :max-publisher-count="maxPublisherCount"
            :top5-authors="top5Authors"
            :max-author-count="maxAuthorCount"
        />

        <IndexDatabaseActions />

        <IndexCategoryModal
            :is-open="isCategoryModalOpen"
            :books-per-category="booksPerCategory"
            @close="isCategoryModalOpen = false"
        />

        <IndexTargetModal
            :is-open="isTargetModalOpen"
            :books="books"
            :target-book-ids="targetBookIds"
            @close="isTargetModalOpen = false"
            @save="saveTargetSelection"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const { books, loadBooks, updateTargets } = useBooks()

useHead({
    title: 'Dashboard Analitik',
})

const {
    filterCompleted,
    filterPages,
    filterFinance,
    totalBooks,
    booksPerCategory,
    readingBooksCount,
    unreadBooksCount,
    avgPagesPerDay,
    readingStreak,
    completedData,
    pagesData,
    financeData,
    mostReadBooksInsight,
    currentlyReadingList,
    topicScores,
    maxTopicScore,
    top3Expensive,
    top3Newest,
    targetBooks,
    targetCompleted,
    targetTotalPages,
    targetReadPages,
    targetProgressPct,
    top5Publishers,
    maxPublisherCount,
    top5Authors,
    maxAuthorCount
} = useDashboard(books)

const isCategoryModalOpen = ref(false)
const isTargetModalOpen = ref(false)

const targetBookIds = computed(() => targetBooks.value.map(b => b.id))

const openTargetModal = () => {
    isTargetModalOpen.value = true
}

const saveTargetSelection = async (selectedIds: number[]) => {
    await updateTargets(selectedIds)
    isTargetModalOpen.value = false
}

onMounted(() => {
    loadBooks()
})
</script>