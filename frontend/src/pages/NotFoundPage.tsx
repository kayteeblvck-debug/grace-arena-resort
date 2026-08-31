import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section className="hero">
      <h1>Page not found</h1>
      <p className="lede">The page you were looking for does not exist.</p>
      <Link className="button primary" to="/">
        Back to home
      </Link>
    </section>
  )
}
