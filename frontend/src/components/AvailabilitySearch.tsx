import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDays, isoDate } from '../lib/format'

/**
 * The date/guest bar. It does not search on its own — it hands the criteria to
 * /book as query parameters, so a search is a shareable, reloadable URL.
 */
export default function AvailabilitySearch({
  className = '',
  initialCheckIn,
  initialCheckOut,
  initialGuests = 2,
  submitLabel = 'Check availability',
}: {
  className?: string
  initialCheckIn?: string
  initialCheckOut?: string
  initialGuests?: number
  submitLabel?: string
}) {
  const navigate = useNavigate()
  const [checkIn, setCheckIn] = useState(initialCheckIn ?? isoDate(1))
  const [checkOut, setCheckOut] = useState(initialCheckOut ?? isoDate(3))
  const [guests, setGuests] = useState(initialGuests)

  /** Keeping departure after arrival here avoids a pointless round trip. */
  function onArrivalChange(next: string) {
    setCheckIn(next)
    if (next >= checkOut) {
      setCheckOut(addDays(next, 2))
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) })
    navigate(`/book?${params.toString()}`)
  }

  return (
    <div className={`booking-bar ${className}`}>
      <div className="container">
        <form onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="search-check-in">Arrival</label>
            <input
              id="search-check-in"
              type="date"
              value={checkIn}
              min={isoDate(0)}
              onChange={(event) => onArrivalChange(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="search-check-out">Departure</label>
            <input
              id="search-check-out"
              type="date"
              value={checkOut}
              min={addDays(checkIn, 1)}
              onChange={(event) => setCheckOut(event.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="search-guests">Guests</label>
            <select
              id="search-guests"
              value={guests}
              onChange={(event) => setGuests(Number(event.target.value))}
            >
              {[1, 2, 3, 4, 5, 6].map((count) => (
                <option key={count} value={count}>
                  {count} {count === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="button">
            {submitLabel}
          </button>
        </form>
      </div>
    </div>
  )
}
