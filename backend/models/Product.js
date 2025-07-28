import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:{type:String,required:true},
    description:{
        type:Array,
        required:true,
    },
    detailedDescription: {
        type: String,
        default: ""
    },
    price:{
        type:Number,
        required:true,
    },
    offerPrice:{
        type:Number,
        required:true,
    },
    image:{
        type:Array,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    sizes: {
        type: [String],
        default: []
    },
    inStock:{
        type:Boolean,
        default:true
    },
    ratings: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    averageRating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    }

},{timestamps:true});

const Product = mongoose.models.product|| mongoose.model('product',productSchema);

export default Product;