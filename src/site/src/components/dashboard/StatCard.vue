<script setup lang="ts">
interface Props {
  title: string
  value: string | number
  icon: string
  subtitle?: string
  trend?: number
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  trend: 0,
  subtitle: ''
})

const colorClasses = {
  blue: 'from-blue-500 to-blue-600',
  green: 'from-emerald-500 to-emerald-600',
  purple: 'from-purple-500 to-purple-600',
  orange: 'from-orange-500 to-orange-600',
  red: 'from-red-500 to-red-600'
}

const iconBgClasses = {
  blue: 'bg-blue-400/30',
  green: 'bg-emerald-400/30',
  purple: 'bg-purple-400/30',
  orange: 'bg-orange-400/30',
  red: 'bg-red-400/30'
}
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
    :class="colorClasses[props.color]"
  >
    <!-- Background decoration -->
    <div class="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform duration-500 group-hover:scale-150" />
    <div class="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/5" />
    <div class="relative flex items-start justify-between">
      <div>
        <p class="text-sm font-medium text-white/80">{{ title }}</p>
        <p class="mt-2 text-3xl font-bold tracking-tight">{{ value }}</p>
        <p v-if="subtitle" class="mt-1 text-sm text-white/70">{{ subtitle }}</p>
        <div v-if="trend !== 0" class="mt-2 flex items-center gap-1 text-sm">
          <span v-if="trend > 0" class="flex items-center text-emerald-300">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            +{{ trend }}%
          </span>
          <span v-else class="flex items-center text-red-300">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            {{ trend }}%
          </span>
          <span class="text-white/70">前月比</span>
        </div>
      </div>
      <div class="rounded-xl p-3" :class="iconBgClasses[props.color]">
        <span class="text-2xl">{{ icon }}</span>
      </div>
    </div>
  </div>
</template>
