<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import type { ChartDataset } from '@/types/dashboard'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
  labels: string[]
  datasets: ChartDataset[]
  title?: string
  showLegend?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  showLegend: true
})

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset, index) => {
    const colors = [
      { line: 'rgb(99, 102, 241)', bg: 'rgba(99, 102, 241, 0.1)' },
      { line: 'rgb(16, 185, 129)', bg: 'rgba(16, 185, 129, 0.1)' },
      { line: 'rgb(245, 158, 11)', bg: 'rgba(245, 158, 11, 0.1)' }
    ]
    const color = colors[index % colors.length]
    return {
      label: dataset.label,
      data: dataset.data,
      borderColor: dataset.borderColor ?? color.line,
      backgroundColor: dataset.backgroundColor ?? color.bg,
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: dataset.borderColor ?? color.line,
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }
  })
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  animation: { duration: 800, easing: 'easeOutQuart' as const },
  interaction: { intersect: false, mode: 'index' as const },
  plugins: {
    legend: {
      display: props.showLegend,
      position: 'top' as const,
      labels: { usePointStyle: true, padding: 20, font: { size: 12, weight: 500 } }
    },
    title: {
      display: !!props.title,
      text: props.title,
      font: { size: 16, weight: 600 },
      padding: { bottom: 20 }
    },
    tooltip: {
      backgroundColor: 'rgba(17, 24, 39, 0.9)',
      titleFont: { size: 14, weight: 600 },
      bodyFont: { size: 13 },
      padding: 12,
      cornerRadius: 8
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#6B7280' } },
    y: { beginAtZero: true, grid: { color: 'rgba(229, 231, 235, 0.5)' }, ticks: { font: { size: 11 }, color: '#6B7280' } }
  }
}))
</script>

<template>
  <div class="w-full">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
