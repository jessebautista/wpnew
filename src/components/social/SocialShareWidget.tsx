import { useState, useEffect } from 'react'
import { 
  Share2, 
  TrendingUp, 
  Users,
  Heart,
  MessageCircle,
  ExternalLink,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube
} from 'lucide-react'
import { SocialSharingService } from '../../services/socialSharingService'

interface SocialShareWidgetProps {
  className?: string
  variant?: 'compact' | 'full' | 'sidebar'
  showStats?: boolean
  showFollowButtons?: boolean
}

export function SocialShareWidget({
  className = '',
  variant = 'full',
  showStats = true,
  showFollowButtons = true
}: SocialShareWidgetProps) {
  const [shareStats, setShareStats] = useState({
    totalShares: 0,
    recentShares: 0,
    mostPopularPlatform: 'facebook' as const
  })

  useEffect(() => {
    // Get overall sharing statistics
    const stats = SocialSharingService.getShareStats()
    setShareStats(stats)
  }, [])

  const socialMediaLinks = {
    facebook: { 
      url: 'https://facebook.com/worldpianos', 
      icon: Facebook, 
      color: 'text-blue-600 hover:text-blue-700',
      followers: '1.2K' 
    },
    twitter: { 
      url: 'https://twitter.com/worldpianos', 
      icon: Twitter, 
      color: 'text-sky-500 hover:text-sky-600',
      followers: '856' 
    },
    linkedin: { 
      url: 'https://linkedin.com/company/worldpianos', 
      icon: Linkedin, 
      color: 'text-blue-700 hover:text-blue-800',
      followers: '432' 
    },
    instagram: { 
      url: 'https://instagram.com/worldpianos', 
      icon: Instagram, 
      color: 'text-pink-600 hover:text-pink-700',
      followers: '2.1K' 
    },
    youtube: { 
      url: 'https://youtube.com/@worldpianos', 
      icon: Youtube, 
      color: 'text-red-600 hover:text-red-700',
      followers: '1.8K' 
    }
  }

  const handleSiteShare = () => {
    const shareData = {
      title: 'WorldPianos.org - Discover Public Pianos Worldwide',
      text: 'Join the global piano community! Discover, share, and celebrate public pianos around the world. 🎹 #WorldPianos #PublicPiano',
      url: window.location.origin,
      hashtags: ['WorldPianos', 'PublicPiano', 'Music', 'Community']
    }

    if (navigator.share) {
      navigator.share({
        title: shareData.title,
        text: shareData.text,
        url: shareData.url
      })
    } else {
      // Fallback to Twitter share
      SocialSharingService.shareToPlatform('twitter', shareData)
    }
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <button
          onClick={handleSiteShare}
          className="btn btn-sm btn-primary gap-2"
        >
          <Share2 className="w-4 h-4" />
          Share WorldPianos
        </button>
        
        {showFollowButtons && (
          <div className="flex gap-2">
            {Object.entries(socialMediaLinks).slice(0, 3).map(([platform, config]) => {
              const Icon = config.icon
              return (
                <a
                  key={platform}
                  href={config.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-ghost btn-sm btn-circle ${config.color}`}
                  title={`Follow us on ${platform}`}
                >
                  <Icon className="w-4 h-4" />
                </a>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'sidebar') {
    return (
      <div className={`bg-base-100 rounded-lg shadow-sm border p-6 ${className}`}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary" />
          Join Our Community
        </h3>
        
        <p className="text-base-content/70 text-sm mb-6">
          Connect with piano enthusiasts worldwide and stay updated with the latest discoveries!
        </p>

        {showStats && (
          <div className="grid grid-cols-1 gap-3 mb-6">
            <div className="stat py-2 px-0">
              <div className="stat-figure text-primary">
                <Share2 className="w-6 h-6" />
              </div>
              <div className="stat-title text-xs">Total Shares</div>
              <div className="stat-value text-lg">{shareStats.totalShares}</div>
            </div>
            <div className="stat py-2 px-0">
              <div className="stat-figure text-secondary">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="stat-title text-xs">This Week</div>
              <div className="stat-value text-lg">{shareStats.recentShares}</div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleSiteShare}
            className="btn btn-primary w-full gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share WorldPianos
          </button>

          {showFollowButtons && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-base-content/60 uppercase tracking-wide">
                Follow Us
              </p>
              {Object.entries(socialMediaLinks).map(([platform, config]) => {
                const Icon = config.icon
                return (
                  <a
                    key={platform}
                    href={config.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded hover:bg-base-200 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${config.color}`} />
                      <span className="text-sm font-medium capitalize">{platform}</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs text-base-content/60">{config.followers}</span>
                      <ExternalLink className="w-3 h-3 text-base-content/40" />
                    </div>
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Full variant
  return (
    <div className={`bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-6 ${className}`}>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Share the Music</h2>
        <p className="text-base-content/70">
          Help grow our global piano community by sharing WorldPianos with your friends!
        </p>
      </div>

      {showStats && (
        <div className="stats stats-horizontal w-full mb-6 bg-white/50">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Share2 className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Shares</div>
            <div className="stat-value text-2xl">{shareStats.totalShares}</div>
            <div className="stat-desc">All time</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-secondary">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="stat-title">This Week</div>
            <div className="stat-value text-2xl">{shareStats.recentShares}</div>
            <div className="stat-desc">↗︎ Growing</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-accent">
              <Heart className="w-8 h-8" />
            </div>
            <div className="stat-title">Community</div>
            <div className="stat-value text-2xl">5.2K</div>
            <div className="stat-desc">Active users</div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-6">
        <button
          onClick={handleSiteShare}
          className="btn btn-primary btn-lg gap-2"
        >
          <Share2 className="w-5 h-5" />
          Share WorldPianos
        </button>
      </div>

      {showFollowButtons && (
        <div className="border-t pt-6">
          <p className="text-center text-sm font-medium text-base-content/80 mb-4">
            Follow us on social media for updates and piano discoveries
          </p>
          <div className="flex justify-center gap-3">
            {Object.entries(socialMediaLinks).map(([platform, config]) => {
              const Icon = config.icon
              return (
                <a
                  key={platform}
                  href={config.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-circle ${config.color} hover:scale-110 transition-transform`}
                  title={`Follow us on ${platform} (${config.followers} followers)`}
                >
                  <Icon className="w-5 h-5" />
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}