'use client'

import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Package, 
  Shield, 
  Zap, 
  BarChart3, 
  Users, 
  Settings,
  ArrowRight,
  Play,
  CheckCircle2,
  Database,
  TrendingUp
} from 'lucide-react'

export default function Home() {
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const features = [
    {
      icon: <Package className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Product Management",
      description: "Effortlessly manage your entire product catalog with our intuitive dashboard.",
      color: "accent1",
      bgColor: "bg-accent1/10"
    },
    {
      icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Analytics Dashboard",
      description: "Gain insights with real-time analytics and performance metrics.",
      color: "accent2",
      bgColor: "bg-accent2/10"
    },
    {
      icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team with role-based access control.",
      color: "accent1",
      bgColor: "bg-accent1/10"
    },
    {
      icon: <Settings className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Automated Workflows",
      description: "Streamline operations with customizable automation rules.",
      color: "accent2",
      bgColor: "bg-accent2/10"
    }
  ]

  useEffect(() => {
    // Disable auto-rotation on mobile for better UX
    if (!isMobile) {
      const interval = setInterval(() => {
        setCurrentFeature((prev) => (prev + 1) % features.length)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [features.length, isMobile])

  return (
    <div className="min-h-screen bg-secondary">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent1/5" />
        
        {/* Background animations - Only on desktop */}
        {!isMobile && (
          <>
            <motion.div 
              className="absolute top-0 left-0 w-48 h-48 sm:w-72 sm:h-72 bg-accent1/10 rounded-full -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-accent2/10 rounded-full translate-x-1/3 translate-y-1/3"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </>
        )}
        
        <div className="relative container mx-auto px-4 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-accent1/10 border border-accent1/20 mb-4 sm:mb-6"
            >
              <motion.span 
                className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-accent1 rounded-full mr-2"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs sm:text-sm text-accent1 font-medium">Product Management Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 sm:mb-6 leading-tight"
            >
              Manage Your
              <motion.span 
                className="block text-accent1"
                animate={!isMobile ? { opacity: [1, 0.9, 1] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Products Smarter
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Streamline your product catalog, inventory, and analytics with our powerful 
              all-in-one product management solution built for modern businesses.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4"
            >
              <Link
                href="/dashboard/products"
                className="group bg-accent1 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 hover:shadow-lg hover:shadow-accent1/25 flex items-center space-x-2 w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                <span>Get Started</span>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </motion.div>
              </Link>
              
              <Link
                href="/shop"
                className="group border-2 border-primary text-primary px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-primary hover:text-black transition-all duration-300 flex items-center space-x-2 w-full sm:w-auto justify-center text-sm sm:text-base"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>View Shop</span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4"
            >
              {[
                { number: '10K+', label: 'Products', icon: <Database className="w-6 h-6 sm:w-8 sm:h-8" /> },
                { number: '500+', label: 'Stores', icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8" /> },
                { number: '99.9%', label: 'Uptime', icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" /> }
              ].map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center group"
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="flex justify-center mb-1 sm:mb-2">
                    <div className={`p-2 sm:p-3 rounded-lg ${
                      index === 0 ? 'bg-accent1 text-white' : 
                      index === 1 ? 'bg-accent2 text-primary' : 
                      'bg-accent1 text-white'
                    }`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-primary mb-1 group-hover:text-accent1 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 group-hover:text-primary transition-colors">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 sm:mb-4">
              Everything You Need
              <span className="block text-accent2">To Manage Products</span>
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Powerful features designed to streamline your product management workflow.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center max-w-6xl mx-auto">
            {/* Feature List */}
            <div className="space-y-4 sm:space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`p-4 sm:p-6 rounded-lg sm:rounded-xl transition-all duration-300 cursor-pointer border-2 ${
                    currentFeature === index 
                      ? `bg-${feature.color} text-white shadow-lg sm:shadow-xl border-${feature.color} scale-100 sm:scale-105` 
                      : `bg-white hover:bg-gray-50 border-gray-200 hover:border-${feature.color}/30 hover:scale-100 sm:hover:scale-102`
                  }`}
                  onMouseEnter={!isMobile ? () => setCurrentFeature(index) : undefined}
                  whileHover={!isMobile ? { scale: 1.02 } : {}}
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${
                      currentFeature === index 
                        ? 'bg-white/20 text-white' 
                        : `bg-${feature.color} text-white`
                    }`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg sm:text-xl font-semibold mb-1 sm:mb-2 ${
                        currentFeature === index ? 'text-white' : 'text-primary'
                      }`}>
                        {feature.title}
                      </h3>
                      <p className={`text-sm sm:text-base leading-relaxed ${
                        currentFeature === index ? 'text-white/90' : 'text-gray-600'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Feature Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <motion.div
                animate={!isMobile ? { y: [0, -10, 0] } : {}}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg sm:shadow-2xl"
              >
                <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow border border-gray-200">
                  <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                    <motion.div 
                      className="w-2 h-2 sm:w-3 sm:h-3 bg-accent3 rounded-full"
                      animate={!isMobile ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div 
                      className="w-2 h-2 sm:w-3 sm:h-3 bg-accent2 rounded-full"
                      animate={!isMobile ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 sm:w-3 sm:h-3 bg-accent1 rounded-full"
                      animate={!isMobile ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                    />
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <motion.div 
                      className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-accent1/10 transition-colors"
                      whileHover={!isMobile ? { scale: 1.02 } : {}}
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Total Products</span>
                      <span className="text-base sm:text-lg font-bold text-accent1">1,247</span>
                    </motion.div>
                    
                    <motion.div 
                      className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-accent2/10 transition-colors"
                      whileHover={!isMobile ? { scale: 1.02 } : {}}
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Categories</span>
                      <span className="text-base sm:text-lg font-bold text-accent2">24</span>
                    </motion.div>
                    
                    <motion.div 
                      className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg hover:bg-accent3/10 transition-colors"
                      whileHover={!isMobile ? { scale: 1.02 } : {}}
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-600">Low Stock</span>
                      <span className="text-base sm:text-lg font-bold text-accent3">12</span>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-r from-accent1 to-accent1/90 p-3 sm:p-4 rounded-lg text-white text-center hover:shadow-lg transition-shadow"
                      whileHover={!isMobile ? { scale: 1.02 } : {}}
                    >
                      <div className="text-xs sm:text-sm opacity-90">Total Revenue</div>
                      <div className="text-xl sm:text-2xl font-bold">$124,890</div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
              
              {/* Floating Elements - Only on desktop */}
              {!isMobile && (
                <>
                  <motion.div
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute -top-3 -left-3 bg-accent1 text-white p-2 rounded-lg shadow-lg"
                  >
                    <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                  
                  <motion.div
                    animate={{ y: [0, 15, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    className="absolute -bottom-3 -right-3 bg-accent2 text-primary p-2 rounded-lg shadow-lg"
                  >
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-primary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Ready to Transform
              <span className="block text-accent2">Your Product Management?</span>
            </h2>
            
            <p className="text-base sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Join thousands of businesses that trust our platform to manage their product catalogs efficiently.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
              <motion.div whileHover={!isMobile ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  href="#"
                  className="bg-accent2 text-primary px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold hover:bg-amber-600 transition-all duration-300 hover:shadow-lg flex items-center space-x-2 w-full justify-center text-sm sm:text-base"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
              </motion.div>
              
              <motion.div whileHover={!isMobile ? { scale: 1.05 } : {}} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Link
                  href="#"
                  className="border-2 border-white text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold w-full justify-center flex text-sm sm:text-base"
                >
                  Schedule Demo
                </Link>
              </motion.div>
            </div>

            <motion.div 
              className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300 px-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {[
                'No card required',
                '14-day free trial',
                'Cancel anytime',
                '24/7 support'
              ].map((item, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-center space-x-1 sm:space-x-2"
                  whileHover={!isMobile ? { scale: 1.05 } : {}}
                >
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-accent2" />
                  <span>{item}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}