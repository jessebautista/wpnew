import { useState } from 'react'
import { X, Mail, Heart } from 'lucide-react'

interface EmailInterestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (email: string) => void
  loading: boolean
  eventTitle: string
}

export function EmailInterestModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  loading, 
  eventTitle 
}: EmailInterestModalProps) {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
      return
    }
    
    setEmailError('')
    onSubmit(email.trim())
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (emailError && value.trim()) {
      setEmailError('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6 text-primary" />
            <h3 className="text-lg font-semibold">Show Interest</h3>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={loading}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <h4 className="font-medium text-base mb-2">
              Interested in: {eventTitle}
            </h4>
            <p className="text-sm text-base-content/70 mb-4">
              To receive updates about this event, please enter your email address. 
              We'll notify you of any changes or important information.
            </p>
          </div>

          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-medium">
                <Mail className="w-4 h-4 inline mr-2" />
                Email Address
              </span>
            </label>
            <input
              type="email"
              placeholder="your.email@example.com"
              className={`input input-bordered w-full ${emailError ? 'input-error' : ''}`}
              value={email}
              onChange={handleEmailChange}
              disabled={loading}
              autoFocus
            />
            {emailError && (
              <label className="label">
                <span className="label-text-alt text-error">{emailError}</span>
              </label>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Subscribing...
                </>
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  I'm Interested
                </>
              )}
            </button>
          </div>
        </form>

        <div className="px-6 pb-6">
          <p className="text-xs text-base-content/50">
            By providing your email, you agree to receive event updates. 
            You can unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  )
}