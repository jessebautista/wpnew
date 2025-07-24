import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Piano, 
  MapPin, 
  Camera, 
  ChevronLeft, 
  Save, 
  AlertCircle,
  Upload,
  X,
  Check
} from 'lucide-react'
import { useAuth } from '../../components/auth/AuthProvider'
import { usePermissions } from '../../hooks/usePermissions'
import { PIANO_CATEGORIES, PIANO_CONDITIONS } from '../../types'

interface PianoFormData {
  name: string
  description: string
  location_name: string
  latitude: number | null
  longitude: number | null
  category: string
  condition: string
  accessibility: string
  hours: string
  images: File[]
}

export function AddPianoPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { canCreate } = usePermissions()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [locationLoading, setLocationLoading] = useState(false)
  const [formData, setFormData] = useState<PianoFormData>({
    name: '',
    description: '',
    location_name: '',
    latitude: null,
    longitude: null,
    category: '',
    condition: '',
    accessibility: '',
    hours: '',
    images: []
  })

  if (!user || !canCreate()) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-base-content/70 mb-4">You need to be signed in to add a piano.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    )
  }

  const handleInputChange = (field: keyof PianoFormData, value: string | number | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      return isValidType && isValidSize
    })

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles].slice(0, 5) // Max 5 images
    }))
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
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

    if (!formData.name.trim()) {
      newErrors.name = 'Piano name is required'
    }

    if (!formData.location_name.trim()) {
      newErrors.location_name = 'Location is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required'
    }

    if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters'
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
      // In a real app, this would submit to Supabase
      console.log('Submitting piano:', formData)
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Navigate to success page or piano list
      navigate('/pianos', { 
        state: { 
          message: 'Piano submitted successfully! It will be reviewed before being published.' 
        }
      })
      
    } catch (error) {
      console.error('Error submitting piano:', error)
      setErrors({ submit: 'Failed to submit piano. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      {/* Header */}
      <div className="bg-primary text-primary-content py-8">
        <div className="container mx-auto px-4">
          <Link to="/pianos" className="btn btn-ghost btn-sm mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Pianos
          </Link>
          
          <div className="flex items-center gap-3">
            <Piano className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Add a Piano</h1>
              <p className="opacity-90">Share a public piano location with the community</p>
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
                <h2 className="card-title mb-4">Basic Information</h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Piano Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Central Park Piano, JFK Terminal 4 Piano"
                    className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                  {errors.name && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.name}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                    <span className="label-text-alt">{formData.description.length}/1000</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
                    placeholder="Describe the piano, its condition, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    maxLength={1000}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {PIANO_CATEGORIES.map(category => (
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

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Condition *</span>
                    </label>
                    <select
                      className={`select select-bordered ${errors.condition ? 'select-error' : ''}`}
                      value={formData.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                    >
                      <option value="">Select condition</option>
                      {PIANO_CONDITIONS.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                    {errors.condition && (
                      <label className="label">
                        <span className="label-text-alt text-error flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.condition}
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
                    <span className="label-text font-medium">Address/Location *</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter the full address or location description"
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

            {/* Additional Details */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Additional Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Accessibility</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wheelchair accessible, Ground level"
                      className="input input-bordered"
                      value={formData.accessibility}
                      onChange={(e) => handleInputChange('accessibility', e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Operating Hours</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9:00 AM - 6:00 PM, 24/7"
                      className="input input-bordered"
                      value={formData.hours}
                      onChange={(e) => handleInputChange('hours', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">
                  <Camera className="w-5 h-5" />
                  Photos
                </h2>
                
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Upload Images</span>
                    <span className="label-text-alt">Max 5 images, 10MB each</span>
                  </label>
                  
                  <div className="border-2 border-dashed border-base-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-base-content/50" />
                      <p className="text-base-content/70">Click to upload images or drag and drop</p>
                      <p className="text-sm text-base-content/50 mt-1">PNG, JPG, GIF up to 10MB</p>
                    </label>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 btn btn-circle btn-sm btn-error"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
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
                      <li>Make sure the piano is publicly accessible</li>
                      <li>Verify the location information is accurate</li>
                      <li>Your submission will be reviewed before being published</li>
                      <li>You'll be credited as the contributor</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4 justify-end">
                  <Link to="/pianos" className="btn btn-ghost">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className={`btn btn-primary ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {!loading && <Save className="w-4 h-4 mr-2" />}
                    {loading ? 'Submitting...' : 'Submit Piano'}
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