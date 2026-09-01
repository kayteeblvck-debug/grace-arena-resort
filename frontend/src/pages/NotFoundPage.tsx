import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <span className="eyebrow">404</span>
      <h1>We cannot find that page</h1>
      <p className="lead" style={{ maxWidth: '34rem' }}>
        The link may be old, or we may have moved something. The suites, the Arena and the grounds
        are all still where you left them.
      </p>
      <div className="button-row" style={{ justifyContent: 'center' }}>
        <Link className="button" to="/">
          Back to the resort
        </Link>
        <Link className="button ghost" to="/accommodation">
          See the suites
        </Link>
      </div>
    </div>
  )
}
