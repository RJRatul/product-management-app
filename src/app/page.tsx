import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-5xl font-bold text-primary mb-6">
            Welcome to ProductStore
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products and manage your inventory with our powerful e-commerce platform.
          </p>
          <div className="space-x-4">
            <Link
              href="/shop"
              className="bg-accent1 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Shop Now
            </Link>
            <Link
              href="/admin-login"
              className="bg-accent2 text-primary px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 transition-colors"
            >
              Admin Panel
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-accent1 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Product Management</h3>
              <p className="text-gray-600">Easily manage your product catalog with our intuitive dashboard.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent2 text-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Secure Access</h3>
              <p className="text-gray-600">Protected admin panel with secure authentication.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-accent3 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Real-time Updates</h3>
              <p className="text-gray-600">Instant updates and smooth user experience.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}