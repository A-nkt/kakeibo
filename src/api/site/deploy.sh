#!/bin/bash
APP_BASE="$(git rev-parse --show-toplevel)"
. ${APP_BASE}/env/env.sh

Environment=$1
CategoryName=$(get_category_name)
AppName=$(get_app_name)
_PARAMS=("Environment=${Environment}" "CategoryName=${CategoryName}" "AppName=${AppName}")
# Bedrock 予算アラートのメール通知先（任意）: BUDGET_ALERT_EMAIL=you@example.com ./deploy.sh dev
if [ -n "${BUDGET_ALERT_EMAIL}" ]; then
  _PARAMS+=("BudgetAlertEmail=${BUDGET_ALERT_EMAIL}")
fi

check_and_set_env_region $1

# anthropic SDK など requirements.txt の依存を Lambda (python3.13 / arm64) 向けにビルドする。
# ホストの python3.13 (brew install python@3.13) と pip を使い、Lambda 向け manylinux aarch64 の wheel を取得する。
# --use-container はビルドコンテナ内の pip が社内ネットワークの TLS 証明書を検証できず失敗するため使わない。
# ビルドに失敗したら古い成果物や未ビルドのソースでデプロイしないよう中断する
cd "$(dirname "$0")"
sam build || { echo "sam build failed; aborting deploy" >&2; exit 1; }
deploy
