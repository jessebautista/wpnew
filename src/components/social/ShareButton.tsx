import { useState } from 'react'
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageSquare,
  Send,
  Mail,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react'
import { SocialSharingService, type ShareData, type SocialPlatform } from '../../services/socialSharingService'
import { useAuth } from '../auth/AuthProvider'

interface ShareButtonProps {
  shareData: ShareData
  contentType: 'piano' | 'event' | 'blog_post'
  contentId: string
  variant?: 'button' | 'dropdown' | 'inline'
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const platformConfig = {
  facebook: {
    icon: Facebook,
    label: 'Facebook',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  twitter: {
    icon: Twitter,
    label: 'Twitter',
    color: 'text-sky-500',
    bgColor: 'bg-sky-50 hover:bg-sky-100'
  },
  linkedin: {
    icon: Linkedin,
    label: 'LinkedIn',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  reddit: {
    icon: MessageSquare,
    label: 'Reddit',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 hover:bg-orange-100'
  },
  whatsapp: {
    icon: MessageSquare,
    label: 'WhatsApp',
    color: 'text-green-600',
    bgColor: 'bg-green-50 hover:bg-green-100'
  },
  telegram: {
    icon: Send,
    label: 'Telegram',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50 hover:bg-blue-100'
  },
  email: {
    icon: Mail,
    label: 'Email',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100'
  },
  copy: {
    icon: Copy,
    label: 'Copy Link',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50 hover:bg-gray-100'
  }
}

export function ShareButton({ 
  shareData, 
  contentType, 
  contentId, 
  variant = 'button',
  size = 'md',
  showLabel = true,
  className = ''
}: ShareButtonProps) {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [nativeShared, setNativeShared] = useState(false)

  const handleNativeShare = async () => {
    const success = await SocialSharingService.shareNative(shareData)
    if (success) {
      SocialSharingService.trackShare('copy', contentType, contentId, user?.id)
      setNativeShared(true)
      setTimeout(() => setNativeShared(false), 2000)
    } else {
      // Fallback to dropdown if native sharing fails
      setIsOpen(!isOpen)
    }
  }

  const handlePlatformShare = async (platform: SocialPlatform) => {
    if (platform === 'copy') {
      const success = await SocialSharingService.copyToClipboard(shareData)
      if (success) {
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2000)
      }
    } else {
      SocialSharingService.shareToPlatform(platform, shareData)
    }

    SocialSharingService.trackShare(platform, contentType, contentId, user?.id)
    setIsOpen(false)
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'btn-sm'
      case 'lg': return 'btn-lg'
      default: return ''
    }
  }

  if (variant === 'button') {
    return (
      <button
        onClick={handleNativeShare}
        className={`btn btn-outline ${getSizeClasses()} ${className}`}
        title="Share"
      >
        {nativeShared ? (
          <Check className="w-4 h-4" />
        ) : (
          <Share2 className="w-4 h-4" />
        )}
        {showLabel && (
          <span className="ml-2">
            {nativeShared ? 'Shared!' : 'Share'}
          </span>
        )}
      </button>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap gap-2 ${className}`}>
        {Object.entries(platformConfig).map(([platform, config]) => {
          const Icon = config.icon
          return (
            <button
              key={platform}
              onClick={() => handlePlatformShare(platform as SocialPlatform)}
              className={`btn btn-circle btn-sm ${config.bgColor} border-0 ${config.color}`}
              title={`Share on ${config.label}`}
            >
              {platform === 'copy' && copiedLink ? (
                <Check className="w-4 h-4" />
              ) : (
                <Icon className="w-4 h-4" />
              )}
            </button>
          )
        })}
      </div>
    )
  }

  // Dropdown variant
  return (
    <div className={`dropdown dropdown-end ${className}`}>
      <button
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        className={`btn btn-outline ${getSizeClasses()}`}
        title="Share"
      >
        <Share2 className="w-4 h-4" />
        {showLabel && <span className="ml-2">Share</span>}
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <ul 
            tabIndex={0} 
            className="dropdown-content z-20 menu p-2 shadow-lg bg-base-100 rounded-box w-52 border"
          >
            {Object.entries(platformConfig).map(([platform, config]) => {
              const Icon = config.icon
              return (
                <li key={platform}>
                  <button
                    onClick={() => handlePlatformShare(platform as SocialPlatform)}
                    className="flex items-center gap-3 py-2"
                  >
                    {platform === 'copy' && copiedLink ? (
                      <Check className={`w-4 h-4 ${config.color}`} />
                    ) : (
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    )}
                    <span>
                      {platform === 'copy' && copiedLink ? 'Copied!' : config.label}
                    </span>
                    {!['copy', 'email'].includes(platform) && (
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}