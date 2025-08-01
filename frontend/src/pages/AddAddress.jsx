import React,{useEffect, useState} from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const InputField = ({type,placeholder,name,handleChange,address})=>(
    <input className='w-full px-2 py-2.5 border border-gray-500/30 rounded outline-none text-gray-500 focus:border-primary transition'
    type={type} placeholder={placeholder} onChange={handleChange} name={name} value={address[name]} required />
)

const AddAddress = () => {
    const {axios,user,navigate} = useAppContext();
    
    const [address,setAddress] = useState({
        firstName:'',
        lasttName:'',
        email:'',
        street:'',
        city:'',
        state:'',
        zipcode:'',
        country:'',
        phone:'',
    });
    const handleChange = (e)=>{
        const {name,value} = e.target;
        setAddress((prevAddress)=>({
            ...prevAddress,
            [name]:value,

        }))
    }
    const onSubmitHandler = async(e)=>{
        try {
            const {data} = await axios.post('/api/address/add',{address})
            if(data.success){
                toast.success(data.message)
                navigate('/cart')
            }
            else{
                toast.error(data.message)
                
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    useEffect(()=>{
        if(!user){
            navigate('/cart')
        }
    },[])
  return (
    <div className="mt-16 pt-16">
        <p className='text-2xl md:text-3xl text-gray-500'>Add Shipping <span className="font-semibold text-primary">Address</span></p>
        <div className="flex flex-col-reverse md:flex-row justify-between mt-10">
            <div  className='flex-1 max-w-md'>
                <form onSubmit={onSubmitHandler} className="space-y-3 mt-6 text-sm">
                    
                    <div className="grid grid-cols-2 gap-4">
                        <InputField handleChange={handleChange} address={address} name="firstName"type="text" placeholder="First Name.."/>
                        <InputField handleChange={handleChange} address={address} name="lastName"type="text" placeholder="Last Name.."/>
                    </div>
                    <InputField handleChange={handleChange} address={address} name="email"type="email" placeholder="Email.."/>
                    <InputField handleChange={handleChange} address={address} name="street"type="text" placeholder="Street"/>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <InputField handleChange={handleChange} address={address} name="city"type="text" placeholder="city.."/>
                        <InputField handleChange={handleChange} address={address} name="state"type="text" placeholder="state.."/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <InputField handleChange={handleChange} address={address} name="zipcode"type="number" placeholder="zipcode.."/>
                        <InputField handleChange={handleChange} address={address} name="country"type="text" placeholder="country.."/>
                    </div>
                    
                        <InputField handleChange={handleChange} address={address} name="phone"type="text" placeholder="phone.."/>
                        {/* <InputField handleChange={handleChange} address={address} name="country"type="text" placeholder="country.."/> */}
                    <button className="w-full mt-6 btn-gradient-primary py-3 cursor-pointer uppercase rounded-2xl font-medium">
                        Add Address
                    </button>
                    
                </form>
            </div>
            <div>
                <img className="md:mr-16 mb-16 md:mt-0" src={assets.add_address_iamge} alt="Add Address" />
            </div>

        </div>
    </div>
  )
}

export default AddAddress