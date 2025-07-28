import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { motion } from 'framer-motion';

const Analytics = () => {
    const { axios } = useAppContext();
    const [analytics, setAnalytics] = useState({
        monthlyRevenue: [],
        topProducts: [],
        orderStatus: {},
        categorySales: {}
    });
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('month');

    useEffect(() => {
        fetchAnalytics();
    }, [timeRange]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get('/api/order/seller');
            
            if (data.success) {
                const orders = data.orders;
                
                // Calculate monthly revenue
                const monthlyRevenue = calculateMonthlyRevenue(orders);
                
                // Calculate top products
                const topProducts = calculateTopProducts(orders);
                
                // Calculate order status distribution
                const orderStatus = calculateOrderStatus(orders);
                
                // Calculate category sales
                const categorySales = calculateCategorySales(orders);
                
                setAnalytics({
                    monthlyRevenue,
                    topProducts,
                    orderStatus,
                    categorySales
                });
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateMonthlyRevenue = (orders) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenue = new Array(12).fill(0);
        
        orders.forEach(order => {
            const month = new Date(order.createdAt).getMonth();
            revenue[month] += order.amount;
        });
        
        return months.map((month, index) => ({ month, revenue: revenue[index] }));
    };

    const calculateTopProducts = (orders) => {
        const productSales = {};
        
        orders.forEach(order => {
            order.items.forEach(item => {
                const productName = item.product?.name || 'Unknown Product';
                if (!productSales[productName]) {
                    productSales[productName] = { quantity: 0, revenue: 0 };
                }
                productSales[productName].quantity += item.quantity;
                productSales[productName].revenue += item.quantity * (item.product?.offerPrice || 0);
            });
        });
        
        return Object.entries(productSales)
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
    };

    const calculateOrderStatus = (orders) => {
        const statusCount = {};
        orders.forEach(order => {
            statusCount[order.status] = (statusCount[order.status] || 0) + 1;
        });
        return statusCount;
    };

    const calculateCategorySales = (orders) => {
        const categorySales = {};
        
        orders.forEach(order => {
            order.items.forEach(item => {
                const category = item.product?.category || 'Unknown';
                if (!categorySales[category]) {
                    categorySales[category] = 0;
                }
                categorySales[category] += item.quantity * (item.product?.offerPrice || 0);
            });
        });
        
        return categorySales;
    };

    const StatCard = ({ title, value, icon, color, change }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${color}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <p className={`text-xs mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '↗' : '↘'} {Math.abs(change)}% from last month
                        </p>
                    )}
                </div>
                <div className="text-3xl">{icon}</div>
            </div>
        </motion.div>
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
                className="flex justify-between items-center"
            >
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
                    <p className="text-gray-600">Track your store performance and insights</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                </select>
            </motion.div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
                <div className="h-64 flex items-end justify-between space-x-2">
                    {analytics.monthlyRevenue.map((data, index) => (
                        <motion.div
                            key={data.month}
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-1 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                            style={{ height: `${Math.max((data.revenue / Math.max(...analytics.monthlyRevenue.map(d => d.revenue))) * 200, 20)}px` }}
                        >
                            <div className="text-center text-xs text-white mt-2">
                                ₹{data.revenue.toLocaleString()}
                            </div>
                        </motion.div>
                    ))}
                </div>
                <div className="flex justify-between mt-4 text-xs text-gray-600">
                    {analytics.monthlyRevenue.map(data => (
                        <span key={data.month}>{data.month}</span>
                    ))}
                </div>
            </div>

            {/* Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Selling Products</h2>
                    <div className="space-y-3">
                        {analytics.topProducts.map((product, index) => (
                            <motion.div
                                key={product.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{product.name}</p>
                                        <p className="text-sm text-gray-600">{product.quantity} sold</p>
                                    </div>
                                </div>
                                <p className="font-medium text-gray-900">₹{product.revenue.toLocaleString()}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Order Status Distribution */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Status</h2>
                    <div className="space-y-3">
                        {Object.entries(analytics.orderStatus).map(([status, count], index) => (
                            <motion.div
                                key={status}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-2">
                                    <div className={`w-3 h-3 rounded-full ${
                                        status === 'Delivered' ? 'bg-green-500' :
                                        status === 'Cancelled' ? 'bg-red-500' :
                                        'bg-yellow-500'
                                    }`}></div>
                                    <span className="text-gray-700">{status}</span>
                                </div>
                                <span className="font-medium text-gray-900">{count}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Category Sales */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales by Category</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(analytics.categorySales).map(([category, revenue], index) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="text-center p-4 bg-gray-50 rounded-lg"
                        >
                            <p className="font-medium text-gray-900">{category}</p>
                            <p className="text-lg font-bold text-primary">₹{revenue.toLocaleString()}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Analytics; 