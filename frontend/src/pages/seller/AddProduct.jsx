import React, { useState } from 'react'
import { assets, categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const AddProduct = () => {
    const [files,setFiles] = useState([]);
    const [name,setName] = useState('');
    const [description,setDescription] = useState(''); 
    const [detailedDescription,setDetailedDescription] = useState('');
    const [category,setCategory] = useState('');
    const [price,setPrice] = useState('');
    const [offerPrice,setOfferPrice] = useState('');
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {axios} = useAppContext();

    // Define available sizes for clothing
    const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
    const kidsSizes = ['2T', '3T', '4T', '5T', '6T', '7T', '8T', '10T', '12T', '14T'];
    
    // Check if current category is clothing
    const isClothingCategory = category === 'MEN' || category === 'Women' || category === 'Kids';
    
    // Get appropriate sizes based on category
    const getAvailableSizes = () => {
        if (category === 'Kids') return kidsSizes;
        return clothingSizes;
    };



    const handleSizeToggle = (size) => {
        setSelectedSizes(prev => 
            prev.includes(size) 
                ? prev.filter(s => s !== size)
                : [...prev, size]
        );
    };

    const onSumbitHandler = async (event)=>{
        try {
            event.preventDefault();
            
            // Validate size selection for clothing products
            if (isClothingCategory && selectedSizes.length === 0) {
                toast.error('Please select at least one size for clothing products');
                return;
            }
            
            setIsSubmitting(true);
            
            const productData = {
                name,
                description:description.split('\n'),
                detailedDescription,
                category,
                price,
                offerPrice,
                sizes: selectedSizes
            }
            const formData = new FormData();
            formData.append('productData',JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append('images',files[i]);
            }
            const {data} = await axios.post('/api/product/add',formData);
            if(data.success){
                toast.success(data.message);
                setName('');
                setDescription('');
                setDetailedDescription('');
                setCategory('');
                setPrice('');
                setOfferPrice('');
                setSelectedSizes([]);
                setFiles([]);
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="p-6 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
                <p className="text-gray-600">Create a new product listing for your store</p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onSubmit={(e)=>onSumbitHandler(e)}
                className="bg-white rounded-lg shadow-sm p-6 max-w-2xl"
            >
                {/* Product Images */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Product Images (Up to 4)</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Array(4).fill('').map((_, index) => (
                            <motion.label
                                key={index}
                                htmlFor={`image${index}`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative cursor-pointer"
                            >
                                <input
                                    onChange={(e)=>{
                                        const updatedFiles = [...files];
                                        updatedFiles[index]= e.target.files[0];
                                        setFiles(updatedFiles);
                                    }}
                                    type="file"
                                    id={`image${index}`}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden hover:border-primary transition-colors">
                                    {files[index] ? (
                                        <img
                                            className="w-full h-full object-cover"
                                            src={URL.createObjectURL(files[index])}
                                            alt={`Product ${index + 1}`}
                                        />
                                    ) : (
                                        <div className="text-center">
                                            <div className="text-3xl text-gray-400 mb-2">📷</div>
                                            <p className="text-xs text-gray-500">Add Image</p>
                                        </div>
                                    )}
                                </div>
                            </motion.label>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Product Name */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="product-name">
                            Product Name *
                        </label>
                        <input
                            onChange={(e)=>setName(e.target.value)}
                            value={name}
                            id="product-name"
                            type="text"
                            placeholder="Enter product name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="category">
                            Category *
                        </label>
                        <select
                            onChange={(e)=>setCategory(e.target.value)}
                            value={category}
                            id="category"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((item,index)=>(
                                <option key={index} value={item.path}>
                                    {item.path} {['MEN', 'Women', 'Kids'].includes(item.path) ? '👕' : ''}
                                </option>
                            ))}
                        </select>
                        {category && (
                            <p className="text-xs text-gray-500 mt-1">
                                {isClothingCategory ? '👕 This category supports size selection' : '📦 This category does not require sizes'}
                            </p>
                        )}
                    </div>

                    {/* Prices */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="product-price">
                                Original Price *
                            </label>
                            <input
                                onChange={(e)=>setPrice(e.target.value)}
                                value={price}
                                id="product-price"
                                type="number"
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="offer-price">
                                Offer Price *
                            </label>
                            <input
                                onChange={(e)=>setOfferPrice(e.target.value)}
                                value={offerPrice}
                                id="offer-price"
                                type="number"
                                placeholder="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            />
                        </div>
                    </div>

                    {/* Product Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="product-description">
                            Product Description (Bullet Points)
                        </label>
                        <textarea
                            onChange={(e)=>setDescription(e.target.value)}
                            value={description}
                            id="product-description"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Enter bullet points separated by new lines"
                        />
                    </div>

                    {/* Detailed Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="detailed-description">
                            Detailed Description
                        </label>
                        <textarea
                            onChange={(e)=>setDetailedDescription(e.target.value)}
                            value={detailedDescription}
                            id="detailed-description"
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                            placeholder="Enter detailed product description"
                        />
                    </div>

                    {/* Size Selection for Clothing */}
                    <div className="md:col-span-2">
                        {isClothingCategory ? (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.3 }}
                            >
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Available Sizes * (Select at least one size)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {getAvailableSizes().map((size) => (
                                        <motion.button
                                            key={size}
                                            type="button"
                                            onClick={() => handleSizeToggle(size)}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className={`px-4 py-2 rounded-md border transition-all duration-200 ${
                                                selectedSizes.includes(size)
                                                    ? 'bg-primary text-white border-primary shadow-md'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-primary hover:bg-gray-50'
                                            }`}
                                        >
                                            {size}
                                        </motion.button>
                                    ))}
                                </div>
                                {selectedSizes.length > 0 ? (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-sm text-green-600 mt-2 flex items-center"
                                    >
                                        <span className="mr-1">✅</span>
                                        Selected: {selectedSizes.join(', ')}
                                    </motion.p>
                                ) : (
                                    <p className="text-sm text-red-500 mt-2 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        Please select at least one size
                                    </p>
                                )}
                            </motion.div>
                        ) : (
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    💡 <strong>Size Selection:</strong> Size options will appear when you select a clothing category (MEN, Women, or Kids)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 btn-gradient-primary px-6 py-3 rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Adding Product...
                        </div>
                    ) : (
                        'Add Product'
                    )}
                </motion.button>
            </motion.form>
        </div>
    );
};

export default AddProduct;