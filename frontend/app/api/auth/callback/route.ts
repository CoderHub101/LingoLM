export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { buildAuthSetupMessage, getAuthConfig } from '@/lib/auth'

type TokenResponse = {
  access_token?: string
  id_token?: string
  refresh_token?: string
  expires_in?: number
  error?: string
  error_description?: string
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const error = url.searchParams.get('error')
  const errorDesc = url.searchParams.get('error_description')

  if (error) {
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent(errorDesc || error)}`, url)
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent('Missing code/state')}`, url)
    )
  }

  const auth = getAuthConfig(req)

  if (!auth.isConfigured) {
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent(buildAuthSetupMessage())}`, url)
    )
  }

  const expectedState = req.cookies.get('oauth_state')?.value
  const verifier = req.cookies.get('pkce_verifier')?.value

  if (!expectedState || !verifier || expectedState !== state) {
    return NextResponse.redirect(
      new URL(`/auth/error?message=${encodeURIComponent('Invalid state/PKCE')}`, url)
    )
  }

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: auth.clientId,
    client_secret: auth.clientSecret,
    redirect_uri: auth.callbackUrl,
    code,
    code_verifier: verifier,
  })

  let tokenJson: TokenResponse | null = null
  let tokenStatus = 500

  try {
    const tokenResp = await fetch(auth.tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    })

    tokenStatus = tokenResp.status
    const tokenText = await tokenResp.text()

    try {
      tokenJson = JSON.parse(tokenText)
    } catch {}

    if (!tokenResp.ok) {
      const msg =
        tokenJson?.error_description ||
        tokenJson?.error ||
        `Token exchange failed (${tokenResp.status})`
      return NextResponse.redirect(new URL(`/auth/error?message=${encodeURIComponent(msg)}`, url))
    }
  } catch {
    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${encodeURIComponent('Could not reach the Google token endpoint.')}`,
        url
      )
    )
  }

  if (!tokenJson?.access_token || !tokenJson.id_token) {
    return NextResponse.redirect(
      new URL(
        `/auth/error?message=${encodeURIComponent(
          `Malformed token response${tokenStatus ? ` (${tokenStatus})` : ''}`
        )}`,
        url
      )
    )
  }

  const secure = process.env.NODE_ENV === 'production'
  const res = NextResponse.redirect(new URL(auth.postLoginRedirect, url))

  res.cookies.set('access_token', tokenJson.access_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: tokenJson.expires_in ?? 3600,
  })

  res.cookies.set('id_token', tokenJson.id_token, {
    httpOnly: true,
    sameSite: 'lax',
    secure,
    path: '/',
    maxAge: tokenJson.expires_in ?? 3600,
  })

  if (tokenJson.refresh_token) {
    res.cookies.set('refresh_token', tokenJson.refresh_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
    })
  }

  for (const cookieName of ['oauth_state', 'pkce_verifier']) {
    res.cookies.set(cookieName, '', {
      httpOnly: true,
      sameSite: 'lax',
      secure,
      path: '/',
      maxAge: 0,
    })
  }

  return res
}
