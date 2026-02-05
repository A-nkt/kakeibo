<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useCategoriesStore } from '@/stores/categories'

const router = useRouter()
const { currentUser } = useAuth()
const categoriesStore = useCategoriesStore()

const isLoaded = ref(false)
const isAddModalOpen = ref(false)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const newCategoryName = ref('')
const editingCategory = ref<{ category_id: string; name: string } | null>(null)
const deletingCategory = ref<{ category_id: string; name: string } | null>(null)

const categories = computed(() => categoriesStore.categories)
const customerId = computed(() => currentUser.value?.email || localStorage.getItem('userEmail') || '')

onMounted(async () => {
  setTimeout(() => {
    isLoaded.value = true
  }, 100)

  if (customerId.value) {
    await categoriesStore.fetchCategories(customerId.value)
  }
})

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

const openEditModal = (category: { category_id: string; name: string }) => {
  editingCategory.value = { ...category }
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  editingCategory.value = null
}

const handleEdit = async () => {
  if (editingCategory.value && editingCategory.value.name.trim() && customerId.value) {
    try {
      await categoriesStore.editCategory(customerId.value, editingCategory.value.category_id, editingCategory.value.name.trim())
      closeEditModal()
    } catch (e) {
      alert(e instanceof Error ? e.message : '更新に失敗しました')
    }
  }
}

const goBack = () => {
  router.push('/dashboard')
}

const formatDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
    <!-- Header -->
    <header class="border-b border-white/20 bg-white/60 backdrop-blur-sm">
      <div class="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between">
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
                カテゴリ管理
              </h1>
              <p class="mt-1 text-sm text-gray-500">支出カテゴリの追加・削除</p>
            </div>
          </div>
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
      </div>
    </header>

    <main class="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
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
      <div
        v-else
        :class="['overflow-hidden rounded-2xl border border-white/50 bg-white/80 shadow-lg backdrop-blur-sm', { 'animate-fade-in': isLoaded }]"
      >
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
                    @click="openEditModal(category)"
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
        <div class="border-t border-gray-100 bg-gray-50/50 px-6 py-3">
        </div>
      </div>
    </main>

    <!-- Add Modal -->
    <Transition name="modal">
      <div v-if="isAddModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeAddModal"></div>
        <div class="relative w-full max-w-md transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
          <!-- Header -->
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

          <!-- Input -->
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

          <!-- Actions -->
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

    <!-- Edit Modal -->
    <Transition name="modal">
      <div v-if="isEditModalOpen && editingCategory" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeEditModal"></div>
        <div class="relative w-full max-w-md transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
          <!-- Header -->
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

          <!-- Input -->
          <div class="mb-6">
            <input
              v-model="editingCategory.name"
              type="text"
              placeholder="カテゴリ名"
              class="w-full rounded-xl border-2 border-gray-100 bg-gray-50 px-4 py-4 text-gray-900 transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
              @keyup.enter="handleEdit"
              autofocus
            />
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="closeEditModal"
              class="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition-all hover:bg-gray-50"
            >
              キャンセル
            </button>
            <button
              @click="handleEdit"
              :disabled="!editingCategory.name.trim() || categoriesStore.isLoading"
              class="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {{ categoriesStore.isLoading ? '保存中...' : '保存する' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Delete Modal -->
    <Transition name="modal">
      <div v-if="isDeleteModalOpen && deletingCategory" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="closeDeleteModal"></div>
        <div class="relative w-full max-w-md transform rounded-3xl bg-white p-6 shadow-2xl transition-all">
          <!-- Header -->
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

          <!-- Content -->
          <div class="mb-6 rounded-xl bg-red-50 p-4">
            <p class="text-gray-700">
              「<span class="font-bold text-red-600">{{ deletingCategory.name }}</span>」を削除しますか？
            </p>
          </div>

          <!-- Actions -->
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
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in > * {
  opacity: 0;
  animation: fade-in 0.4s ease-out forwards;
}

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
</style>
