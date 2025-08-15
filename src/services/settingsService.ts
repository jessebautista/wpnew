declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const gtag = typeof window !== 'undefined' ? window.gtag : undefined;

export interface AnalyticsSettings {
  enabled: boolean
  google_analytics_id: string
  google_tag_manager_id?: string
  facebook_pixel_id?: string
  track_events: boolean
  track_scroll: boolean
  track_downloads: boolean
  anonymize_ip: boolean
}

export interface SEOSettings {
  enabled: boolean
  auto_generate_meta: boolean
  ai_enhance_descriptions: boolean
  structured_data: boolean
  sitemap_generation: boolean
  robots_txt_custom: string
  default_meta: {
    title_suffix: string
    description: string
    keywords: string[]
    og_image: string
  }
  social_meta: {
    twitter_site: string
    facebook_app_id: string
    linkedin_company_id: string
  }
}

export interface AISettings {
  enabled: boolean
  provider: 'openai' | 'anthropic' | 'local'
  api_key?: string
  model: string
  max_tokens: number
  temperature: number
  enhance_descriptions: boolean
  generate_tags: boolean
  seo_suggestions: boolean
}

export interface AppSettings {
  analytics: AnalyticsSettings
  seo: SEOSettings
  ai: AISettings
  updated_at: string
  updated_by: string
}

export class SettingsService {
  private static settings: AppSettings = {
    analytics: {
      enabled: false,
      google_analytics_id: '',
      google_tag_manager_id: '',
      facebook_pixel_id: '',
      track_events: true,
      track_scroll: false,
      track_downloads: true,
      anonymize_ip: true
    },
    seo: {
      enabled: true,
      auto_generate_meta: true,
      ai_enhance_descriptions: false,
      structured_data: true,
      sitemap_generation: true,
      robots_txt_custom: '',
      default_meta: {
        title_suffix: ' | WorldPianos - Discover Public Pianos Worldwide',
        description: 'Discover and share public pianos around the world. Connect with piano enthusiasts, find nearby instruments, and join our global community.',
        keywords: ['piano', 'public piano', 'music', 'community', 'instruments', 'street piano'],
        og_image: '/images/worldpianos-og.jpg'
      },
      social_meta: {
        twitter_site: '@worldpianos',
        facebook_app_id: '',
        linkedin_company_id: ''
      }
    },
    ai: {
      enabled: false,
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      max_tokens: 150,
      temperature: 0.7,
      enhance_descriptions: false,
      generate_tags: false,
      seo_suggestions: false
    },
    updated_at: new Date().toISOString(),
    updated_by: 'system'
  }

  // Get all settings
  static getSettings(): AppSettings {
    return { ...this.settings }
  }

  // Update settings
  static async updateSettings(updates: Partial<AppSettings>, userId: string): Promise<AppSettings> {
    this.settings = {
      ...this.settings,
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: userId
    }

    // Apply settings immediately
    if (updates.analytics) {
      this.applyAnalyticsSettings(this.settings.analytics)
    }

    if (updates.seo) {
      this.applySEOSettings(this.settings.seo)
    }

    return this.settings
  }

  // Apply Google Analytics settings
  private static applyAnalyticsSettings(analytics: AnalyticsSettings) {
    if (analytics.enabled && analytics.google_analytics_id) {
      // Remove existing GA scripts
      this.removeAnalyticsScripts()

      // Add Google Analytics
      this.loadGoogleAnalytics(analytics.google_analytics_id)

      // Configure tracking options
      if (typeof gtag !== 'undefined') {
        gtag('config', analytics.google_analytics_id, {
          anonymize_ip: analytics.anonymize_ip,
          allow_google_signals: !analytics.anonymize_ip
        })
      }
    } else {
      this.removeAnalyticsScripts()
    }
  }

  // Load Google Analytics
  private static loadGoogleAnalytics(analyticsId: string) {
    // Add gtag script
    const gtagScript = document.createElement('script')
    gtagScript.async = true
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${analyticsId}`
    document.head.appendChild(gtagScript)

    // Add gtag configuration
    const configScript = document.createElement('script')
    configScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${analyticsId}');
    `
    document.head.appendChild(configScript)
  }

  // Remove analytics scripts
  private static removeAnalyticsScripts() {
    const scripts = document.querySelectorAll('script[src*="googletagmanager"], script[src*="google-analytics"]')
    scripts.forEach(script => script.remove())
    
    // Clear gtag
    if (typeof window !== 'undefined') {
      (window as any).gtag = undefined
      ;(window as any).dataLayer = []
    }
  }

  // Apply SEO settings
  private static applySEOSettings(seo: SEOSettings) {
    if (seo.enabled) {
      this.updateMetaTags(seo.default_meta)
      this.updateSocialMetaTags(seo.social_meta)
    }
  }

  // Update meta tags
  private static updateMetaTags(meta: SEOSettings['default_meta']) {
    // Update description
    this.updateMetaTag('description', meta.description)
    
    // Update keywords
    this.updateMetaTag('keywords', meta.keywords.join(', '))
    
    // Update Open Graph tags
    this.updateMetaTag('og:description', meta.description)
    this.updateMetaTag('og:image', meta.og_image)
    this.updateMetaTag('og:site_name', 'WorldPianos')
  }

  // Update social meta tags
  private static updateSocialMetaTags(social: SEOSettings['social_meta']) {
    if (social.twitter_site) {
      this.updateMetaTag('twitter:site', social.twitter_site)
      this.updateMetaTag('twitter:creator', social.twitter_site)
    }
    
    if (social.facebook_app_id) {
      this.updateMetaTag('fb:app_id', social.facebook_app_id)
    }
  }

  // Helper to update meta tags
  private static updateMetaTag(name: string, content: string) {
    if (!content) return

    const isProperty = name.startsWith('og:') || name.startsWith('fb:')
    const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`
    
    let meta = document.querySelector(selector) as HTMLMetaElement
    
    if (!meta) {
      meta = document.createElement('meta')
      if (isProperty) {
        meta.setAttribute('property', name)
      } else {
        meta.setAttribute('name', name)
      }
      document.head.appendChild(meta)
    }
    
    meta.setAttribute('content', content)
  }

  // Track custom events
  static trackEvent(action: string, category: string, label?: string, value?: number) {
    if (!this.settings.analytics.enabled || !this.settings.analytics.track_events) return

    if (typeof gtag !== 'undefined') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      })
    }
  }

  // Generate page meta data
  static generatePageMeta(
    title: string,
    description: string,
    type: 'piano' | 'event' | 'blog_post' | 'page' = 'page',
    image?: string,
    url?: string
  ) {
    const settings = this.getSettings()
    
    return {
      title: title + settings.seo.default_meta.title_suffix,
      description: description || settings.seo.default_meta.description,
      keywords: settings.seo.default_meta.keywords.join(', '),
      ogTitle: title,
      ogDescription: description || settings.seo.default_meta.description,
      ogImage: image || settings.seo.default_meta.og_image,
      ogType: type === 'blog_post' ? 'article' : 'website',
      ogUrl: url || window.location.href,
      twitterCard: 'summary_large_image',
      twitterSite: settings.seo.social_meta.twitter_site
    }
  }

  // SEO Analysis
  static analyzeSEO(content: {
    title: string
    description?: string
    content?: string
    keywords?: string[]
  }) {
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 100

    // Title analysis
    if (!content.title) {
      issues.push('Missing title')
      score -= 20
    } else if (content.title.length < 30) {
      suggestions.push('Title could be longer (30-60 characters recommended)')
      score -= 5
    } else if (content.title.length > 60) {
      suggestions.push('Title might be too long (30-60 characters recommended)')
      score -= 5
    }

    // Description analysis
    if (!content.description) {
      issues.push('Missing meta description')
      score -= 15
    } else if (content.description.length < 120) {
      suggestions.push('Description could be longer (120-160 characters recommended)')
      score -= 5
    } else if (content.description.length > 160) {
      suggestions.push('Description might be too long (120-160 characters recommended)')
      score -= 5
    }

    // Content analysis
    if (content.content) {
      const wordCount = content.content.split(' ').length
      if (wordCount < 300) {
        suggestions.push('Content could be longer (300+ words recommended)')
        score -= 10
      }
    }

    return {
      score: Math.max(0, score),
      issues,
      suggestions,
      grade: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F'
    }
  }
}