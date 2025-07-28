
//Login User:/api/seller/login
import jwt from 'jsonwebtoken'
import SellerProfile from '../models/SellerProfile.js';

//Login User:/api/seller/login
export const sellerLogin = async(req,res)=>{
    const {email,password} = req.body;
    try{
        if(email.trim() === process.env.SELLER_EMAIL.trim() &&
        password.trim() === process.env.SELLER_PASSWORD.trim()){
            const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'7d'});
            res.cookie('sellerToken',token,{
                httpOnly:true,//prevents js to access cookie
                secure: process.env.NODE_ENV === 'production',//use secure cookie in production
                sameSite:process.env.NODE_ENV ==='production'?'none':'strict',//csrf protection
                maxAge:7 * 24 * 60 * 60 * 1000,//cookie expiration time
            });
            return res.json({success:true,message:"Logged In"});
        }
        else{
            return res.json({success:false,message:"Failed Logged In"});
        }
    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
    
}
//Seller isAuth: /api/seller/is-auth
export const isSellerAuth = async(req,res)=>{
    try{
        return res.json({success:true})
    }
    catch(error){
        console.log(error.message);
        res.json({success:false,message:error.message});
    }
}
//Seller logout: /api/seller/logout
export const sellerLogout = async (req,res)=>{
    try{
        res.clearCookie('sellerToken',{
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

// Get seller profile: /api/seller/profile
export const getSellerProfile = async (req, res) => {
    try {
        let profile = await SellerProfile.findOne({ email: process.env.SELLER_EMAIL });
        
        // If profile doesn't exist, create a default one
        if (!profile) {
            profile = await SellerProfile.create({
                email: process.env.SELLER_EMAIL,
                name: "Seller",
                phone: "",
                storeName: "My Store",
                address: "",
                description: ""
            });
        }
        
        res.json({ success: true, profile });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update seller profile: /api/seller/profile
export const updateSellerProfile = async (req, res) => {
    try {
        const { name, phone, storeName, address, description } = req.body;
        
        let profile = await SellerProfile.findOne({ email: process.env.SELLER_EMAIL });
        
        if (!profile) {
            // Create new profile if it doesn't exist
            profile = await SellerProfile.create({
                email: process.env.SELLER_EMAIL,
                name: name || "",
                phone: phone || "",
                storeName: storeName || "",
                address: address || "",
                description: description || ""
            });
        } else {
            // Update existing profile
            profile.name = name || profile.name;
            profile.phone = phone || profile.phone;
            profile.storeName = storeName || profile.storeName;
            profile.address = address || profile.address;
            profile.description = description || profile.description;
            
            await profile.save();
        }
        
        res.json({ success: true, message: "Profile updated successfully", profile });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};