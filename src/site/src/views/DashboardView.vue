<script setup lang="ts">
import DataTable from '@/components/dashboard/DataTable.vue'
import BarChart from '@/components/dashboard/BarChart.vue'
import { tableColumns, tableRows, chartLabels, chartDatasets } from '@/data/sampleData'
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-6">
    <h1 class="mb-6 text-2xl font-bold text-gray-800">Dashboard</h1>
    
    <!-- Responsive Grid Layout: vertical stack on mobile, side by side on md+ -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <!-- Data Table Section -->
      <div class="flex flex-col">
        <h2 class="mb-3 text-lg font-semibold text-gray-700">データテーブル</h2>
        <DataTable :columns="tableColumns" :rows="tableRows" />
      </div>
      
      <!-- Bar Chart Section -->
      <div class="flex flex-col">
        <h2 class="mb-3 text-lg font-semibold text-gray-700">バーチャート</h2>
        <div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <BarChart
            :labels="chartLabels"
            :datasets="chartDatasets"
            title="売上データ"
            :show-legend="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>
