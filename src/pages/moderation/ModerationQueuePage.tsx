import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Shield, 
  Clock, 
  Check, 
  X, 
  Eye, 
  Flag, 
  User, 
  Calendar,
  MapPin,
  Piano as PianoIcon,
  BookOpen,
  Search,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { DataService } from '../../services/dataService'
// import type { Piano, Event, BlogPost } from '../../types'

interface ModerationItem {
  id: string
  type: 'piano' | 'event' | 'blog_post'
  title: string
  content: any
  author: {
    id: string
    name: string
    email: string
  }
  status: 'pending' | 'approved' | 'rejected'
  priority: 'low' | 'medium' | 'high'
  submitted_at: string
  reviewed_at?: string
  reviewed_by?: string
  rejection_reason?: string
  flags: number
}

export function ModerationQueuePage() {
  const { user } = useAuth()
  const { canModerate } = usePermissions()
  const [items, setItems] = useState<ModerationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [typeFilter, setTypeFilter] = useState<'all' | 'piano' | 'event' | 'blog_post'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest')

  useEffect(() => {
    const hasModeratePermission = canModerate()
    if (!hasModeratePermission) return
    loadModerationItems()
  }, [canModerate()])

  const loadModerationItems = async () => {
    try {
      // Fetch real pending moderation items
      const { pianos, events, blogPosts } = await DataService.getPendingModerationItems()
      
      const items: ModerationItem[] = [
        // Piano items
        ...pianos.map((piano) => ({
          id: piano.id, // Use the piano's UUID directly
          type: 'piano' as const,
          title: piano.name,
          content: piano,
          author: {
            id: piano.submitted_by || piano.created_by || 'unknown',
            name: 'Piano Enthusiast', // We'll need to join with users table to get real names
            email: 'user@example.com' // Placeholder - would need user data
          },
          status: piano.moderation_status as 'pending' | 'approved' | 'rejected',
          priority: 'medium' as const, // Default priority
          submitted_at: piano.created_at,
          reviewed_at: piano.updated_at !== piano.created_at ? piano.updated_at : undefined,
          reviewed_by: undefined, // Would need to track who reviewed
          rejection_reason: (piano as any).rejection_reason || undefined,
          flags: 0 // Default to no flags
        })),
        // Event items
        ...events.map((event) => ({
          id: event.id, // Use the event's UUID directly
          type: 'event' as const,
          title: event.title,
          content: event,
          author: {
            id: event.organizer_id || 'unknown',
            name: 'Event Organizer',
            email: 'organizer@example.com'
          },
          status: event.moderation_status as 'pending' | 'approved' | 'rejected',
          priority: 'medium' as const,
          submitted_at: event.created_at,
          reviewed_at: event.updated_at !== event.created_at ? event.updated_at : undefined,
          reviewed_by: undefined,
          rejection_reason: undefined,
          flags: 0
        })),
        // Blog post items
        ...blogPosts.map((post) => ({
          id: post.id, // Use the blog post's UUID directly
          type: 'blog_post' as const,
          title: post.title,
          content: post,
          author: {
            id: post.author_id || 'unknown',
            name: 'Blog Author',
            email: 'author@example.com'
          },
          status: post.moderation_status as 'pending' | 'approved' | 'rejected',
          priority: 'low' as const,
          submitted_at: post.created_at,
          reviewed_at: post.updated_at !== post.created_at ? post.updated_at : undefined,
          reviewed_by: undefined,
          rejection_reason: undefined,
          flags: 0
        }))
      ]

      setItems(items)
      console.log(`[MODERATION] Loaded ${items.length} moderation items (${pianos.length} pianos, ${events.length} events, ${blogPosts.length} blog posts)`)
    } catch (error) {
      console.error('Error loading moderation items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (itemId: string) => {
    try {
      // Find the item by ID to get its type
      const item = items.find(i => i.id === itemId)
      if (!item) {
        console.error('Item not found for approval:', itemId)
        return
      }
      
      if (item.type === 'piano' && user?.id) {
        const success = await DataService.updatePianoModerationStatus(itemId, 'approved', user.id)
        if (success) {
          setItems(prev => prev.map(prevItem => 
            prevItem.id === itemId 
              ? { 
                  ...prevItem, 
                  status: 'approved', 
                  reviewed_at: new Date().toISOString(),
                  reviewed_by: user?.id 
                }
              : prevItem
          ))
          console.log(`[MODERATION] Approved ${item.type} ${itemId}`)
        } else {
          console.error(`[MODERATION] Failed to approve ${item.type} ${itemId}`)
        }
      } else if (item.type === 'event' && user?.id) {
        const success = await DataService.updateEventModerationStatus(itemId, 'approved', user.id)
        if (success) {
          setItems(prev => prev.map(prevItem => 
            prevItem.id === itemId 
              ? { 
                  ...prevItem, 
                  status: 'approved', 
                  reviewed_at: new Date().toISOString(),
                  reviewed_by: user?.id 
                }
              : prevItem
          ))
          console.log(`[MODERATION] Approved ${item.type} ${itemId}`)
        } else {
          console.error(`[MODERATION] Failed to approve ${item.type} ${itemId}`)
        }
      } else {
        // For now, just update UI for blog posts only
        // TODO: Add similar method for blog posts
        setItems(prev => prev.map(prevItem => 
          prevItem.id === itemId 
            ? { 
                ...prevItem, 
                status: 'approved', 
                reviewed_at: new Date().toISOString(),
                reviewed_by: user?.id 
              }
            : prevItem
        ))
        console.log(`[MODERATION] UI-only approval for ${item.type} ${itemId}`)
      }
    } catch (error) {
      console.error('Error approving item:', error)
    }
  }

  const handleReject = async (itemId: string, reason: string) => {
    try {
      // Find the item by ID to get its type
      const item = items.find(i => i.id === itemId)
      if (!item) {
        console.error('Item not found for rejection:', itemId)
        return
      }
      
      if (item.type === 'piano' && user?.id) {
        const success = await DataService.updatePianoModerationStatus(itemId, 'rejected', user.id)
        if (success) {
          setItems(prev => prev.map(prevItem => 
            prevItem.id === itemId 
              ? { 
                  ...prevItem, 
                  status: 'rejected', 
                  reviewed_at: new Date().toISOString(),
                  reviewed_by: user?.id,
                  rejection_reason: reason
                }
              : prevItem
          ))
          console.log(`[MODERATION] Rejected ${item.type} ${itemId} with reason: ${reason}`)
        } else {
          console.error(`[MODERATION] Failed to reject ${item.type} ${itemId}`)
        }
      } else if (item.type === 'event' && user?.id) {
        const success = await DataService.updateEventModerationStatus(itemId, 'rejected', user.id)
        if (success) {
          setItems(prev => prev.map(prevItem => 
            prevItem.id === itemId 
              ? { 
                  ...prevItem, 
                  status: 'rejected', 
                  reviewed_at: new Date().toISOString(),
                  reviewed_by: user?.id,
                  rejection_reason: reason
                }
              : prevItem
          ))
          console.log(`[MODERATION] Rejected ${item.type} ${itemId} with reason: ${reason}`)
        } else {
          console.error(`[MODERATION] Failed to reject ${item.type} ${itemId}`)
        }
      } else {
        // For now, just update UI for blog posts only
        // TODO: Add similar method for blog posts
        setItems(prev => prev.map(prevItem => 
          prevItem.id === itemId 
            ? { 
                ...prevItem, 
                status: 'rejected', 
                reviewed_at: new Date().toISOString(),
                reviewed_by: user?.id,
                rejection_reason: reason
              }
            : prevItem
        ))
        console.log(`[MODERATION] UI-only rejection for ${item.type} ${itemId}`)
      }
    } catch (error) {
      console.error('Error rejecting item:', error)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesStatus = filter === 'all' || item.status === filter
    const matchesType = typeFilter === 'all' || item.type === typeFilter
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesStatus && matchesType && matchesSearch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      case 'newest':
      default:
        return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    }
  })

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'piano': return <PianoIcon className="w-4 h-4" />
      case 'event': return <Calendar className="w-4 h-4" />
      case 'blog_post': return <BookOpen className="w-4 h-4" />
      default: return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <div className="badge badge-warning gap-2"><Clock className="w-3 h-3" />Pending</div>
      case 'approved':
        return <div className="badge badge-success gap-2"><Check className="w-3 h-3" />Approved</div>
      case 'rejected':
        return <div className="badge badge-error gap-2"><X className="w-3 h-3" />Rejected</div>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <div className="badge badge-error badge-outline">High</div>
      case 'medium':
        return <div className="badge badge-warning badge-outline">Medium</div>
      case 'low':
        return <div className="badge badge-ghost">Low</div>
      default:
        return null
    }
  }

  if (!canModerate()) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-base-content/70">You don't have permission to access the moderation queue.</p>
          <Link to="/" className="btn btn-primary mt-4">Go Home</Link>
        </div>
      </div>
    )
  }

  const pendingCount = items.filter(item => item.status === 'pending').length
  const flaggedCount = items.filter(item => item.flags > 0).length

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Moderation Queue</h1>
              <p className="opacity-90">Review and manage community contributions</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{pendingCount}</div>
              <div className="text-sm opacity-90">Pending Review</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{flaggedCount}</div>
              <div className="text-sm opacity-90">Flagged Items</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{items.filter(i => i.status === 'approved').length}</div>
              <div className="text-sm opacity-90">Approved Today</div>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <div className="text-2xl font-bold">{items.length}</div>
              <div className="text-sm opacity-90">Total Items</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search by title or author..."
                  className="input input-bordered w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filters */}
              <div className="flex gap-2">
                <select
                  className="select select-bordered"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  className="select select-bordered"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                >
                  <option value="all">All Types</option>
                  <option value="piano">Pianos</option>
                  <option value="event">Events</option>
                  <option value="blog_post">Blog Posts</option>
                </select>

                <select
                  className="select select-bordered"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priority">By Priority</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Moderation Items */}
        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <ModerationCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
                getTypeIcon={getTypeIcon}
                getStatusBadge={getStatusBadge}
                getPriorityBadge={getPriorityBadge}
              />
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
                <h3 className="text-2xl font-bold mb-2">No Items Found</h3>
                <p className="text-base-content/70">
                  {searchQuery || filter !== 'all' || typeFilter !== 'all'
                    ? 'Try adjusting your filters.'
                    : 'All caught up! No items need moderation right now.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

interface ModerationCardProps {
  item: ModerationItem
  onApprove: (id: string) => void
  onReject: (id: string, reason: string) => void
  getTypeIcon: (type: string) => React.ReactNode
  getStatusBadge: (status: string) => React.ReactNode
  getPriorityBadge: (priority: string) => React.ReactNode
}

function ModerationCard({ 
  item, 
  onApprove, 
  onReject, 
  getTypeIcon, 
  getStatusBadge, 
  getPriorityBadge 
}: ModerationCardProps) {
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  const handleRejectSubmit = () => {
    if (rejectReason.trim()) {
      onReject(item.id, rejectReason)
      setShowRejectModal(false)
      setRejectReason('')
    }
  }

  return (
    <>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            {/* Content Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {getTypeIcon(item.type)}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                {item.flags > 0 && (
                  <div className="badge badge-warning gap-1">
                    <Flag className="w-3 h-3" />
                    {item.flags} flags
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-base-content/70 mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {item.author.name}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(item.submitted_at).toLocaleDateString()}
                </div>
                {item.content.location_name && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {item.content.location_name}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mb-3">
                {getStatusBadge(item.status)}
                {getPriorityBadge(item.priority)}
              </div>

              {/* Content Preview */}
              <div className="text-sm text-base-content/80">
                {item.type === 'piano' && (
                  <div>
                    <strong>Category:</strong> {item.content.category} • 
                    <strong> Condition:</strong> {item.content.condition}
                    {item.content.description && (
                      <div className="mt-1">
                        <strong>Description:</strong> {item.content.description.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                )}
                {item.type === 'event' && (
                  <div>
                    <strong>Date:</strong> {new Date(item.content.date).toLocaleDateString()} • 
                    <strong> Category:</strong> {item.content.category}
                    {item.content.description && (
                      <div className="mt-1">
                        <strong>Description:</strong> {item.content.description.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                )}
                {item.type === 'blog_post' && (
                  <div>
                    <strong>Category:</strong> {item.content.category}
                    {item.content.excerpt && (
                      <div className="mt-1">
                        <strong>Excerpt:</strong> {item.content.excerpt.substring(0, 100)}...
                      </div>
                    )}
                  </div>
                )}
              </div>

              {item.rejection_reason && (
                <div className="alert alert-error mt-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span><strong>Rejection Reason:</strong> {item.rejection_reason}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 min-w-fit">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="btn btn-outline btn-sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                {showDetails ? 'Hide' : 'View'} Details
              </button>

              {item.status === 'pending' && (
                <>
                  <button
                    onClick={() => onApprove(item.id)}
                    className="btn btn-success btn-sm"
                  >
                    <Check className="w-4 h-4 mr-1" />
                    Approve
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="btn btn-error btn-sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Reject
                  </button>
                </>
              )}

              <Link
                to={`/${item.type === 'blog_post' ? 'blog' : item.type === 'piano' ? 'pianos' : 'events'}/${item.id}`}
                className="btn btn-ghost btn-sm"
              >
                View Live
              </Link>
            </div>
          </div>

          {/* Detailed View */}
          {showDetails && (
            <div className="mt-4 pt-4 border-t border-base-300">
              <div className="bg-base-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Full Details</h4>
                <pre className="text-xs text-base-content/80 whitespace-pre-wrap overflow-x-auto">
                  {JSON.stringify(item.content, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Reject Item</h3>
            <p className="mb-4">Please provide a reason for rejecting this submission:</p>
            
            <textarea
              className="textarea textarea-bordered w-full h-24 mb-4"
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            
            <div className="modal-action">
              <button
                onClick={() => setShowRejectModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectSubmit}
                className="btn btn-error"
                disabled={!rejectReason.trim()}
              >
                Reject Item
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}