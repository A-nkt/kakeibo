<template>
  <section class="relative min-h-screen overflow-hidden">
    <!-- Animated Background -->
    <div class="absolute inset-0">
      <!-- Gradient Orbs -->
      <div class="absolute -left-40 -top-40 h-96 w-96 animate-blob rounded-full bg-indigo-500 opacity-30 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-2000 absolute -right-40 top-20 h-96 w-96 animate-blob rounded-full bg-purple-500 opacity-30 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-4000 absolute -bottom-40 left-1/2 h-96 w-96 animate-blob rounded-full bg-blue-500 opacity-30 mix-blend-multiply blur-3xl filter"></div>

      <!-- Grid Pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 flex min-h-screen items-center">
      <div class="container mx-auto px-4 py-16 lg:py-24">
        <div class="grid items-center gap-12 lg:grid-cols-2">
          <!-- Left Column: Text Content -->
          <div
            ref="contentRef"
            :class="[
              'text-center lg:text-left transition-all duration-1000',
              isContentVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            ]"
          >
            <!-- 完全無料バッジ -->
            <div class="mb-6 inline-flex items-center">
              <span
                class="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-5 py-2 text-sm font-bold text-white shadow-lg"
              >
                <span class="absolute inset-0 animate-pulse-glow rounded-full bg-gradient-to-r from-emerald-400 to-green-500 opacity-50 blur-md"></span>
                <span class="relative flex items-center gap-2">
                  <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  完全無料
                </span>
              </span>
            </div>

            <!-- メインヘッドライン -->
            <h1 class="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
              <span class="bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
                AIがあなたの
              </span>
              <br />
              <span class="bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                家計を賢く管理
              </span>
            </h1>

            <!-- サブヘッドライン -->
            <p class="mb-8 text-lg text-purple-100 md:text-xl lg:pr-8">
              面倒な家計簿はもう卒業。AIが支出パターンを分析し、
              <span class="font-semibold text-white">「今日使える金額」</span>
              を自動計算。節約のコツも提案します。
            </p>

            <!-- CTAボタン -->
            <div class="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <button
                @click="handleCtaClick"
                class="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 p-[2px] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30 active:scale-95"
              >
                <div class="relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-green-500 px-8 py-4 text-white transition-all duration-300">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
                  </svg>
                  <span class="text-lg font-bold">無料で始める</span>
                </div>
              </button>
            </div>

            <!-- 安心メッセージ -->
            <div class="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm text-purple-200 lg:justify-start">
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                Googleアカウントで登録
              </span>
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                追加入力不要
              </span>
              <span class="flex items-center gap-1">
                <svg class="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                ずっと無料
              </span>
            </div>
          </div>

          <!-- Right Column: Visual -->
          <div
            ref="visualRef"
            :class="[
              'relative transition-all duration-1000 delay-300',
              isVisualVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            ]"
          >
            <!-- Storyset Illustration -->
            <div class="relative mx-auto max-w-lg">
              <!-- Glow Effect -->
              <div class="absolute inset-0 animate-pulse-slow rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-3xl"></div>
              
              <!-- Illustration Container -->
              <div class="relative rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <!-- Storyset-style Finance Illustration (SVG) -->
                <!-- Attribution: Illustration style inspired by Storyset (https://storyset.com/) -->
                <svg 
                  class="h-auto w-full" 
                  viewBox="0 0 400 300" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="AI家計簿アプリのイメージ - 家計管理をスマートに"
                >
                  <!-- Background Elements -->
                  <circle cx="200" cy="150" r="120" fill="url(#heroGradient1)" opacity="0.1"/>
                  <circle cx="320" cy="80" r="60" fill="url(#heroGradient2)" opacity="0.15"/>
                  <circle cx="80" cy="220" r="50" fill="url(#heroGradient2)" opacity="0.1"/>
                  
                  <!-- Phone/App Mockup -->
                  <rect x="140" y="40" width="120" height="220" rx="20" fill="#1e1b4b" stroke="url(#heroGradient1)" stroke-width="2"/>
                  <rect x="150" y="55" width="100" height="190" rx="12" fill="#312e81"/>
                  
                  <!-- App Screen Content -->
                  <!-- Header -->
                  <rect x="160" y="65" width="80" height="8" rx="4" fill="#818cf8" opacity="0.6"/>
                  
                  <!-- Balance Card -->
                  <rect x="160" y="85" width="80" height="45" rx="8" fill="url(#heroGradient1)"/>
                  <text x="170" y="102" fill="white" font-size="8" opacity="0.8">今日使える金額</text>
                  <text x="170" y="120" fill="white" font-size="14" font-weight="bold">¥3,500</text>
                  
                  <!-- Chart -->
                  <rect x="160" y="140" width="80" height="50" rx="6" fill="#1e1b4b"/>
                  <rect x="168" y="170" width="10" height="15" rx="2" fill="#818cf8"/>
                  <rect x="182" y="160" width="10" height="25" rx="2" fill="#a78bfa"/>
                  <rect x="196" y="155" width="10" height="30" rx="2" fill="#c4b5fd"/>
                  <rect x="210" y="165" width="10" height="20" rx="2" fill="#818cf8"/>
                  <rect x="224" y="150" width="10" height="35" rx="2" fill="#a78bfa"/>
                  
                  <!-- List Items -->
                  <rect x="160" y="200" width="80" height="12" rx="4" fill="#4c1d95" opacity="0.5"/>
                  <rect x="160" y="218" width="60" height="12" rx="4" fill="#4c1d95" opacity="0.3"/>
                  
                  <!-- Floating Elements -->
                  <!-- Coin 1 -->
                  <circle cx="300" cy="100" r="30" fill="url(#coinGradient)" stroke="#fbbf24" stroke-width="2"/>
                  <text x="300" y="106" text-anchor="middle" fill="#92400e" font-size="20" font-weight="bold">¥</text>
                  
                  <!-- Coin 2 -->
                  <circle cx="320" cy="160" r="22" fill="url(#coinGradient)" stroke="#fbbf24" stroke-width="2" opacity="0.8"/>
                  <text x="320" y="165" text-anchor="middle" fill="#92400e" font-size="14" font-weight="bold">¥</text>
                  
                  <!-- AI Brain Icon -->
                  <circle cx="90" cy="100" r="35" fill="url(#heroGradient1)" opacity="0.9"/>
                  <path d="M75 100 Q90 85 105 100 Q90 115 75 100" stroke="white" stroke-width="2" fill="none"/>
                  <circle cx="82" cy="95" r="3" fill="white"/>
                  <circle cx="98" cy="95" r="3" fill="white"/>
                  <path d="M85 105 Q90 110 95 105" stroke="white" stroke-width="2" fill="none"/>
                  
                  <!-- Sparkles -->
                  <path d="M340 50 L345 60 L355 55 L345 65 L340 75 L335 65 L325 55 L335 60 Z" fill="#fbbf24" opacity="0.8"/>
                  <path d="M60 160 L63 167 L70 164 L63 171 L60 178 L57 171 L50 164 L57 167 Z" fill="#a78bfa" opacity="0.6"/>
                  
                  <!-- Arrow/Growth indicator -->
                  <path d="M280 200 L310 170 L300 170 L300 160 L320 160 L320 180 L310 180 L310 170" stroke="#34d399" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                  
                  <!-- Gradients -->
                  <defs>
                    <linearGradient id="heroGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#6366f1"/>
                      <stop offset="100%" stop-color="#a855f7"/>
                    </linearGradient>
                    <linearGradient id="heroGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#818cf8"/>
                      <stop offset="100%" stop-color="#c4b5fd"/>
                    </linearGradient>
                    <linearGradient id="coinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stop-color="#fde68a"/>
                      <stop offset="100%" stop-color="#fbbf24"/>
                    </linearGradient>
                  </defs>
                </svg>

                <!-- App Mockup Overlay -->
                <div class="absolute -bottom-4 -right-4 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-xl backdrop-blur-md md:-bottom-6 md:-right-6">
                  <div class="flex items-center gap-3">
                    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                      <svg class="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p class="text-xs text-purple-200">今日使える金額</p>
                      <p class="text-xl font-bold text-white">¥3,500</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <svg class="h-8 w-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// Emits
const emit = defineEmits<{
  (e: 'cta-click'): void
}>()

// Scroll animations
const { elementRef: contentRef, isVisible: isContentVisible } = useScrollAnimation({ threshold: 0.1 })
const { elementRef: visualRef, isVisible: isVisualVisible } = useScrollAnimation({ threshold: 0.1 })

// CTA click handler
const handleCtaClick = () => {
  emit('cta-click')
}

// Trigger animations on mount for hero section (above the fold)
onMounted(() => {
  // Small delay for smooth entrance animation
  setTimeout(() => {
    isContentVisible.value = true
    isVisualVisible.value = true
  }, 100)
})
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

@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.2;
  }
  50% {
    opacity: 0.4;
  }
}

.animate-blob {
  animation: blob 8s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-pulse-glow {
  animation: pulse-glow 2s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}
</style>
