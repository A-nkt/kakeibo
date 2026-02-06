<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useItemsStore } from '@/stores/items'
import { useCategoriesStore } from '@/stores/categories'
import { useBudgetStore } from '@/stores/budget'

const router = useRouter()
const { currentUser } = useAuth()
const itemsStore = useItemsStore()
const categoriesStore = useCategoriesStore()
const budgetStore = useBudgetStore()

const activeTab = ref<'categories' | 'budget' | 'items'>('items')
const itemsScrollContainer = ref<HTMLElement | null>(null)

const scrollItemsToBottom = async () => {
  await nextTick()
  if (itemsScrollContainer.value) {
    itemsScrollContainer.value.scrollTop = itemsScrollContainer.value.scrollHeight
  }
}

watch(activeTab, (tab) => {
  if (tab === 'items') {
    scrollItemsToBottom()
  }
})
const customerId = computed(() => currentUser.value?.email || localStorage.getItem('userEmail') || '')

// カテゴリ管理
const isAddModalOpen = ref(false)
const isEditCategoryModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const newCategoryName = ref('')
const editingCategory = ref<{ category_id: string; name: string } | null>(null)
const deletingCategory = ref<{ category_id: string; name: string } | null>(null)

// 予算設定
const budgetInput = ref<number | null>(null)
const budgetSaved = ref(false)

// 支出管理
const isEditItemModalOpen = ref(false)
const editingItem = ref<{
  item_id: string
  categoryId: string
  price: number | null
  created: string
} | null>(null)

const categories = computed(() => categoriesStore.categories)
const products = computed(() => categoriesStore.categories)

const itemTableRows = computed(() => {
  return [...itemsStore.items].sort((a, b) => a.created - b.created).map(item => {
    const product = products.value.find(p => p.category_id === item.id)
    return {
      item_name: product?.name || item.id,
      price: item.price,
      created_date: new Date(item.created * 1000).toLocaleDateString('ja-JP'),
      item_id: item.item_id,
      category_id: item.id,
      created_timestamp: item.created,
    }
  })
})

onMounted(async () => {
  if (customerId.value) {
    await Promise.all([
      itemsStore.fetchItems(customerId.value),
      categoriesStore.fetchCategories(customerId.value),
      budgetStore.fetchBudget(customerId.value),
    ])
    budgetInput.value = budgetStore.budget || null
    scrollItemsToBottom()
  }
})

// カテゴリ操作
const openAddModal = () => {
  newCategoryName.value = ''
  isAddModalOpen.value = true
}

const closeAddModal = () => {
  isAddModalOpen.value = false
  newCategoryName.value = ''
}

const handleAdd = async () => {
  if (newCategoryName.value.trim() && customerId.value) {
    try {
      await categoriesStore.addCategory(customerId.value, newCategoryName.value.trim())
      closeAddModal()
    } catch (e) {
      alert(e instanceof Error ? e.message : '登録に失敗しました')
    }
  }
}

const openEditCategoryModal = (category: { category_id: string; name: string }) => {
  editingCategory.value = { ...category }
  isEditCategoryModalOpen.value = true
}

const closeEditCategoryModal = () => {
  isEditCategoryModalOpen.value = false
  editingCategory.value = null
}

const handleEditCategory = async () => {
  if (editingCategory.value && editingCategory.value.name.trim() && customerId.value) {
    try {
      await categoriesStore.editCategory(customerId.value, editingCategory.value.category_id, editingCategory.value.name.trim())
      closeEditCategoryModal()
    } catch (e) {
      alert(e instanceof Error ? e.message : '更新に失敗しました')
    }
  }
}

const openDeleteModal = (category: { category_id: string; name: string }) => {
  deletingCategory.value = category
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  deletingCategory.value = null
}

const handleDelete = async () => {
  if (deletingCategory.value && customerId.value) {
    try {
      await categoriesStore.removeCategory(customerId.value, deletingCategory.value.category_id)
      closeDeleteModal()
    } catch (e) {
      alert(e instanceof Error ? e.message : '削除に失敗しました')
    }
  }
}

// 予算操作
const handleBudgetSave = async () => {
  if (budgetInput.value === null || budgetInput.value < 0) return
  if (!customerId.value) return

  try {
    await budgetStore.saveBudget(customerId.value, budgetInput.value)
    budgetSaved.value = true
    setTimeout(() => { budgetSaved.value = false }, 2000)
  } catch (e) {
    alert(e instanceof Error ? e.message : '予算の登録に失敗しました')
  }
}

// 支出編集操作
const openEditItemModal = (row: typeof itemTableRows.value[number]) => {
  const timestamp = row.created_timestamp
  const date = new Date(timestamp * 1000)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  editingItem.value = {
    item_id: row.item_id,
    categoryId: row.category_id,
    price: row.price,
    created: `${yyyy}-${mm}-${dd}`,
  }
  isEditItemModalOpen.value = true
}

const closeEditItemModal = () => {
  isEditItemModalOpen.value = false
  editingItem.value = null
}

const handleEditItemSave = async () => {
  if (!editingItem.value || editingItem.value.price === null || editingItem.value.price <= 0) return
  if (!customerId.value) return

  const createdTimestamp = Math.floor(new Date(editingItem.value.created).getTime() / 1000)

  try {
    await itemsStore.editItem(
      customerId.value,
      editingItem.value.item_id,
      editingItem.value.categoryId,
      editingItem.value.price,
      createdTimestamp,
    )
    closeEditItemModal()
  } catch (e) {
    alert(e instanceof Error ? e.message : '更新に失敗しました')
  }
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="border-b border-white/20 bg-white/60 backdrop-blur-sm">
      <div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="group flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-gray-600 shadow-sm transition-all hover:bg-white hover:shadow-md hover:text-indigo-600"
          >
            <svg class="h-5 w-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
              各種設定
            </h1>
            <p class="mt-1 text-sm text-gray-500">カテゴリ・予算・支出の管理</p>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- Tab Navigation -->
      <div class="tab-container relative mb-8 flex gap-2 rounded-2xl border border-white/50 bg-white/60 p-1.5 shadow-lg backdrop-blur-sm">
        <div
          class="tab-indicator absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md transition-all duration-300 ease-out"
          :style="{
            left: activeTab === 'items' ? '6px' : activeTab === 'categories' ? 'calc(33.333% + 2px)' : 'calc(66.666% - 2px)',
            width: 'calc(33.333% - 5.333px)',
          }"
        />
        <button
          @click="activeTab = 'items'"
          :class="[
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300',
            activeTab === 'items'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span>支出管理</span>
          <span
            v-if="itemTableRows.length > 0"
            :class="[
              'ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-all duration-300',
              activeTab === 'items'
                ? 'bg-white/25 text-white'
                : 'bg-indigo-100 text-indigo-600'
            ]"
          >
            {{ itemTableRows.length }}
          </span>
        </button>
        <button
          @click="activeTab = 'categories'"
          :class="[
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300',
            activeTab === 'categories'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span class="hidden sm:inline">カテゴリ管理</span>
          <span class="sm:hidden">カテゴリ</span>
          <span
            v-if="categories.length > 0"
            :class="[
              'ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-all duration-300',
              activeTab === 'categories'
                ? 'bg-white/25 text-white'
                : 'bg-indigo-100 text-indigo-600'
            ]"
          >
            {{ categories.length }}
          </span>
        </button>
        <button
          @click="activeTab = 'budget'"
          :class="[
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300',
            activeTab === 'budget'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>予算設定</span>
        </button>
      </div>

      <!-- 支出管理タブ -->
      <div v-if="activeTab === 'items'">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">支出一覧</h2>
          <span v-if="itemsStore.isLoading" class="text-xs text-gray-500">読み込み中...</span>
        </div>

        <div class="overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm">
          <div ref="itemsScrollContainer" class="max-h-[600px] overflow-auto">
            <table class="min-w-full">
              <thead class="sticky top-0 z-10">
                <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600" style="width: 150px">カテゴリ</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600" style="width: 120px">金額</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600" style="width: 120px">登録日</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600" style="width: 80px">編集</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr
                  v-for="row in itemTableRows"
                  :key="row.item_id"
                  class="group transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50"
                >
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{{ row.item_name }}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-600">¥{{ row.price.toLocaleString() }}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm text-gray-700">{{ row.created_date }}</td>
                  <td class="whitespace-nowrap px-6 py-4 text-sm">
                    <button
                      @click="openEditItemModal(row)"
                      class="rounded-lg p-2 text-gray-400 transition-all hover:bg-indigo-100 hover:text-indigo-600"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </td>
                </tr>
                <tr v-if="itemTableRows.length === 0">
                  <td colspan="4" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center gap-2 text-gray-400">
                      <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                      <span class="text-sm">登録された支出はありません</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- カテゴリ管理タブ -->
      <div v-if="activeTab === 'categories'">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-gray-800">カテゴリ一覧</h2>
          <button
            @click="openAddModal"
            :disabled="categoriesStore.isLoading"
            class="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            <svg class="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span class="hidden sm:inline">新規追加</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="categoriesStore.isLoading && categories.length === 0" class="flex flex-col items-center justify-center py-20">
          <div class="h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          <p class="mt-4 text-gray-500">読み込み中...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="categories.length === 0" class="flex flex-col items-center justify-center py-20">
          <div class="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100">
            <svg class="h-10 w-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-800">カテゴリがありません</h3>
          <p class="mt-1 text-sm text-gray-500">新しいカテゴリを追加してみましょう</p>
          <button
            @click="openAddModal"
            class="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            最初のカテゴリを追加
          </button>
        </div>

        <!-- Categories Table -->
        <div v-else class="overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/50">
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  カテゴリ名
                  <span class="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-600">{{ categories.length }}</span>
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="category in categories"
                :key="category.category_id"
                class="group transition-colors hover:bg-indigo-50/30"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <span class="font-medium text-gray-800">{{ category.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      @click="openEditCategoryModal(category)"
                      class="rounded-lg p-2 text-gray-400 transition-all hover:bg-indigo-100 hover:text-indigo-600"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="openDeleteModal(category)"
                      class="rounded-lg p-2 text-gray-400 transition-all hover:bg-red-100 hover:text-red-600"
                    >
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 予算設定タブ -->
      <div v-if="activeTab === 'budget'">
        <div class="mx-auto max-w-lg">
          <div class="rounded-2xl border border-white/50 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <div class="mb-6 flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-bold text-gray-800">月間予算設定</h2>
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
            <Transition name="fade">
              <div v-if="budgetSaved" class="mb-4 flex items-center gap-2 rounded-xl bg-green-50 p-3 text-sm text-green-700">
                <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                保存しました
              </div>
            </Transition>
            <button
              @click="handleBudgetSave"
              :disabled="budgetInput === null || budgetInput < 0 || budgetStore.isLoading"
              class="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            >
              {{ budgetStore.isLoading ? '保存中...' : '保存する' }}
            </button>
          </div>
        </div>
      </div>


    </main>

    <!-- Add Category Modal -->
    <Transition name="modal">
      <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeAddModal"></div>
        <div class="relative w-full max-w-md transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">新規カテゴリ</h3>
              <p class="text-sm text-gray-500">カテゴリ名を入力してください</p>
            </div>
          </div>
          <div class="mb-6">
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="例: 食費、交通費、娯楽費..."
              class="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-4 text-gray-900 transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              @keyup.enter="handleAdd"
              autofocus
            />
          </div>
          <div class="flex gap-3">
            <button
              @click="closeAddModal"
              class="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              @click="handleAdd"
              :disabled="!newCategoryName.trim() || categoriesStore.isLoading"
              class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {{ categoriesStore.isLoading ? '追加中...' : '追加する' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Category Modal -->
    <Transition name="modal">
      <div v-if="isEditCategoryModalOpen && editingCategory" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeEditCategoryModal"></div>
        <div class="relative w-full max-w-md transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">カテゴリ編集</h3>
              <p class="text-sm text-gray-500">カテゴリ名を変更してください</p>
            </div>
          </div>
          <div class="mb-6">
            <input
              v-model="editingCategory.name"
              type="text"
              placeholder="カテゴリ名"
              class="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-4 text-gray-900 transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              @keyup.enter="handleEditCategory"
              autofocus
            />
          </div>
          <div class="flex gap-3">
            <button
              @click="closeEditCategoryModal"
              class="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              @click="handleEditCategory"
              :disabled="!editingCategory.name.trim() || categoriesStore.isLoading"
              class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {{ categoriesStore.isLoading ? '保存中...' : '保存する' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Category Modal -->
    <Transition name="modal">
      <div v-if="isDeleteModalOpen && deletingCategory" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDeleteModal"></div>
        <div class="relative w-full max-w-md transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">カテゴリを削除</h3>
              <p class="text-sm text-gray-500">この操作は取り消せません</p>
            </div>
          </div>
          <div class="mb-6 rounded-xl bg-red-50 p-4">
            <p class="text-gray-700">
              「<span class="font-bold text-red-600">{{ deletingCategory.name }}</span>」を削除しますか？
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="closeDeleteModal"
              class="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              @click="handleDelete"
              :disabled="categoriesStore.isLoading"
              class="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
            >
              {{ categoriesStore.isLoading ? '削除中...' : '削除する' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Item Modal -->
    <Transition name="fade">
      <div v-if="isEditItemModalOpen && editingItem" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="closeEditItemModal">
        <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">支出の編集</h3>
              <p class="text-sm text-gray-500">カテゴリ・金額・登録日を変更できます</p>
            </div>
          </div>
          <div class="mb-6 space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">カテゴリ</label>
              <div class="relative">
                <select
                  v-model="editingItem.categoryId"
                  class="w-full appearance-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 pr-10 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
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
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">金額</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">¥</span>
                <input
                  v-model.number="editingItem.price"
                  type="number"
                  min="0"
                  step="1"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-8 pr-4 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">登録日</label>
              <input
                v-model="editingItem.created"
                type="date"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="closeEditItemModal"
              class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              @click="handleEditItemSave"
              :disabled="!editingItem.price || editingItem.price <= 0 || !editingItem.created || itemsStore.isLoading"
              class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            >
              {{ itemsStore.isLoading ? '保存中...' : '保存する' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.95) translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
