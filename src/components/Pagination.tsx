'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  offset: number
  limit: number
  count: number
  hasMore: boolean
  onNext: () => void
  onPrevious: () => void
}

export default function Pagination({
  offset,
  limit,
  count,
  hasMore,
  onNext,
  onPrevious
}: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1
  const startItem = offset + 1
  const endItem = offset + count

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="text-sm text-gray-600 text-center sm:text-left">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrevious}
          disabled={offset === 0}
          className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </button>
        
        <span className="px-3 py-2 text-sm text-gray-600 font-medium">
          Page {currentPage}
        </span>
        
        <button
          onClick={onNext}
          disabled={!hasMore}
          className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  )
}