import EnquiryForm from '../components/EnquiryForm'
import PageBanner from '../components/PageBanner'
import Reveal from '../components/Reveal'
import ResortImage from '../components/ResortImage'
import { eventSpaces, eventTypes, resort } from '../content/resort'

export default function EventsPage() {
  return (
    <>
      <PageBanner
        eyebrow="Events & weddings"
        title="The hall this place was built around"
        lead="Six hundred seated, a lawn for the ceremony, twenty-eight rooms behind it, and power that does not go. The Arena came first; everything else grew around it."
        image="/images/resort/arena-wedding.jpg"
        crumbs={[{ label: 'Events' }]}
      />

      <section className="section container">
        <Reveal className="section-head">
          <span className="eyebrow">The spaces</span>
          <h2>Four rooms, and one of them has no walls</h2>
          <p className="lead">
            Capacities are what the room genuinely holds with a dance floor and a service aisle — not
            the number you get by counting chairs.
          </p>
        </Reveal>

        <div className="grid" style={{ gap: '1.5rem' }}>
          {eventSpaces.map((space, index) => (
            <Reveal key={space.name} className="space-card" delay={index * 80}>
              <div className="media ratio-4-3">
                <ResortImage src={space.image} alt={space.name} />
              </div>
              <div className="space-card-body">
                <h3>{space.name}</h3>
                <p className="muted">{space.body}</p>

                <div className="capacity-row">
                  <div>
                    <span className="figure tabular">{space.seated}</span>
                    <span className="label">Seated</span>
                  </div>
                  <div>
                    <span className="figure tabular">{space.standing}</span>
                    <span className="label">Standing</span>
                  </div>
                </div>

                <ul className="feature-chips">
                  {space.features.map((feature) => (
                    <li key={feature} className="badge">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section on-dark">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">What we host</span>
            <h2>Weddings, mostly — but not only</h2>
          </Reveal>

          <div className="grid cols-3">
            {eventTypes.map((type, index) => (
              <Reveal key={type.value} className="card card-pad" delay={(index % 3) * 80}>
                <h3>{type.label}</h3>
                <div className="rule" />
                <p className="muted">{type.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="split">
          <Reveal className="split-copy">
            <span className="eyebrow">How it works</span>
            <h2>We will hold your date for a fortnight, free</h2>
            <div className="rule" />
            <p>
              Send us the date and roughly how many guests. We will tell you within a day whether the
              Arena is free, what it costs, and what else is happening on the estate that weekend —
              because you should know if there is another party next door.
            </p>
            <p>
              If it works, we hold the date provisionally for fourteen days at no cost while you
              settle the rest. Nothing is signed and nothing is charged until you are ready.
            </p>
            <p className="muted" style={{ marginTop: '1.5rem' }}>
              Events team: <a className="link-inline" href={`mailto:${resort.eventsEmail}`}>{resort.eventsEmail}</a>
              {' · '}
              <a className="link-inline" href={`tel:${resort.phone.replaceAll(' ', '')}`}>{resort.phone}</a>
            </p>
          </Reveal>

          <Reveal className="split-media card card-pad" delay={120}>
            <span className="eyebrow">Enquire</span>
            <h3 style={{ margin: '0.5rem 0 1.5rem' }}>Tell us about your event</h3>
            <EnquiryForm defaultType="WEDDING" />
          </Reveal>
        </div>
      </section>
    </>
  )
}
