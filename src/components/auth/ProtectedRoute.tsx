import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { usePermissions } from '../../hooks/usePermissions'
import type { UserRole } from '../../types'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRole
  requiredRoles?: UserRole[]
  requireAuth?: boolean
  fallbackPath?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole,
  requiredRoles,
  requireAuth = true,
  fallbackPath = '/login'
}: ProtectedRouteProps) {
  const { user, hasRole, hasAnyRole } = usePermissions()
  const location = useLocation()

  // Check if authentication is required
  if (requireAuth && !user) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Check specific role requirement
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />
  }

  // Check if user has any of the required roles
  if (requiredRoles && !hasAnyRole(requiredRoles)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}

// Convenience components for common protection patterns
export function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRole="admin" fallbackPath="/unauthorized">
      {children}
    </ProtectedRoute>
  )
}

export function ModeratorRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['moderator', 'admin']} fallbackPath="/unauthorized">
      {children}
    </ProtectedRoute>
  )
}

export function AuthenticatedRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute requireAuth={true}>
      {children}
    </ProtectedRoute>
  )
}