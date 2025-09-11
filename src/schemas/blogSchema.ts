import { z } from 'zod'

export const blogPostSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(200, 'Title must be less than 200 characters'),
    
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens')
    .max(100, 'Slug must be less than 100 characters'),
    
  content: z
    .string()
    .min(1, 'Content is required')
    .min(50, 'Content must be at least 50 characters'),
    
  excerpt: z
    .string()
    .max(500, 'Excerpt must be less than 500 characters')
    .optional(),
    
  featured_image: z
    .string()
    .url('Featured image must be a valid URL')
    .optional()
    .or(z.literal('')),
    
  category: z
    .string()
    .max(50, 'Category must be less than 50 characters')
    .optional(),
    
  tags: z
    .array(z.string().max(30, 'Tag must be less than 30 characters'))
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
    
  published: z
    .boolean()
    .default(false),
    
  featured: z
    .boolean()
    .default(false),
    
  allow_comments: z
    .boolean()
    .default(true),
    
  meta_title: z
    .string()
    .max(60, 'Meta title must be less than 60 characters')
    .optional(),
    
  meta_description: z
    .string()
    .max(160, 'Meta description must be less than 160 characters')
    .optional(),
})

// Helper function to generate slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Helper function to extract excerpt from content
export const generateExcerpt = (content: string, maxLength: number = 200): string => {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '')
  
  if (text.length <= maxLength) {
    return text
  }
  
  // Find the last complete sentence within the limit
  const truncated = text.substring(0, maxLength)
  const lastSentence = truncated.lastIndexOf('.')
  const lastSpace = truncated.lastIndexOf(' ')
  
  if (lastSentence > maxLength * 0.7) {
    return text.substring(0, lastSentence + 1)
  } else if (lastSpace > maxLength * 0.7) {
    return text.substring(0, lastSpace) + '...'
  } else {
    return truncated + '...'
  }
}

// Helper function to estimate reading time
export const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200
  const text = content.replace(/<[^>]*>/g, '')
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export type BlogPostFormData = z.infer<typeof blogPostSchema>