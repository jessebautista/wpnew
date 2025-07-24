import { Link } from 'react-router-dom'
import { Shield, Home, LogIn } from 'lucide-react'
import { usePermissions } from '../../hooks/usePermissions'

export function UnauthorizedPage() {
  const { user } = usePermissions()

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="bg-error/10 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-12 h-12 text-error" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        
        {user ? (
          <div>
            <p className="text-base-content/70 mb-6">
              You don't have permission to access this page. This area is restricted to administrators and moderators.
            </p>
            <div className="space-y-3">
              <Link to="/" className="btn btn-primary">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Link>
              <Link to="/dashboard" className="btn btn-outline">
                Go to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-base-content/70 mb-6">
              You need to be signed in to access this page. Please log in with your account.
            </p>
            <div className="space-y-3">
              <Link to="/login" className="btn btn-primary">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-outline">
                Create Account
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-sm text-base-content/50">
          <p>If you believe this is an error, please contact support.</p>
        </div>
      </div>
    </div>
  )
}