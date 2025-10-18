'use client'

import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Navbar from "@/components/Navbar"
import Link from "next/link"
import { Package, Plus, Tag, Menu, ChevronLeft, ChevronRight } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      if (!isAuthenticated) {
        router.push("/admin-login")
      } else {
        setIsCheckingAuth(false)
      }
    }
  }, [mounted, isAuthenticated, router])

  // Show loading state while checking authentication
  if (!mounted || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent1 mx-auto mb-4"></div>
          <p className="text-primary">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render the dashboard layout if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const navigation = [
    { name: "Products", href: "/dashboard/products", icon: Package },
    { name: "Categories", href: "/dashboard/categories", icon: Tag },
    { name: "Create Product", href: "/dashboard/create-product", icon: Plus },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-secondary">
      <Navbar />

      <div className="md:hidden bg-white shadow-sm border-b p-4 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="cursor-pointer p-2 rounded-lg bg-primary text-white hover:bg-accent1 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <span className="font-semibold text-primary">Dashboard</span>
      </div>

      <div className="flex flex-1 relative">
        <aside
          className={`
            fixed md:static inset-y-0 left-0 bg-primary text-white transform
            transition-transform duration-300 ease-in-out z-50
            w-64 p-4
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold">Dashboard</h2>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="cursor-pointer md:hidden p-1 rounded hover:bg-accent1"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent1 text-white"
                      : "hover:bg-accent1 hover:text-white text-secondary"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Overlay (mobile only) */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}