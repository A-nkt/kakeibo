import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getBudget, registBudget } from '@/utils/api'

export const useBudgetStore = defineStore('budget', () => {
  const budget = ref<number>(0)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchBudget(customerId: string) {
    if (!customerId) return

    isLoading.value = true
    error.value = null

    try {
      const response = await getBudget(customerId)
      budget.value = response.result?.budget || 0
    } catch (e) {
      error.value = e instanceof Error ? e.message : '取得に失敗しました'
      console.error('Failed to load budget:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function saveBudget(customerId: string, newBudget: number) {
    isLoading.value = true
    error.value = null

    try {
      await registBudget(customerId, newBudget)
      budget.value = newBudget
    } catch (e) {
      error.value = e instanceof Error ? e.message : '登録に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return { budget, isLoading, error, fetchBudget, saveBudget }
})
