import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { toAppError } from '../lib/errors/appError'

type AuthStatus = 'loading' | 'signed_in' | 'signed_out'

type AuthContextValue = {
  user: User | null
  status: AuthStatus
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    let isMounted = true

    void supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!isMounted) return

      if (error) {
        setUser(null)
        setStatus('signed_out')
        return
      }

      setUser(session?.user ?? null)
      setStatus(session?.user ? 'signed_in' : 'signed_out')
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      setStatus(session?.user ? 'signed_in' : 'signed_out')
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw toAppError(error, {
        code: 'AUTH_FAILED',
        userMessage: 'We could not sign you out right now.',
        retryable: true
      })
    }

    // Immediate local update so the UI does not linger on protected screens.
    setUser(null)
    setStatus('signed_out')
  }, [])

  return <AuthContext.Provider value={{ user, status, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return ctx
}
