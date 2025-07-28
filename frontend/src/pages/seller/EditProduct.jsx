import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { axios, products } = useAppContext();
    
    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [detailedDescription, setDetailedDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerPrice, setOfferPrice] = useState('');
    const [selectedSizes, setSelectedSizes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [existingImages, setExistingImages] = useState([]);

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

    // Load product data
    useEffect(() => {
        const loadProduct = () => {
            const product = products.find(p => p._id === id);
            if (product) {
                setName(product.name);
                setDescription(product.description.join('\n'));
                setDetailedDescription(product.detailedDescription || '');
                setCategory(product.category);
                setPrice(product.price.toString());
                setOfferPrice(product.offerPrice.toString());
                setSelectedSizes(product.sizes || []);
                setExistingImages(product.image || []);
                setLoading(false);
            } else {
                toast.error('Product not found');
                navigate('/seller/product-list');
            }
        };

        if (products.length > 0) {
            loadProduct();
        }
    }, [id, products, navigate]);

    const onSubmitHandler = async (event) => {
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
                description: description.split('\n'),
                detailedDescription,
                category,
                price,
                offerPrice,
                sizes: selectedSizes
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            
            // Add new images if any
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            const { data } = await axios.put(`/api/product/${id}`, formData);
            if (data.success) {
                toast.success(data.message);
                navigate('/seller/product-list');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Product</h1>
                <p className="text-gray-600">Update your product information</p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                onSubmit={onSubmitHandler}
                className="bg-white rounded-lg shadow-sm p-6 space-y-6"
            >
                {/* Product Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description (one line per bullet point)</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter description points, one per line"
                        required
                    />
                </div>

                {/* Detailed Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Detailed Description</label>
                    <textarea
                        value={detailedDescription}
                        onChange={(e) => setDetailedDescription(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Enter detailed product description"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat.path} value={cat.path}>
                                {cat.text}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price and Offer Price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Offer Price (₹)</label>
                        <input
                            type="number"
                            value={offerPrice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                </div>

                {/* Sizes for Clothing */}
                {isClothingCategory && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Available Sizes</label>
                        <div className="flex flex-wrap gap-2">
                            {getAvailableSizes().map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => handleSizeToggle(size)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                                        selectedSizes.includes(size)
                                            ? 'bg-primary text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Existing Images */}
                {existingImages.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Current Images</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {existingImages.map((image, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={image}
                                        alt={`Product ${index + 1}`}
                                        className="w-full h-24 object-cover rounded-lg"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* New Images */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add New Images (optional)</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setFiles(Array.from(e.target.files))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <p className="text-sm text-gray-500 mt-1">Leave empty to keep existing images</p>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/seller/product-list')}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Product'}
                    </button>
                </div>
            </motion.form>
        </div>
    );
};

export default EditProduct; 