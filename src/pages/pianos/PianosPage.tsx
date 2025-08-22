import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Piano, Map, List, Search, Filter, CheckCircle, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { DataService } from '../../services/dataService'
import { PianoCard } from '../../components/piano'
import type { Piano as PianoType } from '../../types'

interface Filters {
  location: string
  source: string
}

export function PianosPage() {
  const location = useLocation()
  const [pianos, setPianos] = useState<PianoType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  )
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    location: '',
    source: ''
  })
  const pianosPerPage = 12

  useEffect(() => {
    const loadPianos = async () => {
      try {
        const data = await DataService.getPianos()
        setPianos(data)
      } catch (error) {
        console.error('Error loading pianos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPianos()
  }, [])

  const filteredPianos = pianos.filter(piano => {
    // Search filter - updated for new schema
    const matchesSearch = searchQuery === '' || (
      piano.piano_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (piano.location_display_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (piano.artist_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (piano.piano_statement || '').toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Location filter - updated for new schema
    const matchesLocation = filters.location === '' || 
      (piano.location_display_name || '').toLowerCase().includes(filters.location.toLowerCase()) ||
      (piano.public_location_name || '').toLowerCase().includes(filters.location.toLowerCase()) ||
      (piano.permanent_home_name || '').toLowerCase().includes(filters.location.toLowerCase())

    // Source filter (source filter now filters by source: SFH vs user-submitted)
    const matchesCategory = filters.source === '' || piano.piano_source === filters.source

    return matchesSearch && matchesLocation && matchesCategory
  })

  // Reset to first page when search query or filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filters])

  // Pagination calculations
  const totalPianos = filteredPianos.length
  const totalPages = Math.ceil(totalPianos / pianosPerPage)
  const startIndex = (currentPage - 1) * pianosPerPage
  const endIndex = startIndex + pianosPerPage
  const currentPianos = filteredPianos.slice(startIndex, endIndex)

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Get unique locations and sources for filter options
  const uniqueLocations = Array.from(new Set(pianos.map(p => p.location_display_name || 'Unknown'))).sort()
  const uniqueSources = [
    { value: 'sing_for_hope', label: 'Sing for Hope' },
    { value: 'user_submitted', label: 'Community Submitted' }
  ]

  // Clear all filters
  const clearFilters = () => {
    setFilters({ location: '', source: '' })
    setSearchQuery('')
  }

  // Check if any filters are active
  const hasActiveFilters = filters.location !== '' || filters.source !== '' || searchQuery !== ''

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div 
        className="bg-primary text-primary-content py-12 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('/hero-pianos.png')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <Piano className="inline w-8 h-8 mr-3" />
            Public Pianos Directory
          </h1>
          <p className="text-xl text-white">Discover playable pianos around the world</p>
        </div>
      </div>

      {/* Success Message Banner */}
      {successMessage && (
        <div className="bg-success text-success-content py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6" />
                <span className="font-medium">{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="btn btn-ghost btn-sm"
                aria-label="Close message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-base-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Search pianos by name, location, or source..."
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="join">
              <button
                className={`btn join-item btn-active`}
              >
                <List className="w-4 h-4 mr-2" />
                List
              </button>
              <Link 
                to="/pianos/map"
                className="btn join-item"
              >
                <Map className="w-4 h-4 mr-2" />
                Map
              </Link>
            </div>

            {/* Filters */}
            <button 
              className={`btn ${hasActiveFilters ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setShowFilters(true)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="badge badge-neutral badge-sm ml-2">
                  {[filters.location, filters.source, searchQuery].filter(f => f !== '').length}
                </span>
              )}
            </button>
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
                  Showing {startIndex + 1}-{Math.min(endIndex, totalPianos)} of {totalPianos} pianos
                  {searchQuery && " with applied search"}
                  {totalPages > 1 && (
                    <span className="ml-2 text-sm">
                      (Page {currentPage} of {totalPages})
                    </span>
                  )}
                </p>
                {totalPianos !== pianos.length && (
                  <p className="text-sm text-base-content/50 mt-1">
                    {pianos.length} total pianos in database
                  </p>
                )}
              </div>
            </div>

            {/* Piano Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentPianos.map((piano) => (
                <PianoCard key={piano.id} piano={piano} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && currentPianos.length > 0 && (
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

            {/* Empty State */}
            {totalPianos === 0 && (
              <div className="text-center py-12">
                <Piano className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
                <h3 className="text-2xl font-bold mb-2">No Pianos Found</h3>
                <p className="text-base-content/70 mb-4">
                  {searchQuery
                    ? 'Try adjusting your search terms.'
                    : 'No pianos have been added yet.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-base-100 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Filter Pianos</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              {/* Location Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Location</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                >
                  <option value="">All Locations</option>
                  {uniqueLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Category</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={filters.source}
                  onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                >
                  <option value="">All Categories</option>
                  {uniqueSources.map(source => (
                    <option key={source.value} value={source.value}>{source.label}</option>
                  ))}
                </select>
              </div>

              {/* Current Filters Summary */}
              {hasActiveFilters && (
                <div className="bg-base-200 rounded-lg p-4">
                  <h4 className="font-medium mb-2">Active Filters:</h4>
                  <div className="space-y-1 text-sm">
                    {searchQuery && (
                      <div className="flex items-center gap-2">
                        <span className="text-base-content/70">Search:</span>
                        <span className="badge badge-outline">"{searchQuery}"</span>
                      </div>
                    )}
                    {filters.location && (
                      <div className="flex items-center gap-2">
                        <span className="text-base-content/70">Location:</span>
                        <span className="badge badge-outline">{filters.location}</span>
                      </div>
                    )}
                    {filters.source && (
                      <div className="flex items-center gap-2">
                        <span className="text-base-content/70">Category:</span>
                        <span className="badge badge-outline">
                          {uniqueSources.find(s => s.value === filters.source)?.label || filters.source}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 p-6 border-t">
              <button
                onClick={clearFilters}
                className="btn btn-outline flex-1"
                disabled={!hasActiveFilters}
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="btn btn-primary flex-1"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}