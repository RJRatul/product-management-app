'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Product, apiService } from '@/lib/api'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { ArrowLeft, Tag, ShoppingCart, Image as ImageIcon, Heart, Share2 } from 'lucide-react'
import Image from 'next/image'
import { getSafeImageUrl, shouldOptimizeImage } from '@/lib/utils'

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
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

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-secondary">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md mx-auto">
              {error || 'Product not found'}
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center text-accent2 hover:text-amber-600 transition-colors mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const safeImages = product.images?.map(img => getSafeImageUrl(img)) || []
  const categoryImage = product.category?.image ? getSafeImageUrl(product.category.image) : null

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-4 sm:py-8">
        {/* Back Button */}
        <div className="mb-4 sm:mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center text-accent2 hover:text-amber-600 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-3 sm:space-y-4">
              {safeImages.length > 0 && safeImages[0] !== '/placeholder-image.jpg' ? (
                <>
                  {/* Main Image */}
                  <div className="relative w-full h-64 sm:h-80 md:h-96 bg-gray-100 rounded-lg overflow-hidden">
                    {safeImages[selectedImage] && !imageErrors.has(safeImages[selectedImage]) ? (
                      <Image
                        src={safeImages[selectedImage]}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        priority
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
                    <div className="grid grid-cols-4 gap-2 sm:gap-3">
                      {safeImages.map((image, index) => {
                        const hasError = imageErrors.has(image)
                        const shouldOptimize = shouldOptimizeImage(image)
                        
                        return (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`cursor-pointer relative w-full h-16 sm:h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImage === index 
                                ? 'border-accent1 scale-105' 
                                : 'border-transparent hover:border-accent2'
                            }`}
                          >
                            {image && !hasError && image !== '/placeholder-image.jpg' ? (
                              <Image
                                src={image}
                                alt={`${product.name} ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 25vw, (max-width: 1024px) 12.5vw, 6.25vw"
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
                <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-4 sm:space-y-6">
              {/* Product Title and Description */}
              <div className="space-y-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary leading-tight">
                  {product.name}
                </h1>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price and Category */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-2xl sm:text-3xl font-bold text-accent1">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center space-x-2 bg-accent1 text-white px-3 py-1 rounded-full w-fit">
                    <Tag className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs sm:text-sm font-medium">{product.category?.name || 'Uncategorized'}</span>
                  </div>
                </div>
              </div>

              {/* Category Information */}
              {product.category && (
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Category Details</h3>
                  <div className="flex items-center space-x-3">
                    {categoryImage && categoryImage !== '/placeholder-image.jpg' && !imageErrors.has(categoryImage) ? (
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                        <Image
                          src={categoryImage}
                          alt={product.category.name}
                          fill
                          className="object-cover rounded"
                          sizes="40px"
                          unoptimized={!shouldOptimizeImage(categoryImage)}
                          onError={() => handleImageError(categoryImage)}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-primary text-sm sm:text-base truncate">
                        {product.category.name}
                      </p>
                      {product.category.description && (
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {product.category.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 sm:space-y-4 pt-4 border-t">
                {/* Primary Action */}
                <button className="cursor-pointer w-full bg-accent2 text-primary py-3 sm:py-4 px-6 rounded-lg font-semibold text-base sm:text-lg hover:bg-amber-600 hover:text-white transition-colors flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Add to Cart</span>
                </button>
                
                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  <button className="cursor-pointer bg-primary text-white py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base">
                    Buy Now
                  </button>
                  <button className="cursor-pointer border border-gray-300 text-gray-700 py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base">
                    <Heart className="h-4 w-4" />
                    <span>Wishlist</span>
                  </button>
                </div>

                {/* Share Button */}
                <button className="cursor-pointer w-full border border-gray-300 text-gray-700 py-2 sm:py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <Share2 className="h-4 w-4" />
                  <span>Share Product</span>
                </button>
              </div>

              {/* Additional Product Info */}
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="text-base sm:text-lg font-semibold text-primary mb-3">Product Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-gray-500 block mb-1">Product ID:</span>
                    <p className="font-mono text-primary text-xs truncate">{product.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 block mb-1">URL Slug:</span>
                    <p className="font-mono text-primary text-xs truncate">{product.slug}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}