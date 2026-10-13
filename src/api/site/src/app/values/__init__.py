from __future__ import annotations

import os


class ConstParameter:
    ITEM_TABLE_NAME = os.environ['ITEM_TABLE_NAME']
    CATEGORY_TABLE_NAME = os.environ['CATEGORY_TABLE_NAME']
    CUSTOMER_TABLE_NAME = os.environ['CUSTOMER_TABLE_NAME']
    # Anthropic API キーを格納した SSM パラメータ名（SecureString 推奨）
    ANTHROPIC_API_KEY_PARAMETER = os.environ.get('ANTHROPIC_API_KEY_PARAMETER', '')
    ANTHROPIC_MODEL = os.environ.get('ANTHROPIC_MODEL', 'claude-opus-5-5')


Const = ConstParameter()
