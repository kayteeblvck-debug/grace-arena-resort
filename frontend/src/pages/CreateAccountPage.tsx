import { useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import type { RegistrationResult } from '../api/types'
import Logo from '../components/Logo'
import ResortImage from '../components/ResortImage'
import { useAuth } from '../auth/useAuth'

export default function CreateAccountPage() {
  const { user, register, initialising } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmation, setConfirmation] = useState('')

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RegistrationResult | null>(null)

  if (!initialising && user) {
    return <Navigate to="/account" replace />
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()

    if (password !== confirmation) {
      setError('The two passwords do not match.')
      return
    }

    setBusy(true)
    setError(null)

    try {
      setResult(await register({ firstName, lastName, email, phone, password }))
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create the account.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-layout">
      <aside className="auth-aside">
        <ResortImage src="/images/rooms/twin-city-pool-villa.jpg" alt="Twin City Pool Villa" variant="backdrop" />
        <div className="auth-aside-copy">
          <Logo size={48} />
          <h2 style={{ marginTop: '2rem' }}>An account takes a minute</h2>
          <p className="lead" style={{ color: 'var(--text-on-dark-muted)' }}>
            Confirm your email, and you can hold dates, see every stay you have booked with us, and
            cancel without a phone call.
          </p>
        </div>
      </aside>

      <div className="auth-panel">
        {result ? (
          <div className="auth-form">
            <span className="eyebrow">Almost there</span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>Check your inbox</h1>
            <p className="lead">
              We have sent a confirmation link to <strong>{result.user.email}</strong>. Open it and
              your account is live. The link is good for 24 hours.
            </p>

            {result.verificationUrl && (
              <div className="notice">
                <strong>Development shortcut</strong>
                <span>
                  No mail server is configured, so the link is shown here instead of being sent.
                </span>
                <a className="button small" href={result.verificationUrl} style={{ marginTop: '0.75rem' }}>
                  Confirm my email now
                </a>
              </div>
            )}

            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Nothing arrived? Check your spam folder, or{' '}
              <Link className="link-inline" to="/sign-in">
                try signing in
              </Link>{' '}
              — we will offer to send it again.
            </p>
          </div>
        ) : (
          <form className="auth-form" onSubmit={onSubmit}>
            <div>
              <span className="eyebrow">Create an account</span>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginTop: '0.75rem' }}>
                Let us know who you are
              </h1>
            </div>

            {error && (
              <div className="notice error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid two">
              <div className="field">
                <label htmlFor="first-name">First name</label>
                <input
                  id="first-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  autoComplete="given-name"
                  maxLength={60}
                  required
                  autoFocus
                />
              </div>
              <div className="field">
                <label htmlFor="last-name">Last name</label>
                <input
                  id="last-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  autoComplete="family-name"
                  maxLength={60}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="create-email">Email</label>
              <input
                id="create-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
              <span className="hint">We will send a confirmation link here.</span>
            </div>

            <div className="field">
              <label htmlFor="create-phone">Phone or WhatsApp</label>
              <input
                id="create-phone"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                autoComplete="tel"
                maxLength={30}
                placeholder="Optional"
              />
            </div>

            <div className="form-grid two">
              <div className="field">
                <label htmlFor="create-password">Password</label>
                <input
                  id="create-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <span className="hint">At least 8 characters.</span>
              </div>
              <div className="field">
                <label htmlFor="confirm-password">Repeat password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value)}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>
            </div>

            <button type="submit" className="button block" disabled={busy}>
              {busy ? 'Creating…' : 'Create my account'}
            </button>

            <p className="muted" style={{ fontSize: '0.9rem' }}>
              Already have one?{' '}
              <Link className="link-inline" to="/sign-in">
                Sign in
              </Link>
              .
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
