import { useState } from 'react'
import { 
  Mail, 
  MessageCircle, 
  MapPin, 
  Phone, 
  Clock,
  Send,
  CheckCircle,
  Globe,
  Twitter,
  Github,
  Instagram
} from 'lucide-react'
import { useLanguage } from '../../contexts/LanguageContext'
import { useAccessibility } from '../../contexts/AccessibilityContext'

export function ContactPage() {
  const { } = useLanguage()
  const { announceToScreenReader } = useAccessibility()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    announceToScreenReader('Your message has been sent successfully', 'assertive')

    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us a message and we\'ll respond within 24 hours',
      contact: 'hello@worldpianos.org',
      action: 'mailto:hello@worldpianos.org'
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our community team Monday-Friday, 9AM-5PM PST',
      contact: 'Start Chat',
      action: '#'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us for urgent matters or technical support',
      contact: '+1 (555) 123-PIANO',
      action: 'tel:+15551234876'
    }
  ]

  const socialLinks = [
    { icon: Twitter, name: 'Twitter', url: 'https://twitter.com/worldpianos', handle: '@worldpianos' },
    { icon: Instagram, name: 'Instagram', url: 'https://instagram.com/worldpianos', handle: '@worldpianos' },
    { icon: Github, name: 'GitHub', url: 'https://github.com/worldpianos', handle: 'worldpianos' }
  ]

  const faqItems = [
    {
      question: 'How do I add a new piano to the map?',
      answer: 'Simply click the "Add Piano" button and fill out the form with the piano\'s location and details. Our community will help verify the information.'
    },
    {
      question: 'Can I report a broken or missing piano?',
      answer: 'Yes! Use the "Report Issue" button on any piano page to let us know about problems. We work with local communities to address these issues.'
    },
    {
      question: 'How do I organize a piano event?',
      answer: 'Create an account and use our event planning tools. You can invite the community, coordinate with piano owners, and share your event widely.'
    },
    {
      question: 'Is WorldPianos free to use?',
      answer: 'Yes! WorldPianos is completely free for all users. We\'re supported by donations and community contributions.'
    }
  ]

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl opacity-90">
              Have questions, suggestions, or just want to say hello? 
              We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-6">Send Us a Message</h2>
                
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-success mb-2">Message Sent!</h3>
                    <p className="text-base-content/70">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label" htmlFor="name">
                          <span className="label-text font-medium">Name *</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          className="input input-bordered"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          aria-describedby="name-help"
                        />
                        <label className="label">
                          <span id="name-help" className="label-text-alt">Your full name</span>
                        </label>
                      </div>

                      <div className="form-control">
                        <label className="label" htmlFor="email">
                          <span className="label-text font-medium">Email *</span>
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          className="input input-bordered"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          aria-describedby="email-help"
                        />
                        <label className="label">
                          <span id="email-help" className="label-text-alt">We'll use this to respond to you</span>
                        </label>
                      </div>
                    </div>

                    <div className="form-control">
                      <label className="label" htmlFor="category">
                        <span className="label-text font-medium">Category</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        className="select select-bordered"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="piano-report">Piano Issue Report</option>
                        <option value="event-help">Event Planning Help</option>
                        <option value="partnership">Partnership/Collaboration</option>
                        <option value="feedback">Feedback/Suggestion</option>
                      </select>
                    </div>

                    <div className="form-control">
                      <label className="label" htmlFor="subject">
                        <span className="label-text font-medium">Subject *</span>
                      </label>
                      <input
                        id="subject"
                        name="subject"
                        type="text"
                        className="input input-bordered"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Brief description of your inquiry"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label" htmlFor="message">
                        <span className="label-text font-medium">Message *</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        className="textarea textarea-bordered h-32"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        placeholder="Tell us more about your inquiry..."
                        aria-describedby="message-help"
                      />
                      <label className="label">
                        <span id="message-help" className="label-text-alt">Please provide as much detail as possible</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">Other Ways to Reach Us</h3>
                <div className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
                        <method.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{method.title}</h4>
                        <p className="text-sm text-base-content/70 mb-2">{method.description}</p>
                        <a
                          href={method.action}
                          className="text-primary hover:text-primary/80 font-medium text-sm"
                        >
                          {method.contact}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Office Info */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <MapPin className="w-5 h-5" />
                  Our Office
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">WorldPianos HQ</p>
                    <p className="text-sm text-base-content/70">
                      123 Music Street<br />
                      San Francisco, CA 94102<br />
                      United States
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-base-content/70">
                    <Clock className="w-4 h-4" />
                    <span>Monday - Friday: 9AM - 5PM PST</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <Globe className="w-5 h-5" />
                  Follow Us
                </h3>
                <div className="space-y-3">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200 transition-colors"
                    >
                      <social.icon className="w-5 h-5 text-base-content/70" />
                      <div>
                        <div className="font-medium">{social.name}</div>
                        <div className="text-sm text-base-content/60">{social.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="collapse collapse-plus bg-base-200">
                  <input type="radio" name="faq-accordion" />
                  <div className="collapse-title text-lg font-medium">
                    {item.question}
                  </div>
                  <div className="collapse-content">
                    <p className="text-base-content/80">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}