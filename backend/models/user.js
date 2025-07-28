import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:""
    },
    phone:{
        type:String,
        default:""
    },
    dateOfBirth:{
        type:Date,
        default:null
    },
    gender:{
        type:String,
        enum:['Male', 'Female', 'Other', ''],
        default:""
    },
    address:{
        street:{type:String,default:""},
        city:{type:String,default:""},
        state:{type:String,default:""},
        zipcode:{type:String,default:""},
        country:{type:String,default:""}
    },
    cartItems:{
        type:Object,
        default:{}
    },
},{minimize:false});

const User = mongoose.models.user|| mongoose.model('user',userSchema);

export default User;