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
  Settings,
  Download,
  Search,
  Filter,
  Calendar,
  Target
} from 'lucide-react'
import { NewsletterService } from '../../services/newsletterService'
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
          <button className="btn btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Export
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
                      <button className="btn btn-ghost btn-xs">
                        <Eye className="w-3 h-3" />
                      </button>
                      <button className="btn btn-ghost btn-xs">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="btn btn-ghost btn-xs text-error">
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
    </div>
  )
}

function CampaignsTab() {
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      setLoading(true)
      const data = await NewsletterService.getCampaigns()
      setCampaigns(data)
    } catch (error) {
      console.error('Error loading campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: NewsletterCampaign['status']) => {
    const variants = {
      draft: 'badge-ghost',
      scheduled: 'badge-info',
      sending: 'badge-warning',
      sent: 'badge-success',
      cancelled: 'badge-error'
    }
    return `badge ${variants[status]}`
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Email Campaigns</h3>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Campaign
        </button>
      </div>

      {/* Campaigns List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid gap-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="card-title">{campaign.name}</h4>
                    <p className="text-base-content/70 mb-3">{campaign.subject}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className={getStatusBadge(campaign.status)}>
                        {campaign.status}
                      </div>
                      <span>Recipients: {campaign.recipient_count}</span>
                      {campaign.sent_at && (
                        <span>Sent: {new Date(campaign.sent_at).toLocaleDateString()}</span>
                      )}
                    </div>

                    {campaign.status === 'sent' && (
                      <div className="stats stats-horizontal mt-4">
                        <div className="stat py-2 px-4">
                          <div className="stat-title text-xs">Delivered</div>
                          <div className="stat-value text-sm">{campaign.sent_count}</div>
                        </div>
                        <div className="stat py-2 px-4">
                          <div className="stat-title text-xs">Opened</div>
                          <div className="stat-value text-sm">{campaign.opened_count}</div>
                          <div className="stat-desc text-xs">
                            {((campaign.opened_count / campaign.sent_count) * 100).toFixed(1)}%
                          </div>
                        </div>
                        <div className="stat py-2 px-4">
                          <div className="stat-title text-xs">Clicked</div>
                          <div className="stat-value text-sm">{campaign.clicked_count}</div>
                          <div className="stat-desc text-xs">
                            {((campaign.clicked_count / campaign.opened_count) * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm">
                      <Eye className="w-4 h-4" />
                    </button>
                    {campaign.status === 'draft' && (
                      <>
                        <button className="btn btn-ghost btn-sm">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="btn btn-primary btn-sm">
                          <Play className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {campaign.status === 'scheduled' && (
                      <button className="btn btn-ghost btn-sm">
                        <Pause className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TemplatesTab() {
  const [templates, setTemplates] = useState<NewsletterTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      const data = await NewsletterService.getTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Error loading templates:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Email Templates</h3>
        <button className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </button>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h4 className="card-title text-lg">{template.name}</h4>
                <p className="text-base-content/70 text-sm mb-3">{template.subject}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="badge badge-outline">{template.template_type}</div>
                </div>

                <div className="text-xs text-base-content/60 mb-4">
                  Created: {new Date(template.created_at).toLocaleDateString()}
                  <br />
                  Updated: {new Date(template.updated_at).toLocaleDateString()}
                </div>

                <div className="card-actions justify-end">
                  <button className="btn btn-ghost btn-sm">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn btn-ghost btn-sm text-error">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}