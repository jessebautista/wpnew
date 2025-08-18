import { supabase } from '../lib/supabase'

export interface Report {
  id: string
  user_id: string | null
  content_type: 'piano' | 'event' | 'blog_post'
  content_id: string
  reason: string
  description: string | null
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
  updated_at: string
  reviewed_by: string | null
  reviewed_at: string | null
}

export const REPORT_REASONS = [
  'Inappropriate content',
  'Spam or advertising', 
  'False information',
  'Harassment or abuse',
  'Copyright violation',
  'Privacy violation',
  'Dangerous or illegal activity',
  'Other'
] as const

export type ReportReason = typeof REPORT_REASONS[number]

export class ReportService {
  /**
   * Submit a report for content
   */
  static async submitReport(
    contentType: 'piano' | 'event' | 'blog_post',
    contentId: string,
    reason: ReportReason,
    description?: string,
    userId?: string | null
  ): Promise<Report> {
    try {
      const reportData = {
        content_type: contentType,
        content_id: contentId,
        reason,
        description: description || null,
        user_id: userId || null
      }

      const { data, error } = await supabase
        .from('reports')
        .insert(reportData)
        .select()
        .single()

      if (error) {
        console.error('Error submitting report:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error submitting report:', error)
      throw error
    }
  }

  /**
   * Check if user has already reported this content
   */
  static async hasUserReported(
    contentType: 'piano' | 'event' | 'blog_post',
    contentId: string,
    userId: string
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('id')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error checking existing report:', error)
        return false
      }

      return !!data
    } catch (error) {
      console.error('Error checking user report:', error)
      return false
    }
  }

  /**
   * Get reports for specific content (admin/moderator only)
   */
  static async getContentReports(
    contentType: 'piano' | 'event' | 'blog_post',
    contentId: string
  ): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching content reports:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting content reports:', error)
      return []
    }
  }

  /**
   * Get all reports (admin/moderator only)
   */
  static async getAllReports(status?: string): Promise<Report[]> {
    try {
      let query = supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching all reports:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting all reports:', error)
      return []
    }
  }

  /**
   * Update report status (admin/moderator only)
   */
  static async updateReportStatus(
    reportId: string,
    status: 'reviewed' | 'resolved' | 'dismissed',
    reviewedBy: string
  ): Promise<Report | null> {
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

      if (error) {
        console.error('Error updating report status:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error updating report status:', error)
      return null
    }
  }

  /**
   * Get user's reports
   */
  static async getUserReports(userId: string): Promise<Report[]> {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user reports:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting user reports:', error)
      return []
    }
  }
}