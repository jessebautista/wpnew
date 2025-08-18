/**
 * Image Upload Service
 * Handles uploading images to Supabase storage
 */

import { supabase } from '../lib/supabase'

export interface ImageUploadResult {
  url: string
  path: string
  publicUrl: string
}

export class ImageUploadService {
  private static readonly BUCKET_NAME = 'piano-images'
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

  /**
   * Upload a single image file to Supabase storage
   */
  static async uploadImage(file: File, pianoId: string): Promise<ImageUploadResult> {
    // Validate file
    this.validateFile(file)

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${pianoId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    try {
      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(`Upload failed: ${error.message}`)
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(this.BUCKET_NAME)
        .getPublicUrl(fileName)

      return {
        url: data.path,
        path: fileName,
        publicUrl: publicUrlData.publicUrl
      }
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  }

  /**
   * Upload multiple images for a piano
   */
  static async uploadImages(files: File[], pianoId: string): Promise<ImageUploadResult[]> {
    const uploadPromises = files.map(file => this.uploadImage(file, pianoId))
    return Promise.all(uploadPromises)
  }

  /**
   * Delete an image from storage
   */
  static async deleteImage(path: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .remove([path])

      if (error) {
        throw new Error(`Delete failed: ${error.message}`)
      }
    } catch (error) {
      console.error('Image delete error:', error)
      throw error
    }
  }

  /**
   * Validate file before upload
   */
  private static validateFile(file: File): void {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error(`File size too large. Maximum size is ${this.MAX_FILE_SIZE / 1024 / 1024}MB`)
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error(`Invalid file type. Allowed types: ${this.ALLOWED_TYPES.join(', ')}`)
    }
  }

  /**
   * Create piano image record in database
   */
  static async createPianoImageRecord(pianoId: string, imageUrl: string, caption?: string, altText?: string): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User must be authenticated to upload images')
      }

      const { data, error } = await supabase
        .from('piano_images')
        .insert([{
          piano_id: pianoId,
          uploaded_by: user.id,
          image_url: imageUrl,
          caption: caption || null,
          alt_text: altText || `Piano image for ${pianoId}`
        }])
        .select()
        .single()

      if (error) {
        throw new Error(`Failed to create image record: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Image record creation error:', error)
      throw error
    }
  }

  /**
   * Upload images and create database records
   */
  static async uploadAndCreateRecords(
    files: File[], 
    pianoId: string, 
    captions?: string[]
  ): Promise<any[]> {
    try {
      // Upload images to storage
      const uploadResults = await this.uploadImages(files, pianoId)

      // Create database records
      const imageRecords = await Promise.all(
        uploadResults.map((result, index) => 
          this.createPianoImageRecord(
            pianoId, 
            result.publicUrl, 
            captions?.[index]
          )
        )
      )

      return imageRecords
    } catch (error) {
      console.error('Upload and record creation error:', error)
      throw error
    }
  }

  /**
   * Resize and compress image before upload (client-side)
   */
  static async compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        const newWidth = img.width * ratio
        const newHeight = img.height * ratio

        // Set canvas dimensions
        canvas.width = newWidth
        canvas.height = newHeight

        // Draw and compress
        ctx?.drawImage(img, 0, 0, newWidth, newHeight)

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              })
              resolve(compressedFile)
            } else {
              reject(new Error('Canvas to blob conversion failed'))
            }
          },
          file.type,
          quality
        )
      }

      img.onerror = () => reject(new Error('Image load failed'))
      img.src = URL.createObjectURL(file)
    })
  }
}