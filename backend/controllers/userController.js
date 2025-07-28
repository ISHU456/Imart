//register user:/api/user/register
import User from "../models/user.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async(req,res)=>{
    try{
        const {name,email,password} = req.body;
        if(!name||!email ||!password){
            return res.json({success:false,message:'Missing Details'});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.json({success:false,message:'Already registered'});
        }
        //bcrypt password
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password:hashedPassword});
        //token
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET,{expiresIn:'7d'});
        res.cookie('token',token,{
            httpOnly:true,//prevents js to access cookie
            secure: process.env.NODE_ENV === 'production',//use secure cookie in production
            sameSite:process.env.NODE_ENV ==='production'?'none':'strict',//csrf protection
            maxAge:7*24*60*60 *1000,//cookie expiration time
        });
        res.json({success:true,user:{email:user.email,name:user.name,profilePicture:user.profilePicture}});
    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:'Error message'});
    }
};

//Login User:/api/user/login

export const login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        if(!email||!password){
            return res.json({success:false,message:'email and password are required'})
        }
        const user = await User.findOne({email});
        if(!user){
            return res.json({success:false,message:'Invalid Email'})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:'Invalid Password'})
        }
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
        res.cookie('token',token,{
            httpOnly:true,//prevents js to access cookie
            secure: process.env.NODE_ENV === 'production',//use secure cookie in production
            sameSite:process.env.NODE_ENV ==='production'?'none':'strict',//csrf protection
            maxAge: 7 * 24 * 60 * 60 * 1000,//cookie expiration time
        });
        return res.json({success:true,user:{email:user.email,name:user.name,profilePicture:user.profilePicture}});

    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

// Check Auth: /api/user/is-auth

export const isAuth = async(req,res)=>{
    try{
        const {userId} = req;
        const user = await User.findById(userId).select("-password")
        return res.json({success:true,user})
    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

//logout user: /api/user/logout

export const logout = async (req,res)=>{
    try{
        res.clearCookie('token',{
            httpOnly:true,//prevents js to access cookie
            secure: process.env.NODE_ENV === 'production',//use secure cookie in production
            sameSite:process.env.NODE_ENV ==='production'?'none':'strict',//csrf protection
        });
        return res.json({success:true,message:'Logged Out'})
    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}

// Update user profile: /api/user/update-profile
export const updateProfile = async (req, res) => {
    try {
        const { userId } = req;
        const updateData = req.body;
        
        // Remove sensitive fields that shouldn't be updated
        delete updateData.password;
        delete updateData.email; // Email should be updated separately for security
        
        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true, runValidators: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ success: true, message: "Profile updated successfully", user });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Upload profile picture: /api/user/upload-profile-pic
export const uploadProfilePicture = async (req, res) => {
    try {
        const { userId } = req;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }
        
        // Upload to cloudinary
        const { v2: cloudinary } = await import('cloudinary');
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'image',
            folder: 'profile-pictures',
            transformation: [
                { width: 400, height: 400, crop: 'fill' },
                { quality: 'auto' }
            ]
        });
        
        // Update user profile with new image URL
        const user = await User.findByIdAndUpdate(
            userId,
            { profilePicture: result.secure_url },
            { new: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        res.json({ 
            success: true, 
            message: "Profile picture uploaded successfully", 
            user 
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};