<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Category } from '@/stores/categories'
import { useReceiptScan } from '@/composables/useReceiptScan'

export interface ReceiptRegisterEntry {
  categoryId: string
  price: number
  memo: string
}

const props = defineProps<{
  categories: Category[]
  customerId: string
  isRegistering: boolean
}>()

const emit = defineEmits<{
  register: [entries: ReceiptRegisterEntry[]]
}>()

const {
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
} = useReceiptScan({ customerId: () => props.customerId })

const fileInputRef = ref<HTMLInputElement | null>(null)

// 選択中の行はすべてカテゴリと 0 円以上の金額が必要
const canRegister = computed(
  () =>
    selectedCandidates.value.length > 0 &&
    selectedCandidates.value.every(c => c.categoryId !== '' && Number.isInteger(c.price) && c.price >= 0),
)

const formatYen = (value: number) => value.toLocaleString('ja-JP')

const openFilePicker = () => fileInputRef.value?.click()

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  // 同じファイルを再選択しても change が発火するようにクリアしておく
  input.value = ''
  if (!file) return
  await analyze(file)
}

const handleRegister = () => {
  if (!canRegister.value) return
  emit(
    'register',
    selectedCandidates.value.map(c => ({ categoryId: c.categoryId, price: c.price, memo: c.name })),
  )
}

defineExpose({ reset })
</script>

<template>
  <div class="space-y-5">
    <input
      ref="fileInputRef"
      type="file"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="handleFileChange"
    />

    <!-- 画像選択 -->
    <button
      v-if="!previewUrl"
      type="button"
      class="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/50 px-4 py-10 text-indigo-700 transition-all hover:border-indigo-400 hover:bg-indigo-50"
      @click="openFilePicker"
    >
      <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span class="text-sm font-medium">レシートを撮影 / 画像を選択</span>
      <span class="text-xs text-indigo-500">AI が品目と金額を読み取ります</span>
    </button>

    <!-- プレビュー -->
    <div v-else class="flex items-start gap-3">
      <img :src="previewUrl" alt="レシートのプレビュー" class="h-24 w-24 rounded-lg border border-gray-200 object-cover" />
      <div class="min-w-0 flex-1 text-sm text-gray-600">
        <p v-if="storeName" class="truncate font-medium text-gray-800">{{ storeName }}</p>
        <p v-if="purchasedDate">{{ purchasedDate }}</p>
        <p v-if="total !== null">合計 {{ formatYen(total) }} 円</p>
        <button
          type="button"
          class="mt-2 text-xs text-indigo-600 hover:underline disabled:opacity-50"
          :disabled="isAnalyzing || isRegistering"
          @click="reset"
        >
          別の画像を選ぶ
        </button>
      </div>
    </div>

    <!-- 解析中 -->
    <div v-if="isAnalyzing" class="flex items-center gap-3 rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700">
      <svg class="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      AI がレシートを読み取っています...
    </div>

    <!-- エラー -->
    <div v-else-if="isError" class="rounded-xl bg-red-50 p-4 text-sm text-red-700">
      <p class="font-medium">読み取りに失敗しました</p>
      <p class="mt-1 text-red-600">{{ errorMessage }}</p>
    </div>

    <!-- レシートではない / 品目なし -->
    <div v-else-if="hasResult && isNotReceipt" class="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
      レシートとして認識できませんでした。明るい場所で全体が写るように撮り直してください。
    </div>
    <div v-else-if="hasResult && candidates.length === 0" class="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
      品目を読み取れませんでした。手入力で登録してください。
    </div>

    <!-- 候補一覧 -->
    <div v-else-if="hasResult" class="space-y-3">
      <p class="text-xs text-gray-500">内容を確認し、必要に応じて修正してから登録してください。</p>
      <ul class="space-y-3">
        <li
          v-for="candidate in candidates"
          :key="candidate.key"
          class="rounded-xl border p-3 transition-colors"
          :class="candidate.selected ? 'border-indigo-200 bg-white' : 'border-gray-200 bg-gray-50 opacity-60'"
        >
          <div class="flex items-center gap-2">
            <input
              v-model="candidate.selected"
              type="checkbox"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <input
              v-model="candidate.name"
              type="text"
              placeholder="品名"
              class="min-w-0 flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
            />
          </div>
          <div class="mt-2 flex gap-2 pl-6">
            <select
              v-model="candidate.categoryId"
              class="min-w-0 flex-1 rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              :class="candidate.selected && candidate.categoryId === '' ? 'border-red-300' : 'border-gray-200'"
            >
              <option value="" disabled>カテゴリを選択</option>
              <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
                {{ category.name }}
              </option>
            </select>
            <div class="relative w-28">
              <span class="absolute inset-y-0 left-0 flex items-center pl-2 text-sm text-gray-500">¥</span>
              <input
                v-model.number="candidate.price"
                type="number"
                min="0"
                step="1"
                class="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-6 pr-2 text-right text-sm text-gray-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </li>
      </ul>

      <div class="flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
        <span class="text-gray-500">{{ selectedCandidates.length }} 件を選択</span>
        <span class="font-semibold text-gray-800">{{ formatYen(selectedTotal) }} 円</span>
      </div>

      <button
        type="button"
        :disabled="!canRegister || isRegistering"
        class="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-medium text-white transition-all hover:from-indigo-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        @click="handleRegister"
      >
        <span v-if="!isRegistering">選択した {{ selectedCandidates.length }} 件を登録する</span>
        <span v-else>登録中...</span>
      </button>
    </div>
  </div>
</template>
