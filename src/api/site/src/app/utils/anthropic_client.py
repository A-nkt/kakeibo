from functools import lru_cache

import anthropic

from app.values import Const


@lru_cache(maxsize=1)
def get_anthropic_client() -> anthropic.AnthropicBedrock:
    """Amazon Bedrock 経由の Claude クライアント。認証は Lambda 実行ロールの IAM を使う"""
    # API Gateway の上限（29秒）に収まるよう、リトライは 1 回・タイムアウトは短めにする
    return anthropic.AnthropicBedrock(aws_region=Const.BEDROCK_REGION, timeout=25.0, max_retries=1)


def reset_anthropic_client() -> None:
    get_anthropic_client.cache_clear()
