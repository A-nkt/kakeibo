import json
import os
import uuid
from decimal import Decimal
from typing import Any
from datetime import datetime

import boto3
from botocore.exceptions import ClientError
from aws_lambda_powertools.event_handler import CORSConfig
from aws_lambda_powertools.event_handler.api_gateway import (
    APIGatewayRestResolver,
    Response,
)
from aws_lambda_powertools.logging import Logger
from aws_lambda_powertools.logging.correlation_paths import API_GATEWAY_REST
from aws_lambda_powertools.utilities.typing import LambdaContext

logger = Logger()
app = APIGatewayRestResolver(
    cors=CORSConfig(
        allow_origin='*',
        allow_headers=['Content-Type'],
        max_age=300
    ),
)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])


def decimal_default_proc(obj: Any):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError


def response_result(result: Any = None) -> Response[str]:
    body = json.dumps(
        {'result': result},
        ensure_ascii=False,
        default=decimal_default_proc,
        separators=(',', ':')
    )
    return Response(
        status_code=200,
        content_type='application/json',
        body=body,
    )


def response_error(status_code: int, message: str) -> Response[str]:
    body = json.dumps({'message': message}, ensure_ascii=False)
    return Response(
        status_code=status_code,
        content_type='application/json',
        body=body,
    )


# --------------------------------------------------------------------------------------------------
# Router
# --------------------------------------------------------------------------------------------------
@app.post('/api/v1/item/regist')
def post_item() -> Response[str]:
    try:
        body = app.current_event.json_body
        logger.info('POST request received', extra={'request_body': body})

        # バリデーション
        required_fields = ['customer_id', 'id', 'price']
        for field in required_fields:
            if field not in body:
                logger.warning('Missing required field', extra={'field': field})
                return response_error(400, f'Missing required field: {field}')

        # item_id生成、タイムスタンプ付与
        now = int(datetime.utcnow().timestamp())
        item = {
            'customer_id': body['customer_id'],
            'item_id': str(uuid.uuid4()),
            'id': body['id'],
            'price': body['price'],
            'created': now,
            'updated': now,
        }

        table.put_item(Item=item)
        logger.info('Item registered successfully', extra={'item_id': item['item_id']})
        return response_result(result={'item_id': item['item_id']})

    except json.JSONDecodeError as e:
        logger.error('JSON decode error', extra={'error': str(e)})
        return response_error(400, 'Invalid JSON')
    except ClientError as e:
        logger.error('DynamoDB error', extra={'error': str(e)})
        return response_error(502, 'Database error')
    except Exception as e:
        logger.error('Internal server error', extra={'error': str(e)})
        return response_error(500, 'Internal server error')


@app.get('/api/v1/item/list')
def get_items() -> Response[str]:
    try:
        customer_id = app.current_event.get_query_string_value('customer_id')
        logger.info('GET list request received', extra={'customer_id': customer_id})

        if not customer_id:
            return response_error(400, 'Missing required parameter: customer_id')

        response = table.query(
            KeyConditionExpression='customer_id = :cid',
            ExpressionAttributeValues={':cid': customer_id}
        )

        items = response.get('Items', [])
        logger.info('Items retrieved successfully', extra={'count': len(items)})
        return response_result(result=items)

    except ClientError as e:
        logger.error('DynamoDB error', extra={'error': str(e)})
        return response_error(502, 'Database error')
    except Exception as e:
        logger.error('Internal server error', extra={'error': str(e)})
        return response_error(500, 'Internal server error')


# --------------------------------------------------------------------------------------------------
# Handler
# --------------------------------------------------------------------------------------------------
@logger.inject_lambda_context(correlation_id_path=API_GATEWAY_REST, clear_state=True)
def lambda_handler(event: dict[str, Any], context: LambdaContext) -> dict[str, Any]:
    return app.resolve(event, context)
