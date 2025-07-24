import { CommentItem } from './CommentItem'
import type { Comment, User } from '../../types'

interface CommentListProps {
  comments: Comment[]
  currentUser: User | null
  onUpdate: (commentId: string, content: string) => Promise<void>
  onDelete: (commentId: string) => Promise<void>
}

export function CommentList({ comments, currentUser, onUpdate, onDelete }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          currentUser={currentUser}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}