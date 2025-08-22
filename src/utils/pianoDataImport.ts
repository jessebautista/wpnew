import { createClient } from '@supabase/supabase-js'

// Interface for the old piano data structure
interface OldPianoData {
  id: number
  piano_title: string
  piano_image: string | null
  piano_statement: string | null
  created_at: string
  piano_url: string | null
  piano_artist: string | null
  piano_year: string | null
  artist_name: string | null
  piano_program: string | null
  piano_artist_bio: string | null
  permanent_home_name: string | null
  contributors_info: string | null
  perm_lat: string | null
  perm_lng: string | null
  artist_photo: string | null
  artist_website_url: string | null
  artist_facebook_url: string | null
  artist_instagram_url: string | null
  public_location_name: string | null
  piano_search: string | null
  search_vector: any
  piano_site: number | null
  notes: string | null
}

// Interface for the new piano data structure
interface NewPianoData {
  id: string
  name: string
  description: string | null
  location_name: string
  latitude: number
  longitude: number
  category: string
  condition: string
  accessibility: string | null
  hours: string | null
  verified: boolean
  created_by: string
  verified_by: string | null
  moderation_status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}

// Default system user ID - you'll need to replace this with actual system user
const SYSTEM_USER_ID = '00000000-0000-0000-0000-000000000000'

/**
 * Transform old piano data to new schema format
 */
export function transformPianoData(oldPiano: OldPianoData): NewPianoData | null {
  // Skip if no coordinates available
  if (!oldPiano.perm_lat || !oldPiano.perm_lng) {
    console.warn(`Skipping piano ${oldPiano.id} - missing coordinates`)
    return null
  }

  const latitude = parseFloat(oldPiano.perm_lat)
  const longitude = parseFloat(oldPiano.perm_lng)

  // Validate coordinates
  if (isNaN(latitude) || isNaN(longitude) || 
      latitude < -90 || latitude > 90 || 
      longitude < -180 || longitude > 180) {
    console.warn(`Skipping piano ${oldPiano.id} - invalid coordinates: ${oldPiano.perm_lat}, ${oldPiano.perm_lng}`)
    return null
  }

  // Determine category based on available data
  let category = 'Other'
  const locationName = oldPiano.public_location_name || oldPiano.permanent_home_name || 'Unknown Location'
  
  // Simple categorization logic based on location name
  const locationLower = locationName.toLowerCase()
  if (locationLower.includes('airport')) category = 'Airport'
  else if (locationLower.includes('park') || locationLower.includes('garden')) category = 'Park'
  else if (locationLower.includes('station') || locationLower.includes('train')) category = 'Train Station'
  else if (locationLower.includes('mall') || locationLower.includes('shopping')) category = 'Shopping Center'
  else if (locationLower.includes('university') || locationLower.includes('college')) category = 'University'
  else if (locationLower.includes('hospital') || locationLower.includes('medical')) category = 'Hospital'
  else if (locationLower.includes('hotel') || locationLower.includes('resort')) category = 'Hotel'
  else if (locationLower.includes('restaurant') || locationLower.includes('cafe')) category = 'Restaurant'
  else if (locationLower.includes('street') || locationLower.includes('sidewalk')) category = 'Street'

  // Create description from available fields
  const descriptionParts = [
    oldPiano.piano_statement,
    oldPiano.artist_name ? `Artist: ${oldPiano.artist_name}` : null,
    oldPiano.piano_year ? `Year: ${oldPiano.piano_year}` : null,
    oldPiano.piano_program ? `Program: ${oldPiano.piano_program}` : null,
    oldPiano.contributors_info ? `Contributors: ${oldPiano.contributors_info}` : null,
    oldPiano.notes
  ].filter(Boolean)

  return {
    id: `imported-${oldPiano.id}`, // Prefix to avoid ID conflicts
    name: oldPiano.piano_title || 'Imported Piano',
    description: descriptionParts.join('\n\n') || null,
    location_name: locationName,
    latitude,
    longitude,
    category,
    condition: 'Unknown', // We don't have condition data in old schema
    accessibility: null, // Not available in old schema
    hours: null, // Not available in old schema
    verified: true, // Assume imported data is verified
    created_by: SYSTEM_USER_ID,
    verified_by: SYSTEM_USER_ID,
    moderation_status: 'approved' as const,
    created_at: oldPiano.created_at,
    updated_at: new Date().toISOString()
  }
}

/**
 * Import piano data from old Supabase project
 */
export async function importPianoData(
  oldSupabaseUrl: string,
  oldSupabaseKey: string,
  oldTableName: string = 'pianos'
) {
  console.log('🎹 Starting piano data import...')
  
  // Create client for old project
  const oldClient = createClient(oldSupabaseUrl, oldSupabaseKey)
  
  try {
    // Fetch all piano data from old project
    console.log('📥 Fetching piano data from old project...')
    const { data: oldPianos, error: fetchError } = await oldClient
      .from(oldTableName)
      .select('*')
      .order('id')

    if (fetchError) {
      throw new Error(`Failed to fetch old piano data: ${fetchError.message}`)
    }

    if (!oldPianos || oldPianos.length === 0) {
      console.log('⚠️ No piano data found in old project')
      return { success: false, message: 'No data to import' }
    }

    console.log(`📊 Found ${oldPianos.length} pianos in old project`)

    // Transform data
    console.log('🔄 Transforming piano data...')
    const transformedPianos = oldPianos
      .map(transformPianoData)
      .filter((piano): piano is NewPianoData => piano !== null)

    console.log(`✅ Successfully transformed ${transformedPianos.length} pianos`)
    
    if (transformedPianos.length === 0) {
      console.log('⚠️ No valid pianos after transformation')
      return { success: false, message: 'No valid pianos to import after transformation' }
    }

    // Return the transformed data for inspection
    return {
      success: true,
      message: `Transformed ${transformedPianos.length} pianos ready for import`,
      data: transformedPianos,
      summary: {
        total: oldPianos.length,
        transformed: transformedPianos.length,
        skipped: oldPianos.length - transformedPianos.length
      }
    }

  } catch (error) {
    console.error('❌ Error importing piano data:', error)
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Insert transformed piano data into current project
 */
export async function insertTransformedPianos(
  transformedPianos: NewPianoData[],
  currentSupabaseClient: any
) {
  console.log('💾 Inserting transformed pianos into current project...')
  
  try {
    // Insert in batches to avoid overwhelming the database
    const batchSize = 50
    const results = []
    
    for (let i = 0; i < transformedPianos.length; i += batchSize) {
      const batch = transformedPianos.slice(i, i + batchSize)
      console.log(`📝 Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(transformedPianos.length / batchSize)}`)
      
      const { data, error } = await currentSupabaseClient
        .from('pianos')
        .insert(batch)
        .select()

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error)
        return {
          success: false,
          message: `Failed to insert batch: ${error.message}`
        }
      }

      if (data) {
        results.push(...data)
        console.log(`✅ Successfully inserted ${data.length} pianos in this batch`)
      }
    }

    console.log(`🎉 Successfully imported ${results.length} pianos!`)
    
    return {
      success: true,
      message: `Successfully imported ${results.length} pianos`,
      insertedPianos: results
    }

  } catch (error) {
    console.error('❌ Error inserting pianos:', error)
    return {
      success: false,
      message: `Insert failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Complete import process - fetch, transform, and insert
 */
export async function completeImportProcess(
  oldSupabaseUrl: string,
  oldSupabaseKey: string,
  currentSupabaseClient: any,
  oldTableName: string = 'pianos'
) {
  console.log('🚀 Starting complete piano import process...')
  
  // Step 1: Import and transform data
  const importResult = await importPianoData(oldSupabaseUrl, oldSupabaseKey, oldTableName)
  
  if (!importResult.success || !importResult.data) {
    return importResult
  }

  // Step 2: Insert transformed data
  const insertResult = await insertTransformedPianos(importResult.data, currentSupabaseClient)
  
  return {
    ...insertResult,
    importSummary: importResult.summary
  }
}

// Export the import utilities for use in browser console or admin tools
if (typeof window !== 'undefined') {
  (window as any).pianoImportUtils = {
    importPianoData,
    transformPianoData,
    insertTransformedPianos,
    completeImportProcess
  }
}