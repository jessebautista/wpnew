import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { DataService } from '../../services/dataService'
import { GeocodingService, type LocationSuggestion } from '../../services/geocodingService'
import { ImageUploadService } from '../../services/imageUploadService'
import { pianoSchema, type PianoFormData } from '../../schemas/pianoSchema'

export function AddPianoPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { canCreate } = usePermissions()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    getValues
  } = useForm<PianoFormData>({
    resolver: zodResolver(pianoSchema),
    defaultValues: {
      piano_title: '',
      piano_statement: '',
      location_name: '',
      latitude: null,
      longitude: null,
      piano_year: '',
      artist_name: '',
      piano_artist_bio: '',
      artist_website_url: '',
      permanent_home_name: '',
      public_location_name: '',
      piano_program: '',
      contributors_info: '',
      notes: '',
      images: []
    }
  })

  const [locationLoading, setLocationLoading] = useState(false)
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchTimeout, setSearchTimeout] = useState<ReturnType<typeof setTimeout> | null>(null)
  
  const watchedLocationName = watch('location_name')
  
  // Additional state for features not handled by React Hook Form
  const [images, setImages] = useState<File[]>([])
  

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


  const handleLocationSearch = async (query: string) => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }

    setValue('location_name', query)

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
    setValue('location_name', suggestion.address)
    setValue('latitude', suggestion.latitude)
    setValue('longitude', suggestion.longitude)
    setLocationSuggestions([])
    setShowSuggestions(false)
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
      
      if (images.length >= 5) {
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

        setImages(prev => ([...prev, processedFile]))
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error)
      }
    }

    // Clear the input so the same file can be selected again
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const getCurrentLocation = () => {
    setLocationLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          setValue('latitude', latitude, { shouldValidate: true })
          setValue('longitude', longitude, { shouldValidate: true })
          
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
              setValue('location_name', getValues('location_name') || address, { shouldValidate: true })
            } else {
              throw new Error('Reverse geocoding failed')
            }
          } catch (error) {
            console.error('Error getting address:', error)
            // Fall back to coordinates
            const coordsAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            setValue('location_name', getValues('location_name') || coordsAddress, { shouldValidate: true })
          }
          
          // No-op: coordinates validation handled by schema when present
          
          setLocationLoading(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationLoading(false)
        }
      )
    } else {
      setLocationLoading(false)
    }
  }

  const onSubmit = async (formData: PianoFormData) => {
    
    try {
      console.log('Submitting piano:', formData)
      
      // Prepare piano data for submission
      const pianoData = {
        piano_title: (formData.piano_title || '').trim(),
        piano_statement: (formData.piano_statement || '').trim() || null,
        piano_year: (formData.piano_year || '').trim() || null,
        artist_name: (formData.artist_name || '').trim() || null,
        piano_artist_bio: (formData.piano_artist_bio || '').trim() || null,
        artist_website_url: (formData.artist_website_url || '').trim() || null,
        permanent_home_name: (formData.permanent_home_name || '').trim() || null,
        public_location_name: (formData.public_location_name || '').trim() || null,
        perm_lat: formData.latitude?.toString() || null,
        perm_lng: formData.longitude?.toString() || null,
        piano_program: (formData.piano_program || '').trim() || null,
        contributors_info: (formData.contributors_info || '').trim() || null,
        notes: (formData.notes || '').trim() || null,
        piano_source: 'user_submitted' as const,
        source: 'WorldPianos' as const, // New source field
        verified: false,
        created_by: user?.id || '',
        verified_by: null,
        moderation_status: 'pending' as const
      }
      
      // Create piano in database
      const newPiano = await DataService.createPiano(pianoData)
      console.log('Piano created successfully:', newPiano)
      
      // Upload images if any were selected
      if (images.length > 0) {
        try {
          console.log('Uploading images to Supabase storage...')
          await ImageUploadService.uploadAndCreateRecords(images, newPiano.id)
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
      // Error is handled by React Hook Form
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
            {/* Basic Information */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Basic Information</h2>
                
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Piano Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Central Park Piano, JFK Terminal 4 Piano"
                    className={`input input-bordered w-full ${errors.piano_title ? 'input-error' : ''}`}
                    {...register('piano_title')}
                  />
                  {errors.piano_title && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.piano_title.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Piano Statement</span>
                    <span className="label-text-alt">{(watch('piano_statement') || '').length}/1000</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered w-full h-24 ${errors.piano_statement ? 'textarea-error' : ''}`}
                    placeholder="Describe the piano, its condition, and what makes it special..."
                    {...register('piano_statement')}
                    maxLength={1000}
                  />
                  {errors.piano_statement && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.piano_statement.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Piano Year</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2023, 2022"
                      className="input input-bordered w-full"
                      {...register('piano_year')}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Artist Name</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Artist or designer name"
                      className="input input-bordered w-full"
                      {...register('artist_name')}
                    />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Artist Bio</span>
                    <span className="label-text-alt">{(watch('piano_artist_bio') || '').length}/500</span>
                  </label>
                  <textarea
                    className={`textarea textarea-bordered w-full h-20 ${errors.piano_artist_bio ? 'textarea-error' : ''}`}
                    placeholder="Brief description of the artist or designer..."
                    {...register('piano_artist_bio')}
                    maxLength={500}
                  />
                  {errors.piano_artist_bio && (
                    <label className="label">
                      <span className="label-text-alt text-error flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.piano_artist_bio.message}
                      </span>
                    </label>
                  )}
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Artist Website</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://artist-website.com"
                    className="input input-bordered w-full"
                    {...register('artist_website_url')}
                  />
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
                    <span className="label-text font-medium">Address/Location</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Enter the full address or location description"
                        className={`input input-bordered w-full ${errors.location_name ? 'input-error' : ''}`}
                        value={watchedLocationName}
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
                        {errors.location_name.message}
                      </span>
                    </label>
                  )}
                </div>

                {watch('latitude') && watch('longitude') && (
                  <div className="alert alert-success">
                    <Check className="w-4 h-4" />
                    <span>Location coordinates captured: {watch('latitude')!.toFixed(4)}, {watch('longitude')!.toFixed(4)}</span>
                  </div>
                )}

                {/* Coordinates/UI-only errors removed; schema handles validation when needed */}
              </div>
            </div>

            {/* Additional Details */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title mb-4">Location Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Permanent Home</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Central Park, Museum, Gallery"
                      className="input input-bordered w-full"
                      {...register('permanent_home_name')}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Public Location</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Public area or space description"
                      className="input input-bordered w-full"
                      {...register('public_location_name')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Piano Program</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sing for Hope, Play Me I'm Yours"
                      className="input input-bordered w-full"
                      {...register('piano_program')}
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-medium">Contributors</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contributors or sponsors"
                      className="input input-bordered w-full"
                      {...register('contributors_info')}
                    />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-medium">Additional Notes</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-20"
                    placeholder="Any additional information about the piano..."
                    {...register('notes')}
                  />
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

                  {images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 mt-4">
                      {images.map((file, index) => (
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
                    className={`btn btn-primary btn-lg order-1 sm:order-2 ${isSubmitting ? 'loading' : ''}`}
                    disabled={isSubmitting}
                  >
                    {!isSubmitting && <Save className="w-5 h-5 mr-2" />}
                    {isSubmitting ? 'Submitting...' : 'Submit Piano for Review'}
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
