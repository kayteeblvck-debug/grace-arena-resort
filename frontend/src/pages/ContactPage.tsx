import Accordion from '../components/Accordion'
import EnquiryForm from '../components/EnquiryForm'
import PageBanner from '../components/PageBanner'
import Reveal from '../components/Reveal'
import { faqs, gettingHere, resort } from '../content/resort'

export default function ContactPage() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(resort.mapQuery)}&output=embed`

  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Come and find us"
        lead={`${resort.village}, ${resort.town} — about an hour and a half from Ibadan, on the Ibarapa road.`}
        image="/images/resort/garden-lawn.jpg"
        crumbs={[{ label: 'Contact' }]}
      />

      <section className="section container">
        <div className="contact-layout">
          <Reveal>
            <div className="contact-block">
              <h4>Reservations</h4>
              <p>
                <a className="link-inline" href={`tel:${resort.phone.replaceAll(' ', '')}`}>
                  {resort.phone}
                </a>
              </p>
              <p>
                <a className="link-inline" href={`mailto:${resort.email}`}>
                  {resort.email}
                </a>
              </p>
              <p className="muted" style={{ marginTop: '0.5rem' }}>
                Open daily, 8:00 am to 8:00 pm.
              </p>
            </div>

            <div className="contact-block">
              <h4>Events</h4>
              <p>
                <a className="link-inline" href={`mailto:${resort.eventsEmail}`}>
                  {resort.eventsEmail}
                </a>
              </p>
              <p className="muted" style={{ marginTop: '0.5rem' }}>
                Site visits by appointment, Monday to Saturday.
              </p>
            </div>

            <div className="contact-block">
              <h4>Address</h4>
              <address style={{ fontStyle: 'normal', lineHeight: 1.9 }}>
                {resort.addressLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </address>
            </div>

            <div className="contact-block">
              <h4>Getting here</h4>
              <dl className="spec-list">
                {gettingHere.map((leg) => (
                  <div key={leg.from}>
                    <dt>{leg.from}</dt>
                    <dd>{leg.detail}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="contact-block">
              <h4>Arrival</h4>
              <p className="muted">
                Check-in from {resort.checkInTime}, check-out by {resort.checkOutTime}. Transfers from
                Ibadan or Lagos can be arranged — send your flight or departure time and we will meet
                you.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="card card-pad">
              <span className="eyebrow">Write to us</span>
              <h2 style={{ margin: '0.5rem 0 1.75rem' }}>Send a message</h2>
              <EnquiryForm />
            </div>

            <iframe
              className="map-frame"
              style={{ marginTop: '2rem' }}
              src={mapSrc}
              title={`Map showing ${resort.town}, ${resort.state}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Reveal>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--surface-sunken)' }}>
        <div className="container narrow">
          <Reveal className="section-head centred">
            <span className="eyebrow">Questions</span>
            <h2>The things people ask first</h2>
          </Reveal>
          <Reveal>
            <Accordion entries={faqs} />
          </Reveal>
        </div>
      </section>
    </>
  )
}
