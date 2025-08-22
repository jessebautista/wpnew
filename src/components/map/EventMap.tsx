import type { Event } from '../../types'
import { InteractiveMap } from './InteractiveMap'

interface EventMapProps {
  events: Event[]
  onEventSelect?: (event: Event) => void
  height?: string
  center?: [number, number]
  zoom?: number
}

export function EventMap({ 
  events, 
  onEventSelect, 
  height = '500px',
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 2 
}: EventMapProps) {
  const handleEventClick = (item: any) => {
    onEventSelect?.(item as Event)
  }

  return (
    <InteractiveMap
      items={events}
      onItemSelect={handleEventClick}
      height={height}
      center={center}
      zoom={zoom}
      itemType="events"
    />
  )
}