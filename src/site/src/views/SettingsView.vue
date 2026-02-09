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

const activeTab = ref<'variable' | 'fixed' | 'categories'>('variable')
const itemsScrollContainer = ref<HTMLElement | null>(null)

const scrollItemsToBottom = async () => {
  await nextTick()
  if (itemsScrollContainer.value) {
    itemsScrollContainer.value.scrollTop = itemsScrollContainer.value.scrollHeight
  }
}

watch(activeTab, (tab) => {
  if (tab === 'variable') {
    scrollItemsToBottom()
  }
})
const customerId = computed(() => currentUser.value?.email || localStorage.getItem('userEmail') || '')

// カテゴリ管理
const isEditCategoryModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const newCategoryName = ref('')
const editingCategory = ref<{ category_id: string; name: string } | null>(null)
const deletingCategory = ref<{ category_id: string; name: string } | null>(null)

// 予算設定
const budgetInput = ref<number | null>(null)
const budgetSaved = ref(false)

// 固定費管理
const newFixedName = ref('')
const newFixedPrice = ref<number | null>(null)
const isEditFixedModalOpen = ref(false)
const isDeleteFixedModalOpen = ref(false)
const editingFixed = ref<{ item_id: string; name: string; price: number | null } | null>(null)
const deletingFixed = ref<{ item_id: string; name: string } | null>(null)

const fixedItems = computed(() =>
  itemsStore.items.filter(item => item.is_fixed === true),
)

// 支出管理
const isEditItemModalOpen = ref(false)
const editingItem = ref<{
  item_id: string
  categoryId: string
  price: number | null
  created: string
  memo: string
} | null>(null)

const categories = computed(() => categoriesStore.categories)
const products = computed(() => categoriesStore.categories)

const variableItemRows = computed(() => {
  return [...itemsStore.items]
    .filter(item => item.is_fixed !== true)
    .sort((a, b) => a.created - b.created)
    .map(item => {
      const product = products.value.find(p => p.category_id === item.id)
      return {
        item_name: product?.name || item.id,
        price: item.price,
        memo: item.memo || '',
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
const handleAddCategory = async () => {
  if (newCategoryName.value.trim() && customerId.value) {
    try {
      await categoriesStore.addCategory(customerId.value, newCategoryName.value.trim())
      newCategoryName.value = ''
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
const openEditItemModal = (row: typeof variableItemRows.value[number]) => {
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
    memo: row.memo,
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
      editingItem.value.memo || undefined,
    )
    closeEditItemModal()
  } catch (e) {
    alert(e instanceof Error ? e.message : '更新に失敗しました')
  }
}

// 固定費操作
const handleAddFixed = async () => {
  if (!newFixedName.value.trim() || !newFixedPrice.value || newFixedPrice.value <= 0) return
  if (!customerId.value) return

  try {
    await itemsStore.addFixedItem(customerId.value, newFixedName.value.trim(), newFixedPrice.value)
    newFixedName.value = ''
    newFixedPrice.value = null
  } catch (e) {
    alert(e instanceof Error ? e.message : '登録に失敗しました')
  }
}

const openEditFixedModal = (item: { item_id: string; name?: string; price: number }) => {
  editingFixed.value = { item_id: item.item_id, name: item.name || '', price: item.price }
  isEditFixedModalOpen.value = true
}

const closeEditFixedModal = () => {
  isEditFixedModalOpen.value = false
  editingFixed.value = null
}

const handleEditFixedSave = async () => {
  if (!editingFixed.value || !editingFixed.value.name.trim() || !editingFixed.value.price || editingFixed.value.price <= 0) return
  if (!customerId.value) return

  try {
    await itemsStore.editFixedItem(customerId.value, editingFixed.value.item_id, editingFixed.value.name.trim(), editingFixed.value.price)
    closeEditFixedModal()
  } catch (e) {
    alert(e instanceof Error ? e.message : '更新に失敗しました')
  }
}

const openDeleteFixedModal = (item: { item_id: string; name?: string }) => {
  deletingFixed.value = { item_id: item.item_id, name: item.name || '' }
  isDeleteFixedModalOpen.value = true
}

const closeDeleteFixedModal = () => {
  isDeleteFixedModalOpen.value = false
  deletingFixed.value = null
}

const handleDeleteFixed = async () => {
  if (!deletingFixed.value || !customerId.value) return

  try {
    await itemsStore.removeItem(customerId.value, deletingFixed.value.item_id)
    closeDeleteFixedModal()
  } catch (e) {
    alert(e instanceof Error ? e.message : '削除に失敗しました')
  }
}

const goBack = () => {
  router.push('/dashboard')
}
</script>

<template>
  <div class="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 md:h-screen md:overflow-hidden">
    <!-- Header -->
    <header class="shrink-0 border-b border-white/20 bg-white/60 backdrop-blur-sm">
      <div class="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
        <div class="flex items-center gap-4">
          <button
            @click="goBack"
            class="group flex h-10 w-10 items-center justify-center rounded-xl bg-white/80 text-gray-600 shadow-sm transition-all hover:bg-white hover:shadow-md hover:text-indigo-600"
          >
            <svg class="h-5 w-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl">
              各種設定
            </h1>
            <p class="text-xs text-gray-500">支出・カテゴリ・予算の管理</p>
          </div>
        </div>
      </div>
    </header>

    <main class="mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col px-4 py-4 sm:px-6 lg:px-8">
      <!-- 予算設定（常時表示のコンパクトバー） -->
      <div class="mb-4 shrink-0 rounded-2xl border border-white/50 bg-white/80 px-4 py-2.5 shadow-md backdrop-blur-sm sm:px-6">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-sm font-semibold text-gray-700">月間予算</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-400">¥</span>
              <input
                v-model.number="budgetInput"
                type="number"
                min="0"
                step="1000"
                placeholder="100000"
                class="w-36 rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-7 pr-3 text-sm text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:w-40"
              />
            </div>
            <button
              @click="handleBudgetSave"
              :disabled="budgetInput === null || budgetInput < 0 || budgetStore.isLoading"
              class="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-1.5 text-xs font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            >
              {{ budgetStore.isLoading ? '...' : '保存' }}
            </button>
            <Transition name="fade">
              <svg v-if="budgetSaved" class="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </Transition>
          </div>
        </div>
      </div>

      <!-- Tab Navigation（3タブ） -->
      <div class="relative mb-4 shrink-0 flex rounded-2xl border border-white/50 bg-white/60 p-1.5 shadow-lg backdrop-blur-sm">
        <div
          class="absolute top-1.5 bottom-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md transition-all duration-300 ease-out"
          :style="{
            left: activeTab === 'variable' ? '6px' : activeTab === 'fixed' ? 'calc(33.333% + 2px)' : 'calc(66.666% - 2px)',
            width: 'calc(33.333% - 5.333px)',
          }"
        />
        <button
          @click="activeTab = 'variable'"
          :class="[
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300',
            activeTab === 'variable'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span>変動費</span>
          <span
            v-if="variableItemRows.length > 0"
            :class="[
              'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-all duration-300',
              activeTab === 'variable'
                ? 'bg-white/25 text-white'
                : 'bg-indigo-100 text-indigo-600'
            ]"
          >
            {{ variableItemRows.length }}
          </span>
        </button>
        <button
          @click="activeTab = 'fixed'"
          :class="[
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300',
            activeTab === 'fixed'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>固定費</span>
          <span
            v-if="fixedItems.length > 0"
            :class="[
              'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-all duration-300',
              activeTab === 'fixed'
                ? 'bg-white/25 text-white'
                : 'bg-indigo-100 text-indigo-600'
            ]"
          >
            {{ fixedItems.length }}
          </span>
        </button>
        <button
          @click="activeTab = 'categories'"
          :class="[
            'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-300',
            activeTab === 'categories'
              ? 'text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>カテゴリ</span>
          <span
            v-if="categories.length > 0"
            :class="[
              'inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-xs font-bold transition-all duration-300',
              activeTab === 'categories'
                ? 'bg-white/25 text-white'
                : 'bg-indigo-100 text-indigo-600'
            ]"
          >
            {{ categories.length }}
          </span>
        </button>
      </div>

      <!-- Tab Content Area (flex-1 で残りを埋める) -->
      <div class="flex min-h-0 flex-1 flex-col">
        <!-- 変動費タブ -->
        <div v-if="activeTab === 'variable'" class="flex min-h-0 flex-1 flex-col">
          <div class="mb-3 flex shrink-0 items-center justify-between">
            <h2 class="text-base font-semibold text-gray-800">変動費一覧</h2>
            <span v-if="itemsStore.isLoading" class="text-xs text-gray-500">読み込み中...</span>
          </div>
          <div class="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm">
            <div ref="itemsScrollContainer" class="h-full overflow-auto">
              <table class="min-w-full">
                <thead class="sticky top-0 z-10">
                  <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">カテゴリ</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6" style="width: 120px">金額</th>
                    <th class="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:table-cell" style="width: 150px">メモ</th>
                    <th class="hidden px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:table-cell" style="width: 120px">登録日</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6" style="width: 60px"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="row in variableItemRows"
                    :key="row.item_id"
                    class="group transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50"
                  >
                    <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-700 sm:px-6">{{ row.item_name }}</td>
                    <td class="whitespace-nowrap px-4 py-3 text-sm text-gray-600 sm:px-6">¥{{ row.price.toLocaleString() }}</td>
                    <td class="hidden max-w-[150px] truncate px-6 py-3 text-sm text-gray-500 sm:table-cell" :title="row.memo">{{ row.memo }}</td>
                    <td class="hidden whitespace-nowrap px-6 py-3 text-sm text-gray-700 sm:table-cell">{{ row.created_date }}</td>
                    <td class="whitespace-nowrap px-4 py-3 text-sm sm:px-6">
                      <button
                        @click="openEditItemModal(row)"
                        class="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-indigo-100 hover:text-indigo-600"
                      >
                        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                  <tr v-if="variableItemRows.length === 0">
                    <td colspan="5" class="px-6 py-12 text-center">
                      <div class="flex flex-col items-center gap-2 text-gray-400">
                        <svg class="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <span class="text-sm">登録された変動費はありません</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 固定費タブ -->
        <div v-if="activeTab === 'fixed'" class="flex min-h-0 flex-1 flex-col">
          <div class="mb-3 flex shrink-0 items-center justify-between">
            <h2 class="text-base font-semibold text-gray-800">固定費設定</h2>
            <span v-if="fixedItems.length > 0" class="text-sm text-gray-500">
              合計 ¥{{ fixedItems.reduce((sum, i) => sum + i.price, 0).toLocaleString() }}/月
            </span>
          </div>
          <!-- 追加バー -->
          <div class="mb-3 shrink-0 flex items-center gap-2 rounded-xl border border-white/50 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur-sm sm:px-4">
            <input
              v-model="newFixedName"
              type="text"
              placeholder="項目名"
              class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              @keyup.enter="handleAddFixed"
            />
            <div class="relative w-32 shrink-0 sm:w-36">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-400">¥</span>
              <input
                v-model.number="newFixedPrice"
                type="number"
                min="0"
                step="1"
                placeholder="金額"
                class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-7 pr-3 text-sm text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                @keyup.enter="handleAddFixed"
              />
            </div>
            <button
              @click="handleAddFixed"
              :disabled="!newFixedName.trim() || !newFixedPrice || newFixedPrice <= 0 || itemsStore.isLoading"
              class="shrink-0 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-xs font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span class="hidden sm:inline">追加</span>
            </button>
          </div>
          <!-- テーブル -->
          <div class="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm">
            <div class="h-full overflow-auto">
              <table class="w-full">
                <thead class="sticky top-0 z-10">
                  <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">項目名</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6" style="width: 160px">金額</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6" style="width: 100px"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="item in fixedItems"
                    :key="item.item_id"
                    class="group transition-colors hover:bg-indigo-50/30"
                  >
                    <td class="px-4 py-3 text-sm font-medium text-gray-800 sm:px-6">{{ item.name || '固定費' }}</td>
                    <td class="px-4 py-3 text-sm text-gray-600 sm:px-6">¥{{ item.price.toLocaleString() }}</td>
                    <td class="px-4 py-3 text-right sm:px-6">
                      <div class="flex items-center justify-end gap-1">
                        <button
                          @click="openEditFixedModal(item)"
                          class="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-indigo-100 hover:text-indigo-600"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="openDeleteFixedModal(item)"
                          class="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-red-100 hover:text-red-600"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="fixedItems.length === 0">
                    <td colspan="3" class="px-6 py-8 text-center">
                      <span class="text-sm text-gray-400">登録された固定費はありません</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- カテゴリ管理タブ -->
        <div v-if="activeTab === 'categories'" class="flex min-h-0 flex-1 flex-col">
          <div class="mb-3 flex shrink-0 items-center justify-between">
            <h2 class="text-base font-semibold text-gray-800">カテゴリ一覧</h2>
            <span v-if="categoriesStore.isLoading && categories.length === 0" class="text-xs text-gray-500">読み込み中...</span>
          </div>
          <!-- 追加バー -->
          <div class="mb-3 shrink-0 flex items-center gap-2 rounded-xl border border-white/50 bg-white/80 px-3 py-2.5 shadow-sm backdrop-blur-sm sm:px-4">
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="カテゴリ名を入力..."
              class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              @keyup.enter="handleAddCategory"
            />
            <button
              @click="handleAddCategory"
              :disabled="!newCategoryName.trim() || categoriesStore.isLoading"
              class="shrink-0 inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-3 py-2 text-xs font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span class="hidden sm:inline">追加</span>
            </button>
          </div>
          <!-- テーブル -->
          <div class="min-h-0 flex-1 overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm">
            <div class="h-full overflow-auto">
              <table class="w-full">
                <thead class="sticky top-0 z-10">
                  <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6">カテゴリ名</th>
                    <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-600 sm:px-6" style="width: 100px"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100">
                  <tr
                    v-for="category in categories"
                    :key="category.category_id"
                    class="group transition-colors hover:bg-indigo-50/30"
                  >
                    <td class="px-4 py-3 sm:px-6">
                      <div class="flex items-center gap-3">
                        <div class="hidden h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white sm:flex">
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                          </svg>
                        </div>
                        <span class="text-sm font-medium text-gray-800">{{ category.name }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 sm:px-6">
                      <div class="flex items-center justify-end gap-1">
                        <button
                          @click="openEditCategoryModal(category)"
                          class="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-indigo-100 hover:text-indigo-600"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          @click="openDeleteModal(category)"
                          class="rounded-lg p-1.5 text-gray-400 transition-all hover:bg-red-100 hover:text-red-600"
                        >
                          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="categories.length === 0">
                    <td colspan="2" class="px-6 py-8 text-center">
                      <span class="text-sm text-gray-400">登録されたカテゴリはありません</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>

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
    <Transition name="modal">
      <div v-if="isEditItemModalOpen && editingItem" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeEditItemModal"></div>
        <div class="relative w-full max-w-md transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
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
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">メモ</label>
              <textarea
                v-model="editingItem.memo"
                rows="3"
                placeholder="メモを入力（任意）"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              ></textarea>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="closeEditItemModal"
              class="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              @click="handleEditItemSave"
              :disabled="!editingItem.price || editingItem.price <= 0 || !editingItem.created || itemsStore.isLoading"
              class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {{ itemsStore.isLoading ? '保存中...' : '保存する' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Edit Fixed Item Modal -->
    <Transition name="modal">
      <div v-if="isEditFixedModalOpen && editingFixed" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeEditFixedModal"></div>
        <div class="relative w-full max-w-md transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">固定費の編集</h3>
              <p class="text-sm text-gray-500">項目名と金額を変更できます</p>
            </div>
          </div>
          <div class="mb-6 space-y-4">
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">項目名</label>
              <input
                v-model="editingFixed.name"
                type="text"
                placeholder="項目名"
                class="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                autofocus
              />
            </div>
            <div>
              <label class="mb-2 block text-sm font-medium text-gray-700">金額</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500">¥</span>
                <input
                  v-model.number="editingFixed.price"
                  type="number"
                  min="0"
                  step="1"
                  class="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-8 pr-4 text-gray-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          </div>
          <div class="flex gap-3">
            <button
              @click="closeEditFixedModal"
              class="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              @click="handleEditFixedSave"
              :disabled="!editingFixed.name.trim() || !editingFixed.price || editingFixed.price <= 0 || itemsStore.isLoading"
              class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {{ itemsStore.isLoading ? '保存中...' : '保存する' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Fixed Item Modal -->
    <Transition name="modal">
      <div v-if="isDeleteFixedModalOpen && deletingFixed" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDeleteFixedModal"></div>
        <div class="relative w-full max-w-md transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
          <div class="mb-6 flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-800">固定費を削除</h3>
              <p class="text-sm text-gray-500">この操作は取り消せません</p>
            </div>
          </div>
          <div class="mb-6 rounded-xl bg-red-50 p-4">
            <p class="text-gray-700">
              「<span class="font-bold text-red-600">{{ deletingFixed.name }}</span>」を削除しますか？
            </p>
          </div>
          <div class="flex gap-3">
            <button
              @click="closeDeleteFixedModal"
              class="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              @click="handleDeleteFixed"
              :disabled="itemsStore.isLoading"
              class="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:opacity-50"
            >
              {{ itemsStore.isLoading ? '削除中...' : '削除する' }}
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
