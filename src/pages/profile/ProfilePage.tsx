import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../components/auth/AuthProvider'
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  Camera, 
  Edit3, 
  Save, 
  X,
  Piano,
  Star,
  Award,
  BookOpen
} from 'lucide-react'

interface ProfileFormData {
  full_name: string
  username: string
  bio: string
  location: string
  website: string
}

export function ProfilePage() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    username: '',
    bio: '',
    location: '',
    website: ''
  })

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

  if (!user) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-base-content/70 mb-4">You need to be signed in to view your profile.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      // TODO: Implement profile update API call
      console.log('Saving profile data:', formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setLoading(false)
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
    const fields = [user?.full_name, user?.username, user?.bio, user?.location, user?.website]
    const filledFields = fields.filter(field => field && field.trim().length > 0).length
    return Math.round((filledFields / fields.length) * 100)
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-base-content/70 mt-1">
                Manage your WorldPianos profile information
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard" className="btn btn-outline">
                <Piano className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link to="/passport" className="btn btn-outline">
                <BookOpen className="w-4 h-4 mr-2" />
                Piano Passport
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-2">
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
                          disabled={loading}
                        >
                          {loading ? (
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
                          disabled={loading}
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
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Profile" className="rounded-full" />
                        ) : (
                          <span className="text-2xl font-bold">
                            {user.full_name?.[0] || user.email[0] || 'U'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {user.full_name || user.username || 'Piano Enthusiast'}
                      </h3>
                      <p className="text-base-content/70 flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-base-content/70">Member since</span>
                        <span className="text-sm font-medium">
                          {new Date(user.created_at || '').toLocaleDateString()}
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
                          {user.full_name || (
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
                          {user.username || (
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
                          {user.bio || (
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
                            {user.location || (
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
                            {user.website ? (
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
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">
                    <Award className="w-5 h-5" />
                    Profile Completion
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Completion</span>
                      <span className="text-sm font-medium">{profileCompleteness()}%</span>
                    </div>
                    <progress 
                      className="progress progress-primary w-full" 
                      value={profileCompleteness()} 
                      max="100"
                    ></progress>
                    <div className="text-xs text-base-content/70">
                      Complete your profile to help other piano enthusiasts connect with you!
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">
                    <Star className="w-5 h-5" />
                    Your Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Pianos Added</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Pianos Visited</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Events Created</span>
                      <span className="font-medium">0</span>
                    </div>
                    <div className="divider my-2"></div>
                    <Link to="/dashboard" className="btn btn-outline btn-sm w-full">
                      View Full Stats
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title">Quick Actions</h3>
                  <div className="space-y-2">
                    <Link to="/pianos/add" className="btn btn-outline btn-sm w-full justify-start">
                      <Piano className="w-4 h-4 mr-2" />
                      Add a Piano
                    </Link>
                    <Link to="/events/add" className="btn btn-outline btn-sm w-full justify-start">
                      <Calendar className="w-4 h-4 mr-2" />
                      Create Event
                    </Link>
                    <Link to="/pianos/map" className="btn btn-outline btn-sm w-full justify-start">
                      <MapPin className="w-4 h-4 mr-2" />
                      Explore Map
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}