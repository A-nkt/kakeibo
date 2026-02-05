#!/bin/bash
APP_BASE="$(git rev-parse --show-toplevel)"
. ${APP_BASE}/env/env.sh

Environment=$1
CategoryName=$(get_category_name)
AppName=$(get_app_name)
_PARAMS=("Environment=${Environment}" "CategoryName=${CategoryName}" "AppName=${AppName}")

check_and_set_env_region $1
deploy
