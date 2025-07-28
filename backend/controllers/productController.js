import {v2 as cloudinary} from 'cloudinary'
import Product from '../models/Product.js';
import { upload } from '../configs/multer.js';
import mongoose from 'mongoose';

// add product: /api/product/add
export const addProduct = async(req,res)=>{
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files//array of images

        let imagesUrl = await Promise.all(
            images.map(async(item)=>{
                let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )
        await Product.create({...productData,image:imagesUrl})
        res.json({success:true,message:"Product Added"})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

// GET product: /api/product/list
export const productList = async(req,res)=>{
    try {
        const products = await Product.find({});
        res.json({success:true,products});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

// GET product by id: /api/product/id
export const productById = async(req,res)=>{
    try {
        const {id} = req.body;
        const products = await Product.findById(id);
        res.json({success:true,products});
    } catch (error) {
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

// change product in stock /api/product/stock
export const changeStock = async(req,res)=>{
    try {
        const {id,inStock} = req.body;
        await Product.findByIdAndUpdate(id,{inStock});
        res.json({success:true,message:"stock updated"});
        
    } catch (error) {
        
    }
}

// Add rating and review: /api/product/rate
export const addRating = async(req,res)=>{
    try {
        const {productId, rating, review} = req.body;
        const userId = req.userId; // From auth middleware

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        // Check if user has purchased and received this product
        const Order = mongoose.model('order');
        const userOrders = await Order.find({
            userId,
            status: 'Delivered',
            'items.product': productId
        });

        if (userOrders.length === 0) {
            return res.status(403).json({
                success: false, 
                message: "You can only rate products that have been delivered to you"
            });
        }

        // Check if user already rated this product
        const existingRatingIndex = product.ratings.findIndex(r => r.user.toString() === userId);
        
        if (existingRatingIndex !== -1) {
            // Update existing rating
            product.ratings[existingRatingIndex].rating = rating;
            product.ratings[existingRatingIndex].review = review;
            product.ratings[existingRatingIndex].createdAt = new Date();
        } else {
            // Add new rating
            product.ratings.push({
                user: userId,
                rating,
                review
            });
        }

        // Calculate average rating
        const totalRating = product.ratings.reduce((sum, r) => sum + r.rating, 0);
        product.averageRating = totalRating / product.ratings.length;
        product.totalRatings = product.ratings.length;

        await product.save();
        res.json({success: true, message: "Rating added successfully", product});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

// Get product ratings: /api/product/ratings/:productId
export const getProductRatings = async(req,res)=>{
    try {
        const {productId} = req.params;
        const product = await Product.findById(productId).populate('ratings.user', 'name email profilePicture');
        
        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        res.json({success: true, ratings: product.ratings, averageRating: product.averageRating, totalRatings: product.totalRatings});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

// Check if user can rate product: /api/product/can-rate/:productId
export const canUserRateProduct = async(req,res)=>{
    try {
        const {productId} = req.params;
        const userId = req.userId; // From auth middleware

        if (!userId) {
            return res.status(401).json({success: false, message: "User not authenticated"});
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        // Check if user has purchased and received this product
        const Order = mongoose.model('order');
        const userOrders = await Order.find({
            userId,
            status: 'Delivered',
            'items.product': productId
        });

        const canRate = userOrders.length > 0;

        // Check if user already rated this product
        const existingRating = product.ratings.find(r => r.user.toString() === userId);
        const hasRated = !!existingRating;

        res.json({
            success: true, 
            canRate,
            hasRated,
            existingRating: existingRating ? {
                rating: existingRating.rating,
                review: existingRating.review
            } : null
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

// Delete product: /api/product/:id
export const deleteProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        // Delete images from cloudinary
        if (product.image && product.image.length > 0) {
            await Promise.all(
                product.image.map(async(imageUrl) => {
                    try {
                        const publicId = imageUrl.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(publicId);
                    } catch (error) {
                        console.log('Error deleting image from cloudinary:', error.message);
                    }
                })
            );
        }

        await Product.findByIdAndDelete(id);
        res.json({success: true, message: "Product deleted successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
}

// Update product: /api/product/:id
export const updateProduct = async(req,res)=>{
    try {
        const {id} = req.params;
        let productData = JSON.parse(req.body.productData);
        const newImages = req.files; // array of new images

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }

        let imagesUrl = [...product.image]; // Keep existing images

        // Upload new images if any
        if (newImages && newImages.length > 0) {
            const newImagesUrl = await Promise.all(
                newImages.map(async(item)=>{
                    let result = await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                    return result.secure_url
                })
            );
            imagesUrl = [...imagesUrl, ...newImagesUrl]; // Combine existing and new images
        }

        // Update the product
        await Product.findByIdAndUpdate(id, {
            ...productData,
            image: imagesUrl
        });

        res.json({success: true, message: "Product updated successfully"});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
}