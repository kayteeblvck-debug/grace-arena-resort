import { useState } from 'react'
import Lightbox from '../components/Lightbox'
import PageBanner from '../components/PageBanner'
import Reveal from '../components/Reveal'
import ResortImage from '../components/ResortImage'
import { gallery } from '../content/resort'

export default function GalleryPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <PageBanner
        eyebrow="Gallery"
        title="The place, in pictures"
        lead="The grounds, the rooms, the Arena and the town. Photography is still being shot — the framed panels are placeholders for images to come."
        image="/images/resort/pool-dusk.jpg"
        crumbs={[{ label: 'Gallery' }]}
      />

      <section className="section container">
        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <Reveal key={item.image} delay={(index % 3) * 80}>
              <button
                type="button"
                className="gallery-item"
                onClick={() => setOpen(index)}
                aria-label={`Open ${item.caption}`}
              >
                <ResortImage src={item.image} alt={item.caption} />
                <span className="gallery-caption">{item.caption}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {open !== null && (
        <Lightbox
          image={gallery[open].image}
          caption={gallery[open].caption}
          onClose={() => setOpen(null)}
        />
      )}
    </>
  )
}
