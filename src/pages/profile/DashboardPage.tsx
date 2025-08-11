import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { 
  Piano, 
  Calendar, 
  Star, 
  MapPin, 
  TrendingUp, 
  Award, 
  Book, 
  User,
  Edit3,
  Save,
  X,
  Mail,
  Globe,
  Settings,
  Shield,
  UserCog
} from 'lucide-react'
import { userService } from '../../utils/database'

interface ProfileFormData {
  full_name: string
  username: string
  bio: string
  location: string
  website: string
}

export function DashboardPage() {
  const { user } = useAuth()
  const { canModerate, canAdmin } = usePermissions()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'admin'>('overview')
  
  // Profile editing states
  const [isEditing, setIsEditing] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    website: ''
  })

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

  // Initialize profile form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      })
    }
  }, [user])

  // Profile management functions
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setProfileLoading(true)
    try {
      // TODO: Implement profile update API call
      console.log('Saving profile data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original user data
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        username: user.username || '',
        bio: user.bio || '',
        location: user.location || '',
        website: user.website || ''
      })
    }
    setIsEditing(false)
  }

  const profileCompleteness = () => {
    if (!user) return 0
    const fields = [user.full_name, user.username, user.bio, user.location, user.website]
    const filledFields = fields.filter(field => field && field.trim().length > 0).length
    return Math.round((filledFields / fields.length) * 100)
  }

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

      {/* Tab Navigation */}
      <div className="bg-base-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="tabs tabs-boxed bg-transparent">
            <button 
              className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Dashboard
            </button>
            <button 
              className={`tab ${activeTab === 'profile' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User className="w-4 h-4 mr-2" />
              Profile Settings
            </button>
            {(canModerate() || canAdmin()) && (
              <button 
                className={`tab ${activeTab === 'admin' ? 'tab-active' : ''}`}
                onClick={() => setActiveTab('admin')}
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Tools
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Dashboard Overview Tab */}
        {activeTab === 'overview' && (
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
        )}

        {/* Profile Settings Tab */}
        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="card-title">
                    <User className="w-6 h-6" />
                    Profile Information
                  </h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-outline btn-sm"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="btn btn-primary btn-sm"
                        disabled={profileLoading}
                      >
                        {profileLoading ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleCancel}
                        className="btn btn-outline btn-sm"
                        disabled={profileLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8">
                  <div className="avatar">
                    <div className="w-24 h-24 rounded-full bg-primary text-primary-content flex items-center justify-center">
                      {user?.avatar_url ? (
                        <img src={user.avatar_url} alt="Profile" className="rounded-full" />
                      ) : (
                        <span className="text-2xl font-bold">
                          {user?.full_name?.[0] || user?.email[0] || 'U'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {user?.full_name || user?.username || 'Piano Enthusiast'}
                    </h3>
                    <p className="text-base-content/70 flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-base-content/70">Member since</span>
                      <span className="text-sm font-medium">
                        {new Date(user?.created_at || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="input input-bordered"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <div className="text-lg">
                        {user?.full_name || (
                          <span className="text-base-content/50 italic">Not set</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Username</span>
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        className="input input-bordered"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        placeholder="Choose a username"
                      />
                    ) : (
                      <div className="text-lg">
                        {user?.username || (
                          <span className="text-base-content/50 italic">Not set</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Bio</span>
                    </label>
                    {isEditing ? (
                      <textarea
                        className="textarea textarea-bordered h-24"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        placeholder="Tell us about yourself and your love for piano..."
                      />
                    ) : (
                      <div className="text-lg min-h-[6rem] p-3 border border-base-300 rounded-lg bg-base-50">
                        {user?.bio || (
                          <span className="text-base-content/50 italic">
                            Tell us about yourself and your love for piano...
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </span>
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          className="input input-bordered"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="City, Country"
                        />
                      ) : (
                        <div className="text-lg">
                          {user?.location || (
                            <span className="text-base-content/50 italic">Not set</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Website
                        </span>
                      </label>
                      {isEditing ? (
                        <input
                          type="url"
                          className="input input-bordered"
                          value={formData.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          placeholder="https://your-website.com"
                        />
                      ) : (
                        <div className="text-lg">
                          {user?.website ? (
                            <a
                              href={user.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link link-primary"
                            >
                              {user.website}
                            </a>
                          ) : (
                            <span className="text-base-content/50 italic">Not set</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="alert alert-info">
                    <div className="flex items-start">
                      <Settings className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="text-left text-sm">
                        <p className="font-medium">Profile Completion: {profileCompleteness()}%</p>
                        <p>Complete your profile to help other piano enthusiasts connect with you!</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Tools Tab */}
        {activeTab === 'admin' && (canModerate() || canAdmin()) && (
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <Shield className="w-6 h-6" />
                  Admin Tools
                </h2>
                <p className="text-base-content/70 mb-6">
                  Quick access to administrative functions
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {canModerate() && (
                    <Link to="/moderation" className="btn btn-outline btn-lg h-auto p-6 flex-col">
                      <Shield className="w-8 h-8 mb-2" />
                      <span className="font-semibold">Moderation Queue</span>
                      <span className="text-xs opacity-70">Review pending submissions</span>
                    </Link>
                  )}

                  {canAdmin() && (
                    <Link to="/admin" className="btn btn-outline btn-lg h-auto p-6 flex-col">
                      <UserCog className="w-8 h-8 mb-2" />
                      <span className="font-semibold">Admin Dashboard</span>
                      <span className="text-xs opacity-70">Full admin controls</span>
                    </Link>
                  )}

                  {canModerate() && (
                    <Link to="/moderation/rules" className="btn btn-outline btn-lg h-auto p-6 flex-col">
                      <Settings className="w-8 h-8 mb-2" />
                      <span className="font-semibold">Moderation Rules</span>
                      <span className="text-xs opacity-70">Configure auto-moderation</span>
                    </Link>
                  )}
                </div>

                <div className="divider"></div>

                <div className="bg-base-200 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Your Admin Privileges:</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="badge badge-secondary">
                      {user?.role === 'admin' ? 'Administrator' : 
                       user?.role === 'moderator' ? 'Moderator' : 'Community Member'}
                    </div>
                    {canModerate() && (
                      <div className="badge badge-primary">Content Moderation</div>
                    )}
                    {canAdmin() && (
                      <div className="badge badge-accent">User Management</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}