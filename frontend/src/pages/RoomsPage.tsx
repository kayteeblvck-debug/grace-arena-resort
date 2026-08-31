import { useState } from 'react'
import { api } from '../api/client'
import type { Room } from '../api/types'
import RoomCard from '../components/RoomCard'
import { useApiResource } from '../lib/useApiResource'

export default function RoomsPage() {
  const [availableOnly, setAvailableOnly] = useState(false)

  const { data, loading, error } = useApiResource<Room[]>(`rooms:${availableOnly}`, () =>
    api.listRooms(availableOnly),
  )
  const rooms = data ?? []

  return (
    <section>
      <div className="section-head">
        <h2>Our rooms</h2>
        <label className="checkbox">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(event) => setAvailableOnly(event.target.checked)}
          />
          Available only
        </label>
      </div>

      {loading && <p className="muted">Loading rooms…</p>}
      {error && <p className="notice error">Could not load rooms: {error}</p>}
      {!loading && !error && rooms.length === 0 && <p className="muted">No rooms to show.</p>}

      <div className="room-grid">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </section>
  )
}
