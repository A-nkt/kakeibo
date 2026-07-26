<script setup lang="ts">
import { useScrollAnimation } from '@/composables/useScrollAnimation'

/**
 * スクロールで一度だけ立ち上がる汎用ラッパ。
 * 親から渡した class はルート要素にマージされるので、
 * grid などのレイアウト指定をそのまま載せられる。
 * prefers-reduced-motion は useScrollAnimation 側で尊重される。
 */
interface Props {
  delay?: number
  threshold?: number
  distance?: string
}

const props = withDefaults(defineProps<Props>(), {
  delay: 0,
  threshold: 0.15,
  distance: '1.75rem',
})

const { elementRef, isVisible } = useScrollAnimation({ threshold: props.threshold })
</script>

<template>
  <div
    ref="elementRef"
    class="transition-[opacity,transform] duration-1000 ease-out"
    :style="{
      transitionDelay: `${delay}ms`,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'none' : `translateY(${distance})`,
    }"
  >
    <slot />
  </div>
</template>
