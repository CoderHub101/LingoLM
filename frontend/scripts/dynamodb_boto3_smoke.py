"""Seed BaseCards and UserCards with Boto3's low-level DynamoDB client.

Run only against DynamoDB Local:
  $env:DYNAMODB_ENDPOINT = 'http://127.0.0.1:8000'
  python scripts/dynamodb_boto3_smoke.py
"""

import copy
import os
import sys
import uuid
from datetime import datetime, timezone

import boto3
from botocore.exceptions import ClientError

ENDPOINT = os.environ.get("DYNAMODB_ENDPOINT", "")
if not ENDPOINT.startswith(("http://localhost", "http://127.0.0.1")):
    raise RuntimeError("Set DYNAMODB_ENDPOINT to DynamoDB Local (for example http://127.0.0.1:8000).")

BASE_TABLE = os.environ.get("BASE_CARDS_TABLE_NAME", "LingoLMBaseCardsBoto3Smoke")
USER_TABLE = os.environ.get("USER_CARDS_TABLE_NAME", "LingoLMUserCardsBoto3Smoke")
client = boto3.client("dynamodb", endpoint_url=ENDPOINT, region_name=os.environ.get("AWS_REGION", "us-east-1"), aws_access_key_id="local", aws_secret_access_key="local")

# This is equivalent to a successful word-lookup Lambda response's `card` field.
BASE_CARD = {
    "baseCardId": "zh#电脑#dian4-nao3",
    "language": "zh",
    "lemma": "电脑",
    "normalizedLemma": "电脑",
    "forms": {"simplified": "电脑", "traditional": "電腦", "variants": []},
    "romanization": {"system": "pinyin", "value": "diànnǎo"},
    "definitions": [
        {"id": "def_1", "text": "computer", "partOfSpeech": "noun"},
        {"id": "def_2", "text": "electronic brain; computer", "register": "informal"},
    ],
    "examples": [{"id": "ex_1", "source": "我买了一台新电脑。", "romanization": "Wǒ mǎi le yì tái xīn diànnǎo.", "translation": "I bought a new computer.", "definitionId": "def_1"}],
    "relatedWords": [{"id": "rel_1", "lemma": "笔记本电脑", "romanization": "bǐjìběn diànnǎo", "relation": "related"}],
    "collocations": [{"id": "col_1", "text": "用电脑工作", "romanization": "yòng diànnǎo gōngzuò", "translation": "work using a computer"}],
    "usageNotes": ["电脑 is the usual general term for a computer."],
    "metadata": {"schemaVersion": 1, "source": "cc-cedict", "sourceVersion": "2026-01-01"},
}


def av(value):
    """Explicitly turn JSON values into DynamoDB S/N/BOOL/M/L/NULL wrappers."""
    if value is None:
        return {"NULL": True}
    if isinstance(value, bool):
        return {"BOOL": value}
    if isinstance(value, str):
        return {"S": value}
    if isinstance(value, (int, float)):
        return {"N": str(value)}
    if isinstance(value, list):
        return {"L": [av(item) for item in value]}
    if isinstance(value, dict):
        return {"M": {key: av(item) for key, item in value.items() if item is not None}}
    raise TypeError(f"Unsupported DynamoDB value: {type(value).__name__}")


def item(payload):
    return {key: av(value) for key, value in payload.items() if value is not None}


def user_card_from_base(user_id, base_card, general_note=None):
    """The exact BaseCard -> UserCard mapping used by the save endpoint."""
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    return {
        "userId": user_id,
        "cardId": str(uuid.uuid4()),
        "baseRef": {
            "baseCardId": base_card["baseCardId"],
            "schemaVersion": base_card["metadata"]["schemaVersion"],
            "source": base_card["metadata"]["source"],
            "sourceVersion": base_card["metadata"].get("sourceVersion"),
        },
        "language": base_card["language"],
        "lemma": base_card["lemma"],
        "normalizedLemma": base_card["normalizedLemma"],
        "forms": copy.deepcopy(base_card.get("forms")),
        "romanization": copy.deepcopy(base_card.get("romanization")),
        "content": {
            "definitions": copy.deepcopy(base_card["definitions"]),
            "examples": copy.deepcopy(base_card["examples"]),
            "relatedWords": copy.deepcopy(base_card.get("relatedWords")),
            "collocations": copy.deepcopy(base_card.get("collocations")),
            "usageNotes": copy.deepcopy(base_card.get("usageNotes")),
        },
        "notes": {"general": general_note} if general_note else None,
        "revision": 1,
        "createdAt": now,
        "updatedAt": now,
    }


def ensure_table(name, key_schema):
    try:
        client.create_table(
            TableName=name,
            BillingMode="PAY_PER_REQUEST",
            AttributeDefinitions=[{"AttributeName": key["AttributeName"], "AttributeType": "S"} for key in key_schema],
            KeySchema=key_schema,
        )
        client.get_waiter("table_exists").wait(TableName=name, WaiterConfig={"Delay": 1, "MaxAttempts": 10})
    except client.exceptions.ResourceInUseException:
        pass


def main():
    ensure_table(BASE_TABLE, [{"AttributeName": "PK", "KeyType": "HASH"}])
    ensure_table(USER_TABLE, [{"AttributeName": "userId", "KeyType": "HASH"}, {"AttributeName": "cardId", "KeyType": "RANGE"}])

    client.put_item(TableName=BASE_TABLE, Item=item({"PK": f"BASECARD#{BASE_CARD['baseCardId']}", **BASE_CARD}))
    user_card = user_card_from_base("boto3-local-user", BASE_CARD, "Remember the measure word 台.")
    client.put_item(TableName=USER_TABLE, Item=item(user_card))

    raw = client.get_item(
        TableName=USER_TABLE,
        Key=item({"userId": user_card["userId"], "cardId": user_card["cardId"]}),
        ConsistentRead=True,
    )["Item"]
    assert raw["content"]["M"]["definitions"]["L"][0]["M"]["text"] == {"S": "computer"}
    assert raw["revision"] == {"N": "1"}
    print("PASS: inserted BaseCard and converted UserCard using Boto3 low-level AttributeValues.")
    print(f"UserCard key: {user_card['userId']} / {user_card['cardId']}")
    print("content is an M; content.definitions is an L; definition.text is an S.")


if __name__ == "__main__":
    try:
        main()
    except ClientError as error:
        print(error, file=sys.stderr)
        raise
