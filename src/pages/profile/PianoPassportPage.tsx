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
import type { Piano, Achievement } from '../../types'
import { supabase } from '../../lib/supabase'

interface PianoStats {
  totalVisits: number
  uniquePianos: number
  countriesVisited: number
  categoriesExplored: string[]
  favoriteCategory: string
  totalPhotos: number
  averageRating: number
  recentVisits: any[]
  pianoVisits: any[]
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
      // Get user's piano visits
      const { data: pianoVisits } = await supabase
        .from('piano_visits')
        .select(`
          *,
          pianos:piano_id (
            id,
            name,
            location_name,
            category,
            latitude,
            longitude
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      // Get user's uploaded images
      const { data: userImages } = await supabase
        .from('piano_images')
        .select('*')
        .eq('user_id', user.id)
      
      // Get user's created pianos
      const { data: userPianos } = await supabase
        .from('pianos')
        .select('*')
        .eq('created_by', user.id)
      
      
      // Calculate stats from real data
      const visits = pianoVisits || []
      const totalVisits = visits.length
      const uniquePianos = new Set(visits.map(v => v.piano_id)).size
      const totalPhotos = userImages?.length || 0
      
      // Calculate average rating
      const ratingsSum = visits.reduce((sum, visit) => sum + (visit.rating || 0), 0)
      const averageRating = totalVisits > 0 ? Math.round((ratingsSum / totalVisits) * 10) / 10 : 0
      
      // Calculate countries visited (extract from piano locations)
      const countriesVisited = new Set(
        visits
          .map(v => v.pianos?.location_name)
          .filter(Boolean)
          .map(location => {
            // Simple country extraction - in production, use proper geocoding
            const parts = location.split(',')
            return parts[parts.length - 1]?.trim()
          })
          .filter(Boolean)
      ).size
      
      // Calculate categories explored
      const categoriesExplored = [...new Set(
        visits
          .map(v => v.pianos?.category)
          .filter(Boolean)
      )]
      const favoriteCategory = categoriesExplored[0] || 'None'
      
      const passportStats: PianoStats = {
        totalVisits,
        uniquePianos,
        countriesVisited,
        categoriesExplored,
        favoriteCategory,
        totalPhotos,
        averageRating,
        recentVisits: visits.slice(0, 5),
        pianoVisits: visits
      }

      // Generate achievements based on real stats
      const pianosAdded = userPianos?.length || 0
      
      const dynamicAchievements: Achievement[] = [
        {
          id: '1',
          title: 'First Steps',
          description: 'Rate your first piano',
          icon: 'piano',
          category: 'milestone',
          earned: totalVisits > 0,
          earned_at: totalVisits > 0 ? new Date().toISOString() : null,
          progress: Math.min(totalVisits, 1),
          target: 1
        },
        {
          id: '2',
          title: 'Piano Explorer',
          description: 'Visit 5 different pianos',
          icon: 'map',
          category: 'exploration',
          earned: uniquePianos >= 5,
          earned_at: uniquePianos >= 5 ? new Date().toISOString() : null,
          progress: uniquePianos,
          target: 5
        },
        {
          id: '3',
          title: 'Photographer',
          description: 'Upload 3 piano photos',
          icon: 'camera',
          category: 'contribution',
          earned: totalPhotos >= 3,
          earned_at: totalPhotos >= 3 ? new Date().toISOString() : null,
          progress: totalPhotos,
          target: 3
        },
        {
          id: '4',
          title: 'Globe Trotter',
          description: 'Visit pianos in 3 different countries',
          icon: 'globe',
          category: 'exploration',
          earned: countriesVisited >= 3,
          earned_at: countriesVisited >= 3 ? new Date().toISOString() : null,
          progress: countriesVisited,
          target: 3
        },
        {
          id: '5',
          title: 'Piano Contributor',
          description: 'Add a piano to the map',
          icon: 'award',
          category: 'contribution',
          earned: pianosAdded > 0,
          earned_at: pianosAdded > 0 ? new Date().toISOString() : null,
          progress: Math.min(pianosAdded, 1),
          target: 1
        }
      ]

      setStats(passportStats)
      setAchievements(dynamicAchievements)
      
      // Set favorite pianos from highest rated visits
      const favoritePianos = visits
        .filter(v => v.pianos && v.rating >= 4)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3)
        .map(v => v.pianos)
      setFavoritePianos(favoritePianos)
      
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
        recentVisits: [],
        pianoVisits: []
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
                          {visit.pianos?.name || 'Piano Visit'}
                        </Link>
                        <div className="text-xs text-base-content/50 mb-1">
                          {visit.pianos?.location_name}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-base-content/70">
                          <div className="rating rating-xs">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`w-3 h-3 ${star <= (visit.rating || 0) ? 'text-warning fill-current' : 'text-base-300'}`}
                              />
                            ))}
                          </div>
                          <span>• {new Date(visit.created_at).toLocaleDateString()}</span>
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