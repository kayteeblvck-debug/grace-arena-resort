import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'

/**
 * Gate for the account pages. While the stored token is still being checked we hold
 * the route rather than redirecting, otherwise a reload on /account would bounce the
 * guest to the sign-in screen before the check had a chance to finish.
 */
export default function ProtectedRoute({
  children,
  requireAdmin = false,
}: {
  children: ReactNode
  requireAdmin?: boolean
}) {
  const { user, initialising } = useAuth()
  const location = useLocation()

  if (initialising) {
    return (
      <div className="state" style={{ minHeight: '70svh' }}>
        <div className="spinner" />
        <p>One moment…</p>
      </div>
    )
  }

  if (!user) {
    // Remember where they were headed so sign-in can send them back.
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }

  if (requireAdmin && user.role !== 'ADMIN') {
    return <Navigate to="/account" replace />
  }

  return <>{children}</>
}
