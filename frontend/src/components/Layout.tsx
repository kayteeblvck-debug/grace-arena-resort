import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { navLinks, resort } from '../content/resort'
import Logo from './Logo'
import ScrollToTop from './ScrollToTop'

/** Pages whose first element is a full-bleed hero the header can float over. */
const TRANSPARENT_HEADER_ROUTES = ['/', '/about', '/experiences', '/events', '/gallery']

export default function Layout() {
  const { pathname } = useLocation()
  const { user, signOut } = useAuth()
  // Read once at mount rather than in the effect: a reload partway down a page
  // should paint the solid header immediately, not flash the transparent one.
  const [scrolled, setScrolled] = useState(() => window.scrollY > 40)

  // The drawer remembers which route it was opened on, so any navigation — a link
  // inside it, or the browser's back button — closes it without needing an effect.
  const [menu, setMenu] = useState({ open: false, at: pathname })
  const menuOpen = menu.open && menu.at === pathname
  const setMenuOpen = (open: boolean) => setMenu({ open, at: pathname })

  const overHero = TRANSPARENT_HEADER_ROUTES.includes(pathname) || /^\/accommodation\/.+/.test(pathname)
  const solid = scrolled || !overHero || menuOpen

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Stop the page behind the drawer scrolling while it is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const accountLink = user ? '/account' : '/sign-in'
  const accountLabel = user ? user.firstName : 'Sign in'

  return (
    <div className="app-shell">
      <ScrollToTop />

      <header className={`site-header ${solid ? 'solid' : 'transparent'}`}>
        <Link to="/" className="brand" aria-label={`${resort.name} — home`}>
          <Logo size={solid ? 36 : 42} />
        </Link>

        <nav className="site-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <NavLink
            to={accountLink}
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            {accountLabel}
          </NavLink>
          <Link className="button small header-reserve" to="/book">
            Reserve
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="mobile-nav" id="mobile-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink to={accountLink} className={({ isActive }) => (isActive ? 'active' : undefined)}>
            {user ? 'My account' : 'Sign in'}
          </NavLink>

          <div className="mobile-nav-footer">
            <Link className="button block" to="/book">
              Reserve a stay
            </Link>
            {user && (
              <button type="button" className="button ghost block" onClick={signOut}>
                Sign out
              </button>
            )}
          </div>
        </div>
      )}

      <main className="site-main">
        <Outlet />
      </main>

      <SiteFooter />
    </div>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Logo size={44} />
            <p className="footer-blurb">
              A Yoruba country estate in {resort.village}, {resort.town} — suites, villas and an
              event arena on fourteen acres of {resort.state}.
            </p>
          </div>

          <div className="footer-col">
            <h4>Visit</h4>
            <ul>
              <li>
                <Link to="/accommodation">Accommodation</Link>
              </li>
              <li>
                <Link to="/experiences">Experiences</Link>
              </li>
              <li>
                <Link to="/events">Events &amp; weddings</Link>
              </li>
              <li>
                <Link to="/gallery">Gallery</Link>
              </li>
              <li>
                <Link to="/book">Reserve a stay</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Find us</h4>
            <address>
              {resort.addressLines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </address>
            <ul style={{ marginTop: '1rem' }}>
              <li>
                <a href={`tel:${resort.phone.replaceAll(' ', '')}`}>{resort.phone}</a>
              </li>
              <li>
                <a href={`mailto:${resort.email}`}>{resort.email}</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Guests</h4>
            <ul>
              <li>
                <Link to="/account">My bookings</Link>
              </li>
              <li>
                <Link to="/create-account">Create an account</Link>
              </li>
              <li>
                <Link to="/contact">Contact us</Link>
              </li>
              <li>
                <Link to="/about">Our story</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} {resort.name}. All rights reserved.
          </p>
          <div className="footer-socials">
            {resort.socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noreferrer">
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
