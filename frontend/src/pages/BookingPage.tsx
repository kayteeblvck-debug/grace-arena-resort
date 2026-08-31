import { useEffect, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { api } from '../api/client'
import type { Booking, Room } from '../api/types'
import { formatCurrency, isoDate } from '../lib/format'

// The backend rejects same-day check-in, so the earliest selectable date is tomorrow.
const MIN_CHECK_IN = isoDate(1)

const EMPTY_FORM = {
  roomId: '',
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  checkIn: isoDate(1),
  checkOut: isoDate(2),
  guests: '1',
}

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const [rooms, setRooms] = useState<Room[]>([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState<Booking | null>(null)

  useEffect(() => {
    api
      .listRooms(true)
      .then((data) => {
        setRooms(data)

        const preselected = data.find((room) => room.slug === searchParams.get('room')) ?? data[0]
        if (preselected) {
          setForm((current) => ({ ...current, roomId: String(preselected.id) }))
        }
      })
      .catch((err: Error) => setError(err.message))
  }, [searchParams])

  function update(field: keyof typeof EMPTY_FORM, value: string) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const booking = await api.createBooking({
        roomId: Number(form.roomId),
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        guestPhone: form.guestPhone || undefined,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: Number(form.guests),
      })

      setConfirmed(booking)
      setForm(EMPTY_FORM)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmed) {
    return (
      <section className="card confirmation">
        <h2>Booking request received</h2>
        <p className="muted">
          We have your request for the {confirmed.roomName}. Our team will confirm by email shortly.
        </p>

        <dl className="room-meta">
          <div>
            <dt>Reference</dt>
            <dd>{confirmed.reference}</dd>
          </div>
          <div>
            <dt>Dates</dt>
            <dd>
              {confirmed.checkIn} &rarr; {confirmed.checkOut} ({confirmed.nights} nights)
            </dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{formatCurrency(confirmed.totalPrice)}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{confirmed.status}</dd>
          </div>
        </dl>

        <button type="button" className="button ghost" onClick={() => setConfirmed(null)}>
          Make another booking
        </button>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>Book a stay</h2>
      <p className="muted">Tell us when you are coming and we will hold a room for you.</p>

      {error && <p className="notice error">{error}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label>
          Room
          <select
            required
            value={form.roomId}
            onChange={(event) => update('roomId', event.target.value)}
          >
            <option value="" disabled>
              Select a room
            </option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} — {formatCurrency(room.pricePerNight)} / night
              </option>
            ))}
          </select>
        </label>

        <label>
          Full name
          <input
            required
            value={form.guestName}
            onChange={(event) => update('guestName', event.target.value)}
          />
        </label>

        <label>
          Email
          <input
            required
            type="email"
            value={form.guestEmail}
            onChange={(event) => update('guestEmail', event.target.value)}
          />
        </label>

        <label>
          Phone (optional)
          <input
            type="tel"
            value={form.guestPhone}
            onChange={(event) => update('guestPhone', event.target.value)}
          />
        </label>

        <div className="form-row">
          <label>
            Check in
            <input
              required
              type="date"
              min={MIN_CHECK_IN}
              value={form.checkIn}
              onChange={(event) => update('checkIn', event.target.value)}
            />
          </label>

          <label>
            Check out
            <input
              required
              type="date"
              min={form.checkIn}
              value={form.checkOut}
              onChange={(event) => update('checkOut', event.target.value)}
            />
          </label>

          <label>
            Guests
            <input
              required
              type="number"
              min={1}
              value={form.guests}
              onChange={(event) => update('guests', event.target.value)}
            />
          </label>
        </div>

        <button className="button primary" type="submit" disabled={submitting}>
          {submitting ? 'Sending…' : 'Request booking'}
        </button>
      </form>
    </section>
  )
}
