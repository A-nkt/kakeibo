import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getItems, registItem, updateItem, deleteItem } from '@/utils/api'

interface Item {
  id: string
  customer_id: string
  item_id: string
  price: number
  created: number
  updated: number
  is_fixed?: boolean
  name?: string
  memo?: string
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

  async function addItem(customerId: string, itemId: string, price: number | null, memo?: string) {
    isLoading.value = true
    error.value = null

    try {
      await registItem({ customerId, itemId, price, memo })
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
    memo?: string,
  ) {
    isLoading.value = true
    error.value = null

    try {
      await updateItem({ customerId, itemId, categoryId, price, created, memo })
      await fetchItems(customerId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function addFixedItem(customerId: string, name: string, price: number) {
    isLoading.value = true
    error.value = null

    try {
      await registItem({ customerId, itemId: '', price, isFixed: true, name })
      await fetchItems(customerId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '登録に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function editFixedItem(
    customerId: string,
    itemId: string,
    name: string,
    price: number,
  ) {
    isLoading.value = true
    error.value = null

    try {
      await updateItem({ customerId, itemId, categoryId: '', price, created: 0, isFixed: true, name })
      await fetchItems(customerId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '更新に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  async function removeItem(customerId: string, itemId: string) {
    isLoading.value = true
    error.value = null

    try {
      await deleteItem(customerId, itemId)
      await fetchItems(customerId)
    } catch (e) {
      error.value = e instanceof Error ? e.message : '削除に失敗しました'
      throw e
    } finally {
      isLoading.value = false
    }
  }

  return { items, isLoading, error, fetchItems, addItem, editItem, addFixedItem, editFixedItem, removeItem }
})
