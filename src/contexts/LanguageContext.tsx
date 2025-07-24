import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ja' | 'ko' | 'zh'

export interface LanguageContextType {
  language: SupportedLanguage
  setLanguage: (lang: SupportedLanguage) => void
  t: (key: string, params?: Record<string, string | number>) => string
  isRTL: boolean
  supportedLanguages: Array<{
    code: SupportedLanguage
    name: string
    nativeName: string
    flag: string
  }>
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Language configuration
const LANGUAGE_CONFIG = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', rtl: false },
  it: { name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹', rtl: false },
  pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
  ja: { name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', rtl: false },
  ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false },
  zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false }
} as const

// Translation keys and fallback English text
const translations: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.pianos': 'Find Pianos',
    'nav.events': 'Events',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.login': 'Sign In',
    'nav.signup': 'Sign Up',
    'nav.profile': 'Profile',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Sign Out',
    'nav.admin': 'Admin',
    'nav.moderation': 'Moderation',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.share': 'Share',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.location': 'Location',
    'common.category': 'Category',
    'common.date': 'Date',
    'common.time': 'Time',
    'common.description': 'Description',
    'common.submit': 'Submit',
    'common.reset': 'Reset',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.close': 'Close',
    'common.open': 'Open',
    'common.yes': 'Yes',
    'common.no': 'No',

    // Piano-related
    'piano.title': 'Piano',
    'piano.pianos': 'Pianos',
    'piano.findPianos': 'Find Pianos',
    'piano.condition': 'Condition',
    'piano.publicPiano': 'Public Piano',
    'piano.verified': 'Verified',
    'piano.rating': 'Rating',
    'piano.reviews': 'Reviews',
    'piano.addReview': 'Add Review',
    'piano.gallery': 'Gallery',
    'piano.directions': 'Get Directions',
    'piano.reportIssue': 'Report Issue',

    // Events
    'event.title': 'Event',
    'event.events': 'Events',
    'event.upcomingEvents': 'Upcoming Events',
    'event.pastEvents': 'Past Events',
    'event.joinEvent': 'Join Event',
    'event.createEvent': 'Create Event',
    'event.eventDetails': 'Event Details',

    // Blog
    'blog.title': 'Blog',
    'blog.readMore': 'Read More',
    'blog.author': 'Author',
    'blog.publishedOn': 'Published on',
    'blog.tags': 'Tags',
    'blog.relatedPosts': 'Related Posts',
    'blog.comments': 'Comments',
    'blog.addComment': 'Add Comment',

    // Authentication
    'auth.signIn': 'Sign In',
    'auth.signUp': 'Sign Up',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.confirmPassword': 'Confirm Password',
    'auth.fullName': 'Full Name',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signInWithGoogle': 'Sign in with Google',
    'auth.signInWithFacebook': 'Sign in with Facebook',

    // Accessibility
    'a11y.skipToContent': 'Skip to main content',
    'a11y.openMenu': 'Open menu',
    'a11y.closeMenu': 'Close menu',
    'a11y.userMenu': 'User menu',
    'a11y.languageSelector': 'Language selector',
    'a11y.themeToggle': 'Toggle theme',
    'a11y.searchForm': 'Search form',
    'a11y.sortBy': 'Sort by',
    'a11y.filterBy': 'Filter by',
    'a11y.viewOnMap': 'View on map',
    'a11y.playAudio': 'Play audio',
    'a11y.pauseAudio': 'Pause audio',
    'a11y.nextImage': 'Next image',
    'a11y.previousImage': 'Previous image',
    'a11y.likePost': 'Like this post',
    'a11y.sharePost': 'Share this post',
    'a11y.reportContent': 'Report this content'
  },

  // Spanish translations (sample - in a real app, these would be complete)
  es: {
    'nav.home': 'Inicio',
    'nav.pianos': 'Encontrar Pianos',
    'nav.events': 'Eventos',
    'nav.blog': 'Blog',
    'nav.about': 'Acerca de',
    'nav.contact': 'Contacto',
    'nav.login': 'Iniciar Sesión',
    'nav.signup': 'Registrarse',
    'nav.profile': 'Perfil',
    'nav.dashboard': 'Panel',
    'nav.logout': 'Cerrar Sesión',
    'nav.admin': 'Admin',
    'nav.moderation': 'Moderación',

    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.view': 'Ver',
    'common.share': 'Compartir',
    'common.search': 'Buscar',
    'common.location': 'Ubicación',
    'common.category': 'Categoría',
    'common.date': 'Fecha',
    'common.description': 'Descripción',

    'piano.title': 'Piano',
    'piano.pianos': 'Pianos',
    'piano.findPianos': 'Encontrar Pianos',
    'piano.condition': 'Condición',
    'piano.publicPiano': 'Piano Público',
    'piano.verified': 'Verificado',

    'a11y.skipToContent': 'Saltar al contenido principal',
    'a11y.openMenu': 'Abrir menú',
    'a11y.closeMenu': 'Cerrar menú'
  },

  // Placeholder for other languages - in production, these would be fully translated
  fr: {},
  de: {},
  it: {},
  pt: {},
  ja: {},
  ko: {},
  zh: {}
}

// Fill empty language objects with English fallbacks
Object.keys(translations).forEach(lang => {
  if (lang !== 'en') {
    const langTranslations = translations[lang as SupportedLanguage]
    Object.keys(translations.en).forEach(key => {
      if (!langTranslations[key]) {
        langTranslations[key] = translations.en[key]
      }
    })
  }
})

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    // Try to get language from localStorage, URL, or browser preference
    const stored = localStorage.getItem('language') as SupportedLanguage
    if (stored && Object.keys(LANGUAGE_CONFIG).includes(stored)) {
      return stored
    }

    // Check URL parameter
    const urlParams = new URLSearchParams(window.location.search)
    const urlLang = urlParams.get('lang') as SupportedLanguage
    if (urlLang && Object.keys(LANGUAGE_CONFIG).includes(urlLang)) {
      return urlLang
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage
    if (Object.keys(LANGUAGE_CONFIG).includes(browserLang)) {
      return browserLang
    }

    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
    document.documentElement.dir = LANGUAGE_CONFIG[language].rtl ? 'rtl' : 'ltr'

    // Update page title and meta tags for SEO
    const currentTitle = document.title
    if (!currentTitle.includes(' | WorldPianos')) {
      document.title = `${currentTitle} | WorldPianos`
    }
  }, [language])

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = translations[language][key] || translations.en[key] || key

    // Handle parameter substitution
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{{${param}}}`, String(value))
      })
    }

    return translation
  }

  const supportedLanguages = Object.entries(LANGUAGE_CONFIG).map(([code, config]) => ({
    code: code as SupportedLanguage,
    name: config.name,
    nativeName: config.nativeName,
    flag: config.flag
  }))

  const contextValue: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL: LANGUAGE_CONFIG[language].rtl,
    supportedLanguages
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

// HOC for components that need translation
export function withTranslation<T extends {}>(Component: React.ComponentType<T>) {
  return function TranslatedComponent(props: T) {
    const { t } = useLanguage()
    return <Component {...props} t={t} />
  }
}