import {
  CreateTableCommand,
  GetItemCommand,
  PutItemCommand,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb'
import { exampleBaseCard } from '@/lib/test-data/example-base-card'
import { getDynamoClient, toItem } from '@/lib/server/dynamodb'
import { resetUserCard, saveUserCard } from '@/lib/server/user-cards'

const endpoint = process.env.DYNAMODB_ENDPOINT || ''
if (!/^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(endpoint)) {
  throw new Error('For safety, set DYNAMODB_ENDPOINT to a local DynamoDB endpoint, e.g. http://localhost:8000.')
}

process.env.AWS_REGION ||= 'us-east-1'
process.env.USER_CARDS_TABLE_NAME ||= 'LingoLMUserCardsSmoke'
process.env.BASE_CARDS_TABLE_NAME ||= 'LingoLMBaseCardsSmoke'

const client = getDynamoClient()

async function ensureTable(name: string, keySchema: { AttributeName: string; KeyType: 'HASH' | 'RANGE' }[]) {
  try {
    await client.send(new CreateTableCommand({
      TableName: name,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: keySchema.map(({ AttributeName }) => ({ AttributeName, AttributeType: 'S' })),
      KeySchema: keySchema,
    }))
    await waitUntilTableExists(
      { client, maxWaitTime: 10, minDelay: 1, maxDelay: 2 },
      { TableName: name }
    )
  } catch (error) {
    if ((error as { name?: string }).name !== 'ResourceInUseException') throw error
  }
}

async function main() {
  const userTable = process.env.USER_CARDS_TABLE_NAME!
  const baseTable = process.env.BASE_CARDS_TABLE_NAME!
  await ensureTable(baseTable, [{ AttributeName: 'PK', KeyType: 'HASH' }])
  await ensureTable(userTable, [
    { AttributeName: 'userId', KeyType: 'HASH' },
    { AttributeName: 'cardId', KeyType: 'RANGE' },
  ])

  // This is what the lookup Lambda would have returned and persisted in BaseCards.
  await client.send(new PutItemCommand({
    TableName: baseTable,
    Item: toItem({ PK: `BASECARD#${exampleBaseCard.baseCardId}`, ...exampleBaseCard }),
  }))

  const saved = await saveUserCard('local-test-user', exampleBaseCard, 'Remember the measure word 台.')
  const raw = await client.send(new GetItemCommand({
    TableName: userTable,
    Key: toItem({ userId: saved.userId, cardId: saved.cardId }),
  }))
  console.log('Saved UserCards item uses wrappers:', JSON.stringify(raw.Item, null, 2))

  // Simulate user drift, then prove reset replaces only editable content.
  saved.content.definitions[0].text = 'incorrect meaning'
  await client.send(new PutItemCommand({ TableName: userTable, Item: toItem(saved) }))
  const reset = await resetUserCard(saved.userId, saved.cardId)
  if (!reset || reset.content.definitions[0].text !== 'computer' || reset.notes?.general !== saved.notes?.general) {
    throw new Error('Reset verification failed')
  }
  console.log(`PASS: saved ${saved.cardId} and reset it to BaseCard content (revision ${reset.revision}).`)
}

void main()
