import { useState } from 'react'
import { 
  Share2, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  Heart,
  Copy,
  Check,
  ChevronUp
} from 'lucide-react'
import { SocialSharingService, type ShareData, type SocialPlatform } from '../../services/socialSharingService'
import { useAuth } from '../auth/AuthProvider'

interface FloatingSocialShareProps {
  shareData: ShareData
  contentType: 'piano' | 'event' | 'blog_post'
  contentId: string
  position?: 'left' | 'right'
  className?: string
  showLikes?: boolean
  likeCount?: number
  onLike?: () => void
  isLiked?: boolean
}

const platformConfig = {
  facebook: {
    icon: Facebook,
    color: 'text-blue-600 hover:text-blue-700',
    bgColor: 'hover:bg-blue-50'
  },
  twitter: {
    icon: Twitter,
    color: 'text-sky-500 hover:text-sky-600',
    bgColor: 'hover:bg-sky-50'
  },
  linkedin: {
    icon: Linkedin,
    color: 'text-blue-700 hover:text-blue-800',
    bgColor: 'hover:bg-blue-50'
  },
  whatsapp: {
    icon: MessageCircle,
    color: 'text-green-600 hover:text-green-700',
    bgColor: 'hover:bg-green-50'
  },
  copy: {
    icon: Copy,
    color: 'text-gray-600 hover:text-gray-700',
    bgColor: 'hover:bg-gray-50'
  }
}

export function FloatingSocialShare({
  shareData,
  contentType,
  contentId,
  position = 'left',
  className = '',
  showLikes = false,
  likeCount = 0,
  onLike,
  isLiked = false
}: FloatingSocialShareProps) {
  const { user } = useAuth()
  const [isExpanded, setIsExpanded] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [shareCount, setShareCount] = useState(0)

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
    setShareCount(prev => prev + 1)
  }

  const positionClasses = position === 'left' 
    ? 'left-4' 
    : 'right-4'

  const platformsToShow: SocialPlatform[] = ['facebook', 'twitter', 'linkedin', 'whatsapp', 'copy']

  return (
    <div className={`fixed top-1/2 transform -translate-y-1/2 z-50 ${positionClasses} ${className}`}>
      <div className="bg-white shadow-xl rounded-2xl border border-gray-200 overflow-hidden">
        {/* Main Share Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col items-center p-4 hover:bg-gray-50 transition-colors group"
          title="Share this content"
        >
          <Share2 className="w-5 h-5 text-gray-600 group-hover:text-primary mb-1" />
          <span className="text-xs font-medium text-gray-600 group-hover:text-primary">
            Share
          </span>
          {shareCount > 0 && (
            <span className="text-xs text-gray-500 mt-1">
              {shareCount}
            </span>
          )}
        </button>

        {/* Expanded Platform Options */}
        {isExpanded && (
          <div className="border-t border-gray-200">
            {platformsToShow.map((platform) => {
              const config = platformConfig[platform]
              const Icon = config.icon
              
              return (
                <button
                  key={platform}
                  onClick={() => handlePlatformShare(platform)}
                  className={`flex flex-col items-center p-3 w-full transition-colors ${config.bgColor}`}
                  title={`Share on ${platform}`}
                >
                  {platform === 'copy' && copiedLink ? (
                    <Check className="w-4 h-4 text-green-600 mb-1" />
                  ) : (
                    <Icon className={`w-4 h-4 mb-1 ${config.color}`} />
                  )}
                  <span className="text-xs text-gray-600 capitalize">
                    {platform === 'copy' && copiedLink ? 'Copied!' : platform}
                  </span>
                </button>
              )
            })}
            
            {/* Collapse button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="flex flex-col items-center p-2 w-full hover:bg-gray-50 border-t border-gray-100"
            >
              <ChevronUp className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Like Button (if enabled) */}
        {showLikes && onLike && (
          <div className="border-t border-gray-200">
            <button
              onClick={onLike}
              className="flex flex-col items-center p-4 w-full hover:bg-red-50 transition-colors group"
              title={isLiked ? 'Unlike this content' : 'Like this content'}
            >
              <Heart className={`w-5 h-5 mb-1 ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600 group-hover:text-red-500'}`} />
              <span className="text-xs font-medium text-gray-600 group-hover:text-red-500">
                {isLiked ? 'Liked' : 'Like'}
              </span>
              {likeCount > 0 && (
                <span className="text-xs text-gray-500 mt-1">
                  {likeCount}
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact inline version for smaller spaces
export function CompactSocialShare({
  shareData,
  contentType,
  contentId,
  className = '',
  showCounts = false
}: {
  shareData: ShareData
  contentType: 'piano' | 'event' | 'blog_post'
  contentId: string
  className?: string
  showCounts?: boolean
}) {
  const { user } = useAuth()
  const [copiedLink, setCopiedLink] = useState(false)

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
  }

  const platforms: SocialPlatform[] = ['facebook', 'twitter', 'whatsapp', 'copy']

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600 mr-2">Share:</span>
      {platforms.map((platform) => {
        const config = platformConfig[platform]
        const Icon = config.icon
        
        return (
          <button
            key={platform}
            onClick={() => handlePlatformShare(platform)}
            className={`p-2 rounded-full transition-colors ${config.bgColor} tooltip`}
            data-tip={`Share on ${platform}`}
            title={`Share on ${platform}`}
          >
            {platform === 'copy' && copiedLink ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Icon className={`w-4 h-4 ${config.color}`} />
            )}
          </button>
        )
      })}
      
      {showCounts && (
        <span className="text-xs text-gray-500 ml-2">
          {SocialSharingService.getShareStats(contentId, contentType).totalShares} shares
        </span>
      )}
    </div>
  )
}