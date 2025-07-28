import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {assets} from '../assets/assets'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'


const Navbar = () => {
    const [open, setOpen] = React.useState(false);
    const {user,setUser,showUserLogin,setShowUserLogin,navigate,setSearchQuery,searchQuery,getCartCount,axios} =useAppContext();
    const logout = async ()=>{
        try{
            const {data} = await axios.get('/api/user/logout');
            if(data.success){
                toast.success(data.message)
                setUser(null);
                navigate('/');
            }
            else{
                toast.error(data.message)
            }
        }
        catch(error){
            toast.error(error.message)
        }
        
    }
    useEffect(()=>{
        if(searchQuery.length>0){
            navigate("/products")
        }
    },[searchQuery])

    return (
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">
            <NavLink to="/" onClick={() => setOpen(false)}>
              <div className="flex items-center gap-2 md:gap-3">
                <img className="h-8 md:h-10 drop-shadow-sm" src={assets.logo} alt="I-Mart logo" />
                
                <span className="text-xl md:text-2xl lg:text-3xl font-extrabold bg-gradient-to-r from-fuchsia-600 via-rose-500 to-orange-400 bg-clip-text text-transparent tracking-wide">
                  I<span className="font-semibold">MART</span>
                </span>
              </div>
            </NavLink>
                



            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-8">
                <NavLink to="/">Home</NavLink>
                <NavLink to="/products">Products</NavLink>
                <NavLink to="/contacts">Contacts</NavLink>


                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
                    <input onChange={(e)=>setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
                    <img src ={assets.search_icon} alt="search" className="w-4 h-4"/>
                </div>

                <div onClick={()=>navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart" className="w-6 opacity-80" />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                {!user ? (<button onClick={()=>setShowUserLogin(true)} className="cursor-pointer px-8 py-2 btn-gradient-primary rounded-full font-medium">
                    Login
                </button>):
                (
                    <div className="relative group" >
                        <img src={user.profilePicture || assets.profile_icon} alt="profile" className='w-10 h-10 rounded-full object-cover' />
                        <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-32 rounded-md text-sm z-40">
                            <li onClick={()=>navigate("/profile")} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">My Profile</li>
                            <li onClick={()=>navigate("/my-orders")} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">My Orders</li>
                            <li onClick={logout} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">Logout</li>
                        </ul>
                    </div>
                )}
            </div>
            <div className="flex gap-6 item-center sm:hidden">
                <div onClick={()=>navigate('/cart')} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart" className="w-6 opacity-80" />
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
                </div>

                <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
                    <img src={assets.menu_icon} alt="menu" />
                </button>
            </div>

            {/* Mobile Menu */}
            { open && (
                <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
                <NavLink to="/" className="block" onClick={()=>setOpen(false)}>Home</NavLink>
                <NavLink to="/products" className="block" onClick={()=>setOpen(false)}>Products</NavLink>
                {user && (
                    <>
                        <NavLink to="/profile" className="block" onClick={()=>setOpen(false)}>My Profile</NavLink>
                        <NavLink to="/my-orders" className="block" onClick={()=>setOpen(false)}>My Orders</NavLink>
                    </>
                )}
                <NavLink to="/" className="block" onClick={()=>setOpen(false)}>Contact</NavLink>

                { !user ?(
                    <button onClick={()=>{setOpen(false); setShowUserLogin(true)}} className="cursor-pointer px-6 py-2 mt-2 btn-gradient-primary rounded-full text-sm font-medium">
                        Login
                    </button>
                ):(
                    <button onClick={logout} className="cursor-pointer px-6 py-2 mt-2 btn-gradient-secondary rounded-full text-sm font-medium">
                        Logout
                    </button>
                )}
                
            </div>

            )}
            
        </nav>
    )
}

export default Navbar