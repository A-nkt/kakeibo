from functools import lru_cache

import anthropic
import boto3

from app.values import Const


@lru_cache(maxsize=1)
def get_anthropic_api_key() -> str:
    """SSM Parameter Store から Anthropic API キーを取得する（コンテナ再利用時はキャッシュ）"""
    if not Const.ANTHROPIC_API_KEY_PARAMETER:
        raise RuntimeError('ANTHROPIC_API_KEY_PARAMETER is not configured')
    ssm = boto3.client('ssm')
    response = ssm.get_parameter(Name=Const.ANTHROPIC_API_KEY_PARAMETER, WithDecryption=True)
    return response['Parameter']['Value']


@lru_cache(maxsize=1)
def get_anthropic_client() -> anthropic.Anthropic:
    # API Gateway の上限（29秒）に収まるよう、リトライは 1 回・タイムアウトは短めにする
    return anthropic.Anthropic(api_key=get_anthropic_api_key(), timeout=25.0, max_retries=1)
