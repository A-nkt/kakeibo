"""レシート画像から支出項目を抽出する（Claude の画像認識 + Structured Outputs）"""
import json
from typing import Any

from aws_lambda_powertools.logging import Logger

from app.utils.anthropic_client import get_anthropic_client
from app.values import Const

logger = Logger(child=True)

ALLOWED_MEDIA_TYPES = ('image/jpeg', 'image/png', 'image/gif', 'image/webp')
# API Gateway の REST ペイロード上限は 10MB、Lambda は 6MB。base64 文字列で 5MB までに制限する
MAX_IMAGE_BASE64_LENGTH = 5 * 1024 * 1024

RECEIPT_SCHEMA: dict[str, Any] = {
    'type': 'object',
    'properties': {
        'is_receipt': {'type': 'boolean'},
        'store_name': {'type': ['string', 'null']},
        'purchased_date': {'type': ['string', 'null']},
        'total': {'type': ['integer', 'null']},
        'items': {
            'type': 'array',
            'items': {
                'type': 'object',
                'properties': {
                    'name': {'type': 'string'},
                    'price': {'type': 'integer'},
                    'category_id': {'type': ['string', 'null']},
                },
                'required': ['name', 'price', 'category_id'],
                'additionalProperties': False,
            },
        },
    },
    'required': ['is_receipt', 'store_name', 'purchased_date', 'total', 'items'],
    'additionalProperties': False,
}

SYSTEM_PROMPT = (
    '日本の家計簿アプリのレシート読み取り担当です。'
    '画像を読み取り、購入した品目と金額を抽出してください。\n'
    '- price は税込の日本円を整数で返す（小数・通貨記号なし）。割引行は対象の品目に反映する\n'
    '- 複数個購入の行は数量を掛けた合計金額にする\n'
    '- 小計・合計・お預かり・お釣り・ポイントの行は items に含めない\n'
    '- total はレシートの合計金額。読めなければ null\n'
    '- purchased_date は YYYY-MM-DD 形式。読めなければ null\n'
    '- category_id はユーザーのカテゴリ一覧から最も近いものの ID を選ぶ。適切なものがなければ null\n'
    '- レシートでない画像や判読不能な場合は is_receipt を false にして items を空にする'
)


def build_user_content(image_base64: str, media_type: str, categories: list[dict[str, Any]]) -> list[dict[str, Any]]:
    category_lines = '\n'.join(f"- id: {c['category_id']}, name: {c['name']}" for c in categories)
    text = 'ユーザーのカテゴリ一覧:\n' + (category_lines or '（カテゴリ未登録）') + '\n\nこのレシートを読み取ってください。'
    return [
        {'type': 'image', 'source': {'type': 'base64', 'media_type': media_type, 'data': image_base64}},
        {'type': 'text', 'text': text},
    ]


def normalize_result(data: dict[str, Any], categories: list[dict[str, Any]]) -> dict[str, Any]:
    """モデル出力を正規化する。存在しない category_id は None に落とし、金額は 0 以上にそろえる"""
    valid_ids = {c['category_id'] for c in categories}
    items = []
    for item in data.get('items', []):
        name = str(item.get('name', '')).strip()
        price = item.get('price')
        if not name or not isinstance(price, int) or price < 0:
            continue
        category_id = item.get('category_id')
        items.append({
            'name': name,
            'price': price,
            'category_id': category_id if category_id in valid_ids else None,
        })
    return {
        'is_receipt': bool(data.get('is_receipt', False)),
        'store_name': data.get('store_name'),
        'purchased_date': data.get('purchased_date'),
        'total': data.get('total') if isinstance(data.get('total'), int) else None,
        'items': items,
    }


def analyze_receipt(image_base64: str, media_type: str, categories: list[dict[str, Any]]) -> dict[str, Any]:
    client = get_anthropic_client()
    response = client.messages.create(
        model=Const.BEDROCK_MODEL_ID,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        messages=[{'role': 'user', 'content': build_user_content(image_base64, media_type, categories)}],
        # レシート読み取りは思考なしでも精度が変わらないため、低コスト・低レイテンシ優先で thinking は使わない
        output_config={'format': {'type': 'json_schema', 'schema': RECEIPT_SCHEMA}},
    )
    logger.info(
        'Receipt analyzed',
        extra={
            'model': response.model,
            'stop_reason': response.stop_reason,
            'input_tokens': response.usage.input_tokens,
            'output_tokens': response.usage.output_tokens,
        },
    )
    if response.stop_reason == 'refusal':
        raise ValueError('画像の解析が拒否されました')
    if response.stop_reason == 'max_tokens':
        raise ValueError('解析結果が長すぎます。品目の少ないレシートで試してください')

    text = next(block.text for block in response.content if block.type == 'text')
    return normalize_result(json.loads(text), categories)
