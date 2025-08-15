import { useState } from 'react'
import { Edit, Trash2, User as UserIcon } from 'lucide-react'
import { usePermissions } from '../../hooks/usePermissions'
import { CommentForm } from './CommentForm'
import type { Comment, User } from '../../types'

interface CommentItemProps {
  comment: Comment
  currentUser: User | null
  onUpdate: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

export function CommentItem({ comment, currentUser, onUpdate, onDelete }: CommentItemProps) {
  const { canModerate } = usePermissions()
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const canEdit = currentUser && (currentUser.id === comment.author_id || canModerate())
  const canDeleteComment = currentUser && (currentUser.id === comment.author_id || canModerate())

  const handleUpdate = async (content: string) => {
    try {
      setIsUpdating(true)
      await onUpdate(comment.id, content)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating comment:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    try {
      await onDelete(comment.id)
      setShowDeleteConfirm(false)
    } catch (error) {
      console.error('Error deleting comment:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60)
      return diffInMinutes <= 1 ? 'just now' : `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 48) {
      return 'yesterday'
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="flex gap-3 p-4 bg-base-200 rounded-lg">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div className="avatar placeholder">
          <div className="bg-neutral text-neutral-content rounded-full w-10">
            {comment.author?.avatar_url ? (
              <img src={comment.author.avatar_url} alt="Avatar" />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </div>
        </div>
      </div>

      {/* Comment Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">
              {comment.author?.full_name || comment.author?.email || 'Unknown User'}
            </span>
            <span className="text-xs text-base-content/60">
              {formatDate(comment.created_at)}
              {comment.updated_at !== comment.created_at && (
                <span className="ml-1">(edited)</span>
              )}
            </span>
          </div>
          
          {/* Actions */}
          {(canEdit || canDeleteComment) && !isEditing && (
            <div className="flex items-center gap-1">
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn btn-ghost btn-xs"
                  title="Edit comment"
                >
                  <Edit className="w-3 h-3" />
                </button>
              )}
              {canDeleteComment && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="btn btn-ghost btn-xs text-error"
                  title="Delete comment"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Comment Content */}
        {isEditing ? (
          <CommentForm
            initialValue={comment.content}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            submitting={isUpdating}
            placeholder="Edit your comment..."
            submitText="Save Changes"
          />
        ) : (
          <div className="text-sm text-base-content/90 whitespace-pre-wrap">
            {comment.content}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Delete Comment</h3>
            <p className="mb-4">
              Are you sure you want to delete this comment? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-error"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}