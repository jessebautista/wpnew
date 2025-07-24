import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../components/auth/AuthProvider'
import { Piano, Calendar, Star, MapPin, TrendingUp, Award, Book } from 'lucide-react'
import { userService } from '../../utils/database'

export function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (!user) return
      
      try {
        const pianoStats = await userService.getPianoStats(user.id)
        setStats(pianoStats)
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-primary text-primary-content py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-6">
            <div className="avatar">
              <div className="w-20 h-20 rounded-full bg-primary-content/20">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-2xl font-bold">
                    {user?.full_name?.[0] || user?.email[0] || 'U'}
                  </div>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back, {user?.full_name || user?.username || 'Piano Enthusiast'}!
              </h1>
              <p className="text-primary-content/80 mt-2">
                Your Piano Passport • Member since {new Date(user?.created_at || '').toLocaleDateString()}
              </p>
              <div className="flex items-center mt-2">
                <div className="badge badge-secondary">
                  {user?.role === 'admin' ? 'Administrator' : 
                   user?.role === 'moderator' ? 'Moderator' : 'Community Member'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Piano Journey Stats */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="card-title">
                    <Piano className="w-6 h-6" />
                    Your Piano Journey
                  </h2>
                  <Link to="/passport" className="btn btn-outline btn-sm">
                    <Book className="w-4 h-4 mr-2" />
                    View Piano Passport
                  </Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="stat">
                    <div className="stat-figure text-primary">
                      <MapPin className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Pianos Added</div>
                    <div className="stat-value text-primary">{stats?.pianos_added || 0}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-secondary">
                      <Star className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Pianos Visited</div>
                    <div className="stat-value text-secondary">{stats?.pianos_visited || 0}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-accent">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Events Created</div>
                    <div className="stat-value text-accent">{stats?.events_created || 0}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-figure text-info">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div className="stat-title">Countries Visited</div>
                    <div className="stat-value text-info">{stats?.countries_visited || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-base-200 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Welcome to WorldPianos!</p>
                      <p className="text-sm text-base-content/70">
                        Your account was created. Start exploring pianos near you!
                      </p>
                    </div>
                    <div className="text-sm text-base-content/50">
                      {new Date(user?.created_at || '').toLocaleDateString()}
                    </div>
                  </div>
                  
                  {stats?.pianos_added === 0 && stats?.pianos_visited === 0 && (
                    <div className="text-center py-8">
                      <Piano className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Start Your Piano Journey!</h3>
                      <p className="text-base-content/70 mb-4">
                        Add your first piano to the map or mark one as visited to see your activity here.
                      </p>
                      <div className="space-x-4">
                        <button className="btn btn-primary">Add a Piano</button>
                        <button className="btn btn-outline">Explore Pianos</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Achievements */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">
                  <Award className="w-5 h-5" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  {stats?.achievements_earned > 0 ? (
                    <div className="text-center py-4">
                      <div className="text-2xl font-bold text-primary">
                        {stats.achievements_earned}
                      </div>
                      <div className="text-sm text-base-content/70">
                        Achievements Earned
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <Award className="w-12 h-12 mx-auto text-base-content/30 mb-2" />
                      <p className="text-sm text-base-content/70">
                        Complete actions to earn your first achievement!
                      </p>
                    </div>
                  )}
                  
                  {/* Sample upcoming achievements */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-base-200 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-base-300 rounded-full flex items-center justify-center">
                          <Piano className="w-3 h-3" />
                        </div>
                        <span className="text-sm">First Piano Added</span>
                      </div>
                      <div className="text-xs text-base-content/50">
                        {stats?.pianos_added > 0 ? '✓' : 'Pending'}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-base-200 rounded">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-base-300 rounded-full flex items-center justify-center">
                          <Star className="w-3 h-3" />
                        </div>
                        <span className="text-sm">First Visit</span>
                      </div>
                      <div className="text-xs text-base-content/50">
                        {stats?.pianos_visited > 0 ? '✓' : 'Pending'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="btn btn-outline btn-sm w-full justify-start">
                    <Piano className="w-4 h-4 mr-2" />
                    Add a Piano
                  </button>
                  <button className="btn btn-outline btn-sm w-full justify-start">
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Event
                  </button>
                  <button className="btn btn-outline btn-sm w-full justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    Explore Map
                  </button>
                  <button className="btn btn-outline btn-sm w-full justify-start">
                    <Star className="w-4 h-4 mr-2" />
                    Rate a Piano
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Profile</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Completion</span>
                    <span className="text-sm font-medium">
                      {user?.full_name && user?.bio ? '80%' : user?.full_name ? '60%' : '40%'}
                    </span>
                  </div>
                  <progress 
                    className="progress progress-primary w-full" 
                    value={user?.full_name && user?.bio ? "80" : user?.full_name ? "60" : "40"} 
                    max="100"
                  ></progress>
                  <button className="btn btn-outline btn-sm w-full">
                    Complete Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}