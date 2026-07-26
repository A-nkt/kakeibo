<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'

const { elementRef, isVisible } = useScrollAnimation({ threshold: 0.3 })

const FACTS = [
  { figure: '¥0', unit: '', caption: '登録料・月額料金' },
  { figure: '3', unit: 'ステップ', caption: '登録から利用開始まで' },
  { figure: '0', unit: '件', caption: '有料プランへの誘導' },
]
</script>

<template>
  <section class="border-y border-ink/10 bg-paper-2">
    <div
      ref="elementRef"
      :class="[
        'mx-auto grid max-w-6xl divide-ink/10 px-5 transition-all duration-1000 sm:px-8 md:grid-cols-3 md:divide-x',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      ]"
    >
      <div
        v-for="(fact, index) in FACTS"
        :key="fact.caption"
        :class="[
          'flex items-baseline gap-3 py-7 md:flex-col md:items-start md:gap-1 md:py-10',
          index > 0 ? 'border-t border-ink/10 md:border-t-0' : '',
          index === 1 ? 'md:pl-10' : index === 2 ? 'md:pl-10' : '',
        ]"
        :style="{ transitionDelay: `${index * 120}ms` }"
      >
        <p class="flex items-baseline gap-1.5">
          <span class="font-mincho text-4xl font-black tabular-nums leading-none text-ink sm:text-5xl">
            {{ fact.figure }}
          </span>
          <span v-if="fact.unit" class="font-gothic text-sm font-bold text-ink-2">{{ fact.unit }}</span>
        </p>
        <p class="font-gothic text-xs tracking-wide text-ink-3 md:mt-2">{{ fact.caption }}</p>
      </div>
    </div>
  </section>
</template>
