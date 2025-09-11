import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Piano, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

export function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we have the required tokens from the URL
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    if (!accessToken || !refreshToken) {
      setError('Invalid or expired reset link. Please request a new one.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      })

      if (error) {
        throw error
      }

      setSuccess(true)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Failed to reset password')
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
            <h2 className="text-3xl font-bold">Password updated!</h2>
            <p className="mt-2 text-base-content/70">
              Your password has been successfully updated.
            </p>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center space-y-4">
              <p className="text-base-content/80">
                You can now sign in with your new password.
              </p>
              
              <p className="text-sm text-base-content/60">
                Redirecting to sign in page in 3 seconds...
              </p>

              <Link to="/login" className="btn btn-primary">
                Sign In Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const accessToken = searchParams.get('access_token')
  if (!accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-error rounded-full p-3">
                <AlertCircle className="w-8 h-8 text-error-content" />
              </div>
            </div>
            <h2 className="text-3xl font-bold">Invalid reset link</h2>
            <p className="mt-2 text-base-content/70">
              This reset link is invalid or has expired.
            </p>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body text-center space-y-4">
              <p className="text-base-content/80">
                Please request a new password reset link.
              </p>

              <Link to="/forgot-password" className="btn btn-primary">
                Request New Link
              </Link>
              
              <Link to="/login" className="btn btn-outline">
                Back to Sign In
              </Link>
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
          <h2 className="text-3xl font-bold">Reset your password</h2>
          <p className="mt-2 text-base-content/70">
            Enter your new password below
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
                  <span className="label-text">New password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input input-bordered w-full pl-10 pr-10"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-base-content/50" />
                    ) : (
                      <Eye className="w-5 h-5 text-base-content/50" />
                    )}
                  </button>
                </div>
                <label className="label">
                  <span className="label-text-alt">Must be at least 6 characters</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm new password</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input input-bordered w-full pl-10"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                    Updating password...
                  </>
                ) : (
                  'Update password'
                )}
              </button>
            </form>

            <div className="text-center mt-6">
              <Link to="/login" className="link link-primary">
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}