'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

type SessionState =
  | { authenticated: false }
  | {
      authenticated: true
      user: {
        email?: string
        setupComplete: boolean
      }
    }

export default function AuthControls() {
  const [session, setSession] = useState<SessionState | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let active = true

    const loadSession = async () => {
      try {
        const response = await fetch('/api/me', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Failed to load session')
        }

        const data = (await response.json()) as SessionState
        if (active) {
          setSession(data)
        }
      } catch {
        if (active) {
          setSession({ authenticated: false })
        }
      }
    }

    void loadSession()

    return () => {
      active = false
    }
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      setSession({ authenticated: false })
      router.replace('/')
      router.refresh()
    } catch {
      window.location.assign('/api/auth/logout')
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (session?.authenticated) {
    return (
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="rounded-full border-2 border-sand px-5 py-2 font-medium text-sage transition-all duration-300 hover:border-sage hover:bg-sage hover:text-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isLoggingOut ? 'Logging out...' : 'Log out'}
        </motion.button>
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-ink">{session.user.email || 'Signed in'}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.a
      href="/api/auth/login"
      className="rounded-full bg-ink px-5 py-2 font-medium text-cream shadow-md transition-all duration-300 hover:opacity-90"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Sign in with Google
    </motion.a>
  )
}
