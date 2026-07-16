import { NextRequest } from 'next/server'

export type RuntimeAuthConfig = {
  isConfigured: boolean
  clientId: string
  clientSecret: string
  issuer: string
  authorizationEndpoint: string
  tokenEndpoint: string
  jwksUri: string
}

export type AuthConfig = RuntimeAuthConfig & {
  callbackUrl: string
  postLoginRedirect: string
  postLogoutRedirect: string
}

export function getRuntimeAuthConfig(): RuntimeAuthConfig {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || ''
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || ''

  return {
    isConfigured: Boolean(clientId && clientSecret),
    clientId,
    clientSecret,
    issuer: 'https://accounts.google.com',
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
  }
}

export function getAuthConfig(req: NextRequest): AuthConfig {
  const origin = getRequestOrigin(req)
  const runtimeConfig = getRuntimeAuthConfig()

  return {
    ...runtimeConfig,
    callbackUrl:
      process.env.AUTH_CALLBACK_URL?.trim() || new URL('/api/auth/callback', origin).toString(),
    postLoginRedirect: process.env.POST_LOGIN_REDIRECT?.trim() || '/',
    postLogoutRedirect: process.env.POST_LOGOUT_REDIRECT?.trim() || '/',
  }
}

export function buildAuthSetupMessage() {
  const missing = [
    !process.env.GOOGLE_CLIENT_ID?.trim() && 'GOOGLE_CLIENT_ID',
    !process.env.GOOGLE_CLIENT_SECRET?.trim() && 'GOOGLE_CLIENT_SECRET',
  ].filter((value): value is string => Boolean(value))

  if (missing.length === 0) {
    return 'Authentication is not configured for this environment.'
  }

  return `Authentication is not configured. Missing: ${missing.join(', ')}.`
}

function getRequestOrigin(req: NextRequest) {
  // Netlify forwards the public host and protocol because Next.js runs behind its proxy.
  // Using them keeps the OAuth callback on the same domain where login started.
  const forwardedHost = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  const forwardedProto = req.headers.get('x-forwarded-proto')

  if (forwardedHost && forwardedProto) {
    return `${forwardedProto}://${forwardedHost}`
  }

  return req.nextUrl.origin
}
