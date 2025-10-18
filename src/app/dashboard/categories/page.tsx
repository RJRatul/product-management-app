'use client'

import { useState, useEffect, useCallback } from 'react'
import { Category, apiService } from '@/lib/api'
import Pagination from '@/components/Pagination'
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
        // When searching, reset pagination and show all results
        setOffset(0)
        setHasMore(false)
      } else {
        data = await apiService.getCategories(offset, limit)
        setHasMore(data.length === limit)
      }
      
      setCategories(data)
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
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">Categories</h1>
        <Link
          href="#"
          className="cursor-not-allowed bg-accent1 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors w-full sm:w-auto justify-center"
        >
          <Plus className="h-5 w-5" />
          <span>Add Category</span>
        </Link>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
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
            className="cursor-pointer bg-accent2 text-primary px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors whitespace-nowrap"
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
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category) => {
                    const categoryImage = category.image ? getSafeImageUrl(category.image) : null
                    const shouldOptimize = categoryImage && categoryImage !== '/placeholder-image.jpg' 
                      ? shouldOptimizeImage(categoryImage)
                      : false
                    const hasError = categoryImage && imageErrors.has(categoryImage)

                    return (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4">
                          <div className="flex items-center min-w-0">
                            <div className="flex-shrink-0 h-10 w-10">
                              {categoryImage && !hasError && categoryImage !== '/placeholder-image.jpg' ? (
                                <div className="relative h-10 w-10">
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
                                <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="ml-3 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {category.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 max-w-xs">
                          <div className="truncate">
                            {category.description || 'No description'}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(category.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-sm font-medium space-x-2">
                            <div className='flex items-center space-x-1'>
                          <Link
                            href={`/dashboard/edit-category/${category.id}`}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="cursor-pointer text-accent3 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {categories.map((category) => {
              const categoryImage = category.image ? getSafeImageUrl(category.image) : null
              const shouldOptimize = categoryImage && categoryImage !== '/placeholder-image.jpg' 
                ? shouldOptimizeImage(categoryImage)
                : false
              const hasError = categoryImage && imageErrors.has(categoryImage)

              return (
                <div key={category.id} className="bg-white border rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0">
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
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {category.name}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {category.description || 'No description'}
                        </p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          Created: {new Date(category.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile Actions */}
                    <div className="flex items-center space-x-1">
                      <Link
                        href={`/dashboard/edit-category/${category.id}`}
                        className="text-blue-600 hover:text-blue-900 p-1"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="cursor-pointer text-accent3 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Pagination - Only show when not searching */}
      {!search && categories.length > 0 && (
        <div className="mt-6">
          <Pagination
            offset={offset}
            limit={limit}
            count={categories.length}
            hasMore={hasMore}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        </div>
      )}

      {/* Empty State */}
      {!loading && categories.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
          <p className="mt-1 text-sm text-gray-500">
            {search ? 'No categories found for your search.' : 'Get started by creating a new category.'}
          </p>
        </div>
      )}
    </div>
  )
}