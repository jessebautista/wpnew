import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import { 
  Calendar, 
  MapPin, 
  User, 
  Share2, 
  Heart, 
  Flag, 
  CheckCircle,
  Users,
  ChevronLeft,
  MessageCircle
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { mockEvents } from '../../data/mockData'
import { CommentSection } from '../../components/comments/CommentSection'
import { ShareButton } from '../../components/social/ShareButton'
import { SocialSharingService } from '../../services/socialSharingService'
import type { Event } from '../../types'
import 'leaflet/dist/leaflet.css'

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { canEdit, canVerify } = usePermissions()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInterested, setIsInterested] = useState(false)
  const [attendeeCount, setAttendeeCount] = useState(0)

  useEffect(() => {
    const loadEvent = async () => {
      if (!id) return

      try {
        // In a real app, this would fetch from Supabase
        const foundEvent = mockEvents.find(e => e.id === id)
        if (foundEvent) {
          setEvent(foundEvent)
          setAttendeeCount(Math.floor(Math.random() * 50) + 5) // Mock attendee count
        }
      } catch (error) {
        console.error('Error loading event:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [id])

  const handleInterestToggle = () => {
    setIsInterested(!isInterested)
    setAttendeeCount(prev => isInterested ? prev - 1 : prev + 1)
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
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isInterested ? 'fill-current' : ''}`} />
                    {isInterested ? 'Interested' : 'I\'m Interested'}
                  </button>
                  
                  {getShareData() && (
                    <ShareButton
                      shareData={getShareData()!}
                      contentType="event"
                      contentId={event.id}
                      variant="dropdown"
                      className="btn-outline"
                    />
                  )}
                  
                  {canEdit(event.created_by) && (
                    <button className="btn btn-outline btn-sm">Edit Event</button>
                  )}
                  
                  {canVerify() && !event.verified && (
                    <button className="btn btn-success btn-sm">Verify Event</button>
                  )}
                  
                  <button className="btn btn-ghost btn-sm">
                    <Flag className="w-4 h-4 mr-2" />
                    Report
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

            {/* Comments */}
            <CommentSection
              contentType="event"
              contentId={event.id}
              allowComments={true}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="card bg-base-100 shadow-xl">
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
                  {mockEvents
                    .filter(e => e.id !== event.id && e.category === event.category)
                    .slice(0, 3)
                    .map((relatedEvent) => (
                      <Link
                        key={relatedEvent.id}
                        to={`/events/${relatedEvent.id}`}
                        className="block p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                      >
                        <h4 className="font-medium text-sm">{relatedEvent.title}</h4>
                        <p className="text-xs text-base-content/70 mt-1">
                          {new Date(relatedEvent.date).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  {mockEvents.filter(e => e.id !== event.id && e.category === event.category).length === 0 && (
                    <p className="text-sm text-base-content/70">No similar events found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}