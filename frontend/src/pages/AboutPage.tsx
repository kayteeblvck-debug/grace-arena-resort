import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import Reveal from '../components/Reveal'
import ResortImage from '../components/ResortImage'
import { resort, story, testimonials } from '../content/resort'

export default function AboutPage() {
  return (
    <>
      <PageBanner
        eyebrow="Our story"
        title="Built in Ibarapa, for Ibarapa"
        lead={story.lead}
        image="/images/resort/exterior-evening.jpg"
        crumbs={[{ label: 'Our story' }]}
      />

      <section className="section container narrow">
        {story.paragraphs.map((paragraph, index) => (
          <Reveal key={paragraph.slice(0, 24)} delay={index * 70}>
            <p
              className={index === 0 ? 'lead' : undefined}
              style={{ marginTop: index === 0 ? 0 : '1.5rem' }}
            >
              {paragraph}
            </p>
          </Reveal>
        ))}
      </section>

      <section className="section" style={{ background: 'var(--surface-sunken)' }}>
        <div className="container">
          <Reveal className="section-head centred">
            <span className="eyebrow">What we hold to</span>
            <h2>Four things we will not trade away</h2>
          </Reveal>

          <div className="grid cols-4">
            {story.values.map((value, index) => (
              <Reveal key={value.name} className="card card-pad" delay={index * 90}>
                <h3>{value.name}</h3>
                <div className="rule" />
                <p className="muted">{value.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="split">
          <Reveal className="split-media">
            <div className="media ratio-4-3">
              <ResortImage src="/images/experiences/twins.jpg" alt="Igbo-Ora, the twin capital of the world" />
            </div>
          </Reveal>

          <Reveal className="split-copy" delay={120}>
            <span className="eyebrow">Where we are</span>
            <h2>The twin capital of the world</h2>
            <div className="rule" />
            <p>
              {resort.town} records more twin births than anywhere else on earth. Nobody has fully
              explained it — the theories run from the ìlàsa leaf in the local diet to genetics that
              have concentrated over generations — and the town has long since stopped waiting for
              permission to celebrate it.
            </p>
            <p>
              The World Twins Festival fills these streets once a year. If your dates fall near it,
              say so when you book: we keep rooms back for it, and they go early.
            </p>
            <div className="button-row">
              <Link className="button ghost" to="/experiences">
                Experiences in Igbo-Ora
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section on-dark">
        <div className="container">
          <Reveal className="section-head centred">
            <span className="eyebrow">In their words</span>
            <h2>What guests tell us afterwards</h2>
          </Reveal>

          <div className="grid cols-3">
            {testimonials.map((entry, index) => (
              <Reveal key={entry.name} as="figure" delay={index * 100} className="card card-pad">
                <blockquote style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.75 }}>
                  “{entry.quote}”
                </blockquote>
                <figcaption style={{ marginTop: '1.5rem' }}>
                  <span className="eyebrow">{entry.name}</span>
                  <span className="muted" style={{ fontSize: '0.86rem' }}>
                    {entry.context}
                  </span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container narrow" style={{ textAlign: 'center' }}>
        <Reveal>
          <span className="eyebrow">Come and see</span>
          <h2>Fourteen acres are hard to photograph</h2>
          <p className="lead" style={{ marginTop: '1.5rem' }}>
            Book a night and judge it yourself. If it is not what we said it was, tell us — we would
            rather hear it from you than read it later.
          </p>
          <div className="button-row" style={{ justifyContent: 'center' }}>
            <Link className="button" to="/book">
              Check availability
            </Link>
            <Link className="button ghost" to="/contact">
              Ask us something
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
