import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import Logo from '../components/Logo'
import ResortImage from '../components/ResortImage'
import { useAuth } from '../auth/useAuth'

type Phase = 'checking' | 'confirmed' | 'failed' | 'missing'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const { confirmEmail } = useAuth()
  const token = params.get('token')

  const [phase, setPhase] = useState<Phase>(token ? 'checking' : 'missing')
  const [message, setMessage] = useState<string | null>(null)
  const [firstName, setFirstName] = useState('')

  // Confirmation tokens are single use, so this must fire exactly once. Under
  // StrictMode the effect runs twice in development; the ref survives that, and
  // without it the second attempt fails with "already been used".
  const attempted = useRef(false)

  useEffect(() => {
    if (!token || attempted.current) return
    attempted.current = true

    confirmEmail(token)
      .then((user) => {
        setFirstName(user.firstName)
        setPhase('confirmed')
      })
      .catch((caught: Error) => {
        setMessage(caught.message)
        setPhase('failed')
      })
  }, [token, confirmEmail])

  return (
    <div className="auth-layout">
      <aside className="auth-aside">
        <ResortImage src="/images/resort/pool-dusk.jpg" alt="The Water Garden at dusk" variant="backdrop" />
        <div className="auth-aside-copy">
          <Logo size={48} />
          <h2 style={{ marginTop: '2rem' }}>Ẹ káàbọ̀</h2>
          <p className="lead" style={{ color: 'var(--text-on-dark-muted)' }}>
            One click and your account is live.
          </p>
        </div>
      </aside>

      <div className="auth-panel">
        <div className="auth-form">
          {phase === 'checking' && (
            <>
              <div className="spinner" />
              <h1 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.4rem)' }}>Confirming your email…</h1>
            </>
          )}

          {phase === 'confirmed' && (
            <>
              <span className="eyebrow">Confirmed</span>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}>
                Thank you{firstName ? `, ${firstName}` : ''}
              </h1>
              <p className="lead">
                Your email is confirmed and you are signed in. You can reserve a suite now, or look
                at what is free over your dates.
              </p>
              <Link className="button block" to="/book">
                Check availability
              </Link>
              <Link className="button ghost block" to="/account">
                Go to my account
              </Link>
            </>
          )}

          {(phase === 'failed' || phase === 'missing') && (
            <>
              <span className="eyebrow">Something is off</span>
              <h1 style={{ fontSize: 'clamp(1.9rem, 4vw, 2.5rem)' }}>
                {phase === 'missing' ? 'That link is incomplete' : 'We could not confirm that'}
              </h1>
              <p className="lead">
                {message ??
                  'The link needs a confirmation token. Open the link from your email exactly as it was sent, or ask us for a new one below.'}
              </p>
              <ResendForm />
              <p className="muted" style={{ fontSize: '0.9rem' }}>
                Already confirmed?{' '}
                <Link className="link-inline" to="/sign-in">
                  Sign in
                </Link>
                .
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ResendForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    try {
      await api.resendVerification(email.trim())
    } catch {
      // The endpoint never confirms whether an address has an account, so a failure
      // here is a transport problem; either way the guest sees the same message.
    } finally {
      setBusy(false)
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="notice success">
        <span>
          If that address has an unconfirmed account, a new link is on its way. It expires in 24
          hours.
        </span>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="form-grid">
      <div className="field">
        <label htmlFor="resend-email">Your email</label>
        <input
          id="resend-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </div>
      <button type="submit" className="button" disabled={busy}>
        {busy ? 'Sending…' : 'Send a new link'}
      </button>
    </form>
  )
}
