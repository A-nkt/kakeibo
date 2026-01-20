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

// Chart.js のスケール、要素、プラグインを登録
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

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

// Chart.js 用のデータ構造を構築
const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets.map((dataset) => ({
    label: dataset.label,
    data: dataset.data,
    backgroundColor: dataset.backgroundColor ?? 'rgba(59, 130, 246, 0.5)',
    borderColor: dataset.borderColor ?? 'rgb(59, 130, 246)',
    borderWidth: dataset.borderWidth ?? 1
  }))
}))

// Chart.js オプション（レスポンシブ設定を有効化）
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: props.showLegend
    },
    title: {
      display: !!props.title,
      text: props.title
    }
  },
  scales: {
    x: {
      display: true
    },
    y: {
      display: true,
      beginAtZero: true
    }
  }
}))
</script>

<template>
  <div class="w-full">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
