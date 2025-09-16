import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import type { Piano, Event } from '../../types'

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

interface MapboxMapProps {
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

// Use the same Mapbox access token from the reference project
mapboxgl.accessToken = 'pk.eyJ1Ijoic2ZoYWRtaW4iLCJhIjoiY2t6bWZnY2VhNWY0djJwdHZhZnpvY3prbSJ9.5vyd64pGtGwl9YfMNFH9eQ'

export function MapboxMap({ 
  items, 
  onItemSelect, 
  height = 'h-[60vh] md:h-[70vh]',
  center = [-74.0060, 40.7128], // Default to NYC (lng, lat)
  zoom = 2,
  itemType,
  showModal = false,
  onPianoModalOpen,
  onEventModalOpen
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  console.log('[MAPBOX] Rendering MapboxMap with', validItems.length, 'valid items')
  console.log('[MAPBOX] Map center:', center, 'zoom:', zoom)

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    try {
      console.log('[MAPBOX] Initializing map...')
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom,
        attributionControl: true,
        logoPosition: 'bottom-right'
      })

      console.log('[MAPBOX] Map created successfully')

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          showCompass: false,
          visualizePitch: false
        }),
        'top-right'
      )

      // Add geolocate control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: false,
        showUserHeading: true
      })
      map.current.addControl(geolocate, 'top-right')

      map.current.on('load', () => {
        console.log('[MAPBOX] Map loaded successfully')
        setMapLoaded(true)
        setIsLoading(false)
      })

      map.current.on('error', (e) => {
        console.error('[MAPBOX] Map error:', e)
        setMapError('Failed to load map')
        setIsLoading(false)
      })

    } catch (error) {
      console.error('[MAPBOX] Error initializing map:', error)
      setMapError(error instanceof Error ? error.message : 'Unknown map error')
      setIsLoading(false)
    }

    return () => {
      if (map.current) {
        console.log('[MAPBOX] Cleaning up map')
        map.current.remove()
      }
    }
  }, [center, zoom])

  // Update map view when items change
  useEffect(() => {
    if (!map.current || !mapLoaded || validItems.length === 0) return

    console.log('[MAPBOX] Fitting map to', validItems.length, 'items')
    
    const bounds = new mapboxgl.LngLatBounds()
    validItems.forEach(item => {
      bounds.extend([item.longitude!, item.latitude!])
    })

    if (!bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15
      })
    }
  }, [validItems, mapLoaded])

  // Update markers when items change
  useEffect(() => {
    if (!map.current || !mapLoaded) return

    console.log('[MAPBOX] Updating markers for', validItems.length, 'items')

    // Clear existing markers
    markers.current.forEach(marker => marker.remove())
    markers.current = []

    // Add new markers
    validItems.forEach(item => {
      const isPianoItem = isPiano(item)
      
      // Create custom marker element
      const el = document.createElement('div')
      el.className = 'mapbox-marker cursor-pointer'
      
      if (isPianoItem) {
        const piano = item as Piano
        const isVerified = piano.verified || false
        el.innerHTML = `
          <div class="relative">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg flex items-center justify-center transform transition-transform hover:scale-110">
              <div class="w-5 h-3 bg-white rounded-sm flex items-center justify-center">
                <div class="w-3 h-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-sm"></div>
              </div>
              ${isVerified ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>' : ''}
            </div>
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-blue-500 to-blue-600 rotate-45"></div>
          </div>
        `
      } else {
        const event = item as Event
        const isVerified = event.verified || false
        const eventDate = new Date(event.date)
        const isPastEvent = eventDate < new Date()
        const opacity = isPastEvent ? 'opacity-60' : ''
        
        el.innerHTML = `
          <div class="relative ${opacity}">
            <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center transform transition-transform hover:scale-110">
              <div class="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                <div class="w-3 h-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-sm"></div>
              </div>
              ${isVerified ? '<div class="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>' : ''}
            </div>
            <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-br from-purple-500 to-purple-600 rotate-45"></div>
          </div>
        `
      }

      // Add click event
      el.addEventListener('click', () => {
        handleItemClick(item)
      })

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([item.longitude!, item.latitude!])
        .addTo(map.current!)

      markers.current.push(marker)
    })

  }, [validItems, mapLoaded, handleItemClick])

  if (isLoading) {
    return (
      <div className={`relative bg-base-200 rounded-lg flex items-center justify-center ${height}`}>
        <div className="text-center p-8">
          <div className="loading loading-spinner loading-lg"></div>
          <div className="text-sm text-base-content/70 mt-4">Loading map...</div>
        </div>
      </div>
    )
  }

  if (mapError) {
    return (
      <div className={`relative bg-base-200 rounded-lg flex items-center justify-center ${height}`}>
        <div className="text-center p-8">
          <div className="text-error mb-2">Map failed to load</div>
          <div className="text-sm text-base-content/70 mb-4">{mapError}</div>
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

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className={`rounded-lg ${height}`}
        style={{ minHeight: '300px' }}
      />
      
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
                <span>Public Piano</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 ml-0.5"></div>
                <span>Verified</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-500 rounded mr-2"></div>
                <span>Piano Event</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2 ml-0.5"></div>
                <span>Verified</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-400 rounded mr-2 opacity-60"></div>
                <span>Past Event</span>
              </div>
            </>
          )}
        </div>
        <div className="mt-2 pt-2 border-t text-xs text-gray-600">
          {validItems.length} {itemType} shown
        </div>
      </div>
    </div>
  )
}