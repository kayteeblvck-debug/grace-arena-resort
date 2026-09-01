import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'
import AvailabilitySearch from '../components/AvailabilitySearch'
import Reveal from '../components/Reveal'
import ResortImage from '../components/ResortImage'
import RoomCard from '../components/RoomCard'
import {
  experiences,
  facilities,
  gettingHere,
  heroSlides,
  highlights,
  resort,
  testimonials,
} from '../content/resort'
import { useApiResource } from '../lib/useApiResource'

export default function HomePage() {
  const { data: rooms } = useApiResource('rooms:available', () => api.listRooms(true))

  // Featured first, then whatever else is on sale, capped at three.
  const showcase = (rooms ?? []).slice().sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 3)

  return (
    <>
      <Hero />
      <AvailabilitySearch className="floating" />

      {/* ---------- welcome ---------- */}
      <section className="section container">
        <div className="split">
          <Reveal className="split-media">
            <div className="media ratio-3-4">
              <ResortImage src="/images/resort/exterior-evening.jpg" alt="The main house at dusk" />
            </div>
          </Reveal>

          <Reveal className="split-copy" delay={120}>
            <span className="eyebrow">Ẹ káàbọ̀ · Welcome</span>
            <h2>{resort.tagline}</h2>
            <div className="rule" />
            <p className="lead">
              Fourteen acres in {resort.village}, on the Ibarapa side of {resort.state}. Twenty-eight
              suites and villas, an event hall built for six hundred, and a kitchen that buys from the{' '}
              {resort.town} market on the morning it cooks.
            </p>
            <p style={{ marginTop: '1.15rem' }} className="muted">
              We are an hour and a half from Ibadan and a world away from it. Come for a weekend, a
              wedding, or the three days it takes to finish something properly.
            </p>
            <div className="button-row">
              <Link className="button" to="/accommodation">
                See the suites
              </Link>
              <Link className="button ghost" to="/about">
                Our story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- the numbers ---------- */}
      <section className="container">
        <div className="stats">
          {highlights.map((item, index) => (
            <Reveal className="stat" key={item.label} delay={index * 90}>
              <div className="stat-figure">{item.figure}</div>
              <div className="stat-label">{item.label}</div>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- accommodation ---------- */}
      <section className="section container">
        <Reveal className="section-head centred">
          <span className="eyebrow">Accommodation</span>
          <h2>Rooms that were designed for the heat, not in spite of it</h2>
          <p className="lead">
            Deep verandas, cross-ventilation, cloth woven two towns over, and air conditioning that
            works because it has power behind it.
          </p>
        </Reveal>

        {showcase.length > 0 ? (
          <div className="grid cols-3">
            {showcase.map((room, index) => (
              <Reveal key={room.id} delay={index * 100}>
                <RoomCard room={room} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="grid cols-3">
            {[0, 1, 2].map((key) => (
              <div key={key} className="skeleton" style={{ aspectRatio: '3 / 4' }} />
            ))}
          </div>
        )}

        <div className="button-row" style={{ justifyContent: 'center' }}>
          <Link className="button ghost" to="/accommodation">
            All accommodation
          </Link>
        </div>
      </section>

      {/* ---------- the estate ---------- */}
      <section className="section on-dark">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">The estate</span>
            <h2>Six reasons nobody leaves the grounds</h2>
          </Reveal>

          <div className="grid cols-3">
            {facilities.map((facility, index) => (
              <Reveal key={facility.slug} delay={(index % 3) * 100}>
                <Link className="tile tall" to="/experiences">
                  <ResortImage src={facility.image} alt={facility.name} />
                  <div className="tile-body">
                    <span className="eyebrow">{facility.kicker}</span>
                    <h3>{facility.name}</h3>
                    <p>{facility.body}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- the arena ---------- */}
      <section className="section container">
        <div className="split reverse">
          <Reveal className="split-media">
            <div className="media ratio-4-3">
              <ResortImage src="/images/resort/arena-wedding.jpg" alt="The Arena set for a wedding" />
            </div>
          </Reveal>

          <Reveal className="split-copy" delay={120}>
            <span className="eyebrow">Events &amp; weddings</span>
            <h2>The hall the whole place was built around</h2>
            <div className="rule" />
            <p>
              Six hundred seated under one column-free roof, with a service kitchen, a dedicated
              generator ring, and a bridal wing with two dressing rooms and a door that locks.
            </p>
            <p>
              Beside it, four hundred square metres of level lawn for outdoor ceremonies — and
              twenty-eight rooms behind that, so nobody has to drive home.
            </p>
            <div className="button-row">
              <Link className="button" to="/events">
                Plan an event
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- experiences ---------- */}
      <section className="section" style={{ background: 'var(--surface-sunken)' }}>
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Experiences</span>
            <h2>Igbo-Ora is the reason to come, not the address</h2>
            <p className="lead">
              The town records more twin births than anywhere on earth. It also has dye pits, a
              market worth getting up for, and drummers who have been playing since they were nine.
            </p>
          </Reveal>

          <div className="grid cols-3">
            {experiences.slice(0, 3).map((experience, index) => (
              <Reveal key={experience.name} delay={index * 110}>
                <Link className="tile wide" to="/experiences">
                  <ResortImage src={experience.image} alt={experience.name} />
                  <div className="tile-body">
                    <span className="eyebrow">{experience.duration}</span>
                    <h3>{experience.name}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="button-row">
            <Link className="link-underline" to="/experiences">
              All experiences
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- a word from guests ---------- */}
      <section className="section quote-panel">
        <div className="container">
          <Reveal as="figure">
            <blockquote className="display-quote">“{testimonials[0].quote}”</blockquote>
            <figcaption>
              {testimonials[0].name}
              <span>{testimonials[0].context}</span>
            </figcaption>
          </Reveal>
        </div>
      </section>

      {/* ---------- getting here ---------- */}
      <section className="section container">
        <div className="split">
          <Reveal className="split-copy">
            <span className="eyebrow">Getting here</span>
            <h2>Far enough to feel like somewhere else</h2>
            <div className="rule" />
            <dl className="spec-list" style={{ marginTop: '2rem' }}>
              {gettingHere.map((leg) => (
                <div key={leg.from}>
                  <dt>{leg.from}</dt>
                  <dd>{leg.detail}</dd>
                </div>
              ))}
            </dl>
            <div className="button-row">
              <Link className="button ghost" to="/contact">
                Directions &amp; contact
              </Link>
            </div>
          </Reveal>

          <Reveal className="split-media" delay={120}>
            <div className="media ratio-4-3">
              <ResortImage src="/images/resort/orchard.jpg" alt="The mango orchard" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- closing call to action ---------- */}
      <section className="section on-dark" style={{ textAlign: 'center' }}>
        <div className="container narrow">
          <Reveal>
            <span className="eyebrow">Reserve</span>
            <h2>Your dates, held in a few minutes</h2>
            <p className="lead" style={{ marginTop: '1.5rem' }}>
              Create an account, confirm your email, and choose your suite. Our reservations desk
              confirms most bookings within a few hours.
            </p>
            <div className="button-row" style={{ justifyContent: 'center' }}>
              <Link className="button" to="/book">
                Check availability
              </Link>
              <Link className="button ghost" to="/contact">
                Speak to us
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

/** Full-height slideshow. Advances on a timer, and can be driven by the rules below. */
function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % heroSlides.length)
    }, 7000)
    return () => window.clearInterval(timer)
  }, [])

  const slide = heroSlides[index]

  return (
    <section className="hero">
      <div className="hero-media">
        {heroSlides.map((entry, position) => (
          <ResortImage
            key={entry.image}
            className={position === index ? 'active' : ''}
            src={entry.image}
            alt={entry.heading}
            loading={position === 0 ? 'eager' : 'lazy'}
            variant="backdrop"
          />
        ))}
      </div>

      <div className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">{slide.eyebrow}</span>
          <h1>{slide.heading}</h1>
          <p className="lead">{slide.body}</p>

          <div className="button-row">
            <Link className="button" to="/book">
              Reserve a stay
            </Link>
            <Link className="button ghost" to="/accommodation">
              Explore the suites
            </Link>
          </div>

          <div className="hero-dots" role="tablist" aria-label="Featured views">
            {heroSlides.map((entry, position) => (
              <button
                key={entry.image}
                type="button"
                role="tab"
                aria-selected={position === index}
                aria-label={entry.heading}
                className={`hero-dot ${position === index ? 'active' : ''}`}
                onClick={() => setIndex(position)}
              />
            ))}
          </div>
        </div>
      </div>

      <span className="hero-scroll" aria-hidden="true">
        Scroll
      </span>
    </section>
  )
}
