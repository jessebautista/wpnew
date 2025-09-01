import { useState, useEffect } from 'react'
import { 
  Share2, 
  TrendingUp, 
  BarChart3,
  Users,
  ExternalLink,
  Calendar,
  Target,
  Award
} from 'lucide-react'
import { SocialSharingService, type SocialPlatform } from '../../services/socialSharingService'

interface SocialSharingStatsProps {
  className?: string
}

interface PlatformStats {
  platform: SocialPlatform
  shares: number
  percentage: number
  trend: 'up' | 'down' | 'stable'
}

export function SocialSharingStats({ className = '' }: SocialSharingStatsProps) {
  const [overallStats, setOverallStats] = useState({
    totalShares: 0,
    recentShares: 0,
    mostPopularPlatform: 'facebook' as SocialPlatform
  })
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([])
  const [contentTypeStats, setContentTypeStats] = useState([
    { type: 'piano', shares: 0, percentage: 0 },
    { type: 'event', shares: 0, percentage: 0 },
    { type: 'blog_post', shares: 0, percentage: 0 }
  ])

  useEffect(() => {
    loadSharingStats()
  }, [])

  const loadSharingStats = () => {
    // Get overall stats
    const overall = SocialSharingService.getShareStats()
    setOverallStats(overall)

    // Get platform breakdown
    const platforms = Object.entries(overall.byPlatform).map(([platform, shares]) => ({
      platform: platform as SocialPlatform,
      shares,
      percentage: overall.totalShares > 0 ? (shares / overall.totalShares) * 100 : 0,
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'stable' : 'down' // Mock trend data
    }))
    setPlatformStats(platforms.sort((a, b) => b.shares - a.shares))

    // Get content type stats
    const contentTypes = ['piano', 'event', 'blog_post'] as const
    const contentStats = contentTypes.map(type => {
      const stats = SocialSharingService.getShareStats(undefined, type)
      return {
        type,
        shares: stats.totalShares,
        percentage: overall.totalShares > 0 ? (stats.totalShares / overall.totalShares) * 100 : 0
      }
    })
    setContentTypeStats(contentStats)
  }

  const getPlatformColor = (platform: SocialPlatform) => {
    const colors = {
      facebook: 'text-blue-600 bg-blue-50',
      twitter: 'text-sky-500 bg-sky-50',
      linkedin: 'text-blue-700 bg-blue-50',
      reddit: 'text-orange-600 bg-orange-50',
      whatsapp: 'text-green-600 bg-green-50',
      telegram: 'text-blue-500 bg-blue-50',
      email: 'text-gray-600 bg-gray-50',
      copy: 'text-gray-600 bg-gray-50'
    }
    return colors[platform] || 'text-gray-600 bg-gray-50'
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-3 h-3 text-success" />
    if (trend === 'down') return <TrendingUp className="w-3 h-3 text-error rotate-180" />
    return <div className="w-3 h-3 bg-warning rounded-full" />
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="stat bg-primary/10 rounded-lg p-4">
          <div className="stat-figure text-primary">
            <Share2 className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Shares</div>
          <div className="stat-value text-primary">{overallStats.totalShares}</div>
          <div className="stat-desc">All content types</div>
        </div>
        
        <div className="stat bg-secondary/10 rounded-lg p-4">
          <div className="stat-figure text-secondary">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Recent Activity</div>
          <div className="stat-value text-secondary">{overallStats.recentShares}</div>
          <div className="stat-desc">Last 7 days</div>
        </div>
        
        <div className="stat bg-accent/10 rounded-lg p-4">
          <div className="stat-figure text-accent">
            <Award className="w-8 h-8" />
          </div>
          <div className="stat-title">Top Platform</div>
          <div className="stat-value text-accent capitalize">
            {overallStats.mostPopularPlatform}
          </div>
          <div className="stat-desc">Most shares</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Breakdown */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">
                <BarChart3 className="w-5 h-5" />
                Platform Breakdown
              </h3>
              <button 
                onClick={loadSharingStats}
                className="btn btn-ghost btn-sm"
                title="Refresh data"
              >
                ↻
              </button>
            </div>
            
            <div className="space-y-3">
              {platformStats.length > 0 ? (
                platformStats.map((stat) => (
                  <div key={stat.platform} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getPlatformColor(stat.platform).split(' ')[1]}`} />
                      <span className="font-medium capitalize">{stat.platform}</span>
                      {getTrendIcon(stat.trend)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-base-content/60">
                        {stat.percentage.toFixed(1)}%
                      </span>
                      <span className="badge badge-outline">
                        {stat.shares}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <Share2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No sharing activity yet</p>
                  <p className="text-sm">Start sharing content to see analytics</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Type Performance */}
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title mb-4">
              <Target className="w-5 h-5" />
              Content Performance
            </h3>
            
            <div className="space-y-4">
              {contentTypeStats.map((stat) => (
                <div key={stat.type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">
                      {stat.type.replace('_', ' ')}s
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-base-content/60">
                        {stat.percentage.toFixed(1)}%
                      </span>
                      <span className="badge badge-neutral">
                        {stat.shares}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-base-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {overallStats.totalShares === 0 && (
              <div className="text-center py-6 text-base-content/60">
                <Target className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No content has been shared yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sharing Tips */}
      <div className="card bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="card-body">
          <h3 className="card-title">
            <Users className="w-5 h-5" />
            Boost Your Social Reach
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Engagement Tips:</h4>
              <ul className="text-sm space-y-1 text-base-content/80">
                <li>• Add compelling images to piano listings</li>
                <li>• Write engaging event descriptions</li>
                <li>• Include location details for better discovery</li>
                <li>• Use relevant hashtags in social posts</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Best Practices:</h4>
              <ul className="text-sm space-y-1 text-base-content/80">
                <li>• Share during peak social media hours</li>
                <li>• Cross-promote on multiple platforms</li>
                <li>• Engage with community comments</li>
                <li>• Feature user-generated content</li>
              </ul>
            </div>
          </div>
          <div className="card-actions justify-end mt-4">
            <a 
              href="/blog/social-media-guide" 
              className="btn btn-primary btn-sm gap-2"
            >
              Learn More
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}