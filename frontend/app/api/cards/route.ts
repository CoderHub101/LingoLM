import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-session'
import { saveUserCard } from '@/lib/server/user-cards'
import type { BaseCard } from '@/types/vocabulary'

export const runtime = 'nodejs'

function isBaseCard(value: unknown): value is BaseCard {
  if (!value || typeof value !== 'object') return false
  const card = value as Partial<BaseCard>
  return Boolean(
    card.baseCardId && card.language && card.lemma && card.normalizedLemma &&
      Array.isArray(card.definitions) && Array.isArray(card.examples) && card.metadata
  )
}

// POST /api/cards — save a lookup result without calling a Lambda.
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session.authenticated || !session.user.openId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const body: unknown = await req.json().catch(() => null)
  const request = body as { baseCard?: unknown; notes?: unknown } | null
  if (!request || !isBaseCard(request.baseCard) || (request.notes !== undefined && typeof request.notes !== 'string')) {
    return NextResponse.json({ error: 'Expected { baseCard, notes? }' }, { status: 400 })
  }

  try {
    const card = await saveUserCard(session.user.openId, request.baseCard, request.notes)
    return NextResponse.json({ card }, { status: 201 })
  } catch (error) {
    console.error('Unable to save user card', error)
    return NextResponse.json({ error: 'Unable to save card' }, { status: 500 })
  }
}
