import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export interface AccessibilitySettings {
  // Visual
  highContrast: boolean
  fontSize: 'small' | 'medium' | 'large' | 'extra-large'
  reducedMotion: boolean
  focusVisible: boolean
  
  // Audio
  soundEnabled: boolean
  screenReaderOptimized: boolean
  
  // Navigation
  keyboardNavigation: boolean
  skipLinks: boolean
  
  // Content
  simplifiedUI: boolean
  readingMode: boolean
}

export interface AccessibilityContextType {
  settings: AccessibilitySettings
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => void
  resetSettings: () => void
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void
  isScreenReaderActive: boolean
}

const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'medium',
  reducedMotion: false,
  focusVisible: true,
  soundEnabled: true,
  screenReaderOptimized: false,
  keyboardNavigation: true,
  skipLinks: true,
  simplifiedUI: false,
  readingMode: false
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

interface AccessibilityProviderProps {
  children: ReactNode
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load from localStorage
    const stored = localStorage.getItem('accessibility-settings')
    if (stored) {
      try {
        const parsedSettings = JSON.parse(stored)
        return { ...defaultSettings, ...parsedSettings }
      } catch (error) {
        console.error('Error parsing accessibility settings:', error)
      }
    }

    // Check system preferences
    const systemSettings = { ...defaultSettings }
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      systemSettings.reducedMotion = true
    }

    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      systemSettings.highContrast = true
    }

    // Detect screen reader (basic detection)
    const isVoiceOver = /VoiceOver/i.test(navigator.userAgent)
    const isNVDA = /NVDA/i.test(navigator.userAgent)
    const isJAWS = /JAWS/i.test(navigator.userAgent)
    if (isVoiceOver || isNVDA || isJAWS) {
      systemSettings.screenReaderOptimized = true
    }

    return systemSettings
  })

  const [isScreenReaderActive, setIsScreenReaderActive] = useState(false)

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings))

    // Apply CSS classes to document
    const classes = []
    if (settings.highContrast) classes.push('high-contrast')
    if (settings.reducedMotion) classes.push('reduced-motion')
    if (settings.focusVisible) classes.push('focus-visible')
    if (settings.simplifiedUI) classes.push('simplified-ui')
    if (settings.readingMode) classes.push('reading-mode')
    
    // Font size
    classes.push(`font-size-${settings.fontSize}`)

    // Apply classes
    document.documentElement.className = classes.join(' ')

    // Set CSS custom properties
    document.documentElement.style.setProperty('--motion-duration', settings.reducedMotion ? '0ms' : '200ms')
    
    // Font size multipliers
    const fontSizeMultipliers = {
      'small': 0.875,
      'medium': 1,
      'large': 1.125,
      'extra-large': 1.25
    }
    document.documentElement.style.setProperty('--font-size-multiplier', fontSizeMultipliers[settings.fontSize].toString())

  }, [settings])

  useEffect(() => {
    // Screen reader detection
    let screenReaderTimeout: NodeJS.Timeout

    const detectScreenReader = () => {
      const testElement = document.createElement('div')
      testElement.setAttribute('aria-live', 'polite')
      testElement.setAttribute('aria-atomic', 'true')
      testElement.style.position = 'absolute'
      testElement.style.left = '-10000px'
      testElement.style.width = '1px'
      testElement.style.height = '1px'
      testElement.style.overflow = 'hidden'
      testElement.textContent = 'Screen reader test'
      
      document.body.appendChild(testElement)
      
      screenReaderTimeout = setTimeout(() => {
        setIsScreenReaderActive(true)
        document.body.removeChild(testElement)
      }, 100)
      
      // Clean up if no screen reader
      setTimeout(() => {
        if (document.body.contains(testElement)) {
          document.body.removeChild(testElement)
          setIsScreenReaderActive(false)
        }
      }, 500)
    }

    // Run detection after a short delay
    setTimeout(detectScreenReader, 1000)

    return () => {
      if (screenReaderTimeout) {
        clearTimeout(screenReaderTimeout)
      }
    }
  }, [])

  useEffect(() => {
    // Listen for system preference changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const contrastQuery = window.matchMedia('(prefers-contrast: high)')

    const handleMotionChange = (e: MediaQueryListEvent) => {
      if (e.matches && !settings.reducedMotion) {
        updateSetting('reducedMotion', true)
      }
    }

    const handleContrastChange = (e: MediaQueryListEvent) => {
      if (e.matches && !settings.highContrast) {
        updateSetting('highContrast', true)
      }
    }

    motionQuery.addEventListener('change', handleMotionChange)
    contrastQuery.addEventListener('change', handleContrastChange)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      contrastQuery.removeEventListener('change', handleContrastChange)
    }
  }, [settings])

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem('accessibility-settings')
  }

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', priority)
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'
    
    document.body.appendChild(announcement)
    
    // Add message after a brief delay to ensure screen reader picks it up
    setTimeout(() => {
      announcement.textContent = message
    }, 100)
    
    // Remove after announcement
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement)
      }
    }, 2000)
  }

  const contextValue: AccessibilityContextType = {
    settings,
    updateSetting,
    resetSettings,
    announceToScreenReader,
    isScreenReaderActive
  }

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Hook for keyboard navigation
export function useKeyboardNavigation() {
  const { settings } = useAccessibility()
  
  useEffect(() => {
    if (!settings.keyboardNavigation) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab navigation enhancement
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation')
      }
      
      // Escape key to close modals
      if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('[role="dialog"][open], .modal-open .modal')
        openModals.forEach(modal => {
          const closeButton = modal.querySelector('[data-dismiss="modal"], .modal-action .btn')
          if (closeButton instanceof HTMLElement) {
            closeButton.click()
          }
        })
      }
      
      // Arrow key navigation for lists and grids
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        const activeElement = document.activeElement
        if (activeElement && activeElement.getAttribute('role') === 'option') {
          event.preventDefault()
          // Handle arrow key navigation in lists
          // This would be expanded based on specific component needs
        }
      }
    }

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation')
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleMouseDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleMouseDown)
    }
  }, [settings.keyboardNavigation])
}

// Custom focus management hook
export function useFocusManagement() {
  const { settings } = useAccessibility()

  const trapFocus = (container: HTMLElement) => {
    if (!settings.keyboardNavigation) return

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            event.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            event.preventDefault()
          }
        }
      }
    }

    container.addEventListener('keydown', handleKeyDown)
    firstElement?.focus()

    return () => {
      container.removeEventListener('keydown', handleKeyDown)
    }
  }

  return { trapFocus }
}