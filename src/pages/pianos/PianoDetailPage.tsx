import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { 
  Piano as PianoIcon, 
  MapPin, 
  Clock, 
  Star, 
  Heart, 
  Share2, 
  Flag, 
  User,
  Calendar,
  MessageCircle,
  ChevronLeft,
  StarIcon,
  Camera
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { DataService } from '../../services/dataService'
import { CommentSection } from '../../components/comments/CommentSection'
import { ShareButton } from '../../components/social/ShareButton'
import { ShareModal } from '../../components/social/ShareModal'
import { SocialSharingService } from '../../services/socialSharingService'
import type { Piano } from '../../types'
import 'leaflet/dist/leaflet.css'

export function PianoDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [piano, setPiano] = useState<Piano | null>(null)
  const [loading, setLoading] = useState(true)
  const [isVisited, setIsVisited] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)

  useEffect(() => {
    const loadPianoDetails = async () => {
      if (!id) return
      
      try {
        console.log('Loading piano with ID:', id)
        const pianoData = await DataService.getPiano(id)
        console.log('Found piano:', pianoData)
        setPiano(pianoData)
      } catch (error) {
        console.error('Error loading piano details:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPianoDetails()
  }, [id])

  const handleVisitToggle = () => {
    setIsVisited(!isVisited)
    // In a real app, this would call an API to update the user's visited pianos
  }

  const handleRating = (rating: number) => {
    setUserRating(rating)
    // In a real app, this would save the rating to the database
  }


  const getShareData = () => {
    if (!piano) return null
    
    return SocialSharingService.generateShareData({
      type: 'piano',
      id: piano.id,
      title: piano.name,
      description: piano.description || undefined,
      location: piano.location_name,
      image: piano.images?.[0]?.image_url
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!piano) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <PianoIcon className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
          <h2 className="text-2xl font-bold mb-2">Piano Not Found</h2>
          <p className="text-base-content/70 mb-4">The piano you're looking for doesn't exist.</p>
          <Link to="/pianos" className="btn btn-primary">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Piano Directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link to="/pianos" className="btn btn-ghost text-primary-content">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back to Directory
            </Link>
            <div className="flex space-x-2">
              {getShareData() && (
                <>
                  <ShareButton
                    shareData={getShareData()!}
                    contentType="piano"
                    contentId={piano.id}
                    variant="button"
                    className="text-primary-content border-primary-content hover:bg-primary-content hover:text-primary"
                  />
                  <button 
                    className="btn btn-ghost text-primary-content"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    More Options
                  </button>
                </>
              )}
              <button className="btn btn-ghost text-primary-content">
                <Flag className="w-4 h-4 mr-2" />
                Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Piano Header */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{piano.name}</h1>
                    <div className="flex items-center text-base-content/70 mb-3">
                      <MapPin className="w-5 h-5 mr-2" />
                      {piano.location_name}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <div className="badge badge-primary">{piano.category}</div>
                      <div className="badge badge-secondary">{piano.condition}</div>
                      {piano.verified && (
                        <div className="badge badge-success">
                          <Star className="w-3 h-3 mr-1" />
                          Verified
                        </div>
                      )}
                      {piano.accessibility && (
                        <div className="badge badge-outline">{piano.accessibility}</div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <button 
                      className={`btn ${isVisited ? 'btn-success' : 'btn-outline'} mb-2`}
                      onClick={handleVisitToggle}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isVisited ? 'fill-current' : ''}`} />
                      {isVisited ? 'Visited' : 'Mark as Visited'}
                    </button>
                  </div>
                </div>

                {piano.description && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-base-content/80">{piano.description}</p>
                  </div>
                )}

                {/* Piano Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {piano.hours && (
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <div className="font-medium">Hours</div>
                        <div className="text-sm text-base-content/70">{piano.hours}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Added by</div>
                      <div className="text-sm text-base-content/70">
                        {piano.author?.full_name || 'Community Member'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Added</div>
                      <div className="text-sm text-base-content/70">
                        {new Date(piano.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <Camera className="w-5 h-5" />
                  Photos
                </h2>
                
                {piano.images && piano.images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {piano.images.map((image) => (
                      <div key={image.id} className="aspect-video bg-base-200 rounded-lg overflow-hidden">
                        <img 
                          src={image.image_url} 
                          alt={image.alt_text || piano.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                    <h3 className="text-lg font-semibold mb-2">No Photos Yet</h3>
                    <p className="text-base-content/70 mb-4">
                      Be the first to share a photo of this piano!
                    </p>
                    {user && (
                      <button className="btn btn-primary">Upload Photo</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* User Rating */}
            {user && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Rate This Piano</h2>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`btn btn-ghost btn-sm p-1 ${
                          star <= userRating ? 'text-yellow-500' : 'text-base-content/30'
                        }`}
                        onClick={() => handleRating(star)}
                      >
                        <StarIcon className={`w-6 h-6 ${star <= userRating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-base-content/70">
                      {userRating > 0 ? `${userRating}/5 stars` : 'Click to rate'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Comments Section */}
            <CommentSection
              contentType="piano"
              contentId={piano.id}
              allowComments={true}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Map */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Location</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  <MapContainer
                    center={[piano.latitude, piano.longitude]}
                    zoom={15}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[piano.latitude, piano.longitude]} />
                  </MapContainer>
                </div>
                <p className="text-sm text-base-content/70 mt-2">
                  {piano.location_name}
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Quick Stats</h3>
                <div className="stats stats-vertical">
                  <div className="stat">
                    <div className="stat-title">Visitors</div>
                    <div className="stat-value text-primary">42</div>
                    <div className="stat-desc">People who played this piano</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Comments</div>
                    <div className="stat-value text-secondary">--</div>
                    <div className="stat-desc">Community reviews</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Pianos */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Similar Pianos</h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Other {piano.category.toLowerCase()} pianos nearby
                </p>
                <div className="space-y-3">
                  {/* Mock similar pianos - in real app, this would be fetched */}
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-base-200 rounded-lg flex items-center justify-center">
                      <PianoIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Grand Central Station</div>
                      <div className="text-xs text-base-content/50">0.8 miles away</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-base-200 rounded-lg flex items-center justify-center">
                      <PianoIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">Bryant Park Piano</div>
                      <div className="text-xs text-base-content/50">1.2 miles away</div>
                    </div>
                  </div>
                </div>
                <Link to="/pianos" className="btn btn-outline btn-sm w-full mt-4">
                  View All Pianos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {getShareData() && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          shareData={getShareData()!}
          contentType="piano"
          contentId={piano.id}
        />
      )}
    </div>
  )
}