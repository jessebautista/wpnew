import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Users, 
  Piano as PianoIcon, 
  Calendar, 
  BookOpen, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  Flag,
  Mail,
  X
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { mockPianos, mockEvents, mockBlogPosts, mockUsers } from '../../data/mockData'
// import { ModerationService } from '../../services/moderationService'
import { NewsletterDashboard } from '../../components/admin/NewsletterDashboard'
import { SettingsDashboard } from '../../components/admin/SettingsDashboard'

interface DashboardStats {
  users: {
    total: number
    active: number
    newThisWeek: number
    banned: number
  }
  content: {
    pianos: { total: number; pending: number; approved: number; rejected: number }
    events: { total: number; pending: number; approved: number; rejected: number }
    blogPosts: { total: number; pending: number; approved: number; rejected: number }
  }
  moderation: {
    pendingItems: number
    flaggedItems: number
    autoApproved: number
    manualReviews: number
  }
  activity: {
    dailySignups: number
    dailySubmissions: number
    dailyModerations: number
  }
}

interface RecentActivity {
  id: string
  type: 'user_signup' | 'content_submit' | 'moderation_action' | 'report'
  title: string
  description: string
  timestamp: string
  status?: 'success' | 'warning' | 'error'
  userId?: string
  contentId?: string
}

export function AdminDashboardPage() {
  const { user } = useAuth()
  const { canAccessAdminPanel, canAdmin } = usePermissions()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'reports' | 'newsletter' | 'settings'>('overview')

  useEffect(() => {
    if (!canAccessAdminPanel()) return
    loadDashboardData()
  }, [canAccessAdminPanel])

  const loadDashboardData = async () => {
    try {
      // Mock dashboard stats
      const dashboardStats: DashboardStats = {
        users: {
          total: 1247,
          active: 892,
          newThisWeek: 23,
          banned: 5
        },
        content: {
          pianos: { total: mockPianos.length, pending: 3, approved: mockPianos.length - 5, rejected: 2 },
          events: { total: mockEvents.length, pending: 1, approved: mockEvents.length - 2, rejected: 1 },
          blogPosts: { total: mockBlogPosts.length, pending: 2, approved: mockBlogPosts.length - 3, rejected: 1 }
        },
        moderation: {
          pendingItems: 6,
          flaggedItems: 2,
          autoApproved: 15,
          manualReviews: 8
        },
        activity: {
          dailySignups: 12,
          dailySubmissions: 8,
          dailyModerations: 15
        }
      }

      // Mock recent activity
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'user_signup',
          title: 'New user registration',
          description: 'Sarah Johnson joined WorldPianos',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'success',
          userId: 'user123'
        },
        {
          id: '2',
          type: 'content_submit',
          title: 'Piano submission',
          description: 'Central Station Piano submitted for review',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: 'warning',
          contentId: 'piano456'
        },
        {
          id: '3',
          type: 'moderation_action',
          title: 'Content approved',
          description: 'London Bridge Piano approved by moderator',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'success',
          contentId: 'piano789'
        },
        {
          id: '4',
          type: 'report',
          title: 'Content reported',
          description: 'Piano listing flagged for inappropriate content',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: 'error',
          contentId: 'piano321'
        },
        {
          id: '5',
          type: 'content_submit',
          title: 'Event created',
          description: 'Jazz Piano Night event submitted',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          status: 'warning',
          contentId: 'event654'
        }
      ]

      setStats(dashboardStats)
      setRecentActivity(activities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!canAccessAdminPanel()) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-base-content/70">You don't have permission to access the admin dashboard.</p>
          <Link to="/" className="btn btn-primary mt-4">Go Home</Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="opacity-90">Manage WorldPianos platform and community</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm opacity-90">Welcome back,</div>
                <div className="font-semibold">{user?.full_name || 'Admin'}</div>
              </div>
              <Link to="/moderation" className="btn btn-outline btn-sm text-white border-white hover:bg-white hover:text-purple-600">
                <Shield className="w-4 h-4 mr-2" />
                Moderation Queue
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="tabs tabs-bordered mb-8">
          <button 
            className={`tab tab-lg ${selectedTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setSelectedTab('overview')}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Overview
          </button>
          <button 
            className={`tab tab-lg ${selectedTab === 'users' ? 'tab-active' : ''}`}
            onClick={() => setSelectedTab('users')}
          >
            <Users className="w-4 h-4 mr-2" />
            Users
          </button>
          <button 
            className={`tab tab-lg ${selectedTab === 'content' ? 'tab-active' : ''}`}
            onClick={() => setSelectedTab('content')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Content
          </button>
          <button 
            className={`tab tab-lg ${selectedTab === 'reports' ? 'tab-active' : ''}`}
            onClick={() => setSelectedTab('reports')}
          >
            <Flag className="w-4 h-4 mr-2" />
            Reports
          </button>
          <button 
            className={`tab tab-lg ${selectedTab === 'newsletter' ? 'tab-active' : ''}`}
            onClick={() => setSelectedTab('newsletter')}
          >
            <Mail className="w-4 h-4 mr-2" />
            Newsletter
          </button>
          <button 
            className={`tab tab-lg ${selectedTab === 'settings' ? 'tab-active' : ''}`}
            onClick={() => setSelectedTab('settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <OverviewTab stats={stats!} recentActivity={recentActivity} />
        )}
        {selectedTab === 'users' && (
          <UsersTab canAdmin={canAdmin()} />
        )}
        {selectedTab === 'content' && (
          <ContentTab />
        )}
        {selectedTab === 'reports' && (
          <ReportsTab />
        )}
        {selectedTab === 'newsletter' && (
          <NewsletterDashboard />
        )}
        {selectedTab === 'settings' && (
          <SettingsDashboard />
        )}
      </div>
    </div>
  )
}

interface OverviewTabProps {
  stats: DashboardStats
  recentActivity: RecentActivity[]
}

function OverviewTab({ stats, recentActivity }: OverviewTabProps) {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-primary">
            <Users className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{stats.users.total.toLocaleString()}</div>
          <div className="stat-desc">
            {stats.users.newThisWeek} new this week
          </div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-secondary">
            <PianoIcon className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Pianos</div>
          <div className="stat-value text-secondary">{stats.content.pianos.total}</div>
          <div className="stat-desc">
            {stats.content.pianos.pending} pending review
          </div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-accent">
            <Calendar className="w-8 h-8" />
          </div>
          <div className="stat-title">Total Events</div>
          <div className="stat-value text-accent">{stats.content.events.total}</div>
          <div className="stat-desc">
            {stats.content.events.pending} pending review
          </div>
        </div>

        <div className="stat bg-base-200 rounded-box">
          <div className="stat-figure text-warning">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="stat-title">Moderation Queue</div>
          <div className="stat-value text-warning">{stats.moderation.pendingItems}</div>
          <div className="stat-desc">
            {stats.moderation.flaggedItems} flagged items
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Content Overview */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Content Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <PianoIcon className="w-5 h-5 text-primary" />
                  <span className="font-medium">Pianos</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="badge badge-success">{stats.content.pianos.approved} approved</span>
                  <span className="badge badge-warning">{stats.content.pianos.pending} pending</span>
                  <span className="badge badge-error">{stats.content.pianos.rejected} rejected</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span className="font-medium">Events</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="badge badge-success">{stats.content.events.approved} approved</span>
                  <span className="badge badge-warning">{stats.content.events.pending} pending</span>
                  <span className="badge badge-error">{stats.content.events.rejected} rejected</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-base-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-accent" />
                  <span className="font-medium">Blog Posts</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="badge badge-success">{stats.content.blogPosts.approved} approved</span>
                  <span className="badge badge-warning">{stats.content.blogPosts.pending} pending</span>
                  <span className="badge badge-error">{stats.content.blogPosts.rejected} rejected</span>
                </div>
              </div>
            </div>
            
            <div className="card-actions justify-end">
              <Link to="/moderation" className="btn btn-primary btn-sm">
                Manage Content
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-base-200 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success text-success-content' :
                    activity.status === 'warning' ? 'bg-warning text-warning-content' :
                    activity.status === 'error' ? 'bg-error text-error-content' :
                    'bg-base-300 text-base-content'
                  }`}>
                    {activity.type === 'user_signup' && <Users className="w-4 h-4" />}
                    {activity.type === 'content_submit' && <BookOpen className="w-4 h-4" />}
                    {activity.type === 'moderation_action' && <CheckCircle className="w-4 h-4" />}
                    {activity.type === 'report' && <Flag className="w-4 h-4" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{activity.title}</div>
                    <div className="text-xs text-base-content/70">{activity.description}</div>
                    <div className="text-xs text-base-content/50 mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-actions justify-end">
              <button className="btn btn-outline btn-sm">View All Activity</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/moderation" className="btn btn-outline">
              <Shield className="w-4 h-4 mr-2" />
              Moderation Queue
            </Link>
            <Link to="/moderation/rules" className="btn btn-outline">
              <Settings className="w-4 h-4 mr-2" />
              Moderation Rules
            </Link>
            <button className="btn btn-outline">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </button>
            <button className="btn btn-outline">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface UsersTabProps {
  canAdmin: boolean
}

function UsersTab({ canAdmin }: UsersTabProps) {
  const [users] = useState(mockUsers.concat([
    {
      id: '3',
      email: 'moderator@worldpianos.org',
      full_name: 'Jane Moderator',
      username: 'janemod',
      avatar_url: null,
      bio: 'Community moderator',
      location: 'San Francisco, CA',
      role: 'moderator',
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      email: 'user1@example.com',
      full_name: 'Mike User',
      username: 'mikeuser',
      avatar_url: null,
      bio: 'Piano lover from Chicago',
      location: 'Chicago, IL',
      role: 'user',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ]))

  const handleUserAction = (userId: string, action: 'promote' | 'demote' | 'ban' | 'unban') => {
    console.log(`User action: ${action} for user ${userId}`)
    // In a real app, this would update the user in the database
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search users..."
            className="input input-bordered"
          />
          <select className="select select-bordered">
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Location</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-12">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt="Avatar" />
                        ) : (
                          <span>{user.full_name?.[0] || user.email[0]}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.full_name}</div>
                      <div className="text-sm opacity-50">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={`badge ${
                    user.role === 'admin' ? 'badge-error' :
                    user.role === 'moderator' ? 'badge-warning' :
                    'badge-ghost'
                  }`}>
                    {user.role}
                  </div>
                </td>
                <td>{user.location || 'Not specified'}</td>
                <td>{new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="badge badge-success">Active</div>
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-xs">
                      <Eye className="w-3 h-3" />
                    </button>
                    <button className="btn btn-ghost btn-xs">
                      <Edit className="w-3 h-3" />
                    </button>
                    {canAdmin && user.role !== 'admin' && (
                      <>
                        {user.role === 'user' && (
                          <button 
                            onClick={() => handleUserAction(user.id, 'promote')}
                            className="btn btn-ghost btn-xs text-success"
                          >
                            <UserCheck className="w-3 h-3" />
                          </button>
                        )}
                        {user.role === 'moderator' && (
                          <button 
                            onClick={() => handleUserAction(user.id, 'demote')}
                            className="btn btn-ghost btn-xs text-warning"
                          >
                            <UserX className="w-3 h-3" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleUserAction(user.id, 'ban')}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ContentTab() {
  const [contentType, setContentType] = useState<'pianos' | 'events' | 'blog_posts'>('pianos')
  const [searchQuery, setSearchQuery] = useState('')

  const getContent = () => {
    switch (contentType) {
      case 'pianos': return mockPianos
      case 'events': return mockEvents
      case 'blog_posts': return mockBlogPosts
      default: return []
    }
  }

  const content = getContent().filter(item => {
    const title = 'title' in item ? item.title : ''
    const name = 'name' in item ? item.name : ''
    const query = searchQuery.toLowerCase()
    return title?.toLowerCase().includes(query) || name?.toLowerCase().includes(query)
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search content..."
            className="input input-bordered"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="select select-bordered"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as any)}
          >
            <option value="pianos">Pianos</option>
            <option value="events">Events</option>
            <option value="blog_posts">Blog Posts</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((item: any) => (
          <div key={item.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">
                {item.name || item.title}
                {item.verified && (
                  <div className="badge badge-success badge-sm">Verified</div>
                )}
              </h3>
              
              <div className="text-sm text-base-content/70 space-y-1">
                {contentType === 'pianos' && (
                  <>
                    <div><strong>Category:</strong> {item.category}</div>
                    <div><strong>Condition:</strong> {item.condition}</div>
                    <div><strong>Location:</strong> {item.location_name}</div>
                  </>
                )}
                {contentType === 'events' && (
                  <>
                    <div><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</div>
                    <div><strong>Category:</strong> {item.category}</div>
                    <div><strong>Location:</strong> {item.location_name}</div>
                  </>
                )}
                {contentType === 'blog_posts' && (
                  <>
                    <div><strong>Category:</strong> {item.category}</div>
                    <div><strong>Published:</strong> {item.published ? 'Yes' : 'No'}</div>
                    <div><strong>Comments:</strong> {item.allow_comments ? 'Enabled' : 'Disabled'}</div>
                  </>
                )}
                <div><strong>Created:</strong> {new Date(item.created_at).toLocaleDateString()}</div>
              </div>

              <div className="card-actions justify-end">
                <Link 
                  to={`/${contentType === 'blog_posts' ? 'blog' : contentType}/${item.id}`}
                  className="btn btn-ghost btn-sm"
                >
                  <Eye className="w-4 h-4" />
                </Link>
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

      {content.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
          <h3 className="text-2xl font-bold mb-2">No Content Found</h3>
          <p className="text-base-content/70">
            {searchQuery ? 'Try adjusting your search terms.' : 'No content available.'}
          </p>
        </div>
      )}
    </div>
  )
}

function ReportsTab() {
  const mockReports = [
    {
      id: '1',
      type: 'piano',
      contentId: 'piano-123',
      contentTitle: 'Suspicious Piano Location',
      reason: 'Inappropriate content',
      reportedBy: 'user456',
      reporterName: 'John Smith',
      status: 'pending',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      description: 'This piano location seems to be promoting inappropriate activities.'
    },
    {
      id: '2',
      type: 'event',
      contentId: 'event-456',
      contentTitle: 'Spam Event Posting',
      reason: 'Spam',
      reportedBy: 'user789',
      reporterName: 'Sarah Johnson',
      status: 'resolved',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      description: 'This event appears to be spam advertising unrelated services.'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Flags</h2>
        <select className="select select-bordered">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      <div className="space-y-4">
        {mockReports.map((report) => (
          <div key={report.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="card-title">
                    {report.contentTitle}
                    <div className={`badge ${
                      report.status === 'pending' ? 'badge-warning' :
                      report.status === 'resolved' ? 'badge-success' :
                      'badge-ghost'
                    }`}>
                      {report.status}
                    </div>
                  </h3>
                  
                  <div className="text-sm text-base-content/70 mt-2 space-y-1">
                    <div><strong>Type:</strong> {report.type}</div>
                    <div><strong>Reason:</strong> {report.reason}</div>
                    <div><strong>Reported by:</strong> {report.reporterName}</div>
                    <div><strong>Date:</strong> {new Date(report.timestamp).toLocaleString()}</div>
                  </div>
                  
                  <p className="text-sm mt-3 p-3 bg-base-200 rounded">
                    {report.description}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Link 
                    to={`/${report.type}s/${report.contentId}`}
                    className="btn btn-outline btn-sm"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Content
                  </Link>
                  {report.status === 'pending' && (
                    <>
                      <button className="btn btn-success btn-sm">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Resolve
                      </button>
                      <button className="btn btn-error btn-sm">
                        <X className="w-4 h-4 mr-1" />
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockReports.length === 0 && (
        <div className="text-center py-12">
          <Flag className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
          <h3 className="text-2xl font-bold mb-2">No Reports</h3>
          <p className="text-base-content/70">All clear! No reports to review.</p>
        </div>
      )}
    </div>
  )
}