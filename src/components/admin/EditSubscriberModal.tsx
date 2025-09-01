import { useState } from 'react'
import { Check } from 'lucide-react'
import { NewsletterService } from '../../services/newsletterService'
import type { NewsletterSubscriber } from '../../services/newsletterService'

interface EditSubscriberModalProps {
  subscriber: NewsletterSubscriber
  onClose: () => void
  onSave: () => Promise<void>
}

export function EditSubscriberModal({ subscriber, onClose, onSave }: EditSubscriberModalProps) {
  const [formData, setFormData] = useState({
    first_name: subscriber.first_name || '',
    last_name: subscriber.last_name || '',
    status: subscriber.status,
    preferences: { ...subscriber.preferences }
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const updates: Partial<NewsletterSubscriber> = {
        first_name: formData.first_name || undefined,
        last_name: formData.last_name || undefined,
        status: formData.status,
        preferences: formData.preferences
      }

      const result = await NewsletterService.updateSubscriber(subscriber.id, updates)
      if (result) {
        await onSave()
      } else {
        alert('Failed to update subscriber')
      }
    } catch (error) {
      console.error('Error updating subscriber:', error)
      alert('Failed to update subscriber')
    } finally {
      setSaving(false)
    }
  }

  const handlePreferenceChange = (key: keyof typeof formData.preferences) => {
    setFormData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key]
      }
    }))
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Edit Subscriber</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="font-medium text-sm text-base-content/80 mb-2">Email</div>
            <div className="text-sm bg-base-200 p-2 rounded">{subscriber.email}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-sm">First Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="First name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-sm">Last Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered input-sm"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Last name"
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">Status</span>
            </label>
            <select
              className="select select-bordered select-sm"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            >
              <option value="active">Active</option>
              <option value="unsubscribed">Unsubscribed</option>
              <option value="bounced">Bounced</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text text-sm">Email Preferences</span>
            </label>
            <div className="space-y-2">
              <label className="label cursor-pointer justify-start gap-2 py-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={formData.preferences.weekly_digest}
                  onChange={() => handlePreferenceChange('weekly_digest')}
                />
                <span className="label-text text-xs">Weekly digest</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2 py-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={formData.preferences.event_notifications}
                  onChange={() => handlePreferenceChange('event_notifications')}
                />
                <span className="label-text text-xs">Event notifications</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2 py-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={formData.preferences.new_piano_alerts}
                  onChange={() => handlePreferenceChange('new_piano_alerts')}
                />
                <span className="label-text text-xs">New piano alerts</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2 py-1">
                <input
                  type="checkbox"
                  className="checkbox checkbox-xs"
                  checked={formData.preferences.blog_updates}
                  onChange={() => handlePreferenceChange('blog_updates')}
                />
                <span className="label-text text-xs">Blog updates</span>
              </label>
            </div>
          </div>
        </div>
        
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="btn btn-primary"
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  )
}