import {
  DynamoDBClient,
  type AttributeValue,
} from '@aws-sdk/client-dynamodb'

/**
 * Converts application JSON to DynamoDB's low-level AttributeValue format.
 * Objects become M (map), arrays become L (list), strings become S, numbers
 * become N, and booleans become BOOL. Undefined object properties are omitted.
 */
export function toAttributeValue(value: unknown): AttributeValue {
  if (value === null) return { NULL: true }
  if (typeof value === 'string') return { S: value }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new TypeError('DynamoDB numbers must be finite')
    return { N: String(value) }
  }
  if (typeof value === 'boolean') return { BOOL: value }
  if (Array.isArray(value)) return { L: value.map(toAttributeValue) }
  if (typeof value === 'object') {
    const map: Record<string, AttributeValue> = {}
    for (const [key, entry] of Object.entries(value)) {
      if (entry !== undefined) map[key] = toAttributeValue(entry)
    }
    return { M: map }
  }
  throw new TypeError(`Unsupported DynamoDB value: ${typeof value}`)
}

export function toItem(value: object): Record<string, AttributeValue> {
  const item: Record<string, AttributeValue> = {}
  for (const [key, entry] of Object.entries(value)) {
    if (entry !== undefined) item[key] = toAttributeValue(entry)
  }
  return item
}

export function fromAttributeValue(value: AttributeValue): unknown {
  if (value.S !== undefined) return value.S
  if (value.N !== undefined) return Number(value.N)
  if (value.BOOL !== undefined) return value.BOOL
  if (value.NULL) return null
  if (value.L) return value.L.map(fromAttributeValue)
  if (value.M) return fromItem(value.M)
  if (value.SS) return value.SS
  if (value.NS) return value.NS.map(Number)
  throw new TypeError('Unsupported DynamoDB AttributeValue')
}

export function fromItem<T>(item: Record<string, AttributeValue>): T {
  return Object.fromEntries(Object.entries(item).map(([key, value]) => [key, fromAttributeValue(value)])) as T
}

let client: DynamoDBClient | undefined

export function getDynamoClient() {
  // The AWS SDK uses the standard AWS credential provider chain. This works
  // with local AWS profiles as well as deployed IAM roles without app changes.
  client ??= new DynamoDBClient({
    region: process.env.AWS_REGION || 'us-east-1',
    // DynamoDB Local is opt-in, so production continues to use AWS's endpoint.
    endpoint: process.env.DYNAMODB_ENDPOINT?.trim() || undefined,
  })
  return client
}
