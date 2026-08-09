import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-session'
import { resetUserCard } from '@/lib/server/user-cards'

export const runtime = 'nodejs'

// POST /api/cards/:cardId/reset
export async function POST(_req: NextRequest, { params }: { params: { cardId: string } }) {
  const session = await getServerSession()
  if (!session.authenticated || !session.user.openId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  try {
    const card = await resetUserCard(session.user.openId, params.cardId)
    if (!card) return NextResponse.json({ error: 'Card not found' }, { status: 404 })
    return NextResponse.json({ card })
  } catch (error) {
    console.error('Unable to reset user card', error)
    return NextResponse.json({ error: 'Unable to reset card' }, { status: 500 })
  }
}
