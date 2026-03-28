import { computed, type Ref, type ComputedRef } from 'vue'

interface Item {
  id: string
  customer_id: string
  item_id: string
  price: number
  created: number
  updated: number
  is_fixed?: boolean
  name?: string
  memo?: string
}

interface Category {
  category_id: string
  name: string
  customer_id: string
  created: number
  updated: number
}

interface AnalysisComment {
  priority: number
  text: string
}

function getMonthRange(year: number, month: number): { start: number; end: number } {
  const start = new Date(year, month, 1).getTime() / 1000
  const end = new Date(year, month + 1, 1).getTime() / 1000
  return { start, end }
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function formatYen(amount: number): string {
  return `\u00a5${Math.abs(Math.round(amount)).toLocaleString()}`
}

export function useExpenseAnalysis(
  items: Ref<Item[]>,
  categories: Ref<Category[]>,
  budget: Ref<number>,
): { comments: ComputedRef<string[]> } {
  const comments = computed(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()
    const today = now.getDate()
    const daysInMonth = getDaysInMonth(year, month)

    const thisMonth = getMonthRange(year, month)
    const lastMonth = getMonthRange(year, month - 1)
    const daysInLastMonth = getDaysInMonth(year, month - 1)

    const allItems = items.value

    // 変動費のみ（固定費を除外）
    const variableItems = allItems.filter((item) => !item.is_fixed)
    const fixedItems = allItems.filter((item) => item.is_fixed)

    // 今月の変動費
    const thisMonthItems = variableItems.filter(
      (item) => item.created >= thisMonth.start && item.created < thisMonth.end,
    )

    // 先月の変動費
    const lastMonthItems = variableItems.filter(
      (item) => item.created >= lastMonth.start && item.created < lastMonth.end,
    )

    // 先月の同時点までの変動費（日数ベースで比較）
    const lastMonthSamePointEnd = lastMonth.start + (today / daysInLastMonth) * (lastMonth.end - lastMonth.start)
    const lastMonthSamePointItems = lastMonthItems.filter(
      (item) => item.created < lastMonthSamePointEnd,
    )

    const thisMonthTotal = thisMonthItems.reduce((sum, item) => sum + item.price, 0)
    const lastMonthSamePointTotal = lastMonthSamePointItems.reduce(
      (sum, item) => sum + item.price,
      0,
    )

    // 固定費合計（今月分）
    const fixedCostTotal = fixedItems.reduce((sum, item) => sum + item.price, 0)

    // 予算から固定費を引いた変動費予算
    const variableBudget = Math.max(budget.value - fixedCostTotal, 0)

    // カテゴリ名のマップ
    const categoryNameMap = new Map<string, string>()
    for (const cat of categories.value) {
      categoryNameMap.set(cat.category_id, cat.name)
    }

    // カテゴリ別の今月・先月の集計
    const thisMonthByCategory = new Map<string, number>()
    for (const item of thisMonthItems) {
      thisMonthByCategory.set(item.id, (thisMonthByCategory.get(item.id) || 0) + item.price)
    }
    const lastMonthByCategory = new Map<string, number>()
    for (const item of lastMonthItems) {
      lastMonthByCategory.set(item.id, (lastMonthByCategory.get(item.id) || 0) + item.price)
    }

    const suggestions: AnalysisComment[] = []

    // ルール1: カテゴリ別前月比較
    for (const [categoryId, thisAmount] of thisMonthByCategory) {
      const lastAmount = lastMonthByCategory.get(categoryId) || 0
      if (lastAmount === 0) continue
      const increase = thisAmount - lastAmount
      const increaseRate = increase / lastAmount
      if (increaseRate >= 0.2 && increase > 1000) {
        const categoryName = categoryNameMap.get(categoryId) || 'その他'
        const percentText = Math.round(increaseRate * 100)
        suggestions.push({
          priority: 1,
          text: `${categoryName}が先月より${percentText}%増加しています（+${formatYen(increase)}）。支出を見直すと節約につながるかもしれません`,
        })
      }
    }

    // ルール2: 予算ペース
    if (variableBudget > 0) {
      const elapsedRatio = today / daysInMonth
      const spentRatio = thisMonthTotal / variableBudget
      if (spentRatio > elapsedRatio) {
        const elapsedPercent = Math.round(elapsedRatio * 100)
        const spentPercent = Math.round(spentRatio * 100)
        const remainingDays = daysInMonth - today
        const remainingBudget = Math.max(variableBudget - thisMonthTotal, 0)
        suggestions.push({
          priority: 2,
          text: `月の${elapsedPercent}%で予算の${spentPercent}%を消費しています。残り${remainingDays}日で${formatYen(remainingBudget)}に抑える必要があります`,
        })
      }
    }

    // ルール3: トップカテゴリ集中
    if (thisMonthTotal > 0) {
      let maxCategoryId = ''
      let maxAmount = 0
      for (const [categoryId, amount] of thisMonthByCategory) {
        if (amount > maxAmount) {
          maxAmount = amount
          maxCategoryId = categoryId
        }
      }
      const ratio = maxAmount / thisMonthTotal
      if (ratio >= 0.4) {
        const categoryName = categoryNameMap.get(maxCategoryId) || 'その他'
        const percent = Math.round(ratio * 100)
        suggestions.push({
          priority: 3,
          text: `今月の支出の${percent}%が「${categoryName}」です。見直す余地があるかもしれません`,
        })
      }
    }

    // ルール4: 前月比全体
    if (lastMonthSamePointTotal > 0) {
      const overRate = (thisMonthTotal - lastMonthSamePointTotal) / lastMonthSamePointTotal
      if (overRate > 0.05) {
        const percent = Math.round(overRate * 100)
        suggestions.push({
          priority: 4,
          text: `今月の支出ペースは先月同時期より${percent}%高めです`,
        })
      }
    }

    // ルール5: 節約チャンス
    if (variableBudget > 0) {
      const elapsedRatio = today / daysInMonth
      const spentRatio = thisMonthTotal / variableBudget
      if (spentRatio <= elapsedRatio && variableBudget > thisMonthTotal) {
        const surplus = variableBudget - thisMonthTotal
        suggestions.push({
          priority: 5,
          text: `今月は予算内で順調です！この調子で${formatYen(surplus)}の余裕があります`,
        })
      }
    }

    // 優先度順にソートして上位3件を返す
    suggestions.sort((a, b) => a.priority - b.priority)
    return suggestions.slice(0, 3).map((s) => s.text)
  })

  return { comments }
}
