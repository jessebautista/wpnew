import { z } from 'zod'

export const pianoSchema = z.object({
  piano_title: z
    .string()
    .min(1, 'Piano title is required')
    .max(100, 'Piano title must be less than 100 characters'),
    
  piano_statement: z
    .string()
    .max(1000, 'Statement must be less than 1000 characters')
    .optional(),
    
  location_name: z
    .string()
    .max(200, 'Location must be less than 200 characters')
    .optional(),
    
  latitude: z
    .number()
    .min(-90, 'Invalid latitude')
    .max(90, 'Invalid latitude')
    .nullable(),
    
  longitude: z
    .number()
    .min(-180, 'Invalid longitude')
    .max(180, 'Invalid longitude')
    .nullable(),
    
  piano_year: z
    .string()
    .optional()
    .refine((val) => {
      if (!val || val === '') return true
      const year = parseInt(val)
      const currentYear = new Date().getFullYear()
      return year >= 1800 && year <= currentYear + 5
    }, 'Invalid year'),
    
  artist_name: z
    .string()
    .max(100, 'Artist name must be less than 100 characters')
    .optional(),
    
  piano_artist_bio: z
    .string()
    .max(500, 'Artist bio must be less than 500 characters')
    .optional(),
    
  artist_website_url: z
    .string()
    .url('Invalid website URL')
    .optional()
    .or(z.literal('')),
    
  permanent_home_name: z
    .string()
    .max(200, 'Permanent home name must be less than 200 characters')
    .optional(),
    
  public_location_name: z
    .string()
    .max(200, 'Public location name must be less than 200 characters')
    .optional(),
    
  piano_program: z
    .string()
    .max(100, 'Program name must be less than 100 characters')
    .optional(),
    
  contributors_info: z
    .string()
    .max(500, 'Contributors info must be less than 500 characters')
    .optional(),
    
  notes: z
    .string()
    .max(1000, 'Notes must be less than 1000 characters')
    .optional(),
})

export type PianoFormData = z.infer<typeof pianoSchema> & {
  images: File[]
}