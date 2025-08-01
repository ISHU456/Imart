//add address : api/address/add

import Address from "../models/Address.js";

export const addAddress = async(req,res)=>{
    try {
        const{userId} = req;
        const {address} = req.body;//error can come
        await Address.create({
            ...address,userId
        })
        res.json({success:true,message:"Address added successfully"})
    } catch (error) {
        console.log(error.message);
        res.json({success:true,message:error.message})
        
    }
}

export const getAddress = async(req,res)=>{
    try {
        const {userId} = req;//error can come
        const  addresses = await Address.find({userId})
        res.json({success:true,addresses})
    } catch (error) {
        console.log(error.message);
        res.json({success:true,message:error.message})
    }
}
