import { useState, useEffect } from 'react'
import { MessageCircle, Plus } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { CommentService } from '../../services/commentService'
import { CommentList } from './CommentList'
import { CommentForm } from './CommentForm'
import type { Comment } from '../../types'

interface CommentSectionProps {
  contentType: 'piano' | 'event' | 'blog_post'
  contentId: string
  allowComments?: boolean
}

export function CommentSection({ contentType, contentId, allowComments = true }: CommentSectionProps) {
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [contentType, contentId])

  const loadComments = async () => {
    try {
      setLoading(true)
      const fetchedComments = await CommentService.getComments(contentType, contentId)
      setComments(fetchedComments)
    } catch (error) {
      console.error('Error loading comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddComment = async (content: string) => {
    if (!user) return

    try {
      setSubmitting(true)
      const newComment = await CommentService.addComment(contentType, contentId, content, user.id)
      setComments(prev => [...prev, newComment])
      setShowForm(false)
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      const updatedComment = await CommentService.updateComment(commentId, content)
      if (updatedComment) {
        setComments(prev => prev.map(comment => 
          comment.id === commentId ? updatedComment : comment
        ))
      }
    } catch (error) {
      console.error('Error updating comment:', error)
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    try {
      const success = await CommentService.deleteComment(commentId)
      if (success) {
        setComments(prev => prev.filter(comment => comment.id !== commentId))
      }
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  if (!allowComments) {
    return null
  }

  return (
    <div className="bg-base-100 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h3 className="text-xl font-semibold">
            Comments ({comments.length})
          </h3>
        </div>
        
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Comment
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showForm && user && (
        <div className="mb-6">
          <CommentForm
            onSubmit={handleAddComment}
            onCancel={() => setShowForm(false)}
            submitting={submitting}
            placeholder="Share your thoughts..."
          />
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : comments.length > 0 ? (
        <CommentList
          comments={comments}
          currentUser={user}
          onUpdate={handleUpdateComment}
          onDelete={handleDeleteComment}
        />
      ) : (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 text-base-content/50" />
          <h4 className="text-lg font-medium mb-2">No comments yet</h4>
          <p className="text-base-content/70 mb-4">
            Be the first to share your thoughts!
          </p>
          {user && !showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Comment
            </button>
          )}
          {!user && (
            <p className="text-sm text-base-content/60">
              <a href="/login" className="link">Sign in</a> to leave a comment
            </p>
          )}
        </div>
      )}
    </div>
  )
}