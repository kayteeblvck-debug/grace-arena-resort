import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { api, ApiError } from '../api/client'
import Logo from '../components/Logo'
import ResortImage from '../components/ResortImage'
import { useAuth } from '../auth/useAuth'

interface RedirectState {
  from?: { pathname: string; search?: string }
}

export default function SignInPage() {
  const { user, signIn, initialising } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [needsVerification, setNeedsVerification] = useState(false)
  const [resent, setResent] = useState(false)
  const [busy, setBusy] = useState(false)

  const state = location.state as RedirectState | null
  const destination = state?.from ? `${state.from.pathname}${state.from.search ?? ''}` : '/account'

  if (!initialising && user) {
    return <Navigate to={destination} replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setNeedsVerification(false)

    try {
      await signIn(email, password)
      navigate(destination, { replace: true })
    } catch (caught) {
      // A 403 here means the password was right but the address is unconfirmed —
      // worth saying so, and offering the link again, rather than a flat failure.
      if (caught instanceof ApiError && caught.isUnverifiedEmail) {
        setNeedsVerification(true)
        setError(caught.message)
      } else {
        setError(caught instanceof Error ? caught.message : 'Could not sign you in.')
      }
    } finally {
      setBusy(false)
    }
  }

  async function resend() {
    try {
      await api.resendVerification(email.trim())
      setResent(true)
    } catch {
      setResent(true) // The endpoint is deliberately silent about unknown addresses.
    }
  }

  return (
    <div className="auth-layout">
      <aside className="auth-aside">
        <ResortImage src="/images/resort/exterior-evening.jpg" alt="Grace Arena Resorts at dusk" variant="backdrop" />
        <div className="auth-aside-copy">
          <Logo size={48} />
          <h2 style={{ marginTop: '2rem' }}>Your stays, in one place</h2>
          <p className="lead" style={{ color: 'var(--text-on-dark-muted)' }}>
            Sign in to reserve a suite, see what you have booked, and cancel or change a stay without
            picking up the phone.
          </p>
        </div>
      </aside>

      <div className="auth-panel">
        <form className="auth-form" onSubmit={onSubmit}>
          <div>
            <span className="eyebrow">Welcome back</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginTop: '0.75rem' }}>Sign in</h1>
          </div>

          {error && (
            <div className="notice error">
              <span>{error}</span>
              {needsVerification && !resent && (
                <button
                  type="button"
                  className="button ghost small"
                  style={{ marginTop: '0.75rem', alignSelf: 'flex-start' }}
                  onClick={resend}
                >
                  Send the link again
                </button>
              )}
            </div>
          )}

          {resent && (
            <div className="notice success">
              <span>
                If that address has an unconfirmed account, a new link is on its way. It expires in
                24 hours.
              </span>
            </div>
          )}

          <div className="field">
            <label htmlFor="sign-in-email">Email</label>
            <input
              id="sign-in-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
              autoFocus
            />
          </div>

          <div className="field">
            <label htmlFor="sign-in-password">Password</label>
            <input
              id="sign-in-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="button block" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="muted" style={{ fontSize: '0.9rem' }}>
            No account yet?{' '}
            <Link className="link-inline" to="/create-account">
              Create one
            </Link>
            .
          </p>
        </form>
      </div>
    </div>
  )
}
