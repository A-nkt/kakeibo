import json
import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from botocore.exceptions import ClientError

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

os.environ['ITEM_TABLE_NAME'] = 'test-item-table'
os.environ['CATEGORY_TABLE_NAME'] = 'test-category-table'
os.environ['CUSTOMER_TABLE_NAME'] = 'test-customer-table'
os.environ['POWERTOOLS_LOG_LEVEL'] = 'CRITICAL'

from app.lambda_function import lambda_handler


def build_apigw_event(
    http_method: str,
    path: str,
    body: dict | None = None,
    query_params: dict[str, str] | None = None,
) -> dict:
    return {
        'httpMethod': http_method,
        'path': path,
        'headers': {'Content-Type': 'application/json'},
        'queryStringParameters': query_params or {},
        'pathParameters': None,
        'stageVariables': None,
        'body': json.dumps(body) if body else None,
        'isBase64Encoded': False,
        'requestContext': {
            'accountId': '123456789012',
            'resourceId': 'test',
            'stage': 'test',
            'requestId': 'test-request-id',
            'identity': {'sourceIp': '127.0.0.1'},
            'resourcePath': path,
            'httpMethod': http_method,
        },
        'resource': path,
    }


@pytest.fixture()
def context():
    ctx = MagicMock()
    ctx.function_name = 'test-function'
    ctx.memory_limit_in_mb = 128
    ctx.invoked_function_arn = 'arn:aws:lambda:ap-northeast-1:123456789012:function:test'
    ctx.aws_request_id = 'test-request-id'
    return ctx


# --------------------------------------------------------------------------------------------------
# Item API
# --------------------------------------------------------------------------------------------------
@patch('app.lambda_function.table')
def test_post_item_success(mock_table, context):
    mock_table.put_item.return_value = {}

    event = build_apigw_event(
        'POST',
        '/api/v1/item/regist',
        body={'customer_id': 'cust-1', 'id': 'cat-1', 'price': 1000},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'item_id' in body['result']
    mock_table.put_item.assert_called_once()


@patch('app.lambda_function.table')
def test_post_item_with_memo(mock_table, context):
    mock_table.put_item.return_value = {}

    event = build_apigw_event(
        'POST',
        '/api/v1/item/regist',
        body={'customer_id': 'cust-1', 'id': 'cat-1', 'price': 1000, 'memo': 'ランチ代'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'item_id' in body['result']
    mock_table.put_item.assert_called_once()
    put_item_args = mock_table.put_item.call_args
    assert put_item_args[1]['Item']['memo'] == 'ランチ代'


@patch('app.lambda_function.table')
def test_get_items_success(mock_table, context):
    mock_table.query.return_value = {
        'Items': [
            {'customer_id': 'cust-1', 'item_id': 'item-1', 'id': 'cat-1', 'price': 500}
        ]
    }

    event = build_apigw_event(
        'GET',
        '/api/v1/item/list',
        query_params={'customer_id': 'cust-1'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body['result']) == 1
    assert body['result'][0]['price'] == 500


@patch('app.lambda_function.table')
def test_update_item_success(mock_table, context):
    mock_table.update_item.return_value = {}

    event = build_apigw_event(
        'PUT',
        '/api/v1/item/update',
        body={'customer_id': 'cust-1', 'item_id': 'item-1', 'price': 2000},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['result']['updated'] is True
    mock_table.update_item.assert_called_once()


@patch('app.lambda_function.table')
def test_update_item_with_memo(mock_table, context):
    mock_table.update_item.return_value = {}

    event = build_apigw_event(
        'PUT',
        '/api/v1/item/update',
        body={'customer_id': 'cust-1', 'item_id': 'item-1', 'price': 2000, 'memo': 'ディナー代'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['result']['updated'] is True
    update_args = mock_table.update_item.call_args
    assert ':memo' in update_args[1]['ExpressionAttributeValues']
    assert update_args[1]['ExpressionAttributeValues'][':memo'] == 'ディナー代'
    assert 'memo = :memo' in update_args[1]['UpdateExpression']


@patch('app.lambda_function.table')
def test_delete_item_success(mock_table, context):
    mock_table.delete_item.return_value = {}

    event = build_apigw_event(
        'DELETE',
        '/api/v1/item/delete',
        query_params={'customer_id': 'cust-1', 'item_id': 'item-1'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['result']['deleted'] is True
    mock_table.delete_item.assert_called_once()


# --------------------------------------------------------------------------------------------------
# Receipt Analyze API
# --------------------------------------------------------------------------------------------------
RECEIPT_CATEGORIES = [
    {'customer_id': 'cust-1', 'category_id': 'cat-food', 'name': '食費'},
    {'customer_id': 'cust-1', 'category_id': 'cat-daily', 'name': '日用品'},
]


@patch('app.lambda_function.analyze_receipt')
@patch('app.lambda_function.category_table')
def test_analyze_receipt_success(mock_category_table, mock_analyze, context):
    mock_category_table.query.return_value = {'Items': RECEIPT_CATEGORIES}
    mock_analyze.return_value = {
        'is_receipt': True,
        'store_name': 'テストマート',
        'purchased_date': '2026-10-13',
        'total': 1500,
        'items': [{'name': '牛乳', 'price': 250, 'category_id': 'cat-food'}],
    }

    event = build_apigw_event(
        'POST',
        '/api/v1/item/analyze-receipt',
        body={'customer_id': 'cust-1', 'image': 'aGVsbG8=', 'media_type': 'image/jpeg'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['result']['items'][0]['name'] == '牛乳'
    mock_analyze.assert_called_once_with('aGVsbG8=', 'image/jpeg', RECEIPT_CATEGORIES)


@pytest.mark.parametrize(
    'body, expected_status',
    [
        ({'customer_id': 'cust-1', 'image': 'aGVsbG8='}, 400),
        ({'customer_id': 'cust-1', 'image': 'aGVsbG8=', 'media_type': 'application/pdf'}, 400),
        ({'customer_id': 'cust-1', 'image': '', 'media_type': 'image/png'}, 400),
        ({'customer_id': 'cust-1', 'image': 'a' * (5 * 1024 * 1024 + 1), 'media_type': 'image/png'}, 413),
    ],
)
@patch('app.lambda_function.analyze_receipt')
@patch('app.lambda_function.category_table')
def test_analyze_receipt_invalid_request(mock_category_table, mock_analyze, context, body, expected_status):
    event = build_apigw_event('POST', '/api/v1/item/analyze-receipt', body=body)
    response = lambda_handler(event, context)

    assert response['statusCode'] == expected_status
    mock_analyze.assert_not_called()


@patch('app.lambda_function.analyze_receipt', side_effect=ValueError('画像の解析が拒否されました'))
@patch('app.lambda_function.category_table')
def test_analyze_receipt_rejected(mock_category_table, mock_analyze, context):
    mock_category_table.query.return_value = {'Items': []}

    event = build_apigw_event(
        'POST',
        '/api/v1/item/analyze-receipt',
        body={'customer_id': 'cust-1', 'image': 'aGVsbG8=', 'media_type': 'image/jpeg'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 422
    assert json.loads(response['body'])['message'] == '画像の解析が拒否されました'


@pytest.mark.parametrize('error_name, status', [('PermissionDeniedError', 403), ('NotFoundError', 404)])
@patch('app.lambda_function.analyze_receipt')
@patch('app.lambda_function.category_table')
def test_analyze_receipt_model_access_denied(mock_category_table, mock_analyze, context, error_name, status):
    import anthropic
    import httpx2 as httpx

    mock_category_table.query.return_value = {'Items': []}
    mock_analyze.side_effect = getattr(anthropic, error_name)(
        'model not available',
        response=httpx.Response(status, request=httpx.Request('POST', 'https://bedrock-runtime.ap-northeast-1.amazonaws.com')),
        body=None,
    )

    event = build_apigw_event(
        'POST',
        '/api/v1/item/analyze-receipt',
        body={'customer_id': 'cust-1', 'image': 'aGVsbG8=', 'media_type': 'image/jpeg'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 503


def test_normalize_result_drops_invalid_items_and_unknown_category():
    from app.receipt import normalize_result

    raw = {
        'is_receipt': True,
        'store_name': 'テストマート',
        'purchased_date': None,
        'total': 'unknown',
        'items': [
            {'name': '牛乳', 'price': 250, 'category_id': 'cat-food'},
            {'name': 'パン', 'price': 180, 'category_id': 'cat-missing'},
            {'name': '', 'price': 100, 'category_id': None},
            {'name': '値引き', 'price': -50, 'category_id': None},
            {'name': '小数', 'price': 12.5, 'category_id': None},
        ],
    }
    result = normalize_result(raw, RECEIPT_CATEGORIES)

    assert result['total'] is None
    assert result['items'] == [
        {'name': '牛乳', 'price': 250, 'category_id': 'cat-food'},
        {'name': 'パン', 'price': 180, 'category_id': None},
    ]


def _build_claude_response(text: str, stop_reason: str = 'end_turn'):
    block = MagicMock()
    block.type = 'text'
    block.text = text
    response = MagicMock()
    response.content = [block]
    response.stop_reason = stop_reason
    response.model = 'global.anthropic.claude-opus-4-6-v1'
    response.usage.input_tokens = 10
    response.usage.output_tokens = 5
    return response


@patch('app.receipt.get_anthropic_client')
def test_analyze_receipt_parses_structured_output(mock_get_client):
    from app.receipt import analyze_receipt

    payload = {
        'is_receipt': True,
        'store_name': 'テストマート',
        'purchased_date': '2026-10-13',
        'total': 430,
        'items': [
            {'name': '牛乳', 'price': 250, 'category_id': 'cat-food'},
            {'name': '洗剤', 'price': 180, 'category_id': 'cat-daily'},
        ],
    }
    mock_client = mock_get_client.return_value
    mock_client.messages.create.return_value = _build_claude_response(json.dumps(payload))

    result = analyze_receipt('aGVsbG8=', 'image/jpeg', RECEIPT_CATEGORIES)

    assert result == payload
    kwargs = mock_client.messages.create.call_args.kwargs
    content = kwargs['messages'][0]['content']
    assert content[0]['source'] == {'type': 'base64', 'media_type': 'image/jpeg', 'data': 'aGVsbG8='}
    assert '食費' in content[1]['text']
    assert kwargs['output_config']['format']['type'] == 'json_schema'


@patch('app.receipt.get_anthropic_client')
def test_analyze_receipt_refusal_raises(mock_get_client):
    from app.receipt import analyze_receipt

    mock_client = mock_get_client.return_value
    mock_client.messages.create.return_value = _build_claude_response('', stop_reason='refusal')

    with pytest.raises(ValueError):
        analyze_receipt('aGVsbG8=', 'image/jpeg', RECEIPT_CATEGORIES)


# --------------------------------------------------------------------------------------------------
# Category API
# --------------------------------------------------------------------------------------------------
@patch('app.lambda_function.category_table')
def test_post_category_success(mock_table, context):
    mock_table.put_item.return_value = {}

    event = build_apigw_event(
        'POST',
        '/api/v1/category/regist',
        body={'customer_id': 'cust-1', 'name': '食費'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert 'category_id' in body['result']
    mock_table.put_item.assert_called_once()


@patch('app.lambda_function.category_table')
def test_get_categories_success(mock_table, context):
    mock_table.query.return_value = {
        'Items': [
            {'customer_id': 'cust-1', 'category_id': 'cat-1', 'name': '食費'}
        ]
    }

    event = build_apigw_event(
        'GET',
        '/api/v1/category/list',
        query_params={'customer_id': 'cust-1'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert len(body['result']) == 1
    assert body['result'][0]['name'] == '食費'


@patch('app.lambda_function.category_table')
def test_delete_category_success(mock_table, context):
    mock_table.delete_item.return_value = {}

    event = build_apigw_event(
        'DELETE',
        '/api/v1/category/delete',
        query_params={'customer_id': 'cust-1', 'category_id': 'cat-1'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['result']['deleted'] is True
    mock_table.delete_item.assert_called_once()


@patch('app.lambda_function.category_table')
def test_update_category_success(mock_table, context):
    mock_table.update_item.return_value = {}

    event = build_apigw_event(
        'PUT',
        '/api/v1/category/update',
        body={'customer_id': 'cust-1', 'category_id': 'cat-1', 'name': '交通費'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['result']['updated'] is True
    mock_table.update_item.assert_called_once()


@patch('app.lambda_function.category_table')
def test_reorder_categories_success(mock_table, context):
    mock_table.update_item.return_value = {}

    event = build_apigw_event(
        'PUT',
        '/api/v1/category/reorder',
        body={'customer_id': 'cust-1', 'category_ids': ['cat-3', 'cat-1', 'cat-2']},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['result']['updated'] is True
    calls = mock_table.update_item.call_args_list
    assert [c.kwargs['Key']['category_id'] for c in calls] == ['cat-3', 'cat-1', 'cat-2']
    assert [c.kwargs['ExpressionAttributeValues'][':sort_order'] for c in calls] == [0, 1, 2]


@patch('app.lambda_function.category_table')
def test_reorder_categories_skips_deleted_category(mock_table, context):
    conditional_error = ClientError(
        {'Error': {'Code': 'ConditionalCheckFailedException', 'Message': 'not found'}},
        'UpdateItem',
    )
    mock_table.update_item.side_effect = [{}, conditional_error, {}]

    event = build_apigw_event(
        'PUT',
        '/api/v1/category/reorder',
        body={'customer_id': 'cust-1', 'category_ids': ['cat-1', 'cat-deleted', 'cat-2']},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    assert mock_table.update_item.call_count == 3


@patch('app.lambda_function.category_table')
def test_reorder_categories_database_error(mock_table, context):
    mock_table.update_item.side_effect = ClientError(
        {'Error': {'Code': 'ProvisionedThroughputExceededException', 'Message': 'throttled'}},
        'UpdateItem',
    )

    event = build_apigw_event(
        'PUT',
        '/api/v1/category/reorder',
        body={'customer_id': 'cust-1', 'category_ids': ['cat-1', 'cat-2']},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 502


@pytest.mark.parametrize(
    'body',
    [
        {'customer_id': 'cust-1'},
        {'customer_id': 'cust-1', 'category_ids': 'cat-1'},
        {'customer_id': 'cust-1', 'category_ids': ['cat-1', 1]},
        {'customer_id': 'cust-1', 'category_ids': ['cat-1', 'cat-1']},
    ],
)
@patch('app.lambda_function.category_table')
def test_reorder_categories_invalid_request(mock_table, context, body):
    event = build_apigw_event('PUT', '/api/v1/category/reorder', body=body)
    response = lambda_handler(event, context)

    assert response['statusCode'] == 400
    mock_table.update_item.assert_not_called()


# --------------------------------------------------------------------------------------------------
# Customer Budget API
# --------------------------------------------------------------------------------------------------
@patch('app.lambda_function.customer_table')
def test_post_budget_success(mock_table, context):
    mock_table.update_item.return_value = {}

    event = build_apigw_event(
        'POST',
        '/api/v1/customer/budget/regist',
        body={'customer_id': 'cust-1', 'budget': 50000},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['result']['registered'] is True
    mock_table.update_item.assert_called_once()


@patch('app.lambda_function.customer_table')
def test_get_budget_success(mock_table, context):
    mock_table.get_item.return_value = {
        'Item': {'customer_id': 'cust-1', 'budget': 50000}
    }

    event = build_apigw_event(
        'GET',
        '/api/v1/customer/budget',
        query_params={'customer_id': 'cust-1'},
    )
    response = lambda_handler(event, context)

    assert response['statusCode'] == 200
    body = json.loads(response['body'])
    assert body['result']['budget'] == 50000
