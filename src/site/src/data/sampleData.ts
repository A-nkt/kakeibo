// data/sampleData.ts
import type { TableColumn, TableRow, ChartDataset } from '@/types/dashboard'

export const tableColumns: TableColumn[] = [
  { key: 'name', label: '商品名' },
  { key: 'transactionDate', label: '取引日' },
  { key: 'total', label: '売上' }
]

// 基本データ（登録日、最終更新日、単価）
const baseData = [
  { id: 1, name: '商品A', createdAt: '2025-06-15', updatedAt: '2026-01-20', unitPrice: 120 },
  { id: 2, name: '商品B', createdAt: '2025-03-10', updatedAt: '2026-01-22', unitPrice: 350 },
  { id: 3, name: '商品C', createdAt: '2025-09-01', updatedAt: '2026-01-18', unitPrice: 800 },
  { id: 4, name: '商品D', createdAt: '2025-07-20', updatedAt: '2026-01-21', unitPrice: 220 },
  { id: 5, name: '商品E', createdAt: '2025-11-05', updatedAt: '2026-01-19', unitPrice: 150 },
  { id: 6, name: '商品F', createdAt: '2025-01-25', updatedAt: '2026-01-23', unitPrice: 480 },
  { id: 7, name: '商品G', createdAt: '2025-08-12', updatedAt: '2026-01-15', unitPrice: 950 },
  { id: 8, name: '商品H', createdAt: '2025-02-18', updatedAt: '2026-01-22', unitPrice: 520 },
  { id: 9, name: '商品I', createdAt: '2025-10-30', updatedAt: '2026-01-17', unitPrice: 110 },
  { id: 10, name: '商品J', createdAt: '2025-04-05', updatedAt: '2026-01-21', unitPrice: 380 },
  { id: 11, name: '商品K', createdAt: '2025-05-22', updatedAt: '2026-01-20', unitPrice: 290 },
  { id: 12, name: '商品L', createdAt: '2025-12-01', updatedAt: '2026-01-16', unitPrice: 180 },
  { id: 13, name: '商品M', createdAt: '2025-08-28', updatedAt: '2026-01-14', unitPrice: 750 },
  { id: 14, name: '商品N', createdAt: '2025-07-10', updatedAt: '2026-01-19', unitPrice: 210 },
  { id: 15, name: '商品O', createdAt: '2025-10-15', updatedAt: '2026-01-18', unitPrice: 130 }
]

// 基準日
const TODAY = new Date('2026-01-23')

// 日付から経過日数を計算
const calcDaysSince = (dateStr: string): number => {
  const date = new Date(dateStr)
  return Math.floor((TODAY.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

// テーブル用データを生成
export const tableRows: TableRow[] = baseData.map(item => {
  const daysSinceCreated = calcDaysSince(item.createdAt)
  const total = item.unitPrice
  return {
    id: item.id,
    name: item.name,
    transactionDate: item.createdAt,
    total
  }
})

// 日別データ - baseDataのcreatedAtからユニークな日付を抽出
const uniqueDailyDates = [...new Set(baseData.map(item => item.createdAt))].sort()
export const dailyLabels: string[] = uniqueDailyDates.map(date => {
  const d = new Date(date)
  return `${d.getMonth() + 1}/${d.getDate()}`
})

const calcDailyData = (): number[] => {
  return uniqueDailyDates.map((targetDate) => {
    // その日に登録された商品の単価を合計
    return baseData
      .filter(item => item.createdAt === targetDate)
      .reduce((sum, item) => sum + item.unitPrice, 0)
  })
}

export const dailyDatasets: ChartDataset[] = [
  {
    label: '売上',
    data: calcDailyData(),
    borderColor: 'rgb(99, 102, 241)',
    backgroundColor: 'rgba(99, 102, 241, 0.1)'
  }
]

// 週次データ - baseDataのcreatedAtから週の開始日を抽出
const getWeekStartDate = (date: Date): string => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // 月曜始まり
  d.setDate(diff)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

const weeklyMap = new Map<string, number>()
const weekOrder: string[] = []
baseData.forEach(item => {
  const weekStart = getWeekStartDate(new Date(item.createdAt))
  if (!weeklyMap.has(weekStart)) {
    weekOrder.push(weekStart)
  }
  weeklyMap.set(weekStart, (weeklyMap.get(weekStart) ?? 0) + item.unitPrice)
})

// 日付順にソート
export const weeklyLabels: string[] = weekOrder.sort((a, b) => {
  const [mA, dA] = a.split('/').map(Number)
  const [mB, dB] = b.split('/').map(Number)
  return mA !== mB ? (mA ?? 0) - (mB ?? 0) : (dA ?? 0) - (dB ?? 0)
})

const calcWeeklyData = (): number[] => {
  return weeklyLabels.map(week => weeklyMap.get(week) ?? 0)
}

export const weeklyDatasets: ChartDataset[] = [
  {
    label: '売上',
    data: calcWeeklyData(),
    borderColor: 'rgb(16, 185, 129)',
    backgroundColor: 'rgba(16, 185, 129, 0.1)'
  }
]

// 月次データ（過去12ヶ月）- 各月に登録された商品の単価を集計
export const monthlyLabels: string[] = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']

const calcMonthlyData = (): number[] => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  
  return months.map((month) => {
    const targetYear = month === 1 ? 2026 : 2025
    
    // その月に登録された商品の単価を合計
    const monthlyTotal = baseData
      .filter(item => {
        const createdDate = new Date(item.createdAt)
        return createdDate.getFullYear() === targetYear && createdDate.getMonth() + 1 === month
      })
      .reduce((sum, item) => sum + item.unitPrice, 0)
    
    return monthlyTotal
  })
}

export const monthlyDatasets: ChartDataset[] = [
  {
    label: '売上',
    data: calcMonthlyData(),
    borderColor: 'rgb(245, 158, 11)',
    backgroundColor: 'rgba(245, 158, 11, 0.1)'
  }
]

// バーチャート用 - baseDataの商品名と単価を使用
export const chartLabels: string[] = baseData.slice(0, 5).map(item => item.name)

export const chartDatasets: ChartDataset[] = [
  {
    label: '単価',
    data: baseData.slice(0, 5).map(item => item.unitPrice),
    backgroundColor: 'rgba(59, 130, 246, 0.5)',
    borderColor: 'rgb(59, 130, 246)',
    borderWidth: 1
  }
]

// Stats用データ - baseDataから計算
const totalSales = tableRows.reduce((sum, row) => sum + (row.total as number), 0)
const totalUnitPrice = baseData.reduce((sum, item) => sum + item.unitPrice, 0)
const avgUnitPrice = Math.round(totalUnitPrice / baseData.length)
const itemCount = baseData.length

export const stats = [
  { title: '総売上', value: `¥${totalSales.toLocaleString()}`, icon: '💰', trend: 12.5, color: 'blue' as const },
  { title: '平均単価', value: `¥${avgUnitPrice.toLocaleString()}`, icon: '📊', trend: 8.2, color: 'green' as const },
  { title: '件数', value: `${itemCount}`, icon: '📦', trend: -15.0, color: 'purple' as const },
]
