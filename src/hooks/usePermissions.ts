import { useAuth } from '../components/auth/AuthProvider'
import type { UserRole } from '../types'

export function usePermissions() {
  const { user } = useAuth()

  const hasRole = (role: UserRole): boolean => {
    if (!user) return false
    return user.role === role
  }

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const canModerate = (): boolean => {
    return hasAnyRole(['moderator', 'admin'])
  }

  const canAdmin = (): boolean => {
    return hasRole('admin')
  }

  const canCreate = (): boolean => {
    return !!user // Any authenticated user can create content
  }

  const canEdit = (resourceUserId?: string): boolean => {
    if (!user) return false
    
    // Admins and moderators can edit anything
    if (canModerate()) return true
    
    // Users can edit their own content
    return resourceUserId === user.id
  }

  const canDelete = (resourceUserId?: string): boolean => {
    if (!user) return false
    
    // Admins and moderators can delete anything
    if (canModerate()) return true
    
    // Users can delete their own content
    return resourceUserId === user.id
  }

  const canVerify = (): boolean => {
    return canModerate()
  }

  const canManageUsers = (): boolean => {
    return canAdmin()
  }

  const canAccessAdminPanel = (): boolean => {
    return canModerate()
  }

  const canViewPrivateContent = (): boolean => {
    return canModerate()
  }

  const canComment = (): boolean => {
    return !!user
  }

  const canRate = (): boolean => {
    return !!user
  }

  const canUploadImages = (): boolean => {
    return !!user
  }

  return {
    user,
    hasRole,
    hasAnyRole,
    canModerate,
    canAdmin,
    canCreate,
    canEdit,
    canDelete,
    canVerify,
    canManageUsers,
    canAccessAdminPanel,
    canViewPrivateContent,
    canComment,
    canRate,
    canUploadImages,
    // Convenience properties
    isGuest: !user,
    isUser: hasRole('user'),
    isModerator: hasRole('moderator'),
    isAdmin: hasRole('admin'),
    isStaff: canModerate()
  }
}