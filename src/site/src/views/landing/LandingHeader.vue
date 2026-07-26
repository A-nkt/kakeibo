<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import GoogleCta from './GoogleCta.vue'

defineEmits<{ (e: 'cta-click'): void }>()

const NAV = [
  { label: '主要機能', href: '#features' },
  { label: '選ばれる理由', href: '#why' },
  { label: '使い方', href: '#steps' },
]

// スクロールしたら罫線と背景を出す（先頭では紙面に溶け込ませる）
const isScrolled = ref(false)
const onScroll = () => {
  isScrolled.value = window.scrollY > 24
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header
    :class="[
      'fixed inset-x-0 top-0 z-50 transition-all duration-500',
      isScrolled ? 'border-b border-ink/10 bg-paper/85 backdrop-blur-md' : 'border-b border-transparent',
    ]"
  >
    <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
      <!-- ロゴ -->
      <a href="#top" class="group flex items-center gap-2.5">
        <span class="flex h-8 w-8 items-center justify-center rounded-md bg-ink font-mincho text-base font-bold text-paper">
          ¥
        </span>
        <span class="font-mincho text-lg font-bold tracking-tight text-ink">AI家計簿</span>
      </a>

      <div class="flex items-center gap-6">
        <nav class="hidden items-center gap-6 md:flex">
          <a
            v-for="item in NAV"
            :key="item.href"
            :href="item.href"
            class="relative font-gothic text-sm text-ink-2 transition-colors hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-ink after:transition-all after:duration-300 hover:after:w-full"
          >
            {{ item.label }}
          </a>
        </nav>
        <GoogleCta label="無料で始める" @click="$emit('cta-click')" />
      </div>
    </div>
  </header>
</template>
