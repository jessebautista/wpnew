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
  ChevronLeft,
  StarIcon,
  Camera,
  Upload,
  X
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { DataService } from '../../services/dataService'
import { CommentSection } from '../../components/comments/CommentSection'
import { ShareButton } from '../../components/social/ShareButton'
import { ShareModal } from '../../components/social/ShareModal'
import { SocialSharingService } from '../../services/socialSharingService'
import { ImageUploadService } from '../../services/imageUploadService'
import { PianoVisitService } from '../../services/pianoVisitService'
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
  const [showImageUpload, setShowImageUpload] = useState(false)
  const [uploadingImages, setUploadingImages] = useState(false)
  const [pianoStats, setPianoStats] = useState({ averageRating: 0, visitCount: 0 })
  const [ratingNotes, setRatingNotes] = useState('')
  const [ratingSaving, setRatingSaving] = useState(false)

  useEffect(() => {
    const loadPianoDetails = async () => {
      if (!id) return
      
      try {
        console.log('Loading piano with ID:', id)
        const pianoData = await DataService.getPiano(id)
        console.log('Found piano:', pianoData)
        setPiano(pianoData)
        
        // Load piano stats
        const stats = await PianoVisitService.getPianoStats(id)
        setPianoStats(stats)
        
        // Load user's rating if logged in
        if (user) {
          const userVisit = await PianoVisitService.getUserVisit(id)
          if (userVisit) {
            setUserRating(userVisit.rating)
            setRatingNotes(userVisit.notes || '')
            setIsVisited(true)
          }
        }
      } catch (error) {
        console.error('Error loading piano details:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPianoDetails()
  }, [id, user])

  const handleVisitToggle = async () => {
    if (!id || !user) return
    
    if (!isVisited && userRating === 0) {
      // If marking as visited but no rating, set a default rating of 3
      await handleRating(3)
    }
    
    setIsVisited(!isVisited)
  }

  const handleImageUpload = async (files: File[], captions: string[]) => {
    if (!id || !user) return
    
    try {
      setUploadingImages(true)
      await ImageUploadService.uploadAndCreateRecords(files, id, captions)
      
      // Refresh piano data to show new images
      const pianoData = await DataService.getPiano(id)
      setPiano(pianoData)
      setShowImageUpload(false)
    } catch (error) {
      console.error('Error uploading images:', error)
      alert('Failed to upload images. Please try again.')
    } finally {
      setUploadingImages(false)
    }
  }

  const handleRating = async (rating: number) => {
    if (!id || !user) return
    
    try {
      setRatingSaving(true)
      setUserRating(rating)
      
      await PianoVisitService.upsertVisit({
        piano_id: id,
        rating,
        notes: ratingNotes
      })
      
      setIsVisited(true)
      
      // Refresh piano stats
      const stats = await PianoVisitService.getPianoStats(id)
      setPianoStats(stats)
      
      // Show success feedback
      alert('Rating saved successfully!')
    } catch (error) {
      console.error('Error saving rating:', error)
      alert('Failed to save rating. Please try again.')
      // Reset rating on error
      setUserRating(0)
    } finally {
      setRatingSaving(false)
    }
  }


  const getShareData = () => {
    if (!piano) return null
    
    return SocialSharingService.generateShareData({
      type: 'piano',
      id: piano.id,
      title: piano.piano_title,
      description: piano.piano_statement || undefined,
      location: piano.location_display_name || piano.public_location_name || piano.permanent_home_name,
      image: piano.piano_image
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
                    <h1 className="text-3xl font-bold mb-2">{piano.piano_title}</h1>
                    <div className="flex items-center text-base-content/70 mb-3">
                      <MapPin className="w-5 h-5 mr-2" />
                      {piano.location_display_name || piano.public_location_name || piano.permanent_home_name}
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {piano.source && (
                        <div className={`badge ${piano.source === 'Sing for Hope' ? 'badge-primary' : 'badge-info'}`}>
                          {piano.source === 'Sing for Hope' ? '🎹' : '🌐'} {piano.source}
                        </div>
                      )}
                      {piano.piano_source === 'sing_for_hope' && (
                        <div className="badge badge-primary">
                          🎹 Sing for Hope
                        </div>
                      )}
                      {piano.piano_source === 'user_submitted' && (
                        <div className="badge badge-accent">Community</div>
                      )}
                      {piano.piano_year && (
                        <div className="badge badge-outline">{piano.piano_year}</div>
                      )}
                      {piano.verified && (
                        <div className="badge badge-success">
                          <Star className="w-3 h-3 mr-1" />
                          Verified
                        </div>
                      )}
                      {piano.piano_program && (
                        <div className="badge badge-secondary">{piano.piano_program}</div>
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

                {piano.piano_statement && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Piano Statement</h3>
                    <p className="text-base-content/80">{piano.piano_statement}</p>
                  </div>
                )}

                {piano.artist_name && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Artist</h3>
                    <div className="flex items-start gap-3">
                      {piano.artist_photo && (
                        <img 
                          src={piano.artist_photo} 
                          alt={piano.artist_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-primary">{piano.artist_name}</p>
                        {piano.piano_artist_bio && (
                          <p className="text-sm text-base-content/80 mt-1">{piano.piano_artist_bio}</p>
                        )}
                        {piano.artist_website_url && (
                          <a 
                            href={piano.artist_website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="link link-primary text-sm mt-1 inline-block"
                          >
                            Visit Artist Website
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Piano Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {piano.permanent_home_name && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-primary" />
                      <div>
                        <div className="font-medium">Permanent Home</div>
                        <div className="text-sm text-base-content/70">{piano.permanent_home_name}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    <div>
                      <div className="font-medium">Added by</div>
                      <div className="text-sm text-base-content/70">
                        {piano.piano_source === 'sing_for_hope' ? 'Sing for Hope' : 'Community Member'}
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

                {/* Additional Details */}
                {(piano.contributors_info || piano.notes) && (
                  <div className="mt-6 space-y-3">
                    {piano.contributors_info && (
                      <div>
                        <h4 className="font-medium text-sm text-base-content/70 mb-1">Contributors</h4>
                        <p className="text-sm">{piano.contributors_info}</p>
                      </div>
                    )}
                    {piano.notes && (
                      <div>
                        <h4 className="font-medium text-sm text-base-content/70 mb-1">Notes</h4>
                        <p className="text-sm">{piano.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">
                  <Camera className="w-5 h-5" />
                  Photos
                </h2>
                
                {piano.piano_image ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="aspect-video bg-base-200 rounded-lg overflow-hidden">
                      <img 
                        src={piano.piano_image} 
                        alt={`Photo of ${piano.piano_title}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Camera className="w-16 h-16 mx-auto mb-4 text-base-content/30" />
                    <h3 className="text-lg font-semibold mb-2">No Photos Yet</h3>
                    <p className="text-base-content/70 mb-4">
                      Be the first to share a photo of this piano!
                    </p>
                    {user && (
                      <button 
                        className="btn btn-primary"
                        onClick={() => setShowImageUpload(true)}
                        disabled={uploadingImages}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        {uploadingImages ? 'Uploading...' : 'Upload Photo'}
                      </button>
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
                  <div className="space-y-3">
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
                    
                    <div>
                      <label className="label">
                        <span className="label-text">Notes (optional)</span>
                      </label>
                      <textarea
                        className="textarea textarea-bordered w-full"
                        placeholder="Share your experience with this piano..."
                        value={ratingNotes}
                        onChange={(e) => setRatingNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    {userRating > 0 && (
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleRating(userRating)}
                        disabled={ratingSaving}
                      >
                        {ratingSaving ? (
                          <>
                            <span className="loading loading-spinner loading-xs mr-2"></span>
                            Saving...
                          </>
                        ) : (
                          'Save Rating'
                        )}
                      </button>
                    )}
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
{(() => {
                  // Parse coordinates properly, handling "null" strings
                  const latStr = piano.perm_lat
                  const lngStr = piano.perm_lng
                  const lat = piano.latitude || (latStr && latStr !== 'null' && latStr !== '' ? parseFloat(latStr) : null)
                  const lng = piano.longitude || (lngStr && lngStr !== 'null' && lngStr !== '' ? parseFloat(lngStr) : null)
                  
                  return (lat && lng && !isNaN(lat) && !isNaN(lng)) ? (
                    <>
                      <div className="h-64 rounded-lg overflow-hidden">
                        <MapContainer
                          center={[lat, lng]}
                          zoom={15}
                          style={{ height: '100%', width: '100%' }}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker position={[lat, lng]} />
                        </MapContainer>
                      </div>
                    </>) : (
                      <div className="h-64 bg-base-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 mx-auto mb-2 text-base-content/30" />
                          <p className="text-base-content/50">Location coordinates not available</p>
                        </div>
                      </div>
                    )
                })()}
                <p className="text-sm text-base-content/70 mt-2">
                  {piano.location_display_name || piano.public_location_name || piano.permanent_home_name}
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
                    <div className="stat-value text-primary">{pianoStats.visitCount}</div>
                    <div className="stat-desc">People who rated this piano</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Average Rating</div>
                    <div className="stat-value text-secondary">
                      {pianoStats.averageRating > 0 ? pianoStats.averageRating.toFixed(1) : '--'}
                    </div>
                    <div className="stat-desc">
                      {pianoStats.averageRating > 0 ? 'Out of 5 stars' : 'No ratings yet'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Pianos */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Similar Pianos</h3>
                <p className="text-sm text-base-content/70 mb-4">
                  Other pianos in this area
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

      {/* Image Upload Modal */}
      <ImageUploadModal
        isOpen={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onUpload={handleImageUpload}
        uploading={uploadingImages}
      />
    </div>
  )
}

// Image Upload Modal Component
interface ImageUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onUpload: (files: File[], captions: string[]) => void
  uploading: boolean
}

function ImageUploadModal({ isOpen, onClose, onUpload, uploading }: ImageUploadModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [captions, setCaptions] = useState<string[]>([])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles(files)
    setCaptions(files.map(() => ''))
  }

  const handleCaptionChange = (index: number, caption: string) => {
    const newCaptions = [...captions]
    newCaptions[index] = caption
    setCaptions(newCaptions)
  }

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles, captions)
    }
  }

  const handleClose = () => {
    setSelectedFiles([])
    setCaptions([])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Upload Photos</h2>
          <button 
            className="btn btn-ghost btn-sm"
            onClick={handleClose}
            disabled={uploading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="label">
              <span className="label-text">Select Photos</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="file-input file-input-bordered w-full"
              disabled={uploading}
            />
            <div className="label">
              <span className="label-text-alt">Max 10MB per image. JPG, PNG, WebP, GIF allowed.</span>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Selected Images</h3>
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-base-200 rounded-lg">
                  <div className="w-16 h-16 bg-base-300 rounded-lg overflow-hidden">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{file.name}</div>
                    <input
                      type="text"
                      placeholder="Add a caption (optional)"
                      value={captions[index] || ''}
                      onChange={(e) => handleCaptionChange(index, e.target.value)}
                      className="input input-sm input-bordered w-full mt-2"
                      disabled={uploading}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-action">
          <button 
            className="btn btn-ghost" 
            onClick={handleClose}
            disabled={uploading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
          >
            {uploading ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Uploading...
              </>
            ) : (
              `Upload ${selectedFiles.length} Photo${selectedFiles.length > 1 ? 's' : ''}`
            )}
          </button>
        </div>
      </div>
    </div>
  )
}