/**
 * Admin utilities for user management and data import
 * Use these functions carefully - they should only be used by authorized administrators
 */

import { supabase } from '../lib/supabase'
import { completeImportProcess, importPianoData } from './pianoDataImport'

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

/**
 * Import piano data from old Supabase project
 */
export async function importPianosFromOldProject(
  oldSupabaseUrl: string,
  oldSupabaseKey: string,
  oldTableName: string = 'pianos'
) {
  console.log('🎹 Starting piano data import from old project...')
  
  try {
    const result = await completeImportProcess(
      oldSupabaseUrl,
      oldSupabaseKey,
      supabase,
      oldTableName
    )
    
    if (result.success) {
      console.log('🎉 Piano import completed successfully!')
      if ('importSummary' in result) {
        console.log('📊 Import Summary:', result.importSummary)
      }
      if ('insertedPianos' in result) {
        console.log('💾 Inserted pianos:', result.insertedPianos?.length || 0)
      }
    } else {
      console.error('❌ Piano import failed:', result.message)
    }
    
    return result
  } catch (error) {
    console.error('❌ Piano import error:', error)
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Preview piano data from old project (without importing)
 */
export async function previewPianoImport(
  oldSupabaseUrl: string,
  oldSupabaseKey: string,
  oldTableName: string = 'pianos'
) {
  console.log('👀 Previewing piano data from old project...')
  
  const result = await importPianoData(oldSupabaseUrl, oldSupabaseKey, oldTableName)
  
  if (result.success && result.data) {
    console.log('📊 Preview Summary:', result.summary)
    console.log('🎹 Sample transformed piano:', result.data[0])
    console.log('📍 All piano locations:')
    result.data.forEach((piano, index) => {
      console.log(`  ${index + 1}. ${piano.name} - ${piano.location_name} (${piano.latitude}, ${piano.longitude})`)
    })
  } else {
    console.error('❌ Preview failed:', result.message)
  }
  
  return result
}

/**
 * Emergency admin user creation (development only)
 */
export async function createEmergencyAdmin(email: string): Promise<boolean> {
  if (import.meta.env.PROD) {
    console.error('createEmergencyAdmin() is not available in production')
    return false
  }
  
  try {
    // Insert directly into users table (for development only)
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: `emergency-admin-${Date.now()}`,
        email: email,
        full_name: 'Emergency Admin',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
    
    if (error) {
      console.error('Error creating emergency admin:', error)
      return false
    }
    
    console.log('Emergency admin created:', data)
    return true
  } catch (error) {
    console.error('Error in createEmergencyAdmin:', error)
    return false
  }
}

// Export the functions to window object for console access (development only)
if (import.meta.env.DEV) {
  (window as any).adminUtils = {
    upgradeToAdmin,
    listAllUsers,
    makeCurrentUserAdmin,
    createEmergencyAdmin,
    importPianosFromOldProject,
    previewPianoImport
  }
  
  console.log('🔧 Admin utilities available in console:')
  console.log('- adminUtils.makeCurrentUserAdmin() - Make current user admin')
  console.log('- adminUtils.upgradeToAdmin(email) - Upgrade specific user to admin')
  console.log('- adminUtils.listAllUsers() - List all users')
  console.log('- adminUtils.createEmergencyAdmin("your@email.com") - Create admin user')
  console.log('🎹 Piano import utilities:')
  console.log('- adminUtils.previewPianoImport(oldUrl, oldKey) - Preview piano data without importing')
  console.log('- adminUtils.importPianosFromOldProject(oldUrl, oldKey) - Import all piano data')
}