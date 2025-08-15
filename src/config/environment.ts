/**
 * Environment Configuration
 * Centralized configuration for managing environment variables and data sources
 */

export interface EnvironmentConfig {
  // Application settings
  appMode: 'development' | 'production'
  useMockData: boolean
  
  // Supabase settings
  supabase: {
    url: string | null
    anonKey: string | null
    isConfigured: boolean
  }
  
  // External API settings
  googleMaps: {
    apiKey: string | null
    isConfigured: boolean
  }
  
  googleAnalytics: {
    measurementId: string | null
    isConfigured: boolean
  }
  
  geocoding: {
    apiKey: string | null
    isConfigured: boolean
  }
}

/**
 * Get environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  const gaMeasurementId = import.meta.env.VITE_GA_MEASUREMENT_ID
  const geocodingApiKey = import.meta.env.VITE_GEOCODING_API_KEY
  
  // Check if mock data should be used
  const useMockDataEnv = import.meta.env.VITE_USE_MOCK_DATA
  const useMockData = useMockDataEnv === 'true' || useMockDataEnv === true
  
  // Auto-detect if Supabase is configured
  const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey && 
    supabaseUrl !== 'your_supabase_project_url' && 
    supabaseAnonKey !== 'your_supabase_anon_key')
  
  return {
    appMode: import.meta.env.VITE_APP_MODE === 'production' ? 'production' : 'development',
    useMockData: useMockData || !supabaseConfigured, // Use mock data if not configured or explicitly set
    
    supabase: {
      url: supabaseUrl || null,
      anonKey: supabaseAnonKey || null,
      isConfigured: supabaseConfigured
    },
    
    googleMaps: {
      apiKey: googleMapsApiKey || null,
      isConfigured: !!(googleMapsApiKey && googleMapsApiKey !== 'your_google_maps_api_key')
    },
    
    googleAnalytics: {
      measurementId: gaMeasurementId || null,
      isConfigured: !!(gaMeasurementId && gaMeasurementId !== 'your_ga_measurement_id')
    },
    
    geocoding: {
      apiKey: geocodingApiKey || null,
      isConfigured: !!(geocodingApiKey && geocodingApiKey !== 'your_geocoding_api_key')
    }
  }
}

/**
 * Check if we should use mock data for a specific service
 */
export function shouldUseMockData(service?: 'supabase' | 'googleMaps' | 'geocoding'): boolean {
  const config = getEnvironmentConfig()
  
  if (config.useMockData) return true
  
  // Service-specific checks
  if (service === 'supabase') return !config.supabase.isConfigured
  if (service === 'googleMaps') return !config.googleMaps.isConfigured
  if (service === 'geocoding') return !config.geocoding.isConfigured
  
  return false
}

/**
 * Get configuration status for debugging
 */
export function getConfigurationStatus(): Record<string, boolean> {
  const config = getEnvironmentConfig()
  
  return {
    useMockData: config.useMockData,
    supabaseConfigured: config.supabase.isConfigured,
    googleMapsConfigured: config.googleMaps.isConfigured,
    googleAnalyticsConfigured: config.googleAnalytics.isConfigured,
    geocodingConfigured: config.geocoding.isConfigured
  }
}

/**
 * Log configuration status (development only)
 */
export function logConfigurationStatus(): void {
  if (getEnvironmentConfig().appMode === 'development') {
    const status = getConfigurationStatus()
    console.log('🔧 WorldPianos Configuration Status:', status)
    
    if (status.useMockData) {
      console.log('📊 Using mock data - set VITE_USE_MOCK_DATA=false and configure APIs to use real services')
    } else {
      console.log('🔗 Using real services')
    }
  }
}