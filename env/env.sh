#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_JSON="${SCRIPT_DIR}/env.json"

function get_category_name () {
    echo "$(basename $(dirname $(cd $(dirname $0); pwd)))"
}

function get_app_name () {
    echo "$(basename $(cd $(dirname $0); pwd))" | sed s/${Project}-//
}


function convert_env_str () {
    echo `jq -n -r ''$1' | if .'$2' then .'$2' else {} end | to_entries[] | .key + "=" + .value' | xargs -n2`
}

function add_env () {
    GENVS=`jq -c -n ''${GENVS}' * '$1''`
}

function init() {
    if [[ ! -f "$ENV_JSON" ]]; then
        echo "Error: env.json not found at $ENV_JSON" >&2
        return 1
    fi

    # env.jsonのExport以下を環境変数としてexport
    while IFS="=" read -r key value; do
        export "$key"="$value"
    done < <(jq -r '.Export | to_entries | .[] | "\(.key)=\(.value)"' "$ENV_JSON")
}

function check_and_set_env_region () {
    local _CATEGORY_NAME=`get_category_name`
    local _APP_NAME=`get_app_name`
	local _ENV=$1

	Profile=${ProfilePrefix}_${_ENV}
	StackName=${_ENV}-app-${_CATEGORY_NAME}-${_APP_NAME}-${Region}

}

function deploy () {
    sam deploy \
        --stack-name ${StackName} \
        --capabilities CAPABILITY_NAMED_IAM \
        --parameter-overrides ${_PARAMS[@]} \
        --region ${DeployRegion} \
        --profile ${Profile} \
        --s3-bucket ${Environment}-app-infra-store-bucket
}

init
