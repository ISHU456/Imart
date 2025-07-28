import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { categories } from '../assets/assets';

const AllProducts = () => {
    const { products, searchQuery } = useAppContext();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showFilters, setShowFilters] = useState(false);
    
    // Filter states
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [priceRange, setPriceRange] = useState([0, 10000]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [sortBy, setSortBy] = useState('name');
    const [inStockOnly, setInStockOnly] = useState(true);

    // Available sizes
    const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    useEffect(() => {
        let filtered = products;

        // Search filter
        if (searchQuery.length > 0) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => 
                selectedCategories.includes(product.category)
            );
        }

        // Price range filter
        filtered = filtered.filter(product => 
            product.offerPrice >= priceRange[0] && product.offerPrice <= priceRange[1]
        );

        // Size filter
        if (selectedSizes.length > 0) {
            filtered = filtered.filter(product => 
                product.sizes && product.sizes.some(size => selectedSizes.includes(size))
            );
        }

        // Stock filter
        if (inStockOnly) {
            filtered = filtered.filter(product => product.inStock);
        }

        // Sort products
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price-low':
                    return a.offerPrice - b.offerPrice;
                case 'price-high':
                    return b.offerPrice - a.offerPrice;
                case 'newest':
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                default:
                    return 0;
            }
        });

        setFilteredProducts(filtered);
    }, [products, searchQuery, selectedCategories, priceRange, selectedSizes, sortBy, inStockOnly]);

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleSizeToggle = (size) => {
        setSelectedSizes(prev => 
            prev.includes(size) 
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setPriceRange([0, 10000]);
        setSelectedSizes([]);
        setSortBy('name');
        setInStockOnly(true);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (selectedCategories.length > 0) count++;
        if (priceRange[0] > 0 || priceRange[1] < 10000) count++;
        if (selectedSizes.length > 0) count++;
        if (!inStockOnly) count++;
        return count;
    };

    return (
        <div className="bg-gray-50 min-h-screen pt-16">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">All Products</h1>
                    <p className="text-sm sm:text-base text-gray-600">Discover our complete collection</p>
                </motion.div>

                <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 xl:gap-10">
                    {/* Mobile Filter Toggle */}
                    <div className="xl:hidden">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-between shadow-sm"
                        >
                            <span className="font-medium text-gray-700">Filters</span>
                            <div className="flex items-center space-x-2">
                                {getActiveFiltersCount() > 0 && (
                                    <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                                        {getActiveFiltersCount()}
                                    </span>
                                )}
                                <svg className={`w-5 h-5 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </button>
                    </div>

                    {/* Filter Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`xl:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden xl:block'}`}
                    >
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {/* Filter Header */}
                            <div className="flex items-center justify-between">
                                <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
                                {getActiveFiltersCount() > 0 && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-xs sm:text-sm text-primary hover:text-primary-dark"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>

                            {/* Category Filter */}
                            <div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Categories</h3>
                                <div className="space-y-1 sm:space-y-2 max-h-32 overflow-y-auto">
                                    {categories.map((category) => (
                                        <label key={category.path} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.path)}
                                                onChange={() => handleCategoryToggle(category.path)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="ml-2 text-xs sm:text-sm text-gray-700">{category.text}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Price Range Filter */}
                            <div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Price Range</h3>
                                <div className="space-y-2 sm:space-y-3">
                                    <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                                        <span>₹{priceRange[0]}</span>
                                        <span>₹{priceRange[1]}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10000"
                                        step="100"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                            className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                                        />
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 10000])}
                                            className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Size Filter */}
                            <div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Sizes</h3>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2 max-h-32 overflow-y-auto">
                                    {availableSizes.map((size) => (
                                        <label key={size} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedSizes.includes(size)}
                                                onChange={() => handleSizeToggle(size)}
                                                className="rounded border-gray-300 text-primary focus:ring-primary"
                                            />
                                            <span className="ml-1 text-xs text-gray-700">{size}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Stock Filter */}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-xs sm:text-sm text-gray-700">In stock only</span>
                                </label>
                            </div>

                            {/* Sort Options */}
                            <div>
                                <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">Sort By</h3>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-2 sm:px-3 py-1 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="name">Name A-Z</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="newest">Newest First</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>

                    {/* Products Grid */}
                    <div className="flex-1 min-w-0">
                        {/* Results Header */}
                        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Showing <span className="font-medium">{filteredProducts.length}</span> of{' '}
                                    <span className="font-medium">{products.length}</span> products
                                </p>
                                {getActiveFiltersCount() > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {getActiveFiltersCount()} filter(s) applied
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Products Grid */}
                        {filteredProducts.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10"
                            >
                                {filteredProducts.map((product, index) => (
                                    <motion.div
                                        key={product._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="w-full"
                                    >
                                        <ProductCard product={product} />
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-8 sm:py-12"
                            >
                                <div className="text-gray-400 text-4xl sm:text-6xl mb-4">🔍</div>
                                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No products found</h3>
                                <p className="text-sm sm:text-base text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-3 sm:px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm sm:text-base"
                                >
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllProducts;