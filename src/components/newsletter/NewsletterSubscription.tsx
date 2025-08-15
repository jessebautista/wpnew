import { useState } from 'react'
import { Mail, Check, AlertCircle, Settings } from 'lucide-react'
import { NewsletterService } from '../../services/newsletterService'

interface NewsletterSubscriptionProps {
  source?: string
  showPreferences?: boolean
  className?: string
  variant?: 'inline' | 'modal' | 'sidebar'
}

export function NewsletterSubscription({ 
  source = 'website', 
  showPreferences = false,
  className = '',
  variant = 'inline'
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [preferences, setPreferences] = useState({
    weekly_digest: true,
    event_notifications: true,
    new_piano_alerts: true,
    blog_updates: true
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [showPreferencesForm, setShowPreferencesForm] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address')
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    try {
      setStatus('loading')
      await NewsletterService.subscribe(
        email.trim(), 
        firstName.trim() || undefined, 
        lastName.trim() || undefined, 
        source,
        showPreferences ? preferences : undefined
      )
      
      setStatus('success')
      setMessage('Successfully subscribed! Welcome to the WorldPianos community.')
      setEmail('')
      setFirstName('')
      setLastName('')
      setShowPreferencesForm(false)
    } catch (error) {
      setStatus('error')
      if (error instanceof Error && error.message === 'Email already subscribed') {
        setMessage('This email is already subscribed to our newsletter.')
      } else {
        setMessage('Something went wrong. Please try again.')
      }
    }
  }

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (status === 'success') {
    return (
      <div className={`${className}`}>
        <div className="alert alert-success">
          <Check className="w-5 h-5" />
          <span>{message}</span>
        </div>
      </div>
    )
  }

  const getVariantClasses = () => {
    switch (variant) {
      case 'modal':
        return 'bg-base-100 p-6 rounded-lg shadow-xl max-w-md mx-auto'
      case 'sidebar':
        return 'bg-base-200 p-4 rounded-lg'
      default:
        return 'bg-gradient-to-r from-primary to-secondary text-primary-content p-6 rounded-lg'
    }
  }

  return (
    <div className={`${getVariantClasses()} ${className}`}>
      <div className="text-center mb-4">
        <Mail className="w-8 h-8 mx-auto mb-2 opacity-90" />
        <h3 className="text-xl font-bold mb-2">Stay Connected</h3>
        <p className={`text-sm ${variant === 'inline' ? 'opacity-90' : 'text-base-content/70'}`}>
          Get updates on new pianos, events, and community stories
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
        <div className="form-control">
          <input
            type="email"
            placeholder="Enter your email"
            className="input input-bordered w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            required
          />
        </div>

        {/* Name Fields (optional) */}
        <div className="grid grid-cols-2 gap-2">
          <div className="form-control">
            <input
              type="text"
              placeholder="First name (optional)"
              className="input input-bordered input-sm"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={status === 'loading'}
            />
          </div>
          <div className="form-control">
            <input
              type="text"
              placeholder="Last name (optional)"
              className="input input-bordered input-sm"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={status === 'loading'}
            />
          </div>
        </div>

        {/* Preferences Toggle */}
        {showPreferences && (
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={showPreferencesForm}
                onChange={(e) => setShowPreferencesForm(e.target.checked)}
              />
              <Settings className="w-4 h-4" />
              <span className="label-text">Customize email preferences</span>
            </label>
          </div>
        )}

        {/* Preferences Form */}
        {showPreferencesForm && (
          <div className="bg-base-100/10 p-3 rounded space-y-2">
            <p className="text-xs font-medium mb-2">What would you like to receive?</p>
            
            <label className="label cursor-pointer justify-start gap-2 py-1">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                checked={preferences.weekly_digest}
                onChange={() => handlePreferenceChange('weekly_digest')}
              />
              <span className="label-text text-xs">Weekly digest</span>
            </label>
            
            <label className="label cursor-pointer justify-start gap-2 py-1">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                checked={preferences.event_notifications}
                onChange={() => handlePreferenceChange('event_notifications')}
              />
              <span className="label-text text-xs">Event notifications</span>
            </label>
            
            <label className="label cursor-pointer justify-start gap-2 py-1">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                checked={preferences.new_piano_alerts}
                onChange={() => handlePreferenceChange('new_piano_alerts')}
              />
              <span className="label-text text-xs">New piano alerts</span>
            </label>
            
            <label className="label cursor-pointer justify-start gap-2 py-1">
              <input
                type="checkbox"
                className="checkbox checkbox-xs"
                checked={preferences.blog_updates}
                onChange={() => handlePreferenceChange('blog_updates')}
              />
              <span className="label-text text-xs">Blog updates</span>
            </label>
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <div className="alert alert-error alert-sm">
            <AlertCircle className="w-4 h-4" />
            <span className="text-xs">{message}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`btn w-full ${
            variant === 'inline' 
              ? 'btn-outline border-primary-content text-primary-content hover:bg-primary-content hover:text-primary' 
              : 'btn-primary'
          }`}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Subscribing...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Subscribe
            </>
          )}
        </button>
      </form>

      <p className={`text-xs mt-3 text-center ${variant === 'inline' ? 'opacity-75' : 'text-base-content/60'}`}>
        Unsubscribe anytime. We respect your privacy.
      </p>
    </div>
  )
}