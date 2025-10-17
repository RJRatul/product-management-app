'use client'

import { useState, useEffect } from 'react'
import { Product, apiService } from '@/lib/api'
import ProductTable from '@/components/ProductTable'
import Link from 'next/link'
import { Plus, Search } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [limit] = useState(10)
  const [hasMore, setHasMore] = useState(true)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await apiService.getProducts(offset, limit, search)
      setProducts(data)
      setHasMore(data.length === limit)
    } catch (err) {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [offset, search])

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteProduct(id)
      // Refresh the products list
      fetchProducts()
    } catch (err) {
      setError('Failed to delete product')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOffset(0)
    fetchProducts()
  }

  const handleNext = () => {
    setOffset(prev => prev + limit)
  }

  const handlePrevious = () => {
    setOffset(prev => Math.max(0, prev - limit))
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Products</h1>
        <Link
          href="/dashboard/create-product"
          className="bg-accent1 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent1 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-accent2 text-primary px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <ProductTable
        products={products}
        onDelete={handleDelete}
        isLoading={loading}
      />

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          disabled={offset === 0}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Previous
        </button>
        
        <span className="text-sm text-gray-600">
          Showing {offset + 1} to {offset + products.length}
        </span>
        
        <button
          onClick={handleNext}
          disabled={!hasMore}
          className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}