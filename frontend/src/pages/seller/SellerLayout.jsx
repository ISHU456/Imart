import React from 'react'
import { assets } from '../../assets/assets';
import { useAppContext } from '../../context/AppContext';
import { Link, NavLink, Outlet } from 'react-router-dom';
import toast from 'react-hot-toast';

const SellerLayout = () => {
    const {axios,navigate} = useAppContext();

    const sidebarLinks = [
        { name: "Dashboard", path: "/seller", icon: "📊" },
        { name: "Add Product", path: "/seller/add-product", icon: "➕" },
        { name: "Product List", path: "/seller/product-list", icon: "📦" },
        { name: "Orders", path: "/seller/order", icon: "📋" },
        { name: "Analytics", path: "/seller/analytics", icon: "📈" },
        { name: "Profile", path: "/seller/profile", icon: "👤" },
    ];

    const logout = async()=>{
        try {
            const {data} =await axios.get('/api/seller/logout')
            if(data.success){
                toast.success(data.message)
                navigate('/')
            }
            else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }
    }

    return (
        <>
            <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-300 py-3 bg-white shadow-sm">
                <Link to="/">
                    <img className="h-9 cursor-pointer w-34 md:w-38" src={assets.logo} alt="dummyLogoColored" />
                </Link>
                <div className="flex items-center gap-5 text-gray-500">
                    <div className="hidden md:flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                            A
                        </div>
                        <p className="font-medium">Admin Dashboard</p>
                    </div>
                    <button onClick={logout} className='border rounded-full text-sm px-4 py-1 hover:bg-gray-50 transition-colors'>Logout</button>
                </div>
            </div>
            <div className='flex'>
                <div className="md:w-64 w-16 border-r h-[95vh] text-base border-gray-300 pt-4 flex flex-col transition duration-500 overflow-hidden bg-gray-50">
                    {sidebarLinks.map((item) => (
                        <NavLink to= {item.path} key={item.name} end={item.path === '/seller'}
                            className={({isActive})=>`flex items-center py-3 px-4 gap-3 mx-2 rounded-lg transition-all duration-300
                                ${isActive ? "bg-primary text-white shadow-md transform scale-105"
                                    : "hover:bg-gray-200 text-gray-700 hover:text-gray-900"
                                }`
                            }>
                            <span className='text-xl'>{item.icon}</span>
                            <p className="md:block hidden text-center font-medium">{item.name}</p>
                        </NavLink>
                    ))}
                </div>
                <div className="flex-1 bg-gray-50">
                    <Outlet/>
                </div>
            </div>
            
        </>
    );
};

export default SellerLayout;