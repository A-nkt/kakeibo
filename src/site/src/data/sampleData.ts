// data/sampleData.ts
import type { TableColumn, TableRow, ChartDataset } from '@/types/dashboard'

export const tableColumns: TableColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: '名前' },
  { key: 'value', label: '値' }
]

export const tableRows: TableRow[] = [
  { id: 1, name: '項目A', value: 100 },
  { id: 2, name: '項目B', value: 200 },
  { id: 3, name: '項目C', value: 150 },
  { id: 4, name: '項目D', value: 300 },
  { id: 5, name: '項目E', value: 250 }
]

export const chartLabels: string[] = ['項目A', '項目B', '項目C', '項目D', '項目E']

export const chartDatasets: ChartDataset[] = [
  {
    label: '売上',
    data: [100, 200, 150, 300, 250],
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: 'rgb(59, 130, 246)',
    borderWidth: 1
  }
]
