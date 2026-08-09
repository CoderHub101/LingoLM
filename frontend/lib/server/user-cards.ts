import { randomUUID } from 'crypto'
import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb'
import type { BaseCard, UserCard, UserCardContent } from '@/types/vocabulary'
import { fromItem, getDynamoClient, toItem } from './dynamodb'

function requiredEnv(name: 'USER_CARDS_TABLE_NAME' | 'BASE_CARDS_TABLE_NAME') {
  const value = process.env[name]?.trim()
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export function contentFromBaseCard(card: BaseCard): UserCardContent {
  return {
    definitions: card.definitions,
    examples: card.examples,
    relatedWords: card.relatedWords,
    collocations: card.collocations,
    usageNotes: card.usageNotes,
  }
}

export function makeUserCard(userId: string, baseCard: BaseCard, generalNote?: string): UserCard {
  const now = new Date().toISOString()
  return {
    userId,
    cardId: randomUUID(),
    baseRef: {
      baseCardId: baseCard.baseCardId,
      schemaVersion: baseCard.metadata.schemaVersion,
      source: baseCard.metadata.source,
      sourceVersion: baseCard.metadata.sourceVersion,
    },
    language: baseCard.language,
    lemma: baseCard.lemma,
    normalizedLemma: baseCard.normalizedLemma,
    forms: baseCard.forms,
    romanization: baseCard.romanization,
    content: contentFromBaseCard(baseCard),
    notes: generalNote ? { general: generalNote } : undefined,
    revision: 1,
    createdAt: now,
    updatedAt: now,
  }
}

export async function saveUserCard(userId: string, baseCard: BaseCard, generalNote?: string) {
  const card = makeUserCard(userId, baseCard, generalNote)
  await getDynamoClient().send(
    new PutItemCommand({
      TableName: requiredEnv('USER_CARDS_TABLE_NAME'),
      Item: toItem(card),
      // Saving a card is create-only, so retries cannot overwrite another card.
      ConditionExpression: 'attribute_not_exists(userId) AND attribute_not_exists(cardId)',
    })
  )
  return card
}

export async function resetUserCard(userId: string, cardId: string) {
  const client = getDynamoClient()
  const userTable = requiredEnv('USER_CARDS_TABLE_NAME')
  const existingResponse = await client.send(
    new GetItemCommand({ TableName: userTable, Key: toItem({ userId, cardId }), ConsistentRead: true })
  )
  if (!existingResponse.Item) return null

  const existing = fromItem<UserCard>(existingResponse.Item)
  const baseResponse = await client.send(
    new GetItemCommand({
      TableName: requiredEnv('BASE_CARDS_TABLE_NAME'),
      Key: toItem({ PK: `BASECARD#${existing.baseRef.baseCardId}` }),
      ConsistentRead: true,
    })
  )
  if (!baseResponse.Item) throw new Error(`BaseCard not found: ${existing.baseRef.baseCardId}`)

  const baseCard = fromItem<BaseCard>(baseResponse.Item)
  const resetCard: UserCard = {
    ...existing,
    // Preserve cardId, userId, createdAt, and baseRef. Only editable learning
    // content changes; warnings and notes remain user-owned additions.
    content: contentFromBaseCard(baseCard),
    revision: existing.revision + 1,
    updatedAt: new Date().toISOString(),
  }
  await client.send(
    new PutItemCommand({
      TableName: userTable,
      Item: toItem(resetCard),
      ConditionExpression: 'revision = :revision',
      ExpressionAttributeValues: toItem({ ':revision': existing.revision }),
    })
  )
  return resetCard
}
