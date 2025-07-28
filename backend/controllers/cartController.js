import User from "../models/user.js";

export const updateCart = async(req,res)=>{
    try{
        // req me se bas userId aarahi hai
        const {userId} = req;
        const {cartItems} = req.body;
        await User.findByIdAndUpdate(userId,{cartItems});
        res.json({success:true,message:"cart updated"})
    }
    catch(error){
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}