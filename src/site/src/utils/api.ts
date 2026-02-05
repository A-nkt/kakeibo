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
