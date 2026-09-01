/**
 * The Grace Arena mark, redrawn as SVG so it stays crisp and can invert for the
 * dark header. The blades take their colour from `--logo-blade` and the echoes from
 * `--logo-accent`, both set by whatever the logo sits on.
 *
 * The original artwork is kept at /images/brand/logo-original.jpg — swap this for the
 * real vector when the resort supplies one.
 */

const BLADES = [0, 72, 144, 216, 288]

export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg
      className="logo-mark"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      {BLADES.map((angle) => (
        <g key={angle} transform={`rotate(${angle} 50 50)`}>
          {/* Gold sits behind and offset, so it shows in the notch beside each blade. */}
          <path d="M52 16 L78 44 L60 50 Z" fill="var(--logo-accent)" />
          <path d="M48 8 L70 30 L54 56 Z" fill="var(--logo-blade)" />
        </g>
      ))}
    </svg>
  )
}

export default function Logo({ size = 42 }: { size?: number }) {
  return (
    <span className="logo">
      <LogoMark size={size} />
      <span className="logo-words">
        <span className="logo-name">Grace Arena</span>
        <span className="logo-sub">Resorts</span>
      </span>
    </span>
  )
}
