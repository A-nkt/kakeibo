<script setup lang="ts">
import { computed } from 'vue'
import RevealOnScroll from './RevealOnScroll.vue'

interface CompetitorComparison {
  name: string
  price: string
  features: string[]
}

interface Props {
  competitors?: CompetitorComparison[]
}

const props = withDefaults(defineProps<Props>(), {
  competitors: () => [],
})

const SELLING_POINTS = [
  {
    index: '01',
    title: '完全無料',
    description:
      '登録料・月額料金・機能制限なし。他の家計簿アプリにありがちな「プレミアムプラン」への誘導は一切ありません。',
    tags: ['登録料 ¥0', '月額料金 ¥0', '機能制限なし'],
    featured: true,
  },
  {
    index: '02',
    title: 'シンプルで直感的なUI',
    description: '複雑な設定は不要。アプリを開いたその日から、すぐに使い始められます。',
    featured: false,
  },
  {
    index: '03',
    title: 'AIによる自動アドバイス',
    description: '支出パターンを分析し、あなたに合った節約ポイントを自動で提案します。',
    featured: false,
  },
  {
    index: '04',
    title: '「今日使える金額」という独自の視点',
    description: '予算から逆算した1日あたりの使える金額を表示。毎日の支出管理が簡単に。',
    featured: false,
  },
]

interface CompetitorWithFlag extends CompetitorComparison {
  isOurs: boolean
}

const DEFAULT_COMPETITORS: CompetitorWithFlag[] = [
  {
    name: 'マネーフォワード',
    price: '月額500円〜',
    features: ['銀行連携', 'カード連携', '資産管理'],
    isOurs: false,
  },
  {
    name: 'Zaim',
    price: '月額480円〜',
    features: ['レシート読取', '銀行連携', '予算管理'],
    isOurs: false,
  },
  {
    name: 'AI家計簿',
    price: '¥0',
    features: ['AI分析', '予算管理', '今日使える金額', 'シンプルUI'],
    isOurs: true,
  },
]

const displayCompetitors = computed<CompetitorWithFlag[]>(() => {
  if (props.competitors.length > 0) {
    return props.competitors.map(competitor => ({
      ...competitor,
      isOurs: competitor.name === 'AI家計簿',
    }))
  }
  return DEFAULT_COMPETITORS
})
</script>

<template>
  <section id="why" class="relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
    <!-- 地：紙のグレインと淡い光。黒面でも平坦にならないように -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="grain-overlay absolute inset-0 opacity-[0.2]" />
      <div class="absolute -right-40 top-0 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_65%)]" />
      <div class="absolute -left-40 bottom-0 h-[32rem] w-[32rem] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16),transparent_65%)]" />
    </div>

    <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
      <!-- 見出し -->
      <RevealOnScroll class="grid gap-6 border-b border-paper/15 pb-12 lg:grid-cols-12 lg:items-end" :threshold="0.2">
        <div class="lg:col-span-7">
          <div class="mb-5 flex items-center gap-3">
            <span class="font-mincho text-sm font-bold tabular-nums text-emerald-400">02</span>
            <span class="h-px w-6 bg-paper/25" />
            <span class="font-gothic text-xs font-bold tracking-[0.22em] text-paper/55">選ばれる理由</span>
          </div>
          <h2 class="font-mincho text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            なぜ、AI家計簿なのか
          </h2>
        </div>
        <p class="font-gothic text-sm leading-[1.9] text-paper/65 lg:col-span-5 lg:pb-2">
          他の家計簿アプリとは違う、4つの強み。
        </p>
      </RevealOnScroll>

      <!-- 4つの強み：カードではなく罫線で仕切る -->
      <div class="grid border-b border-paper/15 sm:grid-cols-2">
        <RevealOnScroll
          v-for="(point, index) in SELLING_POINTS"
          :key="point.index"
          :delay="index * 90"
          :class="[
            'relative py-10 sm:py-12',
            index % 2 === 0 ? 'sm:pr-12' : 'sm:border-l sm:border-paper/15 sm:pl-12',
            index < 2 ? 'border-b border-paper/15' : '',
          ]"
        >
          <div class="mb-4 flex items-baseline gap-4">
            <span
              :class="[
                'font-mincho text-4xl font-black leading-none tabular-nums',
                point.featured ? 'text-emerald-400/70' : 'text-paper/20',
              ]"
            >
              {{ point.index }}
            </span>
            <h3
              :class="[
                'font-mincho text-xl font-bold tracking-tight sm:text-2xl',
                point.featured ? 'text-emerald-300' : 'text-paper',
              ]"
            >
              {{ point.title }}
            </h3>
          </div>
          <p class="max-w-md font-gothic text-sm leading-[1.95] text-paper/65">
            {{ point.description }}
          </p>
          <ul v-if="point.tags" class="mt-5 flex flex-wrap gap-2">
            <li
              v-for="tag in point.tags"
              :key="tag"
              class="rounded-full border border-emerald-400/35 px-3 py-1 font-gothic text-[11px] font-medium tracking-wide text-emerald-300"
            >
              {{ tag }}
            </li>
          </ul>
        </RevealOnScroll>
      </div>

      <!-- 比較表：このLPで最も説得力のある部分なので大きく扱う -->
      <RevealOnScroll class="pt-20" :threshold="0.1">
        <div class="mb-10 flex items-center gap-3">
          <span class="h-px w-6 bg-paper/25" />
          <h3 class="font-gothic text-xs font-bold tracking-[0.22em] text-paper/55">他サービスとの比較</h3>
        </div>

        <!-- 見出し行（デスクトップのみ） -->
        <div class="hidden grid-cols-12 gap-4 border-b border-paper/15 pb-3 font-gothic text-[11px] tracking-[0.16em] text-paper/40 md:grid">
          <span class="col-span-4">サービス</span>
          <span class="col-span-3">料金</span>
          <span class="col-span-5">主な機能</span>
        </div>

        <div
          v-for="competitor in displayCompetitors"
          :key="competitor.name"
          :class="[
            'relative grid grid-cols-1 gap-3 border-b border-paper/10 py-6 md:grid-cols-12 md:items-center md:gap-4',
            competitor.isOurs ? 'bg-gradient-to-r from-emerald-400/10 to-transparent' : '',
          ]"
        >
          <!-- 自社行の左端に置く目印 -->
          <span
            v-if="competitor.isOurs"
            class="absolute inset-y-0 -left-3 w-0.5 bg-emerald-400 sm:-left-5"
            aria-hidden="true"
          />

          <div class="md:col-span-4">
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'font-mincho text-lg font-bold tracking-tight sm:text-xl',
                  competitor.isOurs ? 'text-emerald-300' : 'text-paper/85',
                ]"
              >
                {{ competitor.name }}
              </span>
              <span
                v-if="competitor.isOurs"
                class="rounded-full bg-emerald-400 px-2 py-0.5 font-gothic text-[10px] font-bold tracking-wide text-ink"
              >
                おすすめ
              </span>
            </div>
          </div>

          <div class="md:col-span-3">
            <span
              v-if="competitor.isOurs"
              class="font-mincho text-4xl font-black leading-none tabular-nums text-emerald-300 sm:text-5xl"
            >
              ¥0
            </span>
            <span v-else class="font-gothic text-sm tabular-nums text-paper/50 line-through decoration-paper/25">
              {{ competitor.price }}
            </span>
          </div>

          <div class="flex flex-wrap gap-2 md:col-span-5">
            <span
              v-for="feature in competitor.features"
              :key="feature"
              :class="[
                'rounded-full border px-3 py-1 font-gothic text-[11px] tracking-wide',
                competitor.isOurs
                  ? 'border-emerald-400/35 text-emerald-200'
                  : 'border-paper/15 text-paper/50',
              ]"
            >
              {{ feature }}
            </span>
          </div>
        </div>

        <p class="mt-10 max-w-2xl font-gothic text-sm leading-[1.95] text-paper/65">
          有料プランへの誘導は<span class="font-bold text-paper">一切なし</span>。
          <span class="font-bold text-emerald-300">すべての機能が完全無料</span>で使えます。
        </p>
      </RevealOnScroll>
    </div>
  </section>
</template>
