'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Product, apiService } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft, Edit, Trash2, Calendar, Tag, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { getSafeImageUrl } from '@/lib/utils'

export default function ProductDetailsPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
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
      <div>
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/products"
            className="flex items-center text-accent2 hover:text-amber-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-primary">Product Details</h1>
        </div>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div>
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard/products"
            className="flex items-center text-accent2 hover:text-amber-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-primary">Product Details</h1>
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link
            href="/dashboard/products"
            className="flex items-center text-accent2 hover:text-amber-600 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </Link>
          <h1 className="text-3xl font-bold text-primary">Product Details</h1>
        </div>
        
        <div className="flex space-x-3">
          <Link
            href={`/dashboard/edit-product/${product.slug}`}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="cursor-pointer flex items-center px-4 py-2 bg-accent3 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div className="space-y-4">
              {safeImages.length > 0 && safeImages[0] !== '/placeholder-image.jpg' ? (
                <>
                  <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={safeImages[selectedImage]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/placeholder-image.jpg'
                      }}
                    />
                  </div>
                  
                  {safeImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {safeImages.slice(1).map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index + 1)}
                          className={`relative w-full h-20 bg-gray-100 rounded overflow-hidden border-2 cursor-pointer ${
                            selectedImage === index + 1 ? 'border-accent1' : 'border-transparent'
                          } hover:border-accent2 transition-colors`}
                        >
                          <Image
                            src={image}
                            alt={`${product.name} ${index + 2}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1024px) 25vw, 12.5vw"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder-image.jpg'
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-80 bg-gray-200 rounded-lg flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-primary mb-2">{product.name}</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Price</h3>
                  <p className="text-2xl font-bold text-accent1">${product.price.toFixed(2)}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-400 mr-2" />
                    <p className="text-lg font-semibold text-primary">{product.category?.name}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Slug</h3>
                  <p className="text-sm font-mono text-primary bg-gray-100 px-2 py-1 rounded">
                    {product.slug}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Product ID</h3>
                  <p className="text-sm font-mono text-primary bg-gray-100 px-2 py-1 rounded truncate">
                    {product.id}
                  </p>
                </div>
              </div>

              {/* Category Details */}
              {product.category && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-primary mb-4">Category Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category Name</h4>
                      <p className="text-primary">{product.category.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Category ID</h4>
                      <p className="text-sm font-mono text-primary">{product.category.id}</p>
                    </div>
                    {categoryImage && categoryImage !== '/placeholder-image.jpg' && (
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Category Image</h4>
                        <div className="relative w-20 h-20">
                          <Image
                            src={categoryImage}
                            alt={product.category.name}
                            fill
                            className="object-cover rounded"
                            sizes="80px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = '/placeholder-image.jpg'
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-primary mb-4">Timestamps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Created At</h4>
                      <p className="text-primary">
                        {new Date(product.createdAt).toLocaleDateString()} at{' '}
                        {new Date(product.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Updated At</h4>
                      <p className="text-primary">
                        {new Date(product.updatedAt).toLocaleDateString()} at{' '}
                        {new Date(product.updatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {product.category && (
                <div className="border-t pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Category Created</h4>
                        <p className="text-primary">
                          {new Date(product.category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Category Updated</h4>
                        <p className="text-primary">
                          {new Date(product.category.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
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