import { supabase } from '../lib/supabase'

export interface AdminStats {
  users: {
    total: number
    active: number
    newThisWeek: number
    byRole: { [key: string]: number }
  }
  content: {
    pianos: { total: number; pending: number; approved: number; rejected: number }
    events: { total: number; pending: number; approved: number; rejected: number }
    blogPosts: { total: number; pending: number; approved: number; rejected: number }
  }
  moderation: {
    pendingItems: number
    flaggedItems: number
    totalReports: number
  }
  activity: {
    dailySignups: number
    dailySubmissions: number
    dailyComments: number
  }
}

export interface RecentActivity {
  id: string
  type: 'user_signup' | 'content_submit' | 'moderation_action' | 'report' | 'comment'
  title: string
  description: string
  timestamp: string
  status?: 'success' | 'warning' | 'error'
  userId?: string
  contentId?: string
  metadata?: any
}

export class AdminService {
  /**
   * Get comprehensive admin dashboard statistics
   */
  static async getDashboardStats(): Promise<AdminStats> {
    try {
      const [
        userStats,
        pianoStats,
        eventStats,
        blogStats,
        reportStats,
        activityStats
      ] = await Promise.all([
        this.getUserStats(),
        this.getContentStats('pianos'),
        this.getContentStats('events'),
        this.getContentStats('blog_posts'),
        this.getReportStats(),
        this.getActivityStats()
      ])

      return {
        users: userStats,
        content: {
          pianos: pianoStats,
          events: eventStats,
          blogPosts: blogStats
        },
        moderation: {
          pendingItems: pianoStats.pending + eventStats.pending + blogStats.pending,
          flaggedItems: reportStats.pendingReports,
          totalReports: reportStats.totalReports
        },
        activity: activityStats
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error)
      throw error
    }
  }

  /**
   * Get user statistics
   */
  private static async getUserStats() {
    try {
      // Total users
      const { count: totalUsers, error: totalError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      // Users by role
      const { data: roleData, error: roleError } = await supabase
        .from('users')
        .select('role')

      if (roleError) throw roleError

      const byRole = roleData?.reduce((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1
        return acc
      }, {}) || {}

      // New users this week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { count: newThisWeek, error: newError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo)

      if (newError) throw newError

      return {
        total: totalUsers || 0,
        active: totalUsers || 0, // Assuming all users are active for now
        newThisWeek: newThisWeek || 0,
        byRole
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw error
    }
  }

  /**
   * Get content statistics by type
   */
  private static async getContentStats(tableName: string) {
    try {
      // Total count
      const { count: total, error: totalError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      // Count by moderation status
      const { data: statusData, error: statusError } = await supabase
        .from(tableName)
        .select('moderation_status')

      if (statusError) throw statusError

      const statusCounts = statusData?.reduce((acc: any, item: any) => {
        const status = item.moderation_status || 'pending'
        acc[status] = (acc[status] || 0) + 1
        return acc
      }, {}) || {}

      return {
        total: total || 0,
        pending: statusCounts.pending || 0,
        approved: statusCounts.approved || 0,
        rejected: statusCounts.rejected || 0
      }
    } catch (error) {
      console.error(`Error fetching ${tableName} stats:`, error)
      throw error
    }
  }

  /**
   * Get report statistics
   */
  private static async getReportStats() {
    try {
      const { count: totalReports, error: totalError } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })

      if (totalError) throw totalError

      const { count: pendingReports, error: pendingError } = await supabase
        .from('reports')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      if (pendingError) throw pendingError

      return {
        totalReports: totalReports || 0,
        pendingReports: pendingReports || 0
      }
    } catch (error) {
      console.error('Error fetching report stats:', error)
      throw error
    }
  }

  /**
   * Get activity statistics
   */
  private static async getActivityStats() {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const todayISO = today.toISOString()

      // Daily signups
      const { count: dailySignups, error: signupError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO)

      if (signupError) throw signupError

      // Daily submissions (pianos + events + blog posts created today)
      const [pianoSubmissions, eventSubmissions, blogSubmissions] = await Promise.all([
        supabase.from('pianos').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
        supabase.from('events').select('*', { count: 'exact', head: true }).gte('created_at', todayISO),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }).gte('created_at', todayISO)
      ])

      const dailySubmissions = (pianoSubmissions.count || 0) + 
                              (eventSubmissions.count || 0) + 
                              (blogSubmissions.count || 0)

      // Daily comments
      const { count: dailyComments, error: commentError } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO)

      if (commentError) throw commentError

      return {
        dailySignups: dailySignups || 0,
        dailySubmissions: dailySubmissions || 0,
        dailyComments: dailyComments || 0
      }
    } catch (error) {
      console.error('Error fetching activity stats:', error)
      throw error
    }
  }

  /**
   * Get recent activity across the platform
   */
  static async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    try {
      const activities: RecentActivity[] = []

      // Get recent user signups
      const { data: recentUsers, error: userError } = await supabase
        .from('users')
        .select('id, email, full_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      if (userError) throw userError

      recentUsers?.forEach(user => {
        activities.push({
          id: `user-${user.id}`,
          type: 'user_signup',
          title: 'New user registration',
          description: `${user.full_name || user.email} joined WorldPianos`,
          timestamp: user.created_at,
          status: 'success',
          userId: user.id
        })
      })

      // Get recent content submissions
      const [recentPianos, recentEvents, recentBlogs] = await Promise.all([
        supabase.from('pianos').select('id, piano_title, created_at, moderation_status').order('created_at', { ascending: false }).limit(3),
        supabase.from('events').select('id, title, created_at, moderation_status').order('created_at', { ascending: false }).limit(3),
        supabase.from('blog_posts').select('id, title, created_at, moderation_status').order('created_at', { ascending: false }).limit(3)
      ])

      // Add piano submissions
      recentPianos.data?.forEach(piano => {
        activities.push({
          id: `piano-${piano.id}`,
          type: 'content_submit',
          title: 'Piano submission',
          description: `${piano.piano_title} submitted for review`,
          timestamp: piano.created_at,
          status: piano.moderation_status === 'pending' ? 'warning' : 'success',
          contentId: piano.id
        })
      })

      // Add event submissions
      recentEvents.data?.forEach(event => {
        activities.push({
          id: `event-${event.id}`,
          type: 'content_submit',
          title: 'Event submission',
          description: `${event.title} submitted for review`,
          timestamp: event.created_at,
          status: event.moderation_status === 'pending' ? 'warning' : 'success',
          contentId: event.id
        })
      })

      // Add blog submissions
      recentBlogs.data?.forEach(blog => {
        activities.push({
          id: `blog-${blog.id}`,
          type: 'content_submit',
          title: 'Blog post submission',
          description: `${blog.title} submitted for review`,
          timestamp: blog.created_at,
          status: blog.moderation_status === 'pending' ? 'warning' : 'success',
          contentId: blog.id
        })
      })

      // Get recent reports
      const { data: recentReports, error: reportError } = await supabase
        .from('reports')
        .select('id, reason, content_type, created_at')
        .order('created_at', { ascending: false })
        .limit(3)

      if (reportError) throw reportError

      recentReports?.forEach(report => {
        activities.push({
          id: `report-${report.id}`,
          type: 'report',
          title: 'Content reported',
          description: `${report.content_type} reported for ${report.reason}`,
          timestamp: report.created_at,
          status: 'error',
          contentId: report.id
        })
      })

      // Get recent comments
      const { data: recentComments, error: commentError } = await supabase
        .from('comments')
        .select('id, content_type, created_at, author_name')
        .order('created_at', { ascending: false })
        .limit(3)

      if (commentError) throw commentError

      recentComments?.forEach(comment => {
        activities.push({
          id: `comment-${comment.id}`,
          type: 'comment',
          title: 'New comment',
          description: `${comment.author_name || 'Anonymous'} commented on ${comment.content_type}`,
          timestamp: comment.created_at,
          status: 'success',
          contentId: comment.id
        })
      })

      // Sort by timestamp and limit
      return activities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit)

    } catch (error) {
      console.error('Error fetching recent activity:', error)
      throw error
    }
  }

  /**
   * Get all users with pagination and filtering
   */
  static async getUsers(page = 1, limit = 20, roleFilter?: string, searchQuery?: string) {
    try {
      let query = supabase
        .from('users')
        .select('*', { count: 'exact' })

      if (roleFilter) {
        query = query.eq('role', roleFilter)
      }

      if (searchQuery) {
        query = query.or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      return {
        users: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  /**
   * Get all reports with pagination
   */
  static async getReports(page = 1, limit = 20, statusFilter?: string) {
    try {
      let query = supabase
        .from('reports')
        .select('*', { count: 'exact' })

      if (statusFilter) {
        query = query.eq('status', statusFilter)
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      return {
        reports: data || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error fetching reports:', error)
      throw error
    }
  }

  /**
   * Create a new user with authentication (admin only)
   * Note: This creates a regular signup then updates the user role
   */
  static async createUser(userData: {
    email: string
    password: string
    full_name: string
    role: string
    location?: string
  }) {
    try {
      // Store current session to restore later
      const currentSession = await supabase.auth.getSession()
      
      // Create user via regular signup
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.full_name,
            role: userData.role,
            location: userData.location
          }
        }
      })

      if (authError) throw authError

      // If we have a current session, restore it (since signUp might have changed the session)
      if (currentSession.data.session) {
        await supabase.auth.setSession(currentSession.data.session)
      }

      // Manually create user profile since trigger is disabled
      if (authUser.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: authUser.user.id,
            email: userData.email,
            full_name: userData.full_name,
            role: userData.role,
            location: userData.location
          })

        if (insertError) {
          console.error('Error creating user profile:', insertError)
          throw insertError
        }
      }

      return authUser.user
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  /**
   * Update user role (admin only)
   */
  static async updateUserRole(userId: string, newRole: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error updating user role:', error)
      throw error
    }
  }

  /**
   * Update moderation status for content
   */
  static async updateModerationStatus(
    tableName: string, 
    contentId: string, 
    status: string, 
    moderatorId: string
  ) {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update({ 
          moderation_status: status,
          moderated_by: moderatorId,
          moderated_at: new Date().toISOString()
        })
        .eq('id', contentId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error updating moderation status:', error)
      throw error
    }
  }

  /**
   * Update report status
   */
  static async updateReportStatus(reportId: string, status: string, reviewedBy: string) {
    try {
      const { data, error } = await supabase
        .from('reports')
        .update({ 
          status,
          reviewed_by: reviewedBy,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId)
        .select()
        .single()

      if (error) throw error

      return data
    } catch (error) {
      console.error('Error updating report status:', error)
      throw error
    }
  }
}