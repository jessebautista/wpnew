import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Piano, 
  Users, 
  Globe, 
  Heart, 
  Music, 
  MapPin,
  Calendar,
  Target,
  Lightbulb,
  ExternalLink
} from 'lucide-react'

interface AboutContent {
  title: string
  subtitle: string
  mission: string
  vision: string
  story: Array<{
    title: string
    text: string
  }>
  three_pillars: Array<{
    name: string
    description: string
  }>
  global_impact: {
    pianos_mapped: string
    community_members: string
    monthly_events: string
    countries: string
  }
  partner: {
    name: string
    description: string
    url: string
  }
}

export function AboutPage() {
  const aboutContent: AboutContent = {
    title: "About World Pianos",
    subtitle: "Connecting communities through the universal language of music",
    mission: "To create a comprehensive global platform that connects piano enthusiasts, maps public pianos worldwide, and fosters musical communities.",
    vision: "A world where public pianos are accessible in every community, where musicians of all skill levels feel empowered to share their gift, and where spontaneous musical moments create lasting connections between strangers.",
    story: [
      {
        title: "The Beginning",
        text: "It started with a simple observation: public pianos were appearing in cities worldwide, but there was no central way to find them. Musicians were discovering these musical gems by chance, missing countless opportunities to connect and create."
      },
      {
        title: "Building Community",
        text: "We reached out to piano enthusiasts, street performers, and public art organizations. The response was overwhelming - people were eager to share their piano discoveries and connect with like-minded musicians around the world."
      },
      {
        title: "Global Expansion",
        text: "Today, World Pianos connects thousands of musicians across continents. From airport lounges in Tokyo to city squares in Paris, our platform helps people discover musical opportunities wherever they travel."
      }
    ],
    three_pillars: [
      {
        name: "Invite",
        description: "We invite everyone to join our global musical community. Join any of the public pianos and events we've listed. All are free and open to everyone."
      },
      {
        name: "Inspire",
        description: "Sharing stories and experiences that spark musical creativity. Share reflections on public piano events, curate songs, and celebrate spontaneous music."
      },
      {
        name: "Connect",
        description: "We share real manifestations of connection - moments when strangers become friends, when communities come together, when music bridges every divide."
      }
    ],
    global_impact: {
      pianos_mapped: "1,000+",
      community_members: "5,000+",
      monthly_events: "100+",
      countries: "50+"
    },
    partner: {
      name: "Sing for Hope",
      description: "World Pianos is proudly created and supported by Sing for Hope, a nonprofit organization dedicated to bringing music and art to communities worldwide. Their Piano Project, which places artist-designed pianos in public spaces, directly inspired the creation of World Pianos.",
      url: "https://singforhope.org"
    }
  }


  const getPillarIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'invite':
        return <Users className="w-8 h-8" />
      case 'inspire':
        return <Lightbulb className="w-8 h-8" />
      case 'connect':
        return <Heart className="w-8 h-8" />
      default:
        return <Target className="w-8 h-8" />
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{aboutContent.title}</h1>
            <p className="text-xl mb-8 opacity-90">{aboutContent.subtitle}</p>
            <div className="flex justify-center">
              <Music className="w-16 h-16 opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-primary" />
                  <h2 className="card-title text-2xl">Our Mission</h2>
                </div>
                <p className="text-lg leading-relaxed">{aboutContent.mission}</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-8 h-8 text-secondary" />
                  <h2 className="card-title text-2xl">Our Vision</h2>
                </div>
                <p className="text-lg leading-relaxed">{aboutContent.vision}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-base-content/70">The journey of connecting piano enthusiasts worldwide</p>
            </div>

            <div className="space-y-8">
              {aboutContent.story.map((chapter, index) => (
                <div key={index} className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary text-primary-content rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3">{chapter.title}</h3>
                        <p className="text-base-content/80 leading-relaxed">{chapter.text}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Three Pillars */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Approach</h2>
              <p className="text-base-content/70">Three pillars that guide everything we do</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {aboutContent.three_pillars.map((pillar, index) => (
                <div key={index} className="card bg-gradient-to-br from-primary/10 to-secondary/10 shadow-xl">
                  <div className="card-body text-center">
                    <div className="flex justify-center mb-4 text-primary">
                      {getPillarIcon(pillar.name)}
                    </div>
                    <h3 className="card-title justify-center text-2xl mb-3">{pillar.name}</h3>
                    <p className="text-base-content/80 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Global Impact */}
      <div className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Global Impact</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="stat bg-base-100 rounded-box shadow">
                <div className="stat-figure text-primary">
                  <Music className="w-8 h-8" />
                </div>
                <div className="stat-title">Pianos Mapped</div>
                <div className="stat-value text-primary">{aboutContent.global_impact.pianos_mapped}</div>
              </div>

              <div className="stat bg-base-100 rounded-box shadow">
                <div className="stat-figure text-secondary">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title">Community Members</div>
                <div className="stat-value text-secondary">{aboutContent.global_impact.community_members}</div>
              </div>

              <div className="stat bg-base-100 rounded-box shadow">
                <div className="stat-figure text-accent">
                  <Calendar className="w-8 h-8" />
                </div>
                <div className="stat-title">Monthly Events</div>
                <div className="stat-value text-accent">{aboutContent.global_impact.monthly_events}</div>
              </div>

              <div className="stat bg-base-100 rounded-box shadow">
                <div className="stat-figure text-info">
                  <Globe className="w-8 h-8" />
                </div>
                <div className="stat-title">Countries</div>
                <div className="stat-value text-info">{aboutContent.global_impact.countries}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <h2 className="card-title justify-center text-3xl mb-6">Powered by {aboutContent.partner.name}</h2>
                <p className="text-lg leading-relaxed mb-6">{aboutContent.partner.description}</p>
                <div className="card-actions justify-center">
                  <a 
                    href={aboutContent.partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit {aboutContent.partner.name}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Global Community</h2>
            <p className="text-xl mb-8 opacity-90">
              Help us map every public piano in the world and connect musicians everywhere
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/pianos/add" className="btn btn-secondary btn-lg">
                <MapPin className="w-5 h-5 mr-2" />
                Add a Piano
              </Link>
              <Link to="/signup" className="btn btn-outline btn-lg">
                <Users className="w-5 h-5 mr-2" />
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}