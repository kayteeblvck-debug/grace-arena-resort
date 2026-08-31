import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Room } from '../api/types'
import { formatCurrency } from '../lib/format'
import { useApiResource } from '../lib/useApiResource'

export default function RoomDetailPage() {
  const { slug = '' } = useParams<{ slug: string }>()

  const {
    data: room,
    loading,
    error,
  } = useApiResource<Room>(`room:${slug}`, () => api.getRoom(slug))

  if (loading) return <p className="muted">Loading room…</p>
  if (error) return <p className="notice error">{error}</p>
  if (!room) return null

  return (
    <section className="room-detail">
      <img src={room.imageUrl} alt={room.name} />

      <div>
        <h2>{room.name}</h2>
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
          <div>
            <dt>Status</dt>
            <dd>{room.available ? 'Available' : 'Fully booked'}</dd>
          </div>
        </dl>

        {room.available ? (
          <Link className="button primary" to={`/book?room=${room.slug}`}>
            Book this room
          </Link>
        ) : (
          <p className="notice">This room is not currently taking bookings.</p>
        )}
      </div>
    </section>
  )
}
