from __future__ import annotations

import os


class ConstParameter:
    ITEM_TABLE_NAME = os.environ['ITEM_TABLE_NAME']
    CATEGORY_TABLE_NAME = os.environ['CATEGORY_TABLE_NAME']
    CUSTOMER_TABLE_NAME = os.environ['CUSTOMER_TABLE_NAME']


Const = ConstParameter()
