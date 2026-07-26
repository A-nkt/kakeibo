<script setup lang="ts">
import { onMounted, ref } from 'vue'
import GoogleCta from './GoogleCta.vue'
import ProductPreview from './ProductPreview.vue'

const emit = defineEmits<{ (e: 'cta-click'): void }>()

// 読み込み直後の段階的な立ち上がり（prefers-reduced-motion では即表示）
const isReady = ref(false)

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isReady.value = true
    return
  }
  requestAnimationFrame(() => {
    isReady.value = true
  })
})

const TRUST = ['Googleアカウントで登録', '追加入力不要', 'ずっと無料']
</script>

<template>
  <section id="top" class="relative overflow-hidden bg-paper pb-20 pt-28 sm:pb-24 sm:pt-32 lg:pb-28">
    <!-- 地：紙のグレインと淡いインディゴの光 -->
    <div class="pointer-events-none absolute inset-0" aria-hidden="true">
      <div class="grain-overlay absolute inset-0 opacity-[0.16] mix-blend-multiply" />
      <div class="absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.16),transparent_65%)]" />
      <div class="absolute -bottom-56 -left-40 h-[36rem] w-[36rem] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12),transparent_65%)]" />
    </div>

    <!-- 誌面の綴じ側に見立てた縦組みラベル -->
    <span
      class="pointer-events-none absolute left-4 top-1/2 hidden -translate-y-1/2 font-gothic text-[10px] tracking-[0.4em] text-ink/25 xl:block"
      style="writing-mode: vertical-rl"
      aria-hidden="true"
    >
      KAKEIBO — AI SPENDING JOURNAL
    </span>

    <div class="relative mx-auto max-w-6xl px-5 sm:px-8">
      <div class="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <!-- 左：本文 -->
        <div
          :class="[
            'lg:col-span-5 transition-all duration-1000 ease-out',
            isReady ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
          ]"
        >
          <!-- 見出しの前に置く小さな標識 -->
          <div class="mb-7 flex items-center gap-3">
            <span class="h-px w-8 bg-emerald-700" />
            <span class="font-gothic text-xs font-bold tracking-[0.22em] text-emerald-800">完全無料</span>
          </div>

          <h1 class="font-mincho text-[2.6rem] font-black leading-[1.14] tracking-tight text-ink sm:text-6xl lg:text-[3.5rem]">
            <span class="block">AIがあなたの</span>
            <span class="block whitespace-nowrap">
              家計を<span class="relative">
                <span class="relative z-10">賢く管理</span>
                <span
                  class="absolute inset-x-0 bottom-1.5 z-0 h-3 bg-gradient-to-r from-indigo-300/70 to-violet-300/60 sm:bottom-2 sm:h-4"
                  aria-hidden="true"
                />
              </span>
            </span>
          </h1>

          <p class="mt-7 max-w-md font-gothic text-[15px] leading-[1.9] text-ink-2 sm:text-base">
            面倒な家計簿はもう卒業。AIが支出パターンを分析し、<span class="font-bold text-ink">「今日使える金額」</span>を自動計算。節約のコツも提案します。
          </p>

          <div class="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
            <GoogleCta size="lg" label="無料で始める" @click="emit('cta-click')" />
            <a
              href="#features"
              class="group inline-flex items-center gap-1.5 font-gothic text-sm font-medium text-ink-2 transition-colors hover:text-ink"
            >
              できることを見る
              <svg class="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7" />
              </svg>
            </a>
          </div>

          <!-- 罫線で区切った安心材料 -->
          <ul class="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/10 pt-5">
            <li
              v-for="(item, index) in TRUST"
              :key="item"
              class="flex items-center gap-4 font-gothic text-xs text-ink-3"
            >
              <span v-if="index > 0" class="h-3 w-px bg-ink/15" aria-hidden="true" />
              {{ item }}
            </li>
          </ul>
        </div>

        <!-- 右：実画面。紙面から少しはみ出させて奥行きを出す -->
        <div
          :class="[
            'relative lg:col-span-7 transition-all duration-1000 ease-out lg:-mr-8 xl:-mr-16',
            isReady ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-10 opacity-0',
          ]"
        >
          <!-- 版面を示す薄い罫線の額 -->
          <div
            class="pointer-events-none absolute -inset-4 hidden rounded-2xl border border-ink/10 sm:block lg:-inset-6"
            aria-hidden="true"
          />
          <div class="animate-float-slow will-change-transform">
            <ProductPreview variant="dashboard" class="rotate-[-1.2deg]" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
@keyframes float-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-float-slow {
  animation: float-slow 9s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .animate-float-slow {
    animation: none;
  }
}
</style>
