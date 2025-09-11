/**
 * Resend Email Service Integration
 * 
 * Setup Instructions:
 * 1. Sign up for a Resend account at https://resend.com
 * 2. Create an API key in your Resend dashboard
 * 3. Add VITE_RESEND_API_KEY to your .env file:
 *    VITE_RESEND_API_KEY=re_your_api_key_here
 * 4. Verify your domain in Resend (or use the default for testing)
 * 
 * Features:
 * - Welcome emails for new subscribers
 * - Newsletter campaigns with batching
 * - Piano alerts for new piano submissions
 * - Automatic fallback to mock mode if not configured
 * 
 * Testing:
 * - Use ResendService.testConnection() to verify setup
 * - Check ResendService.getStatus() for configuration status
 * - All methods gracefully fall back to mock mode without API key
 */

import { Resend } from 'resend'

export interface EmailTemplate {
  to: string[]
  subject: string
  html: string
  from?: string
  replyTo?: string
  tags?: { name: string; value: string }[]
}

export interface BulkEmailOptions {
  template: EmailTemplate
  batchSize?: number
  delayBetweenBatches?: number
}

export interface EmailStats {
  sent: number
  delivered: number
  bounced: number
  opened: number
  clicked: number
  complained: number
}

export class ResendService {
  private static resend: Resend | null = null
  private static isConfigured: boolean = false

  private static initialize() {
    if (this.resend) return

    const apiKey = import.meta.env.VITE_RESEND_API_KEY
    if (!apiKey) {
      console.warn('Resend API key not found. Email sending will be simulated.')
      this.isConfigured = false
      return
    }

    try {
      this.resend = new Resend(apiKey)
      this.isConfigured = true
      console.log('✅ Resend service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Resend service:', error)
      this.isConfigured = false
    }
  }

  /**
   * Send a single email
   */
  static async sendEmail(template: EmailTemplate): Promise<{ success: boolean; messageId?: string; error?: string }> {
    this.initialize()

    if (!this.isConfigured || !this.resend) {
      console.log('[MOCK] Sending email:', {
        to: template.to,
        subject: template.subject,
        from: template.from || 'noreply@worldpianos.org'
      })
      
      // Simulate successful send
      return {
        success: true,
        messageId: `mock-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
    }

    try {
      const emailData = {
        from: template.from || 'WorldPianos <noreply@worldpianos.org>',
        to: template.to,
        subject: template.subject,
        html: template.html,
        replyTo: template.replyTo,
        tags: template.tags
      }

      console.log('📧 Sending email via Resend:', {
        to: emailData.to,
        subject: emailData.subject,
        from: emailData.from
      })

      const { data, error } = await this.resend.emails.send(emailData)

      if (error) {
        console.error('❌ Resend error:', error)
        return {
          success: false,
          error: error.message || 'Failed to send email'
        }
      }

      console.log('✅ Email sent successfully:', data?.id)
      return {
        success: true,
        messageId: data?.id
      }
    } catch (error: any) {
      console.error('❌ Error sending email:', error)
      return {
        success: false,
        error: error.message || 'Unknown error occurred'
      }
    }
  }

  /**
   * Send bulk emails with batching and rate limiting
   */
  static async sendBulkEmails(
    emails: EmailTemplate[],
    options: BulkEmailOptions = {}
  ): Promise<{
    success: boolean
    results: Array<{ email: string; success: boolean; messageId?: string; error?: string }>
    stats: { sent: number; failed: number; total: number }
  }> {
    this.initialize()

    const batchSize = options.batchSize || 50
    const delayBetweenBatches = options.delayBetweenBatches || 1000
    const results: Array<{ email: string; success: boolean; messageId?: string; error?: string }> = []
    
    let sent = 0
    let failed = 0

    console.log(`📬 Starting bulk email send: ${emails.length} emails, batch size: ${batchSize}`)

    // Process emails in batches
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      console.log(`📧 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(emails.length / batchSize)}`)

      // Send batch concurrently
      const batchPromises = batch.map(async (email) => {
        const result = await this.sendEmail(email)
        const emailResult = {
          email: email.to[0] || 'unknown',
          success: result.success,
          messageId: result.messageId,
          error: result.error
        }

        if (result.success) {
          sent++
        } else {
          failed++
        }

        return emailResult
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      // Delay between batches to avoid rate limits
      if (i + batchSize < emails.length && delayBetweenBatches > 0) {
        console.log(`⏱️ Waiting ${delayBetweenBatches}ms before next batch...`)
        await new Promise(resolve => setTimeout(resolve, delayBetweenBatches))
      }
    }

    console.log(`✅ Bulk email send completed: ${sent} sent, ${failed} failed`)

    return {
      success: failed === 0,
      results,
      stats: {
        sent,
        failed,
        total: emails.length
      }
    }
  }

  /**
   * Send newsletter to subscribers
   */
  static async sendNewsletter(
    subject: string,
    htmlContent: string,
    subscribers: string[],
    options: {
      from?: string
      replyTo?: string
      tags?: { name: string; value: string }[]
      batchSize?: number
    } = {}
  ): Promise<{
    success: boolean
    campaignId: string
    stats: { sent: number; failed: number; total: number }
    errors: Array<{ email: string; error: string }>
  }> {
    const campaignId = `campaign-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    console.log(`📮 Starting newsletter campaign: ${campaignId}`)
    console.log(`📊 Recipients: ${subscribers.length}`)

    // Create email templates for each subscriber
    const emails: EmailTemplate[] = subscribers.map(email => ({
      to: [email],
      subject,
      html: htmlContent,
      from: options.from,
      replyTo: options.replyTo,
      tags: [
        { name: 'campaign-id', value: campaignId },
        { name: 'email-type', value: 'newsletter' },
        ...(options.tags || [])
      ]
    }))

    // Send bulk emails
    const bulkResult = await this.sendBulkEmails(emails, {
      batchSize: options.batchSize || 50,
      delayBetweenBatches: 1000
    })

    // Extract errors
    const errors = bulkResult.results
      .filter(result => !result.success)
      .map(result => ({
        email: result.email,
        error: result.error || 'Unknown error'
      }))

    return {
      success: bulkResult.success,
      campaignId,
      stats: bulkResult.stats,
      errors
    }
  }

  /**
   * Send welcome email to new subscriber
   */
  static async sendWelcomeEmail(
    email: string,
    firstName?: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const name = firstName || 'Piano Enthusiast'
    
    const welcomeTemplate: EmailTemplate = {
      to: [email],
      subject: '🎹 Welcome to WorldPianos!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #8B5CF6; text-align: center;">Welcome to WorldPianos! 🎹</h1>
          
          <p>Hi ${name},</p>
          
          <p>Thank you for joining our community of piano enthusiasts! You're now part of a global network of people who share your passion for music and public pianos.</p>
          
          <h2 style="color: #8B5CF6;">What's Next?</h2>
          <ul>
            <li>🗺️ <strong>Explore our piano map</strong> to find public pianos near you</li>
            <li>📅 <strong>Discover events</strong> happening at piano locations worldwide</li>
            <li>📝 <strong>Read our blog</strong> for piano stories and community highlights</li>
            <li>➕ <strong>Add pianos</strong> you discover to help grow our database</li>
          </ul>
          
          <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #8B5CF6;">💌 Your Newsletter Preferences</h3>
            <p>You'll receive:</p>
            <ul>
              <li>✅ Weekly digest of new pianos and events</li>
              <li>✅ Blog updates and community stories</li>
              <li>✅ Event notifications in your area</li>
              <li>✅ New piano alerts</li>
            </ul>
            <p><small>You can update your preferences anytime by replying to any email.</small></p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://worldpianos.org" 
               style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Start Exploring Pianos
            </a>
          </div>
          
          <p>Happy playing!</p>
          <p><strong>The WorldPianos Team</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
          <p style="font-size: 12px; color: #6B7280; text-align: center;">
            You received this email because you subscribed to WorldPianos updates.<br>
            <a href="{{unsubscribe_url}}" style="color: #8B5CF6;">Unsubscribe</a> | 
            <a href="mailto:support@worldpianos.org" style="color: #8B5CF6;">Contact Support</a>
          </p>
        </div>
      `,
      tags: [
        { name: 'email-type', value: 'welcome' },
        { name: 'automation', value: 'new-subscriber' }
      ]
    }

    return this.sendEmail(welcomeTemplate)
  }

  /**
   * Send piano alert email to subscribers
   */
  static async sendPianoAlert(
    subscribers: string[],
    piano: {
      name: string
      location: string
      category: string
      condition: string
      url: string
    }
  ): Promise<{ success: boolean; campaignId: string; stats: { sent: number; failed: number; total: number } }> {
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #8B5CF6; text-align: center;">🎹 New Piano Alert!</h1>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="margin-top: 0; color: #8B5CF6;">${piano.name}</h2>
          <p><strong>📍 Location:</strong> ${piano.location}</p>
          <p><strong>🏷️ Category:</strong> ${piano.category}</p>
          <p><strong>🎵 Condition:</strong> ${piano.condition}</p>
        </div>
        
        <p>A new piano has been added to our database and is ready for the community to enjoy!</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${piano.url}" 
             style="background-color: #8B5CF6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Piano Details
          </a>
        </div>
        
        <p>Happy playing!</p>
        <p><strong>The WorldPianos Team</strong></p>
        
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #E5E7EB;">
        <p style="font-size: 12px; color: #6B7280; text-align: center;">
          You received this email because you subscribed to new piano alerts.<br>
          <a href="{{unsubscribe_url}}" style="color: #8B5CF6;">Unsubscribe</a>
        </p>
      </div>
    `

    return this.sendNewsletter(
      `🎹 New Piano: ${piano.name}`,
      htmlContent,
      subscribers,
      {
        tags: [
          { name: 'email-type', value: 'piano-alert' },
          { name: 'piano-category', value: piano.category }
        ]
      }
    )
  }

  /**
   * Test email functionality
   */
  static async testConnection(): Promise<{ success: boolean; message: string }> {
    this.initialize()

    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Resend API key not configured. Check VITE_RESEND_API_KEY environment variable.'
      }
    }

    try {
      // Send a test email to a safe address
      const testResult = await this.sendEmail({
        to: ['test@resend.dev'], // Resend's official test address
        subject: '🧪 WorldPianos Resend Test',
        html: `
          <h1>Test Email</h1>
          <p>This is a test email from WorldPianos to verify Resend integration.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        `,
        tags: [
          { name: 'email-type', value: 'test' }
        ]
      })

      if (testResult.success) {
        return {
          success: true,
          message: `Test email sent successfully! Message ID: ${testResult.messageId}`
        }
      } else {
        return {
          success: false,
          message: `Test email failed: ${testResult.error}`
        }
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Connection test failed: ${error.message}`
      }
    }
  }

  /**
   * Get service configuration status
   */
  static getStatus(): {
    configured: boolean
    apiKeyPresent: boolean
    message: string
  } {
    this.initialize()

    const apiKeyPresent = !!import.meta.env.VITE_RESEND_API_KEY

    return {
      configured: this.isConfigured,
      apiKeyPresent,
      message: this.isConfigured 
        ? 'Resend service is configured and ready' 
        : apiKeyPresent 
          ? 'Resend API key found but service initialization failed'
          : 'Resend API key not found in environment variables'
    }
  }
}

// Export for development console access
if (import.meta.env.DEV) {
  (window as any).ResendService = ResendService
  console.log('🧪 ResendService available in console for testing')
}