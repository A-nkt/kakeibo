#!/bin/bash
set -e

if [ $# -lt 2 ]; then
  echo "Usage: $0 <parameter-name> <parameter-value>"
  echo "Example: $0 /app/google/client-id your-client-id"
  exit 1
fi

PARAM_NAME=$1
PARAM_VALUE=$2

aws ssm put-parameter \
  --name "$PARAM_NAME" \
  --value "$PARAM_VALUE" \
  --type SecureString

echo "Parameter '$PARAM_NAME' registered successfully."
