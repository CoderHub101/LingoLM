# DynamoDB local smoke test

This test requires neither the word lookup Lambda nor AWS credentials. It creates two local tables, writes a typed `BaseCard` as the lookup Lambda would, saves a `UserCard`, prints DynamoDB's wrapped attributes, and resets the card.

Start DynamoDB Local with Docker:

```powershell
docker run --rm -p 8000:8000 amazon/dynamodb-local
```

In a second terminal:

```powershell
cd frontend
$env:DYNAMODB_ENDPOINT = 'http://localhost:8000'
npm run dynamodb:smoke
```

The sample Lambda-shaped response is in `frontend/lib/test-data/example-base-card.ts`. A real lookup Lambda must return the same `BaseCard` contract, wrapped as `{ "card": baseCard }`; the frontend and save endpoint use that type directly.

The smoke-test output shows `S`, `N`, `M`, and `L` wrappers. For example, `content` is an `M`, `definitions` is an `L`, and each definition's `id` and `text` are `S` values.

## Boto3 direct insertion

With DynamoDB Local still running, install Boto3 once and run the independent Python test:

```powershell
cd frontend
py -3.12 -m pip install boto3
$env:DYNAMODB_ENDPOINT = 'http://127.0.0.1:8000'
py -3.12 scripts/dynamodb_boto3_smoke.py
```

This uses Boto3's low-level `put_item` API and explicitly produces DynamoDB `AttributeValue` wrappers instead of relying on Boto3's higher-level resource serializer.
