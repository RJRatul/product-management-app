'use client'

import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, Plus, Settings } from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin-login')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent1"></div>
      </div>
    )
  }

  const navigation = [
    { name: 'Products', href: '/dashboard/products', icon: Package },
    { name: 'Create Product', href: '/dashboard/create-product', icon: Plus },
  ]

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-primary min-h-screen p-4">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-accent1 text-white'
                      : 'text-secondary hover:bg-accent1 hover:text-white'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  )
}