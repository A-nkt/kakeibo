# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered expense management app (家計簿アプリ) focused on tracking specific spending categories (subscriptions, dining out) and providing AI-driven cost reduction suggestions. Japanese-language UI.

## Architecture

The project is a monorepo with two main components:

### Frontend (`src/site/`)

- **Framework**: Vue 3 (Composition API + `<script setup>`) + TypeScript + Vite
- **Node.js**: Requires `^20.19.0 || >=22.12.0`
- **State management**: Pinia (setup store pattern with `defineStore(() => {...})`)
  - Stores: `budget.ts`, `categories.ts`, `items.ts`, `counter.ts`
- **Styling**: Tailwind CSS v4 + PostCSS
- **Routing**: Vue Router with localStorage-based auth guards
- **Auth**: Amazon Cognito with Google OAuth (Hosted UI flow via authorization code)
- **Charts**: Chart.js via vue-chartjs
- **Path alias**: `@` maps to `src/site/src/`
- **Dev server port**: 3000
- **Base path**: `/` for local dev, `/kakeibo/` for GitHub Pages (auto-detected via `GITHUB_ACTIONS` env var)

### Backend (`src/api/site/`)

- **Runtime**: Python 3.13 on AWS Lambda (arm64)
- **Framework**: AWS Lambda Powertools `APIGatewayRestResolver` — all API routes in a single Lambda function (`lambda_function.py`)
- **Database**: DynamoDB (3 tables: item, category, customers) — all PAY_PER_REQUEST
- **IaC**: AWS SAM (`template.yaml` files) — each resource (API, DB tables, Cognito, S3) has its own SAM template with a `deploy.sh` script

### Infrastructure (`src/`)

- `src/db/` — DynamoDB table definitions (item, category, customers), each with SAM template
- `src/auth/cognito/` — Cognito User Pool with Google IdP
- `src/infra/store/` — S3 bucket for SAM deployment artifacts
- `src/infra/parameter/` — SSM Parameter Store setup script

### Environment & Deployment

- `env/env.json` + `env/env.sh` — shared environment config (AWS profile, region) sourced by all deploy scripts
- Frontend deploys to GitHub Pages via `.github/workflows/deploy-pages.yml` (triggered on push to main)
- Backend deploys via SAM CLI (`deploy.sh` scripts calling `sam deploy`)
- Environment tiers: `dev`, `stg`, `prd`
- AWS region: `ap-northeast-1`

## Common Commands

All frontend commands run from `src/site/`:

```bash
# Install dependencies
cd src/site && npm ci

# Development server (http://localhost:3000)
npm run dev

# Build (runs type-check + vite build in parallel)
npm run build

# Lint (runs oxlint, then eslint sequentially, both with --fix)
npm run lint

# Format (Prettier with experimental CLI)
npm run format

# Type check only
npm run type-check
```

Backend deployment (requires AWS credentials):

```bash
# Deploy API (pass environment: dev/stg/prd)
./src/api/site/deploy.sh dev

# Deploy DynamoDB tables
./src/db/item/deploy.sh dev
./src/db/category/deploy.sh dev
./src/db/customers/deploy.sh dev
```

## API Endpoints

All routes are defined in `src/api/site/src/app/lambda_function.py` and served through a single Lambda. Base path: `/api/v1/`

### Items
- `POST /item/regist` — register expense item
- `GET /item/list?customer_id=` — list items
- `PUT /item/update` — update item
- `DELETE /item/delete` — delete item

### Categories
- `POST /category/regist` — register category
- `GET /category/list?customer_id=` — list categories
- `PUT /category/update` — update category
- `DELETE /category/delete` — delete category

### Customer
- `POST /customer/budget/regist` — set budget
- `GET /customer/budget?customer_id=` — get budget

## Key Conventions

- Frontend env vars use `VITE_` prefix (see `src/site/.env.example`)
  - Required: `VITE_COGNITO_USER_POOL_ID`, `VITE_COGNITO_CLIENT_ID`, `VITE_COGNITO_DOMAIN`, `VITE_COGNITO_REDIRECT_URI`, `VITE_API_BASE_URL`
- `customer_id` is used as the partition key across all DynamoDB tables; derived from the authenticated user's email stored in localStorage
- SAM stack naming convention: `{env}-app-{category}-{app}-{region}`
- DynamoDB table naming: `{env}-app-{tablename}-table`
