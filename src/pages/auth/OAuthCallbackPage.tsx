import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, shouldUseMockData } from '../../lib/supabase'
import { getOrCreateUserProfile } from '../../utils/directAuth'
import { useAuth } from '../../components/auth/AuthProvider'
import { Piano } from 'lucide-react'

export function OAuthCallbackPage() {
  const [, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { } = useAuth()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (shouldUseMockData('supabase')) {
        // In mock mode, just redirect to home
        navigate('/')
        return
      }

      try {
        console.log('[OAUTH] Processing OAuth callback...')
        
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('[OAUTH] Session error:', error)
          setError(error.message)
          return
        }

        if (data.session?.user) {
          console.log('[OAUTH] OAuth login successful for:', data.session.user.email)
          
          // Create or get user profile
          await getOrCreateUserProfile(data.session.user)
          
          // Redirect to home page
          console.log('[OAUTH] Redirecting to home...')
          navigate('/')
        } else {
          console.log('[OAUTH] No session found, redirecting to login')
          navigate('/login')
        }
      } catch (err) {
        console.error('[OAUTH] Callback processing error:', err)
        setError('An error occurred during authentication')
      } finally {
        setLoading(false)
      }
    }

    handleOAuthCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body text-center">
            <div className="text-error mb-4">
              <Piano className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-2xl font-bold">Authentication Failed</h2>
            </div>
            <p className="mb-4">{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body text-center">
          <div className="bg-primary rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <Piano className="w-10 h-10 text-primary-content mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Completing Sign In</h2>
          <p className="text-base-content/70 mb-4">
            Please wait while we finish setting up your account...
          </p>
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    </div>
  )
}