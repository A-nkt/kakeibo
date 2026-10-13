import { ref, computed, onScopeDispose } from 'vue'
import { analyzeReceipt, type ReceiptAnalyzeResult } from '@/utils/api'

export interface ReceiptCandidate {
  key: string
  name: string
  price: number
  categoryId: string
  selected: boolean
}

// Claude の画像入力は長辺 1568px を超えると縮小されるため、送信前にクライアント側で縮小して転送量を抑える
const MAX_IMAGE_EDGE = 1568
const JPEG_QUALITY = 0.85

// Functional Core: 画像ファイルを JPEG の base64 に変換する（Vue に依存しない）
export async function fileToJpegBase64(
  file: File,
  maxEdge: number = MAX_IMAGE_EDGE,
): Promise<{ base64: string; dataUrl: string }> {
  const bitmap = await createImageBitmap(file)
  try {
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('画像の変換に失敗しました')
    // PNG の透過部分が黒くならないよう白で塗ってから描画する
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY)
    return { base64: dataUrl.slice(dataUrl.indexOf(',') + 1), dataUrl }
  } finally {
    bitmap.close()
  }
}

// Functional Core: 解析結果を編集可能な候補行に変換する
export function toCandidates(result: ReceiptAnalyzeResult): ReceiptCandidate[] {
  return result.items.map((item, index) => ({
    key: `${index}-${item.name}`,
    name: item.name,
    price: item.price,
    categoryId: item.category_id ?? '',
    selected: true,
  }))
}

export function useReceiptScan({ customerId }: { customerId: () => string }) {
  const previewUrl = ref<string | null>(null)
  const candidates = ref<ReceiptCandidate[]>([])
  const storeName = ref<string | null>(null)
  const purchasedDate = ref<string | null>(null)
  const total = ref<number | null>(null)
  const isNotReceipt = ref(false)

  const isAnalyzing = ref(false)
  const isError = ref(false)
  const errorMessage = ref<string | null>(null)

  const hasResult = computed(() => previewUrl.value !== null && !isAnalyzing.value && !isError.value)
  const selectedCandidates = computed(() => candidates.value.filter(c => c.selected))
  const selectedTotal = computed(() => selectedCandidates.value.reduce((sum, c) => sum + c.price, 0))

  let controller: AbortController | null = null

  const reset = () => {
    controller?.abort()
    controller = null
    previewUrl.value = null
    candidates.value = []
    storeName.value = null
    purchasedDate.value = null
    total.value = null
    isNotReceipt.value = false
    isAnalyzing.value = false
    isError.value = false
    errorMessage.value = null
  }

  const analyze = async (file: File) => {
    reset()
    isAnalyzing.value = true
    controller = new AbortController()

    try {
      const { base64, dataUrl } = await fileToJpegBase64(file)
      previewUrl.value = dataUrl

      const { result } = await analyzeReceipt({
        customerId: customerId(),
        imageBase64: base64,
        mediaType: 'image/jpeg',
        signal: controller.signal,
      })

      candidates.value = toCandidates(result)
      storeName.value = result.store_name
      purchasedDate.value = result.purchased_date
      total.value = result.total
      isNotReceipt.value = !result.is_receipt
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      isError.value = true
      errorMessage.value = e instanceof Error ? e.message : 'レシートの読み取りに失敗しました'
    } finally {
      isAnalyzing.value = false
    }
  }

  onScopeDispose(() => controller?.abort())

  return {
    previewUrl,
    candidates,
    storeName,
    purchasedDate,
    total,
    isNotReceipt,
    isAnalyzing,
    isError,
    errorMessage,
    hasResult,
    selectedCandidates,
    selectedTotal,
    analyze,
    reset,
  }
}
