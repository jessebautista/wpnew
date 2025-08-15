/**
 * Admin utilities for user management
 * Use these functions carefully - they should only be used by authorized administrators
 */

import { supabase } from '../lib/supabase'

/**
 * Upgrade a user to admin role
 * @param userEmail - Email of the user to upgrade
 * @returns Promise<boolean> - Success status
 */
export async function upgradeToAdmin(userEmail: string): Promise<boolean> {
  try {
    console.log(`Upgrading user ${userEmail} to admin role...`)
    
    const { data, error } = await supabase
      .from('users')
      .update({ 
        role: 'admin',
        updated_at: new Date().toISOString()
      })
      .eq('email', userEmail)
      .select()

    if (error) {
      console.error('Error upgrading user to admin:', error)
      return false
    }

    if (data && data.length > 0) {
      console.log('User successfully upgraded to admin:', data[0])
      return true
    } else {
      console.warn('No user found with email:', userEmail)
      return false
    }
  } catch (error) {
    console.error('Error in upgradeToAdmin:', error)
    return false
  }
}

/**
 * List all users in the system
 */
export async function listAllUsers() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, full_name, role, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in listAllUsers:', error)
    return []
  }
}

/**
 * Create an admin user (use with caution!)
 * This function is for development/setup purposes only
 */
export async function createAdminUser(email: string, _fullName?: string): Promise<boolean> {
  try {
    console.log(`Creating admin user: ${email}`)
    
    // First check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, role')
      .eq('email', email)
      .single()

    if (existingUser) {
      // User exists, just upgrade to admin
      return await upgradeToAdmin(email)
    }

    // Create new admin user (this should typically be done through the auth signup flow)
    console.warn('Note: This creates a user record without proper authentication. Use auth signup instead.')
    
    return false // Don't create users without proper auth
  } catch (error) {
    console.error('Error in createAdminUser:', error)
    return false
  }
}

/**
 * Development helper: Make current user admin
 * Only works in development mode
 */
export async function makeCurrentUserAdmin(): Promise<boolean> {
  if (import.meta.env.PROD) {
    console.error('makeCurrentUserAdmin() is not available in production')
    return false
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.error('No user is currently logged in')
      return false
    }

    console.log('Making current user admin:', user.email)
    return await upgradeToAdmin(user.email!)
  } catch (error) {
    console.error('Error in makeCurrentUserAdmin:', error)
    return false
  }
}

// Export the functions to window object for console access (development only)
if (import.meta.env.DEV) {
  (window as any).adminUtils = {
    upgradeToAdmin,
    listAllUsers,
    makeCurrentUserAdmin
  }
  
  console.log('🔧 Admin utilities available in console:')
  console.log('- adminUtils.makeCurrentUserAdmin() - Make current user admin')
  console.log('- adminUtils.upgradeToAdmin(email) - Upgrade specific user to admin')
  console.log('- adminUtils.listAllUsers() - List all users')
}