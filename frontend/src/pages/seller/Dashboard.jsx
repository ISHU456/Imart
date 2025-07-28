import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const Dashboard = () => {
    const { products, axios } = useAppContext();
    const [stats, setStats] = useState({
        totalProducts: 0,
        activeProducts: 0,
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        thisMonthRevenue: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch orders for stats
            const { data: ordersData } = await axios.get('/api/order/seller');
            
            // Calculate stats
            const totalProducts = products.length;
            const activeProducts = products.filter(p => p.inStock).length;
            const totalOrders = ordersData.success ? ordersData.orders.length : 0;
            const pendingOrders = ordersData.success ? ordersData.orders.filter(o => o.status === 'Order placed' || o.status === 'Processing').length : 0;
            
            // Calculate revenue
            const totalRevenue = ordersData.success ? ordersData.orders.reduce((sum, order) => sum + order.amount, 0) : 0;
            const thisMonth = new Date().getMonth();
            const thisMonthRevenue = ordersData.success ? ordersData.orders
                .filter(order => new Date(order.createdAt).getMonth() === thisMonth)
                .reduce((sum, order) => sum + order.amount, 0) : 0;

            setStats({
                totalProducts,
                activeProducts,
                totalOrders,
                pendingOrders,
                totalRevenue,
                thisMonthRevenue
            });

            // Get recent orders
            if (ordersData.success) {
                setRecentOrders(ordersData.orders.slice(0, 5));
            }

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ title, value, icon, color, subtitle }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color} hover:shadow-md transition-shadow`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className="text-3xl">{icon}</div>
            </div>
        </motion.div>
    );

    const QuickAction = ({ title, description, icon, onClick, color }) => (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-200 ${color}`}
        >
            <div className="text-2xl mb-2">{icon}</div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </motion.button>
    );

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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts}
                    icon="📦"
                    color="border-blue-500"
                    subtitle={`${stats.activeProducts} in stock`}
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders}
                    icon="📋"
                    color="border-green-500"
                    subtitle={`${stats.pendingOrders} pending`}
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon="💰"
                    color="border-yellow-500"
                    subtitle="All time"
                />
                <StatCard
                    title="This Month"
                    value={`₹${stats.thisMonthRevenue.toLocaleString()}`}
                    icon="📈"
                    color="border-purple-500"
                    subtitle="Revenue"
                />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <QuickAction
                    title="Add Product"
                    description="Create a new product listing"
                    icon="➕"
                    color="hover:border-blue-300"
                    onClick={() => window.location.href = '/seller/add-product'}
                />
                <QuickAction
                    title="View Orders"
                    description="Manage customer orders"
                    icon="📋"
                    color="hover:border-green-300"
                    onClick={() => window.location.href = '/seller/order'}
                />
                <QuickAction
                    title="Product List"
                    description="Manage your products"
                    icon="📦"
                    color="hover:border-yellow-300"
                    onClick={() => window.location.href = '/seller/product-list'}
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Orders</h2>
                {recentOrders.length > 0 ? (
                    <div className="space-y-3">
                        {recentOrders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {order.address.firstName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {order.address.firstName} {order.address.lastName}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">₹{order.amount}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                        order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {order.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No orders yet</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard; 