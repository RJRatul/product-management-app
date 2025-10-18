'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProductFormData } from '@/lib/validations'
import { apiService } from '@/lib/api'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ProductForm from '@/components/ProductForm'
import Toast, { ToastType } from '@/components/Toast'

export default function CreateProductPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  })
  const router = useRouter()

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  const handleSubmit = async (data: ProductFormData) => {
    setLoading(true)
    setError('')

    try {
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
      
      showToast('Product created successfully!', 'success')
      
      setTimeout(() => {
        router.push('/dashboard/products')
      }, 1500)
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create product. Please try again.'
      setError(errorMessage)
      showToast(errorMessage, 'error')
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
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">Create Product</h1>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        loading={loading}
        error={error}
        submitButtonText="Create Product"
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
        duration={toast.type === 'success' ? 3000 : 5000}
      />
    </div>
  )
}