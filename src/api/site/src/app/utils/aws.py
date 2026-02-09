import boto3


def get_aws_boto3_resource():
    return boto3.resource('dynamodb')
