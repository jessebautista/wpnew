import { Link } from 'react-router-dom'
import { 
  Piano, 
  Users, 
  Globe, 
  Heart, 
  Music, 
  Star,
  MapPin,
  Calendar,
  Share2
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

export function AboutPage() {
  const { t } = useLanguage()

  const teamMembers = [
    {
      name: 'Sarah Chen',
      role: 'Founder & CEO',
      bio: 'Classical pianist turned tech entrepreneur with a passion for making music accessible to everyone.',
      image: '/images/team/sarah.jpg',
      location: 'San Francisco, CA'
    },
    {
      name: 'Marcus Johnson',
      role: 'Head of Community',
      bio: 'Jazz musician and community organizer dedicated to connecting piano enthusiasts worldwide.',
      image: '/images/team/marcus.jpg',
      location: 'New York, NY'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Lead Developer',
      bio: 'Full-stack developer and amateur pianist who loves building tools for creative communities.',
      image: '/images/team/elena.jpg',
      location: 'Barcelona, Spain'
    }
  ]

  const stats = [
    { icon: Piano, label: 'Public Pianos', value: '2,847', description: 'Discovered worldwide' },
    { icon: Users, label: 'Community Members', value: '15,234', description: 'Piano enthusiasts' },
    { icon: Globe, label: 'Countries', value: '67', description: 'With pianos mapped' },
    { icon: Calendar, label: 'Events', value: '1,426', description: 'Piano events hosted' }
  ]

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              About WorldPianos
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Connecting piano enthusiasts worldwide through the magic of public pianos. 
              Discover, share, and celebrate musical moments in your community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pianos" className="btn btn-accent btn-lg">
                <Piano className="w-5 h-5 mr-2" />
                Find Pianos
              </Link>
              <Link to="/signup" className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-primary">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Mission Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-base-content/80 mb-8">
              We believe that music has the power to bring people together, break down barriers, 
              and create moments of joy in everyday life. Public pianos represent this belief in action – 
              instruments placed in public spaces for anyone to play, regardless of skill level or background.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Global Community</h3>
                <p className="text-sm text-base-content/70">
                  Connecting piano lovers across continents and cultures
                </p>
              </div>
              <div className="text-center">
                <div className="bg-secondary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">Accessibility</h3>
                <p className="text-sm text-base-content/70">
                  Making music accessible to everyone, everywhere
                </p>
              </div>
              <div className="text-center">
                <div className="bg-accent/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <Music className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-semibold mb-2">Creativity</h3>
                <p className="text-sm text-base-content/70">
                  Inspiring spontaneous musical moments and connections
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-16">
          <div className="bg-base-200 rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center mb-8">Our Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="font-semibold text-sm mb-1">{stat.label}</div>
                  <div className="text-xs text-base-content/60">{stat.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Our Story</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-base-content/80 mb-4">
                  WorldPianos was born from a simple moment: founder Sarah Chen stumbled upon 
                  a public piano in a London train station and watched strangers gather around 
                  a young girl playing Chopin. In that moment, she realized the incredible power 
                  of accessible music to create instant community.
                </p>
                <p className="text-base-content/80 mb-4">
                  What started as a personal project to map public pianos in her city has grown 
                  into a global movement. Today, thousands of piano enthusiasts use WorldPianos 
                  to discover instruments in their travels, share their performances, and connect 
                  with fellow musicians.
                </p>
                <p className="text-base-content/80">
                  We're not just cataloging pianos – we're building a community that celebrates 
                  the democratization of music, one public piano at a time.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 text-center">
                <Piano className="w-24 h-24 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">Started in 2019</h3>
                <p className="text-base-content/70">
                  From one piano in London to thousands worldwide
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <figure className="px-10 pt-10">
                    <div className="avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-24">
                        <span className="text-3xl">{member.name.split(' ').map(n => n[0]).join('')}</span>
                      </div>
                    </div>
                  </figure>
                  <div className="card-body items-center text-center">
                    <h3 className="card-title">{member.name}</h3>
                    <p className="text-primary font-medium">{member.role}</p>
                    <p className="text-sm text-base-content/70 mb-2">{member.bio}</p>
                    <div className="flex items-center text-xs text-base-content/60">
                      <MapPin className="w-3 h-3 mr-1" />
                      {member.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-lg p-3 flex-shrink-0">
                  <Music className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Music for All</h3>
                  <p className="text-base-content/70">
                    We believe music should be accessible to everyone, regardless of background, 
                    skill level, or economic status. Public pianos embody this principle.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-secondary/10 rounded-lg p-3 flex-shrink-0">
                  <Users className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Community First</h3>
                  <p className="text-base-content/70">
                    Our platform is built by and for the community. Every feature is designed 
                    to strengthen connections between piano enthusiasts worldwide.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-accent/10 rounded-lg p-3 flex-shrink-0">
                  <Share2 className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Open & Transparent</h3>
                  <p className="text-base-content/70">
                    We're committed to being open about our practices, transparent in our 
                    operations, and inclusive in our approach to building this community.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary to-secondary text-primary-content rounded-2xl p-8">
            <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl mb-6 opacity-90">
              Help us map every public piano on Earth and build the world's largest 
              community of piano enthusiasts.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/pianos/add" className="btn btn-accent">
                <Piano className="w-5 h-5 mr-2" />
                Add a Piano
              </Link>
              <Link to="/events/add" className="btn btn-outline text-white border-white hover:bg-white hover:text-primary">
                <Calendar className="w-5 h-5 mr-2" />
                Host an Event
              </Link>
              <Link to="/contact" className="btn btn-ghost text-white hover:bg-white/10">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}