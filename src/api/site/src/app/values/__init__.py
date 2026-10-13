from __future__ import annotations

import os


class ConstParameter:
    ITEM_TABLE_NAME = os.environ['ITEM_TABLE_NAME']
    CATEGORY_TABLE_NAME = os.environ['CATEGORY_TABLE_NAME']
    CUSTOMER_TABLE_NAME = os.environ['CUSTOMER_TABLE_NAME']
    # Amazon Bedrock 経由で Claude を呼ぶ。モデル ID は推論プロファイル形式（global. / jp. プレフィックス）
    BEDROCK_REGION = os.environ.get('BEDROCK_REGION', 'ap-northeast-1')
    BEDROCK_MODEL_ID = os.environ.get('BEDROCK_MODEL_ID', 'global.anthropic.claude-opus-4-6-v1')


Const = ConstParameter()
