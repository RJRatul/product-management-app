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
      // Transform form data to match API requirements
      const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        images: data.images.filter(img => img.trim() !== ''), // Remove empty image URLs
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
      />

      <div className="flex justify-end space-x-3 mt-6">
        <Link
          href="/dashboard/products"
          className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </Link>
        <button
          onClick={() => document.querySelector('form')?.requestSubmit()}
          disabled={loading}
          className="px-6 py-2 bg-accent1 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent1 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
    </div>
  )
}