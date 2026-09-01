import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { api } from '../api/client'
import ResortImage from '../components/ResortImage'
import { resort } from '../content/resort'
import { formatCurrency, formatDate, pluralise, titleCase } from '../lib/format'
import { useApiResource } from '../lib/useApiResource'

export default function BookingDetailPage() {
  const { reference = '' } = useParams()
  const location = useLocation()
  const justBooked = (location.state as { justBooked?: boolean } | null)?.justBooked ?? false

  const { data: booking, error, loading, mutate } = useApiResource(`booking:${reference}`, () =>
    api.getBooking(reference),
  )

  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [confirmingCancel, setConfirmingCancel] = useState(false)

  async function cancel() {
    setCancelling(true)
    setCancelError(null)
    try {
      mutate(await api.cancelBooking(reference))
      setConfirmingCancel(false)
    } catch (caught) {
      setCancelError(caught instanceof Error ? caught.message : 'We could not cancel that.')
    } finally {
      setCancelling(false)
    }
  }

  if (loading) {
    return (
      <div className="state" style={{ minHeight: '70svh' }}>
        <div className="spinner" />
        <p>Loading your booking…</p>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="not-found">
        <span className="eyebrow">Not found</span>
        <h1>We cannot find that booking</h1>
        <p className="lead">{error ?? 'The reference does not match any of your reservations.'}</p>
        <Link className="button" to="/account">
          Back to my account
        </Link>
      </div>
    )
  }

  return (
    <section className="section container" style={{ paddingTop: '9rem' }}>
      {justBooked && (
        <div className="notice success" style={{ marginBottom: '2.5rem' }}>
          <strong>That is booked — thank you.</strong>
          <span>
            We have sent a confirmation to {booking.guestEmail}. Our reservations desk will confirm
            it, usually within a few hours; you will get a second email when they do.
          </span>
        </div>
      )}

      <div className="account-header">
        <div>
          <span className="eyebrow">Booking {booking.reference}</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>
            {booking.roomName}
          </h1>
          <p style={{ marginTop: '0.75rem' }}>
            <span className={`badge ${booking.status}`}>{titleCase(booking.status)}</span>
          </p>
        </div>
        <Link className="button ghost" to="/account">
          All my bookings
        </Link>
      </div>

      <div className="room-layout">
        <div>
          <div className="media ratio-16-9">
            <ResortImage src={booking.roomImageUrl} alt={booking.roomName} loading="eager" />
          </div>

          <h2 style={{ marginTop: '2.5rem' }}>Your stay</h2>
          <div className="rule" />

          <dl className="spec-list" style={{ marginTop: '1.5rem' }}>
            <div>
              <dt>Arrival</dt>
              <dd>
                {formatDate(booking.checkIn)}, from {resort.checkInTime}
              </dd>
            </div>
            <div>
              <dt>Departure</dt>
              <dd>
                {formatDate(booking.checkOut)}, by {resort.checkOutTime}
              </dd>
            </div>
            <div>
              <dt>Nights</dt>
              <dd className="tabular">{booking.nights}</dd>
            </div>
            <div>
              <dt>Guests</dt>
              <dd className="tabular">{pluralise(booking.guests, 'guest')}</dd>
            </div>
            <div>
              <dt>Booked in the name of</dt>
              <dd>{booking.guestName}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{booking.guestEmail}</dd>
            </div>
            {booking.guestPhone && (
              <div>
                <dt>Phone</dt>
                <dd>{booking.guestPhone}</dd>
              </div>
            )}
          </dl>

          {booking.specialRequests && (
            <>
              <h3 style={{ marginTop: '2.5rem' }}>What you told us</h3>
              <div className="rule" />
              <p className="muted" style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>
                {booking.specialRequests}
              </p>
            </>
          )}

          <h3 style={{ marginTop: '2.5rem' }}>Finding us</h3>
          <div className="rule" />
          <p className="muted" style={{ marginTop: '1rem' }}>
            {resort.addressLines.join(' · ')}. About an hour and a half from Ibadan. Call{' '}
            <a className="link-inline" href={`tel:${resort.phone.replaceAll(' ', '')}`}>
              {resort.phone}
            </a>{' '}
            when you set off and we will have someone at the gate.
          </p>
        </div>

        <aside className="summary-panel">
          <span className="eyebrow">Charges</span>

          <div className="summary-rows">
            <div>
              <span className="muted">Rate per night</span>
              <span className="tabular">{formatCurrency(booking.pricePerNight)}</span>
            </div>
            <div>
              <span className="muted">Nights</span>
              <span className="tabular">{booking.nights}</span>
            </div>
            <div className="total">
              <span>Total</span>
              <span className="tabular">{formatCurrency(booking.totalAmount)}</span>
            </div>
          </div>

          <p className="muted" style={{ fontSize: '0.82rem' }}>
            Includes breakfast, Wi-Fi and use of the pool and grounds. Payment is arranged with the
            reservations desk.
          </p>

          {cancelError && (
            <div className="notice error" style={{ marginTop: '1.5rem' }}>
              <span>{cancelError}</span>
            </div>
          )}

          {booking.cancellable ? (
            confirmingCancel ? (
              <div className="notice" style={{ marginTop: '1.5rem' }}>
                <strong>Cancel this booking?</strong>
                <span>
                  The room goes back on sale straight away. There is no charge for cancelling before
                  your arrival date.
                </span>
                <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.9rem' }}>
                  <button
                    type="button"
                    className="button small"
                    onClick={cancel}
                    disabled={cancelling}
                  >
                    {cancelling ? 'Cancelling…' : 'Yes, cancel it'}
                  </button>
                  <button
                    type="button"
                    className="button ghost small"
                    onClick={() => setConfirmingCancel(false)}
                    disabled={cancelling}
                  >
                    Keep it
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                className="button ghost block"
                style={{ marginTop: '1.5rem' }}
                onClick={() => setConfirmingCancel(true)}
              >
                Cancel this booking
              </button>
            )
          ) : (
            <p className="muted" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
              {booking.status === 'CANCELLED'
                ? 'This booking has been cancelled.'
                : 'This booking can no longer be cancelled online. Please call the resort.'}
            </p>
          )}

          <Link className="button ghost block" style={{ marginTop: '0.75rem' }} to="/contact">
            Ask about this stay
          </Link>
        </aside>
      </div>
    </section>
  )
}
