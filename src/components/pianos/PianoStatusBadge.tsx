import type { PianoStatus } from '../../types'

interface PianoStatusBadgeProps {
  status: PianoStatus
  size?: 'default' | 'sm' | 'lg'
  showIcon?: boolean
  className?: string
}

export function PianoStatusBadge({ 
  status, 
  size = 'default', 
  showIcon = true,
  className = '' 
}: PianoStatusBadgeProps) {
  const getBadgeClass = (status: PianoStatus) => {
    switch (status) {
      case 'Available':
        return 'badge-success'
      case 'Unplayable':
        return 'badge-error'
      case 'Archived':
        return 'badge-neutral'
      case 'Unknown':
      default:
        return 'badge-warning'
    }
  }

  const getStatusIcon = (status: PianoStatus) => {
    if (!showIcon) return ''
    
    switch (status) {
      case 'Available':
        return '✅ '
      case 'Unplayable':
        return '❌ '
      case 'Archived':
        return '📦 '
      case 'Unknown':
      default:
        return '❓ '
    }
  }

  const sizeClass = size === 'sm' ? 'badge-sm' : size === 'lg' ? 'badge-lg' : ''

  return (
    <div className={`badge ${getBadgeClass(status)} ${sizeClass} ${className}`}>
      {getStatusIcon(status)}{status}
    </div>
  )
}