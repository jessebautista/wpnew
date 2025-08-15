import { Link } from 'react-router-dom'
import { Piano as PianoIcon, MapPin, Star } from 'lucide-react'
import type { Piano } from '../../types'

interface PianoCardProps {
  piano: Piano
}

export function PianoCard({ piano }: PianoCardProps) {
  // Get the primary image or the first image
  const primaryImage = piano.images?.find(img => img.alt_text?.includes('primary')) || piano.images?.[0]
  
  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
      {/* Image Section */}
      <figure className="h-48 bg-base-200 relative overflow-hidden">
        {primaryImage ? (
          <img
            src={primaryImage.image_url}
            alt={primaryImage.alt_text || `Photo of ${piano.name}`}
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
            primaryImage ? 'hidden' : 'flex'
          }`}
          style={{ display: primaryImage ? 'none' : 'flex' }}
        >
          <PianoIcon className="w-12 h-12 mb-2" />
          <span className="text-sm text-center px-4">
            No piano image available yet
          </span>
        </div>

        {/* Verified Badge */}
        {piano.verified && (
          <div className="absolute top-2 right-2">
            <div className="badge badge-success badge-sm">
              <Star className="w-3 h-3 mr-1" />
              Verified
            </div>
          </div>
        )}

        {/* Image Count Badge */}
        {piano.images && piano.images.length > 1 && (
          <div className="absolute bottom-2 right-2">
            <div className="badge badge-outline badge-sm bg-base-100/80">
              +{piano.images.length - 1} more
            </div>
          </div>
        )}
      </figure>

      <div className="card-body p-4">
        {/* Piano Name */}
        <h3 className="card-title text-lg">
          <span className="line-clamp-2">{piano.name}</span>
        </h3>

        {/* Location */}
        <div className="flex items-center text-sm text-base-content/70 mb-2">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          <span className="truncate">{piano.location_name}</span>
        </div>

        {/* Description */}
        {piano.description && (
          <p className="text-sm text-base-content/80 mb-3">
            <span className="line-clamp-2">{piano.description}</span>
          </p>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="badge badge-outline badge-sm">{piano.category}</div>
          <div className="badge badge-outline badge-sm">{piano.condition}</div>
          {piano.accessibility && (
            <div className="badge badge-outline badge-sm">{piano.accessibility}</div>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions justify-end">
          <Link 
            to={`/pianos/${piano.id}`} 
            className="btn btn-primary btn-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}