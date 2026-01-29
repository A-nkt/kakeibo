#!/bin/bash
APP_BASE="$(git rev-parse --show-toplevel)"
. ${APP_BASE}/env/env.sh

Environment=$1
_PARAMS=(
	"Environment=${Environment}"
	"DomainPrefix=${Environment}-app-auth-cognito"
)

check_and_set_env_region $1
deploy