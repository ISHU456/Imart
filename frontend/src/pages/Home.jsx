import React from 'react'
import MainBanner from '../components/MainBanner'
import Categories from '../components/Categories'
import BestSeller from '../components/BestSeller'
import BottomBanner from '../components/BottomBanner'
import NewsLetter from '../components/NewsLetter'
import TeamSection from '../components/Team'
import MenRow from '../components/Men'
import WomenRow from '../components/WomenRow'
import FadeInOnScroll from '../components/FadeInOnScroll'
import { motion } from 'framer-motion'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section with Enhanced Styling */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden"
      >
        <FadeInOnScroll>
          <div className="relative">
            <MainBanner />
            {/* Decorative Elements */}
            <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-24 h-24 sm:w-32 sm:h-32 bg-blue-500/10 rounded-full blur-xl"></div>
          </div>
        </FadeInOnScroll>
      </motion.div>

      {/* Categories Section with Enhanced Spacing */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative py-8 sm:py-16 w-full"
      >
        <FadeInOnScroll>
          <div className="relative w-full">
            <Categories />
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
          </div>
        </FadeInOnScroll>
      </motion.div>

      {/* Best Seller Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="relative py-8 sm:py-16 bg-white/50 w-full"
      >
        <FadeInOnScroll>
          <BestSeller />
        </FadeInOnScroll>
      </motion.div>

      {/* Men's Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
        className="relative py-8 sm:py-16 w-full"
      >
        <FadeInOnScroll>
          <div className="relative w-full">
            <MenRow />
            {/* Decorative accent */}
            <div className="absolute top-1/2 left-0 w-1 h-16 sm:h-20 bg-gradient-to-b from-primary to-blue-500 rounded-r-full"></div>
          </div>
        </FadeInOnScroll>
      </motion.div>

      {/* Women's Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        viewport={{ once: true }}
        className="relative py-8 sm:py-16 bg-gradient-to-r from-pink-50/50 to-purple-50/50 w-full"
      >
        <FadeInOnScroll>
          <div className="relative w-full">
            <WomenRow />
            {/* Decorative accent */}
            <div className="absolute top-1/2 right-0 w-1 h-16 sm:h-20 bg-gradient-to-b from-pink-500 to-purple-500 rounded-l-full"></div>
          </div>
        </FadeInOnScroll>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
        className="relative py-8 sm:py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 w-full"
      >
        <FadeInOnScroll>
          <div className="relative w-full">
            <TeamSection />
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          </div>
        </FadeInOnScroll>
      </motion.div>

      {/* Bottom Banner */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
        viewport={{ once: true }}
        className="relative py-8 sm:py-16 w-full"
      >
        <FadeInOnScroll>
          <div className="relative w-full">
            <BottomBanner />
            {/* Floating elements */}
            <div className="absolute top-5 sm:top-10 right-10 sm:right-20 w-12 h-12 sm:w-16 sm:h-16 bg-yellow-400/20 rounded-full animate-pulse"></div>
            <div className="absolute bottom-5 sm:bottom-10 left-10 sm:left-20 w-10 h-10 sm:w-12 sm:h-12 bg-green-400/20 rounded-full animate-pulse delay-1000"></div>
          </div>
        </FadeInOnScroll>
      </motion.div>

      {/* Newsletter Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        viewport={{ once: true }}
        className="relative py-8 sm:py-16 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10 w-full"
      >
        <FadeInOnScroll>
          <div className="relative w-full">
            <NewsLetter />
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          </div>
        </FadeInOnScroll>
      </motion.div>

      {/* Scroll to top indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50"
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      </motion.div>
    </div>
  )
}

export default Home