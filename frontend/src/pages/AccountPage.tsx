import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { Booking } from '../api/types'
import { useAuth } from '../auth/useAuth'
import ResortImage from '../components/ResortImage'
import { formatCurrency, formatDateShort, isoDate, pluralise, titleCase } from '../lib/format'
import { useApiResource } from '../lib/useApiResource'

type Tab = 'upcoming' | 'past'

export default function AccountPage() {
  const { user, signOut } = useAuth()
  const { data: bookings, error, loading } = useApiResource('bookings:me', () => api.myBookings())
  const [tab, setTab] = useState<Tab>('upcoming')

  const today = isoDate(0)

  const { upcoming, past } = useMemo(() => {
    const all = bookings ?? []
    return {
      // A stay counts as upcoming until the morning you leave.
      upcoming: all.filter((booking) => booking.checkOut >= today && booking.status !== 'CANCELLED'),
      past: all.filter((booking) => booking.checkOut < today || booking.status === 'CANCELLED'),
    }
  }, [bookings, today])

  const shown = tab === 'upcoming' ? upcoming : past

  return (
    <section className="section container" style={{ paddingTop: '9rem' }}>
      <div className="account-header">
        <div>
          <span className="eyebrow">My account</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>
            Ẹ káàbọ̀, {user?.firstName}
          </h1>
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            {user?.email}
            {user?.role === 'ADMIN' && (
              <>
                {' · '}
                <Link className="link-inline" to="/reservations-desk">
                  Reservations desk
                </Link>
              </>
            )}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link className="button" to="/book">
            Book another stay
          </Link>
          <button type="button" className="button ghost" onClick={signOut}>
            Sign out
          </button>
        </div>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tab ${tab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setTab('upcoming')}
        >
          Upcoming ({upcoming.length})
        </button>
        <button
          type="button"
          className={`tab ${tab === 'past' ? 'active' : ''}`}
          onClick={() => setTab('past')}
        >
          Past &amp; cancelled ({past.length})
        </button>
      </div>

      {loading && (
        <div className="state">
          <div className="spinner" />
          <p>Loading your stays…</p>
        </div>
      )}

      {error && (
        <div className="notice error">
          <strong>We could not load your bookings.</strong>
          <span>{error}</span>
        </div>
      )}

      {bookings && shown.length === 0 && (
        <div className="state">
          <h3>{tab === 'upcoming' ? 'Nothing booked yet' : 'Nothing here yet'}</h3>
          <p>
            {tab === 'upcoming'
              ? 'When you reserve a suite it will appear here, with everything you need to change or cancel it.'
              : 'Stays you have completed or cancelled will be kept here.'}
          </p>
          {tab === 'upcoming' && (
            <Link className="button" to="/book">
              Check availability
            </Link>
          )}
        </div>
      )}

      {shown.length > 0 && (
        <div className="booking-list">
          {shown.map((booking) => (
            <BookingRow key={booking.id} booking={booking} />
          ))}
        </div>
      )}
    </section>
  )
}

function BookingRow({ booking }: { booking: Booking }) {
  return (
    <article className="booking-row">
      <Link to={`/accommodation/${booking.roomSlug}`} className="media ratio-4-3">
        <ResortImage src={booking.roomImageUrl} alt={booking.roomName} />
      </Link>

      <div>
        <span className="eyebrow">{booking.reference}</span>
        <h3 style={{ marginTop: '0.4rem' }}>{booking.roomName}</h3>
        <p className="muted" style={{ marginTop: '0.6rem' }}>
          {formatDateShort(booking.checkIn)} &rarr; {formatDateShort(booking.checkOut)} ·{' '}
          {pluralise(booking.nights, 'night')} · {pluralise(booking.guests, 'guest')}
        </p>
      </div>

      <div className="right">
        <span className={`badge ${booking.status}`}>{titleCase(booking.status)}</span>
        <p className="price tabular">{formatCurrency(booking.totalAmount)}</p>
        <Link className="link-underline" to={`/account/bookings/${booking.reference}`}>
          Manage
        </Link>
      </div>
    </article>
  )
}
