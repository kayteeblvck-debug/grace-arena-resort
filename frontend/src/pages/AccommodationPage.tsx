import { api } from '../api/client'
import AvailabilitySearch from '../components/AvailabilitySearch'
import PageBanner from '../components/PageBanner'
import Reveal from '../components/Reveal'
import RoomCard from '../components/RoomCard'
import { resort } from '../content/resort'
import { useApiResource } from '../lib/useApiResource'

export default function AccommodationPage() {
  const { data: rooms, error, loading } = useApiResource('rooms:all', () => api.listRooms(true))

  return (
    <>
      <PageBanner
        eyebrow="Accommodation"
        title="Twenty-eight ways to stay"
        lead={`Garden rooms that open onto the lawn, suites with terraces over the Arena, and villas behind their own gates — all within the walls at ${resort.village}.`}
        image="/images/rooms/arena-terrace-suite.jpg"
        crumbs={[{ label: 'Accommodation' }]}
      />

      <AvailabilitySearch />

      <section className="section container">
        {loading && (
          <div className="grid cols-3">
            {[0, 1, 2, 3, 4, 5].map((key) => (
              <div key={key} className="skeleton" style={{ aspectRatio: '3 / 4' }} />
            ))}
          </div>
        )}

        {error && (
          <div className="notice error">
            <strong>We could not load the rooms.</strong>
            <span>{error}</span>
          </div>
        )}

        {rooms && rooms.length === 0 && (
          <div className="state">
            <p>Every room is off sale at the moment. Please contact our reservations desk.</p>
          </div>
        )}

        {rooms && rooms.length > 0 && (
          <>
            <Reveal className="section-head">
              <span className="eyebrow">{rooms.length} room types</span>
              <h2>Choose your room</h2>
              <p className="lead">
                Rates are per night and include breakfast, Wi-Fi, and the use of the pool and
                grounds. Prices shown are before any seasonal adjustment.
              </p>
            </Reveal>

            <div className="grid cols-3">
              {rooms.map((room, index) => (
                <Reveal key={room.id} delay={(index % 3) * 100}>
                  <RoomCard room={room} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  )
}
