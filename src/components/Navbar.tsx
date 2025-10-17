'use client'

import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { logout } from '@/lib/features/authSlice'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function Navbar() {
  const { isAuthenticated, email } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
  }

  if (!mounted) {
    return (
      <nav className="bg-primary text-secondary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold">
                ProductStore
              </Link>
            </div>
            <div className="flex items-center">
              <div className="w-20 h-6 bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-primary text-secondary shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              ProductStore
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent1 transition-colors">
                Home
              </Link>
              <Link href="/shop" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent1 transition-colors">
                Shop
              </Link>
              {isAuthenticated && (
                <Link href="/dashboard/products" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent1 transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Welcome, {email}</span>
                <button
                  onClick={handleLogout}
                  className="bg-accent3 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/admin-login"
                className="bg-accent2 text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}