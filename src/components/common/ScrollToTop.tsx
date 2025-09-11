import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Immediately scroll to the top on every route change
    // Use instant behavior to ensure it happens immediately
    window.scrollTo({ top: 0, behavior: 'auto' })

    // Also ensure we're at the top using scrollTop
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    // Move focus to the main content for better UX/A11y
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      const main = document.getElementById('main-content') as HTMLElement | null
      if (main) {
        main.focus({ preventScroll: true })
      }
    }, 0)
  }, [pathname])

  return null
}

