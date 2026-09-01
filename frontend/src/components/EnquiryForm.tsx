import { useState, type FormEvent } from 'react'
import { api } from '../api/client'
import type { EnquiryType } from '../api/types'
import { useAuth } from '../auth/useAuth'
import { eventTypes } from '../content/resort'
import { isoDate } from '../lib/format'

/**
 * The single contact form, used by both the events and contact pages. Signed-in
 * guests get their name and email filled in; everyone else types them.
 */
export default function EnquiryForm({ defaultType = 'GENERAL' }: { defaultType?: EnquiryType }) {
  const { user } = useAuth()

  const [type, setType] = useState<EnquiryType>(defaultType)
  const [name, setName] = useState(user ? `${user.firstName} ${user.lastName}` : '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [preferredDate, setPreferredDate] = useState('')
  const [expectedGuests, setExpectedGuests] = useState('')
  const [message, setMessage] = useState('')

  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reference, setReference] = useState<string | null>(null)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSending(true)
    setError(null)

    try {
      const receipt = await api.sendEnquiry({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        type,
        preferredDate: preferredDate || undefined,
        expectedGuests: expectedGuests ? Number(expectedGuests) : undefined,
        message: message.trim(),
      })
      setReference(receipt.reference)
      setMessage('')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'We could not send that. Please try again.')
    } finally {
      setSending(false)
    }
  }

  if (reference) {
    return (
      <div className="notice success">
        <strong>Thank you — that is with us.</strong>
        <span>
          Your reference is <strong>{reference}</strong>. A member of the team will reply personally,
          usually within one business day. We have sent a copy to {email}.
        </span>
        <button
          type="button"
          className="button ghost small"
          style={{ marginTop: '0.75rem', alignSelf: 'flex-start' }}
          onClick={() => setReference(null)}
        >
          Send another
        </button>
      </div>
    )
  }

  const isEvent = type !== 'GENERAL'

  return (
    <form onSubmit={onSubmit} className="form-grid">
      {error && (
        <div className="notice error">
          <span>{error}</span>
        </div>
      )}

      <div className="field">
        <label htmlFor="enquiry-type">What is it about?</label>
        <select
          id="enquiry-type"
          value={type}
          onChange={(event) => setType(event.target.value as EnquiryType)}
        >
          {eventTypes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-grid two">
        <div className="field">
          <label htmlFor="enquiry-name">Your name</label>
          <input
            id="enquiry-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            maxLength={120}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="enquiry-email">Email</label>
          <input
            id="enquiry-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="form-grid two">
        <div className="field">
          <label htmlFor="enquiry-phone">Phone or WhatsApp</label>
          <input
            id="enquiry-phone"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            autoComplete="tel"
            maxLength={30}
            placeholder="Optional"
          />
        </div>

        <div className="field">
          <label htmlFor="enquiry-date">{isEvent ? 'Preferred date' : 'Date in mind'}</label>
          <input
            id="enquiry-date"
            type="date"
            min={isoDate(0)}
            value={preferredDate}
            onChange={(event) => setPreferredDate(event.target.value)}
          />
        </div>
      </div>

      {isEvent && (
        <div className="field">
          <label htmlFor="enquiry-guests">Roughly how many guests?</label>
          <input
            id="enquiry-guests"
            type="number"
            min={1}
            max={5000}
            value={expectedGuests}
            onChange={(event) => setExpectedGuests(event.target.value)}
            placeholder="An estimate is fine"
          />
        </div>
      )}

      <div className="field">
        <label htmlFor="enquiry-message">Tell us about it</label>
        <textarea
          id="enquiry-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          maxLength={4000}
          required
          placeholder={
            isEvent
              ? 'The kind of event, the dates you are weighing, and anything that would make or break it for you.'
              : 'How can we help?'
          }
        />
        <span className="hint">{message.length} / 4000</span>
      </div>

      <button type="submit" className="button" disabled={sending}>
        {sending ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  )
}
