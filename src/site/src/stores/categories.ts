import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getCategories,
  registCategory,
  deleteCategory,
  updateCategory,
  reorderCategories as reorderCategoriesApi,
} from '@/utils/api'

export interface Category {
  category_id: string
  name: string
  customer_id: string
  created: number
  updated: number
  sort_order?: number
}

// 並び替え済み（sort_order あり）のカテゴリを先に並べ、未設定のものは登録順で後ろに続ける
function compareCategories(a: Category, b: Category) {
  const aOrder = a.sort_order ?? Number.POSITIVE_INFINITY
  const bOrder = b.sort_order ?? Number.POSITIVE_INFINITY
  if (aOrder !== bOrder) return aOrder - bOrder
  return a.created - b.created
}

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const isReordering = ref(false)
  const error = ref<string | null>(null)

  async function fetchCategories(customerId: string) {
    if (!customerId) return

    isLoading.value = true
    error.value = null

    try {
      const response = await getCategories(customerId)
      const result = response.result || []
      categories.value = result.sort(compareCategories)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '取得に失敗しました'
      console.error('Failed to load categories:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function addCategory(customerId: string, name: string) {
    isLoading.value = true
    error.value = null

    try {
      await registCategory(customerId, name)
      await fetchCategories(customerId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '登録に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function removeCategory(customerId: string, categoryId: string) {
    isLoading.value = true
    error.value = null

    try {
      await deleteCategory(customerId, categoryId)
      await fetchCategories(customerId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '削除に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function editCategory(customerId: string, categoryId: string, name: string) {
    isLoading.value = true
    error.value = null

    try {
      await updateCategory(customerId, categoryId, name)
      await fetchCategories(customerId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function reorderCategories(customerId: string, reordered: Category[]) {
    const previous = categories.value
    // ドラッグ直後に並びを反映させるため、API の完了を待たずに更新し、失敗したら元に戻す
    categories.value = reordered.map((category, index) => ({ ...category, sort_order: index }))
    isReordering.value = true
    error.value = null

    try {
      await reorderCategoriesApi(
        customerId,
        reordered.map((category) => category.category_id),
      )
    } catch (e) {
      categories.value = previous
      error.value = e instanceof Error ? e.message : '並び替えに失敗しました'
      throw e
    } finally {
      isReordering.value = false
    }
  }

  return {
    categories,
    isLoading,
    isReordering,
    error,
    fetchCategories,
    addCategory,
    removeCategory,
    editCategory,
    reorderCategories,
  }
})
