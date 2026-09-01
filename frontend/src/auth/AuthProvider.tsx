import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, loadStoredToken, setToken } from '../api/client'
import type { RegisterRequest, User } from '../api/types'
import { AuthContext, type AuthValue } from './context'

/**
 * Holds the signed-in guest for the whole app.
 *
 * The bearer token lives in localStorage so a reload does not sign you out. That is
 * a deliberate trade — it is readable by any script on the page, so if this site ever
 * grows third-party embeds, move to an httpOnly refresh cookie.
 */
export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  // With no stored token there is nothing to check, so the first render is already
  // settled — deriving that here avoids a redundant render pass on every cold visit.
  const [initialising, setInitialising] = useState(() => Boolean(loadStoredToken()))

  useEffect(() => {
    if (!loadStoredToken()) return

    let cancelled = false

    api
      .me()
      .then((current) => {
        if (!cancelled) setUser(current)
      })
      .catch(() => {
        // Expired, revoked, or issued by a different environment.
        setToken(null)
      })
      .finally(() => {
        if (!cancelled) setInitialising(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await api.login(email.trim(), password)
    setToken(result.token)
    setUser(result.user)
    return result.user
  }, [])

  const register = useCallback(
    (payload: RegisterRequest) =>
      api.register({
        ...payload,
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        email: payload.email.trim(),
        phone: payload.phone?.trim() || undefined,
      }),
    [],
  )

  /** Confirming an address also signs the guest in, so they land somewhere useful. */
  const confirmEmail = useCallback(async (token: string) => {
    const result = await api.verifyEmail(token)
    setToken(result.token)
    setUser(result.user)
    return result.user
  }, [])

  const signOut = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthValue>(
    () => ({ user, initialising, signIn, register, confirmEmail, signOut }),
    [user, initialising, signIn, register, confirmEmail, signOut],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
