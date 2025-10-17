'use client'

import { useState, useEffect, useCallback } from 'react'
import { Category, apiService } from '@/lib/api'
import Link from 'next/link'
import { Plus, Search, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { getSafeImageUrl, shouldOptimizeImage } from '@/lib/utils'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [limit] = useState(10)
  const [hasMore, setHasMore] = useState(true)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      let data: Category[]
      
      if (search) {
        data = await apiService.searchCategories(search)
      } else {
        data = await apiService.getCategories(offset, limit)
      }
      
      setCategories(data)
      setHasMore(data.length === limit)
    } catch {
      setError('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }, [offset, limit, search])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl))
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setOffset(0)
  }

  const handleNext = () => {
    setOffset(prev => prev + limit)
  }

  const handlePrevious = () => {
    setOffset(prev => Math.max(0, prev - limit))
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? This will affect all products in this category.')) {
      return
    }

    try {
      await apiService.deleteCategory(id)
      fetchCategories() // Refresh the list
    } catch {
      setError('Failed to delete category')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Categories</h1>
        <Link
          href="/dashboard/create-category"
          className="bg-accent1 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Category</span>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search categories by name..."
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

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => {
                  const categoryImage = category.image ? getSafeImageUrl(category.image) : null
                  const shouldOptimize = categoryImage && categoryImage !== '/placeholder-image.jpg' 
                    ? shouldOptimizeImage(categoryImage)
                    : false
                  const hasError = categoryImage && imageErrors.has(categoryImage)

                  return (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {categoryImage && !hasError && categoryImage !== '/placeholder-image.jpg' ? (
                          <div className="relative h-12 w-12">
                            <Image
                              src={categoryImage}
                              alt={category.name}
                              fill
                              className="object-cover rounded"
                              unoptimized={!shouldOptimize}
                              onError={() => handleImageError(categoryImage)}
                            />
                          </div>
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center">
                            <ImageIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {category.description || 'No description'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Link
                          href={`/dashboard/edit-category/${category.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-accent3 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!search && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={handlePrevious}
            disabled={offset === 0}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Showing {offset + 1} to {offset + categories.length}
          </span>
          
          <button
            onClick={handleNext}
            disabled={!hasMore}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}