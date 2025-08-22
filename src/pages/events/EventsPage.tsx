import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, MapPin, Search, User, Filter, Grid, List, CheckCircle, X, ChevronLeft, ChevronRight, Map } from 'lucide-react'
import { DataService } from '../../services/dataService'
import { EventCalendar } from '../../components/events/EventCalendar'
import { useAuth } from '../../hooks/useAuth'
import { generateEventSlug } from '../../utils/slugUtils'
import type { Event } from '../../types'
import { EVENT_CATEGORIES } from '../../types'

export function EventsPage() {
  const location = useLocation()
  const { } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState<string | null>(
    location.state?.message || null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [dateFilter, setDateFilter] = useState<'all' | 'upcoming' | 'today' | 'this_week' | 'this_month'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [currentPage, setCurrentPage] = useState(1)
  const eventsPerPage = 10

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await DataService.getEvents()
        setEvents(data)
      } catch (error) {
        console.error('Error loading events:', error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const filteredEvents = events.filter(event => {
    // Text search
    const matchesSearch = searchQuery === '' ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.organizer && event.organizer.toLowerCase().includes(searchQuery.toLowerCase()))

    // Category filter
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory

    // Verified filter
    const matchesVerified = !showVerifiedOnly || event.verified

    // Date filter
    const eventDate = new Date(event.date)
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000))
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    let matchesDate = true
    switch (dateFilter) {
      case 'upcoming':
        matchesDate = eventDate >= today
        break
      case 'today':
        matchesDate = eventDate.toDateString() === today.toDateString()
        break
      case 'this_week':
        const nextWeek = new Date(thisWeek.getTime() + (7 * 24 * 60 * 60 * 1000))
        matchesDate = eventDate >= thisWeek && eventDate < nextWeek
        break
      case 'this_month':
        const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
        matchesDate = eventDate >= thisMonth && eventDate < nextMonth
        break
      default:
        matchesDate = true
    }

    // Selected date filter (from calendar)
    if (selectedDate) {
      matchesDate = eventDate.toDateString() === selectedDate.toDateString()
    }

    return matchesSearch && matchesCategory && matchesVerified && matchesDate
  })

  const upcomingEvents = filteredEvents.filter(event => new Date(event.date) >= new Date())

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, showVerifiedOnly, dateFilter, selectedDate])

  // Pagination calculations
  const totalEvents = filteredEvents.length
  const totalPages = Math.ceil(totalEvents / eventsPerPage)
  const startIndex = (currentPage - 1) * eventsPerPage
  const endIndex = startIndex + eventsPerPage
  const currentEvents = filteredEvents.slice(startIndex, endIndex)

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setDateFilter('all') // Reset date filter when selecting from calendar
    setViewMode('list') // Switch to list view to show filtered results
  }


  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div 
        className="bg-secondary text-secondary-content py-12 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('/hero-events.png')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl font-bold mb-4 text-white">
            <Calendar className="inline w-8 h-8 mr-3" />
            Piano Events
          </h1>
          <p className="text-xl text-white">Discover piano-related events in your area</p>
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
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-center mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
              <input
                type="text"
                placeholder="Search events by title, location, organizer, or category..."
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex rounded-lg border border-base-300 bg-base-100">
                <button
                  onClick={() => setViewMode('list')}
                  className={`btn btn-sm ${viewMode === 'list' ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`btn btn-sm ${viewMode === 'calendar' ? 'btn-primary' : 'btn-ghost'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
              </div>
              <Link 
                to="/events/map"
                className="btn btn-sm btn-outline"
              >
                <Map className="w-4 h-4 mr-2" />
                Map
              </Link>
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
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {EVENT_CATEGORIES.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="select select-bordered select-sm"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
            >
              <option value="all">All Dates</option>
              <option value="upcoming">Upcoming</option>
              <option value="today">Today</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>

            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm mr-2"
                checked={showVerifiedOnly}
                onChange={(e) => setShowVerifiedOnly(e.target.checked)}
              />
              <span className="label-text text-sm">Verified only</span>
            </label>

            {(selectedCategory || showVerifiedOnly || dateFilter !== 'all' || selectedDate) && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setShowVerifiedOnly(false)
                  setDateFilter('all')
                  setSelectedDate(undefined)
                }}
                className="btn btn-ghost btn-sm"
              >
                Clear filters
              </button>
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
            {/* Stats and Selected Date Info */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <p className="text-base-content/70">
                  {viewMode === 'list' && totalEvents > 0 ? (
                    <>
                      Showing {startIndex + 1}-{Math.min(endIndex, totalEvents)} of {totalEvents} events
                      {totalEvents !== events.length && ` (${events.length} total in database)`}
                      {totalPages > 1 && (
                        <span className="ml-2 text-sm">
                          (Page {currentPage} of {totalPages})
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      Showing {filteredEvents.length} of {events.length} events
                    </>
                  )}
                  {selectedDate && (
                    <span className="ml-2 badge badge-secondary">
                      {selectedDate.toLocaleDateString()}
                    </span>
                  )}
                </p>
                {upcomingEvents.length > 0 && (
                  <p className="text-sm text-base-content/50 mt-1">
                    {upcomingEvents.length} upcoming events
                  </p>
                )}
              </div>
              
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(undefined)}
                  className="btn btn-ghost btn-sm mt-2 md:mt-0"
                >
                  Show all dates
                </button>
              )}
            </div>

            {viewMode === 'calendar' ? (
              /* Calendar View */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <EventCalendar 
                    events={events} 
                    onDateSelect={handleDateSelect}
                    selectedDate={selectedDate}
                  />
                </div>
                
                {/* Sidebar with upcoming events */}
                <div className="space-y-6">
                  <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                      <h3 className="card-title">Upcoming Events</h3>
                      <div className="space-y-3">
                        {upcomingEvents.slice(0, 5).map((event) => (
                          <Link
                            key={event.id}
                            to={`/events/${generateEventSlug(event.title, event.id, event.date)}`}
                            className="block p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
                          >
                            <div className="flex items-start gap-3">
                              <div className="bg-primary text-primary-content rounded p-2 text-center min-w-fit">
                                <div className="text-xs font-medium">
                                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                                </div>
                                <div className="text-sm font-bold">
                                  {new Date(event.date).getDate()}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">{event.title}</h4>
                                <p className="text-xs text-base-content/70 truncate">{event.location_name}</p>
                                <div className="badge badge-xs badge-secondary mt-1">{event.category}</div>
                              </div>
                            </div>
                          </Link>
                        ))}
                        {upcomingEvents.length === 0 && (
                          <p className="text-sm text-base-content/70 text-center py-4">
                            No upcoming events found.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* List View */
              <div className="space-y-6">
                {currentEvents.map((event) => (
                  <Link
                    key={event.id}
                    to={`/events/${generateEventSlug(event.title, event.id, event.date)}`}
                    className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
                  >
                    <div className="card-body">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Date */}
                        <div className="text-center lg:text-left flex-shrink-0">
                          <div className="bg-primary text-primary-content rounded-lg p-4 w-20 mx-auto lg:mx-0">
                            <div className="text-sm font-medium">
                              {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            <div className="text-2xl font-bold">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="text-xs">
                              {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric' })}
                            </div>
                          </div>
                        </div>

                        {/* Event Details */}
                        <div className="flex-1">
                          <div className="flex flex-col gap-4">
                            <div className="flex-1">
                              <h3 className="card-title text-xl mb-2">
                                <span className="line-clamp-2">{event.title}</span>
                                {event.verified && (
                                  <div className="badge badge-success badge-sm">Verified</div>
                                )}
                              </h3>
                              
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center text-base-content/70">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {new Date(event.date).toLocaleDateString('en-US', { 
                                    weekday: 'long',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                                
                                <div className="flex items-center text-base-content/70">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  {event.location_name}
                                </div>
                                
                                {event.organizer && (
                                  <div className="flex items-center text-base-content/70">
                                    <User className="w-4 h-4 mr-2" />
                                    {event.organizer}
                                  </div>
                                )}
                              </div>
                              
                              <p className="text-base-content/80 mb-4 line-clamp-2">
                                {event.description}
                              </p>
                              
                              <div className="flex flex-wrap gap-2">
                                <div className="badge badge-secondary">{event.category}</div>
                                {new Date(event.date) >= new Date() ? (
                                  <div className="badge badge-success badge-outline">Upcoming</div>
                                ) : (
                                  <div className="badge badge-neutral badge-outline">Past Event</div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}

                {/* Pagination */}
                {viewMode === 'list' && totalPages > 1 && currentEvents.length > 0 && (
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
              </div>
            )}

            {/* Empty State */}
            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
                <h3 className="text-2xl font-bold mb-2">No Events Found</h3>
                <p className="text-base-content/70 mb-4">
                  {searchQuery || selectedCategory || selectedDate
                    ? 'Try adjusting your search terms or filters.'
                    : 'No events are currently available.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}