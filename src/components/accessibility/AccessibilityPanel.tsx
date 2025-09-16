import { useState } from 'react'
import { 
  Settings, 
  Eye, 
  Volume2, 
  VolumeX, 
  Keyboard, 
  Type, 
  Contrast,
  Zap,
  RotateCcw,
  X
} from 'lucide-react'
import { useAccessibility } from '../../contexts/AccessibilityContext'
import { useLanguage } from '../../contexts/LanguageContext'

interface AccessibilityPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const { settings, updateSetting, resetSettings, announceToScreenReader } = useAccessibility()
  const { } = useLanguage()
  const [activeTab, setActiveTab] = useState<'visual' | 'audio' | 'navigation'>('visual')

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSetting(key, value)
    announceToScreenReader(`${key} ${value ? 'enabled' : 'disabled'}`)
  }

  const handleReset = () => {
    resetSettings()
    announceToScreenReader('Accessibility settings reset to default')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="accessibility-panel-title">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} aria-hidden="true"></div>
        
        {/* Panel */}
        <div className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden text-left transition-all transform bg-base-100 shadow-xl rounded-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-base-300 flex-shrink-0">
            <h2 id="accessibility-panel-title" className="text-lg sm:text-2xl font-bold flex items-center gap-2 sm:gap-3">
              <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="hidden sm:inline">Accessibility Settings</span>
              <span className="sm:hidden">Accessibility</span>
            </h2>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-sm"
              aria-label="Close accessibility panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="tabs tabs-bordered px-4 sm:px-6 pt-4 flex-shrink-0">
            <button 
              className={`tab tab-sm sm:tab-lg ${activeTab === 'visual' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('visual')}
              role="tab"
              aria-selected={activeTab === 'visual'}
            >
              <Eye className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Visual</span>
              <span className="sm:hidden">View</span>
            </button>
            <button 
              className={`tab tab-sm sm:tab-lg ${activeTab === 'audio' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('audio')}
              role="tab"
              aria-selected={activeTab === 'audio'}
            >
              <Volume2 className="w-4 h-4 mr-1 sm:mr-2" />
              Audio
            </button>
            <button 
              className={`tab tab-sm sm:tab-lg ${activeTab === 'navigation' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('navigation')}
              role="tab"
              aria-selected={activeTab === 'navigation'}
            >
              <Keyboard className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Navigation</span>
              <span className="sm:hidden">Nav</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            {activeTab === 'visual' && (
              <div className="space-y-4 sm:space-y-6" role="tabpanel" aria-labelledby="visual-tab">
                {/* High Contrast */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={settings.highContrast}
                      onChange={(e) => handleSettingChange('highContrast', e.target.checked)}
                      aria-describedby="high-contrast-desc"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Contrast className="w-4 h-4 flex-shrink-0" />
                        <span className="label-text font-medium text-sm">High Contrast Mode</span>
                      </div>
                      <div id="high-contrast-desc" className="text-xs text-base-content/70 mt-1">
                        Increases contrast between text and background colors
                      </div>
                    </div>
                  </label>
                </div>

                {/* Font Size */}
                <div className="form-control">
                  <div className="mb-3">
                    <span className="label-text font-medium text-sm flex items-center gap-2">
                      <Type className="w-4 h-4 flex-shrink-0" />
                      Font Size
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                      <label key={size} className="label cursor-pointer justify-start gap-2 py-2">
                        <input
                          type="radio"
                          name="fontSize"
                          value={size}
                          className="radio radio-primary radio-sm"
                          checked={settings.fontSize === size}
                          onChange={() => handleSettingChange('fontSize', size)}
                        />
                        <span className="label-text text-sm capitalize flex-1">{size.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Reduced Motion */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={settings.reducedMotion}
                      onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
                      aria-describedby="reduced-motion-desc"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 flex-shrink-0" />
                        <span className="label-text font-medium text-sm">Reduce Motion</span>
                      </div>
                      <div id="reduced-motion-desc" className="text-xs text-base-content/70 mt-1">
                        Minimizes animations and transitions
                      </div>
                    </div>
                  </label>
                </div>

                {/* Focus Visible */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={settings.focusVisible}
                      onChange={(e) => handleSettingChange('focusVisible', e.target.checked)}
                      aria-describedby="focus-visible-desc"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 flex-shrink-0" />
                        <span className="label-text font-medium text-sm">Enhanced Focus Indicators</span>
                      </div>
                      <div id="focus-visible-desc" className="text-xs text-base-content/70 mt-1">
                        Shows clear visual indicators when navigating with keyboard
                      </div>
                    </div>
                  </label>
                </div>

                {/* Reading Mode */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={settings.readingMode}
                      onChange={(e) => handleSettingChange('readingMode', e.target.checked)}
                      aria-describedby="reading-mode-desc"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 flex-shrink-0" />
                        <span className="label-text font-medium text-sm">Reading Mode</span>
                      </div>
                      <div id="reading-mode-desc" className="text-xs text-base-content/70 mt-1">
                        Optimizes text layout and spacing for easier reading
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="space-y-4 sm:space-y-6" role="tabpanel" aria-labelledby="audio-tab">
                {/* Sound Enabled */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={settings.soundEnabled}
                      onChange={(e) => handleSettingChange('soundEnabled', e.target.checked)}
                      aria-describedby="sound-enabled-desc"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {settings.soundEnabled ? (
                          <Volume2 className="w-4 h-4 flex-shrink-0" />
                        ) : (
                          <VolumeX className="w-4 h-4 flex-shrink-0" />
                        )}
                        <span className="label-text font-medium text-sm">Sound Effects</span>
                      </div>
                      <div id="sound-enabled-desc" className="text-xs text-base-content/70 mt-1">
                        Enables audio feedback for interactions and notifications
                      </div>
                    </div>
                  </label>
                </div>

                {/* Screen Reader Optimized */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={settings.screenReaderOptimized}
                      onChange={(e) => handleSettingChange('screenReaderOptimized', e.target.checked)}
                      aria-describedby="screen-reader-desc"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4 flex-shrink-0" />
                        <span className="label-text font-medium text-sm">Screen Reader Optimization</span>
                      </div>
                      <div id="screen-reader-desc" className="text-xs text-base-content/70 mt-1">
                        Optimizes interface for screen reader users with enhanced announcements
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'navigation' && (
              <div className="space-y-4 sm:space-y-6" role="tabpanel" aria-labelledby="navigation-tab">
                {/* Keyboard Navigation */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={settings.keyboardNavigation}
                      onChange={(e) => handleSettingChange('keyboardNavigation', e.target.checked)}
                      aria-describedby="keyboard-nav-desc"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Keyboard className="w-4 h-4 flex-shrink-0" />
                        <span className="label-text font-medium text-sm">Enhanced Keyboard Navigation</span>
                      </div>
                      <div id="keyboard-nav-desc" className="text-xs text-base-content/70 mt-1">
                        Improves keyboard navigation with arrow key support and shortcuts
                      </div>
                    </div>
                  </label>
                </div>

                {/* Skip Links */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={settings.skipLinks}
                      onChange={(e) => handleSettingChange('skipLinks', e.target.checked)}
                      aria-describedby="skip-links-desc"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 flex-shrink-0" />
                        <span className="label-text font-medium text-sm">Skip Navigation Links</span>
                      </div>
                      <div id="skip-links-desc" className="text-xs text-base-content/70 mt-1">
                        Provides links to skip to main content and navigation
                      </div>
                    </div>
                  </label>
                </div>

                {/* Simplified UI */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-3 py-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary toggle-sm"
                      checked={settings.simplifiedUI}
                      onChange={(e) => handleSettingChange('simplifiedUI', e.target.checked)}
                      aria-describedby="simplified-ui-desc"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 flex-shrink-0" />
                        <span className="label-text font-medium text-sm">Simplified Interface</span>
                      </div>
                      <div id="simplified-ui-desc" className="text-xs text-base-content/70 mt-1">
                        Reduces visual complexity and focuses on essential elements
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            )}

            {/* Reset Button */}
            <div className="pt-4 border-t border-base-300">
              <button
                onClick={handleReset}
                className="btn btn-outline btn-sm"
                aria-describedby="reset-desc"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset to Default
              </button>
              <div id="reset-desc" className="text-sm text-base-content/70 mt-2">
                This will reset all accessibility settings to their default values
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-4 sm:p-6 border-t border-base-300 flex-shrink-0">
            <button onClick={onClose} className="btn btn-primary">
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}