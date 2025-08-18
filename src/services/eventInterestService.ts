import { supabase } from '../lib/supabase'

export interface EventInterest {
  id: string
  user_id: string
  event_id: string
  interested: boolean
  created_at: string
}

export class EventInterestService {
  /**
   * Toggle user interest in an event
   */
  static async toggleInterest(eventId: string, userId: string): Promise<{ interested: boolean; count: number }> {
    try {
      // Check if user already has an interest record
      const { data: existing, error: fetchError } = await supabase
        .from('event_interests')
        .select('*')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle()

      if (fetchError) {
        console.error('Error fetching existing interest:', fetchError)
        throw fetchError
      }

      let interested: boolean

      if (existing) {
        // Toggle existing interest
        interested = !existing.interested
        const { error: updateError } = await supabase
          .from('event_interests')
          .update({ interested })
          .eq('id', existing.id)

        if (updateError) {
          console.error('Error updating interest:', updateError)
          throw updateError
        }
      } else {
        // Create new interest record
        interested = true
        const { error: insertError } = await supabase
          .from('event_interests')
          .insert({
            user_id: userId,
            event_id: eventId,
            interested
          })

        if (insertError) {
          console.error('Error creating interest:', insertError)
          throw insertError
        }
      }

      // Get updated count
      const count = await this.getInterestCount(eventId)
      
      return { interested, count }
    } catch (error) {
      console.error('Error toggling interest:', error)
      throw error
    }
  }

  /**
   * Get user's interest status for an event
   */
  static async getUserInterest(eventId: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('event_interests')
        .select('interested')
        .eq('user_id', userId)
        .eq('event_id', eventId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching user interest:', error)
        return false
      }

      return data?.interested || false
    } catch (error) {
      console.error('Error getting user interest:', error)
      return false
    }
  }

  /**
   * Get total count of interested users for an event
   */
  static async getInterestCount(eventId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('event_interests')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .eq('interested', true)

      if (error) {
        console.error('Error getting interest count:', error)
        return 0
      }

      return count || 0
    } catch (error) {
      console.error('Error getting interest count:', error)
      return 0
    }
  }

  /**
   * Get all users interested in an event
   */
  static async getInterestedUsers(eventId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('event_interests')
        .select(`
          *,
          users:user_id (
            id,
            full_name,
            email,
            avatar_url
          )
        `)
        .eq('event_id', eventId)
        .eq('interested', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching interested users:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error getting interested users:', error)
      return []
    }
  }
}