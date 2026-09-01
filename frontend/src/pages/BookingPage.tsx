import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import type { RoomAvailability } from '../api/types'
import { useAuth } from '../auth/useAuth'
import PageBanner from '../components/PageBanner'
import ResortImage from '../components/ResortImage'
import { resort } from '../content/resort'
import { addDays, formatCurrency, formatDate, isoDate, nightsBetween, pluralise } from '../lib/format'
import { useApiResource } from '../lib/useApiResource'

const STEPS = ['Dates', 'Suite', 'Details'] as const

/**
 * The whole reservation flow, driven by the query string so a search can be shared,
 * reloaded, or arrived at from a room page with everything already chosen.
 */
export default function BookingPage() {
  const [params, setParams] = useSearchParams()
  const { user, initialising } = useAuth()
  const navigate = useNavigate()

  const checkIn = params.get('checkIn') ?? ''
  const checkOut = params.get('checkOut') ?? ''
  const guests = Number(params.get('guests') ?? 2)
  const roomSlug = params.get('room') ?? ''

  const datesChosen = Boolean(checkIn && checkOut && checkOut > checkIn)
  const step = !datesChosen ? 0 : !roomSlug ? 1 : 2

  function update(next: Record<string, string | null>) {
    const merged = new URLSearchParams(params)
    for (const [key, value] of Object.entries(next)) {
      if (value === null) merged.delete(key)
      else merged.set(key, value)
    }
    setParams(merged, { replace: false })
  }

  return (
    <>
      <PageBanner
        eyebrow="Reserve"
        title="Book your stay"
        lead={`Choose your dates, pick a suite, and we will confirm — usually within a few hours. Check-in from ${resort.checkInTime}.`}
        image="/images/rooms/ola-executive-suite.jpg"
        crumbs={[{ label: 'Book' }]}
      />

      <section className="section container">
        <ol className="steps">
          {STEPS.map((label, index) => (
            <li
              key={label}
              className={`step ${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`}
            >
              <span className="step-number">{index + 1}</span>
              {label}
            </li>
          ))}
        </ol>

        {step === 0 && <ChooseDates onChoose={update} />}

        {step === 1 && (
          <ChooseRoom
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            onBack={() => update({ checkIn: null, checkOut: null })}
            onSelect={(slug) => update({ room: slug })}
          />
        )}

        {step === 2 && (
          <Confirm
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
            roomSlug={roomSlug}
            signedIn={Boolean(user)}
            initialising={initialising}
            onBack={() => update({ room: null })}
            onBooked={(reference) =>
              navigate(`/account/bookings/${reference}`, { state: { justBooked: true } })
            }
          />
        )}
      </section>
    </>
  )
}

/* ---------- step 1 ---------- */

function ChooseDates({ onChoose }: { onChoose: (next: Record<string, string>) => void }) {
  const [checkIn, setCheckIn] = useState(isoDate(1))
  const [checkOut, setCheckOut] = useState(isoDate(3))
  const [guests, setGuests] = useState(2)

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    onChoose({ checkIn, checkOut, guests: String(guests) })
  }

  return (
    <div style={{ maxWidth: '44rem' }}>
      <span className="eyebrow">Step one</span>
      <h2 style={{ marginTop: '0.75rem' }}>When are you coming?</h2>
      <div className="rule" />

      <form onSubmit={onSubmit} className="form-grid" style={{ marginTop: '2rem' }}>
        <div className="form-grid two">
          <div className="field">
            <label htmlFor="book-check-in">Arrival</label>
            <input
              id="book-check-in"
              type="date"
              min={isoDate(0)}
              value={checkIn}
              onChange={(event) => {
                setCheckIn(event.target.value)
                if (event.target.value >= checkOut) setCheckOut(addDays(event.target.value, 2))
              }}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="book-check-out">Departure</label>
            <input
              id="book-check-out"
              type="date"
              min={addDays(checkIn, 1)}
              value={checkOut}
              onChange={(event) => setCheckOut(event.target.value)}
              required
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="book-guests">Guests</label>
          <select
            id="book-guests"
            value={guests}
            onChange={(event) => setGuests(Number(event.target.value))}
          >
            {[1, 2, 3, 4, 5, 6].map((count) => (
              <option key={count} value={count}>
                {count} {count === 1 ? 'guest' : 'guests'}
              </option>
            ))}
          </select>
          <span className="hint">
            Booking for more than six? Reserve two rooms, or{' '}
            <Link className="link-inline" to="/contact">
              talk to us
            </Link>
            .
          </span>
        </div>

        <button type="submit" className="button" style={{ justifySelf: 'start' }}>
          See what is free
        </button>
      </form>
    </div>
  )
}

/* ---------- step 2 ---------- */

function ChooseRoom({
  checkIn,
  checkOut,
  guests,
  onBack,
  onSelect,
}: {
  checkIn: string
  checkOut: string
  guests: number
  onBack: () => void
  onSelect: (slug: string) => void
}) {
  const { data, error, loading } = useApiResource(
    `availability:${checkIn}:${checkOut}:${guests}`,
    () => api.checkAvailability(checkIn, checkOut, guests),
  )

  const nights = nightsBetween(checkIn, checkOut)

  // Bookable rooms first; within each group, cheapest first.
  const sorted = useMemo(
    () =>
      (data ?? []).slice().sort((a, b) => {
        if (a.bookable !== b.bookable) return a.bookable ? -1 : 1
        return a.room.pricePerNight - b.room.pricePerNight
      }),
    [data],
  )

  const anyBookable = sorted.some((entry) => entry.bookable)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '1rem',
        }}
      >
        <div>
          <span className="eyebrow">Step two</span>
          <h2 style={{ marginTop: '0.75rem' }}>Choose your suite</h2>
          <p className="muted" style={{ marginTop: '0.75rem' }}>
            {formatDate(checkIn)} &rarr; {formatDate(checkOut)} · {pluralise(nights, 'night')} ·{' '}
            {pluralise(guests, 'guest')}
          </p>
        </div>
        <button type="button" className="link-underline" onClick={onBack}>
          Change dates
        </button>
      </div>

      <div className="rule" />

      {loading && (
        <div className="state">
          <div className="spinner" />
          <p>Checking what is free…</p>
        </div>
      )}

      {error && (
        <div className="notice error" style={{ marginTop: '2rem' }}>
          <strong>We could not check those dates.</strong>
          <span>{error}</span>
        </div>
      )}

      {data && !anyBookable && (
        <div className="notice" style={{ marginTop: '2rem' }}>
          <strong>Nothing is free for that party over those dates.</strong>
          <span>
            Try shifting by a night or two, or{' '}
            <Link className="link-inline" to="/contact">
              ask the desk
            </Link>{' '}
            — we can sometimes move things around.
          </span>
        </div>
      )}

      <div className="grid" style={{ gap: '1rem', marginTop: '2rem' }}>
        {sorted.map((entry) => (
          <AvailabilityRow key={entry.room.id} entry={entry} onSelect={onSelect} />
        ))}
      </div>
    </div>
  )
}

function AvailabilityRow({
  entry,
  onSelect,
}: {
  entry: RoomAvailability
  onSelect: (slug: string) => void
}) {
  const { room, bookable, reason, unitsLeft, nights, totalAmount } = entry

  return (
    <article className={`availability-row ${bookable ? '' : 'unavailable'}`}>
      <Link to={`/accommodation/${room.slug}`} className="media ratio-4-3">
        <ResortImage src={room.imageUrl} alt={room.name} />
      </Link>

      <div>
        <h3>
          <Link to={`/accommodation/${room.slug}`}>{room.name}</Link>
        </h3>
        <p className="muted" style={{ marginTop: '0.5rem' }}>
          {room.tagline ?? room.description}
        </p>
        <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.86rem' }}>
          Sleeps {room.capacity}
          {room.bedType ? ` · ${room.bedType}` : ''}
          {room.sizeSqm ? ` · ${room.sizeSqm} m²` : ''}
        </p>
        {bookable && unitsLeft <= 2 && (
          <p style={{ marginTop: '0.75rem' }}>
            <span className="badge gold">
              {unitsLeft === 1 ? 'Last one for these dates' : `${unitsLeft} left`}
            </span>
          </p>
        )}
      </div>

      <div className="right">
        <div>
          <p className="price tabular">{formatCurrency(totalAmount)}</p>
          <p className="muted" style={{ fontSize: '0.82rem' }}>
            {formatCurrency(room.pricePerNight)} × {pluralise(nights, 'night')}
          </p>
        </div>

        {bookable ? (
          <button type="button" className="button" onClick={() => onSelect(room.slug)}>
            Select
          </button>
        ) : (
          <span className="badge unavailable">{reason ?? 'Unavailable'}</span>
        )}
      </div>
    </article>
  )
}

/* ---------- step 3 ---------- */

function Confirm({
  checkIn,
  checkOut,
  guests,
  roomSlug,
  signedIn,
  initialising,
  onBack,
  onBooked,
}: {
  checkIn: string
  checkOut: string
  guests: number
  roomSlug: string
  signedIn: boolean
  initialising: boolean
  onBack: () => void
  onBooked: (reference: string) => void
}) {
  const { user } = useAuth()
  const { data: room, error: roomError } = useApiResource(`room:${roomSlug}`, () =>
    api.getRoom(roomSlug),
  )

  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [specialRequests, setSpecialRequests] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const nights = nightsBetween(checkIn, checkOut)
  const total = room ? room.pricePerNight * nights : 0

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!room) return

    setBusy(true)
    setError(null)

    try {
      const booking = await api.createBooking({
        roomId: room.id,
        checkIn,
        checkOut,
        guests,
        guestName: guestName.trim() || undefined,
        guestPhone: guestPhone.trim() || undefined,
        specialRequests: specialRequests.trim() || undefined,
      })
      onBooked(booking.reference)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not complete that booking.')
    } finally {
      setBusy(false)
    }
  }

  if (roomError) {
    return (
      <div className="notice error">
        <strong>That suite is not available to book.</strong>
        <span>{roomError}</span>
        <button type="button" className="button ghost small" style={{ marginTop: '0.75rem', alignSelf: 'flex-start' }} onClick={onBack}>
          Choose another
        </button>
      </div>
    )
  }

  return (
    <div className="room-layout">
      <div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div>
            <span className="eyebrow">Step three</span>
            <h2 style={{ marginTop: '0.75rem' }}>Confirm your details</h2>
          </div>
          <button type="button" className="link-underline" onClick={onBack}>
            Change suite
          </button>
        </div>

        <div className="rule" />

        {initialising && (
          <div className="state">
            <div className="spinner" />
          </div>
        )}

        {!initialising && !signedIn && (
          <div className="notice" style={{ marginTop: '2rem' }}>
            <strong>You need an account to complete a booking.</strong>
            <span>
              It takes a minute, and it is how you see and cancel your stays afterwards. Your dates
              and suite are held in this page — signing in will bring you straight back.
            </span>
            <div className="button-row" style={{ marginTop: '1rem' }}>
              <Link
                className="button"
                to="/create-account"
                state={{ from: { pathname: '/book', search: window.location.search } }}
              >
                Create an account
              </Link>
              <Link
                className="button ghost"
                to="/sign-in"
                state={{ from: { pathname: '/book', search: window.location.search } }}
              >
                I already have one
              </Link>
            </div>
          </div>
        )}

        {!initialising && signedIn && (
          <form onSubmit={onSubmit} className="form-grid" style={{ marginTop: '2rem' }}>
            {error && (
              <div className="notice error">
                <span>{error}</span>
              </div>
            )}

            <div className="form-grid two">
              <div className="field">
                <label htmlFor="booking-name">Name on the booking</label>
                <input
                  id="booking-name"
                  value={guestName}
                  onChange={(event) => setGuestName(event.target.value)}
                  maxLength={100}
                  placeholder={user ? `${user.firstName} ${user.lastName}` : ''}
                />
                <span className="hint">Leave blank to use your own name.</span>
              </div>

              <div className="field">
                <label htmlFor="booking-phone">Phone on the day</label>
                <input
                  id="booking-phone"
                  value={guestPhone}
                  onChange={(event) => setGuestPhone(event.target.value)}
                  maxLength={30}
                  placeholder={user?.phone ?? 'Optional'}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="booking-requests">Anything we should know?</label>
              <textarea
                id="booking-requests"
                value={specialRequests}
                onChange={(event) => setSpecialRequests(event.target.value)}
                maxLength={1000}
                placeholder="Arrival time, dietary requirements, a cot, an anniversary — anything that would make the stay better."
              />
              <span className="hint">{specialRequests.length} / 1000</span>
            </div>

            <p className="muted" style={{ fontSize: '0.88rem' }}>
              Bookings are confirmed by our reservations desk, usually within a few hours. You can
              cancel free of charge from your account any time before {formatDate(checkIn)}.
            </p>

            <button type="submit" className="button" disabled={busy || !room}>
              {busy ? 'Sending…' : 'Request this booking'}
            </button>
          </form>
        )}
      </div>

      <aside className="summary-panel">
        <span className="eyebrow">Your stay</span>
        {room ? (
          <>
            <h3 style={{ marginTop: '0.75rem' }}>{room.name}</h3>
            <div className="media ratio-3-2" style={{ marginTop: '1.25rem' }}>
              <ResortImage src={room.imageUrl} alt={room.name} />
            </div>

            <div className="summary-rows">
              <div>
                <span className="muted">Arrival</span>
                <span>{formatDate(checkIn)}</span>
              </div>
              <div>
                <span className="muted">Departure</span>
                <span>{formatDate(checkOut)}</span>
              </div>
              <div>
                <span className="muted">Nights</span>
                <span className="tabular">{nights}</span>
              </div>
              <div>
                <span className="muted">Guests</span>
                <span className="tabular">{guests}</span>
              </div>
              <div>
                <span className="muted">
                  {formatCurrency(room.pricePerNight)} × {nights}
                </span>
                <span className="tabular">{formatCurrency(total)}</span>
              </div>
              <div className="total">
                <span>Total</span>
                <span className="tabular">{formatCurrency(total)}</span>
              </div>
            </div>

            <p className="muted" style={{ fontSize: '0.82rem' }}>
              Includes breakfast, Wi-Fi and use of the pool and grounds. Payment is arranged with the
              reservations desk once the booking is confirmed.
            </p>
          </>
        ) : (
          <div className="skeleton" style={{ height: '18rem', marginTop: '1.25rem' }} />
        )}
      </aside>
    </div>
  )
}
