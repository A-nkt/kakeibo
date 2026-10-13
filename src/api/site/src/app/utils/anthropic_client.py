from functools import lru_cache

import anthropic
import boto3
from botocore.exceptions import ClientError

from app.values import Const


@lru_cache(maxsize=1)
def get_anthropic_api_key() -> str:
    """SSM Parameter Store から Anthropic API キーを取得する（コンテナ再利用時はキャッシュ）"""
    if not Const.ANTHROPIC_API_KEY_PARAMETER:
        raise RuntimeError('ANTHROPIC_API_KEY_PARAMETER is not configured')
    ssm = boto3.client('ssm')
    try:
        response = ssm.get_parameter(Name=Const.ANTHROPIC_API_KEY_PARAMETER, WithDecryption=True)
    except ClientError as e:
        if e.response['Error']['Code'] == 'ParameterNotFound':
            raise RuntimeError(f'SSM parameter not found: {Const.ANTHROPIC_API_KEY_PARAMETER}') from e
        raise
    return response['Parameter']['Value']


@lru_cache(maxsize=1)
def get_anthropic_client() -> anthropic.Anthropic:
    # API Gateway の上限（29秒）に収まるよう、リトライは 1 回・タイムアウトは短めにする
    return anthropic.Anthropic(api_key=get_anthropic_api_key(), timeout=25.0, max_retries=1)


def reset_anthropic_client() -> None:
    """SSM のキーを差し替えた後に古いキーを使い続けないよう、キャッシュを破棄する"""
    get_anthropic_client.cache_clear()
    get_anthropic_api_key.cache_clear()
