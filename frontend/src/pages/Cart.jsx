import React,{useState,useEffect} from 'react'
import { useAppContext } from '../context/AppContext';
import { assets, dummyAddress } from '../assets/assets';
import toast from 'react-hot-toast';

const Cart = () => {
    const {products,cartItems,removeFromCart,getCartCount,updateCartItems,navigate,getCartAmount,axios,user,setCartItems} = useAppContext();
    const [cartArray,setCartArray] = useState([]);
    const [addresses,setAddresses] = useState([]);

    const [showAddress,setShowAddress] = useState(false);
    const [selectedAddress,setSelectedAddress] = useState(null);
    const [paymentOption,setPaymentOption] = useState("COD");

    const getCart = ()=>{
        let tempArray = [];
        for(const key in cartItems){
            // Extract product ID and size from key
            const itemId = key.includes('-') ? key.split('-')[0] : key;
            const size = key.includes('-') ? key.split('-')[1] : null;
            
            const product = products.find((item)=> item._id === itemId);
            if(product) {
                const cartItem = {
                    ...product,
                    quantity: cartItems[key],
                    size: size,
                    cartKey: key
                };
                tempArray.push(cartItem);
            }
        }
        setCartArray(tempArray);
    };
    const getUserAddress = async()=>{
        try{
            const {data} = await axios.get('/api/address/get');
            if(data.success){
                setAddresses(data.addresses);
                if(data.addresses.length>0){
                    setSelectedAddress(data.addresses[0]);
                }
                else{
                    toast.error(data.message)
                }
            }
        }
        catch(error){
            toast.error(error.message)

        }
    }
    useEffect(()=>{
        if(user){
            getUserAddress();
        }
    },[user])
 
    useEffect(()=>{
        if(products.length>0 && cartItems){
            getCart(cartArray);
        }
    },[products,cartItems])
//very important
    const placeOrder = async()=>{
        try {
            if(!selectedAddress){
                return toast.error('please select and address')
            }
            //place order with cod
            if(paymentOption =="COD"){
                const {data} = await axios.post('/api/order/cod',{
                    userId:user._id,
                    items:cartArray.map(item=>({
                        product:item._id,
                        quantity:item.quantity,
                        size: item.size
                    })),
                    address:selectedAddress._id
                })
                if(data.success){
                    toast.success(data.message)
                    setCartItems({})
                    navigate('/my-orders')
                }
                else{
                    toast.error(data.message)
                }

            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }


    return (products.length>0 && cartItems?(
        
        <div className="flex flex-col md:flex-row mt-16">
            <div className='flex-1 max-w-4xl'>
                <h1 className="text-3xl font-medium mb-6">
                    Shopping Cart <span className="text-sm text-primary">{getCartCount()}</span>
                </h1>
                
                {/* Warning for clothing products without sizes */}
                {cartArray.some(product => 
                    (product.category === 'MEN' || product.category === 'Women' || product.category === 'Kids') && 
                    (!product.sizes || product.sizes.length === 0)
                ) && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-yellow-800 text-sm">
                            ⚠️ Some clothing products in your cart don't have size information. 
                            Please contact the seller to add sizes to these products.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 text-base font-medium pb-3">
                    <p className="text-left">Product Details</p>
                    <p className="text-center">Subtotal</p>
                    <p className="text-center">Action</p>
                </div>

                {cartArray.map((product, index) => (
                    <div key={index} className="grid grid-cols-[2fr_1fr_1fr] text-gray-500 items-center text-sm md:text-base font-medium pt-3">
                        <div className="flex items-center md:gap-6 gap-3">
                            <div onClick={()=>{
                                navigate(`/products/${product.category.toLowerCase()}/${product._id}`);scrollTo(0,0)
                            }}className="cursor-pointer w-24 h-24 flex items-center justify-center border border-gray-300 rounded">
                                <img className="max-w-full h-full object-cover" src={product.image[0]} alt={product.name} />
                            </div>
                            <div>
                                <p className="hidden md:block font-semibold">{product.name}</p>
                                <div className="font-normal text-gray-500/70">
                                    {product.size && (
                                        <p>Size: <span className="font-medium">{product.size}</span></p>
                                    )}
                                    {product.sizes && product.sizes.length > 0 && !product.size && (
                                        <p>Size: <span className="font-medium text-red-500">Please select size</span></p>
                                    )}
                                    <p>Weight:<span/>{product.weight||"N/A"}</p>
                                    <div className='flex items-center'>
                                        <p>Qty:</p>
                                        <select className='outline-none' onChange={(e) => updateCartItems(product.cartKey,Number(e.target.value))} value={cartItems[product.cartKey]}>
                                            {Array(cartItems[product.cartKey]>9?cartItems[product.cartKey]:9).fill('').map((_, index) => (
                                                <option key={index} value={index + 1}>{index + 1}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-center">₹{product.offerPrice * product.quantity}</p>
                        <button onClick={()=>removeFromCart(product.cartKey)} className="cursor-pointer mx-auto">
                            <img src={assets.remove_icon} alt="remove" className='inline-block w-6 h-6' />
                        </button>
                    </div>)
                )}

                <button onClick={()=>{navigate("/products");scrollTo(0,0)}} className="group cursor-pointer flex items-center mt-8 gap-2 text-primary font-medium">
                    <img src={assets.arrow_right_icon_colored} alt="arrow" className="group:hover translate-x-1 transition" />
                    Continue Shopping
                </button>

            </div>

            <div className="max-w-[360px] w-full bg-gray-100/40 p-5 max-md:mt-16 border border-gray-300/70">
                <h2 className="text-xl md:text-xl font-medium">Order Summary</h2>
                <hr className="border-gray-300 my-5" />

                <div className="mb-6">
                    <p className="text-sm font-medium uppercase">Delivery Address</p>
                    <div className="relative flex justify-between items-start mt-2">
                        <p className="text-gray-500">{selectedAddress?`${selectedAddress.street},${selectedAddress.city},${selectedAddress.state},${selectedAddress.country}`:"no address Found"}</p>
                        <button onClick={() => setShowAddress(!showAddress)} className="text-primary hover:underline cursor-pointer">
                            Change
                        </button>
                        {showAddress && (
                            <div className="absolute top-12 py-1 bg-white border border-gray-300 text-sm w-full">
                                {addresses.map((address,index)=>(<p onClick={() => {setSelectedAddress (address);setShowAddress(false)}} className="text-gray-500 p-2 hover:bg-gray-100">
                                    {address.street},{address.city},{address.state},{address.country}
                                </p>))}
                                <p onClick={() => navigate('/add-address')} className="text-primary text-center cursor-pointer p-2 hover:bg-primary/10">
                                    Add address
                                </p>
                            </div>
                        )}
                    </div>

                    <p className="text-sm font-medium uppercase mt-6">Payment Method</p>

                    <select onChange={e => setPaymentOption(e.target.value)} className="w-full border border-gray-300 bg-white px-3 py-2 mt-2 outline-none">
                        <option value="COD">Cash On Delivery</option>
                        <option value="Online">Online Payment</option>
                    </select>

                </div>

                <hr className="border-gray-300" />

                <div className="text-gray-500 mt-4 space-y-2">
                    <p className="flex justify-between">
                        <span>Price</span><span>₹{getCartAmount()}</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Shipping Fee</span><span className="text-green-600">Free</span>
                    </p>
                    <p className="flex justify-between">
                        <span>Tax (2%)</span><span>₹{getCartAmount()*2/100}</span>
                    </p>
                    <p className="flex justify-between text-lg font-medium mt-3">
                        <span>Total</span><span>₹{getCartAmount()+getCartAmount()*2/100}</span>
                    </p>
                </div>

                <button onClick ={placeOrder}className="w-full py-3 mt-6 cursor-pointer btn-gradient-primary font-medium rounded-lg">
                    {paymentOption === 'COD' ? "Place Order": "Proceed to Checkout"}
                </button>
            </div>
        </div>
    ):null)
}

export default Cart;