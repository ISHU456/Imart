import jwt from 'jsonwebtoken'

const authUser = async (req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false,message:'not authorized'});
    }
    try{
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        console.log('Token decoded:', tokenDecode); // Debug log
        if(tokenDecode.id){
            req.userId = tokenDecode.id;
            console.log('User ID set:', req.userId); // Debug log
            next();
        }
        else{
            return res.json({success:false,message:'not authorized'});
        };

    }
    catch(error){
        console.log('Auth error:', error.message); // Debug log
        res.json({success:false,message:error.message});
    }
}

export default authUser;