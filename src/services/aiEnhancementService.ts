export interface EnhancementSuggestion {
  type: 'description' | 'title' | 'keywords' | 'meta_description'
  original: string
  enhanced: string
  reason: string
  seo_score_improvement: number
}

export interface AIEnhancementResult {
  suggestions: EnhancementSuggestion[]
  overall_score_improvement: number
  estimated_engagement_boost: string
  processing_time: number
}

export class AIEnhancementService {
  private static isEnabled = false
  private static apiKey = ''
  private static provider: 'openai' | 'anthropic' | 'local' = 'openai'

  static configure(enabled: boolean, apiKey: string, provider: 'openai' | 'anthropic' | 'local' = 'openai') {
    this.isEnabled = enabled
    this.apiKey = apiKey
    this.provider = provider
  }

  // Mock AI enhancement for demonstration (in real app, this would call actual AI APIs)
  static async enhanceContent(
    contentType: 'piano' | 'event' | 'blog_post',
    content: {
      title: string
      description?: string
      location?: string
      category?: string
      condition?: string
      date?: string
    }
  ): Promise<AIEnhancementResult> {
    const startTime = Date.now()
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const suggestions: EnhancementSuggestion[] = []
    
    // Mock enhancement logic based on content type
    if (contentType === 'piano') {
      suggestions.push(...this.generatePianoEnhancements(content))
    } else if (contentType === 'event') {
      suggestions.push(...this.generateEventEnhancements(content))
    } else if (contentType === 'blog_post') {
      suggestions.push(...this.generateBlogEnhancements(content))
    }

    const processingTime = Date.now() - startTime
    const overallImprovement = suggestions.reduce((sum, s) => sum + s.seo_score_improvement, 0)

    return {
      suggestions,
      overall_score_improvement: overallImprovement,
      estimated_engagement_boost: this.calculateEngagementBoost(overallImprovement),
      processing_time: processingTime
    }
  }

  private static generatePianoEnhancements(content: any): EnhancementSuggestion[] {
    const suggestions: EnhancementSuggestion[] = []

    // Enhance title
    if (content.title && content.title.length < 40) {
      const enhanced = this.enhancePianoTitle(content.title, content.location, content.category)
      suggestions.push({
        type: 'title',
        original: content.title,
        enhanced,
        reason: 'Added location and descriptive keywords to improve search visibility',
        seo_score_improvement: 15
      })
    }

    // Enhance description
    if (!content.description || content.description.length < 100) {
      const enhanced = this.enhancePianoDescription(content)
      suggestions.push({
        type: 'description',
        original: content.description || '',
        enhanced,
        reason: 'Added detailed description with location context and condition details for better SEO',
        seo_score_improvement: 25
      })
    }

    // Generate meta description
    const metaDesc = this.generatePianoMetaDescription(content)
    suggestions.push({
      type: 'meta_description',
      original: content.description?.substring(0, 160) || '',
      enhanced: metaDesc,
      reason: 'Optimized meta description for search engine snippets',
      seo_score_improvement: 10
    })

    // Generate keywords
    const keywords = this.generatePianoKeywords(content)
    suggestions.push({
      type: 'keywords',
      original: '',
      enhanced: keywords.join(', '),
      reason: 'Generated relevant keywords for improved search ranking',
      seo_score_improvement: 8
    })

    return suggestions
  }

  private static generateEventEnhancements(content: any): EnhancementSuggestion[] {
    const suggestions: EnhancementSuggestion[] = []

    // Enhance title
    if (content.title && !content.title.includes(content.category)) {
      const enhanced = this.enhanceEventTitle(content.title, content.category, content.date)
      suggestions.push({
        type: 'title',
        original: content.title,
        enhanced,
        reason: 'Added event type and date information for better discoverability',
        seo_score_improvement: 12
      })
    }

    // Enhance description
    if (!content.description || content.description.length < 120) {
      const enhanced = this.enhanceEventDescription(content)
      suggestions.push({
        type: 'description',
        original: content.description || '',
        enhanced,
        reason: 'Enhanced description with event details and call-to-action',
        seo_score_improvement: 20
      })
    }

    return suggestions
  }

  private static generateBlogEnhancements(content: any): EnhancementSuggestion[] {
    const suggestions: EnhancementSuggestion[] = []

    // Enhance title for SEO
    if (content.title && content.title.length < 50) {
      const enhanced = this.enhanceBlogTitle(content.title)
      suggestions.push({
        type: 'title',
        original: content.title,
        enhanced,
        reason: 'Optimized title length and added engaging keywords',
        seo_score_improvement: 18
      })
    }

    return suggestions
  }

  private static enhancePianoTitle(title: string, location?: string, category?: string): string {
    const templates = [
      `${title} - Beautiful ${category} Piano in ${location}`,
      `Discover ${title}: Public ${category} Piano in ${location}`,
      `${title} | Free-to-Play ${category} Piano in ${location}`,
      `Play ${title} - Community Piano in ${location}`
    ]
    
    if (location && category) {
      return templates[Math.floor(Math.random() * templates.length)]
    }
    
    return `${title} - Public Piano for Everyone to Enjoy`
  }

  private static enhancePianoDescription(content: any): string {
    const baseDesc = content.description || ''
    const location = content.location || 'a wonderful location'
    const category = content.category?.toLowerCase() || 'piano'
    const condition = content.condition?.toLowerCase() || 'good'
    
    const enhancements = [
      `This beautiful ${category} piano is located in ${location} and is in ${condition} condition.`,
      `Perfect for both beginners and experienced pianists, this instrument welcomes everyone to play and share their musical talents.`,
      `Join our community of piano enthusiasts and discover the joy of public music-making.`,
      `Whether you're looking to practice, perform, or simply enjoy some music, this piano offers a wonderful opportunity for musical expression.`
    ]

    return baseDesc + (baseDesc ? ' ' : '') + enhancements.join(' ')
  }

  private static generatePianoMetaDescription(content: any): string {
    const location = content.location || 'a beautiful location'
    const category = content.category?.toLowerCase() || 'piano'
    
    return `Discover and play this ${category} piano in ${location}. Free public piano for all skill levels. Join the WorldPianos community and share your music!`
  }

  private static generatePianoKeywords(content: any): string[] {
    const baseKeywords = ['public piano', 'free piano', 'community piano', 'street piano']
    const locationKeywords = content.location ? [`piano ${content.location}`, `music ${content.location}`] : []
    const categoryKeywords = content.category ? [`${content.category.toLowerCase()} piano`] : []
    
    return [...baseKeywords, ...locationKeywords, ...categoryKeywords, 'piano playing', 'music community']
  }

  private static enhanceEventTitle(title: string, category?: string, date?: string): string {
    const eventDate = date ? new Date(date).toLocaleDateString() : ''
    const eventType = category || 'Piano Event'
    
    return `${title} - ${eventType}${eventDate ? ` on ${eventDate}` : ''}`
  }

  private static enhanceEventDescription(content: any): string {
    const baseDesc = content.description || ''
    const location = content.location || 'a great venue'
    const date = content.date ? new Date(content.date).toLocaleDateString() : ''
    
    const enhancement = `Join us for this exciting piano event in ${location}${date ? ` on ${date}` : ''}. Whether you're a seasoned pianist or just love music, this event offers something special for everyone. Come connect with fellow piano enthusiasts and be part of our vibrant musical community!`
    
    return baseDesc + (baseDesc ? ' ' : '') + enhancement
  }

  private static enhanceBlogTitle(title: string): string {
    const engagingWords = ['Ultimate', 'Complete', 'Essential', 'Definitive', 'Comprehensive']
    const actionWords = ['Guide', 'Tips', 'Secrets', 'Strategies', 'Methods']
    
    if (title.length < 40) {
      const randomEngaging = engagingWords[Math.floor(Math.random() * engagingWords.length)]
      const randomAction = actionWords[Math.floor(Math.random() * actionWords.length)]
      
      return `The ${randomEngaging} ${randomAction} to ${title}`
    }
    
    return title
  }

  private static calculateEngagementBoost(scoreImprovement: number): string {
    if (scoreImprovement >= 50) return '25-40% higher engagement expected'
    if (scoreImprovement >= 30) return '15-25% higher engagement expected'
    if (scoreImprovement >= 15) return '8-15% higher engagement expected'
    return '3-8% higher engagement expected'
  }

  // Quick fix suggestions (instant, no API calls)
  static getQuickSEOFixes(content: {
    title?: string
    description?: string
    content?: string
  }): string[] {
    const fixes: string[] = []

    if (content.title) {
      if (content.title.length < 30) {
        fixes.push('Title is too short - aim for 30-60 characters')
      }
      if (content.title.length > 60) {
        fixes.push('Title is too long - keep it under 60 characters')
      }
      if (!/[0-9]/.test(content.title) && Math.random() > 0.7) {
        fixes.push('Consider adding a year or number to your title')
      }
    }

    if (content.description) {
      if (content.description.length < 120) {
        fixes.push('Description could be longer for better SEO (120-160 characters)')
      }
      if (content.description.length > 160) {
        fixes.push('Description is too long - keep it under 160 characters')
      }
    }

    if (content.content) {
      const wordCount = content.content.split(' ').length
      if (wordCount < 300) {
        fixes.push('Content is quite short - longer content tends to rank better')
      }
    }

    return fixes
  }

  // Generate structured data for SEO
  static generateStructuredData(
    type: 'piano' | 'event' | 'blog_post',
    content: any
  ): object {
    const baseUrl = window.location.origin

    switch (type) {
      case 'piano':
        return {
          "@context": "https://schema.org",
          "@type": "Place",
          "name": content.title,
          "description": content.description,
          "address": content.location,
          "geo": content.latitude && content.longitude ? {
            "@type": "GeoCoordinates",
            "latitude": content.latitude,
            "longitude": content.longitude
          } : undefined,
          "amenityFeature": {
            "@type": "LocationFeatureSpecification",
            "name": "Public Piano",
            "value": true
          },
          "url": `${baseUrl}/pianos/${content.id}`
        }

      case 'event':
        return {
          "@context": "https://schema.org",
          "@type": "Event",
          "name": content.title,
          "description": content.description,
          "startDate": content.date,
          "location": {
            "@type": "Place",
            "name": content.location,
            "address": content.location
          },
          "organizer": {
            "@type": "Organization",
            "name": "WorldPianos"
          },
          "url": `${baseUrl}/events/${content.id}`
        }

      case 'blog_post':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": content.title,
          "description": content.excerpt,
          "author": {
            "@type": "Person",
            "name": content.author?.full_name || "WorldPianos Team"
          },
          "publisher": {
            "@type": "Organization",
            "name": "WorldPianos"
          },
          "datePublished": content.created_at,
          "dateModified": content.updated_at,
          "url": `${baseUrl}/blog/${content.id}`
        }

      default:
        return {}
    }
  }
}