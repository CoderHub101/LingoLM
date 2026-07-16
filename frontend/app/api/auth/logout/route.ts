import { NextRequest, NextResponse } from 'next/server'
import { getAuthConfig } from '@/lib/auth'

function buildLogoutResponse(req: NextRequest, json = false) {
  const auth = getAuthConfig(req)
  const redirectUrl = new URL(auth.postLogoutRedirect, req.nextUrl)
  const res = json
    ? NextResponse.json({ authenticated: false, redirectTo: redirectUrl.toString() })
    : NextResponse.redirect(redirectUrl, { status: 302 })
  const secure = process.env.NODE_ENV === 'production'

  for (const cookieName of ['access_token', 'id_token', 'refresh_token', 'oauth_state', 'pkce_verifier']) {
    res.cookies.set(cookieName, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    })
  }

  return res
}

// GET supports direct navigation; POST lets the client clear cookies without leaving the page first.
export async function GET(req: NextRequest) {
  return buildLogoutResponse(req, false)
}

export async function POST(req: NextRequest) {
  return buildLogoutResponse(req, true)
}
