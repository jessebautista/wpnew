import { Link } from 'react-router-dom'
import { Piano, Map, Calendar, Users, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MockDataService } from '../../data/mockData'
import { NewsletterSubscription } from '../../components/newsletter/NewsletterSubscription'
import { SocialShareWidget } from '../../components/social/SocialShareWidget'
import { PianoStatusBadge } from '../../components/pianos/PianoStatusBadge'
import { generateEventSlug } from '../../utils/slugUtils'
import type { Piano as PianoType, Event } from '../../types'

export function HomePage() {
  const [featuredPianos, setFeaturedPianos] = useState<PianoType[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pianos, events] = await Promise.all([
          MockDataService.getPianos(),
          MockDataService.getEvents()
        ])
        setFeaturedPianos(pianos.filter(p => p.verified).slice(0, 3))
        
        // Filter to only upcoming events (in the future)
        const now = new Date()
        const upcomingEventsFiltered = events
          .filter(event => new Date(event.date) > now)
          .slice(0, 3)
        setUpcomingEvents(upcomingEventsFiltered)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero min-h-[70vh] lg:min-h-[80vh] relative overflow-hidden">
        {/* Hero Background Image with Blur */}
        <div 
          className="hero-overlay absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
          style={{ backgroundImage: 'url(/hero-pianos.png)' }}
        />
        {/* Enhanced gradient overlay for better text readability */}
        <div className="hero-overlay bg-gradient-to-b from-black/80 via-black/75 to-black/85" />
        
        <div className="hero-content text-center relative z-10 px-4">
          <div className="max-w-4xl backdrop-blur-md bg-black/30 rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/20 shadow-2xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 text-white drop-shadow-2xl leading-tight">
              Discover Public Pianos <br className="hidden sm:block" />
              <span className="text-primary drop-shadow-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Around the World</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-white/95 drop-shadow-xl leading-relaxed">
              From airport lounges to city squares, find playable pianos near you. 
              Connect with fellow piano enthusiasts and share your musical journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link to="/pianos" className="btn btn-primary btn-lg w-full sm:w-auto shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105">
                <Map className="w-5 h-5 mr-2" />
                Explore Piano Map
              </Link>
              <Link to="/events" className="btn btn-outline btn-lg w-full sm:w-auto text-white border-white/80 hover:bg-white hover:text-black hover:border-white shadow-2xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105">
                <Calendar className="w-5 h-5 mr-2" />
                Find Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-12 sm:py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="stat bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-center">
              <div className="stat-figure text-primary mb-2">
                <Piano className="w-10 h-10 sm:w-8 sm:h-8 mx-auto" />
              </div>
              <div className="stat-title text-base sm:text-sm font-medium">Public Pianos</div>
              <div className="stat-value text-primary text-2xl sm:text-3xl font-bold">2,500+</div>
              <div className="stat-desc text-sm opacity-70 mt-1">Across 50+ countries</div>
            </div>
            <div className="stat bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-center">
              <div className="stat-figure text-secondary mb-2">
                <Users className="w-10 h-10 sm:w-8 sm:h-8 mx-auto" />
              </div>
              <div className="stat-title text-base sm:text-sm font-medium">Community Members</div>
              <div className="stat-value text-secondary text-2xl sm:text-3xl font-bold">10,000+</div>
              <div className="stat-desc text-sm opacity-70 mt-1">Piano enthusiasts worldwide</div>
            </div>
            <div className="stat bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 text-center sm:col-span-1 col-span-1">
              <div className="stat-figure text-accent mb-2">
                <Calendar className="w-10 h-10 sm:w-8 sm:h-8 mx-auto" />
              </div>
              <div className="stat-title text-base sm:text-sm font-medium">Events Hosted</div>
              <div className="stat-value text-accent text-2xl sm:text-3xl font-bold">500+</div>
              <div className="stat-desc text-sm opacity-70 mt-1">Meetups and concerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Pianos */}
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Featured Pianos</h2>
            <p className="text-base sm:text-lg lg:text-xl text-base-content/80">Discover some of our most beloved public pianos</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {featuredPianos.map((piano) => (
                <Link key={piano.id} to={`/pianos/${piano.id}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                  <div className="card-body">
                    <h3 className="card-title">
                      {piano.piano_title}
                      {piano.verified && (
                        <div className="badge badge-primary">
                          <Star className="w-3 h-3 mr-1" />
                          Verified
                        </div>
                      )}
                    </h3>
                    <p className="text-sm text-base-content/70 mb-2">
                      {piano.location_display_name || piano.public_location_name || piano.permanent_home_name}
                    </p>
                    <p>{piano.piano_statement}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {piano.piano_source === 'sing_for_hope' && (
                        <div className="badge badge-primary">🎹 Sing for Hope</div>
                      )}
                      {piano.piano_source === 'user_submitted' && (
                        <div className="badge badge-accent">Community</div>
                      )}
                      {piano.status && (
                        <PianoStatusBadge status={piano.status} size="sm" />
                      )}
                      {piano.piano_year && (
                        <div className="badge badge-outline">{piano.piano_year}</div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/pianos" className="btn btn-primary">View All Pianos</Link>
          </div>
        </div>
      </div>

      {/* Upcoming Events - Only show if there are upcoming events */}
      {(!loading && upcomingEvents.length > 0) && (
        <div className="py-12 sm:py-16 bg-base-200">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Upcoming Events</h2>
              <p className="text-base sm:text-lg lg:text-xl text-base-content/80">Join piano enthusiasts in your area</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {upcomingEvents.map((event) => (
                <Link key={event.id} to={`/events/${generateEventSlug(event.title, event.id, event.date)}`} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                  <div className="card-body">
                    <h3 className="card-title">{event.title}</h3>
                    <p className="text-sm text-base-content/70 mb-2">
                      {new Date(event.date).toLocaleDateString()} • {event.location_name}
                    </p>
                    <p>{event.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="badge badge-secondary">{event.category}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link to="/events" className="btn btn-primary">View All Events</Link>
            </div>
          </div>
        </div>
      )}

      {/* Newsletter Section */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterSubscription 
              source="homepage"
              showPreferences={true}
              variant="inline"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Social Share Section */}
      <div className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <SocialShareWidget 
              variant="full"
              showStats={true}
              showFollowButtons={true}
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Join Our Community</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto text-base-content/80 leading-relaxed">
            Help us map every public piano in the world. Share your discoveries, 
            attend events, and connect with fellow piano lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <Link to="/pianos/add" className="btn btn-primary btn-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Piano className="w-5 h-5 mr-2" />
              Add a Piano
            </Link>
            <Link to="/signup" className="btn btn-outline btn-lg w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Users className="w-5 h-5 mr-2" />
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}