import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  ChevronLeft,
  Check,
  Clock,
  Flag,
  Ban
} from 'lucide-react'
import { usePermissions } from '../../hooks/usePermissions'
import { ModerationService, type ModerationRule, type ModerationCondition } from '../../services/moderationService'

export function ModerationRulesPage() {
  const { canAdmin } = usePermissions()
  const [rules, setRules] = useState<ModerationRule[]>([])
  const [editingRule, setEditingRule] = useState<ModerationRule | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    if (!canAdmin()) return
    loadRules()
    loadStats()
  }, [canAdmin])

  const loadRules = () => {
    const moderationRules = ModerationService.getModerationRules()
    setRules(moderationRules)
  }

  const loadStats = () => {
    const moderationStats = ModerationService.getModerationStats()
    setStats(moderationStats)
  }

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    ModerationService.updateModerationRule(ruleId, { enabled })
    loadRules()
  }

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      ModerationService.deleteModerationRule(ruleId)
      loadRules()
    }
  }

  const handleSaveRule = (rule: Omit<ModerationRule, 'id'>) => {
    if (editingRule) {
      ModerationService.updateModerationRule(editingRule.id, rule)
    } else {
      ModerationService.addModerationRule(rule)
    }
    setEditingRule(null)
    setShowAddForm(false)
    loadRules()
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'auto_approve':
      case 'approve':
        return <Check className="w-4 h-4 text-success" />
      case 'reject':
        return <Ban className="w-4 h-4 text-error" />
      case 'flag':
        return <Flag className="w-4 h-4 text-warning" />
      default:
        return <Clock className="w-4 h-4 text-base-content/50" />
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'auto_approve': return 'Auto Approve'
      case 'approve': return 'Approve'
      case 'reject': return 'Reject'
      case 'flag': return 'Flag for Review'
      default: return action
    }
  }

  if (!canAdmin()) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-base-content/70">You don't have permission to manage moderation rules.</p>
          <Link to="/" className="btn btn-primary mt-4">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white py-8">
        <div className="container mx-auto px-4">
          <Link to="/moderation" className="btn btn-ghost btn-sm mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Moderation
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Moderation Rules</h1>
              <p className="opacity-90">Configure automated moderation and approval workflows</p>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{stats.autoApproved}</div>
                <div className="text-sm opacity-90">Auto Approved</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{stats.flagged}</div>
                <div className="text-sm opacity-90">Flagged</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{stats.approved}</div>
                <div className="text-sm opacity-90">Manual Approved</div>
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <div className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</div>
                <div className="text-sm opacity-90">Active Rules</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Add Rule Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Moderation Rules</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </button>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {rules.map((rule) => (
            <div key={rule.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{rule.name}</h3>
                      <div className="flex items-center gap-2">
                        {getActionIcon(rule.action)}
                        <span className="text-sm font-medium">{getActionLabel(rule.action)}</span>
                      </div>
                      <div className="badge badge-outline">Priority {rule.priority}</div>
                      <div className={`badge ${rule.contentType === 'all' ? 'badge-neutral' : 'badge-secondary'}`}>
                        {rule.contentType === 'all' ? 'All Content' : rule.contentType}
                      </div>
                    </div>
                    
                    <p className="text-base-content/70 mb-3">{rule.description}</p>
                    
                    {/* Conditions */}
                    <div className="bg-base-200 rounded-lg p-3">
                      <h4 className="font-medium text-sm mb-2">Conditions:</h4>
                      <div className="space-y-1">
                        {rule.conditions.map((condition, index) => (
                          <div key={index} className="text-xs font-mono bg-base-300 rounded px-2 py-1">
                            {condition.field} {condition.operator} {JSON.stringify(condition.value)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="toggle toggle-success"
                      checked={rule.enabled}
                      onChange={(e) => handleToggleRule(rule.id, e.target.checked)}
                    />
                    <button
                      onClick={() => setEditingRule(rule)}
                      className="btn btn-ghost btn-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="btn btn-ghost btn-sm text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {rules.length === 0 && (
            <div className="text-center py-12">
              <Settings className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
              <h3 className="text-2xl font-bold mb-2">No Rules Configured</h3>
              <p className="text-base-content/70 mb-4">
                Add moderation rules to automate content approval and flagging.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Rule
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Rule Modal */}
      {(showAddForm || editingRule) && (
        <RuleFormModal
          rule={editingRule}
          onSave={handleSaveRule}
          onCancel={() => {
            setShowAddForm(false)
            setEditingRule(null)
          }}
        />
      )}
    </div>
  )
}

interface RuleFormModalProps {
  rule?: ModerationRule | null
  onSave: (rule: Omit<ModerationRule, 'id'>) => void
  onCancel: () => void
}

function RuleFormModal({ rule, onSave, onCancel }: RuleFormModalProps) {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    description: rule?.description || '',
    contentType: rule?.contentType || 'all',
    action: rule?.action || 'flag',
    priority: rule?.priority || 5,
    enabled: rule?.enabled ?? true,
    conditions: rule?.conditions || [{ field: '', operator: 'exists', value: null }]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleConditionChange = (index: number, field: keyof ModerationCondition, value: any) => {
    const newConditions = [...formData.conditions]
    newConditions[index] = { ...newConditions[index], [field]: value }
    setFormData({ ...formData, conditions: newConditions })
  }

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { field: '', operator: 'exists', value: null }]
    })
  }

  const removeCondition = (index: number) => {
    if (formData.conditions.length > 1) {
      const newConditions = formData.conditions.filter((_, i) => i !== index)
      setFormData({ ...formData, conditions: newConditions })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Rule name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.conditions.some(c => !c.field)) {
      newErrors.conditions = 'All conditions must have a field specified'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave(formData)
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">
          {rule ? 'Edit Rule' : 'Add New Rule'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Rule Name</span>
            </label>
            <input
              type="text"
              className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Auto-approve trusted users"
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.name}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Description</span>
            </label>
            <textarea
              className={`textarea textarea-bordered ${errors.description ? 'textarea-error' : ''}`}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this rule does..."
            />
            {errors.description && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.description}</span>
              </label>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Content Type</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.contentType}
                onChange={(e) => setFormData({ ...formData, contentType: e.target.value as any })}
              >
                <option value="all">All Content</option>
                <option value="piano">Pianos</option>
                <option value="event">Events</option>
                <option value="blog_post">Blog Posts</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Action</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.action}
                onChange={(e) => setFormData({ ...formData, action: e.target.value as any })}
              >
                <option value="auto_approve">Auto Approve</option>
                <option value="approve">Approve</option>
                <option value="flag">Flag for Review</option>
                <option value="reject">Reject</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Priority (1-10)</span>
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="input input-bordered"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Enabled</span>
              </label>
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
            </div>
          </div>

          {/* Conditions */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Conditions</span>
            </label>
            <div className="space-y-2">
              {formData.conditions.map((condition, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    className="input input-bordered input-sm flex-1"
                    placeholder="Field (e.g. name, author.reputation)"
                    value={condition.field}
                    onChange={(e) => handleConditionChange(index, 'field', e.target.value)}
                  />
                  <select
                    className="select select-bordered select-sm"
                    value={condition.operator}
                    onChange={(e) => handleConditionChange(index, 'operator', e.target.value)}
                  >
                    <option value="exists">exists</option>
                    <option value="not_exists">not exists</option>
                    <option value="equals">equals</option>
                    <option value="contains">contains</option>
                    <option value="greater_than">greater than</option>
                    <option value="less_than">less than</option>
                  </select>
                  <input
                    type="text"
                    className="input input-bordered input-sm"
                    placeholder="Value"
                    value={condition.value || ''}
                    onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeCondition(index)}
                    className="btn btn-ghost btn-sm btn-square"
                    disabled={formData.conditions.length === 1}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addCondition}
              className="btn btn-outline btn-sm mt-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Condition
            </button>
            {errors.conditions && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.conditions}</span>
              </label>
            )}
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button type="button" onClick={onCancel} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Save className="w-4 h-4 mr-2" />
              {rule ? 'Update Rule' : 'Create Rule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}