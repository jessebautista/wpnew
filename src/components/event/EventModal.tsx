import { X, MapPin, Calendar, Users, Clock, Piano as PianoIcon, CheckCircle, Share2, Navigation, ExternalLink, Heart } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import type { Event } from '../../types'

interface EventModalProps {
  event: Event | null
  isOpen: boolean
  onClose: () => void
}

export function EventModal({ event, isOpen, onClose }: EventModalProps) {
  const { t } = useLanguage()

  if (!isOpen || !event) {
    return null
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getDirectionsUrl = () => {
    if (event.latitude && event.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${event.latitude},${event.longitude}`
    }
    return '#'
  }

  const shareUrl = () => {
    const url = `${window.location.origin}/events/${event.id}`
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: url
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(url).then(() => {
        // Could show a toast notification here
        alert('Link copied to clipboard!')
      }).catch(console.error)
    }
  }

  const eventDate = new Date(event.date)
  const isPastEvent = eventDate < new Date()
  const isUpcoming = eventDate > new Date()

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-[9999] ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div className={`fixed inset-0 overflow-y-auto transition-transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex min-h-full items-center justify-center p-0 sm:p-4">
            {/* Modal Content */}
            <div className="relative w-full sm:max-w-lg bg-base-100 rounded-t-xl sm:rounded-xl shadow-xl transform transition-all">
              {/* Mobile Close Button - Top Right */}
              <div className="sticky top-0 z-20 flex justify-end p-4 bg-base-100 rounded-t-xl sm:hidden">
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-sm btn-circle bg-base-200 hover:bg-base-300"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop Close Button */}
              <div className="hidden sm:block absolute top-4 right-4 z-20">
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-sm btn-circle bg-base-200 hover:bg-base-300 shadow-lg"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 pt-0 sm:pt-6">
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-base-content pr-10">
                      {event.title}
                    </h2>
                    {event.verified && (
                      <div className="badge badge-success gap-1 shrink-0">
                        <CheckCircle className="w-3 h-3" />
                        {t('piano.verified')}
                      </div>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex gap-2 mb-3">
                    <div className={`badge ${isUpcoming ? 'badge-success' : isPastEvent ? 'badge-neutral' : 'badge-primary'}`}>
                      {isUpcoming ? 'Upcoming' : isPastEvent ? 'Past Event' : 'Today'}
                    </div>
                    <div className="badge badge-outline">
                      {event.category}
                    </div>
                  </div>
                  
                  <div className="flex items-center text-base-content/70 mb-2">
                    <MapPin className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-sm">
                      {event.location_name}
                    </span>
                  </div>
                </div>

                {/* Event Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-base-content/70">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {eventDate.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-base-content/70">
                    <Users className="w-4 h-4 mr-2" />
                    <span>
                      Organized by {event.organizer}
                      {event.attendee_count > 0 && ` • ${event.attendee_count} interested`}
                    </span>
                  </div>

                  {event.piano_count && (
                    <div className="flex items-center text-sm text-base-content/70">
                      <PianoIcon className="w-4 h-4 mr-2" />
                      <span>
                        {event.piano_count} piano{event.piano_count > 1 ? 's' : ''}
                        {event.piano_type && ` • ${event.piano_type}`}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {event.description && (
                  <div className="mb-6">
                    <p className="text-base-content/80 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`/events/${event.id}`}
                    className="btn btn-primary flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onClose()
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Event Details
                  </a>
                  
                  <div className="flex gap-2">
                    <a
                      href={getDirectionsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline flex-1 sm:flex-none"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </a>
                    
                    <button
                      onClick={shareUrl}
                      className="btn btn-outline flex-1 sm:flex-none"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      {t('common.share')}
                    </button>
                  </div>
                </div>

                {/* Secondary Actions */}
                <div className="flex gap-2 mt-3">
                  <button className="btn btn-ghost flex-1 text-sm">
                    <Heart className="w-4 h-4 mr-2" />
                    I'm Interested
                  </button>
                  <button className="btn btn-ghost flex-1 text-sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Add to Calendar
                  </button>
                </div>
              </div>

              {/* Mobile Close Button - Bottom */}
              <div className="sticky bottom-0 bg-base-100 border-t p-4 rounded-b-xl sm:hidden">
                <button
                  onClick={onClose}
                  className="btn btn-outline w-full"
                >
                  {t('common.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}