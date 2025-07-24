import type { User, Piano, Event, BlogPost } from '../types'

export type ContentType = 'piano' | 'event' | 'blog_post'
export type ModerationStatus = 'pending' | 'approved' | 'rejected' | 'auto_approved'
export type ModerationAction = 'approve' | 'reject' | 'flag' | 'auto_approve'

export interface ModerationRule {
  id: string
  name: string
  description: string
  contentType: ContentType | 'all'
  conditions: ModerationCondition[]
  action: ModerationAction
  priority: number
  enabled: boolean
}

export interface ModerationCondition {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'exists' | 'not_exists'
  value: any
}

export interface ModerationLog {
  id: string
  contentId: string
  contentType: ContentType
  action: ModerationAction
  reason: string
  moderatorId?: string
  ruleId?: string
  timestamp: string
  metadata?: Record<string, any>
}

export class ModerationService {
  private static rules: ModerationRule[] = [
    // Auto-approve trusted users
    {
      id: 'auto-approve-trusted',
      name: 'Auto-approve trusted users',
      description: 'Automatically approve content from users with good reputation',
      contentType: 'all',
      conditions: [
        { field: 'author.reputation', operator: 'greater_than', value: 100 },
        { field: 'author.verified', operator: 'equals', value: true }
      ],
      action: 'auto_approve',
      priority: 1,
      enabled: true
    },
    // Auto-approve simple piano submissions
    {
      id: 'auto-approve-simple-pianos',
      name: 'Auto-approve simple piano submissions',
      description: 'Auto-approve pianos with basic info from users with some history',
      contentType: 'piano',
      conditions: [
        { field: 'name', operator: 'exists', value: null },
        { field: 'location_name', operator: 'exists', value: null },
        { field: 'category', operator: 'exists', value: null },
        { field: 'author.contributions', operator: 'greater_than', value: 5 }
      ],
      action: 'auto_approve',
      priority: 2,
      enabled: true
    },
    // Flag suspicious content
    {
      id: 'flag-suspicious-content',
      name: 'Flag suspicious content',
      description: 'Flag content with potential spam indicators',
      contentType: 'all',
      conditions: [
        { field: 'description', operator: 'contains', value: 'http' }
      ],
      action: 'flag',
      priority: 3,
      enabled: true
    },
    // Auto-reject incomplete submissions
    {
      id: 'reject-incomplete',
      name: 'Reject incomplete submissions',
      description: 'Reject submissions missing critical information',
      contentType: 'piano',
      conditions: [
        { field: 'name', operator: 'not_exists', value: null }
      ],
      action: 'reject',
      priority: 4,
      enabled: true
    }
  ]

  private static logs: ModerationLog[] = []

  static async processContent(
    content: Piano | Event | BlogPost,
    contentType: ContentType,
    author: User
  ): Promise<{ status: ModerationStatus; reason: string; appliedRules: string[] }> {
    const appliedRules: string[] = []
    let finalStatus: ModerationStatus = 'pending'
    let reason = 'Submitted for manual review'

    // Get applicable rules sorted by priority
    const applicableRules = this.rules
      .filter(rule => rule.enabled && (rule.contentType === 'all' || rule.contentType === contentType))
      .sort((a, b) => a.priority - b.priority)

    // Evaluate each rule
    for (const rule of applicableRules) {
      const matches = this.evaluateRule(rule, content, author)
      
      if (matches) {
        appliedRules.push(rule.id)
        
        switch (rule.action) {
          case 'auto_approve':
            finalStatus = 'auto_approved'
            reason = `Auto-approved: ${rule.description}`
            break
          case 'reject':
            finalStatus = 'rejected'
            reason = `Auto-rejected: ${rule.description}`
            break
          case 'flag':
            // Flagging doesn't change status but adds to review priority
            reason += ` | Flagged: ${rule.description}`
            break
          case 'approve':
            finalStatus = 'approved'
            reason = `Approved: ${rule.description}`
            break
        }

        // Log the action
        this.logAction(
          content.id,
          contentType,
          rule.action,
          rule.description,
          undefined,
          rule.id
        )

        // Break on first decisive action (approve/reject)
        if (rule.action === 'auto_approve' || rule.action === 'reject' || rule.action === 'approve') {
          break
        }
      }
    }

    return { status: finalStatus, reason, appliedRules }
  }

  private static evaluateRule(rule: ModerationRule, content: any, author: User): boolean {
    return rule.conditions.every(condition => {
      const value = this.getNestedValue(
        condition.field.startsWith('author.') ? author : content,
        condition.field.replace('author.', '')
      )

      switch (condition.operator) {
        case 'equals':
          return value === condition.value
        case 'contains':
          return typeof value === 'string' && value.toLowerCase().includes(condition.value.toLowerCase())
        case 'greater_than':
          return typeof value === 'number' && value > condition.value
        case 'less_than':
          return typeof value === 'number' && value < condition.value
        case 'exists':
          return value !== null && value !== undefined && value !== ''
        case 'not_exists':
          return value === null || value === undefined || value === ''
        default:
          return false
      }
    })
  }

  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
  }

  static async approveContent(
    contentId: string,
    contentType: ContentType,
    moderatorId: string,
    reason?: string
  ): Promise<void> {
    // In a real app, this would update the database
    console.log(`Approving ${contentType} ${contentId}`)
    
    this.logAction(
      contentId,
      contentType,
      'approve',
      reason || 'Manually approved by moderator',
      moderatorId
    )

    // Publish content logic would go here
    await this.publishContent(contentId, contentType)
  }

  static async rejectContent(
    contentId: string,
    contentType: ContentType,
    moderatorId: string,
    reason: string
  ): Promise<void> {
    // In a real app, this would update the database
    console.log(`Rejecting ${contentType} ${contentId}`)
    
    this.logAction(
      contentId,
      contentType,
      'reject',
      reason,
      moderatorId
    )

    // Notify author logic would go here
    await this.notifyAuthor(contentId, contentType, 'rejected', reason)
  }

  static async flagContent(
    contentId: string,
    contentType: ContentType,
    reason: string,
    reporterId?: string
  ): Promise<void> {
    console.log(`Flagging ${contentType} ${contentId}`)
    
    this.logAction(
      contentId,
      contentType,
      'flag',
      reason,
      reporterId
    )
  }

  private static async publishContent(contentId: string, contentType: ContentType): Promise<void> {
    // Mock publishing logic
    console.log(`Publishing ${contentType} ${contentId}`)
    
    // In a real app, this would:
    // 1. Update the content status to published
    // 2. Add to search indexes
    // 3. Send notifications to subscribers
    // 4. Update related data (user stats, etc.)
  }

  private static async notifyAuthor(
    contentId: string,
    contentType: ContentType,
    status: 'approved' | 'rejected',
    reason: string
  ): Promise<void> {
    // Mock notification logic
    console.log(`Notifying author about ${contentType} ${contentId}: ${status} - ${reason}`)
    
    // In a real app, this would:
    // 1. Send email notification
    // 2. Create in-app notification
    // 3. Update user dashboard
  }

  private static logAction(
    contentId: string,
    contentType: ContentType,
    action: ModerationAction,
    reason: string,
    moderatorId?: string,
    ruleId?: string,
    metadata?: Record<string, any>
  ): void {
    const log: ModerationLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      contentId,
      contentType,
      action,
      reason,
      moderatorId,
      ruleId,
      timestamp: new Date().toISOString(),
      metadata
    }

    this.logs.push(log)
  }

  static getModerationLogs(contentId?: string, contentType?: ContentType): ModerationLog[] {
    return this.logs.filter(log => 
      (!contentId || log.contentId === contentId) &&
      (!contentType || log.contentType === contentType)
    ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  static getModerationRules(): ModerationRule[] {
    return [...this.rules]
  }

  static updateModerationRule(ruleId: string, updates: Partial<ModerationRule>): void {
    const index = this.rules.findIndex(rule => rule.id === ruleId)
    if (index !== -1) {
      this.rules[index] = { ...this.rules[index], ...updates }
    }
  }

  static addModerationRule(rule: Omit<ModerationRule, 'id'>): string {
    const newRule: ModerationRule = {
      ...rule,
      id: `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }
    this.rules.push(newRule)
    return newRule.id
  }

  static deleteModerationRule(ruleId: string): void {
    this.rules = this.rules.filter(rule => rule.id !== ruleId)
  }

  // Analytics methods
  static getModerationStats(timeRange: 'day' | 'week' | 'month' = 'week') {
    const now = new Date()
    const timeRangeMs = {
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000
    }
    
    const since = new Date(now.getTime() - timeRangeMs[timeRange])
    const recentLogs = this.logs.filter(log => new Date(log.timestamp) >= since)

    return {
      total: recentLogs.length,
      approved: recentLogs.filter(log => log.action === 'approve').length,
      rejected: recentLogs.filter(log => log.action === 'reject').length,
      flagged: recentLogs.filter(log => log.action === 'flag').length,
      autoApproved: recentLogs.filter(log => log.action === 'auto_approve').length,
      byContentType: {
        piano: recentLogs.filter(log => log.contentType === 'piano').length,
        event: recentLogs.filter(log => log.contentType === 'event').length,
        blog_post: recentLogs.filter(log => log.contentType === 'blog_post').length
      }
    }
  }
}