<script setup lang="ts">
import type { TableColumn, TableRow } from '@/types/dashboard'

interface Props {
  columns: TableColumn[]
  rows: TableRow[]
  emptyMessage?: string
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'データがありません'
})
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
    <table class="min-w-full divide-y divide-gray-200">
      <!-- Table Header -->
      <thead class="bg-gray-50">
        <tr>
          <th
            v-for="column in columns"
            :key="column.key"
            :style="column.width ? { width: column.width } : undefined"
            class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>

      <!-- Table Body -->
      <tbody class="divide-y divide-gray-200 bg-white">
        <!-- Data Rows -->
        <tr
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          class="transition-colors duration-150 hover:bg-gray-50"
        >
          <td
            v-for="column in columns"
            :key="column.key"
            class="whitespace-nowrap px-6 py-4 text-sm text-gray-900"
          >
            {{ row[column.key] }}
          </td>
        </tr>

        <!-- Empty State -->
        <tr v-if="rows.length === 0">
          <td
            :colspan="columns.length"
            class="px-6 py-8 text-center text-sm text-gray-500"
          >
            {{ emptyMessage }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
