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
  X,
  Plus
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { AdminService, type AdminStats, type RecentActivity } from '../../services/adminService'
import { supabase } from '../../lib/supabase'
import { NewsletterDashboard } from '../../components/admin/NewsletterDashboard'
import { SettingsDashboard } from '../../components/admin/SettingsDashboard'


export function AdminDashboardPage() {
  const { user } = useAuth()
  const { canAccessAdminPanel, canAdmin } = usePermissions()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'reports' | 'newsletter' | 'settings'>('overview')

  useEffect(() => {
    if (!canAccessAdminPanel()) return
    loadDashboardData()
  }, [canAccessAdminPanel])

  const loadDashboardData = async () => {
    try {
      console.log('Loading admin dashboard data...')
      
      // Load real statistics from database
      const [dashboardStats, activities] = await Promise.all([
        AdminService.getDashboardStats(),
        AdminService.getRecentActivity(10)
      ])

      console.log('Dashboard stats loaded:', dashboardStats)
      console.log('Recent activity loaded:', activities)

      setStats(dashboardStats)
      setRecentActivity(activities)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      // Fallback to empty state on error
      setStats({
        users: { total: 0, active: 0, newThisWeek: 0, byRole: {} },
        content: {
          pianos: { total: 0, pending: 0, approved: 0, rejected: 0 },
          events: { total: 0, pending: 0, approved: 0, rejected: 0 },
          blogPosts: { total: 0, pending: 0, approved: 0, rejected: 0 }
        },
        moderation: { pendingItems: 0, flaggedItems: 0, totalReports: 0 },
        activity: { dailySignups: 0, dailySubmissions: 0, dailyComments: 0 }
      })
      setRecentActivity([])
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
  stats: AdminStats
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
            {stats.moderation.totalReports} total reports
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link to="/moderation" className="btn btn-outline">
              <Shield className="w-4 h-4 mr-2" />
              Moderation Queue
            </Link>
            <Link to="/moderation/rules" className="btn btn-outline">
              <Settings className="w-4 h-4 mr-2" />
              Moderation Rules
            </Link>
            <button 
              className="btn btn-outline"
              onClick={() => alert('Analytics dashboard coming soon!')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
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
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [currentPage, roleFilter, searchQuery])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const result = await AdminService.getUsers(currentPage, 20, roleFilter || undefined, searchQuery || undefined)
      setUsers(result.users)
      setTotalPages(result.totalPages)
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: 'promote' | 'demote' | 'ban' | 'unban') => {
    try {
      let newRole = ''
      switch (action) {
        case 'promote':
          newRole = 'moderator'
          break
        case 'demote':
          newRole = 'user'
          break
        default:
          console.log(`Action ${action} not implemented yet`)
          return
      }

      if (newRole) {
        await AdminService.updateUserRole(userId, newRole)
        loadUsers() // Refresh the list
      }
    } catch (error) {
      console.error(`Error performing ${action} on user ${userId}:`, error)
    }
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select 
            className="select select-bordered"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="moderator">Moderator</option>
            <option value="user">User</option>
            <option value="guest">Guest</option>
          </select>
          {canAdmin && (
            <button 
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
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
                    <div className="tooltip" data-tip="View user details">
                      <button className="btn btn-ghost btn-xs">
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="tooltip" data-tip="Edit user">
                      <button className="btn btn-ghost btn-xs">
                        <Edit className="w-3 h-3" />
                      </button>
                    </div>
                    {canAdmin && user.role !== 'admin' && (
                      <>
                        {user.role === 'user' && (
                          <div className="tooltip" data-tip="Promote to moderator">
                            <button 
                              onClick={() => handleUserAction(user.id, 'promote')}
                              className="btn btn-ghost btn-xs text-success"
                            >
                              <UserCheck className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        {user.role === 'moderator' && (
                          <div className="tooltip" data-tip="Demote to user">
                            <button 
                              onClick={() => handleUserAction(user.id, 'demote')}
                              className="btn btn-ghost btn-xs text-warning"
                            >
                              <UserX className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                        <div className="tooltip" data-tip="Ban user">
                          <button 
                            onClick={() => handleUserAction(user.id, 'ban')}
                            className="btn btn-ghost btn-xs text-error"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create User Modal */}
      <CreateUserModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onUserCreated={loadUsers}
      />
    </div>
  )
}

function ContentTab() {
  const [contentType, setContentType] = useState<'pianos' | 'events' | 'blog_posts'>('pianos')
  const [searchQuery, setSearchQuery] = useState('')
  const [content, setContent] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadContent()
  }, [contentType, searchQuery])

  const loadContent = async () => {
    try {
      setLoading(true)
      let query = supabase.from(contentType).select('*')

      if (searchQuery) {
        if (contentType === 'pianos') {
          query = query.ilike('name', `%${searchQuery}%`)
        } else {
          query = query.ilike('title', `%${searchQuery}%`)
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false }).limit(50)

      if (error) throw error

      setContent(data || [])
    } catch (error) {
      console.error('Error loading content:', error)
      setContent([])
    } finally {
      setLoading(false)
    }
  }

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

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item: any) => (
          <div key={item.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-lg">
                {item.name || item.title}
                <div className={`badge badge-sm ${
                  item.moderation_status === 'approved' ? 'badge-success' :
                  item.moderation_status === 'pending' ? 'badge-warning' :
                  item.moderation_status === 'rejected' ? 'badge-error' :
                  'badge-ghost'
                }`}>
                  {item.moderation_status || 'pending'}
                </div>
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
      )}

      {!loading && content.length === 0 && (
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
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')

  useEffect(() => {
    loadReports()
  }, [statusFilter])

  const loadReports = async () => {
    try {
      setLoading(true)
      const result = await AdminService.getReports(1, 50, statusFilter || undefined)
      setReports(result.reports)
    } catch (error) {
      console.error('Error loading reports:', error)
      setReports([])
    } finally {
      setLoading(false)
    }
  }

  const handleReportAction = async (reportId: string, action: 'resolved' | 'dismissed') => {
    try {
      if (!user?.id) {
        console.error('No user ID available for report action')
        return
      }
      
      await AdminService.updateReportStatus(reportId, action, user.id)
      loadReports() // Refresh the list
    } catch (error) {
      console.error(`Error ${action} report:`, error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Flags</h2>
        <select 
          className="select select-bordered"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="dismissed">Dismissed</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div key={report.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="card-title">
                      {report.content_type} Report
                      <div className={`badge ${
                        report.status === 'pending' ? 'badge-warning' :
                        report.status === 'resolved' ? 'badge-success' :
                        'badge-ghost'
                      }`}>
                        {report.status}
                      </div>
                    </h3>
                    
                    <div className="text-sm text-base-content/70 mt-2 space-y-1">
                      <div><strong>Type:</strong> {report.content_type}</div>
                      <div><strong>Reason:</strong> {report.reason}</div>
                      <div><strong>Content ID:</strong> {report.content_id}</div>
                      <div><strong>Date:</strong> {new Date(report.created_at).toLocaleString()}</div>
                    </div>
                    
                    {report.description && (
                      <p className="text-sm mt-3 p-3 bg-base-200 rounded">
                        {report.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Link 
                      to={`/${report.content_type}s/${report.content_id}`}
                      className="btn btn-outline btn-sm"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Content
                    </Link>
                    {report.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleReportAction(report.id, 'resolved')}
                          className="btn btn-success btn-sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </button>
                        <button 
                          onClick={() => handleReportAction(report.id, 'dismissed')}
                          className="btn btn-error btn-sm"
                        >
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
      )}

      {!loading && reports.length === 0 && (
        <div className="text-center py-12">
          <Flag className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
          <h3 className="text-2xl font-bold mb-2">No Reports</h3>
          <p className="text-base-content/70">All clear! No reports to review.</p>
        </div>
      )}
    </div>
  )
}

interface CreateUserModalProps {
  isOpen: boolean
  onClose: () => void
  onUserCreated: () => void
}

function CreateUserModal({ isOpen, onClose, onUserCreated }: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    role: 'user',
    location: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.full_name || !formData.password) {
      setError('Email, full name, and password are required')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    try {
      setLoading(true)
      setError('')

      await AdminService.createUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        role: formData.role,
        location: formData.location || undefined
      })

      // Reset form and close modal
      setFormData({
        email: '',
        password: '',
        full_name: '',
        role: 'user',
        location: ''
      })
      onClose()
      onUserCreated()
    } catch (error: any) {
      console.error('Error creating user:', error)
      if (error.code === '23505') {
        setError('A user with this email already exists.')
      } else {
        setError('Failed to create user. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({
      email: '',
      password: '',
      full_name: '',
      role: 'user',
      location: ''
    })
    setError('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add New User</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email *</span>
            </label>
            <input
              type="email"
              className="input input-bordered"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="user@example.com"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password *</span>
            </label>
            <input
              type="password"
              className="input input-bordered"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Minimum 6 characters"
              required
              minLength={6}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Full Name *</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.full_name}
              onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select 
              className="select select-bordered"
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
            >
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Location (optional)</span>
            </label>
            <input
              type="text"
              className="input input-bordered"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="City, Country"
            />
          </div>

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}