import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Order = () => {
  const { axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/order/seller');
      if (data.success) {
        setOrders(data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data } = await axios.patch(`/api/order/status/${orderId}`, { status: newStatus });
      if (data.success) {
        toast.success("Order status updated successfully");
        fetchOrders(); // Refresh orders
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === '' || order.status === filterStatus;
    const matchesSearch = searchTerm === '' || 
      order.address.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.address.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'Out for delivery': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Shipped': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Processing': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered': return '✅';
      case 'Cancelled': return '❌';
      case 'Out for delivery': return '🚚';
      case 'Shipped': return '📦';
      case 'Processing': return '⚙️';
      default: return '📋';
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Order placed' || o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped' || o.status === 'Out for delivery').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
        <p className="text-gray-600">Track and manage customer orders</p>
      </motion.div>

      {/* Order Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-4"
      >
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-lg">📋</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-xl font-semibold text-gray-900">{orderStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-yellow-600 text-lg">⏳</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-xl font-semibold text-gray-900">{orderStats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-lg">📦</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Shipped</p>
              <p className="text-xl font-semibold text-gray-900">{orderStats.shipped}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-lg">✅</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-xl font-semibold text-gray-900">{orderStats.delivered}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 text-lg">❌</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Cancelled</p>
              <p className="text-xl font-semibold text-gray-900">{orderStats.cancelled}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white rounded-lg shadow-sm p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Orders</label>
            <input
              type="text"
              placeholder="Search by customer name or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="Order placed">Order placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={fetchOrders}
              className="w-full btn-gradient-primary px-4 py-2 rounded-md font-medium"
            >
              Refresh Orders
            </button>
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {order.address.firstName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {order.address.firstName} {order.address.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">Order #{order._id.slice(-8)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">₹{order.amount}</p>
                        <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Products:</h4>
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-900">{item.product?.name || "Unknown Product"}</span>
                            <span className="text-primary font-medium">x{item.quantity}</span>
                            {item.size && <span className="text-gray-500">({item.size})</span>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Delivery Address:</h4>
                      <p className="text-sm text-gray-600">
                        {order.address.street}, {order.address.city}, {order.address.state} {order.address.zipcode}
                      </p>
                      <p className="text-sm text-gray-600">Phone: {order.address.phone}</p>
                    </div>

                    {/* Payment Info */}
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">Payment: {order.paymentType}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        order.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>

                  {/* Status Management */}
                  <div className="lg:w-64">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-lg">{getStatusIcon(order.status)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <label className="block text-sm font-medium text-gray-700 mb-2">Update Status:</label>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      >
                        <option value="Order placed">Order placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for delivery">Out for delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      
                      {order.status === 'Delivered' && (
                        <p className="text-green-600 text-xs mt-2 flex items-center">
                          <span className="mr-1">✅</span> Customer can now rate products
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm"
          >
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Order;
