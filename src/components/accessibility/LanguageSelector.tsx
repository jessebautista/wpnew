import { useState, useRef, useEffect } from 'react'
import { Globe, ChevronDown } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'inline'
  showFlag?: boolean
  showText?: boolean
  className?: string
}

export function LanguageSelector({ 
  variant = 'dropdown', 
  showFlag = true, 
  showText = true,
  className = '' 
}: LanguageSelectorProps) {
  const { language, setLanguage, supportedLanguages, t } = useLanguage()
  const { announceToScreenReader, settings } = useAccessibility()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const currentLanguage = supportedLanguages.find(lang => lang.code === language)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'Escape':
          setIsOpen(false)
          buttonRef.current?.focus()
          break
        case 'ArrowDown':
          event.preventDefault()
          const nextItem = document.querySelector('.language-item:focus')?.nextElementSibling as HTMLButtonElement
          nextItem?.focus()
          break
        case 'ArrowUp':
          event.preventDefault()
          const prevItem = document.querySelector('.language-item:focus')?.previousElementSibling as HTMLButtonElement
          prevItem?.focus()
          break
        case 'Home':
          event.preventDefault()
          const firstItem = document.querySelector('.language-item') as HTMLButtonElement
          firstItem?.focus()
          break
        case 'End':
          event.preventDefault()
          const items = document.querySelectorAll('.language-item')
          const lastItem = items[items.length - 1] as HTMLButtonElement
          lastItem?.focus()
          break
      }
    }

    if (isOpen && settings.keyboardNavigation) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, settings.keyboardNavigation])

  const handleLanguageChange = (langCode: string) => {
    const newLanguage = supportedLanguages.find(lang => lang.code === langCode)
    if (newLanguage) {
      setLanguage(langCode as any)
      setIsOpen(false)
      announceToScreenReader(`Language changed to ${newLanguage.name}`)
      
      // Announce to screen reader optimized users
      if (settings.screenReaderOptimized) {
        setTimeout(() => {
          announceToScreenReader(t('common.loading'), 'assertive')
        }, 500)
      }
    }
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleToggle()
    }
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {supportedLanguages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`btn btn-sm ${language === lang.code ? 'btn-primary' : 'btn-outline'}`}
            aria-pressed={language === lang.code}
            aria-label={`Switch to ${lang.name} (${lang.nativeName})`}
          >
            {showFlag && <span aria-hidden="true">{lang.flag}</span>}
            {showText && <span>{lang.nativeName}</span>}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="btn btn-ghost btn-sm"
        aria-label={t('a11y.languageSelector')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls="language-menu"
      >
        <Globe className="w-4 h-4" aria-hidden="true" />
        {showFlag && currentLanguage && (
          <span aria-hidden="true">{currentLanguage.flag}</span>
        )}
        {showText && currentLanguage && (
          <span>{currentLanguage.nativeName}</span>
        )}
        <ChevronDown 
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          id="language-menu"
          role="listbox"
          aria-label="Language options"
          className="absolute right-0 mt-2 w-56 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {supportedLanguages.map((lang, index) => (
            <button
              key={lang.code}
              role="option"
              aria-selected={language === lang.code}
              className={`language-item w-full px-4 py-2 text-left hover:bg-base-200 focus:bg-base-200 focus:outline-none flex items-center gap-3 ${
                language === lang.code ? 'bg-primary text-primary-content' : ''
              }`}
              onClick={() => handleLanguageChange(lang.code)}
              tabIndex={isOpen ? 0 : -1}
              autoFocus={index === 0 && isOpen}
            >
              <span aria-hidden="true" className="text-lg">{lang.flag}</span>
              <div>
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-sm opacity-70">{lang.name}</div>
              </div>
              {language === lang.code && (
                <div className="ml-auto">
                  <span className="sr-only">Currently selected</span>
                  <svg 
                    className="w-4 h-4" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}