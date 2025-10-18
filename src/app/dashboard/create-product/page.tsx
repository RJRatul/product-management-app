'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { productSchema, ProductFormData } from '@/lib/validations'
import { apiService } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductForm from '@/components/ProductForm'

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true)
    setError('')

    try {
      // Remove empty strings but keep all valid URLs (including uploaded ones)
      const validImages = data.images.filter(img => img.trim() !== '')

      if (validImages.length === 0) {
        throw new Error('At least one image is required')
      }

      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        images: validImages,
      }

      await apiService.createProduct(productData)
      router.push('/dashboard/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
        <h1 className="text-3xl font-bold text-primary">Create Product</h1>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitButtonText="Create Product"
      />
    </div>
  )
}