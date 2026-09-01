import { Link } from 'react-router-dom'
import PageBanner from '../components/PageBanner'
import Reveal from '../components/Reveal'
import ResortImage from '../components/ResortImage'
import { experiences, facilities } from '../content/resort'

export default function ExperiencesPage() {
  return (
    <>
      <PageBanner
        eyebrow="Experiences"
        title="The estate, and the town it belongs to"
        lead="Six things to do inside the walls, and six reasons to go beyond them. All of it arranged at the desk, most of it with a day's notice."
        image="/images/experiences/drums.jpg"
        crumbs={[{ label: 'Experiences' }]}
      />

      <section className="section container">
        <Reveal className="section-head">
          <span className="eyebrow">On the estate</span>
          <h2>Inside the walls</h2>
          <p className="lead">
            Fourteen acres, and no particular reason to leave any of them.
          </p>
        </Reveal>

        <div className="grid cols-2">
          {facilities.map((facility, index) => (
            <Reveal key={facility.slug} className="card" delay={(index % 2) * 100}>
              <div className="media ratio-16-9">
                <ResortImage src={facility.image} alt={facility.name} />
              </div>
              <div className="card-pad">
                <span className="eyebrow">{facility.kicker}</span>
                <h3 style={{ marginTop: '0.5rem' }}>{facility.name}</h3>
                <div className="rule" />
                <p className="muted">{facility.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section on-dark">
        <div className="container">
          <Reveal className="section-head">
            <span className="eyebrow">Beyond the gate</span>
            <h2>Igbo-Ora, properly</h2>
            <p className="lead">
              Guided by people who live here. Booked at the desk, or added to your reservation when
              you tell us your dates.
            </p>
          </Reveal>

          <div className="grid cols-3">
            {experiences.map((experience, index) => (
              <Reveal key={experience.name} className="card" delay={(index % 3) * 90}>
                <div className="media ratio-4-3">
                  <ResortImage src={experience.image} alt={experience.name} />
                </div>
                <div className="card-pad">
                  <span className="eyebrow">{experience.duration}</span>
                  <h3 style={{ marginTop: '0.5rem' }}>{experience.name}</h3>
                  <div className="rule" />
                  <p className="muted">{experience.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section container narrow" style={{ textAlign: 'center' }}>
        <Reveal>
          <span className="eyebrow">Plan it with us</span>
          <h2>Tell us what you want the days to look like</h2>
          <p className="lead" style={{ marginTop: '1.5rem' }}>
            Send your dates and how many of you there are, and the desk will put together an
            itinerary before you arrive — or leave it entirely empty, which is also a plan.
          </p>
          <div className="button-row" style={{ justifyContent: 'center' }}>
            <Link className="button" to="/book">
              Check availability
            </Link>
            <Link className="button ghost" to="/contact">
              Talk to the desk
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
