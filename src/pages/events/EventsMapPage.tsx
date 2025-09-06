import { useState, useEffect } from 'react'
import { MapWithModals } from '../../components/map/MapWithModals'
import { DataService } from '../../services/dataService'
import type { Event } from '../../types'
import { Map, Search, Filter, Locate, Calendar, List } from 'lucide-react'
import { Link } from 'react-router-dom'

export function EventsMapPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    timeframe: 'all', // all, upcoming, today, this_week, this_month
    verified: false,
    hasPianos: false
  })
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        console.log('[EVENTS MAP] Loading events for map view...')
        const data = await DataService.getEvents()
        console.log('[EVENTS MAP] Loaded events:', data.length, 'events')
        console.log('[EVENTS MAP] Sample event coordinates:', data.slice(0, 3).map(e => ({
          id: e.id, 
          title: e.title, 
          lat: e.latitude, 
          lng: e.longitude,
          pianoCount: e.piano_count
        })))
        setEvents(data)
        setFilteredEvents(data)
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  useEffect(() => {
    let filtered = events

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (event.organizer && event.organizer.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category)
    }

    // Timeframe filter
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const monthFromNow = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate())

    if (filters.timeframe !== 'all') {
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date)
        
        switch (filters.timeframe) {
          case 'upcoming':
            return eventDate >= now
          case 'today':
            const endOfToday = new Date(today.getTime() + 24 * 60 * 60 * 1000)
            return eventDate >= today && eventDate < endOfToday
          case 'this_week':
            return eventDate >= now && eventDate <= weekFromNow
          case 'this_month':
            return eventDate >= now && eventDate <= monthFromNow
          default:
            return true
        }
      })
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter(event => event.verified)
    }

    // Has pianos filter
    if (filters.hasPianos) {
      filtered = filtered.filter(event => 
        event.piano_count && event.piano_count > 0
      )
    }

    setFilteredEvents(filtered)
  }, [events, searchQuery, filters])

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
      timeframe: 'all',
      verified: false,
      hasPianos: false
    })
  }

  const categories = Array.from(new Set(events.map(e => e.category))).sort()

  // Calculate real statistics from filtered events
  const totalEvents = filteredEvents.length
  const upcomingEvents = filteredEvents.filter(e => new Date(e.date) >= new Date()).length
  const verifiedEvents = filteredEvents.filter(e => e.verified).length
  const eventsWithPianos = filteredEvents.filter(e => e.piano_count && e.piano_count > 0).length
  const countries = new Set(filteredEvents.map(e => {
    const parts = e.location_name.split(', ')
    return parts[parts.length - 1] // Get the last part which should be the country
  })).size

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4">Loading events map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div 
        className="bg-primary text-primary-content py-12 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('/hero-pianos.png')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center text-white">
                <Map className="w-8 h-8 mr-3" />
                Events Map
              </h1>
              <p className="text-xl text-white/90 mt-2">
                Discover {filteredEvents.length} piano events worldwide
              </p>
            </div>
            <div className="flex space-x-2">
              <Link to="/events" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column: Search and Dropdowns */}
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="input input-bordered w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                  value={filters.timeframe}
                  onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value }))}
                >
                  <option value="all">All Time</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="today">Today</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                </select>
              </div>
            </div>

            {/* Right Column: Checkboxes and Action Buttons */}
            <div className="space-y-3">
              {/* Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <label className="label cursor-pointer justify-start gap-2">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-sm" 
                    checked={filters.verified}
                    onChange={(e) => setFilters(prev => ({ ...prev, verified: e.target.checked }))}
                  />
                  <span className="label-text">Verified only</span>
                </label>

                <label className="label cursor-pointer justify-start gap-2">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-sm" 
                    checked={filters.hasPianos}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasPianos: e.target.checked }))}
                  />
                  <span className="label-text">Has pianos</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={clearFilters}
                >
                  <Filter className="w-4 h-4 mr-1" />
                  Clear
                </button>

                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={handleLocateMe}
                >
                  <Locate className="w-4 h-4 mr-1" />
                  Find Near Me
                </button>
              </div>
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
                <MapWithModals
                  items={filteredEvents}
                  height="600px"
                  center={userLocation || [40.7128, -74.0060]}
                  zoom={userLocation ? 12 : 2}
                  itemType="events"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg text-center lg:text-left">Map Statistics</h3>
                <div className="stats stats-vertical lg:stats-vertical">
                  <div className="stat text-center lg:text-left">
                    <div className="stat-title">Total Events</div>
                    <div className="stat-value text-secondary">{totalEvents}</div>
                    <div className="stat-desc">
                      {totalEvents !== events.length && `${events.length} total in database`}
                    </div>
                  </div>
                  <div className="stat text-center lg:text-left">
                    <div className="stat-title">Upcoming</div>
                    <div className="stat-value text-primary">{upcomingEvents}</div>
                    <div className="stat-desc">
                      {totalEvents > 0 && `${Math.round((upcomingEvents / totalEvents) * 100)}% upcoming`}
                    </div>
                  </div>
                  <div className="stat text-center lg:text-left">
                    <div className="stat-title">Verified</div>
                    <div className="stat-value text-success">{verifiedEvents}</div>
                    <div className="stat-desc">
                      {totalEvents > 0 && `${Math.round((verifiedEvents / totalEvents) * 100)}% verified`}
                    </div>
                  </div>
                  <div className="stat text-center lg:text-left">
                    <div className="stat-title">With Pianos</div>
                    <div className="stat-value text-accent">{eventsWithPianos}</div>
                    <div className="stat-desc">
                      {totalEvents > 0 && `${Math.round((eventsWithPianos / totalEvents) * 100)}% have piano info`}
                    </div>
                  </div>
                  <div className="stat text-center lg:text-left">
                    <div className="stat-title">Countries</div>
                    <div className="stat-value text-info">{countries}</div>
                    <div className="stat-desc">
                      {totalEvents > 0 && `${Math.round(totalEvents / countries)} avg per country`}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title text-lg">Quick Actions</h3>
                <div className="space-y-2">
                  <Link to="/events/add" className="btn btn-primary btn-sm w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Create Event
                  </Link>
                  <Link to="/events" className="btn btn-outline btn-sm w-full">
                    <List className="w-4 h-4 mr-2" />
                    Browse All Events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}