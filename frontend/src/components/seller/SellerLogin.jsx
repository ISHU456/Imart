import React, { useState,useEffect} from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast';


const SellerLogin = () => {
    const {isSeller,setIsSeller,navigate,axios} = useAppContext()
    const [email,setEmail] = useState("");
    const [password,setPassword ] = useState("");

    const onSubmitHandler = async (event)=>{
        try {
            event.preventDefault();
            const {data} = await axios.post('/api/seller/login',{email,password});
            if(data.success){
                setIsSeller(true);
                navigate('/seller');
            }
            else{
                toast.error(data.message)
            }
            
        } catch (error) {
            toast.error(error.message)
            
        }
    }
    useEffect(()=>{
        if(isSeller){
            navigate('/seller');
            // setIsSeller(true)
        }
    },[isSeller])

  return !isSeller && (
        <form onSubmit={onSubmitHandler} className="min-h-screen flex items-center justify-center text-sm text-gray-600">
            <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88
            rounded-lg shadow-xl border border-gray-200">
                <p className='text-2xl ffont-medium m-auto'><span className='text-primary'> Seller</span>Login</p>
                <div className='w-full'>
                    <p>Email</p>
                    <input onChange= {((e)=>setEmail(e.target.value))} type="email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required />
                </div>
                <div className='w-full'>
                    <p>Password</p>
                    <input onChange= {((e)=>setPassword(e.target.value))} type="password" className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" required />
                </div>
                <button className='btn-gradient-primary w-full py-2 rounded-md cursor-pointer transition duration-400 ease-in hover:scale-105 hover:shadow-lg font-medium' type="submit">Login</button>

                
            </div>
            
        </form>
    );
};
    

export default SellerLogin