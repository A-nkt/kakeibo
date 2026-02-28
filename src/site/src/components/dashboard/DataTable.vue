<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableColumn, TableRow } from '@/types/dashboard'

interface Props {
  columns: TableColumn[]
  rows: TableRow[]
  emptyMessage?: string
  searchQuery?: string
}

const props = withDefaults(defineProps<Props>(), {
  emptyMessage: 'データがありません',
  searchQuery: '',
})

const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const sortedRows = computed(() => {
  if (!sortKey.value) return props.rows
  return [...props.rows].sort((a, b) => {
    const aVal = a[sortKey.value!]
    const bVal = b[sortKey.value!]
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
    }
    return sortOrder.value === 'asc'
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal))
  })
})

const filteredRows = computed(() => {
  const query = props.searchQuery.trim().toLowerCase()
  if (!query) return sortedRows.value
  return sortedRows.value.filter(row =>
    props.columns.some(col => {
      const val = row[col.key]
      if (val == null) return false
      if (typeof val === 'number') return val.toLocaleString().includes(query)
      return String(val).toLowerCase().includes(query)
    })
  )
})

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const getValueColor = (value: string | number | undefined, key: string) => {
  if ((key === 'total' || key === 'price') && typeof value === 'number') {
    if (value >= 200000) return 'text-emerald-600 font-semibold'
    if (value >= 100000) return 'text-blue-600'
    return 'text-gray-600'
  }
  return 'text-gray-700'
}

const getStatusClass = (status: string) => {
  switch (status) {
    case '販売中': return 'bg-emerald-100 text-emerald-700'
    case '在庫少': return 'bg-amber-100 text-amber-700'
    case '予約受付': return 'bg-blue-100 text-blue-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const formatNumber = (value: string | number | undefined) => {
  if (typeof value === 'number') {
    return value.toLocaleString()
  }
  return value ?? ''
}

const scrollContainer = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  }
}

defineExpose({ scrollToBottom })
</script>

<template>
  <div class="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
    <div ref="scrollContainer" class="flex-1 overflow-auto">
      <table class="min-w-full">
        <thead class="sticky top-0 z-10">
          <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
            <th
              v-for="column in columns"
              :key="column.key"
              :style="column.width ? { width: column.width } : undefined"
              class="group cursor-pointer px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 transition-colors hover:text-gray-900"
              @click="handleSort(column.key)"
            >
              <div class="flex items-center gap-2">
                {{ column.label }}
                <span class="text-gray-400 transition-colors group-hover:text-gray-600">
                  <svg v-if="sortKey === column.key" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="sortOrder === 'asc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                  <svg v-else class="h-4 w-4 opacity-0 group-hover:opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr
            v-for="(row, rowIndex) in filteredRows"
            :key="rowIndex"
            class="group transition-all duration-200 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50"
            :style="{ animationDelay: `${rowIndex * 50}ms` }"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="whitespace-nowrap px-6 py-4 text-sm transition-colors"
              :class="getValueColor(row[column.key], column.key)"
            >
              <span v-if="column.key === 'id'" class="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-xs font-bold text-indigo-600">
                {{ row[column.key] }}
              </span>
              <span v-else-if="column.key === 'status'" class="inline-flex rounded-full px-2 py-1 text-xs font-medium" :class="getStatusClass(String(row[column.key]))">
                {{ row[column.key] }}
              </span>
              <span v-else-if="column.key === 'price' || column.key === 'total'" :class="getValueColor(row[column.key], column.key)">
                ¥{{ formatNumber(row[column.key]) }}
              </span>
              <span v-else>{{ formatNumber(row[column.key]) }}</span>
            </td>
          </tr>
          <tr v-if="filteredRows.length === 0">
            <td :colspan="columns.length" class="px-6 py-12 text-center">
              <div class="flex flex-col items-center gap-2 text-gray-400">
                <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span class="text-sm">{{ props.searchQuery ? '一致する項目がありません' : emptyMessage }}</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
