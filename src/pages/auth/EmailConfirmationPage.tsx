import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Mail, Home, CheckCircle, RefreshCw } from 'lucide-react'

export function EmailConfirmationPage() {
  const [resending, setResending] = useState(false)
  const [resendMessage, setResendMessage] = useState('')
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email')

  const handleResendVerification = async () => {
    if (!email) {
      setResendMessage('No email address found. Please try signing up again.')
      return
    }

    setResending(true)
    setResendMessage('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })

      if (error) {
        throw error
      }

      setResendMessage('Verification email sent! Check your inbox.')
    } catch (err: any) {
      setResendMessage(err.message || 'Failed to resend verification email')
    } finally {
      setResending(false)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-success rounded-full p-3">
              <Mail className="w-8 h-8 text-success-content" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Check Your Email</h2>
          <p className="mt-2 text-base-content/70">
            We've sent a confirmation link to your email address
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-success" />
            </div>
            
            <h3 className="text-xl font-semibold mb-4">Account Created Successfully!</h3>
            
            <div className="text-left space-y-4 mb-6">
              <p className="text-base-content/80">
                Your WorldPianos account has been created. To complete your registration and start exploring:
              </p>
              
              <div className="steps steps-vertical lg:steps-horizontal w-full">
                <div className="step step-primary">Check your email</div>
                <div className="step">Click the confirmation link</div>
                <div className="step">Start exploring pianos!</div>
              </div>
            </div>

            {resendMessage && (
              <div className={`alert ${resendMessage.includes('sent') ? 'alert-success' : 'alert-error'}`}>
                <span>{resendMessage}</span>
              </div>
            )}

            <div className="alert alert-info">
              <div className="flex items-start">
                <RefreshCw className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <div className="text-left text-sm">
                  <p className="font-medium">Didn't receive the email?</p>
                  <p>Check your spam folder or wait a few minutes for delivery.</p>
                </div>
              </div>
            </div>

            <div className="divider">What's Next?</div>

            <div className="text-left space-y-3 mb-6">
              <h4 className="font-semibold">While you wait, you can:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-base-content/70">
                <li>Explore public pianos around the world</li>
                <li>Browse upcoming piano events</li>
                <li>Read our community blog</li>
                <li>Learn about the WorldPianos community</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/" className="btn btn-primary flex-1">
                <Home className="w-4 h-4 mr-2" />
                Explore WorldPianos
              </Link>
              <button 
                className="btn btn-outline flex-1"
                onClick={handleResendVerification}
                disabled={resending || !email}
              >
                {resending ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Resend Email
                  </>
                )}
              </button>
            </div>

            <div className="text-center mt-6 pt-4 border-t border-base-300">
              <span className="text-base-content/70 text-sm">
                Need help? Contact us at{' '}
                <a href="mailto:support@worldpianos.org" className="link link-primary">
                  support@worldpianos.org
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}