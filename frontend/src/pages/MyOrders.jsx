import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast';


const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { axios, user } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get('/api/order/user');
      if (data.success) {
        setMyOrders(data.orders);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
        toast.error("Something went wrong while fetching orders");
        console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    }
  }, [user]);

  return (
    <div>
      <div className="mt-16 pb-16">
        <p className='text-2xl font-medium uppercase'>My Orders</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>

      <div className='flex flex-col'>

      {myOrders.length === 0 ? (
        <p className='text-gray-500'>No orders found.</p>
      ) : (
        myOrders.map((order, index) => (
          <div key={index} className="border border-gray-300 rounded-lg mb-10 p-4 py-5 max-w-6xl">
            <p className="flex justify-between md:items-center text-gray-400 md:font-medium max-md:flex-col">
              <span>OrderId: {order._id}</span>
              <span>Payment: {order.paymentType}</span>
              <span>Total Amount: ₹{order.amount}</span>
            </p>

            {order.items.map((item, i) => (
              <div
                key={i}
                className={`relative bg-white text-gray-500/70 ${
                  order.items.length !== i + 1 ? 'border-b' : ''
                } border-gray-300 flex flex-col md:flex-row md:items-center justify-between p-4 py-5 md:gap-16 w-full max-w-4xl`}
              >
                <div className="flex items-center mb-4 md:mb-0">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <img
                      src={item.product?.image?.[0]}
                      alt=""
                      className="w-16 h-16"
                    />
                  </div>
                  <div className="ml-4">
                    <h2 className="text-xl font-medium text-gray-800">
                      {item.product?.name}
                    </h2>
                    <p>Category: {item.product?.category}</p>
                  </div>
                </div>

                <div className="text-primary text-lg font-medium">
                  <p>Quantity: {item.quantity || '1'}</p>
                  <p>Status: {order.status}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>

                <p className="text-primary text-lg font-medium">
                  Amount: ₹{item.product?.offerPrice * item.quantity}
                </p>
              </div>
            ))}
          </div>
        ))
      )}
      </div>
    </div>
    
  );
};

export default MyOrders;
