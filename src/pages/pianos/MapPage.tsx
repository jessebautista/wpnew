import { useState, useEffect } from 'react'
import { PianoMap } from '../../components/map/PianoMap'
import { pianoService } from '../../utils/database'
import type { Piano } from '../../types'
import { Map, Search, Filter, Locate, List } from 'lucide-react'
import { Link } from 'react-router-dom'

export function MapPage() {
  const [pianos, setPianos] = useState<Piano[]>([])
  const [filteredPianos, setFilteredPianos] = useState<Piano[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPiano, setSelectedPiano] = useState<Piano | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    verified: false
  })
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    const loadPianos = async () => {
      try {
        const data = await pianoService.getAll()
        setPianos(data)
        setFilteredPianos(data)
      } catch (error) {
        console.error('Error loading pianos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPianos()
  }, [])

  useEffect(() => {
    let filtered = pianos

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(piano =>
        piano.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        piano.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        piano.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(piano => piano.category === filters.category)
    }

    // Condition filter
    if (filters.condition) {
      filtered = filtered.filter(piano => piano.condition === filters.condition)
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter(piano => piano.verified)
    }

    setFilteredPianos(filtered)
  }, [pianos, searchQuery, filters])

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation([latitude, longitude])
        },
        (error) => {
          console.error('Error getting location:', error)
          alert('Unable to get your location. Please check your browser settings.')
        }
      )
    } else {
      alert('Geolocation is not supported by this browser.')
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setFilters({
      category: '',
      condition: '',
      verified: false
    })
  }

  const categories = Array.from(new Set(pianos.map(p => p.category))).sort()
  const conditions = Array.from(new Set(pianos.map(p => p.condition))).sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading piano map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Map className="w-8 h-8 mr-3" />
                Interactive Piano Map
              </h1>
              <p className="text-primary-content/80 mt-2">
                Explore {filteredPianos.length} public pianos worldwide
              </p>
            </div>
            <div className="flex space-x-2">
              <Link to="/pianos" className="btn btn-outline text-primary-content border-primary-content hover:bg-primary-content hover:text-primary">
                <List className="w-4 h-4 mr-2" />
                List View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-base-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Search pianos..."
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select 
                className="select select-bordered select-sm"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select 
                className="select select-bordered select-sm"
                value={filters.condition}
                onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>

              <label className="label cursor-pointer">
                <input 
                  type="checkbox" 
                  className="checkbox checkbox-sm" 
                  checked={filters.verified}
                  onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.checked }))}
                />
                <span className="label-text ml-2">Verified only</span>
              </label>

              <button 
                className="btn btn-outline btn-sm"
                onClick={clearFilters}
              >
                <Filter className="w-4 h-4 mr-1" />
                Clear
              </button>

              <button 
                className="btn btn-primary btn-sm"
                onClick={handleLocateMe}
              >
                <Locate className="w-4 h-4 mr-1" />
                Find Near Me
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body p-0">
                <PianoMap
                  pianos={filteredPianos}
                  onPianoSelect={setSelectedPiano}
                  height="600px"
                  center={userLocation || [40.7128, -74.0060]}
                  zoom={userLocation ? 12 : 2}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Map Statistics</h3>
                <div className="stats stats-vertical">
                  <div className="stat">
                    <div className="stat-title">Total Pianos</div>
                    <div className="stat-value text-primary">{filteredPianos.length}</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Verified</div>
                    <div className="stat-value text-success">
                      {filteredPianos.filter(p => p.verified).length}
                    </div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">Countries</div>
                    <div className="stat-value text-accent">
                      {new Set(filteredPianos.map(p => {
                        const parts = p.location_name.split(', ')
                        return parts[parts.length - 1]
                      })).size}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Piano Info */}
            {selectedPiano && (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h3 className="card-title flex items-center justify-between">
                    <span>{selectedPiano.name}</span>
                    {selectedPiano.verified && (
                      <div className="badge badge-success badge-sm">Verified</div>
                    )}
                  </h3>
                  <p className="text-sm text-base-content/70">
                    {selectedPiano.location_name}
                  </p>
                  <p className="text-sm mt-2">
                    {selectedPiano.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <div className="badge badge-outline">{selectedPiano.category}</div>
                    <div className="badge badge-outline">{selectedPiano.condition}</div>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary btn-sm">View Details</button>
                    <button className="btn btn-outline btn-sm">Mark Visited</button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="btn btn-primary btn-sm w-full">
                    Add New Piano
                  </button>
                  <button className="btn btn-outline btn-sm w-full">
                    Report Issue
                  </button>
                  <button className="btn btn-outline btn-sm w-full">
                    Download Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}