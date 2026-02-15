# 設計ドキュメント

## 概要

AI家計簿アプリのランディングページ（LP）を、Vue.js + Tailwind CSSで実装する。このLPは、訪問者に対してプロダクトの価値を最大限に伝え、「完全無料」を最重要訴求ポイントとして、アカウント作成への誘導を行う。

既存のダッシュボードと一貫したデザイン（インディゴ→パープルのグラデーション、グラスモーフィズム効果）を維持しながら、Storysetのイラストを活用して親しみやすく魅力的なページを構築する。

## アーキテクチャ

### 全体構成

```
src/site/src/
├── views/
│   └── landing/               # LP専用ディレクトリ
│       ├── LandingPageView.vue    # メインのLPコンポーネント
│       ├── HeroSection.vue
│       ├── FeaturesSection.vue
│       ├── DifferentiationSection.vue
│       ├── HowItWorksSection.vue
│       ├── CtaSection.vue
│       └── FooterSection.vue
├── router/
│   └── index.ts               # ルーティング設定（更新）
└── composables/
    └── useScrollAnimation.ts  # スクロールアニメーション用composable
```

### ルーティング設計

```mermaid
flowchart TD
    A[訪問者] --> B{アクセスパス}
    B -->|/| C{認証状態}
    C -->|未認証| D[/lp へリダイレクト]
    C -->|認証済み| E[/dashboard へリダイレクト]
    B -->|/lp| F[LandingPageView.vue]
    B -->|/login| G[LoginView.vue]
    B -->|/dashboard| H{認証チェック}
    H -->|認証済み| I[DashboardView.vue]
    H -->|未認証| G
    F --> J{CTAクリック}
    J --> G
```

ルーティングの変更点:
- `/` へのアクセス時、未認証なら `/lp` へ、認証済みなら `/dashboard` へリダイレクト
- `/lp` は認証状態に関わらず常にLPを表示（ログイン済みでもダッシュボードにリダイレクトしない）
- 既存の `/login`、`/dashboard` のルーティングは維持

## コンポーネントとインターフェース

### LandingPageView.vue

メインのLPコンポーネント。各セクションコンポーネントを組み合わせて構成する。

```typescript
interface LandingPageProps {
  // プロパティなし（スタンドアロンページ）
}

interface LandingPageEmits {
  // イベントなし
}
```

### HeroSection.vue

ヒーローセクションコンポーネント。

```typescript
interface HeroSectionProps {
  // プロパティなし
}

interface HeroSectionEmits {
  (e: 'cta-click'): void
}
```

主要要素:
- 「完全無料」バッジ（パルスアニメーション付き）
- メインヘッドライン
- サブヘッドライン
- CTAボタン（「無料で始める」）
- アプリモックアップ画像
- Storysetイラスト

### FeaturesSection.vue

機能紹介セクションコンポーネント。

```typescript
interface Feature {
  icon: string
  title: string
  description: string
}

interface FeaturesSectionProps {
  features?: Feature[]
}
```

デフォルト機能:
1. 支出管理（変動費・固定費の管理）
2. 可視化機能（グラフによる分析）
3. 予算管理（「今日使える金額」表示）
4. AI機能（支出パターン分析・節約アドバイス）

### DifferentiationSection.vue

差別化ポイントセクションコンポーネント。

```typescript
interface CompetitorComparison {
  name: string
  price: string
  features: string[]
}

interface DifferentiationSectionProps {
  competitors?: CompetitorComparison[]
}
```

比較対象:
- マネーフォワード（有料プランあり）
- Zaim（有料プランあり）
- 本アプリ（完全無料）

### HowItWorksSection.vue

使い方セクションコンポーネント。

```typescript
interface Step {
  number: number
  title: string
  description: string
  keywords: string[]
  illustration: string
}

interface HowItWorksSectionProps {
  steps?: Step[]
}
```

3ステップ:
1. Googleアカウントで無料登録（ワンクリック、追加入力不要）
2. 支出を記録（カテゴリを選んで金額を入力するだけ）
3. AIが分析・アドバイス（自動で節約ポイントを提案）

### CtaSection.vue

CTAセクションコンポーネント。

```typescript
interface CtaSectionProps {
  message?: string
  buttonText?: string
}

interface CtaSectionEmits {
  (e: 'cta-click'): void
}
```

### FooterSection.vue

フッターセクションコンポーネント。

```typescript
interface FooterLink {
  label: string
  href: string
}

interface FooterSectionProps {
  links?: FooterLink[]
  copyrightYear?: number
}
```

### useScrollAnimation.ts

スクロールトリガーアニメーション用composable。

```typescript
interface UseScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
}

interface UseScrollAnimationReturn {
  elementRef: Ref<HTMLElement | null>
  isVisible: Ref<boolean>
}

function useScrollAnimation(
  options?: UseScrollAnimationOptions
): UseScrollAnimationReturn
```

## データモデル

### ルーティング設定

```typescript
// router/index.ts への変更

// インポート追加
import LandingPageView from '@/views/landing/LandingPageView.vue'

// ルート設定の変更
{
  path: '/',
  redirect: () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'
    return isLoggedIn ? '/dashboard' : '/lp'
  }
},
{
  path: '/lp',
  name: 'landing',
  component: LandingPageView,
  // 認証不要、ログイン済みでもLPを表示
}
```

### 機能データ

```typescript
const features: Feature[] = [
  {
    icon: '💰',
    title: '支出管理',
    description: '変動費・固定費を簡単に記録。カテゴリ分けで支出を整理。'
  },
  {
    icon: '📊',
    title: '可視化機能',
    description: 'グラフで支出パターンを一目で把握。日別・週別・月別で分析。'
  },
  {
    icon: '🎯',
    title: '予算管理',
    description: '「今日使える金額」を自動計算。予算オーバーを防止。'
  },
  {
    icon: '🤖',
    title: 'AI分析',
    description: '支出パターンを分析し、節約ポイントを自動提案。'
  }
]
```

### 競合比較データ

```typescript
const competitors: CompetitorComparison[] = [
  {
    name: 'マネーフォワード',
    price: '月額500円〜',
    features: ['銀行連携', 'カード連携', '資産管理']
  },
  {
    name: 'Zaim',
    price: '月額480円〜',
    features: ['レシート読取', '銀行連携', '予算管理']
  },
  {
    name: 'AI家計簿',
    price: '¥0（完全無料）',
    features: ['AI分析', '予算管理', '今日使える金額', 'シンプルUI']
  }
]
```

## 正確性プロパティ

*正確性プロパティとは、システムのすべての有効な実行において真であるべき特性や振る舞いのことです。これらは人間が読める仕様と機械で検証可能な正確性保証の橋渡しとなります。*

### Property 1: CTAボタン数の保証

*任意の* ランディングページにおいて、CTAボタン（ログイン/サインアップへの遷移ボタン）は少なくとも3つ存在すること。

**Validates: Requirements 6.1**

### Property 2: CTAボタンテキストの一貫性

*任意の* CTAボタンにおいて、そのテキストは「無料」または「Google」のキーワードを含むこと。

**Validates: Requirements 6.2**

### Property 3: 機能カード数の保証

*任意の* 機能紹介セクションにおいて、機能カードは少なくとも4つ存在すること。

**Validates: Requirements 3.1**

### Property 4: 差別化ポイント数の保証

*任意の* 差別化セクションにおいて、セールスポイントは少なくとも4つ存在すること。

**Validates: Requirements 4.1**

### Property 5: 無料訴求の配置数

*任意の* ランディングページにおいて、「無料」「¥0」「0円」などの無料訴求テキストは少なくとも5箇所に存在すること。

**Validates: Requirements 11.1**

### Property 6: 使い方ステップのキーワード

*任意の* 使い方ステップにおいて、「無料」「簡単」「自動」「ワンクリック」のいずれかのキーワードを含むこと。

**Validates: Requirements 5.4**

### Property 7: イラスト数の保証

*任意の* ランディングページにおいて、Storysetイラストは少なくとも5つ存在すること。

**Validates: Requirements 12.6**

### Property 8: 各セクションへのイラスト配置

*任意の* 主要セクション（ヒーロー、機能紹介、使い方、差別化）において、少なくとも1つのイラストが存在すること。

**Validates: Requirements 12.2**

## エラーハンドリング

### ルーティングエラー

- 存在しないパスへのアクセス: `/lp` へリダイレクト
- 認証が必要なページへの未認証アクセス: `/login` へリダイレクト

### 画像読み込みエラー

- Storysetイラストの読み込み失敗時: フォールバック画像またはプレースホルダーを表示
- 画像のalt属性を適切に設定してアクセシビリティを確保

### アニメーションエラー

- `prefers-reduced-motion` メディアクエリを尊重
- アニメーションが無効な環境でも機能的に問題なく表示

## テスト戦略

### ユニットテスト

Vitestを使用して以下をテスト:

1. 各コンポーネントの正常レンダリング
2. CTAボタンクリック時のイベント発火
3. ルーティング設定の正確性
4. useScrollAnimation composableの動作

### プロパティベーステスト

fast-checkを使用して以下のプロパティをテスト:

1. **Property 1**: CTAボタン数の保証
   - Tag: **Feature: landing-page, Property 1: CTAボタン数の保証**
   - 最小100回のイテレーション

2. **Property 2**: CTAボタンテキストの一貫性
   - Tag: **Feature: landing-page, Property 2: CTAボタンテキストの一貫性**
   - 最小100回のイテレーション

3. **Property 3**: 機能カード数の保証
   - Tag: **Feature: landing-page, Property 3: 機能カード数の保証**
   - 最小100回のイテレーション

4. **Property 4**: 差別化ポイント数の保証
   - Tag: **Feature: landing-page, Property 4: 差別化ポイント数の保証**
   - 最小100回のイテレーション

5. **Property 5**: 無料訴求の配置数
   - Tag: **Feature: landing-page, Property 5: 無料訴求の配置数**
   - 最小100回のイテレーション

6. **Property 6**: 使い方ステップのキーワード
   - Tag: **Feature: landing-page, Property 6: 使い方ステップのキーワード**
   - 最小100回のイテレーション

7. **Property 7**: イラスト数の保証
   - Tag: **Feature: landing-page, Property 7: イラスト数の保証**
   - 最小100回のイテレーション

8. **Property 8**: 各セクションへのイラスト配置
   - Tag: **Feature: landing-page, Property 8: 各セクションへのイラスト配置**
   - 最小100回のイテレーション

### E2Eテスト

Playwrightを使用して以下をテスト:

1. `/` から `/lp` へのリダイレクト
2. `/lp` への直接アクセス
3. CTAボタンクリックによるログインページへの遷移
4. レスポンシブデザインの確認（モバイル、タブレット、デスクトップ）
5. スクロールアニメーションの動作確認

### アクセシビリティテスト

- すべての画像にalt属性を設定
- キーボードナビゲーションの確認
- スクリーンリーダー対応の確認
- カラーコントラストの確認
