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
    <div className="fixed -top-24 left-0 z-50">
      <a
        href="#main-content"
        className="absolute top-0 left-0 bg-primary text-primary-content px-4 py-2 no-underline font-semibold rounded-br-lg transition-transform duration-200 ease-in-out -translate-y-full focus:translate-y-24 focus:outline focus:outline-2 focus:outline-yellow-400 focus:outline-offset-2 hover:bg-primary-focus"
        onClick={handleSkipToContent}
        onKeyDown={(e) => e.key === 'Enter' && handleSkipToContent(e)}
      >
        {t('a11y.skipToContent')}
      </a>
      <a
        href="#main-navigation"
        className="absolute top-0 left-0 bg-primary text-primary-content px-4 py-2 no-underline font-semibold rounded-br-lg transition-transform duration-200 ease-in-out -translate-y-full focus:translate-y-24 focus:outline focus:outline-2 focus:outline-yellow-400 focus:outline-offset-2 hover:bg-primary-focus ml-32"
        onClick={handleSkipToNavigation}
        onKeyDown={(e) => e.key === 'Enter' && handleSkipToNavigation(e)}
      >
        Skip to navigation
      </a>
    </div>
  )
}