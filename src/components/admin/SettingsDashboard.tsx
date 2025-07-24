import { useState, useEffect } from 'react'
import { 
  Settings,
  BarChart3,
  Search,
  Bot,
  Save,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  Zap,
  Globe,
  Shield,
  Cpu
} from 'lucide-react'
import { SettingsService, type AppSettings } from '../../services/settingsService'
import { AIEnhancementService } from '../../services/aiEnhancementService'
import { useAuth } from '../auth/AuthProvider'

interface SettingsDashboardProps {
  onClose?: () => void
}

type SettingsTab = 'analytics' | 'seo' | 'ai'

export function SettingsDashboard({ onClose }: SettingsDashboardProps) {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<SettingsTab>('analytics')
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [testingConnection, setTestingConnection] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setLoading(true)
      const currentSettings = SettingsService.getSettings()
      setSettings(currentSettings)
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!settings || !user) return

    try {
      setSaving(true)
      await SettingsService.updateSettings(settings, user.id)
      
      // Apply AI configuration
      if (settings.ai.enabled) {
        AIEnhancementService.configure(
          settings.ai.enabled,
          settings.ai.api_key || '',
          settings.ai.provider
        )
      }

      setConnectionStatus('success')
      setTimeout(() => setConnectionStatus('idle'), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setConnectionStatus('error')
      setTimeout(() => setConnectionStatus('idle'), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleTestConnection = async () => {
    if (!settings?.ai.enabled || !settings.ai.api_key) return

    setTestingConnection(true)
    try {
      // Mock API test - in real app, this would test the actual AI service
      await new Promise(resolve => setTimeout(resolve, 2000))
      setConnectionStatus('success')
    } catch (error) {
      setConnectionStatus('error')
    } finally {
      setTestingConnection(false)
      setTimeout(() => setConnectionStatus('idle'), 3000)
    }
  }

  const updateSettings = (path: string, value: any) => {
    if (!settings) return

    const keys = path.split('.')
    const newSettings = { ...settings }
    let current: any = newSettings

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setSettings(newSettings)
  }

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Settings className="w-7 h-7 text-primary" />
            Analytics & SEO Settings
          </h2>
          <p className="text-base-content/70">Configure tracking, SEO optimization, and AI enhancements</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            ✕
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered">
        <button 
          className={`tab tab-lg ${activeTab === 'analytics' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Analytics
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'seo' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('seo')}
        >
          <Search className="w-4 h-4 mr-2" />
          SEO
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'ai' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('ai')}
        >
          <Bot className="w-4 h-4 mr-2" />
          AI Enhancement
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'analytics' && (
        <AnalyticsTab 
          settings={settings.analytics} 
          onUpdate={(path, value) => updateSettings(`analytics.${path}`, value)}
        />
      )}
      
      {activeTab === 'seo' && (
        <SEOTab 
          settings={settings.seo} 
          onUpdate={(path, value) => updateSettings(`seo.${path}`, value)}
        />
      )}
      
      {activeTab === 'ai' && (
        <AITab 
          settings={settings.ai}
          onUpdate={(path, value) => updateSettings(`ai.${path}`, value)}
          showApiKeys={showApiKeys}
          onToggleApiKeys={() => setShowApiKeys(!showApiKeys)}
          onTestConnection={handleTestConnection}
          testingConnection={testingConnection}
        />
      )}

      {/* Save Button */}
      <div className="flex items-center gap-4 pt-6 border-t">
        <button
          onClick={handleSaveSettings}
          className="btn btn-primary"
          disabled={saving}
        >
          {saving ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </button>

        {connectionStatus === 'success' && (
          <div className="alert alert-success alert-sm">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}

        {connectionStatus === 'error' && (
          <div className="alert alert-error alert-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Error saving settings. Please try again.</span>
          </div>
        )}

        <div className="text-sm text-base-content/60">
          Last updated: {new Date(settings.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  )
}

function AnalyticsTab({ settings, onUpdate }: any) {
  return (
    <div className="space-y-6">
      {/* Enable/Disable Analytics */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="card-title">Google Analytics</h3>
              <p className="text-base-content/70">Track website usage and user behavior</p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={settings.enabled}
              onChange={(e) => onUpdate('enabled', e.target.checked)}
            />
          </div>

          {settings.enabled && (
            <div className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Google Analytics ID *</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="G-XXXXXXXXXX or UA-XXXXXXXXX"
                  value={settings.google_analytics_id}
                  onChange={(e) => onUpdate('google_analytics_id', e.target.value)}
                />
                <label className="label">
                  <span className="label-text-alt">Find this in your Google Analytics property settings</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Google Tag Manager ID (Optional)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  placeholder="GTM-XXXXXXX"
                  value={settings.google_tag_manager_id}
                  onChange={(e) => onUpdate('google_tag_manager_id', e.target.value)}
                />
              </div>

              <div className="divider">Tracking Options</div>

              <div className="space-y-3">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={settings.track_events}
                    onChange={(e) => onUpdate('track_events', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Track User Events</span>
                    <div className="text-sm text-base-content/60">Track button clicks, form submissions, etc.</div>
                  </div>
                </label>

                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={settings.track_scroll}
                    onChange={(e) => onUpdate('track_scroll', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Track Scroll Depth</span>
                    <div className="text-sm text-base-content/60">Measure how far users scroll on pages</div>
                  </div>
                </label>

                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={settings.anonymize_ip}
                    onChange={(e) => onUpdate('anonymize_ip', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Anonymize IP Addresses</span>
                    <div className="text-sm text-base-content/60">Recommended for GDPR compliance</div>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {!settings.enabled && (
        <div className="alert alert-info">
          <AlertCircle className="w-5 h-5" />
          <div>
            <h4 className="font-bold">Analytics Disabled</h4>
            <div className="text-sm">Enable analytics to track website performance and user behavior. This helps improve the user experience and content strategy.</div>
          </div>
        </div>
      )}
    </div>
  )
}

function SEOTab({ settings, onUpdate }: any) {
  return (
    <div className="space-y-6">
      {/* SEO Enable/Disable */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="card-title">SEO Optimization</h3>
              <p className="text-base-content/70">Improve search engine visibility and ranking</p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={settings.enabled}
              onChange={(e) => onUpdate('enabled', e.target.checked)}
            />
          </div>

          {settings.enabled && (
            <div className="space-y-4 mt-4">
              <div className="space-y-3">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={settings.auto_generate_meta}
                    onChange={(e) => onUpdate('auto_generate_meta', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Auto-Generate Meta Tags</span>
                    <div className="text-sm text-base-content/60">Automatically create meta descriptions and keywords</div>
                  </div>
                </label>

                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={settings.structured_data}
                    onChange={(e) => onUpdate('structured_data', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Generate Structured Data</span>
                    <div className="text-sm text-base-content/60">Add schema.org markup for rich search results</div>
                  </div>
                </label>

                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={settings.sitemap_generation}
                    onChange={(e) => onUpdate('sitemap_generation', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Generate XML Sitemap</span>
                    <div className="text-sm text-base-content/60">Help search engines discover your content</div>
                  </div>
                </label>
              </div>

              <div className="divider">Default Meta Settings</div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Title Suffix</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={settings.default_meta.title_suffix}
                  onChange={(e) => onUpdate('default_meta.title_suffix', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Default Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered"
                  rows={3}
                  value={settings.default_meta.description}
                  onChange={(e) => onUpdate('default_meta.description', e.target.value)}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Default Keywords (comma-separated)</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={settings.default_meta.keywords.join(', ')}
                  onChange={(e) => onUpdate('default_meta.keywords', e.target.value.split(', '))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function AITab({ settings, onUpdate, showApiKeys, onToggleApiKeys, onTestConnection, testingConnection }: any) {
  return (
    <div className="space-y-6">
      {/* AI Enhancement Enable/Disable */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="card-title">AI Content Enhancement</h3>
              <p className="text-base-content/70">Use AI to improve descriptions and SEO content</p>
            </div>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={settings.enabled}
              onChange={(e) => onUpdate('enabled', e.target.checked)}
            />
          </div>

          {settings.enabled && (
            <div className="space-y-4 mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">AI Provider</span>
                </label>
                <select
                  className="select select-bordered"
                  value={settings.provider}
                  onChange={(e) => onUpdate('provider', e.target.value)}
                >
                  <option value="openai">OpenAI (GPT)</option>
                  <option value="anthropic">Anthropic (Claude)</option>
                  <option value="local">Local Model</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">API Key</span>
                  <button 
                    onClick={onToggleApiKeys}
                    className="btn btn-ghost btn-xs"
                  >
                    {showApiKeys ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </label>
                <input
                  type={showApiKeys ? "text" : "password"}
                  className="input input-bordered"
                  placeholder="sk-..."
                  value={settings.api_key}
                  onChange={(e) => onUpdate('api_key', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Model</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={settings.model}
                    onChange={(e) => onUpdate('model', e.target.value)}
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="gpt-4">GPT-4</option>
                    <option value="claude-3">Claude 3</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Max Tokens</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered"
                    value={settings.max_tokens}
                    onChange={(e) => onUpdate('max_tokens', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="divider">Enhancement Options</div>

              <div className="space-y-3">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={settings.enhance_descriptions}
                    onChange={(e) => onUpdate('enhance_descriptions', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Enhance Descriptions</span>
                    <div className="text-sm text-base-content/60">Improve piano and event descriptions</div>
                  </div>
                </label>

                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={settings.generate_tags}
                    onChange={(e) => onUpdate('generate_tags', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">Generate Tags</span>
                    <div className="text-sm text-base-content/60">Auto-generate relevant keywords and tags</div>
                  </div>
                </label>

                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={settings.seo_suggestions}
                    onChange={(e) => onUpdate('seo_suggestions', e.target.checked)}
                  />
                  <div>
                    <span className="label-text font-medium">SEO Suggestions</span>
                    <div className="text-sm text-base-content/60">Provide SEO improvement recommendations</div>
                  </div>
                </label>
              </div>

              {settings.api_key && (
                <div className="flex gap-2">
                  <button
                    onClick={onTestConnection}
                    className="btn btn-outline btn-sm"
                    disabled={testingConnection}
                  >
                    {testingConnection ? (
                      <>
                        <span className="loading loading-spinner loading-xs"></span>
                        Testing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!settings.enabled && (
        <div className="alert alert-info">
          <Bot className="w-5 h-5" />
          <div>
            <h4 className="font-bold">AI Enhancement Disabled</h4>
            <div className="text-sm">Enable AI enhancement to automatically improve content descriptions and SEO optimization using advanced language models.</div>
          </div>
        </div>
      )}
    </div>
  )
}