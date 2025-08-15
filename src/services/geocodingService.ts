/**
 * Geocoding Service
 * Provides location search and coordinate conversion functionality using OpenStreetMap Nominatim
 */

export interface LocationSuggestion {
  id: string
  place_name: string
  address: string
  latitude: number
  longitude: number
}

export interface GeocodingResult {
  latitude: number
  longitude: number
  address: string
}

export class GeocodingService {
  /**
   * Search for location suggestions based on input text
   */
  static async searchLocations(query: string): Promise<LocationSuggestion[]> {
    if (!query.trim() || query.length < 3) {
      return []
    }

    try {
      return await this.searchWithNominatim(query)
    } catch (error) {
      console.error('Nominatim API error:', error)
      // Fall back to mock data
      return this.getMockSuggestions(query)
    }
  }

  /**
   * Get coordinates for a specific address
   */
  static async getCoordinates(address: string): Promise<GeocodingResult | null> {
    if (!address.trim()) {
      return null
    }

    try {
      return await this.geocodeWithNominatim(address)
    } catch (error) {
      console.error('Nominatim API error:', error)
      // Fall back to mock data
      return this.getMockCoordinates(address)
    }
  }

  /**
   * Use OpenStreetMap Nominatim API to search for locations
   */
  private static async searchWithNominatim(query: string): Promise<LocationSuggestion[]> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WorldPianos/1.0 (https://worldpianos.org)'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    return data.map((result: any, index: number) => ({
      id: `nominatim-${result.place_id}`,
      place_name: result.display_name,
      address: result.display_name,
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon)
    }))
  }

  /**
   * Use OpenStreetMap Nominatim API to get coordinates for an address
   */
  private static async geocodeWithNominatim(address: string): Promise<GeocodingResult | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WorldPianos/1.0 (https://worldpianos.org)'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.length) {
      return null
    }

    const result = data[0]
    return {
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      address: result.display_name
    }
  }

  /**
   * Generate mock location suggestions for development
   */
  private static getMockSuggestions(query: string): LocationSuggestion[] {
    const mockLocations = [
      {
        id: 'mock-1',
        place_name: `${query} - Central Park, New York, NY`,
        address: `${query}, Central Park, New York, NY 10024`,
        latitude: 40.7829,
        longitude: -73.9654
      },
      {
        id: 'mock-2',
        place_name: `${query} - Times Square, New York, NY`,
        address: `${query}, Times Square, New York, NY 10036`,
        latitude: 40.7580,
        longitude: -73.9855
      },
      {
        id: 'mock-3',
        place_name: `${query} - JFK Airport, New York, NY`,
        address: `${query}, JFK Airport, Queens, NY 11430`,
        latitude: 40.6413,
        longitude: -73.7781
      }
    ]

    // Filter mock suggestions based on query
    return mockLocations.filter(location => 
      location.place_name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3)
  }

  /**
   * Generate mock coordinates for development
   */
  private static getMockCoordinates(address: string): GeocodingResult {
    // Simple mock that generates coordinates based on address hash
    const hash = this.simpleHash(address.toLowerCase())
    const lat = 40.7589 + (hash % 1000) / 10000 // NYC area
    const lng = -73.9851 + (hash % 500) / 10000

    return {
      latitude: lat,
      longitude: lng,
      address: `${address} (Mock Location)`
    }
  }

  /**
   * Simple hash function for mock coordinates
   */
  private static simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}