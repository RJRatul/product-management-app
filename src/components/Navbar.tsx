'use client'

import Link from 'next/link'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '@/lib/store'
import { logout } from '@/lib/features/authSlice'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, Home, LayoutDashboard, LogOut } from 'lucide-react'

export default function Navbar() {
  const { isAuthenticated, email } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const handleNavClick = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  if (!mounted) {
    return (
      <nav className="bg-primary text-secondary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="text-xl font-bold bg-gray-600 h-6 w-48 rounded animate-pulse"></div>
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
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold flex items-center">
              <ShoppingBag className="h-6 w-6 mr-2" />
              ProductStore
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:items-baseline md:space-x-4">
              <Link 
                href="/" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent1 transition-colors flex items-center"
              >
                <Home className="h-4 w-4 mr-1" />
                Home
              </Link>
              <Link 
                href="/shop" 
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent1 transition-colors flex items-center"
              >
                <ShoppingBag className="h-4 w-4 mr-1" />
                Shop
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/dashboard/products" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-accent1 transition-colors flex items-center"
                >
                  <LayoutDashboard className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm">Welcome, {email}</span>
                <button
                  onClick={handleLogout}
                  className="cursor-pointer bg-accent3 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/admin-login"
                className="bg-accent2 text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-amber-600 transition-colors flex items-center"
              >
                Admin Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="cursor-pointer inline-flex items-center justify-center p-2 rounded-md text-secondary hover:bg-accent1 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary border-t border-accent1">
            {/* Mobile Navigation Links */}
            <Link
              href="/"
              className="text-secondary hover:bg-accent1 block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center"
              onClick={closeMobileMenu}
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Link>
            
            <Link
              href="/shop"
              className="text-secondary hover:bg-accent1 block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center"
              onClick={closeMobileMenu}
            >
              <ShoppingBag className="h-5 w-5 mr-3" />
              Shop
            </Link>

            {isAuthenticated && (
              <Link
                href="/dashboard/products"
                className="text-secondary hover:bg-accent1 block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center"
                onClick={closeMobileMenu}
              >
                <LayoutDashboard className="h-5 w-5 mr-3" />
                Dashboard
              </Link>
            )}

            {/* Mobile Auth Section */}
            <div className="border-t border-accent1 pt-4 mt-4">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-3 py-2 text-sm text-gray-300">
                    Welcome, {email}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer w-full text-left text-secondary hover:bg-accent1 block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/admin-login"
                  className="text-secondary hover:bg-accent1 block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center justify-center bg-accent2 text-primary font-semibold"
                  onClick={closeMobileMenu}
                >
                  Admin Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}