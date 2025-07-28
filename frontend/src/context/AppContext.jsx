import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
//axios connect api to frontend
import axios from 'axios'
axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [isSeller, setIsSeller] = useState(false)

    const [showUserLogin, setShowUserLogin] = useState(false);
    const [products, setProducts] = useState([]);
    const [cartItems, setCartItems] = useState({});
    const [searchQuery, setSearchQuery] = useState({});
    //fetch seller status
    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true);
            }
            else{
                setIsSeller(false);
                console.log("here it failed");

            }
        }
        catch(error){
            setIsSeller(false);

        }
    }
    //fetch user auth status
    const fetchUser = async()=>{
        try{
            const {data} = await axios.get('/api/user/is-auth');
            if(data.success){
                setUser(data.user);
                setCartItems(data.user.cartItems);
            }
        }
        catch(error){
            setUser(null)
        }
    }


    const fetchProducts = async()=>{
        try{
            const {data} = await axios.get('/api/product/list');
            if(data.success){
                setProducts(data.products)
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)

        }
    }
    const addToCart = (itemId, size = null) => {
        let cartData = structuredClone(cartItems);
        const itemKey = size ? `${itemId}-${size}` : itemId;
        
        if(cartData[itemKey]){
            cartData[itemKey] += 1
        }
        else{
            cartData[itemKey] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to Cart");
    }
    const updateCartItems = (itemKey, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemKey] = quantity;
        setCartItems(cartData);
        
        toast.success("Cart Updated")
    }
    
    const removeFromCart = (itemKey) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemKey]){
            cartData[itemKey] -= 1;
            if(cartData[itemKey] === 0){
                delete cartData[itemKey];
            }
        }
        toast.success("Removed from Cart")
        setCartItems(cartData);
    }
    const getCartCount = ()=>{
        let totalCount = 0;
        for (const item in cartItems){
            totalCount +=cartItems[item];
        }
        return totalCount;
    }
    const getCartAmount = () => {
        let totalAmount = 0;
        for(const itemKey in cartItems){
            // Extract product ID from itemKey (remove size suffix if present)
            const itemId = itemKey.includes('-') ? itemKey.split('-')[0] : itemKey;
            let itemInfo = products.find((product) => product._id === itemId);
            if(cartItems[itemKey] > 0 && itemInfo){
                totalAmount += itemInfo.offerPrice * cartItems[itemKey];
            }
        }
        return Math.floor(totalAmount*100)/100;
    }

    useEffect(()=>{
        fetchUser();
        fetchSeller();
        fetchProducts();
    },[])
    //update cart items
    useEffect(()=>{
        const updateCart = async()=>{
            try{
                const {data} = await axios.post('/api/cart/update',{cartItems})
                if(!data.success){
                    toast.error(data.message);
                }
            }
            catch(error){
                toast.error(error.message)
            }
        }
        if(user){
            updateCart();
        }
    },[cartItems])

    const value = { 
        navigate,
         user, 
         setUser, 
         isSeller, 
         setIsSeller,
         showUserLogin,
         setShowUserLogin,
         products,
         cartItems,
         addToCart,
         updateCartItems,
         removeFromCart, 
         searchQuery,
         setSearchQuery,
         getCartCount,
         getCartAmount,
         axios,
         fetchProducts,
         setCartItems 
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};
