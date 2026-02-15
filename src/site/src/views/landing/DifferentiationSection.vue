<template>
  <section class="relative overflow-hidden py-20 lg:py-32">
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <!-- Gradient Orbs -->
      <div class="absolute right-1/4 top-20 h-72 w-72 animate-blob rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-2000 absolute left-1/4 bottom-20 h-72 w-72 animate-blob rounded-full bg-indigo-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-4000 absolute right-1/3 bottom-1/3 h-64 w-64 animate-blob rounded-full bg-emerald-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>

      <!-- Grid Pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
    </div>

    <div class="container relative z-10 mx-auto px-4">
      <!-- Section Header -->
      <div
        ref="headerRef"
        :class="[
          'mb-16 text-center transition-all duration-1000',
          isHeaderVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        ]"
      >
        <span class="mb-4 inline-block rounded-full bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-300">
          選ばれる理由
        </span>
        <h2 class="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          <span class="bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
            なぜAI家計簿が選ばれるのか
          </span>
        </h2>
        <p class="mx-auto max-w-2xl text-lg text-purple-200">
          他の家計簿アプリとは違う、4つの強み
        </p>
      </div>

      <!-- Selling Points Grid -->
      <div class="mb-20 grid gap-6 md:grid-cols-2 lg:gap-8">
        <div
          v-for="(point, index) in sellingPoints"
          :key="point.title"
          :ref="(el) => setPointRef(el as HTMLElement | null, index)"
          :class="[
            'group relative overflow-hidden rounded-2xl border p-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] lg:p-8',
            index === 0 
              ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 to-green-500/5 hover:border-emerald-400/70 hover:shadow-lg hover:shadow-emerald-500/20' 
              : 'border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/20',
            pointVisibility[index] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          ]"
          :style="{ transitionDelay: `${index * 150}ms` }"
        >
          <!-- Special Badge for 完全無料 -->
          <div v-if="index === 0" class="absolute -right-8 -top-8 h-24 w-24 rotate-12 bg-gradient-to-br from-emerald-400 to-green-500 opacity-20 blur-2xl"></div>
          
          <!-- Glow Effect on Hover -->
          <div :class="[
            'absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10',
            index === 0 ? 'bg-gradient-to-br from-emerald-500/0 to-green-500/0' : 'bg-gradient-to-br from-indigo-500/0 to-purple-500/0'
          ]"></div>

          <div class="relative z-10">
            <!-- Icon and Title -->
            <div class="mb-4 flex items-center gap-4">
              <div :class="[
                'flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl shadow-lg',
                index === 0 
                  ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-emerald-500/30' 
                  : 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/30'
              ]">
                {{ point.icon }}
              </div>
              <div>
                <h3 :class="[
                  'text-xl font-bold',
                  index === 0 ? 'text-emerald-300' : 'text-white'
                ]">
                  {{ point.title }}
                </h3>
                <p v-if="point.highlight" class="text-sm font-medium text-emerald-400">
                  {{ point.highlight }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <p class="text-purple-200">
              {{ point.description }}
            </p>

            <!-- Extra info for 完全無料 -->
            <div v-if="index === 0" class="mt-4 flex flex-wrap gap-2">
              <span class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                登録料 ¥0
              </span>
              <span class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                月額料金 ¥0
              </span>
              <span class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300">
                機能制限なし
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Competitor Comparison Section -->
      <div
        ref="comparisonRef"
        :class="[
          'transition-all duration-1000',
          isComparisonVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        ]"
      >
        <h3 class="mb-8 text-center text-2xl font-bold text-white md:text-3xl">
          他サービスとの比較
        </h3>

        <!-- Comparison Table -->
        <div class="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <!-- Desktop Table -->
          <div class="hidden md:block">
            <table class="w-full">
              <thead>
                <tr class="border-b border-white/10 bg-white/5">
                  <th class="px-6 py-4 text-left text-sm font-medium text-purple-200">サービス</th>
                  <th class="px-6 py-4 text-center text-sm font-medium text-purple-200">料金</th>
                  <th class="px-6 py-4 text-left text-sm font-medium text-purple-200">主な機能</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="competitor in displayCompetitors"
                  :key="competitor.name"
                  :class="[
                    'border-b border-white/5 transition-colors',
                    competitor.isOurs 
                      ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/5' 
                      : 'hover:bg-white/5'
                  ]"
                >
                  <td class="px-6 py-5">
                    <div class="flex items-center gap-3">
                      <span v-if="competitor.isOurs" class="text-lg">✨</span>
                      <span :class="competitor.isOurs ? 'font-bold text-emerald-300' : 'text-white'">
                        {{ competitor.name }}
                      </span>
                      <span v-if="competitor.isOurs" class="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-300">
                        おすすめ
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-5 text-center">
                    <span
                      v-if="competitor.isOurs"
                      class="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-2 text-lg font-bold text-white shadow-lg shadow-emerald-500/30"
                    >
                      ¥0
                    </span>
                    <span v-else class="text-purple-300">
                      {{ competitor.price }}
                    </span>
                  </td>
                  <td class="px-6 py-5">
                    <div class="flex flex-wrap gap-2">
                      <span
                        v-for="feature in competitor.features"
                        :key="feature"
                        :class="[
                          'rounded-full px-3 py-1 text-xs font-medium',
                          competitor.isOurs 
                            ? 'bg-emerald-500/20 text-emerald-300' 
                            : 'bg-white/10 text-purple-200'
                        ]"
                      >
                        {{ feature }}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile Cards -->
          <div class="md:hidden">
            <div
              v-for="competitor in displayCompetitors"
              :key="competitor.name"
              :class="[
                'border-b border-white/5 p-4',
                competitor.isOurs ? 'bg-gradient-to-r from-emerald-500/10 to-green-500/5' : ''
              ]"
            >
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span v-if="competitor.isOurs" class="text-lg">✨</span>
                  <span :class="competitor.isOurs ? 'font-bold text-emerald-300' : 'text-white'">
                    {{ competitor.name }}
                  </span>
                </div>
                <span
                  v-if="competitor.isOurs"
                  class="inline-flex items-center rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-3 py-1 text-sm font-bold text-white"
                >
                  ¥0
                </span>
                <span v-else class="text-sm text-purple-300">
                  {{ competitor.price }}
                </span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="feature in competitor.features"
                  :key="feature"
                  :class="[
                    'rounded-full px-2 py-0.5 text-xs',
                    competitor.isOurs 
                      ? 'bg-emerald-500/20 text-emerald-300' 
                      : 'bg-white/10 text-purple-200'
                  ]"
                >
                  {{ feature }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Price Highlight Message -->
        <div class="mt-8 text-center">
          <p class="text-lg text-purple-200">
            有料プランへの誘導は<span class="font-bold text-white">一切なし</span>。
            <span class="font-bold text-emerald-300">すべての機能が完全無料</span>で使えます。
          </p>
        </div>
      </div>

      <!-- Storyset-style Illustration -->
      <div
        ref="illustrationRef"
        :class="[
          'mt-16 flex justify-center transition-all duration-1000',
          isIllustrationVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        ]"
      >
        <div class="relative max-w-md">
          <!-- Glow Effect -->
          <div class="absolute inset-0 animate-pulse-slow rounded-3xl bg-gradient-to-r from-emerald-500 to-green-500 opacity-20 blur-3xl"></div>
          
          <!-- Storyset-style Comparison Illustration -->
          <!-- Attribution: Illustration style inspired by Storyset (https://storyset.com/) -->
          <svg
            class="relative h-auto w-full"
            viewBox="0 0 400 250"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="サービス比較イラスト - AI家計簿の優位性"
          >
            <!-- Background Elements -->
            <circle cx="200" cy="125" r="100" fill="url(#diffGradient1)" opacity="0.1"/>
            <circle cx="320" cy="60" r="50" fill="url(#diffGradient2)" opacity="0.1"/>
            <circle cx="80" cy="180" r="40" fill="url(#diffGradient2)" opacity="0.1"/>

            <!-- Comparison Cards -->
            <!-- Competitor Card 1 -->
            <rect x="40" y="60" width="100" height="130" rx="12" fill="#312e81" stroke="#4c1d95" stroke-width="1"/>
            <rect x="50" y="75" width="60" height="8" rx="4" fill="#818cf8" opacity="0.4"/>
            <text x="90" y="110" text-anchor="middle" fill="#a78bfa" font-size="10">月額500円〜</text>
            <rect x="55" y="125" width="70" height="6" rx="3" fill="#4c1d95"/>
            <rect x="55" y="137" width="50" height="6" rx="3" fill="#4c1d95"/>
            <rect x="55" y="149" width="60" height="6" rx="3" fill="#4c1d95"/>
            <text x="90" y="175" text-anchor="middle" fill="#6b7280" font-size="8">有料プランあり</text>

            <!-- Competitor Card 2 -->
            <rect x="260" y="60" width="100" height="130" rx="12" fill="#312e81" stroke="#4c1d95" stroke-width="1"/>
            <rect x="270" y="75" width="60" height="8" rx="4" fill="#818cf8" opacity="0.4"/>
            <text x="310" y="110" text-anchor="middle" fill="#a78bfa" font-size="10">月額480円〜</text>
            <rect x="275" y="125" width="70" height="6" rx="3" fill="#4c1d95"/>
            <rect x="275" y="137" width="50" height="6" rx="3" fill="#4c1d95"/>
            <rect x="275" y="149" width="60" height="6" rx="3" fill="#4c1d95"/>
            <text x="310" y="175" text-anchor="middle" fill="#6b7280" font-size="8">有料プランあり</text>

            <!-- Our App Card (Center, Highlighted) -->
            <rect x="145" y="40" width="110" height="150" rx="14" fill="#064e3b" stroke="url(#emeraldGradient)" stroke-width="2"/>
            <rect x="155" y="55" width="70" height="10" rx="5" fill="#34d399" opacity="0.6"/>
            
            <!-- ¥0 Badge -->
            <circle cx="200" cy="100" r="30" fill="url(#emeraldGradient)"/>
            <text x="200" y="108" text-anchor="middle" fill="white" font-size="18" font-weight="bold">¥0</text>
            
            <text x="200" y="145" text-anchor="middle" fill="#6ee7b7" font-size="9" font-weight="bold">完全無料</text>
            <rect x="160" y="155" width="80" height="6" rx="3" fill="#065f46"/>
            <rect x="160" y="167" width="60" height="6" rx="3" fill="#065f46"/>
            
            <!-- Crown/Star -->
            <path d="M200 20 L205 30 L215 30 L207 37 L210 47 L200 42 L190 47 L193 37 L185 30 L195 30 Z" fill="#fbbf24"/>

            <!-- Arrows pointing to our app -->
            <path d="M145 125 L120 125" stroke="#34d399" stroke-width="2" stroke-dasharray="4 4" marker-end="url(#arrowhead)"/>
            <path d="M255 125 L280 125" stroke="#34d399" stroke-width="2" stroke-dasharray="4 4" marker-start="url(#arrowhead)"/>

            <!-- Sparkles -->
            <path d="M130 50 L133 57 L140 54 L133 61 L130 68 L127 61 L120 54 L127 57 Z" fill="#34d399" opacity="0.8"/>
            <path d="M270 50 L273 57 L280 54 L273 61 L270 68 L267 61 L260 54 L267 57 Z" fill="#34d399" opacity="0.6"/>
            <path d="M200 220 L204 230 L214 226 L204 234 L200 244 L196 234 L186 226 L196 230 Z" fill="#a78bfa" opacity="0.7"/>

            <!-- Checkmarks for our app -->
            <circle cx="170" cy="200" r="10" fill="#34d399" opacity="0.2"/>
            <path d="M166 200 L169 203 L175 197" stroke="#34d399" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="200" cy="200" r="10" fill="#34d399" opacity="0.2"/>
            <path d="M196 200 L199 203 L205 197" stroke="#34d399" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <circle cx="230" cy="200" r="10" fill="#34d399" opacity="0.2"/>
            <path d="M226 200 L229 203 L235 197" stroke="#34d399" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>

            <!-- Gradients -->
            <defs>
              <linearGradient id="diffGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#a855f7"/>
              </linearGradient>
              <linearGradient id="diffGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#818cf8"/>
                <stop offset="100%" stop-color="#c4b5fd"/>
              </linearGradient>
              <linearGradient id="emeraldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#34d399"/>
                <stop offset="100%" stop-color="#10b981"/>
              </linearGradient>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#34d399"/>
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// Props
interface CompetitorComparison {
  name: string
  price: string
  features: string[]
}

interface Props {
  competitors?: CompetitorComparison[]
}

const props = withDefaults(defineProps<Props>(), {
  competitors: () => []
})

// Selling points data
interface SellingPoint {
  icon: string
  title: string
  description: string
  highlight?: string
}

const sellingPoints: SellingPoint[] = [
  {
    icon: '💎',
    title: '完全無料',
    description: '登録料・月額料金・機能制限なし。他の家計簿アプリにありがちな「プレミアムプラン」への誘導は一切ありません。',
    highlight: '最も選ばれる理由'
  },
  {
    icon: '✨',
    title: 'シンプルで直感的なUI',
    description: '複雑な設定は不要。アプリを開いたその日から、すぐに使い始められます。'
  },
  {
    icon: '🤖',
    title: 'AIによる自動アドバイス',
    description: '支出パターンを分析し、あなたに合った節約ポイントを自動で提案します。'
  },
  {
    icon: '📅',
    title: '「今日使える金額」という独自の視点',
    description: '予算から逆算した1日あたりの使える金額を表示。毎日の支出管理が簡単に。'
  }
]

// Default competitors data
interface CompetitorWithFlag extends CompetitorComparison {
  isOurs: boolean
}

const defaultCompetitors: CompetitorWithFlag[] = [
  {
    name: 'マネーフォワード',
    price: '月額500円〜',
    features: ['銀行連携', 'カード連携', '資産管理'],
    isOurs: false
  },
  {
    name: 'Zaim',
    price: '月額480円〜',
    features: ['レシート読取', '銀行連携', '予算管理'],
    isOurs: false
  },
  {
    name: 'AI家計簿',
    price: '¥0（完全無料）',
    features: ['AI分析', '予算管理', '今日使える金額', 'シンプルUI'],
    isOurs: true
  }
]

// Use provided competitors or defaults
const displayCompetitors = computed(() => {
  if (props.competitors.length > 0) {
    return props.competitors.map((competitor) => ({
      ...competitor,
      isOurs: competitor.name === 'AI家計簿'
    }))
  }
  return defaultCompetitors
})

// Scroll animations
const { elementRef: headerRef, isVisible: isHeaderVisible } = useScrollAnimation({ threshold: 0.1 })
const { elementRef: comparisonRef, isVisible: isComparisonVisible } = useScrollAnimation({ threshold: 0.1 })
const { elementRef: illustrationRef, isVisible: isIllustrationVisible } = useScrollAnimation({ threshold: 0.1 })

// Selling point refs and visibility
const pointRefs = ref<(HTMLElement | null)[]>([])
const pointVisibility = ref<boolean[]>([false, false, false, false])

const setPointRef = (el: HTMLElement | null, index: number) => {
  pointRefs.value[index] = el
}

// Setup intersection observers for selling point cards
const setupPointObservers = () => {
  if (typeof window === 'undefined') return
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pointVisibility.value = [true, true, true, true]
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = pointRefs.value.findIndex(ref => ref === entry.target)
          if (index !== -1) {
            pointVisibility.value[index] = true
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  pointRefs.value.forEach((ref) => {
    if (ref) observer.observe(ref)
  })
}

onMounted(() => {
  // Small delay to ensure refs are set
  setTimeout(setupPointObservers, 100)
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

.animate-pulse-slow {
  animation: pulse-slow 4s ease-in-out infinite;
}
</style>
