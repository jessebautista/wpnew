import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpen, Search, User, Calendar, Filter, Plus, Eye, Heart, MessageCircle, Tag, Clock, Check, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { DataService } from '../../services/dataService'
import { usePermissions } from '../../hooks/usePermissions'
import type { BlogPost } from '../../types'


export function BlogPage() {
  const { canCreate } = usePermissions()
  const [searchParams, setSearchParams] = useSearchParams()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('category') || '')
  const [selectedTag, setSelectedTag] = useState<string>(searchParams.get('tag') || '')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await DataService.getBlogPosts()
        setPosts(data)
      } catch (error) {
        console.error('Error loading blog posts:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const filteredPosts = posts.filter(post => {
    // Text search
    const matchesSearch = searchQuery === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    // Category filter
    const matchesCategory = selectedCategory === '' || post.category === selectedCategory

    // Tag filter
    const matchesTag = selectedTag === '' || 
      (post.tags && post.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase()))

    // Only show published posts
    const isPublished = post.published

    return matchesSearch && matchesCategory && matchesTag && isPublished
  }).sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case 'popular':
        // Mock popularity based on random factor - in real app would use actual metrics
        return Math.random() - 0.5
      case 'newest':
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  // Get all unique tags from posts with counts for popularity
  const allTagsWithCounts = posts.reduce((acc, post) => {
    if (post.tags) {
      post.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1
      })
    }
    return acc
  }, {} as Record<string, number>)
  
  // Sort tags by popularity (count) and get top tags
  const popularTags = Object.entries(allTagsWithCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 12)
    .map(([tag]) => tag)

  // Get dynamic categories from actual posts
  const actualCategories = Array.from(new Set(posts.map(post => post.category).filter(Boolean))).sort()

  // Get category post counts using actual categories
  const categoryCounts = actualCategories.reduce((acc, category) => {
    acc[category] = posts.filter(post => post.category === category && post.published).length
    return acc
  }, {} as Record<string, number>)

  // Pagination calculations
  const totalPosts = filteredPosts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const currentPosts = filteredPosts.slice(startIndex, endIndex)

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setSelectedTag('') // Clear tag filter when selecting category
    setCurrentPage(1) // Reset to first page when filtering
    const newParams = new URLSearchParams(searchParams)
    if (category) {
      newParams.set('category', category)
    } else {
      newParams.delete('category')
    }
    newParams.delete('tag')
    setSearchParams(newParams)
  }

  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag)
    setSelectedCategory('') // Clear category filter when selecting tag
    setCurrentPage(1) // Reset to first page when filtering
    const newParams = new URLSearchParams(searchParams)
    if (tag) {
      newParams.set('tag', tag)
    } else {
      newParams.delete('tag')
    }
    newParams.delete('category')
    setSearchParams(newParams)
  }

  const clearFilters = () => {
    setSelectedCategory('')
    setSelectedTag('')
    setCurrentPage(1) // Reset to first page when clearing filters
    setSearchParams(new URLSearchParams())
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get moderation status badge
  const getModerationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <div className="badge badge-warning badge-sm gap-1"><Clock className="w-3 h-3" />Pending</div>
      case 'approved':
        return <div className="badge badge-success badge-sm gap-1"><Check className="w-3 h-3" />Approved</div>
      case 'rejected':
        return <div className="badge badge-error badge-sm gap-1"><AlertTriangle className="w-3 h-3" />Rejected</div>
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div 
        className="bg-accent text-accent-content py-12 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('/hero.png')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <BookOpen className="inline w-8 h-8 mr-3" />
            Piano Blog
          </h1>
          <p className="text-xl text-white">Stories, news, and insights from the world of public pianos</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-base-200 py-6">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
            <div className="relative flex-1 max-w-md lg:max-w-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Search posts, categories, or tags..."
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-base-content/70" />
              <span className="text-sm font-medium text-base-content/70">Filters:</span>
            </div>
            
            <select
              className="select select-bordered select-sm"
              value={selectedCategory}
              onChange={(e) => handleCategorySelect(e.target.value)}
            >
              <option value="">All Categories</option>
              {actualCategories.map((category) => (
                <option key={category} value={category}>
                  {category} ({categoryCounts[category] || 0})
                </option>
              ))}
            </select>

            <select
              className="select select-bordered select-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
            </select>

            {(selectedCategory || selectedTag) && (
              <button
                onClick={clearFilters}
                className="btn btn-ghost btn-sm"
              >
                Clear filters
              </button>
            )}

            {/* Active Filters Display */}
            {selectedCategory && (
              <div className="badge badge-secondary gap-2">
                Category: {selectedCategory}
                <button onClick={() => handleCategorySelect('')} className="text-xs">×</button>
              </div>
            )}
            {selectedTag && (
              <div className="badge badge-accent gap-2">
                Tag: {selectedTag}
                <button onClick={() => handleTagSelect('')} className="text-xs">×</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div>
            {/* Results Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <p className="text-base-content/70">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalPosts)} of {totalPosts} posts
                  {(selectedCategory || selectedTag) && " with applied filters"}
                  {totalPages > 1 && (
                    <span className="ml-2 text-sm">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="space-y-8">
                  {currentPosts.map((post) => (
                    <article key={post.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                      {post.featured_image && (
                        <figure>
                          <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover" />
                        </figure>
                      )}
                      <div className="card-body">
                        <div className="flex items-center gap-4 text-sm text-base-content/70 mb-3">
                          {post.category && (
                            <button
                              onClick={() => handleCategorySelect(post.category || '')}
                              className="badge badge-primary hover:badge-primary-focus cursor-pointer"
                            >
                              {post.category}
                            </button>
                          )}
                          {post.moderation_status && getModerationStatusBadge(post.moderation_status)}
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-1" />
                            {post.author?.full_name || 'WorldPianos Team'}
                          </div>
                        </div>
                        
                        <h2 className="card-title text-2xl mb-3">
                          <Link to={`/blog/${post.id}`} className="hover:link">
                            {post.title}
                          </Link>
                        </h2>
                        
                        <p className="text-base-content/80 leading-relaxed mb-4">
                          {post.excerpt || post.content.substring(0, 200) + '...'}
                        </p>
                        
                        {/* Post Metrics */}
                        <div className="flex items-center gap-4 text-sm text-base-content/50 mb-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {Math.floor(Math.random() * 500) + 50} views
                          </div>
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {Math.floor(Math.random() * 50) + 5} likes
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {Math.floor(Math.random() * 20)} comments
                          </div>
                        </div>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag, index) => (
                              <button
                                key={index}
                                onClick={() => handleTagSelect(tag)}
                                className="badge badge-outline badge-sm hover:badge-accent cursor-pointer"
                              >
                                {tag}
                              </button>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="badge badge-ghost badge-sm">
                                +{post.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="card-actions justify-between items-center">
                          <div className="text-sm text-base-content/50">
                            {Math.ceil(post.content.split(' ').length / 200)} min read
                          </div>
                          <Link to={`/blog/${post.id}`} className="btn btn-primary">
                            Read More
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && currentPosts.length > 0 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-sm"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        // Show first, last, current, and pages around current
                        const showPage = 
                          page === 1 || 
                          page === totalPages || 
                          Math.abs(page - currentPage) <= 1
                        
                        if (!showPage && page === 2 && currentPage > 4) {
                          return <span key={page} className="px-2">...</span>
                        }
                        if (!showPage && page === totalPages - 1 && currentPage < totalPages - 3) {
                          return <span key={page} className="px-2">...</span>
                        }
                        if (!showPage) return null
                        
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`btn btn-sm ${
                              currentPage === page 
                                ? 'btn-primary' 
                                : 'btn-outline'
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-sm"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {totalPosts === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
                    <h3 className="text-2xl font-bold mb-2">No Posts Found</h3>
                    <p className="text-base-content/70 mb-4">
                      {searchQuery || selectedCategory || selectedTag
                        ? 'Try adjusting your search terms or filters.'
                        : 'No blog posts available yet.'}
                    </p>
                    {canCreate() && (
                      <Link to="/blog/new" className="btn btn-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Write the First Post
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Categories */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Categories</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleCategorySelect('')}
                        className={`btn btn-ghost btn-sm w-full justify-between ${
                          !selectedCategory ? 'btn-active' : ''
                        }`}
                      >
                        <span>All Categories</span>
                        <span className="badge badge-neutral badge-sm">
                          {posts.filter(p => p.published).length}
                        </span>
                      </button>
                      {actualCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => handleCategorySelect(category)}
                          className={`btn btn-ghost btn-sm w-full justify-between ${
                            selectedCategory === category ? 'btn-active' : ''
                          }`}
                        >
                          <span>{category}</span>
                          <span className="badge badge-neutral badge-sm">
                            {categoryCounts[category] || 0}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popular Tags */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title mb-4">
                      <Tag className="w-5 h-5" />
                      Popular Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {popularTags.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => handleTagSelect(tag)}
                          className={`badge badge-outline hover:badge-primary cursor-pointer ${
                            selectedTag === tag ? 'badge-primary' : ''
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Posts */}
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title mb-4">Recent Posts</h3>
                    <div className="space-y-4">
                      {posts.slice(0, 5).map((post) => (
                        <div key={post.id} className="flex gap-3">
                          {post.featured_image && (
                            <div className="w-16 h-12 bg-base-200 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={post.featured_image} 
                                alt="" 
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <Link 
                              to={`/blog/${post.id}`}
                              className="font-medium text-sm hover:link line-clamp-2"
                            >
                              {post.title}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-base-content/50 mt-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(post.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}