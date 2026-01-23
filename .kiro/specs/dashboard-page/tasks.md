# 実装計画: ダッシュボードページ

## 概要

Vue 3 + TypeScript + Tailwind CSS + Chart.js を使用したダッシュボードページの実装計画です。依存パッケージのセットアップから始め、型定義、コンポーネント、サンプルデータの順に実装します。

## タスク

- [x] 1. 依存パッケージのセットアップ
  - [x] 1.1 Tailwind CSS のインストールと設定
    - `tailwindcss`, `postcss`, `autoprefixer` をインストール
    - `tailwind.config.js` を作成し、Vue ファイルをコンテンツパスに追加
    - `postcss.config.js` を作成
    - メインCSSファイルに Tailwind ディレクティブを追加
    - _Requirements: 6.1, 6.3_
  - [x] 1.2 Chart.js と vue-chartjs のインストール
    - `chart.js` と `vue-chartjs` をインストール
    - _Requirements: 6.2, 6.4_

- [x] 2. TypeScript 型定義の作成
  - [x] 2.1 ダッシュボード用の型定義ファイルを作成
    - `src/site/src/types/dashboard.ts` を作成
    - `TableColumn`, `TableRow`, `DataTableProps` インターフェースを定義
    - `ChartDataset`, `BarChartProps` インターフェースを定義
    - _Requirements: 5.3, 7.4_

- [x] 3. サンプルデータの作成
  - [x] 3.1 サンプルデータファイルを作成
    - `src/site/src/data/sampleData.ts` を作成
    - 3列のテーブルデータ（tableColumns, tableRows）を定義
    - バーチャート用データ（chartLabels, chartDatasets）を定義
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 4. DataTable コンポーネントの実装
  - [x] 4.1 DataTable コンポーネントを作成
    - `src/site/src/components/dashboard/DataTable.vue` を作成
    - props として columns と rows を受け入れる
    - Tailwind CSS でテーブルスタイリング（ホバーエフェクト含む）
    - 空状態のメッセージ表示を実装
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 4.3, 5.1, 5.4_
  - [ ]* 4.2 DataTable のプロパティテストを作成
    - **Property 1: テーブル列設定の検証**
    - **Validates: Requirements 2.1, 2.5**
  - [ ]* 4.3 DataTable のプロパティテストを作成
    - **Property 2: テーブル行データのレンダリング**
    - **Validates: Requirements 2.2**

- [-] 5. BarChart コンポーネントの実装
  - [x] 5.1 BarChart コンポーネントを作成
    - `src/site/src/components/dashboard/BarChart.vue` を作成
    - vue-chartjs の Bar コンポーネントを使用
    - Chart.js のスケール、要素、プラグインを登録
    - props として labels, datasets, title, showLegend を受け入れる
    - レスポンシブ設定を有効化
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 4.4, 5.2_
  - [ ]* 5.2 BarChart のユニットテストを作成
    - チャートがレンダリングされることを確認
    - 凡例と軸ラベルの表示を確認
    - _Requirements: 3.1, 3.5_

- [x] 6. チェックポイント - コンポーネントの動作確認
  - すべてのテストが通ることを確認し、質問があればユーザーに確認する

- [x] 7. DashboardView の実装
  - [x] 7.1 DashboardView を更新
    - `src/site/src/views/DashboardView.vue` を更新
    - DataTable と BarChart コンポーネントをインポート
    - サンプルデータをインポートして各コンポーネントに渡す
    - Tailwind CSS でレスポンシブグリッドレイアウトを実装
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 4.1, 4.2_
  - [ ]* 7.2 DashboardView のユニットテストを作成
    - DataTable と BarChart の両方がレンダリングされることを確認
    - レスポンシブグリッドクラスが適用されていることを確認
    - _Requirements: 1.1, 1.2_

- [x] 8. 最終チェックポイント - 全体の動作確認
  - すべてのテストが通ることを確認し、質問があればユーザーに確認する

## 備考

- `*` マークのタスクはオプションで、MVP を優先する場合はスキップ可能
- 各タスクは特定の要件を参照してトレーサビリティを確保
- チェックポイントで段階的な検証を実施
- プロパティテストは普遍的な正確性プロパティを検証
- ユニットテストは特定の例とエッジケースを検証
