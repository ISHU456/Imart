import mongoose from "mongoose";

const sellerProfileSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        default: process.env.SELLER_EMAIL
    },
    name: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    storeName: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: true
    },
    accountType: {
        type: String,
        enum: ['Basic', 'Premium'],
        default: 'Premium'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
sellerProfileSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

export default mongoose.model('SellerProfile', sellerProfileSchema); 