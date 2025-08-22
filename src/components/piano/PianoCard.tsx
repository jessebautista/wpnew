import { Link } from 'react-router-dom'
import { Piano as PianoIcon, MapPin, Star } from 'lucide-react'
import type { Piano } from '../../types'

interface PianoCardProps {
  piano: Piano
}

export function PianoCard({ piano }: PianoCardProps) {
  // For new schema, use piano_image field directly
  const hasImage = piano.piano_image && piano.piano_image.trim() !== ''
  
  return (
    <Link to={`/pianos/${piano.id}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
      {/* Image Section */}
      <figure className="h-48 bg-base-200 relative overflow-hidden">
        {hasImage ? (
          <img
            src={piano.piano_image!}
            alt={`Photo of ${piano.piano_title}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to default image on error
              e.currentTarget.style.display = 'none'
              const fallback = e.currentTarget.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
        ) : null}
        
        {/* Fallback UI - always rendered but hidden by default */}
        <div 
          className={`absolute inset-0 flex flex-col items-center justify-center bg-base-200 text-base-content/60 ${
            hasImage ? 'hidden' : 'flex'
          }`}
          style={{ display: hasImage ? 'none' : 'flex' }}
        >
          <PianoIcon className="w-12 h-12 mb-2" />
          <span className="text-sm text-center px-4">
            No piano image available yet
          </span>
        </div>

        {/* Badges Container */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {/* Source Badge */}
          {piano.source && (
            <div className={`badge badge-sm ${piano.source === 'Sing for Hope' ? 'badge-primary' : 'badge-info'}`}>
              {piano.source === 'Sing for Hope' ? '🎹' : '🌐'} {piano.source}
            </div>
          )}
          
          {/* Verified Badge */}
          {piano.verified && (
            <div className="badge badge-success badge-sm">
              <Star className="w-3 h-3 mr-1" />
              Verified
            </div>
          )}
        </div>
      </figure>

      <div className="card-body p-4">
        {/* Piano Title */}
        <h3 className="card-title text-lg">
          <span className="line-clamp-2">{piano.piano_title}</span>
        </h3>

        {/* Artist Name */}
        {piano.artist_name && (
          <div className="text-sm text-primary font-medium mb-1">
            by {piano.artist_name}
          </div>
        )}

        {/* Location */}
        <div className="flex items-center text-sm text-base-content/70 mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{piano.location_display_name}</span>
        </div>

        {/* Piano Statement */}
        {piano.piano_statement && (
          <p className="text-sm text-base-content/80 mb-3">
            <span className="line-clamp-2">{piano.piano_statement}</span>
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {piano.piano_year && (
            <div className="badge badge-outline badge-sm">{piano.piano_year}</div>
          )}
          {piano.piano_program && (
            <div className="badge badge-outline badge-sm">{piano.piano_program}</div>
          )}
          {piano.piano_source === 'user_submitted' && (
            <div className="badge badge-accent badge-sm">Community</div>
          )}
        </div>

      </div>
    </Link>
  )
}