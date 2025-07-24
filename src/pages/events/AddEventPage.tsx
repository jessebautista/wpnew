import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Calendar, 
  MapPin, 
  User, 
  ChevronLeft, 
  Save, 
  AlertCircle,
  Clock,
  Users,
  Check
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { EVENT_CATEGORIES } from '../../types'

interface EventFormData {
  title: string
  description: string
  date: string
  time: string
  location_name: string
  latitude: number | null
  longitude: number | null
  category: string
  organizer: string
  contact_email: string
  contact_phone: string
  website_url: string
  ticket_price: string
  capacity: string
}

export function AddEventPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { canCreate } = usePermissions()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [locationLoading, setLocationLoading] = useState(false)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    location_name: '',
    latitude: null,
    longitude: null,
    category: '',
    organizer: '',
    contact_email: user?.email || '',
    contact_phone: '',
    website_url: '',
    ticket_price: '',
    capacity: ''
  })

  if (!user || !canCreate()) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-base-content/70 mb-4">You need to be signed in to add an event.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: keyof EventFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getCurrentLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude
          }))
          
          // Try to get address from coordinates (mock implementation)
          try {
            // In a real app, this would use Google Geocoding API
            const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            setFormData(prev => ({
              ...prev,
              location_name: prev.location_name || mockAddress
            }))
          } catch (error) {
            console.error('Error getting address:', error)
          }
          
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationLoading(false)
          setErrors(prev => ({
            ...prev,
            location: 'Unable to get your location. Please enter the address manually.'
          }))
        }
      )
    } else {
      setLocationLoading(false)
      setErrors(prev => ({
        ...prev,
        location: 'Geolocation is not supported by this browser.'
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Event title is required'
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required'
    } else {
      const eventDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (eventDate < today) {
        newErrors.date = 'Event date cannot be in the past'
      }
    }

    if (!formData.time) {
      newErrors.time = 'Event time is required'
    }

    if (!formData.location_name.trim()) {
      newErrors.location_name = 'Location is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.organizer.trim()) {
      newErrors.organizer = 'Organizer name is required'
    }

    if (!formData.contact_email.trim()) {
      newErrors.contact_email = 'Contact email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Please enter a valid email address'
    }

    if (formData.description && formData.description.length > 2000) {
      newErrors.description = 'Description must be less than 2000 characters'
    }

    if (formData.website_url && !formData.website_url.match(/^https?:\/\/.+/)) {
      newErrors.website_url = 'Please enter a valid URL (starting with http:// or https://)'
    }

    if (formData.capacity && (isNaN(Number(formData.capacity)) || Number(formData.capacity) < 1)) {
      newErrors.capacity = 'Capacity must be a positive number'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    
    try {
      // Combine date and time
      const eventDateTime = new Date(`${formData.date}T${formData.time}`)
      
      const eventData = {
        ...formData,
        date: eventDateTime.toISOString(),
        created_by: user.id,
        verified: false // Events need verification
      }
      
      // In a real app, this would submit to Supabase
      console.log('Submitting event:', eventData)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to success page or event list
      navigate('/events', { 
        state: { 
          message: 'Event submitted successfully! It will be reviewed before being published.' 
        }
      })
      
    } catch (error) {
      console.error('Error submitting event:', error)
      setErrors({ submit: 'Failed to submit event. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-secondary text-secondary-content py-8">
        <div className="container mx-auto px-4">
          <Link to="/events" className="btn btn-ghost btn-sm mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Events
          </Link>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Create an Event</h1>
              <p className="opacity-90">Organize a piano-related event for the community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Event Details</h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Event Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Piano Concert in Central Park, Piano Lessons Workshop"
                    className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                  {errors.title && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.title}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                    <span className="label-text-alt">{formData.description.length}/2000</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered h-32 ${errors.description ? 'textarea-error' : ''}`}
                    placeholder="Describe the event, what to expect, requirements, and any other important details..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    maxLength={2000}
                  />
                  {errors.description && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.description}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Category *</span>
                  </label>
                  <select
                    className={`select select-bordered ${errors.category ? 'select-error' : ''}`}
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option value="">Select category</option>
                    {EVENT_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.category}
                      </span>
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <Clock className="w-5 h-5" />
                  When
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Date *</span>
                    </label>
                    <input
                      type="date"
                      min={today}
                      className={`input input-bordered ${errors.date ? 'input-error' : ''}`}
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                    {errors.date && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.date}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Time *</span>
                    </label>
                    <input
                      type="time"
                      className={`input input-bordered ${errors.time ? 'input-error' : ''}`}
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                    />
                    {errors.time && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.time}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <MapPin className="w-5 h-5" />
                  Location
                </h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Venue/Address *</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter the venue name and address"
                      className={`input input-bordered flex-1 ${errors.location_name ? 'input-error' : ''}`}
                      value={formData.location_name}
                      onChange={(e) => handleInputChange('location_name', e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className={`btn btn-outline ${locationLoading ? 'loading' : ''}`}
                      disabled={locationLoading}
                    >
                      {!locationLoading && <MapPin className="w-4 h-4" />}
                      Use My Location
                    </button>
                  </div>
                  {errors.location_name && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.location_name}
                      </span>
                    </label>
                  )}
                  {errors.location && (
                    <label className="label">
                      <span className="label-text-alt text-warning flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.location}
                      </span>
                    </label>
                  )}
                </div>

                {formData.latitude && formData.longitude && (
                  <div className="alert alert-success">
                    <Check className="w-4 h-4" />
                    <span>Location coordinates captured: {formData.latitude.toFixed(4)}, {formData.longitude.toFixed(4)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Organizer Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <User className="w-5 h-5" />
                  Organizer Information
                </h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Organizer Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your name or organization name"
                    className={`input input-bordered ${errors.organizer ? 'input-error' : ''}`}
                    value={formData.organizer}
                    onChange={(e) => handleInputChange('organizer', e.target.value)}
                  />
                  {errors.organizer && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.organizer}
                      </span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Contact Email *</span>
                    </label>
                    <input
                      type="email"
                      placeholder="contact@example.com"
                      className={`input input-bordered ${errors.contact_email ? 'input-error' : ''}`}
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange('contact_email', e.target.value)}
                    />
                    {errors.contact_email && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.contact_email}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Contact Phone</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="input input-bordered"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <Users className="w-5 h-5" />
                  Additional Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Ticket Price</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Free, $10, $5-15"
                      className="input input-bordered"
                      value={formData.ticket_price}
                      onChange={(e) => handleInputChange('ticket_price', e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Capacity</span>
                    </label>
                    <input
                      type="text"
                      placeholder="50, 100, unlimited"
                      className={`input input-bordered ${errors.capacity ? 'input-error' : ''}`}
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                    />
                    {errors.capacity && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.capacity}
                        </span>
                      </label>
                    )}
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Website URL</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      className={`input input-bordered ${errors.website_url ? 'input-error' : ''}`}
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                    />
                    {errors.website_url && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.website_url}
                        </span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            {errors.submit && (
              <div className="alert alert-error">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.submit}</span>
              </div>
            )}

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <div className="alert alert-info">
                  <AlertCircle className="w-4 h-4" />
                  <div>
                    <h3 className="font-bold">Before you submit:</h3>
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      <li>Ensure all event details are accurate and complete</li>
                      <li>Verify the date, time, and location information</li>
                      <li>Your event will be reviewed before being published</li>
                      <li>You'll receive updates about your event status via email</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <Link to="/events" className="btn btn-ghost">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {!loading && <Save className="w-4 h-4 mr-2" />}
                    {loading ? 'Creating Event...' : 'Create Event'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}