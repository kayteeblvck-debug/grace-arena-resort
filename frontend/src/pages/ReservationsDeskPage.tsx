import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import type { BookingStatus, EnquiryStatus } from '../api/types'
import { formatCurrency, formatDateShort, titleCase } from '../lib/format'
import { useApiResource } from '../lib/useApiResource'

type Tab = 'bookings' | 'enquiries'

const BOOKING_STATUSES: BookingStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']
const ENQUIRY_STATUSES: EnquiryStatus[] = ['NEW', 'IN_PROGRESS', 'CLOSED']

/**
 * The staff view. Route-guarded by ProtectedRoute, and the endpoints behind it are
 * independently restricted to ROLE_ADMIN — the UI guard is convenience, not security.
 */
export default function ReservationsDeskPage() {
  const [tab, setTab] = useState<Tab>('bookings')

  return (
    <section className="section container" style={{ paddingTop: '9rem' }}>
      <div className="account-header">
        <div>
          <span className="eyebrow">Staff</span>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '0.75rem' }}>
            Reservations desk
          </h1>
          <p className="muted" style={{ marginTop: '0.5rem' }}>
            Every booking and enquiry across the estate.
          </p>
        </div>
        <Link className="button ghost" to="/account">
          My account
        </Link>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tab ${tab === 'bookings' ? 'active' : ''}`}
          onClick={() => setTab('bookings')}
        >
          Bookings
        </button>
        <button
          type="button"
          className={`tab ${tab === 'enquiries' ? 'active' : ''}`}
          onClick={() => setTab('enquiries')}
        >
          Enquiries
        </button>
      </div>

      {tab === 'bookings' ? <BookingsTable /> : <EnquiriesTable />}
    </section>
  )
}

function BookingsTable() {
  const { data, error, loading, reload } = useApiResource('bookings:all', () => api.listAllBookings())
  const [busy, setBusy] = useState<string | null>(null)

  async function change(reference: string, status: BookingStatus) {
    setBusy(reference)
    try {
      await api.updateBookingStatus(reference, status)
      reload()
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <TableLoading />
  if (error) return <TableError message={error} />
  if (!data || data.length === 0) return <TableEmpty label="No bookings yet." />

  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Guest</th>
            <th>Suite</th>
            <th>Dates</th>
            <th>Guests</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((booking) => (
            <tr key={booking.id}>
              <td>
                <Link className="link-inline" to={`/account/bookings/${booking.reference}`}>
                  {booking.reference}
                </Link>
              </td>
              <td>
                {booking.guestName}
                <br />
                <span className="muted" style={{ fontSize: '0.82rem' }}>
                  {booking.guestEmail}
                </span>
              </td>
              <td>{booking.roomName}</td>
              <td>
                {formatDateShort(booking.checkIn)} &rarr; {formatDateShort(booking.checkOut)}
              </td>
              <td className="tabular">{booking.guests}</td>
              <td className="tabular">{formatCurrency(booking.totalAmount)}</td>
              <td>
                <select
                  aria-label={`Status for ${booking.reference}`}
                  value={booking.status}
                  disabled={busy === booking.reference}
                  onChange={(event) => change(booking.reference, event.target.value as BookingStatus)}
                >
                  {BOOKING_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {titleCase(status)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function EnquiriesTable() {
  const { data, error, loading, reload } = useApiResource('enquiries:all', () => api.listEnquiries())
  const [busy, setBusy] = useState<string | null>(null)

  async function change(reference: string, status: EnquiryStatus) {
    setBusy(reference)
    try {
      await api.updateEnquiryStatus(reference, status)
      reload()
    } finally {
      setBusy(null)
    }
  }

  if (loading) return <TableLoading />
  if (error) return <TableError message={error} />
  if (!data || data.length === 0) return <TableEmpty label="No enquiries yet." />

  return (
    <div className="table-wrap">
      <table className="data">
        <thead>
          <tr>
            <th>Reference</th>
            <th>From</th>
            <th>About</th>
            <th>Date</th>
            <th>Guests</th>
            <th>Received</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((enquiry) => (
            <tr key={enquiry.id}>
              <td>{enquiry.reference}</td>
              <td>
                {enquiry.name}
                <br />
                <span className="muted" style={{ fontSize: '0.82rem' }}>
                  <a className="link-inline" href={`mailto:${enquiry.email}`}>
                    {enquiry.email}
                  </a>
                </span>
              </td>
              <td style={{ whiteSpace: 'normal', maxWidth: '26rem' }}>
                <strong>{titleCase(enquiry.type)}</strong>
                <br />
                <span className="muted" style={{ fontSize: '0.86rem' }}>
                  {enquiry.message}
                </span>
              </td>
              <td>{enquiry.preferredDate ? formatDateShort(enquiry.preferredDate) : '—'}</td>
              <td className="tabular">{enquiry.expectedGuests ?? '—'}</td>
              <td>{formatDateShort(enquiry.createdAt)}</td>
              <td>
                <select
                  aria-label={`Status for ${enquiry.reference}`}
                  value={enquiry.status}
                  disabled={busy === enquiry.reference}
                  onChange={(event) => change(enquiry.reference, event.target.value as EnquiryStatus)}
                >
                  {ENQUIRY_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {titleCase(status)}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function TableLoading() {
  return (
    <div className="state">
      <div className="spinner" />
    </div>
  )
}

function TableError({ message }: { message: string }) {
  return (
    <div className="notice error">
      <span>{message}</span>
    </div>
  )
}

function TableEmpty({ label }: { label: string }) {
  return (
    <div className="state">
      <p>{label}</p>
    </div>
  )
}
