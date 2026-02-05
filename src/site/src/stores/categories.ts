import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getCategories, registCategory, deleteCategory, updateCategory } from '@/utils/api'

export interface Category {
  category_id: string
  name: string
  customer_id: string
  created: number
  updated: number
}

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref<Category[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchCategories(customerId: string) {
    if (!customerId) return

    isLoading.value = true
    error.value = null

    try {
      const response = await getCategories(customerId)
      const result = response.result || []
      categories.value = result.sort((a: Category, b: Category) => a.created - b.created)
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

  return { categories, isLoading, error, fetchCategories, addCategory, removeCategory, editCategory }
})
