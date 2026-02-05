#!/bin/bash
APP_BASE=`git rev-parse --show-toplevel`
. ${APP_BASE}/env/env.sh


if [ $# -lt 2 ]; then
  echo "Usage: <parameter-name> <parameter-value>"
  exit 1
fi

PARAM_NAME=$1
PARAM_VALUE=$2

aws ssm put-parameter \
  --name "$PARAM_NAME" \
  --value "$PARAM_VALUE" \
  --type String \
  --profile ${ProfilePrefix}_dev \
  --region ${Region}

echo "Parameter '$PARAM_NAME' registered successfully."
