import { Link } from 'react-router-dom'
import ResortImage from './ResortImage'

interface Crumb {
  label: string
  to?: string
}

/** The standard interior-page header: photograph, breadcrumb, title, standfirst. */
export default function PageBanner({
  eyebrow,
  title,
  lead,
  image,
  crumbs = [],
}: {
  eyebrow?: string
  title: string
  lead?: string
  image: string
  crumbs?: Crumb[]
}) {
  return (
    <header className="page-banner">
      <div className="hero-media">
        <ResortImage src={image} alt={title} loading="eager" variant="backdrop" />
      </div>

      <div className="container page-banner-inner">
        {crumbs.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {crumbs.map((crumb) => (
              <span key={crumb.label}>
                <span aria-hidden="true">/ </span>
                {crumb.to ? <Link to={crumb.to}>{crumb.label}</Link> : crumb.label}
              </span>
            ))}
          </nav>
        )}

        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {lead && <p className="lead">{lead}</p>}
      </div>
    </header>
  )
}
