import { useState } from 'react'
import { 
  Search, 
  HelpCircle, 
  Piano, 
  Users, 
  Calendar, 
  Shield, 
  Settings,
  ChevronDown
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
}

export function FAQPage() {
  const { } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<string[]>([])

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    { id: 'pianos', name: 'Pianos & Locations', icon: Piano },
    { id: 'community', name: 'Community & Account', icon: Users },
    { id: 'events', name: 'Events & Meetups', icon: Calendar },
    { id: 'technical', name: 'Technical Support', icon: Settings },
    { id: 'safety', name: 'Safety & Moderation', icon: Shield }
  ]

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'How do I add a new piano to WorldPianos?',
      answer: 'Adding a piano is easy! Click the "Add Piano" button in the navigation menu or on the map page. Fill out the form with the piano\'s location, condition, and any relevant details. Include photos if possible. Our community moderators will review your submission and approve it once verified.',
      category: 'pianos',
      tags: ['add piano', 'submit', 'location', 'verification']
    },
    {
      id: '2',
      question: 'What should I do if I find a broken or missing piano?',
      answer: 'If you encounter a piano that\'s damaged, out of tune, or no longer at its listed location, please report it using the "Report Issue" button on the piano\'s page. Provide details about the current condition and, if possible, photos. We work with local communities and piano maintainers to address these issues.',
      category: 'pianos',
      tags: ['broken piano', 'missing piano', 'report', 'maintenance']
    },
    {
      id: '3',
      question: 'How do I create an account?',
      answer: 'Click "Sign Up" in the top navigation. You can register with your email address or use social login options like Google or Facebook. Creating an account allows you to add pianos, organize events, save favorites, and engage with the community.',
      category: 'community',
      tags: ['account', 'registration', 'sign up', 'social login']
    },
    {
      id: '4',
      question: 'Is WorldPianos free to use?',
      answer: 'Yes! WorldPianos is completely free for all users. We\'re a community-driven platform supported by donations and volunteer contributions. There are no premium features or subscription fees.',
      category: 'community',
      tags: ['free', 'cost', 'pricing', 'donation']
    },
    {
      id: '5',
      question: 'How can I organize a piano event or meetup?',
      answer: 'After creating an account, visit the Events page and click "Create Event." Choose a piano location from our database, set the date and time, and provide event details. You can invite other community members and share your event on social media.',
      category: 'events',
      tags: ['create event', 'organize', 'meetup', 'planning']
    },
    {
      id: '6',
      question: 'Can I attend events without creating an account?',
      answer: 'While you can view event listings without an account, we recommend registering to RSVP, receive updates, and connect with other attendees. Most event organizers appreciate knowing who\'s planning to attend.',
      category: 'events',
      tags: ['attend event', 'RSVP', 'guest access']
    },
    {
      id: '7',
      question: 'Why isn\'t the map loading or showing pianos?',
      answer: 'Map issues are usually related to browser permissions or internet connectivity. Make sure you\'ve allowed location access if prompted, and try refreshing the page. If problems persist, try a different browser or clear your browser cache. Contact support if issues continue.',
      category: 'technical',
      tags: ['map', 'loading', 'location permission', 'browser']
    },
    {
      id: '8',
      question: 'How do I change my notification preferences?',
      answer: 'Go to your account settings (click your profile icon → Settings). In the Notifications section, you can customize email alerts for new pianos in your area, upcoming events, and community updates. You can also unsubscribe from all emails using the link in any email we send.',
      category: 'technical',
      tags: ['notifications', 'settings', 'email preferences', 'unsubscribe']
    },
    {
      id: '9',
      question: 'What are the community guidelines for posting?',
      answer: 'We encourage respectful, helpful, and accurate contributions. When adding pianos or creating events, provide honest descriptions and current information. Be respectful in comments and interactions. Spam, hate speech, or inappropriate content will be removed and may result in account suspension.',
      category: 'safety',
      tags: ['guidelines', 'community rules', 'moderation', 'behavior']
    },
    {
      id: '10',
      question: 'How do I report inappropriate content or behavior?',
      answer: 'Use the "Report" button found on piano pages, events, comments, or user profiles. Provide specific details about the issue. Our moderation team reviews all reports promptly. For urgent safety concerns, contact us directly through the Contact page.',
      category: 'safety',
      tags: ['report', 'inappropriate content', 'safety', 'moderation']
    },
    {
      id: '11',
      question: 'Can I edit piano information after submitting?',
      answer: 'Yes, if you submitted the piano originally, you can edit most details by visiting the piano page and clicking "Edit." Changes to location require moderator approval. Other users can also suggest edits, which are reviewed by our community moderators.',
      category: 'pianos',
      tags: ['edit piano', 'update information', 'corrections']
    },
    {
      id: '12',
      question: 'How accurate is the piano information?',
      answer: 'Piano information is community-sourced and regularly updated. We encourage users to verify details before visiting and report any changes. Popular pianos are typically more current due to frequent community updates. Always check recent comments for the latest status.',
      category: 'pianos',
      tags: ['accuracy', 'verification', 'community updates', 'reliability']
    },
    {
      id: '13',
      question: 'What should I bring when visiting a public piano?',
      answer: 'While most public pianos are playable as-is, consider bringing hand sanitizer, wet wipes for the keys, and a small towel. Some outdoor pianos may be affected by weather. Check recent comments on the piano\'s page for current condition updates.',
      category: 'pianos',
      tags: ['visiting tips', 'what to bring', 'preparation', 'hygiene']
    },
    {
      id: '14',
      question: 'How can I support WorldPianos?',
      answer: 'There are many ways to help! Add pianos in your area, attend and organize events, help moderate content, spread the word on social media, or make a donation. We also welcome volunteers with skills in development, design, music, or community management.',
      category: 'community',
      tags: ['support', 'volunteer', 'donation', 'contribute']
    },
    {
      id: '15',
      question: 'Is my personal information safe?',
      answer: 'We take privacy seriously and follow industry-standard security practices. We only collect necessary information and never sell user data. Your email is only used for account management and optional notifications. Read our full Privacy Policy for complete details.',
      category: 'safety',
      tags: ['privacy', 'security', 'personal data', 'safety']
    }
  ]

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl opacity-90">
              Find answers to common questions about WorldPianos, 
              our community, and how to make the most of our platform.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              {/* Search */}
              <div className="form-control mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                  <input
                    type="text"
                    placeholder="Search frequently asked questions..."
                    className="input input-bordered w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search FAQ"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`btn btn-sm ${
                      selectedCategory === category.id 
                        ? 'btn-primary' 
                        : 'btn-outline'
                    }`}
                    aria-pressed={selectedCategory === category.id}
                  >
                    <category.icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-4xl mx-auto">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 mx-auto mb-4 text-base-content/50" />
              <h3 className="text-2xl font-bold mb-2">No questions found</h3>
              <p className="text-base-content/70 mb-4">
                Try adjusting your search terms or selecting a different category.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="btn btn-primary"
              >
                Show All Questions
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="card bg-base-100 shadow-lg">
                  <div className="card-body p-0">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full text-left p-6 hover:bg-base-200 transition-colors"
                      aria-expanded={openItems.includes(faq.id)}
                      aria-controls={`faq-answer-${faq.id}`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold pr-4">{faq.question}</h3>
                        <ChevronDown 
                          className={`w-5 h-5 flex-shrink-0 transition-transform ${
                            openItems.includes(faq.id) ? 'rotate-180' : ''
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                    </button>
                    
                    {openItems.includes(faq.id) && (
                      <div 
                        id={`faq-answer-${faq.id}`}
                        className="px-6 pb-6"
                        role="region"
                        aria-labelledby={`faq-question-${faq.id}`}
                      >
                        <div className="prose prose-sm max-w-none">
                          <p className="text-base-content/80 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                        
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-4">
                          {faq.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="badge badge-outline badge-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Still Need Help Section */}
        <div className="max-w-4xl mx-auto mt-16">
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content shadow-xl">
            <div className="card-body text-center">
              <h2 className="card-title text-2xl justify-center mb-4">
                Still need help?
              </h2>
              <p className="mb-6 opacity-90">
                Can't find the answer you're looking for? Our community team is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a
                  href="/contact"
                  className="btn btn-accent"
                >
                  Contact Support
                </a>
                <a
                  href="mailto:help@worldpianos.org"
                  className="btn btn-outline text-white border-white hover:bg-white hover:text-primary"
                >
                  Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}