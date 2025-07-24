import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Mail, Check, AlertCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { NewsletterService } from '../../services/newsletterService'
import { NewsletterSubscription } from '../../components/newsletter/NewsletterSubscription'

export function UnsubscribePage() {
  const [searchParams] = useSearchParams()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'not_found' | 'form'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const emailFromUrl = searchParams.get('email')
    if (emailFromUrl) {
      setEmail(emailFromUrl)
      handleUnsubscribe(emailFromUrl)
    } else {
      setStatus('form')
    }
  }, [searchParams])

  const handleUnsubscribe = async (emailToUnsubscribe: string) => {
    try {
      setStatus('loading')
      const success = await NewsletterService.unsubscribe(emailToUnsubscribe)
      
      if (success) {
        setStatus('success')
        setMessage('You have been successfully unsubscribed from our newsletter.')
      } else {
        setStatus('not_found')
        setMessage('This email address was not found in our subscriber list.')
      }
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return

    await handleUnsubscribe(email.trim())
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-warning to-error text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <Mail className="w-16 h-16 mx-auto mb-4 opacity-90" />
          <h1 className="text-4xl font-bold mb-2">Unsubscribe</h1>
          <p className="text-xl opacity-90">
            Manage your newsletter subscription
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {status === 'loading' && (
            <div className="text-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
              <p className="mt-4">Processing your request...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="alert alert-success mb-8">
                <Check className="w-6 h-6" />
                <span className="text-lg">{message}</span>
              </div>

              <div className="space-y-6">
                <p className="text-lg text-base-content/80">
                  We're sorry to see you go! Your email <strong>{email}</strong> has been removed from our mailing list.
                </p>

                <div className="bg-base-200 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">What you'll miss:</h3>
                  <ul className="space-y-2 text-base-content/80">
                    <li>• Updates on new public pianos in your area</li>
                    <li>• Invitations to exclusive piano events and meetups</li>
                    <li>• Community stories and featured piano discoveries</li>
                    <li>• Monthly digest of the best piano content</li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <p className="text-base-content/70">
                    Changed your mind? You can always subscribe again:
                  </p>
                  
                  <NewsletterSubscription 
                    source="unsubscribe_page"
                    variant="modal"
                    showPreferences={true}
                    className="mx-auto"
                  />
                </div>

                <div className="pt-6 border-t">
                  <Link to="/" className="btn btn-primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to WorldPianos
                  </Link>
                </div>
              </div>
            </div>
          )}

          {status === 'not_found' && (
            <div className="text-center">
              <div className="alert alert-warning mb-8">
                <AlertCircle className="w-6 h-6" />
                <span className="text-lg">{message}</span>
              </div>

              <p className="text-lg text-base-content/80 mb-8">
                The email address <strong>{email}</strong> is not in our subscriber list.
              </p>

              <div className="space-y-4">
                <p>Maybe you want to try a different email address?</p>
                <button 
                  onClick={() => {
                    setStatus('form')
                    setEmail('')
                  }}
                  className="btn btn-outline"
                >
                  Try Different Email
                </button>
                
                <div className="pt-6 border-t">
                  <Link to="/" className="btn btn-primary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return to WorldPianos
                  </Link>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="alert alert-error mb-8">
                <AlertCircle className="w-6 h-6" />
                <span className="text-lg">{message}</span>
              </div>

              <div className="space-y-4">
                <p className="text-base-content/80">
                  Please try again or contact us if the problem persists.
                </p>
                
                <button 
                  onClick={() => handleUnsubscribe(email)}
                  className="btn btn-primary"
                >
                  Try Again
                </button>
                
                <div className="pt-6 border-t">
                  <Link to="/contact" className="btn btn-outline mr-4">
                    Contact Support
                  </Link>
                  <Link to="/" className="btn btn-ghost">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Return Home
                  </Link>
                </div>
              </div>
            </div>
          )}

          {status === 'form' && (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-4">Unsubscribe from Newsletter</h2>
                <p className="text-base-content/70">
                  Enter your email address to unsubscribe from our newsletter.
                </p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Email Address</span>
                  </label>
                  <input
                    type="email"
                    className="input input-bordered w-full"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-warning w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Unsubscribe
                </button>
              </form>

              <div className="text-center mt-8 pt-6 border-t">
                <p className="text-sm text-base-content/60 mb-4">
                  Having trouble? Need to update your preferences instead?
                </p>
                <Link to="/contact" className="btn btn-outline btn-sm mr-4">
                  Contact Us
                </Link>
                <Link to="/" className="btn btn-ghost btn-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Return Home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}