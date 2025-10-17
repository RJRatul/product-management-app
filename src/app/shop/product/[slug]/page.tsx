'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Product, apiService } from '@/lib/api'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { ArrowLeft, Tag, Calendar, ShoppingCart } from 'lucide-react'

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const params = useParams()
  const slug = params.slug as string

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData: Product = await apiService.getProduct(slug)
        setProduct(productData)
      } catch (err) {
        setError('Failed to load product')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

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
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Product not found'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link
            href="/shop"
            className="flex items-center text-accent2 hover:text-amber-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {product.images && product.images.length > 0 ? (
                <>
                  <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={product.images[selectedImage]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-3">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`w-full h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                            selectedImage === index ? 'border-accent1' : 'border-transparent'
                          } hover:border-accent2 transition-colors`}
                        >
                          <img
                            src={image}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-lg">No images available</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-primary mb-4">{product.name}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-accent1">${product.price.toFixed(2)}</span>
                  <div className="flex items-center space-x-2 bg-accent1 text-white px-3 py-1 rounded-full">
                    <Tag className="h-4 w-4" />
                    <span className="text-sm font-medium">{product.category?.name}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Added: {new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>
                  {product.updatedAt !== product.createdAt && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Updated: {new Date(product.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Category Information */}
                {product.category && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Category Details</h3>
                    <div className="flex items-center space-x-4">
                      {product.category.image && (
                        <img
                          src={product.category.image}
                          alt={product.category.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium text-primary">{product.category.name}</p>
                        {product.category.description && (
                          <p className="text-sm text-gray-600">{product.category.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 space-y-4">
                <button className="w-full bg-accent2 text-primary py-4 px-6 rounded-lg font-semibold text-lg hover:bg-amber-600 hover:text-white transition-colors flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Cart</span>
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Buy Now
                  </button>
                  <button className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Add to Wishlist
                  </button>
                </div>
              </div>

              {/* Additional Product Info */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Product Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Product ID:</span>
                    <p className="font-mono text-primary truncate">{product.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Slug:</span>
                    <p className="font-mono text-primary">{product.slug}</p>
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