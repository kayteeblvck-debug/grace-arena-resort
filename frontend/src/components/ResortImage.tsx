import { useState } from 'react'

/**
 * An <img> that degrades to an on-brand panel instead of a broken icon.
 *
 * Most photography for the site has not been shot yet, so the room and facility
 * records point at paths under /images that may not exist. When one 404s we swap in
 * a generated panel keyed off the caption, which means dropping real files into
 * frontend/public/images later needs no code change at all.
 */

const GOLD = '#e5b93c'
const IVORY = '#fbf8f1'

/**
 * Warm bronzes rather than near-black. The panels sit under the hero's darkening
 * gradient in places, and a dark placeholder there just reads as a broken page.
 */
const SHADES = [
  ['#4a3a1e', '#8a6a2c', '#c9a24a'],
  ['#3d3524', '#6f5c33', '#b98f3f'],
  ['#4e3b28', '#8a6437', '#cfa055'],
  ['#39301f', '#7a6330', '#c19746'],
]

/**
 * `card` fills a bounded frame, so it carries a caption saying what the photograph
 * will be. `backdrop` sits behind headline text at full-bleed sizes, where that
 * caption would be scaled up to compete with the headline — so it is dropped, and
 * the whole panel is darkened to keep the text over it legible.
 */
export type ImageVariant = 'card' | 'backdrop'

/** XML-escapes a caption so a name like "Bar & Lounge" cannot break the document. */
function escapeXml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

/**
 * Greedily packs words into at most `maxLines` lines of roughly `width` characters,
 * truncating with an ellipsis if the caption is longer than that allows.
 */
function wrap(text: string, width: number, maxLines: number): string[] {
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let current = ''
  let dropped = false

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word

    if (candidate.length <= width || !current) {
      current = candidate
      continue
    }

    if (lines.length + 1 === maxLines) {
      // No room for another line — everything from here on is lost.
      dropped = true
      break
    }
    lines.push(current)
    current = word
  }

  if (current) lines.push(current)

  const last = lines.length - 1
  if (last >= 0) {
    if (lines[last].length > width) {
      // A single word longer than the line — hard-cut it.
      lines[last] = `${lines[last].slice(0, width - 1)}…`
    } else if (dropped) {
      lines[last] = `${lines[last]}…`
    }
  }

  return lines.map(escapeXml)
}

/** Deterministic hash so the same caption always produces the same panel. */
function hash(value: string): number {
  let result = 0
  for (let index = 0; index < value.length; index += 1) {
    result = (result * 31 + value.charCodeAt(index)) >>> 0
  }
  return result
}

function placeholder(caption: string, variant: ImageVariant): string {
  const seed = hash(caption)
  const [dark, mid, light] = SHADES[seed % SHADES.length]
  const angle = 20 + (seed % 50)
  const tilt = (seed >> 3) % 72
  const backdrop = variant === 'backdrop'

  const lines = wrap(caption.toUpperCase(), 20, 2)

  // The brand pinwheel, oversized and low-contrast, as a watermark.
  const bladeOpacity = backdrop ? [0.05, 0.07] : [0.09, 0.13]
  const blades = [0, 72, 144, 216, 288]
    .map(
      (rotation) =>
        `<g transform="rotate(${rotation + tilt} 400 290)">` +
        `<path d="M416 128 L624 352 L480 400 Z" fill="${IVORY}" opacity="${bladeOpacity[0]}"/>` +
        `<path d="M384 64 L560 240 L432 448 Z" fill="${IVORY}" opacity="${bladeOpacity[1]}"/>` +
        `</g>`,
    )
    .join('')

  // Centred, not along the bottom edge: these panels are cropped with object-fit
  // cover into frames of every aspect ratio, and only the middle is guaranteed to
  // survive that crop. Two short lines keep the text inside the narrowest case.
  const top = 300 - (lines.length - 1) * 14
  const caption_ = backdrop
    ? ''
    : lines
        .map(
          (line, index) =>
            `<text x="400" y="${top + index * 30}" text-anchor="middle" fill="${IVORY}"
               font-family="Helvetica,Arial,sans-serif" font-size="18" letter-spacing="3">${line}</text>`,
        )
        .join('') +
      `<text x="400" y="${top + lines.length * 30 + 6}" text-anchor="middle" fill="${GOLD}" fill-opacity="0.9"
         font-family="Helvetica,Arial,sans-serif" font-size="10" letter-spacing="3">PHOTOGRAPHY TO FOLLOW</text>`

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(${angle} 0.5 0.5)">
        <stop offset="0%" stop-color="${dark}"/>
        <stop offset="52%" stop-color="${mid}"/>
        <stop offset="100%" stop-color="${light}"/>
      </linearGradient>
      <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="${backdrop ? 0.32 : 0}"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="${backdrop ? 0.62 : 0.45}"/>
      </linearGradient>
    </defs>
    <rect width="800" height="600" fill="url(#g)"/>
    ${blades}
    <rect width="800" height="600" fill="url(#s)"/>
    ${caption_}
  </svg>`

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

interface ResortImageProps {
  src?: string | null
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  sizes?: string
  variant?: ImageVariant
}

export default function ResortImage({
  src,
  alt,
  className,
  loading = 'lazy',
  sizes,
  variant = 'card',
}: ResortImageProps) {
  const [failed, setFailed] = useState(false)
  const resolved = !src || failed ? placeholder(alt, variant) : src

  return (
    <img
      className={className}
      src={resolved}
      alt={alt}
      loading={loading}
      sizes={sizes}
      onError={() => setFailed(true)}
    />
  )
}
