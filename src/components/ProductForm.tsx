'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema, ProductFormData } from '@/lib/validations'
import { Category, apiService } from '@/lib/api'
import { Plus, Trash2, Loader2, Upload } from 'lucide-react'
import Image from 'next/image'
import { getSafeImageUrl, shouldOptimizeImage } from '@/lib/utils'

interface ProductFormProps {
  onSubmit: (data: ProductFormData) => Promise<void>
  loading?: boolean
  error?: string
  initialData?: ProductFormData
  submitButtonText?: string
}

export default function ProductForm({ 
  onSubmit, 
  loading = false, 
  error, 
  initialData,
  submitButtonText = 'Create Product'
}: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState('')
  const [uploading, setUploading] = useState<number | null>(null)
  const [uploadErrors, setUploadErrors] = useState<{ [key: number]: string }>({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      images: [''],
    },
  })

  const images = watch('images')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const data = await apiService.getCategories(0, 100)
        setCategories(data)
      } catch {
        setCategoriesError('Failed to load categories')
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(initialData)
    }
  }, [initialData, reset])

  const handleImageUpload = async (file: File, index: number) => {
    try {
      setUploading(index)
      setUploadErrors(prev => ({ ...prev, [index]: '' }))

      // Simple file validation
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please select a valid image file (JPEG, PNG, GIF, WebP)')
      }

      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        throw new Error('Image size must be less than 5MB')
      }

      // Create object URL for immediate preview
      const objectUrl = URL.createObjectURL(file)
      
      // Update the form field with object URL for preview
      const newImages = [...images]
      newImages[index] = objectUrl
      setValue('images', newImages)

      // Note: In a real app, you'd upload to your server or ImgBB here
      // For now, we'll use the object URL as a placeholder
      console.log('File selected:', file.name)
      
    } catch (err) {
      setUploadErrors(prev => ({ 
        ...prev, 
        [index]: err instanceof Error ? err.message : 'Failed to process image' 
      }))
    } finally {
      setUploading(null)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event.target.files?.[0]
    if (file) {
      handleImageUpload(file, index)
    }
    // Reset input
    event.target.value = ''
  }

  const addImageField = () => {
    setValue('images', [...images, ''])
  }

  const removeImageField = (index: number) => {
    if (images.length > 1) {
      // Clean up object URLs if any
      const currentImage = images[index]
      if (currentImage.startsWith('blob:')) {
        URL.revokeObjectURL(currentImage)
      }
      
      setValue('images', images.filter((_, i) => i !== index))
      setUploadErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[index]
        return newErrors
      })
    }
  }

  const updateImageField = (index: number, value: string) => {
    // Clean up old object URL if replacing
    const currentImage = images[index]
    if (currentImage.startsWith('blob:')) {
      URL.revokeObjectURL(currentImage)
    }
    
    const newImages = [...images]
    newImages[index] = value
    setValue('images', newImages)
    setUploadErrors(prev => ({ ...prev, [index]: '' }))
  }

  const clearImageField = (index: number) => {
    // Clean up object URL if exists
    const currentImage = images[index]
    if (currentImage.startsWith('blob:')) {
      URL.revokeObjectURL(currentImage)
    }
    updateImageField(index, '')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {categoriesError && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          {categoriesError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name *
            </label>
            <input
              {...register('name')}
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-accent1 focus:border-accent1"
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            {categoriesLoading ? (
              <div className="mt-1 flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-gray-500">Loading categories...</span>
              </div>
            ) : (
              <select
                {...register('categoryId')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-accent1 focus:border-accent1"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            )}
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price *
            </label>
            <input
              {...register('price', { valueAsNumber: true })}
              type="number"
              step="0.01"
              min="0"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-accent1 focus:border-accent1"
              placeholder="0.00"
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-accent1 focus:border-accent1"
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Images */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Product Images *
            </label>
            <div className="space-y-4">
              {images.map((image, index) => {
                const safeImage = getSafeImageUrl(image)
                const shouldOptimize = safeImage && safeImage !== '/placeholder-image.jpg' 
                  ? shouldOptimizeImage(safeImage)
                  : false
                const isLocalImage = image.startsWith('blob:')

                return (
                  <div key={index} className="border border-gray-300 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image Preview/Upload Area */}
                      <div className="flex-shrink-0">
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center relative bg-gray-50">
                          {image && safeImage !== '/placeholder-image.jpg' ? (
                            <div className="relative w-full h-full">
                              <Image
                                src={isLocalImage ? image : safeImage}
                                alt={`Preview ${index + 1}`}
                                fill
                                className="object-cover rounded"
                                unoptimized={!shouldOptimize || isLocalImage}
                              />
                              <button
                                type="button"
                                onClick={() => clearImageField(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                              <input
                                type="file"
                                onChange={(e) => handleFileSelect(e, index)}
                                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                className="hidden"
                              />
                              {uploading === index ? (
                                <div className="flex flex-col items-center">
                                  <Loader2 className="h-6 w-6 text-gray-400 animate-spin mb-1" />
                                  <span className="text-xs text-gray-500">Processing...</span>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <Upload className="h-6 w-6 text-gray-400 mb-1" />
                                  <span className="text-xs text-gray-500 text-center px-2">
                                    Click to upload
                                  </span>
                                </div>
                              )}
                            </label>
                          )}
                        </div>
                        {uploadErrors[index] && (
                          <p className="mt-1 text-xs text-red-600 text-center">{uploadErrors[index]}</p>
                        )}
                        {isLocalImage && (
                          <p className="mt-1 text-xs text-yellow-600 text-center">
                            Local image - will need actual URL for submission
                          </p>
                        )}
                      </div>

                      {/* URL Input */}
                      <div className="flex-1 flex flex-col">
                        <label className="text-sm text-gray-600 mb-2">
                          Image URL:
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="url"
                            value={image}
                            onChange={(e) => updateImageField(index, e.target.value)}
                            className="flex-1 border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-accent1 focus:border-accent1 text-sm"
                            placeholder="https://example.com/image.jpg"
                          />
                          {images.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeImageField(index)}
                              className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                              title="Remove image field"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Upload an image or paste a URL (JPEG, PNG, GIF, WebP, max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Add Image Button */}
              <button
                type="button"
                onClick={addImageField}
                className="flex items-center justify-center space-x-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-accent1 hover:bg-gray-50 transition-colors"
              >
                <Plus className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Add Another Image</span>
              </button>
            </div>
            {errors.images && (
              <p className="mt-2 text-sm text-red-600">{errors.images.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-accent1 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent1 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              submitButtonText
            )}
          </button>
        </div>
      </form>
    </div>
  )
}