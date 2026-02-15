<template>
  <section class="relative overflow-hidden py-20 lg:py-32">
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <!-- Gradient Orbs -->
      <div class="absolute right-1/4 top-20 h-72 w-72 animate-blob rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-2000 absolute left-1/4 bottom-20 h-72 w-72 animate-blob rounded-full bg-indigo-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-4000 absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 animate-blob rounded-full bg-blue-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>

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
          かんたん3ステップ
        </span>
        <h2 class="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
          <span class="bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
            使い方はとってもシンプル
          </span>
        </h2>
        <p class="mx-auto max-w-2xl text-lg text-purple-200">
          <span class="font-semibold text-emerald-300">無料</span>で始めて、
          <span class="font-semibold text-emerald-300">簡単</span>に記録、
          <span class="font-semibold text-emerald-300">自動</span>で分析。
        </p>
      </div>

      <!-- Steps -->
      <div class="relative mx-auto max-w-5xl">
        <!-- Connection Line (Desktop) -->
        <div class="absolute left-1/2 top-0 hidden h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-indigo-500 via-purple-500 to-emerald-500 opacity-30 lg:block"></div>

        <div class="space-y-12 lg:space-y-16">
          <div
            v-for="(step, index) in displaySteps"
            :key="step.number"
            :ref="(el) => setStepRef(el as HTMLElement | null, index)"
            :class="[
              'relative transition-all duration-700',
              stepVisibility[index] ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            ]"
            :style="{ transitionDelay: `${index * 200}ms` }"
          >
            <div
              :class="[
                'grid items-center gap-8 lg:grid-cols-2',
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              ]"
            >
              <!-- Content Side -->
              <div
                :class="[
                  'relative',
                  index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
                ]"
              >
                <div class="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-indigo-500/50 hover:bg-white/10 lg:p-8">
                  <!-- Glow Effect on Hover -->
                  <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/0 to-purple-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>

                  <div class="relative z-10">
                    <!-- Step Number Badge -->
                    <div class="mb-4 flex items-center gap-4">
                      <div class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/30">
                        {{ step.number }}
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <span
                          v-for="keyword in step.keywords"
                          :key="keyword"
                          class="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-300"
                        >
                          {{ keyword }}
                        </span>
                      </div>
                    </div>

                    <!-- Title -->
                    <h3 class="mb-3 text-xl font-bold text-white lg:text-2xl">
                      {{ step.title }}
                    </h3>

                    <!-- Description -->
                    <p class="text-purple-200">
                      {{ step.description }}
                    </p>

                    <!-- Additional Info for Step 1 -->
                    <div v-if="step.number === 1" class="mt-4 flex flex-wrap items-center gap-3 text-sm text-purple-200">
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
                        個人情報の追加入力不要
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Illustration Side -->
              <div
                :class="[
                  'flex justify-center',
                  index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
                ]"
              >
                <div class="relative">
                  <!-- Glow Effect -->
                  <div class="absolute inset-0 animate-pulse-slow rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-20 blur-2xl"></div>
                  
                  <!-- Step Illustration -->
                  <StepIllustration :step="step.number" />
                </div>
              </div>
            </div>

            <!-- Step Connector (Mobile) -->
            <div v-if="index < displaySteps.length - 1" class="mt-8 flex justify-center lg:hidden">
              <svg class="h-8 w-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, defineComponent, h } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// Props
interface Step {
  number: number
  title: string
  description: string
  keywords: string[]
  illustration: string
}

interface Props {
  steps?: Step[]
}

const props = withDefaults(defineProps<Props>(), {
  steps: () => []
})

// Step Illustration Component
const StepIllustration = defineComponent({
  props: {
    step: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const illustrations: Record<number, () => ReturnType<typeof h>> = {
      // Step 1: Google Registration
      1: () => h('svg', {
        class: 'relative h-48 w-48 md:h-56 md:w-56',
        viewBox: '0 0 200 200',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        role: 'img',
        'aria-label': 'Googleアカウントで無料登録のイラスト'
      }, [
        // Background circle
        h('circle', { cx: '100', cy: '100', r: '90', fill: 'url(#step1Gradient)', opacity: '0.1' }),
        
        // Phone outline
        h('rect', { x: '60', y: '30', width: '80', height: '140', rx: '12', fill: '#1e1b4b', stroke: 'url(#step1Gradient)', 'stroke-width': '2' }),
        h('rect', { x: '68', y: '42', width: '64', height: '116', rx: '6', fill: '#312e81' }),
        
        // Google button on phone
        h('rect', { x: '76', y: '90', width: '48', height: '24', rx: '12', fill: 'white' }),
        h('circle', { cx: '88', cy: '102', r: '6', fill: '#4285F4' }),
        h('path', { d: 'M88 96 L88 108 M82 102 L94 102', stroke: 'white', 'stroke-width': '2' }),
        h('text', { x: '96', y: '106', fill: '#333', 'font-size': '7', 'font-weight': 'bold' }, 'Google'),
        
        // Free badge
        h('circle', { cx: '150', cy: '50', r: '25', fill: '#10b981' }),
        h('text', { x: '150', y: '47', 'text-anchor': 'middle', fill: 'white', 'font-size': '8', 'font-weight': 'bold' }, '完全'),
        h('text', { x: '150', y: '58', 'text-anchor': 'middle', fill: 'white', 'font-size': '10', 'font-weight': 'bold' }, '無料'),
        
        // One-click indicator
        h('circle', { cx: '50', cy: '150', r: '20', fill: '#6366f1' }),
        h('text', { x: '50', y: '147', 'text-anchor': 'middle', fill: 'white', 'font-size': '6' }, 'ワン'),
        h('text', { x: '50', y: '157', 'text-anchor': 'middle', fill: 'white', 'font-size': '6' }, 'クリック'),
        
        // Sparkles
        h('path', { d: 'M170 100 L173 108 L181 105 L173 112 L170 120 L167 112 L159 105 L167 108 Z', fill: '#fbbf24', opacity: '0.8' }),
        h('path', { d: 'M30 80 L32 86 L38 84 L32 88 L30 94 L28 88 L22 84 L28 86 Z', fill: '#a78bfa', opacity: '0.6' }),
        
        // Gradients
        h('defs', {}, [
          h('linearGradient', { id: 'step1Gradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, [
            h('stop', { offset: '0%', 'stop-color': '#6366f1' }),
            h('stop', { offset: '100%', 'stop-color': '#a855f7' })
          ])
        ])
      ]),
      
      // Step 2: Record Expenses
      2: () => h('svg', {
        class: 'relative h-48 w-48 md:h-56 md:w-56',
        viewBox: '0 0 200 200',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        role: 'img',
        'aria-label': '支出を簡単に記録するイラスト'
      }, [
        // Background circle
        h('circle', { cx: '100', cy: '100', r: '90', fill: 'url(#step2Gradient)', opacity: '0.1' }),
        
        // Input form card
        h('rect', { x: '40', y: '50', width: '120', height: '100', rx: '12', fill: '#1e1b4b', stroke: 'url(#step2Gradient)', 'stroke-width': '2' }),
        
        // Category selector
        h('rect', { x: '52', y: '65', width: '96', height: '24', rx: '6', fill: '#312e81' }),
        h('text', { x: '62', y: '81', fill: '#a78bfa', 'font-size': '9' }, '🍔 食費'),
        h('path', { d: 'M136 77 L140 81 L144 77', stroke: '#818cf8', 'stroke-width': '2', fill: 'none' }),
        
        // Amount input
        h('rect', { x: '52', y: '97', width: '96', height: '24', rx: '6', fill: '#312e81' }),
        h('text', { x: '62', y: '113', fill: 'white', 'font-size': '11', 'font-weight': 'bold' }, '¥1,200'),
        
        // Submit button
        h('rect', { x: '52', y: '129', width: '96', height: '16', rx: '8', fill: 'url(#step2Gradient)' }),
        h('text', { x: '100', y: '141', 'text-anchor': 'middle', fill: 'white', 'font-size': '8', 'font-weight': 'bold' }, '記録する'),
        
        // Easy badge
        h('circle', { cx: '160', cy: '60', r: '22', fill: '#10b981' }),
        h('text', { x: '160', y: '64', 'text-anchor': 'middle', fill: 'white', 'font-size': '10', 'font-weight': 'bold' }, '簡単'),
        
        // Category icons floating
        h('circle', { cx: '35', cy: '90', r: '15', fill: '#6366f1' }),
        h('text', { x: '35', y: '95', 'text-anchor': 'middle', fill: 'white', 'font-size': '12' }, '🛒'),
        
        h('circle', { cx: '165', cy: '130', r: '15', fill: '#a855f7' }),
        h('text', { x: '165', y: '135', 'text-anchor': 'middle', fill: 'white', 'font-size': '12' }, '🚃'),
        
        // Sparkles
        h('path', { d: 'M175 90 L178 98 L186 95 L178 102 L175 110 L172 102 L164 95 L172 98 Z', fill: '#fbbf24', opacity: '0.8' }),
        
        // Gradients
        h('defs', {}, [
          h('linearGradient', { id: 'step2Gradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, [
            h('stop', { offset: '0%', 'stop-color': '#6366f1' }),
            h('stop', { offset: '100%', 'stop-color': '#a855f7' })
          ])
        ])
      ]),
      
      // Step 3: AI Analysis
      3: () => h('svg', {
        class: 'relative h-48 w-48 md:h-56 md:w-56',
        viewBox: '0 0 200 200',
        fill: 'none',
        xmlns: 'http://www.w3.org/2000/svg',
        role: 'img',
        'aria-label': 'AIが自動で分析・アドバイスするイラスト'
      }, [
        // Background circle
        h('circle', { cx: '100', cy: '100', r: '90', fill: 'url(#step3Gradient)', opacity: '0.1' }),
        
        // AI Brain
        h('circle', { cx: '100', cy: '80', r: '40', fill: 'url(#step3Gradient)' }),
        h('circle', { cx: '85', cy: '72', r: '6', fill: 'white' }),
        h('circle', { cx: '115', cy: '72', r: '6', fill: 'white' }),
        h('path', { d: 'M88 92 Q100 102 112 92', stroke: 'white', 'stroke-width': '3', fill: 'none', 'stroke-linecap': 'round' }),
        
        // Neural connections
        h('path', { d: 'M60 60 L75 72', stroke: '#818cf8', 'stroke-width': '2' }),
        h('path', { d: 'M140 60 L125 72', stroke: '#818cf8', 'stroke-width': '2' }),
        h('path', { d: 'M60 100 L75 88', stroke: '#818cf8', 'stroke-width': '2' }),
        h('path', { d: 'M140 100 L125 88', stroke: '#818cf8', 'stroke-width': '2' }),
        
        // Data nodes
        h('circle', { cx: '50', cy: '55', r: '12', fill: '#312e81', stroke: '#818cf8', 'stroke-width': '1' }),
        h('text', { x: '50', y: '59', 'text-anchor': 'middle', fill: '#a78bfa', 'font-size': '10' }, '📊'),
        
        h('circle', { cx: '150', cy: '55', r: '12', fill: '#312e81', stroke: '#818cf8', 'stroke-width': '1' }),
        h('text', { x: '150', y: '59', 'text-anchor': 'middle', fill: '#a78bfa', 'font-size': '10' }, '💰'),
        
        h('circle', { cx: '50', cy: '105', r: '12', fill: '#312e81', stroke: '#818cf8', 'stroke-width': '1' }),
        h('text', { x: '50', y: '109', 'text-anchor': 'middle', fill: '#a78bfa', 'font-size': '10' }, '📈'),
        
        h('circle', { cx: '150', cy: '105', r: '12', fill: '#312e81', stroke: '#818cf8', 'stroke-width': '1' }),
        h('text', { x: '150', y: '109', 'text-anchor': 'middle', fill: '#a78bfa', 'font-size': '10' }, '🎯'),
        
        // Advice bubble
        h('rect', { x: '55', y: '135', width: '90', height: '45', rx: '10', fill: '#1e1b4b', stroke: 'url(#step3Gradient)', 'stroke-width': '2' }),
        h('text', { x: '100', y: '152', 'text-anchor': 'middle', fill: '#10b981', 'font-size': '8', 'font-weight': 'bold' }, '💡 節約ポイント'),
        h('text', { x: '100', y: '168', 'text-anchor': 'middle', fill: 'white', 'font-size': '8' }, '食費を¥3,000削減可能'),
        
        // Auto badge
        h('circle', { cx: '165', cy: '150', r: '22', fill: '#10b981' }),
        h('text', { x: '165', y: '154', 'text-anchor': 'middle', fill: 'white', 'font-size': '10', 'font-weight': 'bold' }, '自動'),
        
        // Sparkles
        h('path', { d: 'M30 140 L33 148 L41 145 L33 152 L30 160 L27 152 L19 145 L27 148 Z', fill: '#fbbf24', opacity: '0.8' }),
        h('path', { d: 'M170 40 L172 46 L178 44 L172 48 L170 54 L168 48 L162 44 L168 46 Z', fill: '#a78bfa', opacity: '0.6' }),
        
        // Gradients
        h('defs', {}, [
          h('linearGradient', { id: 'step3Gradient', x1: '0%', y1: '0%', x2: '100%', y2: '100%' }, [
            h('stop', { offset: '0%', 'stop-color': '#6366f1' }),
            h('stop', { offset: '100%', 'stop-color': '#a855f7' })
          ])
        ])
      ])
    }
    
    return () => {
      const illustrationFn = illustrations[props.step]
      if (illustrationFn) {
        return illustrationFn()
      }
      // Default fallback
      return h('svg', {
        class: 'h-48 w-48',
        viewBox: '0 0 200 200',
        fill: 'none'
      }, [
        h('circle', { cx: '100', cy: '100', r: '80', fill: '#312e81' })
      ])
    }
  }
})

// Default steps data
const defaultSteps: Step[] = [
  {
    number: 1,
    title: 'Googleアカウントで無料登録',
    description: 'ワンクリックで登録完了。面倒な入力フォームは一切なし。Googleアカウントがあれば、すぐに始められます。',
    keywords: ['無料', 'ワンクリック'],
    illustration: 'google-signup'
  },
  {
    number: 2,
    title: '支出を記録',
    description: 'カテゴリを選んで金額を入力するだけ。シンプルな操作で、毎日の支出を簡単に記録できます。',
    keywords: ['簡単'],
    illustration: 'record-expense'
  },
  {
    number: 3,
    title: 'AIが分析・アドバイス',
    description: '入力したデータをAIが自動で分析。あなたの支出パターンから、節約ポイントを自動で提案します。',
    keywords: ['自動'],
    illustration: 'ai-analysis'
  }
]

// Use provided steps or defaults
const displaySteps = computed(() => {
  if (props.steps && props.steps.length > 0) {
    return props.steps
  }
  return defaultSteps
})

// Scroll animations
const { elementRef: headerRef, isVisible: isHeaderVisible } = useScrollAnimation({ threshold: 0.1 })

// Step refs and visibility
const stepRefs = ref<(HTMLElement | null)[]>([])
const stepVisibility = ref<boolean[]>([false, false, false])

const setStepRef = (el: HTMLElement | null, index: number) => {
  stepRefs.value[index] = el
}

// Setup intersection observers for step cards
const setupStepObservers = () => {
  if (typeof window === 'undefined') return
  
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    stepVisibility.value = [true, true, true]
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = stepRefs.value.findIndex(ref => ref === entry.target)
          if (index !== -1) {
            stepVisibility.value[index] = true
          }
        }
      })
    },
    { threshold: 0.1 }
  )

  stepRefs.value.forEach((ref) => {
    if (ref) observer.observe(ref)
  })
}

onMounted(() => {
  // Small delay to ensure refs are set
  setTimeout(setupStepObservers, 100)
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
