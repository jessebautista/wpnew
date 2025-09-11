import { useState, useEffect } from 'react'
import { 
  Mail, 
  Users, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Search,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap
} from 'lucide-react'
import { NewsletterService } from '../../services/newsletterService'
import { EditSubscriberModal } from './EditSubscriberModal'
import { useLanguage } from '../../contexts/LanguageContext'
import type { 
  NewsletterSubscriber
} from '../../services/newsletterService'

interface NewsletterDashboardProps {
  onClose?: () => void
}

export function NewsletterDashboard({ onClose }: NewsletterDashboardProps) {
  const { t } = useLanguage()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Mail className="w-7 h-7 text-primary" />
            {t('admin.newsletter')}
          </h2>
          <p className="text-base-content/70">{t('admin.manageSubscribers')}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost btn-sm">
            ✕
          </button>
        )}
      </div>

      {/* Resend Integration Status */}
      <ResendStatusCard />

      {/* Subscribers Content - No tabs needed for now */}
      <SubscribersTab />
    </div>
  )
}

function SubscribersTab() {
  const { t } = useLanguage()
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed' | 'bounced'>('all')
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    loadSubscribers()
  }, [])

  const loadSubscribers = async () => {
    try {
      setLoading(true)
      const data = await NewsletterService.getSubscribers({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined
      })
      setSubscribers(data)
    } catch (error) {
      console.error('Error loading subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      loadSubscribers()
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, statusFilter])

  const handleEditSubscriber = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber)
    setIsEditModalOpen(true)
  }

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscriber?')) return

    try {
      await NewsletterService.deleteSubscriber(id)
      await loadSubscribers()
    } catch (error) {
      console.error('Error deleting subscriber:', error)
    }
  }

  const handleExport = async () => {
    try {
      const data = await NewsletterService.exportSubscribers()
      const blob = new Blob([data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting subscribers:', error)
    }
  }

  const handleModalSave = async () => {
    setIsEditModalOpen(false)
    setSelectedSubscriber(null)
    await loadSubscribers()
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'badge-success'
      case 'unsubscribed': return 'badge-warning'
      case 'bounced': return 'badge-error'
      default: return 'badge-neutral'
    }
  }

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = searchQuery === '' || 
      subscriber.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscriber.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subscriber.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="form-control w-full max-w-xs">
            <label className="input input-bordered flex items-center gap-2">
              <Search className="w-4 h-4 opacity-70" />
              <input
                type="text"
                placeholder={t('admin.searchSubscribers')}
                className="grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>
          <div className="form-control w-full max-w-xs">
            <select
              className="select select-bordered w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">{t('admin.allStatus')}</option>
              <option value="active">{t('admin.active')}</option>
              <option value="unsubscribed">{t('admin.unsubscribed')}</option>
              <option value="bounced">{t('admin.bounced')}</option>
            </select>
          </div>
        </div>
        <button onClick={handleExport} className="btn btn-outline">
          <Download className="w-4 h-4 mr-2" />
          {t('admin.exportCsv')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">{t('admin.totalSubscribers')}</div>
          <div className="stat-value text-primary">{subscribers.length}</div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">{t('admin.activeSubscribers')}</div>
          <div className="stat-value text-success">
            {subscribers.filter(s => s.status === 'active').length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">{t('admin.unsubscribedSubscribers')}</div>
          <div className="stat-value text-warning">
            {subscribers.filter(s => s.status === 'unsubscribed').length}
          </div>
        </div>
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-title">{t('admin.bouncedSubscribers')}</div>
          <div className="stat-value text-error">
            {subscribers.filter(s => s.status === 'bounced').length}
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>{t('admin.email')}</th>
                <th>{t('admin.name')}</th>
                <th>{t('admin.status')}</th>
                <th>{t('admin.source')}</th>
                <th>{t('admin.subscribed')}</th>
                <th>{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="font-medium">{subscriber.email}</div>
                    </div>
                  </td>
                  <td>
                    {subscriber.first_name || subscriber.last_name ? 
                      `${subscriber.first_name || ''} ${subscriber.last_name || ''}`.trim() : 
                      <span className="text-base-content/50">-</span>
                    }
                  </td>
                  <td>
                    <div className={`badge ${getStatusBadgeClass(subscriber.status)}`}>
                      {subscriber.status}
                    </div>
                  </td>
                  <td>{subscriber.source || '-'}</td>
                  <td>{new Date(subscriber.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleEditSubscriber(subscriber)}
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="btn btn-ghost btn-sm text-error"
                        onClick={() => handleDeleteSubscriber(subscriber.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSubscribers.length === 0 && !loading && (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
              <p className="text-base-content/60">{t('admin.noSubscribers')}</p>
            </div>
          )}
        </div>
      )}

      {/* Edit Subscriber Modal */}
      <EditSubscriberModal
        isOpen={isEditModalOpen}
        subscriber={selectedSubscriber}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedSubscriber(null)
        }}
        onSave={handleModalSave}
      />
    </div>
  )
}

function ResendStatusCard() {
  const [status, setStatus] = useState<{ configured: boolean; apiKeyPresent: boolean; message: string } | null>(null)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

  useEffect(() => {
    // Get Resend service status
    const serviceStatus = NewsletterService.getEmailServiceStatus()
    setStatus(serviceStatus)
  }, [])

  const handleTestConnection = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      const result = await NewsletterService.testEmailIntegration()
      setTestResult(result)
    } catch (error: any) {
      setTestResult({
        success: false,
        message: `Test failed: ${error.message}`
      })
    } finally {
      setTesting(false)
    }
  }

  if (!status) return null

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h3 className="card-title flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          Resend Email Integration
        </h3>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            {status.configured ? (
              <CheckCircle className="w-5 h-5 text-success" />
            ) : (
              <XCircle className="w-5 h-5 text-error" />
            )}
            <span className={status.configured ? 'text-success' : 'text-error'}>
              {status.configured ? 'Connected' : 'Not Connected'}
            </span>
          </div>
          
          <div className="divider divider-horizontal"></div>
          
          <div className="flex items-center gap-2">
            {status.apiKeyPresent ? (
              <CheckCircle className="w-4 h-4 text-success" />
            ) : (
              <XCircle className="w-4 h-4 text-warning" />
            )}
            <span className="text-sm">
              API Key {status.apiKeyPresent ? 'Present' : 'Missing'}
            </span>
          </div>
        </div>

        <p className="text-sm text-base-content/70 mb-4">
          {status.message}
        </p>

        {!status.configured && (
          <div className="alert alert-warning mb-4">
            <AlertTriangle className="w-4 h-4" />
            <div>
              <h4 className="font-semibold">Setup Required</h4>
              <p className="text-sm">
                Add <code>VITE_RESEND_API_KEY</code> to your .env file to enable email sending.
                <br />
                Get your API key from <a href="https://resend.com" target="_blank" rel="noopener noreferrer" className="link link-primary">resend.com</a>
              </p>
            </div>
          </div>
        )}

        <div className="card-actions justify-between">
          <div className="flex gap-2">
            <button 
              className={`btn btn-sm ${testing ? 'loading' : ''}`}
              onClick={handleTestConnection}
              disabled={testing}
            >
              {!testing && <Zap className="w-4 h-4 mr-1" />}
              Test Connection
            </button>
          </div>

          {testResult && (
            <div className={`alert alert-sm ${testResult.success ? 'alert-success' : 'alert-error'}`}>
              <span className="text-sm">{testResult.message}</span>
            </div>
          )}
        </div>

        {status.configured && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="stat bg-base-200 rounded-lg p-3">
              <div className="stat-title text-xs">Email Features</div>
              <div className="stat-value text-sm">✅ Active</div>
              <div className="stat-desc">Welcome emails, alerts</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-3">
              <div className="stat-title text-xs">Campaign Sending</div>
              <div className="stat-value text-sm">✅ Ready</div>
              <div className="stat-desc">Bulk newsletters</div>
            </div>
            <div className="stat bg-base-200 rounded-lg p-3">
              <div className="stat-title text-xs">Auto Batching</div>
              <div className="stat-value text-sm">✅ Enabled</div>
              <div className="stat-desc">Rate limit protection</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}