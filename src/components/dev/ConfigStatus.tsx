/**
 * Configuration Status Component
 * Shows current environment configuration for development
 */

import { useState, useEffect } from 'react'
import { getConfigurationStatus, getEnvironmentConfig } from '../../config/environment'
import { Settings, Database, Globe, BarChart3, MapPin, X } from 'lucide-react'

export function ConfigStatus() {
  const [isVisible, setIsVisible] = useState(false)
  const [config, setConfig] = useState(getEnvironmentConfig())
  const [status, setStatus] = useState(getConfigurationStatus())

  useEffect(() => {
    // Only show in development
    if (config.appMode === 'development') {
      setIsVisible(true)
    }
  }, [config.appMode])

  if (!isVisible || config.appMode !== 'development') {
    return null
  }

  const toggleVisibility = () => {
    setIsVisible(!isVisible)
  }

  if (!isVisible) {
    // Show floating button to open status
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 btn btn-circle btn-primary btn-sm shadow-lg"
        title="Show Configuration Status"
      >
        <Settings className="w-4 h-4" />
      </button>
    )
  }

  const getStatusIcon = (isConfigured: boolean) => {
    return isConfigured ? (
      <div className="w-3 h-3 bg-success rounded-full" />
    ) : (
      <div className="w-3 h-3 bg-warning rounded-full" />
    )
  }

  const getStatusText = (isConfigured: boolean) => {
    return isConfigured ? 'Configured' : 'Mock Data'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <div className="card bg-base-300 shadow-xl border border-base-content/20">
        <div className="card-body p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="card-title text-sm flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Config Status
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="btn btn-ghost btn-xs btn-circle"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            {/* Data Source */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-3 h-3" />
                Data Source
              </span>
              <div className="flex items-center gap-1">
                {getStatusIcon(status.supabaseConfigured)}
                <span>{status.useMockData ? 'Mock' : 'Supabase'}</span>
              </div>
            </div>

            {/* Supabase */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Database className="w-3 h-3" />
                Supabase
              </span>
              <div className="flex items-center gap-1">
                {getStatusIcon(status.supabaseConfigured)}
                <span>{getStatusText(status.supabaseConfigured)}</span>
              </div>
            </div>

            {/* Google Maps */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="w-3 h-3" />
                Maps
              </span>
              <div className="flex items-center gap-1">
                {getStatusIcon(status.googleMapsConfigured)}
                <span>{getStatusText(status.googleMapsConfigured)}</span>
              </div>
            </div>

            {/* Google Analytics */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                Analytics
              </span>
              <div className="flex items-center gap-1">
                {getStatusIcon(status.googleAnalyticsConfigured)}
                <span>{getStatusText(status.googleAnalyticsConfigured)}</span>
              </div>
            </div>

            {/* Geocoding */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Geocoding
              </span>
              <div className="flex items-center gap-1">
                {getStatusIcon(status.geocodingConfigured)}
                <span>{getStatusText(status.geocodingConfigured)}</span>
              </div>
            </div>
          </div>

          <div className="divider my-2"></div>

          <div className="text-xs opacity-70">
            <p className="mb-1">To use real services:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Set VITE_USE_MOCK_DATA=false</li>
              <li>Configure API keys in .env</li>
              <li>Restart development server</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}