import { useState } from 'react'
import { 
  Mail, 
  Send,
  CheckCircle,
  Globe,
  HelpCircle
} from 'lucide-react'

interface ContactContent {
  title: string
  description: string
  contact_types: string[]
  direct_contacts: Array<{
    type: string
    email: string
    response: string
  }>
  quick_faq: Array<{
    question: string
    answer: string
  }>
  about_us: {
    organization: string
    mission: string
  }
}

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'General Question'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactContent: ContactContent = {
    title: "Contact Us",
    description: "Get in touch with the Worldpianos.org team for support, questions, or feedback.",
    contact_types: [
      "General Question",
      "Technical Support",
      "Piano Information",
      "Event Support",
      "Privacy Question",
      "Legal Question",
      "Safety Issue",
      "Feedback",
      "Partnership"
    ],
    direct_contacts: [
      { type: "General Support", email: "hello@worldpianos.org", response: "24-48 hours" },
      { type: "Technical Support", email: "support@worldpianos.org", response: "24-48 hours" },
      { type: "Privacy & Legal", email: "privacy@worldpianos.org", response: "72 hours" },
      { type: "Safety & Security", email: "safety@worldpianos.org", response: "4-8 hours" }
    ],
    quick_faq: [
      { question: "How do I add a piano?", answer: "Click the 'Add Piano' button on the map page or create an account to get started." },
      { question: "How do I report an issue with a piano?", answer: "Use the 'Report Issue' button on any piano listing, or contact us directly for safety concerns." },
      { question: "Can I delete my account?", answer: "Yes, contact privacy@worldpianos.org to request account deletion and data removal." },
      { question: "How do I update piano information?", answer: "Log in and visit the piano's page, or contact us if you need help making updates." }
    ],
    about_us: {
      organization: "Sing For Hope",
      mission: "To connect piano enthusiasts worldwide and make music accessible to everyone through public piano mapping and community building."
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after success
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'General Question'
      })
    }, 3000)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }


  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">{contactContent.title}</h1>
            <p className="text-xl opacity-90">{contactContent.description}</p>
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
                        {contactContent.contact_types.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
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
                <h3 className="card-title mb-4">Direct Contact</h3>
                <div className="space-y-4">
                  {contactContent.direct_contacts.map((contact, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="bg-primary/10 rounded-lg p-2 flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{contact.type}</h4>
                        <p className="text-sm text-base-content/70 mb-2">Response time: {contact.response}</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-primary hover:text-primary/80 font-medium text-sm"
                        >
                          {contact.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Organization Info */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">
                  <Globe className="w-5 h-5" />
                  About {contactContent.about_us.organization}
                </h3>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {contactContent.about_us.mission}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Quick Answers</h2>
            <p className="text-base-content/70">Common questions answered instantly</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactContent.quick_faq.map((item, index) => (
                <div key={index} className="card bg-base-200 shadow-xl">
                  <div className="card-body">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold mb-2">{item.question}</h3>
                        <p className="text-sm text-base-content/80">{item.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <a href="/faq" className="btn btn-outline">
                View Full FAQ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}