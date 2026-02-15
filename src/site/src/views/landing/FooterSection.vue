<template>
  <footer
    ref="footerRef"
    class="relative overflow-hidden border-t border-white/10 bg-gradient-to-b from-transparent to-indigo-950/50"
  >
    <!-- Background Elements -->
    <div class="absolute inset-0">
      <!-- Gradient Orbs -->
      <div class="absolute -left-20 top-0 h-48 w-48 animate-blob rounded-full bg-indigo-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>
      <div class="animation-delay-2000 absolute -right-20 bottom-0 h-48 w-48 animate-blob rounded-full bg-purple-500 opacity-10 mix-blend-multiply blur-3xl filter"></div>

      <!-- Grid Pattern -->
      <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]"></div>
    </div>

    <!-- Content -->
    <div
      :class="[
        'relative z-10 container mx-auto px-4 py-12 transition-all duration-1000',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      ]"
    >
      <div class="flex flex-col items-center gap-8">
        <!-- Logo & Brand -->
        <div class="flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <svg class="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-xl font-bold text-transparent">
            AI家計簿
          </span>
        </div>

        <!-- Links -->
        <nav v-if="displayLinks.length > 0" class="flex flex-wrap items-center justify-center gap-6">
          <a
            v-for="link in displayLinks"
            :key="link.href"
            :href="link.href"
            class="relative text-sm text-purple-200 transition-all duration-200 hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full"
          >
            {{ link.label }}
          </a>
        </nav>

        <!-- Free Badge -->
        <div class="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-sm">
          <svg class="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm text-purple-100">完全無料で利用可能</span>
        </div>

        <!-- Divider -->
        <div class="h-px w-full max-w-md bg-gradient-to-r from-transparent via-purple-500/30 to-transparent"></div>

        <!-- Copyright -->
        <p class="text-center text-sm text-purple-300">
          © {{ displayCopyrightYear }} AI家計簿. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useScrollAnimation } from '@/composables/useScrollAnimation'

// Types
interface FooterLink {
  label: string
  href: string
}

// Props
interface Props {
  links?: FooterLink[]
  copyrightYear?: number
}

const props = withDefaults(defineProps<Props>(), {
  links: () => [],
  copyrightYear: () => new Date().getFullYear()
})

// Computed display values
const displayLinks = computed(() => props.links)
const displayCopyrightYear = computed(() => props.copyrightYear)

// Scroll animation
const { elementRef: footerRef, isVisible } = useScrollAnimation({ threshold: 0.2 })
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

.animate-blob {
  animation: blob 8s ease-in-out infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
