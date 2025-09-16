import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Icon, divIcon, point } from 'leaflet'
import { Calendar, MapPin, Star, Clock, Piano as PianoIcon, Users, CheckCircle } from 'lucide-react'
import type { Piano, Event } from '../../types'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Type for map item (either Piano or Event)
type MapItem = Piano | Event

// Type guard to check if item is a Piano
const isPiano = (item: MapItem): item is Piano => {
  return 'piano_title' in item
}

// Type guard to check if item is an Event
const isEvent = (item: MapItem): item is Event => {
  return 'title' in item && 'date' in item && 'organizer' in item
}

// Custom piano marker icon
const createPianoIcon = (category: string, verified: boolean) => {
  const categoryColors: Record<string, string> = {
    'Airport': '#3b82f6',
    'Street': '#ef4444', 
    'Park': '#10b981',
    'Train Station': '#8b5cf6',
    'Shopping Center': '#f59e0b',
    'University': '#06b6d4',
    'Hospital': '#ec4899',
    'Hotel': '#84cc16',
    'Restaurant': '#f97316',
    'Other': '#6b7280'
  }
  
  const categoryColor = categoryColors[category] || categoryColors['Other']
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="35" viewBox="0 0 25 35" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5C0 19.404 12.5 35 12.5 35C12.5 35 25 19.404 25 12.5C25 5.596 19.404 0 12.5 0Z" fill="${categoryColor}"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <path d="M8 9h8v6h-8z" fill="${categoryColor}"/>
        <rect x="9" y="10" width="2" height="4" fill="white"/>
        <rect x="11" y="10" width="2" height="4" fill="white"/>
        <rect x="13" y="10" width="2" height="4" fill="white"/>
        ${verified ? `<circle cx="20" cy="5" r="4" fill="#10b981"/><path d="M18 5l1 1 2-2" stroke="white" stroke-width="1" fill="none"/>` : ''}
      </svg>
    `)}`,
    iconSize: [25, 35],
    iconAnchor: [12, 35],
    popupAnchor: [0, -35],
  })
}

// Custom event marker icon
const createEventIcon = (category: string, verified: boolean, isPastEvent: boolean = false) => {
  const categoryColors: Record<string, string> = {
    'Concert': '#8b5cf6',
    'Meetup': '#f59e0b',
    'Workshop': '#06b6d4',
    'Installation': '#10b981',
    'Festival': '#ec4899',
    'Community Event': '#84cc16',
    'Other': '#6b7280'
  }
  
  const categoryColor = categoryColors[category] || categoryColors['Other']
  const opacity = isPastEvent ? '0.6' : '1'
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="35" viewBox="0 0 25 35" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="${opacity}">
        <path d="M12.5 0C5.596 0 0 5.596 0 12.5C0 19.404 12.5 35 12.5 35C12.5 35 25 19.404 25 12.5C25 5.596 19.404 0 12.5 0Z" fill="${categoryColor}"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <rect x="8" y="8" width="8" height="8" fill="${categoryColor}" rx="1"/>
        <rect x="8" y="6" width="2" height="4" fill="${categoryColor}"/>
        <rect x="14" y="6" width="2" height="4" fill="${categoryColor}"/>
        <rect x="10" y="10" width="4" height="1" fill="white"/>
        <rect x="10" y="12" width="4" height="1" fill="white"/>
        <rect x="10" y="14" width="2" height="1" fill="white"/>
        ${verified ? `<circle cx="20" cy="5" r="4" fill="#10b981"/><path d="M18 5l1 1 2-2" stroke="white" stroke-width="1" fill="none"/>` : ''}
      </svg>
    `)}`,
    iconSize: [25, 35],
    iconAnchor: [12, 35],
    popupAnchor: [0, -35],
  })
}

// Simple cluster icon for better popup compatibility
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount()
  return divIcon({
    html: `<div class="bg-primary text-primary-content rounded-full flex items-center justify-center font-bold shadow-lg w-10 h-10 text-sm">${count}</div>`,
    className: 'custom-div-icon',
    iconSize: point(40, 40, true),
  })
}

interface InteractiveMapProps {
  items: MapItem[]
  onItemSelect?: (item: MapItem) => void
  height?: string
  center?: [number, number]
  zoom?: number
  itemType: 'pianos' | 'events'
  // Optional modal support - if provided, will use modals instead of callbacks
  showModal?: boolean
  onPianoModalOpen?: (piano: Piano) => void
  onEventModalOpen?: (event: Event) => void
}

// Component to fit map bounds to items
function FitBounds({ items }: { items: MapItem[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (items.length === 0) return
    
    const bounds = items.map(item => [item.latitude!, item.longitude!] as [number, number])
      .filter(([lat, lng]) => lat != null && lng != null)
    
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [items, map])
  
  return null
}


// Event popup component
function EventPopup({ event }: { event: Event }) {
  const eventDate = new Date(event.date)
  const isPastEvent = eventDate < new Date()
  const isUpcoming = eventDate > new Date()

  return (
    <div className="p-2 min-w-[200px]">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-bold text-lg">{event.title}</h3>
        {event.verified && (
          <div className="badge badge-success badge-sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            Verified
          </div>
        )}
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <Calendar className="w-4 h-4 mr-1" />
        {eventDate.toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <MapPin className="w-4 h-4 mr-1" />
        {event.location_name}
      </div>
      
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <Users className="w-4 h-4 mr-1" />
        {event.category}
        {event.attendee_count > 0 && ` • ${event.attendee_count} interested`}
      </div>

      {/* Piano Information */}
      {event.piano_count && (
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <PianoIcon className="w-4 h-4 mr-1" />
          {event.piano_count} piano{event.piano_count > 1 ? 's' : ''}
          {event.piano_type && ` • ${event.piano_type}`}
        </div>
      )}
      
      {event.description && (
        <p className="text-sm text-gray-700 mb-3">
          {event.description.length > 100 
            ? `${event.description.substring(0, 100)}...`
            : event.description
          }
        </p>
      )}

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          <div className={`badge badge-sm ${isUpcoming ? 'badge-success' : 'badge-neutral'}`}>
            {isUpcoming ? 'Upcoming' : isPastEvent ? 'Past Event' : 'Today'}
          </div>
          <div className="badge badge-outline badge-sm">{event.category}</div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <a href={`/events/${event.id}`} className="btn btn-primary btn-xs">
          View Details
        </a>
        <button className="btn btn-outline btn-xs">
          I'm Interested
        </button>
      </div>
    </div>
  )
}

export function InteractiveMap({ 
  items, 
  onItemSelect, 
  height = '500px',
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 2,
  itemType,
  showModal = false,
  onPianoModalOpen,
  onEventModalOpen
}: InteractiveMapProps) {
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if Leaflet is available
    const checkLeaflet = () => {
      try {
        if (typeof window !== 'undefined') {
          const leafletCSS = document.querySelector('link[href*="leaflet"]')
          console.log('[MAP] Leaflet CSS found:', !!leafletCSS)
          
          // Give some time for CSS to load
          setTimeout(() => {
            setIsLoading(false)
          }, 100)
        }
      } catch (error) {
        console.error('[MAP] Error checking Leaflet:', error)
        setMapError('Leaflet library not available')
        setIsLoading(false)
      }
    }
    
    checkLeaflet()
  }, [])
  const handleItemClick = (item: MapItem) => {
    if (showModal) {
      // Use modal callbacks if provided
      if (isPiano(item) && onPianoModalOpen) {
        onPianoModalOpen(item)
      } else if (isEvent(item) && onEventModalOpen) {
        onEventModalOpen(item)
      }
    } else {
      // Use regular callback
      onItemSelect?.(item)
    }
  }

  // Filter out items without valid coordinates
  const validItems = items.filter(item => 
    item.latitude != null && item.longitude != null
  )


  console.log('[MAP] Rendering InteractiveMap with', validItems.length, 'valid items')
  console.log('[MAP] Map center:', center, 'zoom:', zoom)
  console.log('[MAP] Height style:', height)

  if (isLoading) {
    return (
      <div className="relative bg-base-200 rounded-lg flex items-center justify-center" style={{ height, width: '100%' }}>
        <div className="text-center p-8">
          <div className="loading loading-spinner loading-lg"></div>
          <div className="text-sm text-base-content/70 mt-4">Loading map...</div>
        </div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className="relative bg-base-200 rounded-lg flex items-center justify-center" style={{ height, width: '100%' }}>
        <div className="text-center p-8">
          <div className="text-error mb-2">Map failed to load</div>
          <div className="text-sm text-base-content/70 mb-4">{mapError}</div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => {
              setMapError(null)
              window.location.reload()
            }}
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  try {
    return (
      <div className="relative">
        <MapContainer
        center={center}
        zoom={zoom}
        style={height.includes('px') ? { height, width: '100%' } : { width: '100%' }}
        className={`rounded-lg z-0 ${!height.includes('px') ? height : ''}`}
        touchZoom={true}
        doubleClickZoom={false}
        scrollWheelZoom={true}
        boxZoom={false}
        keyboard={true}
        dragging={true}
        zoomControl={true}
        whenCreated={(map) => {
          console.log('[MAP] MapContainer created successfully', map)
        }}
        whenReady={() => {
          console.log('[MAP] Map is ready')
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            loading: () => console.log('[MAP] TileLayer loading...'),
            load: () => console.log('[MAP] TileLayer loaded'),
            tileerror: (e) => console.error('[MAP] Tile error:', e)
          }}
        />
        
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          disableClusteringAtZoom={15}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          maxClusterRadius={50}
        >
          {validItems.map((item) => {            
            const isPianoItem = isPiano(item)
            const isEventItem = isEvent(item)
            
            if (!isPianoItem && !isEventItem) {
              return null
            }
            
            let icon: Icon
            if (isPianoItem) {
              const source = (item as Piano).piano_source || 'user_submitted'
              icon = createPianoIcon(source === 'sing_for_hope' ? 'Sing for Hope' : 'Community', (item as Piano).verified || false)
            } else {
              const eventDate = new Date((item as Event).date)
              const isPastEvent = eventDate < new Date()
              icon = createEventIcon(item.category, item.verified || false, isPastEvent)
            }

            return (
              <Marker
                key={item.id}
                position={[item.latitude!, item.longitude!]}
                icon={icon}
                eventHandlers={{
                  click: (e) => {
                    handleItemClick(item)
                    // Prevent event from bubbling to map
                    e.originalEvent?.stopPropagation?.()
                  }
                }}
              />
            )
          })}
        </MarkerClusterGroup>
        
        <FitBounds items={validItems} />
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="font-semibold text-sm mb-2">
          {itemType === 'pianos' ? 'Piano Types' : 'Event Types'}
        </h4>
        <div className="space-y-1 text-xs">
          {itemType === 'pianos' ? (
            <>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                <span>Airport</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded mr-2"></div>
                <span>Street</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Park</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                <span>Train Station</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                <span>Concert</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-amber-500 rounded mr-2"></div>
                <span>Meetup</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-cyan-500 rounded mr-2"></div>
                <span>Workshop</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded mr-2"></div>
                <span>Installation</span>
              </div>
            </>
          )}
        </div>
        <div className="mt-2 pt-2 border-t text-xs">
          <div className="flex items-center">
            <CheckCircle className="w-3 h-3 text-green-500 mr-1" />
            <span>Verified</span>
          </div>
          {itemType === 'events' && (
            <div className="flex items-center mt-1">
              <div className="w-3 h-3 bg-gray-400 rounded mr-1 opacity-60"></div>
              <span>Past Event</span>
            </div>
          )}
        </div>
      </div>
    </div>
  ) 
  } catch (error) {
    console.error('[MAP] Error rendering map:', error)
    setMapError(error instanceof Error ? error.message : 'Unknown map error')
    return (
      <div className="relative bg-base-200 rounded-lg flex items-center justify-center" style={{ height, width: '100%' }}>
        <div className="text-center p-8">
          <div className="text-error mb-2">Map failed to load</div>
          <div className="text-sm text-base-content/70 mb-4">Please try refreshing the page</div>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }
}