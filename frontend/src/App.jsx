import { useState } from 'react'
import {Route,Routes, useLocation} from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast'
import Footer from './components/Footer'
import { useAppContext } from './context/AppContext'
import Login from './components/login'
import AllProducts from './pages/AllProducts'
import ProductCategory from './pages/ProductCategory'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import AddAddress from './pages/AddAddress'
import MyOrders from './pages/MyOrders'
import SellerLogin from './components/seller/SellerLogin'
import SellerLayout from './pages/seller/SellerLayout'
import AddProduct from './pages/seller/AddProduct'
import EditProduct from './pages/seller/EditProduct'
import ProductList from './pages/seller/ProductList'
import Order from './pages/seller/Order'
import Contact from './pages/Contacts'
import UserProfile from './pages/UserProfile'
import Dashboard from './pages/seller/Dashboard'
import Analytics from './pages/seller/Analytics'
import SellerProfile from './pages/seller/SellerProfile'

function App() {

  const isSellerPath = useLocation().pathname.includes("seller");
  const {showUserLogin,isSeller} = useAppContext();
  return (
    <div className='text-default min-h-screen text-gray-700 bg-white'>
       {isSellerPath ? null :<Navbar/>}
       {showUserLogin?<Login/>:null}
       <Toaster/>

      <div className={`${isSellerPath? "": "px-0 md:px-16 lg:px-0 xl:px-0"}`}>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/products" element={<AllProducts/>}/>
          <Route path="/contacts" element={<Contact/>}/>

          <Route path="/products/:category" element={<ProductCategory/>}/>
          <Route path="/products/:category/:id" element={<ProductDetails/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/add-address" element={<AddAddress/>}/>
          <Route path="/my-orders" element={<MyOrders/>}/>
          <Route path="/profile" element={<UserProfile/>}/>
          <Route path="/seller" element={isSeller? <SellerLayout/>: <SellerLogin/>}>
            <Route index element={isSeller? <Dashboard/>:null}/>
            <Route path = 'add-product' element={<AddProduct/>}/>
            <Route path = 'edit-product/:id' element={<EditProduct/>}/>
            <Route path = 'product-list' element={<ProductList/>}/>
            <Route path = 'order' element={<Order/>}/>
            <Route path = 'analytics' element={<Analytics/>}/>
            <Route path = 'profile' element={<SellerProfile/>}/>
          </Route>
        </Routes>
      </div>
      {!isSellerPath && <Footer/> }
    </div>
  )
}

export default App;
