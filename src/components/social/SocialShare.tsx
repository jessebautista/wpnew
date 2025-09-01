import React, { useState } from 'react'
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Mail, 
  Copy,
  MessageCircle,
  Check
} from 'lucide-react'

export interface SocialShareProps {
  url: string
  title: string
  description?: string
  imageUrl?: string
  hashtags?: string[]
  className?: string
  buttonVariant?: 'default' | 'minimal' | 'floating'
  platforms?: SocialPlatform[]
}

export type SocialPlatform = 'facebook' | 'twitter' | 'linkedin' | 'whatsapp' | 'email' | 'copy'

interface SharePlatformConfig {
  name: string
  icon: React.ReactNode
  color: string
  getUrl: (data: SocialShareData) => string
  action?: (data: SocialShareData) => void
}

interface SocialShareData {
  url: string
  title: string
  description?: string
  imageUrl?: string
  hashtags?: string[]
}

const defaultPlatforms: SocialPlatform[] = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email', 'copy']

const platformConfigs: Record<SocialPlatform, SharePlatformConfig> = {
  facebook: {
    name: 'Facebook',
    icon: <Facebook className="w-4 h-4" />,
    color: 'text-blue-600 hover:bg-blue-50',
    getUrl: ({ url, title, description }) => {
      const params = new URLSearchParams({
        u: url,
        quote: description || title
      })
      return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`
    }
  },
  twitter: {
    name: 'Twitter',
    icon: <Twitter className="w-4 h-4" />,
    color: 'text-blue-400 hover:bg-blue-50',
    getUrl: ({ url, title, hashtags }) => {
      const text = hashtags ? `${title} ${hashtags.map(tag => `#${tag}`).join(' ')}` : title
      const params = new URLSearchParams({
        url,
        text: text.substring(0, 280) // Twitter character limit
      })
      return `https://twitter.com/intent/tweet?${params.toString()}`
    }
  },
  linkedin: {
    name: 'LinkedIn',
    icon: <Linkedin className="w-4 h-4" />,
    color: 'text-blue-700 hover:bg-blue-50',
    getUrl: ({ url, title, description }) => {
      const params = new URLSearchParams({
        url,
        title,
        summary: description || title
      })
      return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`
    }
  },
  whatsapp: {
    name: 'WhatsApp',
    icon: <MessageCircle className="w-4 h-4" />,
    color: 'text-green-600 hover:bg-green-50',
    getUrl: ({ url, title }) => {
      const text = encodeURIComponent(`${title} ${url}`)
      return `https://wa.me/?text=${text}`
    }
  },
  email: {
    name: 'Email',
    icon: <Mail className="w-4 h-4" />,
    color: 'text-gray-600 hover:bg-gray-50',
    getUrl: ({ url, title, description }) => {
      const subject = encodeURIComponent(title)
      const body = encodeURIComponent(`${description || title}\n\n${url}`)
      return `mailto:?subject=${subject}&body=${body}`
    }
  },
  copy: {
    name: 'Copy Link',
    icon: <Copy className="w-4 h-4" />,
    color: 'text-gray-600 hover:bg-gray-50',
    getUrl: () => '', // Not used for copy
    action: async ({ url }) => {
      try {
        await navigator.clipboard.writeText(url)
        return true
      } catch (error) {
        console.error('Failed to copy to clipboard:', error)
        return false
      }
    }
  }
}

export function SocialShare({
  url,
  title,
  description,
  imageUrl,
  hashtags = [],
  className = '',
  buttonVariant = 'default',
  platforms = defaultPlatforms
}: SocialShareProps) {
  const [showDropdown, setShowDropdown] = useState(false)
  const [copiedRecently, setCopiedRecently] = useState(false)

  const shareData: SocialShareData = {
    url: window.location.origin + url,
    title,
    description,
    imageUrl,
    hashtags
  }

  const handleShare = async (platform: SocialPlatform) => {
    const config = platformConfigs[platform]
    
    if (config.action) {
      const success = await config.action(shareData)
      if (platform === 'copy' && success) {
        setCopiedRecently(true)
        setTimeout(() => setCopiedRecently(false), 2000)
      }
    } else {
      const shareUrl = config.getUrl(shareData)
      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400')
    }
    
    setShowDropdown(false)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareData.url
        })
      } catch (error) {
        console.log('Native share cancelled or failed:', error)
      }
    } else {
      setShowDropdown(!showDropdown)
    }
  }

  if (buttonVariant === 'floating') {
    return (
      <div className={`fixed right-4 top-1/2 transform -translate-y-1/2 z-50 ${className}`}>
        <div className="flex flex-col gap-2 bg-white shadow-lg rounded-lg p-2">
          {platforms.map((platform) => {
            const config = platformConfigs[platform]
            return (
              <button
                key={platform}
                onClick={() => handleShare(platform)}
                className={`btn btn-ghost btn-sm ${config.color} tooltip tooltip-left`}
                data-tip={config.name}
              >
                {platform === 'copy' && copiedRecently ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  config.icon
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (buttonVariant === 'minimal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {platforms.map((platform) => {
          const config = platformConfigs[platform]
          return (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className={`btn btn-ghost btn-xs ${config.color} tooltip`}
              data-tip={config.name}
            >
              {platform === 'copy' && copiedRecently ? (
                <Check className="w-3 h-3 text-success" />
              ) : (
                config.icon
              )}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleNativeShare}
        className="btn btn-outline btn-sm gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share
      </button>

      {showDropdown && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute top-full mt-2 left-0 bg-white shadow-lg rounded-lg border z-20 min-w-48">
            <div className="p-2">
              <div className="text-sm font-medium text-gray-700 px-3 py-2 border-b">
                Share this {title.toLowerCase().includes('piano') ? 'piano' : 'content'}
              </div>
              {platforms.map((platform) => {
                const config = platformConfigs[platform]
                return (
                  <button
                    key={platform}
                    onClick={() => handleShare(platform)}
                    className={`flex items-center gap-3 w-full px-3 py-2 text-sm rounded hover:bg-gray-50 ${config.color}`}
                  >
                    {platform === 'copy' && copiedRecently ? (
                      <Check className="w-4 h-4 text-success" />
                    ) : (
                      config.icon
                    )}
                    <span>
                      {platform === 'copy' && copiedRecently ? 'Copied!' : config.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Hook for easy integration with different content types
export function useSocialShare() {
  const generateShareData = (
    contentType: 'piano' | 'event' | 'blog' | 'page',
    content: any
  ) => {
    const baseUrl = window.location.origin
    
    switch (contentType) {
      case 'piano':
        return {
          url: `/pianos/${content.id}`,
          title: `🎹 ${content.name} - Public Piano in ${content.location_name}`,
          description: `Discover this amazing public piano: ${content.description || content.name}. Found in ${content.location_name}. #PublicPiano #WorldPianos`,
          imageUrl: content.images?.[0]?.image_url,
          hashtags: ['PublicPiano', 'WorldPianos', 'Music', content.category]
        }
        
      case 'event':
        return {
          url: `/events/${content.id}`,
          title: `🎵 ${content.title} - Piano Event`,
          description: `Join us for this piano event: ${content.description || content.title}. ${new Date(content.date).toLocaleDateString()} in ${content.location_name}. #PianoEvent #WorldPianos`,
          imageUrl: content.image_url,
          hashtags: ['PianoEvent', 'WorldPianos', 'Music', content.category]
        }
        
      case 'blog':
        return {
          url: `/blog/${content.id}`,
          title: content.title,
          description: content.excerpt || content.title,
          imageUrl: content.featured_image,
          hashtags: ['WorldPianos', 'Piano', 'Music', ...(content.tags || [])]
        }
        
      default:
        return {
          url: '/',
          title: 'WorldPianos.org - Discover Public Pianos Worldwide',
          description: 'Connect with piano enthusiasts globally. Find, share, and celebrate public pianos around the world.',
          hashtags: ['WorldPianos', 'PublicPiano', 'Music']
        }
    }
  }

  return { generateShareData }
}