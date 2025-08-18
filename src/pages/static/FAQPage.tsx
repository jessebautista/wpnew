import { useState } from 'react'
import { 
  Search, 
  HelpCircle, 
  Piano, 
  Users, 
  Calendar, 
  Shield, 
  Settings,
  ChevronDown,
  Book,
  Lock
} from 'lucide-react'

interface FAQCategory {
  name: string
  questions: Array<{
    question: string
    answer: string
  }>
}

interface FAQContent {
  title: string
  description: string
  categories: FAQCategory[]
}

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [openItems, setOpenItems] = useState<string[]>([])

  const faqContent: FAQContent = {
    title: "Frequently Asked Questions",
    description: "Find answers to common questions about using Worldpianos.org, adding pianos, and connecting with the community.",
    categories: [
      {
        name: "Getting Started",
        questions: [
          {
            question: "How do I create an account?",
            answer: "Creating an account is simple and free! Click the 'Sign Up' button in the top right corner of any page. You can register with your email address or use social login options. Once registered, you'll be able to add pianos, create events, and track your piano discoveries."
          },
          {
            question: "What is Worldpianos.org?",
            answer: "Worldpianos.org is a global platform that maps public pianos worldwide. Created by Sing For Hope, we connect piano enthusiasts, help people discover pianos in their area, and build communities around shared musical experiences."
          },
          {
            question: "Is Worldpianos.org free to use?",
            answer: "Yes! Worldpianos.org is completely free to use. You can browse the map, find pianos, create an account, add piano locations, and participate in events without any cost."
          }
        ]
      },
      {
        name: "Piano Mapping",
        questions: [
          {
            question: "How do I add a new piano to the map?",
            answer: "To add a piano, click the 'Add Piano' button on the map page or in the navigation. You'll need to create an account first. Then, provide the piano's location, add photos if possible, describe its condition, and include any relevant details."
          },
          {
            question: "Can I edit or update piano information?",
            answer: "Yes! If you're logged in, you can suggest edits to piano information by visiting the piano's page and clicking 'Suggest Edit.' If you originally added the piano, you may have additional editing privileges."
          },
          {
            question: "What if a piano is no longer there or broken?",
            answer: "Please report the issue using the 'Report Issue' button on the piano's page. You can indicate if the piano is missing, damaged, or access has changed."
          },
          {
            question: "What are the guidelines for piano photos?",
            answer: "Photos should clearly show the piano and its surroundings. Include wide shots showing the location context and close-ups of the piano itself. Avoid photos with people's faces unless you have permission."
          }
        ]
      },
      {
        name: "Events",
        questions: [
          {
            question: "How do I create a piano event?",
            answer: "Click 'Add Event' on the events page or use the 'Add Event' button in the navigation. You'll need an account to create events. Provide event details including date, time, location, and description."
          },
          {
            question: "What types of events can I create?",
            answer: "You can create various types of piano-related events: recitals, concerts, informal meetups, piano marathons, flash mobs, festivals, workshops, or any gathering focused on piano music."
          },
          {
            question: "How do I RSVP or join an event?",
            answer: "Visit the event page and click 'RSVP' or 'Join Event.' You may need to create an account if you haven't already."
          }
        ]
      },
      {
        name: "Account Management",
        questions: [
          {
            question: "What is the Piano Passport?",
            answer: "The Piano Passport is your personal record of piano discoveries and experiences. It tracks the pianos you've visited, events you've attended, and achievements you've unlocked."
          },
          {
            question: "How do I delete my account?",
            answer: "To delete your account and all associated data, please contact us at privacy@worldpianos.org. We'll process your request within 72 hours and permanently remove your personal information."
          },
          {
            question: "How do I change my email or password?",
            answer: "Visit your account settings page by clicking your profile icon and selecting 'Settings.' From there, you can update your email address, change your password, and modify other account preferences."
          }
        ]
      },
      {
        name: "Privacy & Data",
        questions: [
          {
            question: "What personal information do you collect?",
            answer: "We collect only the information necessary to provide our services: your email address, optional profile information, and content you choose to share (like piano locations and photos)."
          },
          {
            question: "Do you use cookies or tracking?",
            answer: "We use essential cookies for basic website functionality and privacy-friendly analytics (Matomo) to understand how people use our site. We don't use tracking cookies for advertising."
          },
          {
            question: "What are my data rights?",
            answer: "You have the right to access, correct, export, or delete your personal information. To exercise these rights, contact us at privacy@worldpianos.org."
          }
        ]
      },
      {
        name: "Technical Support",
        questions: [
          {
            question: "Is there a mobile app?",
            answer: "Currently, we don't have a dedicated mobile app, but our website is fully responsive and works great on mobile devices."
          },
          {
            question: "Which browsers are supported?",
            answer: "Worldpianos.org works with all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, keep your browser updated."
          },
          {
            question: "How do I report a bug or technical issue?",
            answer: "Please contact our technical support team at support@worldpianos.org. Include details about what you were trying to do, what happened instead, and what browser/device you're using."
          }
        ]
      },
      {
        name: "Community Guidelines",
        questions: [
          {
            question: "What are the community guidelines?",
            answer: "We ask all community members to be respectful, helpful, and accurate. Submit truthful information about pianos, respect others' contributions, and keep content appropriate for all ages."
          },
          {
            question: "How do I report inappropriate content or behavior?",
            answer: "Use the 'Report' buttons found throughout the site, or contact us directly at hello@worldpianos.org."
          },
          {
            question: "How can I help improve the platform?",
            answer: "You can help by adding accurate piano information, reporting issues, participating in events, and sharing the platform with other piano enthusiasts."
          }
        ]
      },
      {
        name: "Safety & Security",
        questions: [
          {
            question: "Are the piano locations safe to visit?",
            answer: "While we strive to maintain accurate information, we cannot guarantee the safety of any location. Always use common sense when visiting pianos, especially in unfamiliar areas."
          },
          {
            question: "What if I encounter a safety issue at a piano location?",
            answer: "For immediate safety concerns, contact local emergency services first. Then, please report the issue to us at safety@worldpianos.org."
          },
          {
            question: "Is the platform appropriate for children?",
            answer: "Our platform is family-friendly, but children should always be supervised by adults when visiting piano locations."
          }
        ]
      }
    ]
  }

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase()
    if (name.includes('getting started')) return Book
    if (name.includes('piano') || name.includes('mapping')) return Piano
    if (name.includes('event')) return Calendar
    if (name.includes('account') || name.includes('management')) return Users
    if (name.includes('privacy') || name.includes('data')) return Lock
    if (name.includes('technical') || name.includes('support')) return Settings
    if (name.includes('community') || name.includes('guidelines')) return Users
    if (name.includes('safety') || name.includes('security')) return Shield
    return HelpCircle
  }


  // Create categories array with icons
  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle },
    ...faqContent.categories.map((cat) => ({
      id: cat.name.toLowerCase().replace(/\s+/g, '-'),
      name: cat.name,
      icon: getCategoryIcon(cat.name)
    }))
  ]

  // Flatten all questions for filtering
  const allQuestions = faqContent.categories.flatMap((category, catIndex) =>
    category.questions.map((q, qIndex) => ({
      id: `${catIndex}-${qIndex}`,
      question: q.question,
      answer: q.answer,
      category: category.name.toLowerCase().replace(/\s+/g, '-'),
      categoryName: category.name
    }))
  )

  const filteredFAQs = allQuestions.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    
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
            <h1 className="text-5xl font-bold mb-6">{faqContent.title}</h1>
            <p className="text-xl opacity-90">{faqContent.description}</p>
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
                        
                        {/* Category Badge */}
                        <div className="mt-4">
                          <span className="badge badge-outline badge-sm">
                            {faq.categoryName}
                          </span>
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