<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { ChartDataset } from '@/types/dashboard'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  datasets: ChartDataset[]
  title?: string
  showLegend?: boolean
  stacked?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showLegend: true,
  stacked: false
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset) => ({
    label: dataset.label,
    data: dataset.data,
    backgroundColor: dataset.backgroundColor || 'hsla(230, 70%, 55%, 0.8)',
    borderColor: dataset.borderColor || 'hsla(230, 70%, 55%, 1)',
    borderWidth: 0,
    borderRadius: props.stacked ? 0 : 6,
    borderSkipped: props.stacked ? 'start' as const : false,
  }))
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  animation: {
    duration: 800,
    easing: 'easeOutQuart' as const
  },
  plugins: {
    legend: {
      display: props.showLegend
    },
    title: {
      display: !!props.title,
      text: props.title,
      font: { size: 16, weight: 600 },
      padding: { bottom: 20 }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.95)',
      titleFont: { size: 14, weight: 600 },
      bodyFont: { size: 13 },
      padding: 14,
      cornerRadius: 10,
      displayColors: true,
      callbacks: {
        label: (context: { parsed: { y: number | null }; dataset: { label?: string } }) => {
          const value = context.parsed.y ?? 0
          return ` ${context.dataset.label}: ¥${value.toLocaleString()}`
        }
      }
    }
  },
  scales: {
    x: {
      display: true,
      stacked: props.stacked,
      grid: { display: false },
      ticks: { font: { size: 11 }, color: '#6B7280' }
    },
    y: {
      display: true,
      stacked: props.stacked,
      beginAtZero: true,
      grid: { color: 'rgba(229, 231, 235, 0.4)', drawBorder: false },
      ticks: {
        font: { size: 11 },
        color: '#6B7280',
        callback: (value: number | string) => `¥${Number(value).toLocaleString()}`
      }
    }
  }
}))
</script>

<template>
  <div class="w-full">
    <Bar ref="chartRef" :data="chartData" :options="chartOptions" />
  </div>
</template>
