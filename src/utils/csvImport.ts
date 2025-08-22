import { supabase } from '../lib/supabase'
import type { Piano } from '../types'

interface CSVPianoRow {
  id: string
  piano_title: string
  piano_image: string
  piano_statement: string
  created_at: string
  piano_url: string
  piano_artist: string
  piano_year: string
  artist_name: string
  piano_program: string
  piano_artist_bio: string
  permanent_home_name: string
  contributors_info: string
  perm_lat: string
  perm_lng: string
  artist_photo: string
  artist_website_url: string
  artist_facebook_url: string
  artist_instagram_url: string
  public_location_name: string
  piano_search: string
  search_vector: string
  piano_site: string
  notes: string
}

/**
 * Parse CSV data and convert to piano objects
 */
export function parseCSVData(csvText: string): Partial<Piano>[] {
  const lines = csvText.split('\n').filter(line => line.trim())
  if (lines.length < 2) {
    throw new Error('CSV must have at least a header and one data row')
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
  console.log('CSV Headers:', headers)

  const pianos: Partial<Piano>[] = []

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    try {
      // Simple CSV parsing - this may need adjustment based on CSV format
      const values = parseCSVLine(line)
      
      if (values.length !== headers.length) {
        console.warn(`Row ${i} has ${values.length} values but ${headers.length} headers expected`)
        continue
      }

      const rowData: any = {}
      headers.forEach((header, index) => {
        rowData[header] = values[index] || null
      })

      // Transform to our piano format
      const piano: Partial<Piano> = {
        id: parseInt(rowData.id) || 0,
        piano_title: rowData.piano_title || 'Untitled Piano',
        piano_image: rowData.piano_image || null,
        piano_statement: rowData.piano_statement || null,
        piano_url: rowData.piano_url || null,
        piano_year: rowData.piano_year || null,
        piano_artist: null, // Will need to be mapped to user IDs
        artist_name: rowData.artist_name || null,
        piano_artist_bio: rowData.piano_artist_bio || null,
        artist_photo: rowData.artist_photo || null,
        artist_website_url: rowData.artist_website_url || null,
        artist_facebook_url: rowData.artist_facebook_url || null,
        artist_instagram_url: rowData.artist_instagram_url || null,
        permanent_home_name: rowData.permanent_home_name || null,
        public_location_name: rowData.public_location_name || null,
        perm_lat: rowData.perm_lat || null,
        perm_lng: rowData.perm_lng || null,
        piano_program: rowData.piano_program || null,
        contributors_info: rowData.contributors_info || null,
        piano_site: parseInt(rowData.piano_site) || null,
        notes: rowData.notes || null,
        piano_search: rowData.piano_search || null,
        created_at: rowData.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: '00000000-0000-0000-0000-000000000000', // System user
        verified_by: '00000000-0000-0000-0000-000000000000',
        moderation_status: 'approved' as const,
        verified: true
      }

      // Add computed coordinates for map display
      if (piano.perm_lat && piano.perm_lng) {
        const lat = parseFloat(piano.perm_lat)
        const lng = parseFloat(piano.perm_lng)
        if (!isNaN(lat) && !isNaN(lng)) {
          piano.latitude = lat
          piano.longitude = lng
        }
      }

      // Add display location name
      piano.location_display_name = piano.public_location_name || piano.permanent_home_name || 'Unknown Location'

      pianos.push(piano)
    } catch (error) {
      console.error(`Error parsing row ${i}:`, error)
      continue
    }
  }

  console.log(`Successfully parsed ${pianos.length} pianos from CSV`)
  return pianos
}

/**
 * Parse a single CSV line handling quoted values
 */
function parseCSVLine(line: string): string[] {
  const values: string[] = []
  let current = ''
  let inQuotes = false
  let i = 0

  while (i < line.length) {
    const char = line[i]
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"'
        i += 2
      } else {
        // Toggle quote state
        inQuotes = !inQuotes
        i++
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current.trim())
      current = ''
      i++
    } else {
      current += char
      i++
    }
  }
  
  // Add the last field
  values.push(current.trim())
  
  return values.map(v => v.replace(/^"|"$/g, '')) // Remove surrounding quotes
}

/**
 * Import CSV data to the database
 */
export async function importCSVToDatabase(pianos: Partial<Piano>[]): Promise<{
  success: boolean
  message: string
  imported?: Piano[]
  errors?: string[]
}> {
  console.log(`🎹 Starting import of ${pianos.length} pianos to database...`)
  
  const errors: string[] = []
  const imported: Piano[] = []
  
  try {
    // Import in batches of 25
    const batchSize = 25
    
    for (let i = 0; i < pianos.length; i += batchSize) {
      const batch = pianos.slice(i, i + batchSize)
      console.log(`📦 Importing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(pianos.length / batchSize)}`)
      
      const { data, error } = await supabase
        .from('pianos')
        .insert(batch)
        .select()
      
      if (error) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, error)
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`)
        continue
      }
      
      if (data) {
        imported.push(...data as Piano[])
        console.log(`✅ Successfully imported ${data.length} pianos in batch ${Math.floor(i / batchSize) + 1}`)
      }
      
      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    
    const successCount = imported.length
    const failureCount = pianos.length - successCount
    
    console.log(`🎉 Import completed: ${successCount} success, ${failureCount} failures`)
    
    return {
      success: successCount > 0,
      message: `Successfully imported ${successCount} pianos. ${failureCount} failed.`,
      imported,
      errors: errors.length > 0 ? errors : undefined
    }
    
  } catch (error) {
    console.error('❌ Import failed:', error)
    return {
      success: false,
      message: `Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      errors: [error instanceof Error ? error.message : 'Unknown error']
    }
  }
}

/**
 * Complete CSV import process
 */
export async function importSingForHopeCSV(csvText: string): Promise<{
  success: boolean
  message: string
  summary?: {
    parsed: number
    imported: number
    failed: number
  }
  imported?: Piano[]
  errors?: string[]
}> {
  try {
    console.log('🚀 Starting Sing for Hope CSV import process...')
    
    // Step 1: Parse CSV
    const pianos = parseCSVData(csvText)
    
    if (pianos.length === 0) {
      return {
        success: false,
        message: 'No valid piano data found in CSV'
      }
    }
    
    // Step 2: Import to database
    const importResult = await importCSVToDatabase(pianos)
    
    return {
      ...importResult,
      summary: {
        parsed: pianos.length,
        imported: importResult.imported?.length || 0,
        failed: pianos.length - (importResult.imported?.length || 0)
      }
    }
    
  } catch (error) {
    console.error('❌ CSV import process failed:', error)
    return {
      success: false,
      message: `CSV import failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Preview CSV data without importing
 */
export function previewCSVData(csvText: string, maxRows: number = 5): {
  success: boolean
  message: string
  preview?: Partial<Piano>[]
  totalRows?: number
} {
  try {
    const pianos = parseCSVData(csvText)
    const preview = pianos.slice(0, maxRows)
    
    return {
      success: true,
      message: `Found ${pianos.length} pianos in CSV. Showing first ${preview.length}.`,
      preview,
      totalRows: pianos.length
    }
  } catch (error) {
    return {
      success: false,
      message: `Preview failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Export utilities to window for console access
if (typeof window !== 'undefined') {
  (window as any).csvImportUtils = {
    parseCSVData,
    importCSVToDatabase,
    importSingForHopeCSV,
    previewCSVData
  }
  
  console.log('📊 CSV import utilities available:')
  console.log('- csvImportUtils.previewCSVData(csvText) - Preview CSV data')
  console.log('- csvImportUtils.importSingForHopeCSV(csvText) - Import full CSV')
}