import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Piano, Map, List, Search, Filter } from 'lucide-react'
import { MockDataService } from '../../data/mockData'
import type { Piano as PianoType } from '../../types'

export function PianosPage() {
  const [pianos, setPianos] = useState<PianoType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadPianos = async () => {
      try {
        const data = await MockDataService.getPianos()
        setPianos(data)
      } catch (error) {
        console.error('Error loading pianos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPianos()
  }, [])

  const filteredPianos = pianos.filter(piano =>
    piano.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    piano.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    piano.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            <Piano className="inline w-8 h-8 mr-3" />
            Public Pianos Directory
          </h1>
          <p className="text-xl">Discover playable pianos around the world</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-base-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Search pianos by name, location, or category..."
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
            <button className="btn btn-outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
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
            <div className="mb-6">
              <p className="text-base-content/70">
                Showing {filteredPianos.length} of {pianos.length} pianos
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPianos.map((piano) => (
                <div key={piano.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">
                      {piano.name}
                      {piano.verified && (
                        <div className="badge badge-success badge-sm">Verified</div>
                      )}
                    </h3>
                    <p className="text-sm text-base-content/70 mb-2">
                      {piano.location_name}
                    </p>
                    <p className="text-sm">{piano.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="badge badge-outline">{piano.category}</div>
                      <div className="badge badge-outline">{piano.condition}</div>
                      {piano.accessibility && (
                        <div className="badge badge-outline">{piano.accessibility}</div>
                      )}
                    </div>
                    <div className="card-actions justify-end mt-4">
                      <Link to={`/pianos/${piano.id}`} className="btn btn-primary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}