<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
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

const { currentUser, logout } = useAuth()
const isLoaded = ref(false)
const chartPeriod = ref<'daily' | 'weekly' | 'monthly'>('daily')
const isUserMenuOpen = ref(false)

const userEmail = computed(() => currentUser.value?.email || localStorage.getItem('userEmail') || 'user@example.com')

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
    <header class="relative z-50 border-b border-white/20 bg-white/60 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              Dashboard
            </h1>
            <p class="mt-1 text-sm text-gray-500">費用データの概要とトレンド分析</p>
          </div>
          <div class="relative z-50 flex items-center gap-3">
            <!-- User Menu -->
            <button
              @click="isUserMenuOpen = !isUserMenuOpen"
              class="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-white hover:shadow-md"
            >
              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span class="hidden sm:inline">{{ userEmail }}</span>
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 top-full z-[100] mt-2 w-48 rounded-xl border border-white/50 bg-white/95 py-2 shadow-xl backdrop-blur-sm"
            >
              <div class="border-b border-gray-100 px-4 py-2">
                <p class="text-xs text-gray-500">ログイン中</p>
                <p class="truncate text-sm font-medium text-gray-900">{{ userEmail }}</p>
              </div>
              <button
                @click="logout"
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                ログアウト
              </button>
            </div>
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
