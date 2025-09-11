import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Calendar,
  Tag,
  User,
  Search,
  Filter,
  Save,
  X,
  ChevronLeft,
  BarChart3,
  Globe,
  FileText,
  Settings
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { DataService } from '../../services/dataService'
import { blogPostSchema, type BlogPostFormData, generateSlug, generateExcerpt, calculateReadingTime } from '../../schemas/blogSchema'
import type { BlogPost } from '../../types'

export function BlogManagementPage() {
  const { user } = useAuth()
  const { canAccessAdminPanel } = usePermissions()
  const navigate = useNavigate()
  
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all')
  const [showEditor, setShowEditor] = useState(false)
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      published: false,
      featured: false,
      allow_comments: true,
      tags: []
    }
  })

  const watchedTitle = watch('title')
  const watchedContent = watch('content')

  // Auto-generate slug from title
  useEffect(() => {
    if (watchedTitle && !editingPost) {
      const slug = generateSlug(watchedTitle)
      setValue('slug', slug)
    }
  }, [watchedTitle, setValue, editingPost])

  // Auto-generate excerpt from content
  useEffect(() => {
    if (watchedContent && !watch('excerpt')) {
      const excerpt = generateExcerpt(watchedContent)
      setValue('excerpt', excerpt)
    }
  }, [watchedContent, setValue, watch])

  // Access control
  if (!user || !canAccessAdminPanel()) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-base-content/70 mb-4">You need admin permissions to access blog management.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    )
  }

  // Load posts
  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await DataService.getAllBlogPosts()
      setPosts(data)
    } catch (error) {
      console.error('Error loading blog posts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === '' || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.author?.full_name || '').toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'published' && post.published) ||
      (statusFilter === 'draft' && !post.published)

    return matchesSearch && matchesStatus
  })

  // Handle form submission
  const onSubmit = async (data: BlogPostFormData) => {
    try {
      // Add computed fields
      const postData = {
        ...data,
        author_id: user!.id,
        reading_time: calculateReadingTime(data.content),
        excerpt: data.excerpt || generateExcerpt(data.content)
      }

      if (editingPost) {
        await DataService.updateBlogPost(editingPost.id, postData)
      } else {
        await DataService.createBlogPost(postData)
      }

      setShowEditor(false)
      setEditingPost(null)
      reset()
      loadPosts()
    } catch (error) {
      console.error('Error saving blog post:', error)
    }
  }

  // Handle edit
  const handleEdit = (post: BlogPost) => {
    setEditingPost(post)
    reset({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt || '',
      featured_image: post.featured_image || '',
      category: post.category || '',
      tags: post.tags || [],
      published: post.published,
      featured: post.featured,
      allow_comments: post.allow_comments,
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || ''
    })
    setShowEditor(true)
  }

  // Handle delete
  const handleDelete = async (post: BlogPost) => {
    if (!confirm(`Are you sure you want to delete "${post.title}"?`)) return

    try {
      await DataService.deleteBlogPost(post.id)
      loadPosts()
    } catch (error) {
      console.error('Error deleting blog post:', error)
    }
  }

  // Handle new post
  const handleNewPost = () => {
    setEditingPost(null)
    reset({
      published: false,
      featured: false,
      allow_comments: true,
      tags: []
    })
    setShowEditor(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading blog management...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {!showEditor ? (
        // Post List View
        <>
          {/* Header */}
          <div className="bg-primary text-primary-content py-6">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link to="/admin" className="btn btn-ghost btn-sm">
                    <ChevronLeft className="w-4 h-4" />
                    Back to Admin
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold flex items-center">
                      <BookOpen className="w-8 h-8 mr-3" />
                      Blog Management
                    </h1>
                    <p className="text-primary-content/80 mt-1">
                      Manage blog posts and content
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleNewPost}
                  className="btn btn-accent"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </button>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-base-200 py-4">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="input input-bordered w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <select 
                    className="select select-bordered select-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                  >
                    <option value="all">All Posts</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="container mx-auto px-4 py-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-base-content/30 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
                <p className="text-base-content/70 mb-6">
                  {posts.length === 0 ? 'Get started by creating your first blog post.' : 'Try adjusting your search or filters.'}
                </p>
                {posts.length === 0 && (
                  <button onClick={handleNewPost} className="btn btn-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h2 className="card-title">{post.title}</h2>
                            {post.published ? (
                              <div className="badge badge-success gap-1">
                                <Eye className="w-3 h-3" />
                                Published
                              </div>
                            ) : (
                              <div className="badge badge-warning gap-1">
                                <EyeOff className="w-3 h-3" />
                                Draft
                              </div>
                            )}
                            {post.featured && (
                              <div className="badge badge-accent">Featured</div>
                            )}
                          </div>
                          
                          <p className="text-base-content/70 mb-3">
                            {post.excerpt || 'No excerpt available'}
                          </p>
                          
                          <div className="flex items-center gap-4 text-sm text-base-content/60">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {post.author?.full_name || 'Unknown Author'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(post.created_at).toLocaleDateString()}
                            </div>
                            {post.view_count > 0 && (
                              <div className="flex items-center gap-1">
                                <BarChart3 className="w-4 h-4" />
                                {post.view_count} views
                              </div>
                            )}
                          </div>
                          
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <div key={tag} className="badge badge-outline badge-sm">
                                  {tag}
                                </div>
                              ))}
                              {post.tags.length > 3 && (
                                <div className="badge badge-outline badge-sm">
                                  +{post.tags.length - 3} more
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(post)}
                            className="btn btn-ghost btn-sm"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post)}
                            className="btn btn-ghost btn-sm text-error"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        // Editor View
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Editor Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditor(false)
                      setEditingPost(null)
                      reset()
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <h1 className="text-2xl font-bold">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </h1>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Post'}
                  </button>
                </div>
              </div>

              {/* Basic Info */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-4">Basic Information</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Title *</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
                        placeholder="Enter post title"
                        {...register('title')}
                      />
                      {errors.title && (
                        <div className="text-sm text-error mt-1">
                          {errors.title.message}
                        </div>
                      )}
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Slug *</span>
                      </label>
                      <input
                        type="text"
                        className={`input input-bordered ${errors.slug ? 'input-error' : ''}`}
                        placeholder="post-url-slug"
                        {...register('slug')}
                      />
                      {errors.slug && (
                        <div className="text-sm text-error mt-1">
                          {errors.slug.message}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Content *</span>
                    </label>
                    <textarea
                      className={`textarea textarea-bordered h-64 ${errors.content ? 'textarea-error' : ''}`}
                      placeholder="Write your blog post content here... (HTML is supported)"
                      {...register('content')}
                    />
                    {errors.content && (
                      <div className="text-sm text-error mt-1">
                        {errors.content.message}
                      </div>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Excerpt</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      placeholder="Brief summary of the post (auto-generated if left empty)"
                      {...register('excerpt')}
                    />
                    {errors.excerpt && (
                      <div className="text-sm text-error mt-1">
                        {errors.excerpt.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Publishing Options */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title mb-4">Publishing Options</h3>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Published</span>
                        <input
                          type="checkbox"
                          className="checkbox"
                          {...register('published')}
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Featured</span>
                        <input
                          type="checkbox"
                          className="checkbox"
                          {...register('featured')}
                        />
                      </label>
                    </div>

                    <div className="form-control">
                      <label className="label cursor-pointer">
                        <span className="label-text">Allow Comments</span>
                        <input
                          type="checkbox"
                          className="checkbox"
                          {...register('allow_comments')}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}