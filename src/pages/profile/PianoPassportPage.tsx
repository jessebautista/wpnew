import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Trophy, 
  MapPin, 
  Star, 
  Heart, 
  Target, 
  Camera,
  Map,
  Clock,
  Award,
  Globe
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import type { Piano, PianoVisit, Achievement } from '../../types'
import { mockPianos } from '../../data/mockData'

interface PianoStats {
  totalVisits: number
  uniquePianos: number
  countriesVisited: number
  categoriesExplored: string[]
  favoriteCategory: string
  totalPhotos: number
  averageRating: number
  recentVisits: PianoVisit[]
}

export function PianoPassportPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<PianoStats | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [favoritePianos, setFavoritePianos] = useState<Piano[]>([])

  useEffect(() => {
    // In a real app, this would fetch user's piano passport data
    loadPassportData()
  }, [user])

  const loadPassportData = async () => {
    // Mock data for demonstration
    const mockStats: PianoStats = {
      totalVisits: 15,
      uniquePianos: 12,
      countriesVisited: 3,
      categoriesExplored: ['Park', 'Airport', 'Train Station', 'Street'],
      favoriteCategory: 'Park',
      totalPhotos: 28,
      averageRating: 4.2,
      recentVisits: [
        {
          id: '1',
          piano_id: '1',
          user_id: user?.id || '',
          visited_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          rating: 5,
          notes: 'Beautiful piano, great acoustics!'
        },
        {
          id: '2',
          piano_id: '4',
          user_id: user?.id || '',
          visited_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          rating: 4,
          notes: 'Nice location but could use tuning'
        }
      ]
    }

    const mockAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Steps',
        description: 'Visit your first piano',
        icon: 'piano',
        category: 'milestone',
        earned: true,
        earned_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 1,
        target: 1
      },
      {
        id: '2',
        title: 'Explorer',
        description: 'Visit 10 different pianos',
        icon: 'map',
        category: 'exploration',
        earned: true,
        earned_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        progress: 12,
        target: 10
      },
      {
        id: '3',
        title: 'Globetrotter',
        description: 'Visit pianos in 5 different countries',
        icon: 'globe',
        category: 'exploration',
        earned: false,
        earned_at: null,
        progress: 3,
        target: 5
      },
      {
        id: '4',
        title: 'Photographer',
        description: 'Upload 50 piano photos',
        icon: 'camera',
        category: 'contribution',
        earned: false,
        earned_at: null,
        progress: 28,
        target: 50
      }
    ]

    setStats(mockStats)
    setAchievements(mockAchievements)
    setFavoritePianos(mockPianos.slice(0, 2))
  }

  const getAchievementIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      piano: Trophy,
      map: Map,
      globe: Globe,
      camera: Camera,
      star: Star,
      award: Award
    }
    const IconComponent = icons[iconName] || Trophy
    return <IconComponent className="w-6 h-6" />
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Piano Passport</h1>
          <p className="text-base-content/70 mb-6">Please log in to view your Piano Passport</p>
          <Link to="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Piano Passport</h1>
        <p className="text-base-content/70">Track your piano journey around the world</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-primary">
            <MapPin className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Visits</div>
          <div className="stat-value text-primary">{stats?.totalVisits || 0}</div>
          <div className="stat-desc">Across {stats?.uniquePianos || 0} unique pianos</div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-secondary">
            <Globe className="w-8 h-8" />
          </div>
          <div className="stat-title">Countries</div>
          <div className="stat-value text-secondary">{stats?.countriesVisited || 0}</div>
          <div className="stat-desc">Piano locations visited</div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-accent">
            <Camera className="w-8 h-8" />
          </div>
          <div className="stat-title">Photos</div>
          <div className="stat-value text-accent">{stats?.totalPhotos || 0}</div>
          <div className="stat-desc">Shared with community</div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-warning">
            <Star className="w-8 h-8" />
          </div>
          <div className="stat-title">Avg Rating</div>
          <div className="stat-value text-warning">{stats?.averageRating || 0}</div>
          <div className="stat-desc">Your piano ratings</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Achievements */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <Trophy className="w-6 h-6" />
                Achievements
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`card bg-base-200 ${achievement.earned ? 'border-2 border-success' : 'opacity-60'}`}
                  >
                    <div className="card-body p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-success text-success-content' : 'bg-base-300'}`}>
                          {getAchievementIcon(achievement.icon)}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{achievement.title}</h3>
                          <p className="text-sm text-base-content/70 mb-2">{achievement.description}</p>
                          <div className="flex items-center gap-2">
                            <progress 
                              className="progress progress-primary w-20" 
                              value={achievement.progress} 
                              max={achievement.target}
                            />
                            <span className="text-sm">{achievement.progress}/{achievement.target}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="card bg-base-100 shadow-xl mb-6">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <Clock className="w-6 h-6" />
                Recent Visits
              </h2>
              <div className="space-y-3">
                {stats?.recentVisits.map((visit) => {
                  const piano = mockPianos.find(p => p.id === visit.piano_id)
                  return (
                    <div key={visit.id} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <MapPin className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <Link to={`/pianos/${piano?.id}`} className="font-medium hover:link">
                          {piano?.name}
                        </Link>
                        <div className="flex items-center gap-1 text-sm text-base-content/70">
                          <div className="rating rating-xs">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-3 h-3 ${star <= (visit.rating || 0) ? 'text-warning fill-current' : 'text-base-300'}`}
                              />
                            ))}
                          </div>
                          <span>• {new Date(visit.visited_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Link to="/dashboard/visits" className="btn btn-outline btn-sm mt-4">
                View All Visits
              </Link>
            </div>
          </div>

          {/* Favorite Pianos */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">
                <Heart className="w-6 h-6" />
                Favorites
              </h2>
              <div className="space-y-3">
                {favoritePianos.map((piano) => (
                  <div key={piano.id} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-10">
                        <MapPin className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <Link to={`/pianos/${piano.id}`} className="font-medium hover:link">
                        {piano.name}
                      </Link>
                      <p className="text-sm text-base-content/70">{piano.location_name}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/dashboard/favorites" className="btn btn-outline btn-sm mt-4">
                View All Favorites
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Towards Next Achievement */}
      <div className="mt-8">
        <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
          <div className="card-body">
            <h2 className="card-title">
              <Target className="w-6 h-6" />
              Next Achievement
            </h2>
            {achievements.find(a => !a.earned) && (
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {achievements.find(a => !a.earned)?.title}
                  </h3>
                  <p className="opacity-90 mb-2">
                    {achievements.find(a => !a.earned)?.description}
                  </p>
                  <progress 
                    className="progress progress-info w-full" 
                    value={achievements.find(a => !a.earned)?.progress || 0} 
                    max={achievements.find(a => !a.earned)?.target || 1}
                  />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {achievements.find(a => !a.earned)?.progress} / {achievements.find(a => !a.earned)?.target}
                  </div>
                  <div className="text-sm opacity-90">Progress</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}