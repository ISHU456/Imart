import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const NewsLetter = () => {
  const {
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    navigate,
    setSearchQuery,
    searchQuery,
    getCartCount,
    axios
  } = useAppContext();

  const [email, setEmail] = useState('');

  const logout = async () => {
    try {
      const { data } = await axios.get('/api/user/logout');
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      navigate('/products');
    }
  }, [searchQuery]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Enter a valid email!");
    toast.success("Subscribed successfully!");
    setEmail('');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4 mt-20 pb-16 w-full px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl md:text-4xl font-semibold">Never Miss a Deal!</h1>
      <p className="text-gray-500/80 md:text-lg">
        Subscribe to get the latest offers, new arrivals, and exclusive discounts
      </p>



      <div className="mt-6 w-full max-w-md">
          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className="w-full md:w-auto px-12 py-4 text-white text-lg font-semibold bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-lg"
            >
              Login
            </button>
          ) : (
            <button
              onClick={logout}
              className="w-full md:w-auto px-12 py-4 text-white text-lg font-semibold bg-primary hover:bg-primary-dull transition-all cursor-pointer rounded-lg"
            >
              Logout
            </button>
          )}
        </div>

    </div>
  );
};

export default NewsLetter;
