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
import { DataService } from '../../services/dataService'
import { GeocodingService, type LocationSuggestion } from '../../services/geocodingService'
import { ImageUploadService } from '../../services/imageUploadService'

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
  const [hoursType, setHoursType] = useState<'custom' | 'preset'>('preset')
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)

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

  const handleLocationSearch = async (query: string) => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    setFormData(prev => ({ ...prev, location_name: query }))

    // If query is empty, hide suggestions
    if (!query.trim()) {
      setLocationSuggestions([])
      setShowSuggestions(false)
      return
    }

    // Debounce the search
    const timeout = setTimeout(async () => {
      try {
        const suggestions = await GeocodingService.searchLocations(query)
        setLocationSuggestions(suggestions)
        setShowSuggestions(suggestions.length > 0)
      } catch (error) {
        console.error('Location search error:', error)
        setLocationSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    setSearchTimeout(timeout)
  }

  const handleLocationSelect = (suggestion: LocationSuggestion) => {
    setFormData(prev => ({
      ...prev,
      location_name: suggestion.address,
      latitude: suggestion.latitude,
      longitude: suggestion.longitude
    }))
    setLocationSuggestions([])
    setShowSuggestions(false)
    
    // Clear coordinate error if it existed
    if (errors.coordinates) {
      setErrors(prev => ({ ...prev, coordinates: '' }))
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    for (const file of files) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        console.warn(`Skipping ${file.name}: Not an image file`)
        continue
      }
      
      if (file.size > 10 * 1024 * 1024) {
        console.warn(`Skipping ${file.name}: File too large (>10MB)`)
        continue
      }
      
      if (formData.images.length >= 5) {
        console.warn('Maximum 5 images allowed')
        break
      }

      try {
        // Compress image if it's large
        let processedFile = file
        if (file.size > 2 * 1024 * 1024) { // If larger than 2MB
          console.log(`Compressing ${file.name}...`)
          processedFile = await ImageUploadService.compressImage(file)
        }

        setFormData(prev => ({
          ...prev,
          images: [...prev.images, processedFile]
        }))
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
      }
    }

    // Clear the input so the same file can be selected again
    e.target.value = ''
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
          
          // Try to get address from coordinates using reverse geocoding
          try {
            const reverseGeocodingUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
            const response = await fetch(reverseGeocodingUrl, {
              headers: {
                'User-Agent': 'WorldPianos/1.0 (https://worldpianos.org)'
              }
            })
            
            if (response.ok) {
              const data = await response.json()
              const address = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              setFormData(prev => ({
                ...prev,
                location_name: prev.location_name || address
              }))
            } else {
              throw new Error('Reverse geocoding failed')
            }
          } catch (error) {
            console.error('Error getting address:', error)
            // Fall back to coordinates
            const coordsAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            setFormData(prev => ({
              ...prev,
              location_name: prev.location_name || coordsAddress
            }))
          }
          
          // Clear coordinate error if it existed
          if (errors.coordinates) {
            setErrors(prev => ({ ...prev, coordinates: '' }))
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

    if (!formData.latitude || !formData.longitude) {
      newErrors.coordinates = 'Please use "Use My Location" button or enter a valid address to get coordinates'
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

    if (!formData.latitude || !formData.longitude) {
      setErrors({ location: 'Please provide coordinates for the piano location.' })
      return
    }

    setLoading(true)
    
    try {
      console.log('Submitting piano:', formData)
      
      // Prepare piano data for submission
      const pianoData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        location_name: formData.location_name.trim(),
        latitude: formData.latitude,
        longitude: formData.longitude,
        category: formData.category,
        condition: formData.condition.toLowerCase() as any,
        accessibility: formData.accessibility.trim() || null,
        hours: formData.hours.trim() || null,
        hours_available: formData.hours.trim() || null,
        verified: false,
        created_by: user?.id || '',
        verified_by: null,
        submitted_by: user?.id,
        moderation_status: 'pending' as any,
        updated_at: new Date().toISOString()
      }
      
      // Create piano in database
      const newPiano = await DataService.createPiano(pianoData)
      console.log('Piano created successfully:', newPiano)
      
      // Upload images if any were selected
      if (formData.images.length > 0) {
        try {
          console.log('Uploading images to Supabase storage...')
          await ImageUploadService.uploadAndCreateRecords(formData.images, newPiano.id)
          console.log('Images uploaded successfully')
        } catch (imageError) {
          console.error('Image upload failed:', imageError)
          // Don't fail the whole submission for image upload errors
          // Piano was already created successfully
        }
      }
      
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
      <div 
        className="bg-primary text-primary-content py-8 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url('/hero-pianos.png')` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="container mx-auto px-4 relative z-10">
          <Link to="/pianos" className="btn btn-ghost btn-sm mb-4 text-white hover:bg-white hover:bg-opacity-20">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Pianos
          </Link>
          
          <div className="flex items-center gap-3">
            <Piano className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">Add a Piano</h1>
              <p className="opacity-90 text-white">Share a public piano location with the community</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {/* Basic Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Basic Information</h2>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Piano Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Central Park Piano, JFK Terminal 4 Piano"
                    className={`input input-bordered w-full ${errors.name ? 'input-error' : ''}`}
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

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Description</span>
                    <span className="label-text-alt">{formData.description.length}/1000</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered w-full h-24 ${errors.description ? 'textarea-error' : ''}`}
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
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Category *</span>
                    </label>
                    <select
                      className={`select select-bordered w-full ${errors.category ? 'select-error' : ''}`}
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

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Condition *</span>
                    </label>
                    <select
                      className={`select select-bordered w-full ${errors.condition ? 'select-error' : ''}`}
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
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Address/Location *</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Enter the full address or location description"
                        className={`input input-bordered w-full ${errors.location_name ? 'input-error' : ''}`}
                        value={formData.location_name}
                        onChange={(e) => handleLocationSearch(e.target.value)}
                        onFocus={() => {
                          if (locationSuggestions.length > 0) {
                            setShowSuggestions(true)
                          }
                        }}
                        onBlur={() => {
                          // Delay hiding suggestions to allow clicking on them
                          setTimeout(() => setShowSuggestions(false), 200)
                        }}
                      />
                      
                      {/* Location Suggestions Dropdown */}
                      {showSuggestions && locationSuggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 bg-base-100 border border-base-300 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                          {locationSuggestions.map((suggestion) => (
                            <button
                              key={suggestion.id}
                              type="button"
                              className="w-full text-left px-4 py-3 hover:bg-base-200 focus:bg-base-200 border-b border-base-200 last:border-b-0"
                              onClick={() => handleLocationSelect(suggestion)}
                            >
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 text-base-content/50 flex-shrink-0" />
                                <div>
                                  <div className="font-medium text-sm">{suggestion.place_name}</div>
                                  <div className="text-xs text-base-content/60 mt-1">
                                    {suggestion.latitude.toFixed(4)}, {suggestion.longitude.toFixed(4)}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      className={`btn btn-outline ${locationLoading ? 'loading' : ''} sm:btn-md btn-sm`}
                      disabled={locationLoading}
                    >
                      {!locationLoading && <MapPin className="w-4 h-4" />}
                      <span className="hidden sm:inline">Use My Location</span>
                      <span className="sm:hidden">Location</span>
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

                {errors.coordinates && (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.coordinates}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Additional Details */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Additional Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Accessibility</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Wheelchair accessible, Ground level"
                      className="input input-bordered w-full"
                      value={formData.accessibility}
                      onChange={(e) => handleInputChange('accessibility', e.target.value)}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Operating Hours</span>
                    </label>
                    
                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2">
                        <label className="cursor-pointer label flex-1">
                          <span className="label-text">Preset Hours</span>
                          <input
                            type="radio"
                            name="hoursType"
                            value="preset"
                            checked={hoursType === 'preset'}
                            onChange={(e) => setHoursType(e.target.value as 'preset')}
                            className="radio radio-primary"
                          />
                        </label>
                        <label className="cursor-pointer label flex-1">
                          <span className="label-text">Custom Hours</span>
                          <input
                            type="radio"
                            name="hoursType"
                            value="custom"
                            checked={hoursType === 'custom'}
                            onChange={(e) => setHoursType(e.target.value as 'custom')}
                            className="radio radio-primary"
                          />
                        </label>
                      </div>

                      {hoursType === 'preset' ? (
                        <select
                          className="select select-bordered w-full"
                          value={formData.hours}
                          onChange={(e) => handleInputChange('hours', e.target.value)}
                        >
                          <option value="">Select operating hours</option>
                          <option value="24/7">24/7 (Always Available)</option>
                          <option value="6:00 AM - 10:00 PM">6:00 AM - 10:00 PM</option>
                          <option value="7:00 AM - 11:00 PM">7:00 AM - 11:00 PM</option>
                          <option value="8:00 AM - 8:00 PM">8:00 AM - 8:00 PM</option>
                          <option value="9:00 AM - 5:00 PM">9:00 AM - 5:00 PM (Business Hours)</option>
                          <option value="10:00 AM - 6:00 PM">10:00 AM - 6:00 PM</option>
                          <option value="Varies">Varies by Day</option>
                          <option value="Unknown">Unknown</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="e.g. Mon-Fri 9AM-5PM, Sat 10AM-4PM, Sun Closed"
                          className="input input-bordered w-full"
                          value={formData.hours}
                          onChange={(e) => handleInputChange('hours', e.target.value)}
                        />
                      )}
                    </div>
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
                
                <div className="form-control w-full">
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
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-4">
                      {formData.images.map((file, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 sm:h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-1 -right-1 btn btn-circle btn-xs sm:btn-sm btn-error"
                          >
                            <X className="w-2 h-2 sm:w-3 sm:h-3" />
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

            {/* Submit Section */}
            <div className="card bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20 shadow-xl">
              <div className="card-body">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-primary mb-2">Ready to Submit?</h2>
                  <p className="text-base-content/70">Your piano listing will be reviewed and published within 24-48 hours</p>
                </div>

                <div className="alert alert-info mb-6">
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

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link to="/pianos" className="btn btn-ghost btn-lg order-2 sm:order-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    className={`btn btn-primary btn-lg order-1 sm:order-2 ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {!loading && <Save className="w-5 h-5 mr-2" />}
                    {loading ? 'Submitting...' : 'Submit Piano for Review'}
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