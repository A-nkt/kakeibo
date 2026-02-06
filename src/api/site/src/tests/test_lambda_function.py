import json
import os
import sys
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

os.environ['TABLE_NAME'] = 'test-item-table'
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
