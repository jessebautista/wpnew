/**
 * Piano Visit Service
 * Handles piano visits and ratings
 */

import { supabase } from '../lib/supabase'

export interface PianoVisit {
  id: string
  piano_id: string
  user_id: string
  rating: number
  notes?: string
  created_at: string
}

export interface CreateVisitData {
  piano_id: string
  rating: number
  notes?: string
}

export class PianoVisitService {
  /**
   * Create or update a piano visit/rating
   */
  static async upsertVisit(data: CreateVisitData): Promise<PianoVisit> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User must be authenticated to rate pianos')
      }

      // First, try to get existing visit
      const { data: existingVisit } = await supabase
        .from('piano_visits')
        .select('*')
        .eq('piano_id', data.piano_id)
        .eq('user_id', user.id)
        .single()

      if (existingVisit) {
        // Update existing visit
        const { data: visit, error } = await supabase
          .from('piano_visits')
          .update({
            rating: data.rating,
            notes: data.notes || null
          })
          .eq('piano_id', data.piano_id)
          .eq('user_id', user.id)
          .select()
          .single()

        if (error) {
          throw new Error(`Failed to update rating: ${error.message}`)
        }

        return visit
      } else {
        // Create new visit
        const { data: visit, error } = await supabase
          .from('piano_visits')
          .insert([{
            piano_id: data.piano_id,
            user_id: user.id,
            rating: data.rating,
            notes: data.notes || null
          }])
          .select()
          .single()

        if (error) {
          throw new Error(`Failed to create rating: ${error.message}`)
        }

        return visit
      }
    } catch (error) {
      console.error('Piano visit upsert error:', error)
      throw error
    }
  }

  /**
   * Get user's visit/rating for a specific piano
   */
  static async getUserVisit(pianoId: string): Promise<PianoVisit | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return null
      }

      const { data: visit, error } = await supabase
        .from('piano_visits')
        .select('*')
        .eq('piano_id', pianoId)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        throw new Error(`Failed to fetch user visit: ${error.message}`)
      }

      return visit || null
    } catch (error) {
      console.error('Get user visit error:', error)
      throw error
    }
  }

  /**
   * Get average rating and visit count for a piano
   */
  static async getPianoStats(pianoId: string): Promise<{ averageRating: number; visitCount: number }> {
    try {
      const { data, error } = await supabase
        .from('piano_visits')
        .select('rating')
        .eq('piano_id', pianoId)

      if (error) {
        throw new Error(`Failed to fetch piano stats: ${error.message}`)
      }

      const visitCount = data.length
      const averageRating = visitCount > 0 
        ? data.reduce((sum, visit) => sum + visit.rating, 0) / visitCount
        : 0

      return {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        visitCount
      }
    } catch (error) {
      console.error('Get piano stats error:', error)
      throw error
    }
  }

  /**
   * Get all visits for a piano (for admin/moderation)
   */
  static async getPianoVisits(pianoId: string): Promise<PianoVisit[]> {
    try {
      const { data: visits, error } = await supabase
        .from('piano_visits')
        .select('*')
        .eq('piano_id', pianoId)
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch piano visits: ${error.message}`)
      }

      return visits || []
    } catch (error) {
      console.error('Get piano visits error:', error)
      throw error
    }
  }

  /**
   * Delete a visit (for admins or user's own visit)
   */
  static async deleteVisit(visitId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('piano_visits')
        .delete()
        .eq('id', visitId)

      if (error) {
        throw new Error(`Failed to delete visit: ${error.message}`)
      }
    } catch (error) {
      console.error('Delete visit error:', error)
      throw error
    }
  }
}