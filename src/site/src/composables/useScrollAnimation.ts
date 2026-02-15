import { ref, onMounted, onUnmounted, watch } from 'vue'
import type { Ref } from 'vue'

export interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
}

export interface UseScrollAnimationReturn {
  elementRef: Ref<HTMLElement | null>
  isVisible: Ref<boolean>
}

/**
 * Composable for scroll-triggered animations using Intersection Observer API.
 * Respects user's `prefers-reduced-motion` preference.
 *
 * @param options - Configuration options for the Intersection Observer
 * @param options.threshold - Percentage of element visibility to trigger (0-1), default: 0.1
 * @param options.rootMargin - Margin around the root element, default: '0px'
 * @returns Object containing elementRef to attach to element and isVisible reactive state
 */
export function useScrollAnimation(
  options: UseScrollAnimationOptions = {}
): UseScrollAnimationReturn {
  const { threshold = 0.1, rootMargin = '0px' } = options

  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  let observer: IntersectionObserver | null = null

  // Check if user prefers reduced motion
  const prefersReducedMotion = (): boolean => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  const setupObserver = () => {
    // If user prefers reduced motion, immediately set visible without animation
    if (prefersReducedMotion()) {
      isVisible.value = true
      return
    }

    if (!elementRef.value) return

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true
            // Once visible, stop observing (animation triggers only once)
            if (observer && elementRef.value) {
              observer.unobserve(elementRef.value)
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(elementRef.value)
  }

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  onMounted(() => {
    setupObserver()

    // Listen for changes in prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        isVisible.value = true
        cleanup()
      }
    }
    mediaQuery.addEventListener('change', handleChange)
  })

  // Watch for elementRef changes (in case element is conditionally rendered)
  watch(elementRef, (newEl, oldEl) => {
    if (oldEl && observer) {
      observer.unobserve(oldEl)
    }
    if (newEl && !isVisible.value && !prefersReducedMotion()) {
      setupObserver()
    }
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    elementRef,
    isVisible,
  }
}
