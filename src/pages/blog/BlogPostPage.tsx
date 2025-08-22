import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  Calendar, 
  Tag, 
  Heart, 
  ChevronLeft,
  Eye,
  Clock,
  Edit,
  Flag
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { DataService } from '../../services/dataService'
import { CommentSection } from '../../components/comments/CommentSection'
import { ShareButton } from '../../components/social/ShareButton'
import { SocialSharingService } from '../../services/socialSharingService'
import type { BlogPost } from '../../types'

export function BlogPostPage() {
  const { id } = useParams<{ id: string }>()
  const { } = useAuth()
  const { canEdit } = usePermissions()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [viewCount, setViewCount] = useState(0)

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return

      try {
        console.log('Loading blog post with ID:', id)
        const foundPost = await DataService.getBlogPostById(id)
        if (foundPost) {
          setPost(foundPost)
          setLikeCount(Math.floor(Math.random() * 100) + 10) // Mock like count for now
          setViewCount(foundPost.view_count || Math.floor(Math.random() * 1000) + 50) // Use real view count if available
        } else {
          console.warn('Blog post not found:', id)
        }
      } catch (error) {
        console.error('Error loading blog post:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [id])

  const handleLikeToggle = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const getShareData = () => {
    if (!post) return null
    
    return SocialSharingService.generateShareData({
      type: 'blog_post',
      id: post.id,
      title: post.title,
      description: post.excerpt || undefined,
      author: post.author?.full_name || undefined,
      image: post.featured_image || undefined
    })
  }


  const estimatedReadTime = (content: string) => {
    // Strip HTML tags first, then calculate reading time
    const tmp = document.createElement('div')
    tmp.innerHTML = content
    const plainText = tmp.textContent || tmp.innerText || ''
    const wordsPerMinute = 200
    const wordCount = plainText.split(' ').length
    return Math.ceil(wordCount / wordsPerMinute)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link to="/blog" className="btn btn-primary">Back to Blog</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-accent to-secondary text-accent-content py-8">
        <div className="container mx-auto px-4">
          <Link to="/blog" className="btn btn-ghost btn-sm mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl mx-auto">
            {/* Category and Meta Info */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              {post.category && (
                <span className="badge badge-lg badge-primary">{post.category}</span>
              )}
              <div className="flex items-center text-sm opacity-90">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="flex items-center text-sm opacity-90">
                <Clock className="w-4 h-4 mr-1" />
                {estimatedReadTime(post.content)} min read
              </div>
              <div className="flex items-center text-sm opacity-90">
                <Eye className="w-4 h-4 mr-1" />
                {viewCount} views
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              {post.title}
            </h1>

            {/* Author and Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-accent-content text-accent rounded-full w-12">
                    {post.author?.avatar_url ? (
                      <img src={post.author.avatar_url} alt="Author" />
                    ) : (
                      <span className="text-sm font-bold">
                        {post.author?.full_name?.[0] || 'A'}
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="font-semibold">
                    {post.author?.full_name || 'WorldPianos Team'}
                  </div>
                  {post.author?.bio && (
                    <div className="text-sm opacity-90">{post.author.bio}</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={handleLikeToggle}
                  className={`btn btn-sm ${isLiked ? 'btn-error' : 'btn-ghost'}`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {likeCount}
                </button>
                
                {getShareData() && (
                  <ShareButton
                    shareData={getShareData()!}
                    contentType="blog_post"
                    contentId={post.id}
                    variant="button"
                    size="sm"
                    className="btn-ghost"
                  />
                )}
                
                {canEdit(post.author_id) && (
                  <button className="btn btn-ghost btn-sm">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                )}
                
                <button className="btn btn-ghost btn-sm">
                  <Flag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <article className="prose prose-lg max-w-none">
              {/* Featured Image */}
              {post.featured_image && (
                <figure className="mb-8">
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    className="w-full h-64 md:h-96 object-cover rounded-lg shadow-xl"
                  />
                </figure>
              )}

              {/* Excerpt */}
              {post.excerpt && (
                <div className="text-xl text-base-content/80 font-medium mb-8 p-6 bg-base-200 rounded-lg border-l-4 border-primary">
                  {post.excerpt}
                </div>
              )}

              {/* Content */}
              <div className="text-base-content/90 leading-relaxed">
                {/* Render HTML content from database */}
                <div 
                  className="prose prose-lg max-w-none prose-headings:text-base-content prose-p:text-base-content/90 prose-a:text-primary prose-strong:text-base-content prose-ul:text-base-content prose-ol:text-base-content"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-base-300">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-base-content/70" />
                    <span className="text-sm font-medium text-base-content/70">Tags:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <Link
                        key={index}
                        to={`/blog?tag=${encodeURIComponent(tag)}`}
                        className="badge badge-outline hover:badge-primary transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* Comments Section */}
            <div className="mt-12 pt-8 border-t border-base-300">
              <CommentSection
                contentType="blog_post"
                contentId={post.id}
                allowComments={post.allow_comments}
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Author Bio */}
            {post.author && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-12">
                        {post.author.avatar_url ? (
                          <img src={post.author.avatar_url} alt="Author" />
                        ) : (
                          <span>{post.author.full_name?.[0] || 'A'}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{post.author.full_name}</h3>
                      {post.author.location && (
                        <p className="text-sm text-base-content/70">{post.author.location}</p>
                      )}
                    </div>
                  </div>
                  {post.author.bio && (
                    <p className="text-sm text-base-content/80">{post.author.bio}</p>
                  )}
                </div>
              </div>
            )}

            {/* Related Posts - TODO: Implement with real data */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Related Posts</h3>
                <div className="space-y-3">
                  <p className="text-sm text-base-content/70">Related posts coming soon...</p>
                </div>
              </div>
            </div>

            {/* Share Widget */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title">Share This Post</h3>
                {getShareData() && (
                  <ShareButton
                    shareData={getShareData()!}
                    contentType="blog_post"
                    contentId={post.id}
                    variant="inline"
                    showLabel={false}
                  />
                )}
                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={handleLikeToggle}
                    className={`btn btn-sm ${isLiked ? 'btn-error' : 'btn-outline'}`}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'Liked' : 'Like'} ({likeCount})
                  </button>
                  <div className="text-sm text-base-content/60">
                    {viewCount} views
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}