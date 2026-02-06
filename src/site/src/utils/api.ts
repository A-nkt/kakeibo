const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface RegistItemParams {
  customerId: string
  itemId: string
  price: number | null
}

export async function registItem({ customerId, itemId, price }: RegistItemParams) {
  const response = await fetch(`${API_BASE_URL}/api/v1/item/regist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id: customerId,
      id: itemId,
      price,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || '登録に失敗しました')
  }

  return response.json()
}

export async function getItems(customerId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/item/list?customer_id=${encodeURIComponent(customerId)}`)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || '取得に失敗しました')
  }

  return response.json()
}

export async function updateItem(params: {
  customerId: string
  itemId: string
  categoryId: string
  price: number
  created: number
}) {
  const response = await fetch(`${API_BASE_URL}/api/v1/item/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id: params.customerId,
      item_id: params.itemId,
      id: params.categoryId,
      price: params.price,
      created: params.created,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || '更新に失敗しました')
  }

  return response.json()
}

// Category API
export async function getCategories(customerId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/category/list?customer_id=${encodeURIComponent(customerId)}`)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'カテゴリの取得に失敗しました')
  }

  return response.json()
}

export async function registCategory(customerId: string, name: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/category/regist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id: customerId,
      name,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'カテゴリの登録に失敗しました')
  }

  return response.json()
}

export async function deleteCategory(customerId: string, categoryId: string) {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/category/delete?customer_id=${encodeURIComponent(customerId)}&category_id=${encodeURIComponent(categoryId)}`,
    { method: 'DELETE' }
  )

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'カテゴリの削除に失敗しました')
  }

  return response.json()
}

export async function updateCategory(customerId: string, categoryId: string, name: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/category/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id: customerId,
      category_id: categoryId,
      name,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'カテゴリの更新に失敗しました')
  }

  return response.json()
}

// Budget API
export async function getBudget(customerId: string) {
  const response = await fetch(`${API_BASE_URL}/api/v1/customer/budget?customer_id=${encodeURIComponent(customerId)}`)

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || '予算の取得に失敗しました')
  }

  return response.json()
}

export async function registBudget(customerId: string, budget: number) {
  const response = await fetch(`${API_BASE_URL}/api/v1/customer/budget/regist`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id: customerId,
      budget,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || '予算の登録に失敗しました')
  }

  return response.json()
}
