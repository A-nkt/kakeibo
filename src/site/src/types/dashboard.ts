// types/dashboard.ts

// テーブル列の定義
export interface TableColumn {
  key: string
  label: string
  width?: string
}

// テーブル行データ（ジェネリック対応）
export interface TableRow {
  [key: string]: string | number
}

// DataTable コンポーネントの props
export interface DataTableProps {
  columns: TableColumn[]
  rows: TableRow[]
  emptyMessage?: string
}

// チャートデータセット
export interface ChartDataset {
  label: string
  data: number[]
  backgroundColor?: string | string[]
  borderColor?: string | string[]
  borderWidth?: number
}

// バーチャートの props
export interface BarChartProps {
  labels: string[]
  datasets: ChartDataset[]
  title?: string
  showLegend?: boolean
}
