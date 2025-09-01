import { useState, useEffect } from 'react'
import { 
  Mail, 
  Users, 
  Send, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Play,
  Pause,
  BarChart3,
  Download,
  Search,
  AlertTriangle,
  Check,
  X
} from 'lucide-react'
import { NewsletterService } from '../../services/newsletterService'
import { EditSubscriberModal } from './EditSubscriberModal'
import type { 
  NewsletterSubscriber, 
  NewsletterTemplate, 
  NewsletterCampaign, 
  NewsletterStats 
} from '../../services/newsletterService'

interface NewsletterDashboardProps {
  onClose?: () => void
}

type DashboardTab = 'overview' | 'subscribers' | 'campaigns' | 'templates'

export function NewsletterDashboard({ onClose }: NewsletterDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [stats, setStats] = useState<NewsletterStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const statsData = await NewsletterService.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading newsletter dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading || !stats) {
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
            <Mail className="w-7 h-7 text-primary" />
            Newsletter Management
          </h2>
          <p className="text-base-content/70">Manage subscribers, campaigns, and email templates</p>
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
          className={`tab tab-lg ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          Overview
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'subscribers' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('subscribers')}
        >
          <Users className="w-4 h-4 mr-2" />
          Subscribers
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'campaigns' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          <Send className="w-4 h-4 mr-2" />
          Campaigns
        </button>
        <button 
          className={`tab tab-lg ${activeTab === 'templates' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          <Edit className="w-4 h-4 mr-2" />
          Templates
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab stats={stats} />}
      {activeTab === 'subscribers' && <SubscribersTab />}
      {activeTab === 'campaigns' && <CampaignsTab />}
      {activeTab === 'templates' && <TemplatesTab />}
    </div>
  )
}

function OverviewTab({ stats }: { stats: NewsletterStats }) {
  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Active Subscribers</div>
          <div className="stat-value text-primary">{stats.active_subscribers.toLocaleString()}</div>
          <div className="stat-desc">
            {stats.recent_growth >= 0 ? '+' : ''}{stats.recent_growth.toFixed(1)}% from last week
          </div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-secondary">
            <Send className="w-8 h-8" />
          </div>
          <div className="stat-title">Campaigns Sent</div>
          <div className="stat-value text-secondary">{stats.campaigns_sent}</div>
          <div className="stat-desc">This month</div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-accent">
            <Eye className="w-8 h-8" />
          </div>
          <div className="stat-title">Avg Open Rate</div>
          <div className="stat-value text-accent">{stats.average_open_rate.toFixed(1)}%</div>
          <div className="stat-desc">Industry avg: 21.3%</div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-warning">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div className="stat-title">Click Rate</div>
          <div className="stat-value text-warning">{stats.average_click_rate.toFixed(1)}%</div>
          <div className="stat-desc">Industry avg: 2.6%</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Weekly Subscriber Growth</h3>
            <div className="h-64">
              <div className="flex items-end justify-between h-48 mt-4">
                {stats.weekly_signups.map((count, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div 
                      className="bg-primary rounded-t min-h-[4px] w-8 mb-2"
                      style={{ 
                        height: `${Math.max((count / Math.max(...stats.weekly_signups)) * 180, 4)}px` 
                      }}
                    />
                    <span className="text-xs text-base-content/60">W{index + 1}</span>
                    <span className="text-xs font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Subscriber Status */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h3 className="card-title">Subscriber Status</h3>
            <div className="space-y-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-success rounded"></div>
                  <span>Active</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{stats.active_subscribers}</div>
                  <div className="text-sm text-base-content/60">
                    {((stats.active_subscribers / stats.total_subscribers) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-warning rounded"></div>
                  <span>Unsubscribed</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{stats.unsubscribed_count}</div>
                  <div className="text-sm text-base-content/60">
                    {((stats.unsubscribed_count / stats.total_subscribers) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-error rounded"></div>
                  <span>Bounced</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{stats.bounced_count}</div>
                  <div className="text-sm text-base-content/60">
                    {((stats.bounced_count / stats.total_subscribers) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h3 className="card-title">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded">
              <Users className="w-5 h-5 text-success" />
              <div className="flex-1">
                <div className="font-medium">3 new subscribers</div>
                <div className="text-sm text-base-content/60">2 hours ago</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded">
              <Send className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="font-medium">Weekly digest sent</div>
                <div className="text-sm text-base-content/60">1 day ago</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'unsubscribed' | 'bounced'>('all')
  const [selectedSubscriber, setSelectedSubscriber] = useState<NewsletterSubscriber | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    loadSubscribers()
  }, [statusFilter, searchQuery])

  const loadSubscribers = async () => {
    try {
      setLoading(true)
      const filters: any = {}
      if (statusFilter !== 'all') filters.status = statusFilter
      if (searchQuery) filters.search = searchQuery
      
      const data = await NewsletterService.getSubscribers(filters)
      setSubscribers(data)
    } catch (error) {
      console.error('Error loading subscribers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClick = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber)
    setShowDeleteModal(true)
  }

  const handleEditClick = (subscriber: NewsletterSubscriber) => {
    setSelectedSubscriber(subscriber)
    setShowEditModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedSubscriber) return

    try {
      setDeleting(true)
      const success = await NewsletterService.deleteSubscriber(selectedSubscriber.id)
      if (success) {
        await loadSubscribers()
        setShowDeleteModal(false)
        setSelectedSubscriber(null)
      } else {
        alert('Failed to delete subscriber')
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error)
      alert('Failed to delete subscriber')
    } finally {
      setDeleting(false)
    }
  }

  const exportSubscribers = () => {
    // Create CSV content
    const headers = ['Email', 'First Name', 'Last Name', 'Status', 'Source', 'Subscribed At', 'Preferences']
    const csvContent = [
      headers.join(','),
      ...subscribers.map(sub => [
        sub.email,
        sub.first_name || '',
        sub.last_name || '',
        sub.status,
        sub.source,
        new Date(sub.subscribed_at).toLocaleDateString(),
        Object.entries(sub.preferences)
          .filter(([_, enabled]) => enabled)
          .map(([key, _]) => key)
          .join(';')
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
            <input
              type="text"
              placeholder="Search subscribers..."
              className="input input-bordered pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button 
            className="btn btn-outline"
            onClick={exportSubscribers}
            disabled={subscribers.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Subscriber
          </button>
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
                <th>Subscriber</th>
                <th>Status</th>
                <th>Source</th>
                <th>Subscribed</th>
                <th>Preferences</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((subscriber) => (
                <tr key={subscriber.id}>
                  <td>
                    <div>
                      <div className="font-medium">
                        {subscriber.first_name} {subscriber.last_name}
                      </div>
                      <div className="text-sm text-base-content/60">
                        {subscriber.email}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${
                      subscriber.status === 'active' ? 'badge-success' :
                      subscriber.status === 'unsubscribed' ? 'badge-warning' :
                      'badge-error'
                    }`}>
                      {subscriber.status}
                    </div>
                  </td>
                  <td>{subscriber.source}</td>
                  <td>
                    {new Date(subscriber.subscribed_at).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {subscriber.preferences.weekly_digest && <div className="badge badge-xs">Digest</div>}
                      {subscriber.preferences.event_notifications && <div className="badge badge-xs">Events</div>}
                      {subscriber.preferences.new_piano_alerts && <div className="badge badge-xs">Pianos</div>}
                      {subscriber.preferences.blog_updates && <div className="badge badge-xs">Blog</div>}
                    </div>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button 
                        className="btn btn-ghost btn-xs"
                        title="View subscriber details"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                      <button 
                        className="btn btn-ghost btn-xs"
                        onClick={() => handleEditClick(subscriber)}
                        title="Edit subscriber"
                      >
                        <Edit className="w-3 h-3" />
                      </button>
                      <button 
                        className="btn btn-ghost btn-xs text-error"
                        onClick={() => handleDeleteClick(subscriber)}
                        title="Delete subscriber"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedSubscriber && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-warning mr-3" />
              <span>Are you sure you want to delete this subscriber?</span>
            </div>
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <p className="font-semibold">{selectedSubscriber.email}</p>
              <p className="text-sm text-base-content/70 mt-1">
                {selectedSubscriber.first_name} {selectedSubscriber.last_name}
              </p>
              <p className="text-sm text-error mt-2">
                ⚠️ This action cannot be undone.
              </p>
            </div>
            <div className="modal-action">
              <button 
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedSubscriber(null)
                }}
                className="btn btn-ghost"
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn btn-error"
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => !deleting && setShowDeleteModal(false)}></div>
        </div>
      )}

      {/* Edit Subscriber Modal */}
      {showEditModal && selectedSubscriber && (
        <EditSubscriberModal 
          subscriber={selectedSubscriber}
          onClose={() => {
            setShowEditModal(false)
            setSelectedSubscriber(null)
          }}
          onSave={async () => {
            await loadSubscribers()
            setShowEditModal(false)
            setSelectedSubscriber(null)
          }}
        />
      )}
    </div>
  )
}

function CampaignsTab() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Send className="w-16 h-16 mx-auto text-primary opacity-50" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-base-content">Email Campaigns</h2>
        <p className="text-base-content/70 mb-6 leading-relaxed">
          Campaign management features are coming soon. This will include:
        </p>
        <ul className="text-left text-base-content/60 space-y-2 mb-8">
          <li className="flex items-center">
            <Send className="w-4 h-4 mr-2 text-primary" />
            Create and schedule email campaigns
          </li>
          <li className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-primary" />
            Segment subscribers for targeted messaging
          </li>
          <li className="flex items-center">
            <BarChart3 className="w-4 h-4 mr-2 text-primary" />
            Track open rates and click analytics
          </li>
          <li className="flex items-center">
            <Edit className="w-4 h-4 mr-2 text-primary" />
            A/B test different email content
          </li>
        </ul>
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-base-content">Coming Soon</h3>
          <p className="text-sm text-base-content/60">
            We're building comprehensive campaign management tools. 
            Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  )
}

function TemplatesTab() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <Edit className="w-16 h-16 mx-auto text-primary opacity-50" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-base-content">Email Templates</h2>
        <p className="text-base-content/70 mb-6 leading-relaxed">
          Template management features are coming soon. This will include:
        </p>
        <ul className="text-left text-base-content/60 space-y-2 mb-8">
          <li className="flex items-center">
            <Edit className="w-4 h-4 mr-2 text-primary" />
            Create reusable email templates
          </li>
          <li className="flex items-center">
            <Mail className="w-4 h-4 mr-2 text-primary" />
            Pre-designed newsletter layouts
          </li>
          <li className="flex items-center">
            <Plus className="w-4 h-4 mr-2 text-primary" />
            Custom template builder
          </li>
          <li className="flex items-center">
            <Eye className="w-4 h-4 mr-2 text-primary" />
            Preview and test templates
          </li>
        </ul>
        <div className="bg-base-200 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 text-base-content">Coming Soon</h3>
          <p className="text-sm text-base-content/60">
            We're developing a powerful template system for beautiful newsletters. 
            Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  )
}