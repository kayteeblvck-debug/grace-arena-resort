import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import Lightbox from '../components/Lightbox'
import Reveal from '../components/Reveal'
import ResortImage from '../components/ResortImage'
import { resort } from '../content/resort'
import { formatCurrency, isoDate, pluralise } from '../lib/format'
import { useApiResource } from '../lib/useApiResource'

export default function RoomDetailPage() {
  const { slug = '' } = useParams()
  const { data: room, error, loading } = useApiResource(`room:${slug}`, () => api.getRoom(slug))
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="state" style={{ minHeight: '80svh' }}>
        <div className="spinner" />
        <p>Loading the suite…</p>
      </div>
    )
  }

  if (error || !room) {
    return (
      <div className="not-found">
        <span className="eyebrow">Not found</span>
        <h1>We do not have that suite</h1>
        <p className="lead">{error ?? 'The room you are looking for is no longer listed.'}</p>
        <Link className="button" to="/accommodation">
          See all accommodation
        </Link>
      </div>
    )
  }

  const images = room.gallery.length > 0 ? room.gallery : [room.imageUrl ?? '']
  const [lead, ...rest] = images

  return (
    <>
      <header className="page-banner short" style={{ minHeight: 'auto', paddingBottom: 0 }}>
        <div className="hero-media">
          <ResortImage src={lead} alt={room.name} loading="eager" variant="backdrop" />
        </div>
        <div className="container page-banner-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>
              <span aria-hidden="true">/ </span>
              <Link to="/accommodation">Accommodation</Link>
            </span>
            <span>
              <span aria-hidden="true">/ </span>
              {room.name}
            </span>
          </nav>
          {room.featured && <span className="badge gold">Most requested</span>}
          <h1>{room.name}</h1>
          {room.tagline && <p className="lead">{room.tagline}</p>}
        </div>
      </header>

      <section className="section container">
        <div className="room-layout">
          <div>
            {rest.length > 0 && (
              <Reveal className="room-hero-gallery" as="div">
                <button
                  type="button"
                  className="media ratio-4-3 gallery-item"
                  onClick={() => setLightbox(rest[0])}
                >
                  <ResortImage src={rest[0]} alt={`${room.name} — view`} />
                </button>
                <div className="side">
                  {rest.slice(1, 3).map((image, index) => (
                    <button
                      key={image}
                      type="button"
                      className="media gallery-item"
                      onClick={() => setLightbox(image)}
                    >
                      <ResortImage src={image} alt={`${room.name} — view ${index + 2}`} />
                    </button>
                  ))}
                </div>
              </Reveal>
            )}

            <Reveal>
              <h2 style={{ marginTop: rest.length > 0 ? '3rem' : 0 }}>The room</h2>
              <div className="rule" />
              {(room.longDescription ?? room.description).split('\n\n').map((paragraph) => (
                <p key={paragraph.slice(0, 24)} style={{ marginTop: '1.15rem' }}>
                  {paragraph}
                </p>
              ))}
            </Reveal>

            <Reveal>
              <h3 style={{ marginTop: '3rem' }}>What is in it</h3>
              <div className="rule" />
              <ul className="amenity-list" style={{ marginTop: '1.5rem' }}>
                {room.amenities.map((amenity) => (
                  <li key={amenity}>{amenity}</li>
                ))}
              </ul>
            </Reveal>

            <Reveal>
              <h3 style={{ marginTop: '3rem' }}>Good to know</h3>
              <div className="rule" />
              <p className="muted" style={{ marginTop: '1rem' }}>
                Check-in from {resort.checkInTime}, check-out by {resort.checkOutTime}. Rates include
                breakfast, Wi-Fi and the use of the pool and grounds. Cancel free of charge from your
                account any time before the arrival date.
              </p>
            </Reveal>
          </div>

          <aside className="booking-panel">
            <span className="eyebrow">From</span>
            <p className="price tabular" style={{ marginTop: '0.5rem' }}>
              {formatCurrency(room.pricePerNight)} <small>/ night</small>
            </p>

            <dl className="spec-list" style={{ marginTop: '1.75rem' }}>
              <div>
                <dt>Sleeps</dt>
                <dd>{pluralise(room.capacity, 'guest')}</dd>
              </div>
              {room.bedType && (
                <div>
                  <dt>Beds</dt>
                  <dd>{room.bedType}</dd>
                </div>
              )}
              {room.sizeSqm && (
                <div>
                  <dt>Size</dt>
                  <dd>{room.sizeSqm} m²</dd>
                </div>
              )}
              {room.outlook && (
                <div>
                  <dt>Outlook</dt>
                  <dd>{room.outlook}</dd>
                </div>
              )}
              <div>
                <dt>Of this type</dt>
                <dd>{pluralise(room.totalUnits, 'room')}</dd>
              </div>
            </dl>

            <Link
              className="button block"
              style={{ marginTop: '1.75rem' }}
              to={`/book?room=${room.slug}&checkIn=${isoDate(1)}&checkOut=${isoDate(3)}&guests=${Math.min(2, room.capacity)}`}
            >
              Check dates
            </Link>
            <Link className="button ghost block" style={{ marginTop: '0.75rem' }} to="/contact">
              Ask a question
            </Link>
          </aside>
        </div>
      </section>

      {lightbox && (
        <Lightbox image={lightbox} caption={room.name} onClose={() => setLightbox(null)} />
      )}
    </>
  )
}
