import { useEffect } from 'react'
import ResortImage from './ResortImage'

/**
 * Full-screen image viewer. Closes on Escape, on the backdrop, and on the button —
 * and locks the page behind it so the background does not scroll under the image.
 */
export default function Lightbox({
  image,
  caption,
  onClose,
}: {
  image: string
  caption?: string
  onClose: () => void
}) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={caption ?? 'Photograph'}
      onClick={onClose}
    >
      <button type="button" className="lightbox-close" aria-label="Close" onClick={onClose}>
        ×
      </button>
      <div onClick={(event) => event.stopPropagation()}>
        <ResortImage src={image} alt={caption ?? 'Grace Arena Resorts'} loading="eager" />
        {caption && <p className="lightbox-caption">{caption}</p>}
      </div>
    </div>
  )
}
