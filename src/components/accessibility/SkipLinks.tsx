import { useLanguage } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'

export function SkipLinks() {
  const { t } = useLanguage()
  const { settings } = useAccessibility()

  if (!settings.skipLinks) return null

  const handleSkipToContent = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault()
    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.focus()
      mainContent.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSkipToNavigation = (event: React.MouseEvent | React.KeyboardEvent) => {
    event.preventDefault()
    const navigation = document.getElementById('main-navigation')
    if (navigation) {
      const firstLink = navigation.querySelector('a, button') as HTMLElement
      firstLink?.focus()
    }
  }

  return (
    <div className="skip-links">
      <a
        href="#main-content"
        className="skip-link"
        onClick={handleSkipToContent}
        onKeyDown={(e) => e.key === 'Enter' && handleSkipToContent(e)}
      >
        {t('a11y.skipToContent')}
      </a>
      <a
        href="#main-navigation"
        className="skip-link"
        onClick={handleSkipToNavigation}
        onKeyDown={(e) => e.key === 'Enter' && handleSkipToNavigation(e)}
      >
        Skip to navigation
      </a>
      
      <style jsx>{`
        .skip-links {
          position: fixed;
          top: -100px;
          left: 0;
          z-index: 1000;
        }
        
        .skip-link {
          position: absolute;
          top: 0;
          left: 0;
          background: var(--primary-color, #3b82f6);
          color: white;
          padding: 0.5rem 1rem;
          text-decoration: none;
          font-weight: 600;
          border-radius: 0 0 0.375rem 0;
          transition: transform 0.2s ease-in-out;
          transform: translateY(-100%);
        }
        
        .skip-link:focus {
          transform: translateY(100px);
          outline: 2px solid #fbbf24;
          outline-offset: 2px;
        }
        
        .skip-link:hover {
          background: var(--primary-dark, #2563eb);
        }
        
        /* High contrast mode */
        :global(.high-contrast) .skip-link {
          background: #000;
          color: #fff;
          border: 2px solid #fff;
        }
        
        :global(.high-contrast) .skip-link:hover {
          background: #fff;
          color: #000;
        }
      `}</style>
    </div>
  )
}