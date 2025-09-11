import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Users, 
  Piano as PianoIcon, 
  Calendar, 
  BookOpen, 
 
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
  Plus,
  Save,
  MapPin,
  Check
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { AdminService, type AdminStats, type RecentActivity } from '../../services/adminService'
import { GeocodingService } from '../../services/geocodingService'
import { supabase } from '../../lib/supabase'
import { NewsletterDashboard } from '../../components/admin/NewsletterDashboard'
import { SocialSharingStats } from '../../components/admin/SocialSharingStats'
import { testNewsletterIntegration } from '../../utils/testNewsletterIntegration'
// TODO: Settings Dashboard Implementation
// The settings functionality is temporarily disabled pending full implementation.
// To re-enable:
// 1. Uncomment the import below and settings tab button/content
// 2. Complete SettingsService implementation for system configuration
// 3. Implement proper permission checks for settings modifications  
// 4. Connect AI enhancement services and analytics
// 5. Test all settings functionality thoroughly
// Components ready for use:
// - SettingsDashboard: Main settings interface with AI enhancements and analytics
// - SettingsService: Service layer for settings management (needs completion)
// - AIEnhancementService: AI-powered content enhancement features
// import { SettingsDashboard } from '../../components/admin/SettingsDashboard'


export function AdminDashboardPage() {
  const { user } = useAuth()
  const { canAccessAdminPanel, canAdmin } = usePermissions()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'content' | 'reports' | 'newsletter' | 'settings'>('overview')
  const [hasAccess, setHasAccess] = useState(false)

  // Make test function available in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as any).testNewsletterIntegration = testNewsletterIntegration
    }
  }, [])

  const loadDashboardData = useCallback(async () => {
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
  }, []) // Empty dependency array since this function doesn't depend on any props or state

  // Check access once and store in state to prevent infinite loops
  useEffect(() => {
    const access = canAccessAdminPanel()
    setHasAccess(access)
  }, [canAccessAdminPanel])

  // Load data only when access is confirmed
  useEffect(() => {
    if (!hasAccess) return
    loadDashboardData()
  }, [hasAccess, loadDashboardData])

  if (!hasAccess) {
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
          {/* TODO: Re-enable settings tab once SettingsDashboard is fully implemented */}
          {/* <button 
            className={`tab tab-lg ${selectedTab === 'settings' ? 'tab-active' : ''}`}
            onClick={() => setSelectedTab('settings')}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button> */}
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
        {/* TODO: Re-enable settings tab content once SettingsDashboard is fully implemented */}
        {/* {selectedTab === 'settings' && (
          <SettingsDashboard />
        )} */}
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
            <Link to="/admin/blog" className="btn btn-outline">
              <BookOpen className="w-4 h-4 mr-2" />
              Blog Management
            </Link>
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
  const [currentPage] = useState(1)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [currentPage, roleFilter, searchQuery])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const result = await AdminService.getUsers(currentPage, 20, roleFilter || undefined, searchQuery || undefined)
      setUsers(result.users)
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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedContent, setSelectedContent] = useState<any>(null)

  useEffect(() => {
    loadContent()
  }, [contentType, searchQuery])

  const loadContent = async () => {
    try {
      setLoading(true)
      let query = supabase.from(contentType).select('*')

      if (searchQuery) {
        if (contentType === 'pianos') {
          query = query.ilike('piano_title', `%${searchQuery}%`)
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

  const handleEditContent = (item: any) => {
    setSelectedContent({ ...item, type: contentType })
    setShowEditModal(true)
  }

  const handleDeleteContent = (item: any) => {
    setSelectedContent({ ...item, type: contentType })
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!selectedContent) return

    try {
      const { error } = await supabase
        .from(selectedContent.type)
        .delete()
        .eq('id', selectedContent.id)

      if (error) throw error

      // Refresh the content list
      loadContent()
      setShowDeleteModal(false)
      setSelectedContent(null)
      
    } catch (error) {
      console.error('Error deleting content:', error)
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
                {item.piano_title || item.name || item.title}
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
                    <div><strong>Artist:</strong> {item.artist_name || 'Unknown'}</div>
                    <div><strong>Program:</strong> {item.piano_program || 'N/A'}</div>
                    <div><strong>Location:</strong> {item.location_display_name || item.permanent_home_name || 'Unknown'}</div>
                    <div><strong>Source:</strong> {item.source || item.piano_source || 'N/A'}</div>
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
                <div className="tooltip" data-tip="View content">
                  <Link 
                    to={`/${contentType === 'blog_posts' ? 'blog' : contentType}/${item.id}`}
                    className="btn btn-ghost btn-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
                <div className="tooltip" data-tip="Edit content">
                  <button 
                    onClick={() => handleEditContent(item)}
                    className="btn btn-ghost btn-sm"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
                <div className="tooltip" data-tip="Delete content">
                  <button 
                    onClick={() => handleDeleteContent(item)}
                    className="btn btn-ghost btn-sm text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedContent && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Confirm Deletion</h3>
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-warning mr-3" />
              <span>Are you sure you want to delete this content?</span>
            </div>
            <div className="bg-base-200 p-4 rounded-lg mb-6">
              <p className="font-semibold">{selectedContent.name || selectedContent.title}</p>
              <p className="text-sm text-base-content/70 mt-1">
                Type: {selectedContent.type.replace('_', ' ')}
              </p>
              <p className="text-sm text-error mt-2">
                ⚠️ This action cannot be undone.
              </p>
            </div>
            <div className="modal-action">
              <button 
                onClick={() => {
                  setShowDeleteModal(false)
                  setSelectedContent(null)
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn btn-error"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => {
            setShowDeleteModal(false)
            setSelectedContent(null)
          }}></div>
        </div>
      )}

      {/* CMS Editor Modal */}
      {showEditModal && selectedContent && (
        <ContentEditorModal 
          content={selectedContent}
          onClose={() => {
            setShowEditModal(false)
            setSelectedContent(null)
          }}
          onSave={() => {
            loadContent()
            setShowEditModal(false)
            setSelectedContent(null)
          }}
        />
      )}
    </div>
  )
}

interface ContentEditorModalProps {
  content: any
  onClose: () => void
  onSave: () => void
}

function ContentEditorModal({ content, onClose, onSave }: ContentEditorModalProps) {
  const [formData, setFormData] = useState(content)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Map content types to actual table names
      const tableMap: Record<string, string> = {
        'blog_posts': 'blog_posts',
        'pianos': 'pianos', 
        'events': 'events'
      }
      
      const tableName = tableMap[content.type]
      if (!tableName) {
        throw new Error(`Unknown content type: ${content.type}`)
      }
      
      // Clean the form data to only include fields that exist in the database
      const cleanedData = { ...formData }
      
      // Remove any undefined or null values and fields that don't belong in the update
      Object.keys(cleanedData).forEach(key => {
        if (cleanedData[key] === undefined || key === 'id' || key === 'created_at' || key === 'author' || key === 'type') {
          delete cleanedData[key]
        }
      })
      
      console.log('Saving to table:', tableName, 'Data:', cleanedData)
      
      const { data, error } = await supabase
        .from(tableName)
        .update(cleanedData)
        .eq('id', content.id)
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      console.log('Save successful:', data)
      onSave()
    } catch (error) {
      console.error('Error saving content:', error)
      alert(`Failed to save content: ${(error as Error).message || 'Unknown error'}`)
    } finally {
      setSaving(false)
    }
  }

  const renderEditor = () => {
    switch (content.type) {
      case 'blog_posts':
        return <BlogEditor formData={formData} setFormData={setFormData} />
      case 'pianos':
        return <PianoEditor formData={formData} setFormData={setFormData} />
      case 'events':
        return <EventEditor formData={formData} setFormData={setFormData} />
      default:
        return <div>Editor not implemented for this content type.</div>
    }
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">
            Edit {content.type.replace('_', ' ')} - {content.name || content.title}
          </h3>
          <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">
            ✕
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {renderEditor()}
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
                <Save className="w-4 h-4 mr-2" />
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

// Individual editor components for different content types
function BlogEditor({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
          Basic Information
        </h4>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Blog Post Title *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Enter a compelling title for your blog post"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Excerpt</span>
            <span className="label-text-alt text-base-content/60">Brief summary for listings</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={3}
            placeholder="Write a brief excerpt that will appear in blog listings and previews..."
            value={formData.excerpt || ''}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
          Content
        </h4>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Blog Content *</span>
            <span className="label-text-alt text-base-content/60">HTML content supported</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-64"
            placeholder="Write your blog post content here. HTML tags are supported for formatting..."
            value={formData.content || ''}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />
          <div className="label">
            <span className="label-text-alt text-base-content/60">
              💡 Use HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt; for formatting
            </span>
          </div>
        </div>
      </div>

      {/* Metadata & Settings */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
          Metadata & Settings
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Category</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="News">News</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Community">Community</option>
              <option value="Events">Events</option>
              <option value="Features">Features</option>
              <option value="Updates">Updates</option>
            </select>
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Featured Image URL</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://example.com/image.jpg"
              value={formData.featured_image || ''}
              onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
            />
          </div>
        </div>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Tags</span>
            <span className="label-text-alt text-base-content/60">Comma-separated</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="piano, music, community, tutorial"
            value={formData.tags ? formData.tags.join(', ') : ''}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
          />
        </div>
        
        <div className="flex gap-6">
          <label className="label cursor-pointer">
            <span className="label-text font-medium mr-3">Published</span>
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={formData.published || false}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            />
          </label>
          
          <label className="label cursor-pointer">
            <span className="label-text font-medium mr-3">Allow Comments</span>
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              checked={formData.allow_comments || false}
              onChange={(e) => setFormData({ ...formData, allow_comments: e.target.checked })}
            />
          </label>
        </div>
      </div>
    </div>
  )
}

function PianoEditor({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const [hoursType, setHoursType] = useState<'custom' | 'preset'>('preset')

  const handleLocationSearch = async (query: string) => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    setFormData({ ...formData, location_name: query })

    // If query is empty, hide suggestions
    if (!query.trim()) {
      setLocationSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Debounce the search
    const timeout = setTimeout(async () => {
      try {
        // Using same geocoding service as AddPianoPage
        const suggestions = await GeocodingService.searchLocations(query)
        setLocationSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
      } catch (error) {
        console.error('Location search error:', error)
        setLocationSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    setSearchTimeout(timeout)
  }

  const handleLocationSelect = (suggestion: any) => {
    setFormData({
      ...formData,
      location_name: suggestion.address,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    })
    setLocationSuggestions([])
    setShowSuggestions(false)
  }

  const getCurrentLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev: any) => ({
            ...prev,
            latitude,
            longitude
          }))
          
          // Try to get address from coordinates using reverse geocoding
          try {
            const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            const response = await fetch(reverseGeocodingUrl, {
              headers: {
                'User-Agent': 'WorldPianos/1.0 (https://worldpianos.org)'
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              setFormData((prev: any) => ({
                ...prev,
                location_name: prev.location_name || address
              }))
            } else {
              throw new Error('Reverse geocoding failed')
            }
          } catch (error) {
            console.error('Error getting address:', error)
            // Fall back to coordinates
            const coordsAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            setFormData((prev: any) => ({
              ...prev,
              location_name: prev.location_name || coordsAddress
            }))
          }
          
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationLoading(false)
        }
      )
    } else {
      setLocationLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
          Basic Information
        </h4>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Piano Name *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g., Central Park Piano, JFK Terminal 4 Piano"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Description</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder="Describe the piano, its condition, and what makes it special..."
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Category *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Airport">Airport</option>
              <option value="Street">Street</option>
              <option value="Park">Park</option>
              <option value="Train Station">Train Station</option>
              <option value="Shopping Center">Shopping Center</option>
              <option value="University">University</option>
              <option value="Hospital">Hospital</option>
              <option value="Hotel">Hotel</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Condition *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.condition || ''}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            >
              <option value="">Select condition</option>
              <option value="Excellent">Excellent</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
              <option value="Needs Tuning">Needs Tuning</option>
              <option value="Damaged">Damaged</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
          Location
        </h4>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Address/Location *</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Enter the full address or location description"
                className="input input-bordered w-full"
                value={formData.location_name || ''}
                onChange={(e) => handleLocationSearch(e.target.value)}
                onFocus={() => {
                  if (locationSuggestions.length > 0) {
                    setShowSuggestions(true)
                  }
                }}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking on them
                  setTimeout(() => setShowSuggestions(false), 200)
                }}
              />
              
              {/* Location Suggestions Dropdown */}
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {locationSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-base-200 focus:bg-base-200 border-b border-base-200 last:border-b-0"
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-base-content/50 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{suggestion.place_name}</div>
                          <div className="text-xs text-base-content/60 mt-1">
                            {suggestion.latitude.toFixed(4)}, {suggestion.longitude.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={getCurrentLocation}
              className={`btn btn-outline ${locationLoading ? 'loading' : ''} sm:btn-md btn-sm`}
              disabled={locationLoading}
            >
              {!locationLoading && <MapPin className="w-4 h-4" />}
              <span className="hidden sm:inline">Use My Location</span>
              <span className="sm:hidden">Location</span>
            </button>
          </div>
        </div>

        {formData.latitude && formData.longitude && (
          <div className="alert alert-success">
            <Check className="w-4 h-4" />
            <span>Location coordinates captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
          </div>
        )}
      </div>

      {/* Additional Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
          Additional Details
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Accessibility</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="e.g. Wheelchair accessible, Ground level"
              value={formData.accessibility || ''}
              onChange={(e) => setFormData({ ...formData, accessibility: e.target.value })}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Operating Hours</span>
            </label>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <label className="cursor-pointer label flex-1">
                  <span className="label-text">Preset Hours</span>
                  <input
                    type="radio"
                    name="hoursType"
                    value="preset"
                    checked={hoursType === 'preset'}
                    onChange={(e) => setHoursType(e.target.value as 'preset')}
                    className="radio radio-primary"
                  />
                </label>
                <label className="cursor-pointer label flex-1">
                  <span className="label-text">Custom Hours</span>
                  <input
                    type="radio"
                    name="hoursType"
                    value="custom"
                    checked={hoursType === 'custom'}
                    onChange={(e) => setHoursType(e.target.value as 'custom')}
                    className="radio radio-primary"
                  />
                </label>
              </div>

              {hoursType === 'preset' ? (
                <select
                  className="select select-bordered w-full"
                  value={formData.hours || ''}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                >
                  <option value="">Select operating hours</option>
                  <option value="24/7">24/7 (Always Available)</option>
                  <option value="6:00 AM - 10:00 PM">6:00 AM - 10:00 PM</option>
                  <option value="7:00 AM - 11:00 PM">7:00 AM - 11:00 PM</option>
                  <option value="8:00 AM - 8:00 PM">8:00 AM - 8:00 PM</option>
                  <option value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM (Business Hours)</option>
                  <option value="10:00 AM - 6:00 PM">10:00 AM - 6:00 PM</option>
                  <option value="Varies">Varies by Day</option>
                  <option value="Unknown">Unknown</option>
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="e.g. Mon-Fri 9AM-5PM, Sat 10AM-4PM, Sun Closed"
                  className="input input-bordered w-full"
                  value={formData.hours || ''}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EventEditor({ formData, setFormData }: { formData: any; setFormData: (data: any) => void }) {
  const [locationLoading, setLocationLoading] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleLocationSearch = async (query: string) => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    setFormData({ ...formData, location_name: query })

    // If query is empty, hide suggestions
    if (!query.trim()) {
      setLocationSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Debounce the search
    const timeout = setTimeout(async () => {
      try {
        // Using same geocoding service as AddEventPage
        const suggestions = await GeocodingService.searchLocations(query)
        setLocationSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
      } catch (error) {
        console.error('Location search error:', error)
        setLocationSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    setSearchTimeout(timeout)
  }

  const handleLocationSelect = (suggestion: any) => {
    setFormData({
      ...formData,
      location_name: suggestion.address,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    })
    setLocationSuggestions([])
    setShowSuggestions(false)
  }

  const getCurrentLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setFormData((prev: any) => ({
            ...prev,
            latitude,
            longitude
          }))
          
          // Try to get address from coordinates using reverse geocoding
          try {
            const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            const response = await fetch(reverseGeocodingUrl, {
              headers: {
                'User-Agent': 'WorldPianos/1.0 (https://worldpianos.org)'
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              setFormData((prev: any) => ({
                ...prev,
                location_name: prev.location_name || address
              }))
            } else {
              throw new Error('Reverse geocoding failed')
            }
          } catch (error) {
            console.error('Error getting address:', error)
            // Fall back to coordinates
            const coordsAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            setFormData((prev: any) => ({
              ...prev,
              location_name: prev.location_name || coordsAddress
            }))
          }
          
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationLoading(false)
        }
      )
    } else {
      setLocationLoading(false)
    }
  }

  // Extract date and time from combined datetime
  const eventDate = formData.date ? new Date(formData.date) : null
  const dateValue = eventDate ? eventDate.toISOString().split('T')[0] : ''
  const timeValue = eventDate ? eventDate.toTimeString().split(' ')[0].substring(0, 5) : ''

  const handleDateChange = (newDate: string) => {
    const currentTime = timeValue || '09:00'
    const combinedDateTime = `${newDate}T${currentTime}`
    setFormData({ ...formData, date: new Date(combinedDateTime).toISOString() })
  }

  const handleTimeChange = (newTime: string) => {
    const currentDate = dateValue || new Date().toISOString().split('T')[0]
    const combinedDateTime = `${currentDate}T${newTime}`
    setFormData({ ...formData, date: new Date(combinedDateTime).toISOString() })
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
          Basic Information
        </h4>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Event Title *</span>
          </label>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="e.g., Piano Concert in the Park, Jazz Session"
            value={formData.title || ''}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Description</span>
            <span className="label-text-alt text-base-content/60">What should attendees expect?</span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full"
            rows={4}
            placeholder="Describe the event, what to expect, and any requirements..."
            value={formData.description || ''}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Date *</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              min={today}
              value={dateValue}
              onChange={(e) => handleDateChange(e.target.value)}
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Time *</span>
            </label>
            <input
              type="time"
              className="input input-bordered w-full"
              value={timeValue}
              onChange={(e) => handleTimeChange(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Location Information */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
          Location
        </h4>
        
        <div>
          <label className="label">
            <span className="label-text font-medium">Venue/Location *</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="e.g., Central Park Bandshell, Community Center"
                value={formData.location_name || ''}
                onChange={(e) => handleLocationSearch(e.target.value)}
                onFocus={() => {
                  if (locationSuggestions.length > 0) {
                    setShowSuggestions(true)
                  }
                }}
                onBlur={() => {
                  // Delay hiding suggestions to allow clicking on them
                  setTimeout(() => setShowSuggestions(false), 200)
                }}
              />
              
              {/* Location Suggestions Dropdown */}
              {showSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                  {locationSuggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-base-200 focus:bg-base-200 border-b border-base-200 last:border-b-0"
                      onClick={() => handleLocationSelect(suggestion)}
                    >
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-base-content/50 flex-shrink-0" />
                        <div>
                          <div className="font-medium text-sm">{suggestion.place_name}</div>
                          <div className="text-xs text-base-content/60 mt-1">
                            {suggestion.latitude.toFixed(4)}, {suggestion.longitude.toFixed(4)}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              type="button"
              onClick={getCurrentLocation}
              className={`btn btn-outline ${locationLoading ? 'loading' : ''} sm:btn-md btn-sm`}
              disabled={locationLoading}
            >
              {!locationLoading && <MapPin className="w-4 h-4" />}
              <span className="hidden sm:inline">Use My Location</span>
              <span className="sm:hidden">Location</span>
            </button>
          </div>
          
          {formData.latitude && formData.longitude && (
            <div className="alert alert-success mt-2">
              <Check className="w-4 h-4" />
              <span>Location coordinates captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Event Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-base-content border-b border-base-300 pb-2">
          Event Details
        </h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Category *</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.category || ''}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="Concert">Concert</option>
              <option value="Meetup">Meetup</option>
              <option value="Workshop">Workshop</option>
              <option value="Installation">Installation</option>
              <option value="Festival">Festival</option>
              <option value="Community Event">Community Event</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Organizer *</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Your name or organization"
              value={formData.organizer || ''}
              onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Contact Email *</span>
            </label>
            <input
              type="email"
              className="input input-bordered w-full"
              placeholder="contact@example.com"
              value={formData.contact_email || ''}
              onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Contact Phone</span>
            </label>
            <input
              type="tel"
              className="input input-bordered w-full"
              placeholder="+1 (555) 123-4567"
              value={formData.contact_phone || ''}
              onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text font-medium">Website/Registration URL</span>
            </label>
            <input
              type="url"
              className="input input-bordered w-full"
              placeholder="https://example.com/event"
              value={formData.meeting_url || ''}
              onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
            />
          </div>
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Max Attendees</span>
            </label>
            <input
              type="number"
              className="input input-bordered w-full"
              placeholder="Leave empty for unlimited"
              min="1"
              value={formData.max_attendees || ''}
              onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value ? parseInt(e.target.value) : null })}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ReportsTab() {
  const { user } = useAuth()
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

