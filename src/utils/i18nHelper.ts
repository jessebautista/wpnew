/**
 * i18n Helper Utilities
 * Utility functions for testing and debugging internationalization
 */

import { SupportedLanguage } from '../contexts/LanguageContext'

// Test function to verify translation coverage
export function testTranslationCoverage(translations: Record<string, Record<string, string>>) {
  const englishKeys = Object.keys(translations.en || {})
  const results: Record<string, { missing: string[], coverage: number }> = {}

  Object.keys(translations).forEach(lang => {
    if (lang === 'en') return
    
    const langTranslations = translations[lang] || {}
    const missing = englishKeys.filter(key => !langTranslations[key])
    const coverage = ((englishKeys.length - missing.length) / englishKeys.length) * 100
    
    results[lang] = { missing, coverage }
  })

  return results
}

// Helper to get localized URL with language parameter
export function getLocalizedUrl(url: string, language: SupportedLanguage): string {
  const urlObj = new URL(url, window.location.origin)
  
  if (language !== 'en') {
    urlObj.searchParams.set('lang', language)
  } else {
    urlObj.searchParams.delete('lang')
  }
  
  return urlObj.toString()
}

// Helper to format numbers with locale-specific formatting
export function formatNumber(number: number, language: SupportedLanguage): string {
  const localeMap: Record<SupportedLanguage, string> = {
    en: 'en-US',
    es: 'es-ES', 
    fr: 'fr-FR',
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
    ja: 'ja-JP',
    ko: 'ko-KR',
    zh: 'zh-CN'
  }
  
  return number.toLocaleString(localeMap[language])
}

// Helper to format dates with locale-specific formatting
export function formatDate(date: Date, language: SupportedLanguage): string {
  const localeMap: Record<SupportedLanguage, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR', 
    de: 'de-DE',
    it: 'it-IT',
    pt: 'pt-PT',
    ja: 'ja-JP',
    ko: 'ko-KR',
    zh: 'zh-CN'
  }
  
  return date.toLocaleDateString(localeMap[language], {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

// Development helper to log translation usage
export function logTranslationUsage(key: string, language: SupportedLanguage, translation: string) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[i18n] ${language}:${key} -> "${translation}"`)
  }
}

// Accessibility helper for screen reader language announcements
export function announceLanguageChange(newLanguage: SupportedLanguage, t: (key: string) => string) {
  const announcement = t('a11y.languageChanged') || `Language changed to ${newLanguage}`
  
  // Create temporary element for screen reader announcement
  const announcer = document.createElement('div')
  announcer.setAttribute('aria-live', 'polite')
  announcer.setAttribute('aria-atomic', 'true')
  announcer.style.position = 'absolute'
  announcer.style.left = '-10000px'
  announcer.style.width = '1px'
  announcer.style.height = '1px'
  announcer.style.overflow = 'hidden'
  
  document.body.appendChild(announcer)
  announcer.textContent = announcement
  
  // Clean up after announcement
  setTimeout(() => {
    document.body.removeChild(announcer)
  }, 1000)
}