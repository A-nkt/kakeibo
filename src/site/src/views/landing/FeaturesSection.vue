<template>
  <section class="relative overflow-hidden py-20 lg:py-32">
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <!-- Gradient Orbs -->
      <div class="absolute left-1/4 top-20 h-72 w-72 animate-blob rounded-full bg-indigo-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-2000 absolute right-1/4 bottom-20 h-72 w-72 animate-blob rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-4000 absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 animate-blob rounded-full bg-blue-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>

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
        <span class="mb-4 inline-block rounded-full bg-indigo-500/20 px-4 py-2 text-sm font-medium text-indigo-300">
          主要機能
        </span>
        <h2 class="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          <span class="bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
            シンプルなのに高機能
          </span>
        </h2>
        <p class="mx-auto max-w-2xl text-lg text-purple-200">
          必要な機能だけを厳選。複雑な設定は不要で、すぐに使い始められます。
        </p>
      </div>

      <!-- Features Grid -->
      <div class="grid gap-6 md:grid-cols-2 lg:gap-8">
        <div
          v-for="(feature, index) in displayFeatures"
          :key="feature.title"
          :ref="(el) => setFeatureRef(el as HTMLElement | null, index)"
          :class="[
            'group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-white/10 hover:shadow-lg hover:shadow-indigo-500/20 lg:p-8',
            featureVisibility[index] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          ]"
          :style="{ transitionDelay: `${index * 150}ms` }"
        >
          <!-- Glow Effect on Hover -->
          <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>

          <div class="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <!-- Icon -->
            <div class="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl shadow-lg shadow-indigo-500/30">
              {{ feature.icon }}
            </div>

            <!-- Content -->
            <div class="flex-1">
              <h3 class="mb-2 text-xl font-bold text-white">
                {{ feature.title }}
              </h3>
              <p class="text-purple-200">
                {{ feature.description }}
              </p>
            </div>
          </div>

          <!-- Feature Illustration -->
          <div class="mt-6 flex justify-center">
            <FeatureIllustration :type="feature.illustrationType" />
          </div>
        </div>
      </div>

      <!-- Storyset-style Main Illustration -->
      <div
        ref="illustrationRef"
        :class="[
          'mt-16 flex justify-center transition-all duration-1000',
          isIllustrationVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        ]"
      >
        <div class="relative max-w-lg">
          <!-- Glow Effect -->
          <div class="absolute inset-0 animate-pulse-slow rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-3xl"></div>
          
          <!-- Storyset-style Features Illustration -->
          <!-- Attribution: Illustration style inspired by Storyset (https://storyset.com/) -->
          <svg
            class="relative h-auto w-full"
            viewBox="0 0 500 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="機能紹介イラスト - 家計管理の4つの機能"
          >
            <!-- Background Elements -->
            <circle cx="250" cy="150" r="130" fill="url(#featuresGradient1)" opacity="0.1"/>
            <circle cx="400" cy="80" r="60" fill="url(#featuresGradient2)" opacity="0.1"/>
            <circle cx="100" cy="220" r="50" fill="url(#featuresGradient2)" opacity="0.1"/>

            <!-- Central Dashboard -->
            <rect x="175" y="50" width="150" height="200" rx="16" fill="#1e1b4b" stroke="url(#featuresGradient1)" stroke-width="2"/>
            <rect x="185" y="65" width="130" height="170" rx="10" fill="#312e81"/>

            <!-- Dashboard Content - Header -->
            <rect x="195" y="75" width="80" height="8" rx="4" fill="#818cf8" opacity="0.6"/>
            
            <!-- Balance Display -->
            <rect x="195" y="95" width="110" height="40" rx="8" fill="url(#featuresGradient1)"/>
            <text x="205" y="112" fill="white" font-size="7" opacity="0.8">今日使える金額</text>
            <text x="205" y="128" fill="white" font-size="12" font-weight="bold">¥3,500</text>

            <!-- Mini Chart -->
            <rect x="195" y="145" width="110" height="40" rx="6" fill="#1e1b4b"/>
            <rect x="203" y="165" width="8" height="15" rx="2" fill="#818cf8"/>
            <rect x="215" y="158" width="8" height="22" rx="2" fill="#a78bfa"/>
            <rect x="227" y="155" width="8" height="25" rx="2" fill="#c4b5fd"/>
            <rect x="239" y="162" width="8" height="18" rx="2" fill="#818cf8"/>
            <rect x="251" y="152" width="8" height="28" rx="2" fill="#a78bfa"/>
            <rect x="263" y="160" width="8" height="20" rx="2" fill="#c4b5fd"/>
            <rect x="275" y="157" width="8" height="23" rx="2" fill="#818cf8"/>
            <rect x="287" y="150" width="8" height="30" rx="2" fill="#a78bfa"/>

            <!-- List Items -->
            <rect x="195" y="195" width="110" height="10" rx="4" fill="#4c1d95" opacity="0.5"/>
            <rect x="195" y="210" width="80" height="10" rx="4" fill="#4c1d95" opacity="0.3"/>

            <!-- Floating Feature Icons -->
            <circle cx="80" cy="100" r="35" fill="url(#featuresGradient1)" opacity="0.9"/>
            <text x="80" y="108" text-anchor="middle" fill="white" font-size="24">💰</text>

            <circle cx="420" cy="100" r="35" fill="url(#featuresGradient1)" opacity="0.9"/>
            <text x="420" y="108" text-anchor="middle" fill="white" font-size="24">📊</text>

            <circle cx="80" cy="200" r="35" fill="url(#featuresGradient1)" opacity="0.9"/>
            <text x="80" y="208" text-anchor="middle" fill="white" font-size="24">🎯</text>

            <circle cx="420" cy="200" r="35" fill="url(#featuresGradient1)" opacity="0.9"/>
            <text x="420" y="208" text-anchor="middle" fill="white" font-size="24">🤖</text>

            <!-- Connection Lines -->
            <path d="M115 100 L175 120" stroke="#818cf8" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>
            <path d="M385 100 L325 120" stroke="#818cf8" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>
            <path d="M115 200 L175 180" stroke="#818cf8" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>
            <path d="M385 200 L325 180" stroke="#818cf8" stroke-width="2" stroke-dasharray="4 4" opacity="0.5"/>

            <!-- Sparkles -->
            <path d="M150 50 L153 58 L161 55 L153 62 L150 70 L147 62 L139 55 L147 58 Z" fill="#fbbf24" opacity="0.8"/>
            <path d="M350 50 L353 58 L361 55 L353 62 L350 70 L347 62 L339 55 L347 58 Z" fill="#a78bfa" opacity="0.6"/>
            <path d="M250 270 L254 280 L264 276 L254 284 L250 294 L246 284 L236 276 L246 280 Z" fill="#34d399" opacity="0.7"/>

            <!-- Gradients -->
            <defs>
              <linearGradient id="featuresGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#6366f1"/>
                <stop offset="100%" stop-color="#a855f7"/>
              </linearGradient>
              <linearGradient id="featuresGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#818cf8"/>
                <stop offset="100%" stop-color="#c4b5fd"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// Props
interface Feature {
  icon: string
  title: string
  description: string
}

interface Props {
  features?: Feature[]
}

const props = withDefaults(defineProps<Props>(), {
  features: () => []
})

// Feature Illustration Component
const FeatureIllustration = defineComponent({
  props: {
    type: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const illustrations: Record<string, () => ReturnType<typeof h>> = {
      expense: () => h('svg', {
        class: 'h-32 w-full max-w-xs opacity-80 transition-transform duration-300 group-hover:scale-105',
        viewBox: '0 0 200 100',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        role: 'img',
        'aria-label': '支出管理のイラスト'
      }, [
        h('rect', { x: '40', y: '20', width: '120', height: '60', rx: '8', fill: '#312e81' }),
        h('rect', { x: '50', y: '30', width: '40', height: '8', rx: '4', fill: '#818cf8', opacity: '0.6' }),
        h('rect', { x: '50', y: '45', width: '100', height: '25', rx: '6', fill: '#1e1b4b' }),
        h('text', { x: '60', y: '62', fill: '#a78bfa', 'font-size': '10' }, '¥12,500'),
        h('circle', { cx: '140', cy: '57', r: '10', fill: '#6366f1' }),
        h('text', { x: '140', y: '61', 'text-anchor': 'middle', fill: 'white', 'font-size': '10' }, '💰')
      ]),
      visualization: () => h('svg', {
        class: 'h-32 w-full max-w-xs opacity-80 transition-transform duration-300 group-hover:scale-105',
        viewBox: '0 0 200 100',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        role: 'img',
        'aria-label': '可視化機能のイラスト'
      }, [
        h('rect', { x: '30', y: '15', width: '140', height: '70', rx: '8', fill: '#312e81' }),
        h('rect', { x: '45', y: '55', width: '15', height: '20', rx: '3', fill: '#818cf8' }),
        h('rect', { x: '65', y: '45', width: '15', height: '30', rx: '3', fill: '#a78bfa' }),
        h('rect', { x: '85', y: '35', width: '15', height: '40', rx: '3', fill: '#c4b5fd' }),
        h('rect', { x: '105', y: '50', width: '15', height: '25', rx: '3', fill: '#818cf8' }),
        h('rect', { x: '125', y: '30', width: '15', height: '45', rx: '3', fill: '#a78bfa' }),
        h('rect', { x: '145', y: '40', width: '15', height: '35', rx: '3', fill: '#c4b5fd' }),
        h('path', { d: 'M45 30 L75 35 L95 25 L115 40 L135 20 L155 28', stroke: '#34d399', 'stroke-width': '2', fill: 'none' })
      ]),
      budget: () => h('svg', {
        class: 'h-32 w-full max-w-xs opacity-80 transition-transform duration-300 group-hover:scale-105',
        viewBox: '0 0 200 100',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        role: 'img',
        'aria-label': '予算管理のイラスト'
      }, [
        h('circle', { cx: '100', cy: '50', r: '35', fill: 'none', stroke: '#4c1d95', 'stroke-width': '8' }),
        h('circle', { cx: '100', cy: '50', r: '35', fill: 'none', stroke: '#6366f1', 'stroke-width': '8', 'stroke-dasharray': '165 220', 'stroke-linecap': 'round', transform: 'rotate(-90 100 50)' }),
        h('text', { x: '100', y: '45', 'text-anchor': 'middle', fill: 'white', 'font-size': '10', 'font-weight': 'bold' }, '¥3,500'),
        h('text', { x: '100', y: '58', 'text-anchor': 'middle', fill: '#a78bfa', 'font-size': '7' }, '今日使える'),
        h('circle', { cx: '155', cy: '25', r: '15', fill: '#6366f1' }),
        h('text', { x: '155', y: '29', 'text-anchor': 'middle', fill: 'white', 'font-size': '12' }, '🎯')
      ]),
      ai: () => h('svg', {
        class: 'h-32 w-full max-w-xs opacity-80 transition-transform duration-300 group-hover:scale-105',
        viewBox: '0 0 200 100',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        role: 'img',
        'aria-label': 'AI分析のイラスト'
      }, [
        h('circle', { cx: '100', cy: '50', r: '30', fill: '#6366f1' }),
        h('circle', { cx: '85', cy: '45', r: '5', fill: 'white' }),
        h('circle', { cx: '115', cy: '45', r: '5', fill: 'white' }),
        h('path', { d: 'M88 60 Q100 70 112 60', stroke: 'white', 'stroke-width': '3', fill: 'none', 'stroke-linecap': 'round' }),
        h('path', { d: 'M60 35 L75 45', stroke: '#818cf8', 'stroke-width': '2' }),
        h('path', { d: 'M140 35 L125 45', stroke: '#818cf8', 'stroke-width': '2' }),
        h('path', { d: 'M60 65 L75 55', stroke: '#818cf8', 'stroke-width': '2' }),
        h('path', { d: 'M140 65 L125 55', stroke: '#818cf8', 'stroke-width': '2' }),
        h('circle', { cx: '50', cy: '30', r: '8', fill: '#312e81', stroke: '#818cf8', 'stroke-width': '1' }),
        h('circle', { cx: '150', cy: '30', r: '8', fill: '#312e81', stroke: '#818cf8', 'stroke-width': '1' }),
        h('circle', { cx: '50', cy: '70', r: '8', fill: '#312e81', stroke: '#818cf8', 'stroke-width': '1' }),
        h('circle', { cx: '150', cy: '70', r: '8', fill: '#312e81', stroke: '#818cf8', 'stroke-width': '1' }),
        h('text', { x: '50', y: '34', 'text-anchor': 'middle', fill: '#a78bfa', 'font-size': '8' }, '¥'),
        h('text', { x: '150', y: '34', 'text-anchor': 'middle', fill: '#a78bfa', 'font-size': '8' }, '📈'),
        h('text', { x: '50', y: '74', 'text-anchor': 'middle', fill: '#a78bfa', 'font-size': '8' }, '💡'),
        h('text', { x: '150', y: '74', 'text-anchor': 'middle', fill: '#a78bfa', 'font-size': '8' }, '✓')
      ])
    }
    
    return () => {
      const illustrationFn = illustrations[props.type]
      if (illustrationFn) {
        return illustrationFn()
      }
      // Default fallback
      return h('svg', {
        class: 'h-32 w-full max-w-xs opacity-80',
        viewBox: '0 0 200 100',
        fill: 'none'
      }, [
        h('rect', { x: '40', y: '20', width: '120', height: '60', rx: '8', fill: '#312e81' })
      ])
    }
  }
})

// Default features data with illustration types
interface FeatureWithIllustration extends Feature {
  illustrationType: string
}

const defaultFeatures: FeatureWithIllustration[] = [
  {
    icon: '💰',
    title: '支出管理',
    description: '変動費・固定費を簡単に記録。カテゴリ分けで支出を整理。',
    illustrationType: 'expense'
  },
  {
    icon: '📊',
    title: '可視化機能',
    description: 'グラフで支出パターンを一目で把握。日別・週別・月別で分析。',
    illustrationType: 'visualization'
  },
  {
    icon: '🎯',
    title: '予算管理',
    description: '「今日使える金額」を自動計算。予算オーバーを防止。',
    illustrationType: 'budget'
  },
  {
    icon: '🤖',
    title: 'AI分析',
    description: '支出パターンを分析し、節約ポイントを自動提案。',
    illustrationType: 'ai'
  }
]

// Illustration type mapping
const illustrationTypes = ['expense', 'visualization', 'budget', 'ai']

// Use provided features or defaults
const displayFeatures = computed(() => {
  if (props.features.length > 0) {
    return props.features.map((feature, index) => ({
      ...feature,
      illustrationType: illustrationTypes[index] || 'expense'
    }))
  }
  return defaultFeatures
})

// Scroll animations
const { elementRef: headerRef, isVisible: isHeaderVisible } = useScrollAnimation({ threshold: 0.1 })
const { elementRef: illustrationRef, isVisible: isIllustrationVisible } = useScrollAnimation({ threshold: 0.1 })

// Feature card refs and visibility
const featureRefs = ref<(HTMLElement | null)[]>([])
const featureVisibility = ref<boolean[]>([false, false, false, false])

const setFeatureRef = (el: HTMLElement | null, index: number) => {
  featureRefs.value[index] = el
}

// Setup intersection observers for feature cards
const setupFeatureObservers = () => {
  if (typeof window === 'undefined') return
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    featureVisibility.value = [true, true, true, true]
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = featureRefs.value.findIndex(ref => ref === entry.target)
          if (index !== -1) {
            featureVisibility.value[index] = true
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  featureRefs.value.forEach((ref) => {
    if (ref) observer.observe(ref)
  })
}

onMounted(() => {
  // Small delay to ensure refs are set
  setTimeout(setupFeatureObservers, 100)
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
