<script setup lang="ts">
import { computed } from 'vue'

/**
 * アプリ本体の画面を LP 上で再現するモックアップ。
 * ダッシュボード / 各種設定と同じ配色・角丸・カード表現を使い、
 * 「実際の製品を見せる」ことを目的にしている（装飾用のため操作はできない）。
 */
interface Props {
  variant?: 'dashboard' | 'budget' | 'ai' | 'list'
  frame?: boolean
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'dashboard',
  frame: true,
  label: '',
})

const DEFAULT_LABELS: Record<NonNullable<Props['variant']>, string> = {
  dashboard: 'AI家計簿のダッシュボード画面。今月の支出、今日使える金額、コスト推移グラフを表示',
  budget: '予算から逆算した「今日使える金額」を表示する画面',
  ai: 'AIが支出パターンから節約ポイントを提案する画面',
  list: 'カテゴリごとに色分けされた支出一覧の画面',
}

const ariaLabel = computed(() => props.label || DEFAULT_LABELS[props.variant])

// コスト推移グラフ（日別）の見た目用データ
const BARS = [38, 52, 30, 64, 45, 78, 56, 41, 69, 34, 58, 47, 72, 50]

// ダッシュボード上部の StatCard 相当
const STAT_CARDS = [
  {
    title: '今月の支出',
    value: '¥184,320',
    gradient: 'from-blue-500 to-blue-600',
    iconBg: 'bg-blue-400/30',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    title: '今日使える金額',
    value: '¥3,500',
    gradient: 'from-emerald-500 to-emerald-600',
    iconBg: 'bg-emerald-400/30',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
  {
    title: '予算残り',
    value: '¥95,680',
    gradient: 'from-purple-500 to-purple-600',
    iconBg: 'bg-purple-400/30',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  },
]

// 円グラフのセグメント。ダッシュボードの PieChart と同じ系統の色を使う
const DONUT = [
  { label: '食費', value: 42, color: '#6366f1' },
  { label: '外食費', value: 24, color: '#10b981' },
  { label: '日用品', value: 18, color: '#f59e0b' },
  { label: 'その他', value: 16, color: '#a855f7' },
]

const CIRCUMFERENCE = 2 * Math.PI * 38

const donutSegments = computed(() => {
  let offset = 0
  return DONUT.map(segment => {
    const length = (segment.value / 100) * CIRCUMFERENCE
    const dash = `${length} ${CIRCUMFERENCE - length}`
    const dashOffset = -offset
    offset += length
    return { ...segment, dash, dashOffset }
  })
})

const LIST_ROWS = [
  { category: '食費', amount: '¥1,614', memo: 'スーパー', tone: 'bg-indigo-100 text-indigo-700' },
  { category: '外食費', amount: '¥2,480', memo: 'ランチ', tone: 'bg-emerald-100 text-emerald-700' },
  { category: '日用品', amount: '¥880', memo: '', tone: 'bg-amber-100 text-amber-700' },
  { category: '交通費', amount: '¥420', memo: '', tone: 'bg-red-100 text-red-700' },
]

const AI_COMMENTS = [
  { tone: 'amber', text: '外食費が先月より 18% 増えています。週2回に抑えると月 ¥4,200 の節約に。' },
  { tone: 'emerald', text: '日用品はまとめ買いが効いています。この調子なら予算内で収まります。' },
  { tone: 'indigo', text: '今月の残り 12 日は 1日 ¥3,500 まで使えます。' },
]
</script>

<template>
  <div
    :class="[
      'overflow-hidden bg-white/70 shadow-2xl shadow-ink/20 ring-1 ring-ink/10 backdrop-blur',
      frame ? 'rounded-xl sm:rounded-2xl' : 'rounded-lg',
    ]"
    role="img"
    :aria-label="ariaLabel"
  >
    <!-- ブラウザのクローム -->
    <div
      v-if="frame"
      class="flex items-center gap-2 border-b border-ink/10 bg-paper-2/90 px-3 py-2"
      aria-hidden="true"
    >
      <span class="flex gap-1.5">
        <span class="h-2 w-2 rounded-full bg-ink/20" />
        <span class="h-2 w-2 rounded-full bg-ink/20" />
        <span class="h-2 w-2 rounded-full bg-ink/20" />
      </span>
      <span class="mx-auto flex items-center gap-1.5 rounded-md bg-white/80 px-3 py-0.5 text-[10px] text-ink-3">
        <svg class="h-2.5 w-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        ai-kakeibo.app
      </span>
    </div>

    <!-- 画面本体：アプリと同じ背景グラデーション -->
    <div
      class="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-3 sm:p-4"
      aria-hidden="true"
    >
      <!-- ============ ダッシュボード ============ -->
      <template v-if="variant === 'dashboard'">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <p class="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-sm font-bold text-transparent">
              ダッシュボード
            </p>
            <p class="text-[9px] text-gray-500">費用データの概要とトレンド分析</p>
          </div>
          <div class="flex items-center gap-1.5 rounded-full bg-white/80 px-2 py-1 shadow-sm">
            <span class="h-4 w-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
            <span class="h-1.5 w-8 rounded-full bg-gray-200" />
          </div>
        </div>

        <!-- StatCard 相当 -->
        <div class="mb-3 grid grid-cols-3 gap-2">
          <div
            v-for="card in STAT_CARDS"
            :key="card.title"
            :class="['relative overflow-hidden rounded-xl bg-gradient-to-br p-2.5 text-white shadow-lg', card.gradient]"
          >
            <div class="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-white/10" />
            <div class="relative flex items-start justify-between gap-1">
              <div class="min-w-0">
                <p class="truncate text-[8px] font-medium text-white/80">{{ card.title }}</p>
                <p class="mt-0.5 text-sm font-bold tabular-nums">{{ card.value }}</p>
              </div>
              <span :class="['shrink-0 rounded-md p-1', card.iconBg]">
                <svg class="h-2.5 w-2.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="card.icon" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        <!-- AIコメント -->
        <div class="mb-3 flex items-start gap-2 rounded-xl border border-white/60 bg-white/80 p-2.5 shadow-sm">
          <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white">
            <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </span>
          <p class="text-[9px] leading-relaxed text-gray-600">
            外食費が先月より <span class="font-bold text-gray-800">18%</span> 増えています。週2回に抑えると月 <span class="font-bold text-emerald-600">¥4,200</span> の節約に。
          </p>
        </div>

        <!-- グラフ2枚 -->
        <div class="grid grid-cols-5 gap-2">
          <div class="col-span-3 rounded-xl border border-white/60 bg-white/80 p-2.5 shadow-sm">
            <p class="mb-2 text-[9px] font-semibold text-gray-700">コスト推移</p>
            <div class="flex h-16 items-end gap-[3px]">
              <span
                v-for="(bar, i) in BARS"
                :key="i"
                class="flex-1 rounded-sm bg-gradient-to-t from-indigo-500 to-purple-400"
                :style="{ height: `${bar}%` }"
              />
            </div>
          </div>
          <div class="col-span-2 rounded-xl border border-white/60 bg-white/80 p-2.5 shadow-sm">
            <p class="mb-1 text-[9px] font-semibold text-gray-700">割合別</p>
            <svg viewBox="0 0 100 100" class="mx-auto h-16 w-16 -rotate-90">
              <circle
                v-for="segment in donutSegments"
                :key="segment.label"
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke-width="14"
                :stroke="segment.color"
                :stroke-dasharray="segment.dash"
                :stroke-dashoffset="segment.dashOffset"
              />
            </svg>
          </div>
        </div>
      </template>

      <!-- ============ 今日使える金額 ============ -->
      <template v-else-if="variant === 'budget'">
        <div class="rounded-xl border border-white/60 bg-white/80 p-4 shadow-sm">
          <div class="flex items-center justify-between">
            <p class="text-[10px] font-semibold text-gray-700">2026年7月</p>
            <p class="text-[9px] text-gray-500">残り 12 日</p>
          </div>
          <div class="mt-3 flex items-center gap-4">
            <svg viewBox="0 0 100 100" class="h-24 w-24 -rotate-90 shrink-0">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e0e7ff" stroke-width="12" />
              <circle
                cx="50" cy="50" r="38" fill="none" stroke="url(#pvBudget)" stroke-width="12"
                :stroke-dasharray="`${CIRCUMFERENCE * 0.66} ${CIRCUMFERENCE}`" stroke-linecap="round"
              />
              <defs>
                <linearGradient id="pvBudget" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#6366f1" />
                  <stop offset="100%" stop-color="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div>
              <p class="text-[9px] text-gray-500">今日使える金額</p>
              <p class="text-2xl font-bold tabular-nums text-gray-900">¥3,500</p>
              <p class="mt-1 text-[9px] text-gray-500">予算 ¥280,000 / 残り ¥95,680</p>
            </div>
          </div>
          <div class="mt-3 grid grid-cols-3 gap-2">
            <div v-for="d in ['月', '火', '水']" :key="d" class="rounded-lg bg-indigo-50 p-1.5 text-center">
              <p class="text-[8px] text-gray-500">{{ d }}</p>
              <p class="text-[10px] font-bold tabular-nums text-indigo-700">¥3,500</p>
            </div>
          </div>
        </div>
      </template>

      <!-- ============ AI分析 ============ -->
      <template v-else-if="variant === 'ai'">
        <div class="space-y-2">
          <div
            v-for="comment in AI_COMMENTS"
            :key="comment.text"
            class="flex items-start gap-2 rounded-xl border border-white/60 bg-white/80 p-2.5 shadow-sm"
          >
            <span
              :class="[
                'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg text-white',
                comment.tone === 'amber' ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                : comment.tone === 'emerald' ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                : 'bg-gradient-to-br from-indigo-500 to-purple-500',
              ]"
            >
              <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </span>
            <p class="text-[9px] leading-relaxed text-gray-600">{{ comment.text }}</p>
          </div>
        </div>
      </template>

      <!-- ============ 支出一覧 ============ -->
      <template v-else>
        <div class="overflow-hidden rounded-xl border border-white/60 bg-white/80 shadow-sm">
          <div class="flex items-center justify-between border-b border-slate-200/80 bg-slate-100 px-3 py-1.5">
            <span class="text-[9px] font-bold text-slate-600">7月28日(火)</span>
            <span class="text-[9px] font-semibold tabular-nums text-slate-500">¥5,394</span>
          </div>
          <ul class="divide-y divide-gray-100">
            <li v-for="row in LIST_ROWS" :key="row.category" class="flex items-center gap-2 px-3 py-1.5">
              <span :class="['w-12 shrink-0 rounded px-1 py-0.5 text-center text-[8px] font-semibold', row.tone]">
                {{ row.category }}
              </span>
              <span class="min-w-0 flex-1 truncate text-[8px] text-gray-500">{{ row.memo }}</span>
              <span class="text-[10px] font-semibold tabular-nums text-gray-800">{{ row.amount }}</span>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>
