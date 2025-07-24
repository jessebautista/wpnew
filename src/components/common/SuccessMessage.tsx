import { useEffect, useState } from 'react'
import { CheckCircle, X } from 'lucide-react'

interface SuccessMessageProps {
  message: string
  onClose: () => void
  duration?: number
}

export function SuccessMessage({ message, onClose, duration = 5000 }: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(() => onClose(), 300) // Allow fade out animation
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  return (
    <div className="toast toast-top toast-end">
      <div className="alert alert-success shadow-lg">
        <CheckCircle className="w-5 h-5" />
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(() => onClose(), 300)
          }}
          className="btn btn-ghost btn-sm btn-square"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}