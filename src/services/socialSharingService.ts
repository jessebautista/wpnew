export interface ShareData {
  title: string
  text: string
  url: string
  image?: string
  hashtags?: string[]
}

export type SocialPlatform = 
  | 'facebook' 
  | 'twitter' 
  | 'linkedin' 
  | 'reddit' 
  | 'whatsapp' 
  | 'telegram' 
  | 'email' 
  | 'copy'

export interface ShareStats {
  platform: SocialPlatform
  contentType: 'piano' | 'event' | 'blog_post'
  contentId: string
  userId?: string
  timestamp: string
}

export class SocialSharingService {
  private static shareStats: ShareStats[] = []

  // Platform-specific sharing URLs
  private static platforms = {
    facebook: (data: ShareData) => 
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.text)}`,
    
    twitter: (data: ShareData) => {
      const hashtags = data.hashtags?.join(',') || 'WorldPianos,PublicPiano'
      return `https://twitter.com/intent/tweet?text=${encodeURIComponent(data.text)}&url=${encodeURIComponent(data.url)}&hashtags=${hashtags}`
    },
    
    linkedin: (data: ShareData) => 
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}&summary=${encodeURIComponent(data.text)}`,
    
    reddit: (data: ShareData) => 
      `https://reddit.com/submit?url=${encodeURIComponent(data.url)}&title=${encodeURIComponent(data.title)}`,
    
    whatsapp: (data: ShareData) => 
      `https://wa.me/?text=${encodeURIComponent(`${data.title}\n\n${data.text}\n\n${data.url}`)}`,
    
    telegram: (data: ShareData) => 
      `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(`${data.title}\n\n${data.text}`)}`,
    
    email: (data: ShareData) => 
      `mailto:?subject=${encodeURIComponent(data.title)}&body=${encodeURIComponent(`${data.text}\n\n${data.url}`)}`
  }

  // Native Web Share API support
  static async shareNative(data: ShareData): Promise<boolean> {
    if (!navigator.share) return false

    try {
      await navigator.share({
        title: data.title,
        text: data.text,
        url: data.url
      })
      return true
    } catch (error) {
      // User cancelled or error occurred
      return false
    }
  }

  // Platform-specific sharing
  static shareToPlatform(platform: SocialPlatform, data: ShareData): void {
    if (platform === 'copy') {
      this.copyToClipboard(data)
      return
    }

    const platformFn = this.platforms[platform as keyof typeof this.platforms]
    if (!platformFn) return

    const shareUrl = platformFn(data)
    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes,resizable=yes')
  }

  // Copy to clipboard
  static async copyToClipboard(data: ShareData): Promise<boolean> {
    const shareText = `${data.title}\n\n${data.text}\n\n${data.url}`
    
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareText)
        return true
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        return false
      }
    }

    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea')
      textArea.value = shareText
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      return result
    } catch (error) {
      console.error('Fallback copy failed:', error)
      return false
    }
  }

  // Track sharing activity
  static trackShare(
    platform: SocialPlatform,
    contentType: 'piano' | 'event' | 'blog_post',
    contentId: string,
    userId?: string
  ): void {
    const stat: ShareStats = {
      platform,
      contentType,
      contentId,
      userId,
      timestamp: new Date().toISOString()
    }
    
    this.shareStats.push(stat)
  }

  // Get sharing analytics
  static getShareStats(contentId?: string, contentType?: 'piano' | 'event' | 'blog_post') {
    let filtered = this.shareStats

    if (contentId) {
      filtered = filtered.filter(stat => stat.contentId === contentId)
    }

    if (contentType) {
      filtered = filtered.filter(stat => stat.contentType === contentType)
    }

    // Group by platform
    const byPlatform = filtered.reduce((acc, stat) => {
      acc[stat.platform] = (acc[stat.platform] || 0) + 1
      return acc
    }, {} as Record<SocialPlatform, number>)

    // Get total shares
    const totalShares = filtered.length

    // Get recent shares (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const recentShares = filtered.filter(stat => new Date(stat.timestamp) >= weekAgo).length

    return {
      totalShares,
      recentShares,
      byPlatform,
      mostPopularPlatform: Object.entries(byPlatform)
        .sort(([,a], [,b]) => b - a)[0]?.[0] as SocialPlatform
    }
  }

  // Generate content-specific share data
  static generateShareData(content: {
    type: 'piano' | 'event' | 'blog_post'
    id: string
    title: string
    description?: string
    location?: string
    date?: string
    author?: string
    image?: string
  }): ShareData {
    const baseUrl = window.location.origin
    
    switch (content.type) {
      case 'piano':
        return {
          title: `🎹 ${content.title} - Public Piano`,
          text: `Check out this amazing public piano${content.location ? ` in ${content.location}` : ''}! Join the WorldPianos community and discover pianos around the world.`,
          url: `${baseUrl}/pianos/${content.id}`,
          image: content.image,
          hashtags: ['WorldPianos', 'PublicPiano', 'Piano', 'Music']
        }

      case 'event':
        return {
          title: `🎵 ${content.title} - Piano Event`,
          text: `Join us for this exciting piano event${content.date ? ` on ${new Date(content.date).toLocaleDateString()}` : ''}${content.location ? ` in ${content.location}` : ''}! ${content.description || ''}`,
          url: `${baseUrl}/events/${content.id}`,
          image: content.image,
          hashtags: ['WorldPianos', 'PianoEvent', 'Music', 'Community']
        }

      case 'blog_post':
        return {
          title: content.title,
          text: `${content.description || 'Read this interesting article on WorldPianos'}${content.author ? ` by ${content.author}` : ''}`,
          url: `${baseUrl}/blog/${content.id}`,
          image: content.image,
          hashtags: ['WorldPianos', 'Piano', 'Music', 'Blog']
        }

      default:
        return {
          title: content.title,
          text: content.description || 'Check this out on WorldPianos!',
          url: `${baseUrl}`,
          hashtags: ['WorldPianos']
        }
    }
  }

  // Initialize with mock data
  static initializeMockData() {
    if (this.shareStats.length > 0) return

    // Mock some sharing activity
    const mockStats: ShareStats[] = [
      {
        platform: 'facebook',
        contentType: 'piano',
        contentId: '1',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        platform: 'twitter',
        contentType: 'piano',
        contentId: '1',
        userId: 'user1',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        platform: 'whatsapp',
        contentType: 'event',
        contentId: '1',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
      },
      {
        platform: 'copy',
        contentType: 'blog_post',
        contentId: '1',
        userId: 'user2',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ]

    this.shareStats = mockStats
  }
}

// Initialize mock data
SocialSharingService.initializeMockData()