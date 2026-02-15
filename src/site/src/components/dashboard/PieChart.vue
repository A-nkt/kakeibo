<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  type Chart,
  type TooltipItem
} from 'chart.js'

ChartJS.register(ArcElement, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  data: number[]
  title?: string
  showLegend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showLegend: true
})

const colors = [
  'rgba(99, 102, 241, 0.8)',   // indigo
  'rgba(16, 185, 129, 0.8)',   // emerald
  'rgba(245, 158, 11, 0.8)',   // amber
  'rgba(239, 68, 68, 0.8)',    // red
  'rgba(139, 92, 246, 0.8)',   // violet
  'rgba(6, 182, 212, 0.8)',    // cyan
  'rgba(236, 72, 153, 0.8)',   // pink
  'rgba(34, 197, 94, 0.8)',    // green
  'rgba(249, 115, 22, 0.8)',   // orange
  'rgba(59, 130, 246, 0.8)',   // blue
]

const borderColors = [
  'rgb(99, 102, 241)',
  'rgb(16, 185, 129)',
  'rgb(245, 158, 11)',
  'rgb(239, 68, 68)',
  'rgb(139, 92, 246)',
  'rgb(6, 182, 212)',
  'rgb(236, 72, 153)',
  'rgb(34, 197, 94)',
  'rgb(249, 115, 22)',
  'rgb(59, 130, 246)',
]

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    data: props.data,
    backgroundColor: colors.slice(0, props.data.length),
    borderColor: borderColors.slice(0, props.data.length),
    borderWidth: 2,
  }]
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 800, easing: 'easeOutQuart' as const },
  plugins: {
    legend: {
      display: props.showLegend,
      position: 'right' as const,
      labels: {
        usePointStyle: true,
        padding: 12,
        font: { size: 11, weight: 500 as const },
        generateLabels: (chart: Chart<'pie'>) => {
          const data = chart.data
          if (data.labels && data.labels.length && data.datasets.length) {
            const dataset = data.datasets[0]
            if (!dataset) return []
            const dataValues = dataset.data as number[]
            const total = dataValues.reduce((a, b) => a + b, 0)
            return (data.labels as string[]).map((label, i) => {
              const value = dataValues[i] ?? 0
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
              const bgColors = (dataset.backgroundColor ?? []) as string[]
              const borderColorsArr = (dataset.borderColor ?? []) as string[]
              return {
                text: `${label}: ¥${value.toLocaleString()} (${percentage}%)`,
                fillStyle: bgColors[i],
                strokeStyle: borderColorsArr[i],
                lineWidth: 2,
                hidden: false,
                index: i,
                pointStyle: 'circle' as const
              }
            })
          }
          return []
        }
      }
    },
    title: {
      display: !!props.title,
      text: props.title,
      font: { size: 16, weight: 600 as const },
      padding: { bottom: 20 }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleFont: { size: 14, weight: 600 as const },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        label: (context: TooltipItem<'pie'>) => {
          const value = context.raw as number
          const dataValues = context.dataset.data as number[]
          const total = dataValues.reduce((a, b) => a + b, 0)
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0'
          return `¥${value.toLocaleString()} (${percentage}%)`
        }
      }
    }
  }
}))
</script>

<template>
  <div class="h-full w-full">
    <Pie :data="chartData" :options="chartOptions" />
  </div>
</template>
