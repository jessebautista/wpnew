import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Piano, Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        throw error
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-success rounded-full p-3">
                <CheckCircle className="w-8 h-8 text-success-content" />
              </div>
            </div>
            <h2 className="text-3xl font-bold">Check your email</h2>
            <p className="mt-2 text-base-content/70">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center space-y-4">
              <p className="text-base-content/80">
                Click the link in your email to reset your password. The link will expire in 1 hour.
              </p>
              
              <p className="text-sm text-base-content/60">
                Didn't receive the email? Check your spam folder or try again.
              </p>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    setSuccess(false)
                    setEmail('')
                  }}
                  className="btn btn-outline"
                >
                  Try again
                </button>
                
                <Link to="/login" className="btn btn-primary">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-primary rounded-full p-3">
              <Piano className="w-8 h-8 text-primary-content" />
            </div>
          </div>
          <h2 className="text-3xl font-bold">Forgot your password?</h2>
          <p className="mt-2 text-base-content/70">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email address</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Sending reset link...
                  </>
                ) : (
                  'Send reset link'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link to="/login" className="link link-primary flex items-center justify-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-base-content/50">
          Remember your password?{' '}
          <Link to="/login" className="link link-hover">Sign in</Link>
        </p>
      </div>
    </div>
  )
}