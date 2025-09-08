import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { 
  Calendar, 
  MapPin, 
  User, 
  Heart, 
  Flag, 
  CheckCircle,
  Users,
  ChevronLeft,
  Share2,
  LogIn,
  Piano,
  Music,
  Zap,
  Eye
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { DataService } from '../../services/dataService'
import { EventInterestService } from '../../services/eventInterestService'
import { CommentSection } from '../../components/comments/CommentSection'
import { ShareButton } from '../../components/social/ShareButton'
import { ShareModal } from '../../components/social/ShareModal'
import { ReportModal } from '../../components/modals/ReportModal'
import { SocialSharingService } from '../../services/socialSharingService'
import { findBySlugOrId, generateEventSlug } from '../../utils/slugUtils'
import type { Event } from '../../types'
import 'leaflet/dist/leaflet.css'

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { canEdit, canVerify } = usePermissions()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInterested, setIsInterested] = useState(false)
  const [attendeeCount, setAttendeeCount] = useState(0)
  const [showShareModal, setShowShareModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [interestLoading, setInterestLoading] = useState(false)

  useEffect(() => {
    const abortController = new AbortController()
    
    const loadEvent = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        console.log('Loading event with slug/ID:', id)
        
        // First, get all events to search by slug
        const allEvents = await DataService.getEvents()
        
        // Check if request was aborted
        if (abortController.signal.aborted) {
          return
        }
        
        // Try to find the event by slug or ID
        const foundEvent = findBySlugOrId(
          allEvents, 
          id, 
          (event: Event) => generateEventSlug(event.title, event.id, event.date)
        )
        
        if (foundEvent) {
          console.log('Found event:', foundEvent)
          setEvent(foundEvent)
          
          // Check if request was aborted before loading additional data
          if (abortController.signal.aborted) {
            return
          }
          
          // Load real attendee count and user interest in parallel
          const promises = [
            EventInterestService.getInterestCount(foundEvent.id)
          ]
          
          if (user) {
            promises.push(EventInterestService.getUserInterest(foundEvent.id, user.id))
          }
          
          const results = await Promise.allSettled(promises)
          
          // Check if request was aborted after promises
          if (abortController.signal.aborted) {
            return
          }
          
          // Handle results
          if (results[0].status === 'fulfilled') {
            setAttendeeCount(results[0].value)
          }
          
          if (user && results[1] && results[1].status === 'fulfilled') {
            setIsInterested(results[1].value)
          }
        } else {
          console.log('Event not found for slug/ID:', id)
        }
      } catch (error) {
        // Only log error if it's not an AbortError
        if (error.name !== 'AbortError' && !abortController.signal.aborted) {
          console.error('Error loading event:', error)
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadEvent()
    
    // Cleanup function to abort request if component unmounts or effect re-runs
    return () => {
      abortController.abort()
    }
  }, [id, user])

  const handleInterestToggle = async () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    if (!event) return

    try {
      setInterestLoading(true)
      const result = await EventInterestService.toggleInterest(event.id, user.id)
      setIsInterested(result.interested)
      setAttendeeCount(result.count)
    } catch (error) {
      console.error('Error toggling interest:', error)
      // Optionally show error toast
    } finally {
      setInterestLoading(false)
    }
  }

  const handleReport = () => {
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    setShowReportModal(true)
  }

  const getShareData = () => {
    if (!event) return null
    
    return SocialSharingService.generateShareData({
      type: 'event',
      id: event.id,
      title: event.title,
      description: event.description || undefined,
      location: event.location_name,
      date: event.date
    })
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <Link to="/events" className="btn btn-primary">Back to Events</Link>
        </div>
      </div>
    )
  }

  const eventDate = new Date(event.date)
  const isUpcoming = eventDate > new Date()
  const isPast = eventDate < new Date()

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-secondary to-accent text-secondary-content py-8">
        <div className="container mx-auto px-4">
          <Link to="/events" className="btn btn-ghost btn-sm mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Events
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* Date Badge */}
            <div className="bg-base-100 text-base-content rounded-lg p-4 w-24 mx-auto lg:mx-0 text-center shadow-lg">
              <div className="text-sm font-medium text-primary">
                {eventDate.toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-3xl font-bold">
                {eventDate.getDate()}
              </div>
              <div className="text-sm">
                {eventDate.getFullYear()}
              </div>
            </div>

            {/* Event Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {event.title}
                    {event.verified && (
                      <CheckCircle className="inline w-6 h-6 ml-2 text-success" />
                    )}
                  </h1>
                  
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2" />
                      <span className="text-lg">
                        {eventDate.toLocaleDateString('en-US', { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      <span className="text-lg">{event.location_name}</span>
                    </div>
                    
                    {event.organizer && (
                      <div className="flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        <span className="text-lg">Organized by {event.organizer}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-2" />
                      <span className="text-lg">{attendeeCount} people interested</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="badge badge-lg badge-secondary">{event.category}</div>
                    {isUpcoming && <div className="badge badge-lg badge-success">Upcoming</div>}
                    {isPast && <div className="badge badge-lg badge-neutral">Past Event</div>}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 min-w-fit">
                  <button 
                    onClick={handleInterestToggle}
                    className={`btn ${isInterested ? 'btn-success' : 'btn-primary'}`}
                    disabled={interestLoading}
                  >
                    {interestLoading ? (
                      <span className="loading loading-spinner loading-xs mr-2"></span>
                    ) : (
                      <>
                        {!user && <LogIn className="w-4 h-4 mr-2" />}
                        <Heart className={`w-4 h-4 mr-2 ${isInterested ? 'fill-current' : ''}`} />
                      </>
                    )}
                    {!user ? 'Sign In to Show Interest' : isInterested ? 'Interested' : 'I\'m Interested'}
                  </button>
                  
                  {getShareData() && (
                    <>
                      <ShareButton
                        shareData={getShareData()!}
                        contentType="event"
                        contentId={event.id}
                        variant="button"
                      />
                      <button 
                        className="btn btn-ghost"
                        onClick={() => setShowShareModal(true)}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        More Options
                      </button>
                    </>
                  )}
                  
                  {canEdit(event.created_by) && (
                    <button className="btn btn-outline btn-sm">Edit Event</button>
                  )}
                  
                  {canVerify() && !event.verified && (
                    <button className="btn btn-success btn-sm">Verify Event</button>
                  )}
                  
                  <button 
                    onClick={handleReport}
                    className="btn btn-ghost btn-sm"
                  >
                    {!user && <LogIn className="w-4 h-4 mr-2" />}
                    <Flag className="w-4 h-4 mr-2" />
                    {!user ? 'Sign In to Report' : 'Report'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">About This Event</h2>
                <p className="text-base-content/80 leading-relaxed">
                  {event.description || 'No description provided for this event.'}
                </p>
                
                {/* Event Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 bg-base-200 rounded-lg">
                  <div>
                    <h4 className="font-semibold mb-2">Event Details</h4>
                    <div className="space-y-1 text-sm">
                      <div><strong>Category:</strong> {event.category}</div>
                      <div><strong>Created:</strong> {new Date(event.created_at).toLocaleDateString()}</div>
                      {event.verified_by && (
                        <div><strong>Verified:</strong> Yes</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Organizer</h4>
                    <div className="space-y-1 text-sm">
                      <div>{event.organizer || 'Not specified'}</div>
                      {event.author && (
                        <div className="text-base-content/70">
                          Added by {event.author.full_name || event.author.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Piano Information */}
            {(event.piano_count || event.piano_type || event.piano_condition || event.piano_special_features || event.piano_accessibility || event.piano_images) && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">
                    <Piano className="w-5 h-5" />
                    Piano Information
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {event.piano_count && (
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Music className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Number of Pianos</p>
                          <p className="text-base-content/70">{event.piano_count}</p>
                        </div>
                      </div>
                    )}

                    {event.piano_type && (
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2 rounded-lg">
                          <Piano className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">Piano Type</p>
                          <p className="text-base-content/70">{event.piano_type}</p>
                        </div>
                      </div>
                    )}

                    {event.piano_condition && (
                      <div className="flex items-center gap-3">
                        <div className="bg-accent/10 p-2 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Condition</p>
                          <p className="text-base-content/70">{event.piano_condition}</p>
                        </div>
                      </div>
                    )}

                    {event.piano_accessibility && (
                      <div className="flex items-start gap-3">
                        <div className="bg-info/10 p-2 rounded-lg">
                          <Users className="w-5 h-5 text-info" />
                        </div>
                        <div>
                          <p className="font-medium">Accessibility</p>
                          <p className="text-base-content/70 text-sm">{event.piano_accessibility}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {event.piano_special_features && event.piano_special_features.length > 0 && (
                    <div className="mt-4">
                      <p className="font-medium mb-2 flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Special Features
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {event.piano_special_features.map((feature, index) => (
                          <span key={index} className="badge badge-outline">{feature}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Piano Gallery */}
            {event.piano_images && event.piano_images.length > 0 && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">
                    <Eye className="w-5 h-5" />
                    Piano Gallery
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {event.piano_images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Piano ${index + 1} at ${event.title}`}
                          className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Map */}
            {event.latitude && event.longitude && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">
                    <MapPin className="w-5 h-5" />
                    Location
                  </h2>
                  <div className="h-64 rounded-lg overflow-hidden">
                    <MapContainer
                      center={[event.latitude, event.longitude]}
                      zoom={15}
                      scrollWheelZoom={false}
                      className="h-full w-full"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[event.latitude, event.longitude]} />
                    </MapContainer>
                  </div>
                  <p className="text-sm text-base-content/70 mt-2">{event.location_name}</p>
                </div>
              </div>
            )}

            {/* Quick Info - Mobile Only (above comments) */}
            <div className="card bg-base-100 shadow-xl lg:hidden">
              <div className="card-body">
                <h3 className="card-title">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Date</span>
                    <span className="font-medium">
                      {eventDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Time</span>
                    <span className="font-medium">
                      {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Category</span>
                    <span className="badge badge-secondary">{event.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Status</span>
                    <span className={`badge ${event.verified ? 'badge-success' : 'badge-warning'}`}>
                      {event.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments */}
            <CommentSection
              contentType="event"
              contentId={event.id}
              allowComments={true}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info - Desktop Only */}
            <div className="card bg-base-100 shadow-xl hidden lg:block">
              <div className="card-body">
                <h3 className="card-title">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Date</span>
                    <span className="font-medium">
                      {eventDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Time</span>
                    <span className="font-medium">
                      {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Category</span>
                    <span className="badge badge-secondary">{event.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-base-content/70">Status</span>
                    <span className={`badge ${event.verified ? 'badge-success' : 'badge-warning'}`}>
                      {event.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Events */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Similar Events</h3>
                <div className="space-y-3">
                  <p className="text-sm text-base-content/70">Similar events coming soon!</p>
                </div>
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
          contentType="event"
          contentId={event.id}
        />
      )}

      {/* Report Modal */}
      {event && (
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          contentType="event"
          contentId={event.id}
          contentTitle={event.title}
          userId={user?.id}
        />
      )}
    </div>
  )
}