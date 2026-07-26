<script setup lang="ts">
/**
 * LP 全体で使い回す CTA ボタン。
 * ink: 紙色の背景に置く黒ボタン / paper: 黒背景に置く紙色ボタン。
 */
interface Props {
  tone?: 'ink' | 'paper'
  size?: 'md' | 'lg'
  label?: string
}

withDefaults(defineProps<Props>(), {
  tone: 'ink',
  size: 'md',
  label: '無料で始める',
})

defineEmits<{ (e: 'click'): void }>()
</script>

<template>
  <button
    type="button"
    :class="[
      'group inline-flex items-center gap-3 rounded-full font-gothic font-bold tracking-wide transition-all duration-300',
      'hover:-translate-y-0.5 active:translate-y-0',
      tone === 'ink'
        ? 'bg-ink text-paper shadow-lg shadow-ink/25 hover:shadow-xl hover:shadow-ink/30'
        : 'bg-paper text-ink shadow-lg shadow-black/40 hover:shadow-xl',
      size === 'lg' ? 'px-7 py-4 text-base' : 'px-5 py-2.5 text-sm',
    ]"
    @click="$emit('click')"
  >
    <!-- Google の公式カラーマーク（白抜きより信頼感が出る） -->
    <span
      :class="[
        'flex items-center justify-center rounded-full bg-white',
        size === 'lg' ? 'h-7 w-7' : 'h-5 w-5',
      ]"
    >
      <svg :class="size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    </span>
    <span>{{ label }}</span>
    <svg
      :class="['transition-transform duration-300 group-hover:translate-x-1', size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5']"
      fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </button>
</template>
