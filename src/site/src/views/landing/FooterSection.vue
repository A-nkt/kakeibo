<script setup lang="ts">
import { computed } from 'vue'

interface FooterLink {
  label: string
  href: string
}

interface Props {
  links?: FooterLink[]
  copyrightYear?: number
}

const props = withDefaults(defineProps<Props>(), {
  links: () => [],
  copyrightYear: () => new Date().getFullYear(),
})

const displayLinks = computed(() => props.links)
const displayCopyrightYear = computed(() => props.copyrightYear)
</script>

<template>
  <footer class="border-t border-ink/10 bg-paper">
    <div class="mx-auto max-w-6xl px-5 py-14 sm:px-8">
      <div class="grid gap-10 md:grid-cols-12 md:items-start">
        <!-- 銘 -->
        <div class="md:col-span-5">
          <div class="flex items-center gap-2.5">
            <span class="flex h-8 w-8 items-center justify-center rounded-md bg-ink font-mincho text-base font-bold text-paper">
              ¥
            </span>
            <span class="font-mincho text-lg font-bold tracking-tight text-ink">AI家計簿</span>
          </div>
          <p class="mt-4 max-w-xs font-gothic text-xs leading-[1.9] text-ink-3">
            AIが支出パターンを分析し、「今日使える金額」を自動計算する家計簿アプリ。すべての機能を完全無料で。
          </p>
        </div>

        <!-- リンク -->
        <nav v-if="displayLinks.length > 0" class="md:col-span-4">
          <p class="mb-4 font-gothic text-[11px] font-bold tracking-[0.22em] text-ink-3">リンク</p>
          <ul class="space-y-2.5">
            <li v-for="link in displayLinks" :key="link.label">
              <a
                :href="link.href"
                class="relative font-gothic text-sm text-ink-2 transition-colors hover:text-ink after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-ink after:transition-all after:duration-300 hover:after:w-full"
              >
                {{ link.label }}
              </a>
            </li>
          </ul>
        </nav>

        <!-- 料金の明示 -->
        <div class="md:col-span-3">
          <p class="mb-4 font-gothic text-[11px] font-bold tracking-[0.22em] text-ink-3">料金</p>
          <p class="flex items-baseline gap-2">
            <span class="font-mincho text-4xl font-black leading-none tabular-nums text-ink">¥0</span>
            <span class="font-gothic text-xs text-ink-3">/ 月</span>
          </p>
          <p class="mt-3 font-gothic text-xs text-emerald-800">完全無料で利用可能</p>
        </div>
      </div>

      <div class="mt-14 flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p class="font-gothic text-xs text-ink-3">
          © {{ displayCopyrightYear }} AI家計簿. All rights reserved.
        </p>
        <p class="font-gothic text-[10px] tracking-[0.3em] text-ink/25">KAKEIBO</p>
      </div>
    </div>
  </footer>
</template>
