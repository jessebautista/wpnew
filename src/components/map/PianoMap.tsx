import type { Piano } from '../../types'
import { InteractiveMap } from './InteractiveMap'

interface PianoMapProps {
  pianos: Piano[]
  onPianoSelect?: (piano: Piano) => void
  height?: string
  center?: [number, number]
  zoom?: number
}

export function PianoMap({ 
  pianos, 
  onPianoSelect, 
  height = '500px',
  center = [40.7128, -74.0060], // Default to NYC
  zoom = 2 
}: PianoMapProps) {
  const handlePianoClick = (item: any) => {
    onPianoSelect?.(item as Piano)
  }

  return (
    <InteractiveMap
      items={pianos}
      onItemSelect={handlePianoClick}
      height={height}
      center={center}
      zoom={zoom}
      itemType="pianos"
    />
  )
}