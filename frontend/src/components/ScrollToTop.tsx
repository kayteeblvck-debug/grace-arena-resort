import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router keeps the scroll position across navigations, which on a site of
 * full-height heroes means landing halfway down a new page. This resets it, but
 * leaves in-page anchors (#the-arena) alone.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) return
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname, hash])

  return null
}
