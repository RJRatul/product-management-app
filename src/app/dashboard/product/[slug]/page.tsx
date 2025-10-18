'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Product, apiService } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Tag, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { getSafeImageUrl, shouldOptimizeImage } from '@/lib/utils'

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData: Product = await apiService.getProduct(slug)
        setProduct(productData)
      } catch {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  const handleImageError = (imageUrl: string) => {
    setImageErrors((prev) => new Set(prev).add(imageUrl))
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return
    }

    setDeleteLoading(true)
    try {
      await apiService.deleteProduct(slug)
      router.push('/dashboard/products')
    } catch {
      setError('Failed to delete product')
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/products"
            className="flex items-center text-accent2 hover:text-amber-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span className="text-sm sm:text-base">Back</span>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">Product Details</h1>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="p-4">
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/products"
            className="flex items-center text-accent2 hover:text-amber-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span className="text-sm sm:text-base">Back</span>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">Product Details</h1>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Product not found'}
        </div>
      </div>
    )
  }

  const safeImages = product.images?.map(img => getSafeImageUrl(img)) || []
  const categoryImage = product.category?.image ? getSafeImageUrl(product.category.image) : null

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center">
          <Link
            href="/dashboard/products"
            className="flex items-center text-accent2 hover:text-amber-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            <span className="text-sm sm:text-base">Back</span>
          </Link>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">Product Details</h1>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
          <Link
            href={`/dashboard/edit-product/${product.slug}`}
            className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="cursor-pointer flex items-center justify-center px-3 sm:px-4 py-2 bg-accent3 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {safeImages.length > 0 && safeImages[0] !== '/placeholder-image.jpg' ? (
                <>
                  {/* Main Image */}
                  <div className="relative w-full h-60 sm:h-72 md:h-80 bg-gray-100 rounded-lg overflow-hidden">
                    {safeImages[selectedImage] && !imageErrors.has(safeImages[selectedImage]) ? (
                      <Image
                        src={safeImages[selectedImage]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        unoptimized={!shouldOptimizeImage(safeImages[selectedImage])}
                        onError={() => handleImageError(safeImages[selectedImage])}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Images */}
                  {safeImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {safeImages.map((image, index) => {
                        const hasError = imageErrors.has(image)
                        const shouldOptimize = shouldOptimizeImage(image)
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`relative w-full h-16 sm:h-20 bg-gray-100 rounded overflow-hidden border-2 cursor-pointer transition-colors ${
                              selectedImage === index 
                                ? 'border-accent1' 
                                : 'border-transparent hover:border-accent2'
                            }`}
                          >
                            {image && !hasError && image !== '/placeholder-image.jpg' ? (
                              <Image
                                src={image}
                                alt={`${product.name} ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 1024px) 25vw, 12.5vw"
                                unoptimized={!shouldOptimize}
                                onError={() => handleImageError(image)}
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-60 sm:h-72 md:h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">{product.name}</h2>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{product.description}</p>
              </div>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Price</h3>
                  <p className="text-xl sm:text-2xl font-bold text-accent1">${product.price.toFixed(2)}</p>
                </div>
                
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Category</h3>
                  <div className="flex items-center">
                    <Tag className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 mr-2" />
                    <p className="text-sm sm:text-lg font-semibold text-primary truncate">
                      {product.category?.name || 'No category'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg xs:col-span-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Slug</h3>
                  <p className="text-xs sm:text-sm font-mono text-primary bg-gray-100 px-2 py-1 rounded break-all">
                    {product.slug}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg xs:col-span-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Product ID</h3>
                  <p className="text-xs sm:text-sm font-mono text-primary bg-gray-100 px-2 py-1 rounded break-all">
                    {product.id}
                  </p>
                </div>
              </div>

              {/* Category Details */}
              {product.category && (
                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-lg font-semibold text-primary mb-3 sm:mb-4">Category Information</h3>
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500">Category Name</h4>
                      <p className="text-sm sm:text-base text-primary truncate">{product.category.name}</p>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-medium text-gray-500">Category ID</h4>
                      <p className="text-xs sm:text-sm font-mono text-primary break-all">{product.category.id}</p>
                    </div>
                    {categoryImage && categoryImage !== '/placeholder-image.jpg' && (
                      <div className="xs:col-span-2">
                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Category Image</h4>
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                          {!imageErrors.has(categoryImage) ? (
                            <Image
                              src={categoryImage}
                              alt={product.category.name}
                              fill
                              className="object-cover rounded"
                              sizes="(max-width: 640px) 64px, 80px"
                              unoptimized={!shouldOptimizeImage(categoryImage)}
                              onError={() => handleImageError(categoryImage)}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}