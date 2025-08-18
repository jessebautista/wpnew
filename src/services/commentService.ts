import type { Comment } from '../types'
import { shouldUseMockData, supabase } from '../lib/supabase'
import { mockUsers } from '../data/mockData'
import { getDisplayName } from '../utils/usernameGenerator'

export class CommentService {
  private static comments: Comment[] = []

  static async getComments(contentType: 'piano' | 'event' | 'blog_post', contentId: string): Promise<Comment[]> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Fetching comments from mock data')
      await new Promise(resolve => setTimeout(resolve, 300))
      return this.comments
        .filter(comment => comment.content_type === contentType && comment.content_id === contentId)
        .map(comment => ({
          ...comment,
          author: mockUsers.find(user => user.id === comment.author_id)
        }))
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    try {
      console.log('[SUPABASE] Fetching comments from Supabase')
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('content_type', contentType)
        .eq('content_id', contentId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching comments:', error)
        return []
      }

      // Get unique author IDs to fetch user data
      const authorIds = [...new Set(data?.map(comment => comment.author_id).filter(Boolean))]
      
      let users: Array<{ id: string; full_name: string; email: string }> = []
      if (authorIds.length > 0) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, full_name, email')
          .in('id', authorIds)
        users = userData || []
      }

      return data?.map(comment => ({
        ...comment,
        author: users.find(user => user.id === comment.author_id) || undefined
      })) || []
    } catch (error) {
      console.error('Error fetching comments:', error)
      return []
    }
  }

  static async addComment(
    contentType: 'piano' | 'event' | 'blog_post',
    contentId: string,
    content: string,
    user?: any
  ): Promise<Comment> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Adding comment with mock data')
      await new Promise(resolve => setTimeout(resolve, 500))

      const authorName = getDisplayName(user)
      const newComment: Comment = {
        id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        content: content.trim(),
        content_type: contentType,
        content_id: contentId,
        author_id: user?.id || 'anonymous',
        author_name: authorName,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: user ? mockUsers.find(mockUser => mockUser.id === user.id) : undefined
      }

      this.comments.push(newComment)
      return newComment
    }

    try {
      console.log('[SUPABASE] Adding comment to Supabase')
      const displayName = getDisplayName(user)
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          content: content.trim(),
          content_type: contentType,
          content_id: contentId,
          author_id: user?.id || 'anonymous',
          author_name: displayName
        })
        .select('*')
        .single()

      if (error) {
        console.error('Error adding comment:', error)
        throw error
      }

      return data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  static async updateComment(commentId: string, content: string): Promise<Comment | null> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Updating comment with mock data')
      await new Promise(resolve => setTimeout(resolve, 500))

      const commentIndex = this.comments.findIndex(comment => comment.id === commentId)
      if (commentIndex === -1) return null

      this.comments[commentIndex] = {
        ...this.comments[commentIndex],
        content: content.trim(),
        updated_at: new Date().toISOString()
      }

      return {
        ...this.comments[commentIndex],
        author: mockUsers.find(user => user.id === this.comments[commentIndex].author_id)
      }
    }

    try {
      console.log('[SUPABASE] Updating comment in Supabase')
      const { data, error } = await supabase
        .from('comments')
        .update({ 
          content: content.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', commentId)
        .select('*')
        .single()

      if (error) {
        console.error('Error updating comment:', error)
        return null
      }

      // Fetch the author user data separately
      const { data: userData } = await supabase
        .from('users')
        .select('id, full_name, email')
        .eq('id', data.author_id)
        .single()

      return {
        ...data,
        author: userData || undefined
      }
    } catch (error) {
      console.error('Error updating comment:', error)
      return null
    }
  }

  static async deleteComment(commentId: string): Promise<boolean> {
    if (shouldUseMockData('supabase')) {
      console.log('[MOCK] Deleting comment with mock data')
      await new Promise(resolve => setTimeout(resolve, 500))

      const commentIndex = this.comments.findIndex(comment => comment.id === commentId)
      if (commentIndex === -1) return false

      this.comments.splice(commentIndex, 1)
      return true
    }

    try {
      console.log('[SUPABASE] Deleting comment from Supabase')
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) {
        console.error('Error deleting comment:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting comment:', error)
      return false
    }
  }

  static async getCommentCount(contentType: 'piano' | 'event' | 'blog_post', contentId: string): Promise<number> {
    if (shouldUseMockData('supabase')) {
      return this.comments.filter(comment => 
        comment.content_type === contentType && comment.content_id === contentId
      ).length
    }

    try {
      const { count, error } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('content_type', contentType)
        .eq('content_id', contentId)

      if (error) {
        console.error('Error getting comment count:', error)
        return 0
      }

      return count || 0
    } catch (error) {
      console.error('Error getting comment count:', error)
      return 0
    }
  }

  // Initialize with some mock comments
  static initializeMockComments() {
    if (this.comments.length > 0) return // Already initialized

    const now = new Date()
    const mockComments: Comment[] = [
      // Piano comments
      {
        id: 'comment-1',
        content: 'This piano has such a beautiful sound! I played here yesterday and it was perfectly tuned.',
        content_type: 'piano',
        content_id: '1',
        author_id: '1',
        author_name: 'MusicalEnthusiast123',
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-2',
        content: 'Great location for practice. Usually not too crowded in the mornings.',
        content_type: 'piano',
        content_id: '1',
        author_id: '2',
        author_name: 'HarmonicPlayer456',
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-3',
        content: 'Unfortunately, a few keys were sticking when I tried it last week. Hopefully it gets fixed soon.',
        content_type: 'piano',
        content_id: '2',
        author_id: '1',
        author_name: 'CreativeComposer789',
        created_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      // Event comments
      {
        id: 'comment-4',
        content: 'Looking forward to this event! Will there be sheet music provided?',
        content_type: 'event',
        content_id: '1',
        author_id: '2',
        author_name: 'PassionatePerformer234',
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-5',
        content: 'Great idea! I attended last year and it was amazing. Highly recommend to all piano enthusiasts.',
        content_type: 'event',
        content_id: '1',
        author_id: '1',
        author_name: 'InspiringMaestro567',
        created_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
      },
      // Blog comments
      {
        id: 'comment-6',
        content: 'Excellent article! The tips about finding public pianos were really helpful.',
        content_type: 'blog_post',
        content_id: '1',
        author_id: '1',
        author_name: 'DynamicDreamer890',
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-7',
        content: 'I wish there were more pianos in my area. This community is inspiring me to advocate for more public instruments!',
        content_type: 'blog_post',
        content_id: '1',
        author_id: '2',
        author_name: 'VibrantVirtuoso345',
        created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
      }
    ]

    this.comments = mockComments
  }
}

// Initialize mock comments
CommentService.initializeMockComments()