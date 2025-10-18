'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product, Category, apiService } from '@/lib/api'
import ProductTable from '@/components/ProductTable'
import Pagination from '@/components/Pagination'
import Link from 'next/link'
import { Plus, Search, Filter, X } from 'lucide-react'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [offset, setOffset] = useState(0)
  const [limit] = useState(10)
  const [hasMore, setHasMore] = useState(true)

  // Fetch categories for filter dropdown
  const fetchCategories = useCallback(async () => {
    try {
      const data = await apiService.getCategories(0, 100) // Get all categories
      setCategories(data)
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      let data: Product[]
      
      if (search) {
        // Use search endpoint when there's search text
        data = await apiService.searchProducts(search, offset, limit)
      } else if (selectedCategory) {
        // Use category filter when category is selected
        data = await apiService.getProducts(offset, limit, '', selectedCategory)
      } else {
        // Normal paginated products
        data = await apiService.getProducts(offset, limit)
      }
      
      setProducts(data)
      setHasMore(data.length === limit)
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }, [offset, limit, search, selectedCategory])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteProduct(id)
      fetchProducts()
    } catch {
      setError('Failed to delete product')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOffset(0)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setOffset(0)
    setSearch('') // Clear search when category is selected
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setOffset(0)
  }

  const handleNext = () => {
    setOffset(prev => prev + limit)
  }

  const handlePrevious = () => {
    setOffset(prev => Math.max(0, prev - limit))
  }

  const hasActiveFilters = search || selectedCategory

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Products</h1>
        <Link
          href="/dashboard/create-product"
          className="bg-accent1 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
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
            className="cursor-pointer bg-accent2 text-primary px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors whitespace-nowrap"
          >
            Search
          </button>
        </form>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="cursor-pointer border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent1 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="cursor-pointer flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Active Filters Info */}
        {hasActiveFilters && (
          <div className="text-sm text-gray-600">
            {search && <span>Search: {search}</span>}
            {search && selectedCategory && <span> • </span>}
            {selectedCategory && (
              <span>
                Category: {categories.find(c => c.id === selectedCategory)?.name}
              </span>
            )}
          </div>
        )}
      </div>

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

      {/* Pagination - Only show when we have products and not in pure search mode without results */}
      {products.length > 0 && (
        <div className="mt-6">
          <Pagination
            offset={offset}
            limit={limit}
            count={products.length}
            hasMore={hasMore}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && products.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {hasActiveFilters ? 'No products found' : 'No products'}
          </h3>
          <p className="text-gray-500 mb-4">
            {hasActiveFilters 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first product.'
            }
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="bg-accent1 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}