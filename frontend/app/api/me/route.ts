import { NextResponse } from 'next/server'
import { getServerSession } from '@/lib/auth-session'

export async function GET() {
  const session = await getServerSession()
  return NextResponse.json(session)
}
