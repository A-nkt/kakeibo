<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DataTable from '@/components/dashboard/DataTable.vue'
import BarChart from '@/components/dashboard/BarChart.vue'
import StatCard from '@/components/dashboard/StatCard.vue'
import {
  tableColumns,
  tableRows,
  dailyLabels,
  dailyDatasets,
  weeklyLabels,
  weeklyDatasets,
  monthlyLabels,
  monthlyDatasets,
  stats
} from '@/data/sampleData'

const isLoaded = ref(false)
const chartPeriod = ref<'daily' | 'weekly' | 'monthly'>('daily')

onMounted(() => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)
})

const currentLabels = computed(() => {
  switch (chartPeriod.value) {
    case 'weekly': return weeklyLabels
    case 'monthly': return monthlyLabels
    default: return dailyLabels
  }
})

const currentDatasets = computed(() => {
  switch (chartPeriod.value) {
    case 'weekly': return weeklyDatasets
    case 'monthly': return monthlyDatasets
    default: return dailyDatasets
  }
})

const statsGridClass = computed(() => {
  if (stats.length === 3) {
    return 'grid-cols-1 sm:grid-cols-3'
  }
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="border-b border-white/20 bg-white/60 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Dashboard
            </h1>
            <p class="mt-1 text-sm text-gray-500">費用データの概要とトレンド分析</p>
          </div>
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
              <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-500"></span>
              リアルタイム
            </span>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Stats Grid -->
      <div
        class="mb-8 grid gap-4"
        :class="[statsGridClass, { 'animate-fade-in': isLoaded }]"
      >
        <StatCard
          v-for="(stat, index) in stats"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :icon="stat.icon"
          :trend="stat.trend"
          :color="stat.color"
          :style="{ animationDelay: `${index * 100}ms` }"
          class="animate-slide-up"
        />
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <!-- Chart Section -->
        <div
          class="animate-slide-up rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl"
          :style="{ animationDelay: '400ms' }"
        >
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-800">コスト推移</h2>
            <div class="flex gap-1 rounded-lg bg-gray-100 p-1">
              <button
                @click="chartPeriod = 'daily'"
                :class="[
                  'rounded-md px-3 py-1 text-xs font-medium transition-all',
                  chartPeriod === 'daily'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                日別
              </button>
              <button
                @click="chartPeriod = 'weekly'"
                :class="[
                  'rounded-md px-3 py-1 text-xs font-medium transition-all',
                  chartPeriod === 'weekly'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                週次
              </button>
              <button
                @click="chartPeriod = 'monthly'"
                :class="[
                  'rounded-md px-3 py-1 text-xs font-medium transition-all',
                  chartPeriod === 'monthly'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                ]"
              >
                月次
              </button>
            </div>
          </div>
          <BarChart
            :key="chartPeriod"
            :labels="currentLabels"
            :datasets="currentDatasets"
            :show-legend="true"
          />
        </div>

        <!-- Table Section -->
        <div
          class="animate-slide-up rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl"
          :style="{ animationDelay: '500ms' }"
        >
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-800">商品一覧</h2>
            <button class="inline-flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              エクスポート
            </button>
          </div>
          <DataTable :columns="tableColumns" :rows="tableRows" />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.animate-slide-up {
  opacity: 0;
  animation: slide-up 0.6s ease-out forwards;
}
</style>
