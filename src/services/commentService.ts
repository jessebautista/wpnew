import type { Comment } from '../types'
import { mockUsers } from '../data/mockData'

export class CommentService {
  private static comments: Comment[] = []

  static async getComments(contentType: 'piano' | 'event' | 'blog_post', contentId: string): Promise<Comment[]> {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 300))

    return this.comments
      .filter(comment => comment.content_type === contentType && comment.content_id === contentId)
      .map(comment => ({
        ...comment,
        author: mockUsers.find(user => user.id === comment.author_id)
      }))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
  }

  static async addComment(
    contentType: 'piano' | 'event' | 'blog_post',
    contentId: string,
    content: string,
    authorId: string
  ): Promise<Comment> {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const newComment: Comment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      content: content.trim(),
      content_type: contentType,
      content_id: contentId,
      author_id: authorId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: mockUsers.find(user => user.id === authorId)
    }

    this.comments.push(newComment)
    return newComment
  }

  static async updateComment(commentId: string, content: string): Promise<Comment | null> {
    // Mock API delay
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

  static async deleteComment(commentId: string): Promise<boolean> {
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const commentIndex = this.comments.findIndex(comment => comment.id === commentId)
    if (commentIndex === -1) return false

    this.comments.splice(commentIndex, 1)
    return true
  }

  static async getCommentCount(contentType: 'piano' | 'event' | 'blog_post', contentId: string): Promise<number> {
    return this.comments.filter(comment => 
      comment.content_type === contentType && comment.content_id === contentId
    ).length
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
        created_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-2',
        content: 'Great location for practice. Usually not too crowded in the mornings.',
        content_type: 'piano',
        content_id: '1',
        author_id: '2',
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-3',
        content: 'Unfortunately, a few keys were sticking when I tried it last week. Hopefully it gets fixed soon.',
        content_type: 'piano',
        content_id: '2',
        author_id: '1',
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
        created_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-5',
        content: 'Great idea! I attended last year and it was amazing. Highly recommend to all piano enthusiasts.',
        content_type: 'event',
        content_id: '1',
        author_id: '1',
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
        created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'comment-7',
        content: 'I wish there were more pianos in my area. This community is inspiring me to advocate for more public instruments!',
        content_type: 'blog_post',
        content_id: '1',
        author_id: '2',
        created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
      }
    ]

    this.comments = mockComments
  }
}

// Initialize mock comments
CommentService.initializeMockComments()