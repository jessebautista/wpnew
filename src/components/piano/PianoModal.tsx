import { X, MapPin, Star, Clock, Piano as PianoIcon, Calendar, User, Camera, Heart, Share2, Navigation, ExternalLink } from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import type { Piano } from '../../types'

interface PianoModalProps {
  piano: Piano | null
  isOpen: boolean
  onClose: () => void
}

export function PianoModal({ piano, isOpen, onClose }: PianoModalProps) {
  const { t } = useLanguage()

  if (!isOpen || !piano) {
    return null
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const getDirectionsUrl = () => {
    if (piano.latitude && piano.longitude) {
      return `https://www.google.com/maps/dir/?api=1&destination=${piano.latitude},${piano.longitude}`
    }
    return '#'
  }

  const shareUrl = () => {
    const url = `${window.location.origin}/pianos/${piano.id}`
    if (navigator.share) {
      navigator.share({
        title: piano.piano_title,
        text: `Check out this public piano: ${piano.piano_title}`,
        url: url
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(url).then(() => {
        // Could show a toast notification here
        alert('Link copied to clipboard!')
      }).catch(console.error)
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity z-50 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
      >
        {/* Modal Container */}
        <div className={`fixed inset-0 overflow-y-auto transition-transform ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}>
          <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Modal Content */}
            <div className="relative w-full sm:max-w-lg bg-base-100 rounded-t-xl sm:rounded-xl shadow-xl transform transition-all">
              {/* Mobile Close Button - Top Right */}
              <div className="sticky top-0 z-10 flex justify-end p-4 bg-base-100 rounded-t-xl sm:hidden">
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-sm btn-circle"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Desktop Close Button */}
              <div className="hidden sm:block absolute top-4 right-4 z-10">
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-sm btn-circle"
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
                      {piano.piano_title}
                    </h2>
                    {piano.verified && (
                      <div className="badge badge-success gap-1 shrink-0">
                        <Star className="w-3 h-3" />
                        {t('piano.verified')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-base-content/70 mb-2">
                    <MapPin className="w-4 h-4 mr-2 shrink-0" />
                    <span className="text-sm">
                      {piano.location_display_name || piano.public_location_name || piano.permanent_home_name}
                    </span>
                  </div>
                </div>

                {/* Piano Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-base-content/70">
                    <PianoIcon className="w-4 h-4 mr-2" />
                    <span>
                      {piano.piano_source === 'sing_for_hope' ? 'Sing for Hope' : 'Community Piano'}
                      {piano.piano_year && ` • ${piano.piano_year}`}
                    </span>
                  </div>
                  
                  {piano.artist_name && (
                    <div className="flex items-center text-sm text-base-content/70">
                      <User className="w-4 h-4 mr-2" />
                      <span>Artist: {piano.artist_name}</span>
                    </div>
                  )}
                  
                  {piano.piano_program && (
                    <div className="flex items-center text-sm text-base-content/70">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{piano.piano_program}</span>
                    </div>
                  )}
                  
                  {piano.installation_date && (
                    <div className="flex items-center text-sm text-base-content/70">
                      <Clock className="w-4 h-4 mr-2" />
                      <span>Installed: {new Date(piano.installation_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                {piano.piano_statement && (
                  <div className="mb-6">
                    <p className="text-base-content/80 leading-relaxed">
                      {piano.piano_statement}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`/pianos/${piano.id}`}
                    className="btn btn-primary flex-1"
                    onClick={(e) => {
                      e.stopPropagation()
                      onClose()
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {t('common.view')} {t('common.description')}
                  </a>
                  
                  <div className="flex gap-2">
                    <a
                      href={getDirectionsUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline flex-1 sm:flex-none"
                    >
                      <Navigation className="w-4 h-4 mr-2" />
                      {t('piano.directions')}
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
                    Mark Visited
                  </button>
                  <button className="btn btn-ghost flex-1 text-sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Add Photo
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