import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: assets.banner1,
    heading: 'Everything You Need, In One Place',
    subheading: "From groceries to gadgets — delivered fast.",
    description: "Get the best deals on fresh groceries delivered at your doorstep. Affordable, fast, and farm-fresh.",
    bgGradient: 'from-blue-600/20 to-purple-600/20',
    textColor: 'text-white',
    overlayColor: 'bg-black/40'
  },
  {
    id: 2,
    image: assets.banner2,
    heading: 'Deals That Make You Smile',
    subheading: 'Unbeatable prices on your favorite brands.',
    description: "Discover amazing discounts and offers on premium products. Quality meets affordability.",
    bgGradient: 'from-green-600/20 to-blue-600/20',
    textColor: 'text-white',
    overlayColor: 'bg-black/35'
  },
  {
    id: 3,
    image: assets.banner3,
    heading: 'Shop Smart, Live Better',
    subheading: 'Convenience, savings, and trusted quality.',
    description: "Experience seamless shopping with our user-friendly platform and reliable delivery service.",
    bgGradient: 'from-orange-600/20 to-red-600/20',
    textColor: 'text-white',
    overlayColor: 'bg-black/30'
  },
  {
    id: 4,
    image: assets.banner4,
    heading: 'Fast Delivery, Big Savings',
    subheading: 'Why wait? Get what you love—quicker & cheaper.',
    description: "Lightning-fast delivery combined with incredible savings. Your satisfaction is our priority.",
    bgGradient: 'from-purple-600/20 to-pink-600/20',
    textColor: 'text-white',
    overlayColor: 'bg-black/45'
  },
  {
    id: 5,
    image: assets.banner5,
    heading: 'India\'s Trusted Online Store',
    subheading: 'Millions of happy customers. You\'re next.',
    description: "Join millions of satisfied customers who trust us for their daily shopping needs.",
    bgGradient: 'from-indigo-600/20 to-cyan-600/20',
    textColor: 'text-white',
    overlayColor: 'bg-black/50'
  },
];

const MainBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [direction, setDirection] = useState(0);

  // Auto-play with hover pause
  useEffect(() => {
    if (isHovering) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentSlide((prevIndex) => (prevIndex + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovering]);

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div
      className="relative w-full overflow-hidden h-[80vh] md:h-[85vh] lg:h-[90vh]"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/10 via-transparent to-gray-900/10 z-0"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Slides */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute top-0 left-0 w-full h-full"
        >
          <img
            src={slides[currentSlide].image}
            alt={`slide-${slides[currentSlide].id}`}
            className="w-full h-full object-cover"
          />
          
          {/* Dynamic Overlay */}
          <div className={`absolute inset-0 ${slides[currentSlide].overlayColor} backdrop-blur-sm`}></div>
          
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].bgGradient}`}></div>

          {/* Content Container */}
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl">
                {/* Banner Text with Enhanced Styling */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className={`${slides[currentSlide].textColor} space-y-4 sm:space-y-6`}
                >
                  {/* Main Heading */}
                  <motion.h1 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight"
                  >
                    <span className="block">{slides[currentSlide].heading}</span>
                    <span className="block bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                      {slides[currentSlide].subheading}
                    </span>
                  </motion.h1>

                  {/* Description */}
                  <motion.p 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="text-sm sm:text-lg md:text-xl lg:text-2xl max-w-2xl leading-relaxed opacity-90 font-medium"
                  >
                    {slides[currentSlide].description}
                  </motion.p>

                  {/* CTA Buttons */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 pt-2 sm:pt-4"
                  >
                    <Link
                      to="/products"
                      className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-primary hover:bg-primary-dull transition-all duration-300 rounded-lg text-white font-semibold text-sm sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto"
                    >
                      Shop Now
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    
                    <Link
                      to="/products"
                      className="group flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-300 rounded-lg text-white font-semibold text-sm sm:text-lg border border-white/30 hover:border-white/50 w-full sm:w-auto"
                    >
                      Explore Categories
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>
                  </motion.div>

                  {/* Features */}
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1 }}
                    className="flex flex-wrap items-center gap-3 sm:gap-6 pt-4 sm:pt-8"
                  >
                    <div className="flex items-center gap-1 sm:gap-2 text-white/90">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium">Free Delivery</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-white/90">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium">24/7 Support</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 text-white/90">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs sm:text-sm font-medium">Secure Payment</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300 flex items-center justify-center group"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full transition-all duration-300 flex items-center justify-center group"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              currentSlide === index 
                ? 'bg-primary w-6 sm:w-8 shadow-lg' 
                : 'bg-white/60 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-30">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

export default MainBanner;
