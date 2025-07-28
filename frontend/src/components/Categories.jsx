import React from 'react';
import { categories } from '../assets/assets';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';

const popularCategories = ['MEN', 'Women', 'Kids', 'Electronics']; // Example popular categories

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } },
};

const Categories = () => {
  const { navigate } = useAppContext();

  return (
    <div className="mt-8 sm:mt-16 w-full">
      <p className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-10 tracking-tight">
        <span className="inline-block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Shop by Category</span>
      </p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {categories.map((category, index) => (
          <motion.div
            key={index}
            className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden flex flex-col"
            variants={cardVariants}
            whileHover={{ scale: 1.045, boxShadow: '0 8px 32px 0 rgba(0,0,0,0.12)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              navigate(`/products/${category.path.toLowerCase()}`);
              scrollTo(0, 0);
            }}
          >
            {/* Popular badge */}
            {popularCategories.includes(category.path) && (
              <span className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs font-bold px-2 sm:px-3 py-1 rounded-full shadow-md z-10">
                Popular
              </span>
            )}
            {/* Colored accent bar */}
            <div style={{ background: category.bgColor }} className="h-2 w-full absolute top-0 left-0" />
            <div className="relative">
              <img
                className="w-full h-40 sm:h-52 object-cover object-center rounded-t-2xl sm:rounded-t-3xl group-hover:scale-110 transition-transform duration-500"
                src={category.image}
                alt={category.text}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 rounded-t-2xl sm:rounded-t-3xl pointer-events-none" />
            </div>
            <div className="flex flex-col items-center flex-1 p-4 sm:p-6 pb-4 sm:pb-5">
              <p className="font-bold mt-2 text-gray-800 text-lg sm:text-xl text-center tracking-tight drop-shadow-sm">
                {category.text}
              </p>
              {/* Example description/tagline for each category */}
              <p className="text-gray-500 text-xs capitalize mb-3 text-center">
                {category.text === 'Mens' && 'Trendy fashion for men'}
                {category.text === 'Womens' && 'Latest styles for women'}
                {category.text === 'Kids' && 'Fun & comfy for kids'}
                {category.text === 'Electronics' && 'Best gadgets & devices'}
                {category.text === 'Organic veggies' && 'Fresh from the farm'}
                {category.text === 'Fresh Fruits' && 'Juicy & healthy fruits'}
                {category.text === 'Cold Drinks' && 'Chilled & refreshing'}
                {category.text === 'Instant Food' && 'Quick & tasty meals'}
                {category.text === 'Dairy Products' && 'Pure & nutritious dairy'}
                {category.text === 'Bakery & Breads' && 'Freshly baked goodness'}
                {category.text === 'Grains & Cereals' && 'Wholesome grains & more'}
              </p>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.96 }}
                className="w-28 sm:w-32 h-8 sm:h-10 rounded-full mt-auto mb-2 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold text-sm shadow-md hover:scale-105 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                Shop Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Categories;
