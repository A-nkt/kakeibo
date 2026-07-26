<script setup lang="ts">
import ProductPreview from './ProductPreview.vue'
import RevealOnScroll from './RevealOnScroll.vue'

// 独自性の高い2機能は大きく、基本の2機能は簡潔に見せて主従をつける
const HERO_FEATURES = [
  {
    index: '01',
    kicker: '予算管理',
    title: '「今日使える金額」が\nひと目でわかる',
    description:
      '月の予算から残り日数を逆算して、1日あたりに使える金額を自動表示。今日いくらまでなら大丈夫かが分かるので、月末に慌てることがなくなります。',
    points: ['予算オーバーを事前に防止', '残り日数から自動で再計算'],
    variant: 'budget' as const,
  },
  {
    index: '02',
    kicker: 'AI分析',
    title: '節約のヒントは、\nAIが見つける',
    description:
      '記録した支出のパターンをAIが分析し、どこを削ればいくら浮くのかを具体的に提案。家計簿を「つけるだけ」で終わらせません。',
    points: ['増えた費目を自動で指摘', '金額つきの改善案を提示'],
    variant: 'ai' as const,
  },
]

const BASE_FEATURES = [
  {
    index: '03',
    title: '支出管理',
    description: '変動費・固定費をカテゴリ分けして記録。月ごとの絞り込みと検索で、件数が増えても見失いません。',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
  },
  {
    index: '04',
    title: '可視化機能',
    description: 'グラフで支出パターンを一目で把握。日別・週別・月別、カテゴリ割合で切り替えて分析できます。',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
]
</script>

<template>
  <section id="features" class="relative overflow-hidden bg-paper py-24 sm:py-32">
    <div class="pointer-events-none absolute inset-0 grain-overlay opacity-[0.13] mix-blend-multiply" aria-hidden="true" />

    <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
      <!-- 見出しは左寄せ・二段組で誌面のリズムをつくる -->
      <RevealOnScroll
        class="grid gap-6 border-b border-ink/10 pb-12 lg:grid-cols-12 lg:items-end"
        :threshold="0.2"
      >
        <div class="lg:col-span-7">
          <div class="mb-5 flex items-center gap-3">
            <span class="font-mincho text-sm font-bold tabular-nums text-vermilion">01</span>
            <span class="h-px w-6 bg-ink/20" />
            <span class="font-gothic text-xs font-bold tracking-[0.22em] text-ink-3">主要機能</span>
          </div>
          <h2 class="font-mincho text-3xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            シンプルなのに、高機能
          </h2>
        </div>
        <p class="font-gothic text-sm leading-[1.9] text-ink-2 lg:col-span-5 lg:pb-2">
          必要な機能だけを厳選しました。複雑な設定は不要で、開いたその日から使い始められます。
        </p>
      </RevealOnScroll>

      <!-- 主となる2機能：実画面つきの交互レイアウト -->
      <RevealOnScroll
        v-for="(feature, index) in HERO_FEATURES"
        :key="feature.index"
        class="grid items-center gap-10 border-b border-ink/10 py-16 lg:grid-cols-12 lg:gap-14 lg:py-20"
      >
        <div :class="['lg:col-span-5', index % 2 === 1 ? 'lg:order-2' : '']">
          <div class="mb-6 flex items-center gap-4">
            <span class="font-mincho text-5xl font-black leading-none tabular-nums text-ink/15 sm:text-6xl">
              {{ feature.index }}
            </span>
            <span class="h-px w-6 bg-ink/20" aria-hidden="true" />
            <span class="font-gothic text-xs font-bold tracking-[0.2em] text-indigo-700">
              {{ feature.kicker }}
            </span>
          </div>
          <h3 class="whitespace-pre-line font-mincho text-2xl font-bold leading-snug tracking-tight text-ink sm:text-[2rem]">
            {{ feature.title }}
          </h3>
          <p class="mt-5 font-gothic text-sm leading-[1.95] text-ink-2">
            {{ feature.description }}
          </p>
          <ul class="mt-7 space-y-2.5">
            <li
              v-for="point in feature.points"
              :key="point"
              class="flex items-center gap-3 font-gothic text-[13px] text-ink-2"
            >
              <span class="h-1 w-1 shrink-0 rounded-full bg-emerald-700" aria-hidden="true" />
              {{ point }}
            </li>
          </ul>
        </div>

        <div :class="['lg:col-span-7', index % 2 === 1 ? 'lg:order-1' : '']">
          <div class="relative">
            <!-- 版面を示す薄い罫線の額 -->
            <div
              :class="[
                'pointer-events-none absolute -inset-3 hidden rounded-2xl border border-ink/10 sm:block',
                index % 2 === 1 ? '-rotate-1' : 'rotate-1',
              ]"
              aria-hidden="true"
            />
            <ProductPreview :variant="feature.variant" :frame="false" class="relative" />
          </div>
        </div>
      </RevealOnScroll>

      <!-- 基本の2機能：簡潔に -->
      <RevealOnScroll class="grid gap-px bg-ink/10 sm:grid-cols-2">
        <div
          v-for="feature in BASE_FEATURES"
          :key="feature.index"
          class="group bg-paper py-12 sm:px-8"
        >
          <div class="mb-5 flex items-center gap-4">
            <span class="flex h-10 w-10 items-center justify-center rounded-lg border border-ink/15 bg-paper-2 text-ink transition-colors group-hover:border-indigo-600/40 group-hover:text-indigo-700">
              <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" :d="feature.icon" />
              </svg>
            </span>
            <span class="font-mincho text-3xl font-black leading-none tabular-nums text-ink/15">
              {{ feature.index }}
            </span>
          </div>
          <h3 class="font-mincho text-xl font-bold tracking-tight text-ink">{{ feature.title }}</h3>
          <p class="mt-3 max-w-sm font-gothic text-sm leading-[1.9] text-ink-2">{{ feature.description }}</p>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>
