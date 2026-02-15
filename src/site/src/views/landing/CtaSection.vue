<template>
  <section
    ref="sectionRef"
    class="relative overflow-hidden py-20 lg:py-28"
  >
    <!-- Background -->
    <div class="absolute inset-0">
      <!-- Gradient Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900"></div>
      
      <!-- Gradient Orbs -->
      <div class="absolute -left-20 top-1/4 h-72 w-72 animate-blob rounded-full bg-indigo-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-2000 absolute -right-20 bottom-1/4 h-72 w-72 animate-blob rounded-full bg-purple-500 opacity-20 mix-blend-multiply blur-3xl filter"></div>
      
      <!-- Grid Pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
    </div>

    <!-- Content -->
    <div
      :class="[
        'relative z-10 container mx-auto px-4 text-center transition-all duration-1000',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      ]"
    >
      <!-- Free Badge -->
      <div class="mb-6 inline-flex items-center">
        <span class="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-1.5 text-sm font-bold text-white shadow-lg">
          <span class="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-r from-emerald-400 to-green-500 opacity-50 blur-md"></span>
          <span class="relative flex items-center gap-1.5">
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            ずっと無料
          </span>
        </span>
      </div>

      <!-- Main Message -->
      <h2 class="mb-6 text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
        <span class="bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
          {{ displayMessage }}
        </span>
      </h2>

      <!-- Sub Message -->
      <p class="mx-auto mb-8 max-w-2xl text-lg text-purple-200 md:text-xl">
        プレミアムプランなし。隠れた料金なし。<br class="hidden sm:inline" />
        すべての機能を<span class="font-semibold text-emerald-400">完全無料</span>でご利用いただけます。
      </p>

      <!-- CTA Button -->
      <div class="mb-8">
        <button
          @click="handleCtaClick"
          class="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 p-[2px] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30 active:scale-95"
        >
          <div class="relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 px-10 py-5 text-white transition-all duration-300">
            <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
            </svg>
            <span class="text-lg font-bold md:text-xl">{{ displayButtonText }}</span>
          </div>
        </button>
      </div>

      <!-- Trust Messages -->
      <div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-purple-200 md:text-base">
        <span class="flex items-center gap-2">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          Googleアカウントで登録
        </span>
        <span class="flex items-center gap-2">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          追加入力不要
        </span>
        <span class="flex items-center gap-2">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          ワンクリックで開始
        </span>
      </div>

      <!-- Additional Trust Badges -->
      <div class="mt-10 flex flex-wrap items-center justify-center gap-4">
        <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span class="text-sm text-purple-100">プレミアムプランなし</span>
        </div>
        <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm text-purple-100">隠れた料金なし</span>
        </div>
        <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="text-sm text-purple-100">パスワード管理不要</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// Props
interface Props {
  message?: string
  buttonText?: string
}

const props = withDefaults(defineProps<Props>(), {
  message: 'ずっと無料。今すぐ始めよう。',
  buttonText: 'Googleで無料登録'
})

// Emits
const emit = defineEmits<{
  (e: 'cta-click'): void
}>()

// Computed display values
const displayMessage = computed(() => props.message)
const displayButtonText = computed(() => props.buttonText)

// Scroll animation
const { elementRef: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 })

// CTA click handler
const handleCtaClick = () => {
  emit('cta-click')
}
</script>

<style scoped>
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  25% {
    transform: translate(20px, -30px) scale(1.1);
  }
  50% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  75% {
    transform: translate(30px, 10px) scale(1.05);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.animate-blob {
  animation: blob 8s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}
</style>
