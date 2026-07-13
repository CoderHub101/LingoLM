import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { buildAuthSetupMessage, getAuthConfig } from '@/lib/auth'

function base64url(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function sha256(input: string) {
  return crypto.createHash('sha256').update(input).digest()
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const auth = getAuthConfig(req)

  if (!auth.isConfigured) {
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent(buildAuthSetupMessage())}`, url)
    )
  }

  const switchAccount = url.searchParams.get('switch_account') === '1'
  const prompt = switchAccount ? 'select_account' : undefined

  // State protects the callback from forged requests. PKCE proves that the callback belongs
  // to this login attempt without sending the private verifier to Google during this redirect.
  const state = base64url(crypto.randomBytes(16))
  const verifier = base64url(crypto.randomBytes(32))
  const challenge = base64url(sha256(verifier))

  const authorizeUrl = new URL(auth.authorizationEndpoint)
  authorizeUrl.searchParams.set('client_id', auth.clientId)
  authorizeUrl.searchParams.set('response_type', 'code')
  authorizeUrl.searchParams.set('redirect_uri', auth.callbackUrl)
  authorizeUrl.searchParams.set('scope', 'openid email profile')
  authorizeUrl.searchParams.set('state', state)
  authorizeUrl.searchParams.set('code_challenge', challenge)
  authorizeUrl.searchParams.set('code_challenge_method', 'S256')
  authorizeUrl.searchParams.set('include_granted_scopes', 'true')

  if (prompt) {
    authorizeUrl.searchParams.set('prompt', prompt)
  }

  const res = NextResponse.redirect(authorizeUrl)
  const secure = process.env.NODE_ENV === 'production'

  // These short-lived, server-only cookies are checked when Google redirects back.
  res.cookies.set('oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: 10 * 60,
  })

  res.cookies.set('pkce_verifier', verifier, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: 10 * 60,
  })

  return res
}
