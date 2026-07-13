import { cookies } from 'next/headers'
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose'
import { getRuntimeAuthConfig } from '@/lib/auth'

export type SessionState =
  | { authenticated: false }
  | {
      authenticated: true
      user: {
        openId?: string
        email?: string
        setupComplete: boolean
      }
    }

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>()
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com']

export async function getServerSession(): Promise<SessionState> {
  const cookieStore = cookies()
  return getSessionFromIdToken(cookieStore.get('id_token')?.value)
}

export async function getSessionFromIdToken(idToken?: string): Promise<SessionState> {
  if (!idToken) {
    return { authenticated: false }
  }

  const auth = getRuntimeAuthConfig()
  if (!auth.isConfigured) {
    return { authenticated: false }
  }

  try {
    // Verify Google's signature, issuer, and this app's client ID before trusting user details.
    const { payload } = await jwtVerify(idToken, getJwks(auth.jwksUri), {
      issuer: GOOGLE_ISSUERS,
      audience: auth.clientId,
    })

    return {
      authenticated: true,
      user: pickUserClaims(payload),
    }
  } catch {
    return { authenticated: false }
  }
}

function getJwks(jwksUri: string) {
  // Reuse Google's public signing keys instead of creating a new remote key loader per request.
  const existing = jwksCache.get(jwksUri)
  if (existing) {
    return existing
  }

  const jwks = createRemoteJWKSet(new URL(jwksUri))
  jwksCache.set(jwksUri, jwks)
  return jwks
}

function pickUserClaims(payload: JWTPayload) {
  return {
    openId: typeof payload.sub === 'string' ? payload.sub : undefined,
    email: typeof payload.email === 'string' ? payload.email : undefined,
    setupComplete: false,
  }
}
