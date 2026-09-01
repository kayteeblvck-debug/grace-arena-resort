import { Link } from 'react-router-dom'
import type { Room } from '../api/types'
import { formatCurrency, pluralise } from '../lib/format'
import ResortImage from './ResortImage'

export default function RoomCard({ room }: { room: Room }) {
  const href = `/accommodation/${room.slug}`

  return (
    <article className="room-card">
      <Link to={href} className="media ratio-4-3" aria-label={`View ${room.name}`}>
        <ResortImage src={room.imageUrl} alt={room.name} />
        {room.featured && <span className="badge gold media-badge">Most requested</span>}
      </Link>

      <div className="room-card-body">
        <h3>
          <Link to={href}>{room.name}</Link>
        </h3>

        <p className="tagline">{room.tagline ?? room.description}</p>

        <dl className="room-meta">
          <div>
            <dt>Sleeps</dt>
            <dd>{pluralise(room.capacity, 'guest')}</dd>
          </div>
          {room.sizeSqm && (
            <div>
              <dt>Size</dt>
              <dd>{room.sizeSqm} m²</dd>
            </div>
          )}
          {room.bedType && (
            <div>
              <dt>Beds</dt>
              <dd>{room.bedType}</dd>
            </div>
          )}
        </dl>

        <div className="room-card-foot">
          <p className="price tabular">
            {formatCurrency(room.pricePerNight)} <small>/ night</small>
          </p>
          <Link className="link-underline" to={href}>
            View suite
          </Link>
        </div>
      </div>
    </article>
  )
}
