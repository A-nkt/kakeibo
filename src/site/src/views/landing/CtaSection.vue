<script setup lang="ts">
import GoogleCta from './GoogleCta.vue'
import RevealOnScroll from './RevealOnScroll.vue'

/**
 * inline: ページ中盤に挟む細い帯（紙面）
 * full:   ページ末尾の締め（黒面）
 * 同じ内容を2回繰り返さないよう、見せ方を分けている。
 */
interface Props {
  variant?: 'inline' | 'full'
  message?: string
  buttonText?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'full',
  message: 'ずっと無料。今すぐ始めよう。',
  buttonText: '無料で始める',
})

defineEmits<{ (e: 'cta-click'): void }>()

const TRUST = ['Googleアカウントで登録', '追加入力不要', 'ワンクリックで開始', 'パスワード管理不要']
</script>

<template>
  <!-- ===== 中盤：細い帯 ===== -->
  <section v-if="variant === 'inline'" class="border-y border-ink/10 bg-paper-2">
    <RevealOnScroll
      class="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between"
      :threshold="0.3"
      distance="1rem"
    >
      <div>
        <p class="font-mincho text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {{ message }}
        </p>
        <p class="mt-2 font-gothic text-xs text-ink-3">
          プレミアムプランなし。隠れた料金なし。すべての機能を完全無料で。
        </p>
      </div>
      <GoogleCta size="lg" :label="buttonText" @click="$emit('cta-click')" />
    </RevealOnScroll>
  </section>

  <!-- ===== 末尾：黒面の締め ===== -->
  <section v-else class="relative overflow-hidden bg-ink py-24 text-paper sm:py-32">
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="grain-overlay absolute inset-0 opacity-[0.2]" />
      <div class="absolute left-1/2 top-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16),transparent_62%)]" />
    </div>

    <RevealOnScroll class="relative mx-auto max-w-3xl px-5 text-center sm:px-8" :threshold="0.25">
      <div class="mb-8 flex items-center justify-center gap-3">
        <span class="h-px w-8 bg-emerald-400" />
        <span class="font-gothic text-xs font-bold tracking-[0.22em] text-emerald-400">ずっと無料</span>
        <span class="h-px w-8 bg-emerald-400" />
      </div>

      <h2 class="font-mincho text-3xl font-black leading-[1.25] tracking-tight sm:text-5xl">
        {{ message }}
      </h2>

      <p class="mx-auto mt-7 max-w-lg font-gothic text-sm leading-[1.95] text-paper/65 sm:text-base">
        プレミアムプランなし。隠れた料金なし。<br class="hidden sm:inline" />
        すべての機能を<span class="font-bold text-emerald-300">完全無料</span>でご利用いただけます。
      </p>

      <div class="mt-10 flex justify-center">
        <GoogleCta tone="paper" size="lg" :label="buttonText" @click="$emit('cta-click')" />
      </div>

      <ul class="mx-auto mt-12 flex max-w-xl flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-paper/15 pt-7">
        <li
          v-for="(item, index) in TRUST"
          :key="item"
          class="flex items-center gap-4 font-gothic text-xs text-paper/55"
        >
          <span v-if="index > 0" class="h-3 w-px bg-paper/20" aria-hidden="true" />
          {{ item }}
        </li>
      </ul>
    </RevealOnScroll>
  </section>
</template>
