import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Room } from '../api/types'
import RoomCard from '../components/RoomCard'
import { useApiResource } from '../lib/useApiResource'

const HIGHLIGHTS = [
  { title: 'Lakeside arena', body: 'An open-air arena for weddings, conferences and concerts.' },
  { title: 'Suites & villas', body: 'Rooms from garden suites to a private presidential villa.' },
  { title: 'Full-service dining', body: 'Local and continental kitchens open from breakfast to late.' },
]

export default function HomePage() {
  const { data, error } = useApiResource<Room[]>('featured-rooms', () => api.listRooms(true))
  const featured = (data ?? []).slice(0, 3)

  return (
    <>
      <section className="hero">
        <p className="eyebrow">Welcome to</p>
        <h1>Grace Arena Resort</h1>
        <p className="lede">
          A place to rest, gather and celebrate. Book a suite, host an event, and let us handle the
          rest.
        </p>
        <div className="hero-actions">
          <Link className="button primary" to="/book">
            Book a stay
          </Link>
          <Link className="button ghost" to="/rooms">
            Browse rooms
          </Link>
        </div>
      </section>

      <section className="highlights">
        {HIGHLIGHTS.map((item) => (
          <div key={item.title} className="highlight">
            <h3>{item.title}</h3>
            <p className="muted">{item.body}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="section-head">
          <h2>Featured rooms</h2>
          <Link to="/rooms">See all rooms &rarr;</Link>
        </div>

        {error && <p className="notice error">Could not load rooms: {error}</p>}

        <div className="room-grid">
          {featured.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </>
  )
}
