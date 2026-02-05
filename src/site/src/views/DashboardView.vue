<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useItemsStore } from '@/stores/items'
import { useCategoriesStore } from '@/stores/categories'
import { useBudgetStore } from '@/stores/budget'
import DataTable from '@/components/dashboard/DataTable.vue'
import BarChart from '@/components/dashboard/BarChart.vue'
import StatCard from '@/components/dashboard/StatCard.vue'

const router = useRouter()
const { currentUser, logout } = useAuth()
const itemsStore = useItemsStore()
const categoriesStore = useCategoriesStore()
const budgetStore = useBudgetStore()

const isLoaded = ref(false)
const chartPeriod = ref<'daily' | 'weekly' | 'monthly'>('daily')
const isUserMenuOpen = ref(false)

const isSlideOverOpen = ref(false)
const isSubmitting = ref(false)
const showSuccess = ref(false)
const selectedProduct = ref('')
const price = ref<number | null>(null)

const isBudgetModalOpen = ref(false)
const budgetInput = ref<number | null>(null)

const products = computed(() => categoriesStore.categories)

// テーブル用のカラム定義
const tableColumns = [
  { key: 'item_name', label: 'カテゴリ', width: '150px' },
  { key: 'price', label: '金額', width: '120px' },
  { key: 'created_date', label: '登録日', width: '120px' },
]

// itemsをテーブル表示用に変換
const tableRows = computed(() => {
  return itemsStore.items.map(item => {
    const product = products.value.find(p => p.category_id === item.id)
    return {
      item_name: product?.name || item.id,
      price: item.price,
      created_date: new Date(item.created * 1000).toLocaleDateString('ja-JP'),
    }
  })
})

// 統計カード用のデータ
const stats = computed(() => {
  const items = itemsStore.items

  // 今月のデータ
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime() / 1000
  const thisMonthItems = items.filter(item => item.created >= thisMonthStart)
  const thisMonthTotal = thisMonthItems.reduce((sum, item) => sum + item.price, 0)

  // 今月の残り日数
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
  const remainingDays = lastDayOfMonth - now.getDate() + 1 // 今日を含む

  // 予算と残り
  const budget = budgetStore.budget || 0
  const remaining = budget - thisMonthTotal
  const dailyBudget = remainingDays > 0 ? Math.floor(remaining / remainingDays) : 0

  // 先月のデータ（比較用）
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime() / 1000
  const lastMonthEnd = thisMonthStart
  const lastMonthItems = items.filter(item => item.created >= lastMonthStart && item.created < lastMonthEnd)
  const lastMonthTotal = lastMonthItems.reduce((sum, item) => sum + item.price, 0)

  // 前月比
  const monthlyChange = lastMonthTotal > 0 
    ? Math.round((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100) 
    : 0

  return [
    {
      title: '今月の残り',
      value: `¥${dailyBudget.toLocaleString()}/日`,
      subtitle: `残り${remainingDays}日`,
      icon: '💰',
      trend: 0,
      color: dailyBudget >= 0 ? 'blue' as const : 'red' as const
    },
    {
      title: '今月の支出',
      value: `¥${thisMonthTotal.toLocaleString()}`,
      subtitle: budget > 0 ? `予算 ¥${budget.toLocaleString()}` : '',
      icon: '📅',
      trend: monthlyChange,
      color: 'green' as const
    },
    {
      title: '残り予算',
      value: `¥${remaining.toLocaleString()}`,
      subtitle: remaining >= 0 ? '余裕あり' : '超過',
      icon: '📊',
      trend: 0,
      color: remaining >= 0 ? 'purple' as const : 'red' as const
    },
  ]
})

// グラフ用のデータ
const getDateKey = (timestamp: number, period: 'daily' | 'weekly' | 'monthly') => {
  const date = new Date(timestamp * 1000)
  if (period === 'monthly') {
    return `${date.getFullYear()}/${date.getMonth() + 1}`
  } else if (period === 'weekly') {
    const weekStart = new Date(date)
    weekStart.setDate(date.getDate() - date.getDay())
    return `${weekStart.getMonth() + 1}/${weekStart.getDate()}週`
  } else {
    return `${date.getMonth() + 1}/${date.getDate()}`
  }
}

const chartData = computed(() => {
  const items = itemsStore.items
  const period = chartPeriod.value
  
  // 期間ごとに集計
  const grouped: Record<string, number> = {}
  items.forEach(item => {
    const key = getDateKey(item.created, period)
    grouped[key] = (grouped[key] || 0) + item.price
  })
  
  // ソートしてラベルとデータを取得
  const sortedKeys = Object.keys(grouped).sort((a, b) => {
    // 日付順にソート
    return a.localeCompare(b)
  }).slice(-10) // 直近10件
  
  return {
    labels: sortedKeys,
    datasets: [{
      label: '支出',
      data: sortedKeys.map(key => grouped[key] || 0),
      backgroundColor: 'rgba(99, 102, 241, 0.8)',
      borderColor: 'rgb(99, 102, 241)',
      borderWidth: 1
    }]
  }
})

const currentLabels = computed(() => chartData.value.labels)
const currentDatasets = computed(() => chartData.value.datasets)

const statsGridClass = computed(() => {
  if (stats.value.length === 3) {
    return 'grid-cols-1 sm:grid-cols-3'
  }
  return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
})

const userEmail = computed(() => currentUser.value?.email || localStorage.getItem('userEmail') || '')

const isFormValid = computed(() => {
  return selectedProduct.value !== '' && price.value !== null && price.value > 0
})

const formattedPrice = computed(() => {
  if (price.value === null) return ''
  return new Intl.NumberFormat('ja-JP').format(price.value)
})

onMounted(async () => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)

  const customerId = currentUser.value?.email || localStorage.getItem('userEmail') || ''
  if (customerId) {
    await Promise.all([
      itemsStore.fetchItems(customerId),
      categoriesStore.fetchCategories(customerId),
      budgetStore.fetchBudget(customerId)
    ])
  }
})

const openSlideOver = () => {
  isSlideOverOpen.value = true
}

const openBudgetModal = () => {
  budgetInput.value = budgetStore.budget || null
  isBudgetModalOpen.value = true
  isUserMenuOpen.value = false
}

const closeBudgetModal = () => {
  isBudgetModalOpen.value = false
  budgetInput.value = null
}

const handleBudgetSave = async () => {
  if (budgetInput.value === null || budgetInput.value < 0) return

  const customerId = currentUser.value?.email || localStorage.getItem('userEmail') || ''
  if (!customerId) return

  try {
    await budgetStore.saveBudget(customerId, budgetInput.value)
    closeBudgetModal()
  } catch (e) {
    alert(e instanceof Error ? e.message : '予算の登録に失敗しました')
  }
}

const closeSlideOver = () => {
  isSlideOverOpen.value = false
  showSuccess.value = false
}

const handleSubmit = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true

  try {
    const selectedProductData = products.value.find(p => p.category_id === selectedProduct.value)
    const customerId = currentUser.value?.email || 'anonymous'

    await itemsStore.addItem(customerId, selectedProductData?.category_id || '', price.value)

    showSuccess.value = true

    setTimeout(() => {
      showSuccess.value = false
      selectedProduct.value = ''
      price.value = null
      closeSlideOver()
    }, 1500)
  } catch (error) {
    console.error('Registration error:', error)
    alert(error instanceof Error ? error.message : '登録に失敗しました')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="relative z-50 border-b border-white/20 bg-white/60 backdrop-blur-sm">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
              AI 家計簿
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
                @click="router.push('/categories')"
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                カテゴリ管理
              </button>
              <button
                @click="openBudgetModal"
                class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
              >
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                予算設定
              </button>
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
          :subtitle="stat.subtitle"
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
            <h2 class="text-lg font-semibold text-gray-800">支出一覧</h2>
            <span v-if="itemsStore.isLoading" class="text-xs text-gray-500">読み込み中...</span>
          </div>
          <DataTable :columns="tableColumns" :rows="tableRows" empty-message="登録された支出はありません" />
        </div>
      </div>
    </main>

    <!-- FAB (Floating Action Button) -->
    <button
      @click="openSlideOver"
      class="fab-button fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
    >
      <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>

    <!-- FAB Tooltip -->
    <div class="fab-tooltip fixed bottom-10 right-24 z-40 rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white opacity-0 shadow-lg transition-opacity">
      項目登録
    </div>

    <!-- Slide Over Backdrop -->
    <Transition name="fade">
      <div
        v-if="isSlideOverOpen"
        class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        @click="closeSlideOver"
      />
    </Transition>

    <!-- Slide Over Panel -->
    <Transition name="slide">
      <div
        v-if="isSlideOverOpen"
        class="fixed inset-y-0 right-0 z-50 w-full max-w-md"
      >
        <div class="flex h-full flex-col bg-white shadow-2xl">
          <!-- Header -->
          <div class="border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold text-white">項目登録</h2>
                <p class="mt-1 text-sm text-indigo-100">新しい項目を追加します</p>
              </div>
              <button
                @click="closeSlideOver"
                class="rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Form Content -->
          <div class="flex-1 overflow-y-auto p-6">
            <!-- Success Message -->
            <Transition name="fade">
              <div
                v-if="showSuccess"
                class="mb-6 flex items-center gap-3 rounded-xl bg-green-50 p-4 text-green-800"
              >
                <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p class="font-medium">登録完了</p>
                  <p class="text-sm text-green-600">項目が追加されました</p>
                </div>
              </div>
            </Transition>

            <form @submit.prevent="handleSubmit" class="space-y-6">
              <!-- Product Select -->
              <div>
                <label for="product" class="mb-2 block text-sm font-medium text-gray-700">
                  商品
                </label>
                <div class="relative">
                  <select
                    id="product"
                    v-model="selectedProduct"
                    class="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    <option value="" disabled>商品を選択</option>
                    <option v-for="product in products" :key="product.category_id" :value="product.category_id">
                      {{ product.name }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Price Input -->
              <div>
                <label for="price" class="mb-2 block text-sm font-medium text-gray-700">
                  価格
                </label>
                <div class="relative">
                  <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">¥</span>
                  <input
                    id="price"
                    v-model.number="price"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="0"
                    class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-8 pr-4 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <p v-if="price" class="mt-2 text-sm text-gray-500">
                  {{ formattedPrice }} 円
                </p>
              </div>
            </form>
          </div>

          <!-- Footer -->
          <div class="border-t border-gray-100 bg-gray-50 px-6 py-4">
            <div class="flex gap-3">
              <button
                type="button"
                @click="closeSlideOver"
                class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                @click="handleSubmit"
                :disabled="!isFormValid || isSubmitting"
                class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span v-if="!isSubmitting">登録する</span>
                <span v-else class="flex items-center justify-center gap-2">
                  <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  登録中...
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Budget Modal -->
    <Transition name="fade">
      <div v-if="isBudgetModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="closeBudgetModal">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">月間予算設定</h3>
              <p class="text-sm text-gray-500">1ヶ月の予算を設定してください</p>
            </div>
          </div>
          <div class="mb-6">
            <label class="mb-2 block text-sm font-medium text-gray-700">予算額</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">¥</span>
              <input
                v-model.number="budgetInput"
                type="number"
                min="0"
                step="1000"
                placeholder="100000"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-8 pr-4 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <p v-if="budgetInput" class="mt-2 text-sm text-gray-500">
              {{ new Intl.NumberFormat('ja-JP').format(budgetInput) }} 円
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="closeBudgetModal"
              class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              @click="handleBudgetSave"
              :disabled="budgetInput === null || budgetInput < 0 || budgetStore.isLoading"
              class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            >
              {{ budgetStore.isLoading ? '保存中...' : '保存する' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
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

/* FAB hover tooltip */
.fab-button:hover + .fab-tooltip {
  opacity: 1;
}

/* Slide Over Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: transform 0.3s ease-out;
}

.slide-leave-active {
  transition: transform 0.2s ease-in;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>
