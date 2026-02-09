from decimal import Decimal
import json
from typing import Any

from aws_lambda_powertools.event_handler.api_gateway import Response


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
