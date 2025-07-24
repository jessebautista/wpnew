import { Facebook, Twitter, Instagram, Youtube, Music } from 'lucide-react'

interface SocialFollowProps {
  variant?: 'horizontal' | 'vertical' | 'grid'
  size?: 'sm' | 'md' | 'lg'
  showLabels?: boolean
  showCounts?: boolean
  className?: string
}

const socialAccounts = {
  facebook: {
    icon: Facebook,
    label: 'Facebook',
    url: 'https://facebook.com/worldpianos',
    handle: '@worldpianos',
    followers: '12.5K',
    color: 'text-blue-600 hover:text-blue-700',
    bgColor: 'hover:bg-blue-50'
  },
  twitter: {
    icon: Twitter,
    label: 'Twitter',
    url: 'https://twitter.com/worldpianos',
    handle: '@worldpianos',
    followers: '8.2K',
    color: 'text-sky-500 hover:text-sky-600',
    bgColor: 'hover:bg-sky-50'
  },
  instagram: {
    icon: Instagram,
    label: 'Instagram',
    url: 'https://instagram.com/worldpianos',
    handle: '@worldpianos',
    followers: '15.3K',
    color: 'text-pink-500 hover:text-pink-600',
    bgColor: 'hover:bg-pink-50'
  },
  youtube: {
    icon: Youtube,
    label: 'YouTube',
    url: 'https://youtube.com/@worldpianos',
    handle: '@worldpianos',
    followers: '4.7K',
    color: 'text-red-600 hover:text-red-700',
    bgColor: 'hover:bg-red-50'
  },
  tiktok: {
    icon: Music,
    label: 'TikTok',
    url: 'https://tiktok.com/@worldpianos',
    handle: '@worldpianos',
    followers: '23.1K',
    color: 'text-gray-900 hover:text-black',
    bgColor: 'hover:bg-gray-50'
  }
}

export function SocialFollow({ 
  variant = 'horizontal',
  size = 'md',
  showLabels = true,
  showCounts = false,
  className = ''
}: SocialFollowProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-8 h-8'
      case 'lg': return 'w-12 h-12'
      default: return 'w-10 h-10'
    }
  }

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4'
      case 'lg': return 'w-6 h-6'
      default: return 'w-5 h-5'
    }
  }

  const getLayoutClasses = () => {
    switch (variant) {
      case 'vertical':
        return 'flex flex-col gap-3'
      case 'grid':
        return 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'
      default:
        return 'flex flex-wrap gap-3'
    }
  }

  const getItemClasses = () => {
    if (variant === 'grid') {
      return 'flex flex-col items-center gap-2 p-4 rounded-lg transition-colors'
    }
    return 'flex items-center gap-3 p-2 rounded-lg transition-colors'
  }

  return (
    <div className={`${getLayoutClasses()} ${className}`}>
      {Object.entries(socialAccounts).map(([platform, account]) => {
        const Icon = account.icon
        
        return (
          <a
            key={platform}
            href={account.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${getItemClasses()} ${account.bgColor}`}
            title={`Follow us on ${account.label}`}
          >
            {/* Icon */}
            <div className={`${getSizeClasses()} flex items-center justify-center`}>
              <Icon className={`${getIconSize()} ${account.color}`} />
            </div>

            {/* Content */}
            {(showLabels || showCounts) && (
              <div className={`${variant === 'grid' ? 'text-center' : ''}`}>
                {showLabels && (
                  <div className={`font-medium ${size === 'sm' ? 'text-sm' : ''}`}>
                    {account.label}
                  </div>
                )}
                {showCounts && (
                  <div className={`text-base-content/60 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}>
                    {account.followers} followers
                  </div>
                )}
                {!showLabels && !showCounts && variant !== 'horizontal' && (
                  <div className="text-xs text-base-content/60">{account.handle}</div>
                )}
              </div>
            )}
          </a>
        )
      })}
    </div>
  )
}