import { Link } from 'react-router-dom'
import { Piano, Map, Calendar, Users, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MockDataService } from '../../data/mockData'
import { NewsletterSubscription } from '../../components/newsletter/NewsletterSubscription'
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
        setUpcomingEvents(events.slice(0, 3))
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
      <div className="hero min-h-[70vh] bg-gradient-to-br from-primary/20 to-secondary/20">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">
              Discover Public Pianos <br />
              <span className="text-primary">Around the World</span>
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              From airport lounges to city squares, find playable pianos near you. 
              Connect with fellow piano enthusiasts and share your musical journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pianos" className="btn btn-primary btn-lg">
                <Map className="w-5 h-5 mr-2" />
                Explore Piano Map
              </Link>
              <Link to="/events" className="btn btn-outline btn-lg">
                <Calendar className="w-5 h-5 mr-2" />
                Find Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="stat">
              <div className="stat-figure text-primary">
                <Piano className="w-8 h-8" />
              </div>
              <div className="stat-title">Public Pianos</div>
              <div className="stat-value text-primary">2,500+</div>
              <div className="stat-desc">Across 50+ countries</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-secondary">
                <Users className="w-8 h-8" />
              </div>
              <div className="stat-title">Community Members</div>
              <div className="stat-value text-secondary">10,000+</div>
              <div className="stat-desc">Piano enthusiasts worldwide</div>
            </div>
            <div className="stat">
              <div className="stat-figure text-accent">
                <Calendar className="w-8 h-8" />
              </div>
              <div className="stat-title">Events Hosted</div>
              <div className="stat-value text-accent">500+</div>
              <div className="stat-desc">Meetups and concerts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Pianos */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Pianos</h2>
            <p className="text-xl">Discover some of our most beloved public pianos</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredPianos.map((piano) => (
                <div key={piano.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">
                      {piano.name}
                      {piano.verified && (
                        <div className="badge badge-primary">
                          <Star className="w-3 h-3 mr-1" />
                          Verified
                        </div>
                      )}
                    </h3>
                    <p className="text-sm text-base-content/70 mb-2">
                      {piano.location_name}
                    </p>
                    <p>{piano.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <div className="badge badge-outline">{piano.category}</div>
                      <div className="badge badge-outline">{piano.condition}</div>
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
          )}

          <div className="text-center mt-8">
            <Link to="/pianos" className="btn btn-primary">View All Pianos</Link>
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-xl">Join piano enthusiasts in your area</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h3 className="card-title">{event.title}</h3>
                    <p className="text-sm text-base-content/70 mb-2">
                      {new Date(event.date).toLocaleDateString()} • {event.location_name}
                    </p>
                    <p>{event.description}</p>
                    <div className="card-actions justify-between items-center mt-4">
                      <div className="badge badge-secondary">{event.category}</div>
                      <button className="btn btn-sm btn-primary">Learn More</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link to="/events" className="btn btn-primary">View All Events</Link>
          </div>
        </div>
      </div>

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

      {/* CTA Section */}
      <div className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Help us map every public piano in the world. Share your discoveries, 
            attend events, and connect with fellow piano lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pianos/add" className="btn btn-primary btn-lg">
              <Piano className="w-5 h-5 mr-2" />
              Add a Piano
            </Link>
            <Link to="/signup" className="btn btn-outline btn-lg">
              <Users className="w-5 h-5 mr-2" />
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}