<script setup lang="ts">
import { computed } from 'vue'
import ProductPreview from './ProductPreview.vue'
import RevealOnScroll from './RevealOnScroll.vue'

interface Step {
  number: number
  title: string
  description: string
  keywords: string[]
}

interface Props {
  steps?: Step[]
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => [],
})

const DEFAULT_STEPS: Step[] = [
  {
    number: 1,
    title: 'Googleアカウントで無料登録',
    description:
      'ワンクリックで登録完了。面倒な入力フォームは一切なし。Googleアカウントがあれば、すぐに始められます。',
    keywords: ['無料', 'ワンクリック'],
  },
  {
    number: 2,
    title: '支出を記録',
    description: 'カテゴリを選んで金額を入力するだけ。シンプルな操作で、毎日の支出を簡単に記録できます。',
    keywords: ['簡単'],
  },
  {
    number: 3,
    title: 'AIが分析・アドバイス',
    description: '入力したデータをAIが自動で分析。あなたの支出パターンから、節約ポイントを自動で提案します。',
    keywords: ['自動'],
  },
]

const displaySteps = computed(() => (props.steps.length > 0 ? props.steps : DEFAULT_STEPS))
</script>

<template>
  <section id="steps" class="relative overflow-hidden bg-paper py-24 sm:py-32">
    <div class="pointer-events-none absolute inset-0 grain-overlay opacity-[0.13] mix-blend-multiply" aria-hidden="true" />

    <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
      <!-- 見出し -->
      <RevealOnScroll class="grid gap-6 lg:grid-cols-12 lg:items-end" :threshold="0.2">
        <div class="lg:col-span-7">
          <div class="mb-5 flex items-center gap-3">
            <span class="font-mincho text-sm font-bold tabular-nums text-vermilion">03</span>
            <span class="h-px w-6 bg-ink/20" />
            <span class="font-gothic text-xs font-bold tracking-[0.22em] text-ink-3">かんたん3ステップ</span>
          </div>
          <h2 class="font-mincho text-3xl font-black leading-tight tracking-tight text-ink sm:text-5xl">
            使い方は、とてもシンプル
          </h2>
        </div>
        <p class="font-gothic text-sm leading-[1.9] text-ink-2 lg:col-span-5 lg:pb-2">
          <span class="font-bold text-ink">無料</span>で始めて、<span class="font-bold text-ink">簡単</span>に記録、<span class="font-bold text-ink">自動</span>で分析。
        </p>
      </RevealOnScroll>

      <!-- 3ステップ：上端に通した罫線で流れを示す -->
      <div class="mt-14 grid border-t border-ink/15 md:grid-cols-3">
        <RevealOnScroll
          v-for="(step, index) in displaySteps"
          :key="step.number"
          :delay="index * 130"
          :class="[
            'relative pb-10 pt-8 md:pb-0 md:pt-10',
            // 2列目以降は左に縦罫線を引き、罫線と本文の間に余白をとる
            index > 0 ? 'border-t border-ink/10 md:border-l md:border-t-0 md:border-ink/15 md:pl-8' : '',
            index < displaySteps.length - 1 ? 'md:pr-8' : '',
          ]"
        >
          <!-- 罫線上の節点 -->
          <span
            class="absolute -top-[3px] left-0 h-1.5 w-1.5 rounded-full bg-ink md:-left-[3px]"
            aria-hidden="true"
          />

          <span class="block font-mincho text-6xl font-black leading-none tabular-nums text-ink/15 sm:text-7xl">
            0{{ step.number }}
          </span>

          <div class="mt-5 flex flex-wrap gap-2">
            <span
              v-for="keyword in step.keywords"
              :key="keyword"
              class="rounded-full border border-emerald-700/30 px-2.5 py-0.5 font-gothic text-[11px] font-medium tracking-wide text-emerald-800"
            >
              {{ keyword }}
            </span>
          </div>

          <h3 class="mt-4 font-mincho text-xl font-bold leading-snug tracking-tight text-ink sm:text-2xl">
            {{ step.title }}
          </h3>
          <p class="mt-3 max-w-sm font-gothic text-sm leading-[1.95] text-ink-2 md:max-w-none">
            {{ step.description }}
          </p>
        </RevealOnScroll>
      </div>

      <!-- 記録画面の実物をひとつだけ添える -->
      <RevealOnScroll class="mt-20 grid items-center gap-10 border-t border-ink/10 pt-16 lg:grid-cols-12 lg:gap-14">
        <div class="lg:col-span-5">
          <h3 class="font-mincho text-2xl font-bold leading-snug tracking-tight text-ink sm:text-3xl">
            記録した支出は、<br />こう並びます
          </h3>
          <p class="mt-5 font-gothic text-sm leading-[1.95] text-ink-2">
            日付ごとにまとめて、カテゴリは色で識別。月やカテゴリで絞り込めるので、件数が増えても目的の支出にすぐたどり着けます。
          </p>
        </div>
        <div class="lg:col-span-7">
          <div class="relative">
            <div class="pointer-events-none absolute -inset-3 hidden rounded-2xl border border-ink/10 sm:block" aria-hidden="true" />
            <ProductPreview variant="list" :frame="false" class="relative" />
          </div>
        </div>
      </RevealOnScroll>
    </div>
  </section>
</template>
