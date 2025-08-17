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
import { userService, pianoService } from '../../utils/database'

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
    if (!user?.id) return

    try {
      // Load user piano stats
      const userStats = await userService.getPianoStats(user.id)
      
      // Load all pianos to calculate additional stats
      const allPianos = await pianoService.getAll()
      const userPianos = allPianos.filter(p => p.created_by === user.id)
      
      // Calculate categories explored
      const categoriesExplored = [...new Set(userPianos.map(p => p.category))]
      const favoriteCategory = categoriesExplored.length > 0 ? categoriesExplored[0] : 'None'
      
      // TODO: Replace with real data when piano_visits table and photo tracking is implemented
      const passportStats: PianoStats = {
        totalVisits: userStats.pianos_visited || 0,
        uniquePianos: userStats.pianos_visited || 0,
        countriesVisited: userStats.countries_visited || 0,
        categoriesExplored,
        favoriteCategory,
        totalPhotos: 0, // TODO: Count from piano_images table
        averageRating: 0, // TODO: Calculate from piano_visits ratings
        recentVisits: [] // TODO: Load from piano_visits table
      }

      // Generate achievements based on real stats
      const dynamicAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Steps',
          description: 'Add your first piano',
          icon: 'piano',
          category: 'milestone',
          earned: userStats.pianos_added > 0,
          earned_at: userStats.pianos_added > 0 ? new Date().toISOString() : null,
          progress: Math.min(userStats.pianos_added, 1),
          target: 1
        },
        {
          id: '2',
          title: 'Piano Collector',
          description: 'Add 5 different pianos',
          icon: 'map',
          category: 'exploration',
          earned: userStats.pianos_added >= 5,
          earned_at: userStats.pianos_added >= 5 ? new Date().toISOString() : null,
          progress: userStats.pianos_added,
          target: 5
        },
        {
          id: '3',
          title: 'Event Organizer',
          description: 'Create your first event',
          icon: 'globe',
          category: 'community',
          earned: userStats.events_created > 0,
          earned_at: userStats.events_created > 0 ? new Date().toISOString() : null,
          progress: Math.min(userStats.events_created, 1),
          target: 1
        },
        {
          id: '4',
          title: 'Explorer',
          description: 'Visit pianos in 3 different countries',
          icon: 'camera',
          category: 'exploration',
          earned: userStats.countries_visited >= 3,
          earned_at: userStats.countries_visited >= 3 ? new Date().toISOString() : null,
          progress: userStats.countries_visited,
          target: 3
        }
      ]

      setStats(passportStats)
      setAchievements(dynamicAchievements)
      
      // Set favorite pianos as the most recent user-created pianos
      setFavoritePianos(userPianos.slice(0, 2))
      
    } catch (error) {
      console.error('Error loading passport data:', error)
      
      // Fallback to empty stats
      setStats({
        totalVisits: 0,
        uniquePianos: 0,
        countriesVisited: 0,
        categoriesExplored: [],
        favoriteCategory: 'None',
        totalPhotos: 0,
        averageRating: 0,
        recentVisits: []
      })
      setAchievements([])
      setFavoritePianos([])
    }
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
                {stats?.recentVisits && stats.recentVisits.length > 0 ? (
                  stats.recentVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <MapPin className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <Link to={`/pianos/${visit.piano_id}`} className="font-medium hover:link">
                          Piano Visit #{visit.id}
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
                  ))
                ) : (
                  <div className="text-center py-6 text-base-content/70">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No piano visits yet!</p>
                    <p className="text-sm">Start exploring pianos to see your visits here.</p>
                  </div>
                )}
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