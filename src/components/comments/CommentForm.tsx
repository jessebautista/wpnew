import { useState, useRef } from 'react'
import { Send, X } from 'lucide-react'
import ReCAPTCHA from 'react-google-recaptcha'

interface CommentFormProps {
  onSubmit: (content: string) => Promise<void>
  onCancel: () => void
  submitting: boolean
  placeholder?: string
  submitText?: string
  initialValue?: string
}

export function CommentForm({ 
  onSubmit, 
  onCancel, 
  submitting, 
  placeholder = "Write a comment...",
  submitText = "Post Comment",
  initialValue = ""
}: CommentFormProps) {
  const [content, setContent] = useState(initialValue)
  const [error, setError] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)
  
  // Get reCAPTCHA site key from environment variables
  const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' // Test key

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const trimmedContent = content.trim()
    if (!trimmedContent) {
      setError('Comment cannot be empty')
      return
    }

    if (trimmedContent.length > 1000) {
      setError('Comment is too long (maximum 1000 characters)')
      return
    }

    if (!recaptchaToken) {
      setError('Please complete the reCAPTCHA verification')
      return
    }

    try {
      setError('')
      await onSubmit(trimmedContent)
      setContent('')
      setRecaptchaToken(null)
      recaptchaRef.current?.reset()
    } catch (error) {
      setError('Failed to submit comment. Please try again.')
    }
  }

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token)
    if (error && token) {
      setError('') // Clear error when reCAPTCHA is completed
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="form-control">
        <textarea
          className={`textarea textarea-bordered w-full h-24 resize-none ${error ? 'textarea-error' : ''}`}
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitting}
          maxLength={1000}
        />
        {error && (
          <label className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        <label className="label">
          <span className="label-text-alt text-base-content/60">
            {content.length}/1000 characters
          </span>
          <span className="label-text-alt text-base-content/60">
            Press Ctrl/Cmd + Enter to submit
          </span>
        </label>
      </div>

      {/* reCAPTCHA */}
      <div className="form-control">
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={RECAPTCHA_SITE_KEY}
          onChange={handleRecaptchaChange}
          theme="light"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="btn btn-primary btn-sm"
          disabled={submitting || !content.trim() || !recaptchaToken}
        >
          {submitting ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          {submitting ? 'Posting...' : submitText}
        </button>
        
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost btn-sm"
          disabled={submitting}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
      </div>
    </form>
  )
}