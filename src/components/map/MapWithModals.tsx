import { useState } from 'react'
import { InteractiveMap } from './InteractiveMap'
import { PianoModal } from '../piano/PianoModal'
import { EventModal } from '../event/EventModal'
import type { Piano, Event } from '../../types'

// Type for map item (either Piano or Event)
type MapItem = Piano | Event

interface MapWithModalsProps {
  items: MapItem[]
  height?: string
  center?: [number, number]
  zoom?: number
  itemType: 'pianos' | 'events'
}

export function MapWithModals({ 
  items, 
  height = '500px',
  center = [40.7128, -74.0060],
  zoom = 2,
  itemType
}: MapWithModalsProps) {
  const [selectedPiano, setSelectedPiano] = useState<Piano | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isPianoModalOpen, setIsPianoModalOpen] = useState(false)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)

  const handlePianoModalOpen = (piano: Piano) => {
    setSelectedPiano(piano)
    setIsPianoModalOpen(true)
  }

  const handleEventModalOpen = (event: Event) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handlePianoModalClose = () => {
    setIsPianoModalOpen(false)
    setSelectedPiano(null)
  }

  const handleEventModalClose = () => {
    setIsEventModalOpen(false)
    setSelectedEvent(null)
  }

  return (
    <>
      <InteractiveMap
        items={items}
        height={height}
        center={center}
        zoom={zoom}
        itemType={itemType}
        showModal={true}
        onPianoModalOpen={handlePianoModalOpen}
        onEventModalOpen={handleEventModalOpen}
      />
      
      {/* Piano Modal */}
      <PianoModal
        piano={selectedPiano}
        isOpen={isPianoModalOpen}
        onClose={handlePianoModalClose}
      />
      
      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={handleEventModalClose}
      />
    </>
  )
}