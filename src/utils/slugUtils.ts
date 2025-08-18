/**
 * Utility functions for generating and handling URL slugs
 */

/**
 * Generate a URL-safe slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special characters with hyphens
    .replace(/[\s\W-]+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+|-+$/g, '')
    // Limit length to 60 characters
    .substring(0, 60)
    // Remove trailing hyphen if cut off mid-word
    .replace(/-+$/, '')
}

/**
 * Generate a unique slug by combining title slug with a unique identifier
 */
export function generateEventSlug(title: string, id: string, date?: string): string {
  const titleSlug = generateSlug(title)
  
  // For events, we can include the date for better context
  if (date) {
    const eventDate = new Date(date)
    const year = eventDate.getFullYear()
    const month = String(eventDate.getMonth() + 1).padStart(2, '0')
    const day = String(eventDate.getDate()).padStart(2, '0')
    const dateSlug = `${year}-${month}-${day}`
    
    // Combine: title-YYYY-MM-DD-shortId
    const shortId = id.split('-')[0] // Use first part of UUID for uniqueness
    return `${titleSlug}-${dateSlug}-${shortId}`
  }
  
  // Fallback: title-shortId
  const shortId = id.split('-')[0]
  return `${titleSlug}-${shortId}`
}

/**
 * Generate a unique slug for pianos
 */
export function generatePianoSlug(name: string, id: string, location?: string): string {
  const nameSlug = generateSlug(name)
  
  // For pianos, include location if available
  if (location) {
    const locationSlug = generateSlug(location)
    const shortId = id.split('-')[0]
    return `${nameSlug}-${locationSlug}-${shortId}`
  }
  
  // Fallback: name-shortId
  const shortId = id.split('-')[0]
  return `${nameSlug}-${shortId}`
}

/**
 * Extract ID from a slug
 * Assumes the ID is the last component after the final hyphen
 */
export function extractIdFromSlug(slug: string): string {
  const parts = slug.split('-')
  const lastPart = parts[parts.length - 1]
  
  // If it looks like a UUID prefix (8 chars, alphanumeric), return it
  if (lastPart && lastPart.length >= 6 && /^[a-f0-9]+$/i.test(lastPart)) {
    return lastPart
  }
  
  // Fallback: return the slug as-is (for backward compatibility)
  return slug
}

/**
 * Find an item by slug, falling back to ID lookup
 */
export function findBySlugOrId<T extends { id: string }>(
  items: T[], 
  slugOrId: string,
  generateSlugFn: (item: T) => string
): T | undefined {
  // First try to find by exact ID match
  let found = items.find(item => item.id === slugOrId)
  if (found) return found
  
  // Then try to find by partial ID match (for slug-extracted IDs)
  const extractedId = extractIdFromSlug(slugOrId)
  found = items.find(item => item.id.startsWith(extractedId))
  if (found) return found
  
  // Finally, try to find by matching generated slug
  found = items.find(item => generateSlugFn(item) === slugOrId)
  return found
}