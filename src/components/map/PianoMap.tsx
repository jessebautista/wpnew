import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import { Icon, divIcon, point } from 'leaflet'
import type { Piano } from '../../types'
import { Piano as PianoIcon, MapPin, Star, Clock } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom piano marker icon
const createPianoIcon = (category: string, verified: boolean) => {
  const color = verified ? '#10b981' : '#f59e0b' // green for verified, amber for unverified
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
        ${verified ? `<circle cx="20" cy="5" r="4" fill="${color}"/><path d="M18 5l1 1 2-2" stroke="white" stroke-width="1" fill="none"/>` : ''}
      </svg>
    `)}`,
    iconSize: [25, 35],
    iconAnchor: [12, 35],
    popupAnchor: [0, -35],
  })
}

// Custom cluster icon
const createClusterCustomIcon = (cluster: any) => {
  const count = cluster.getChildCount()
  let size = 'small'
  
  if (count >= 100) size = 'large'
  else if (count >= 10) size = 'medium'
  
  const sizeMap: Record<string, string> = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm', 
    large: 'w-12 h-12 text-base'
  }

  return divIcon({
    html: `<div class="bg-primary text-primary-content rounded-full flex items-center justify-center font-bold shadow-lg ${sizeMap[size]}">${count}</div>`,
    className: 'custom-div-icon',
    iconSize: point(40, 40, true),
  })
}

interface PianoMapProps {
  pianos: Piano[]
  onPianoSelect?: (piano: Piano) => void
  height?: string
  center?: [number, number]
  zoom?: number
}

// Component to fit map bounds to pianos
function FitBounds({ pianos }: { pianos: Piano[] }) {
  const map = useMap()
  
  useEffect(() => {
    if (pianos.length === 0) return
    
    const bounds = pianos.map(piano => [piano.latitude, piano.longitude] as [number, number])
    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] })
    }
  }, [pianos, map])
  
  return null
}

export function PianoMap({ 
  pianos, 
  onPianoSelect, 
  height = '500px',
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 2 
}: PianoMapProps) {
  const handlePianoClick = (piano: Piano) => {
    onPianoSelect?.(piano)
  }

  return (
    <div className="relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        className="rounded-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {pianos.map((piano) => (
            <Marker
              key={piano.id}
              position={[piano.latitude, piano.longitude]}
              icon={createPianoIcon(piano.category, piano.verified)}
              eventHandlers={{
                click: () => handlePianoClick(piano)
              }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{piano.name}</h3>
                    {piano.verified && (
                      <div className="badge badge-success badge-sm">
                        <Star className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {piano.location_name}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <PianoIcon className="w-4 h-4 mr-1" />
                    {piano.category} • {piano.condition}
                  </div>
                  
                  {piano.hours && (
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Clock className="w-4 h-4 mr-1" />
                      {piano.hours}
                    </div>
                  )}
                  
                  {piano.description && (
                    <p className="text-sm text-gray-700 mb-3">
                      {piano.description.length > 100 
                        ? `${piano.description.substring(0, 100)}...`
                        : piano.description
                      }
                    </p>
                  )}
                  
                  <div className="flex space-x-2">
                    <a href={`/pianos/${piano.id}`} className="btn btn-primary btn-xs">
                      View Details
                    </a>
                    <button className="btn btn-outline btn-xs">
                      Mark Visited
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
        
        <FitBounds pianos={pianos} />
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-10">
        <h4 className="font-semibold text-sm mb-2">Piano Types</h4>
        <div className="space-y-1 text-xs">
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
        </div>
        <div className="mt-2 pt-2 border-t text-xs">
          <div className="flex items-center">
            <Star className="w-3 h-3 text-green-500 mr-1" />
            <span>Verified</span>
          </div>
        </div>
      </div>
    </div>
  )
}