import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getItems, registItem, updateItem } from '@/utils/api'

interface Item {
  id: string
  customer_id: string
  item_id: string
  price: number
  created: number
  updated: number
}

export const useItemsStore = defineStore('items', () => {
  const items = ref<Item[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function fetchItems(customerId: string) {
    if (!customerId) return

    isLoading.value = true
    error.value = null

    try {
      const response = await getItems(customerId)
      items.value = response.result || []
    } catch (e) {
      error.value = e instanceof Error ? e.message : '取得に失敗しました'
      console.error('Failed to load items:', e)
    } finally {
      isLoading.value = false
    }
  }

  async function addItem(customerId: string, itemId: string, price: number | null) {
    isLoading.value = true
    error.value = null

    try {
      await registItem({ customerId, itemId, price })
      await fetchItems(customerId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '登録に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function editItem(
    customerId: string,
    itemId: string,
    categoryId: string,
    price: number,
    created: number,
  ) {
    isLoading.value = true
    error.value = null

    try {
      await updateItem({ customerId, itemId, categoryId, price, created })
      await fetchItems(customerId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return { items, isLoading, error, fetchItems, addItem, editItem }
})
