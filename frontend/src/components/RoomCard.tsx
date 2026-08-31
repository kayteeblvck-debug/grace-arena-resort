import { Link } from 'react-router-dom'
import type { Room } from '../api/types'
import { formatCurrency } from '../lib/format'

export default function RoomCard({ room }: { room: Room }) {
  return (
    <article className="room-card">
      <img src={room.imageUrl} alt={room.name} loading="lazy" />
      <div className="room-card-body">
        <div className="room-card-head">
          <h3>{room.name}</h3>
          <span className={room.available ? 'badge available' : 'badge unavailable'}>
            {room.available ? 'Available' : 'Fully booked'}
          </span>
        </div>
        <p className="muted">{room.description}</p>
        <dl className="room-meta">
          <div>
            <dt>Per night</dt>
            <dd>{formatCurrency(room.pricePerNight)}</dd>
          </div>
          <div>
            <dt>Sleeps</dt>
            <dd>{room.capacity} guests</dd>
          </div>
        </dl>
        <Link className="button ghost" to={`/rooms/${room.slug}`}>
          View details
        </Link>
      </div>
    </article>
  )
}
