// import Order from '../models/Order.js';
// import Product from '../models/Product.js';
// import User from '../models/User.js';

// // @desc    Get dashboard stats
// // @route   GET /api/admin/reports/dashboard
// // @access  Private/Admin
// export const getDashboardStats = async (req, res) => {
//   try {
//     const totalUsers = await User.countDocuments();
//     const totalProducts = await Product.countDocuments();
//     const totalOrders = await Order.countDocuments();
//     const pendingOrders = await Order.countDocuments({ status: 'pending' });
    
//     const revenue = await Order.aggregate([
//       { $match: { paymentStatus: 'paid' } },
//       { $group: { _id: null, total: { $sum: '$totalPrice' } } }
//     ]);
    
//     const recentOrders = await Order.find()
//       .populate('user', 'name')
//       .sort('-createdAt')
//       .limit(5);
    
//     res.json({
//       success: true,
//       stats: {
//         totalUsers,
//         totalProducts,
//         totalOrders,
//         pendingOrders,
//         totalRevenue: revenue[0]?.total || 0
//       },
//       recentOrders
//     });
//   } catch (error) {
//     console.error('Dashboard stats error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get sales report
// // @route   GET /api/admin/reports/sales
// // @access  Private/Admin
// export const getSalesReport = async (req, res) => {
//   try {
//     const { period = 'month' } = req.query;
    
//     let dateFilter = {};
//     const now = new Date();
    
//     switch (period) {
//       case 'day':
//         dateFilter = {
//           createdAt: {
//             $gte: new Date(now.setHours(0, 0, 0, 0)),
//             $lte: new Date()
//           }
//         };
//         break;
//       case 'week':
//         const weekAgo = new Date();
//         weekAgo.setDate(weekAgo.getDate() - 7);
//         dateFilter = { createdAt: { $gte: weekAgo, $lte: new Date() } };
//         break;
//       case 'month':
//         const monthAgo = new Date();
//         monthAgo.setMonth(monthAgo.getMonth() - 1);
//         dateFilter = { createdAt: { $gte: monthAgo, $lte: new Date() } };
//         break;
//       case 'year':
//         const yearAgo = new Date();
//         yearAgo.setFullYear(yearAgo.getFullYear() - 1);
//         dateFilter = { createdAt: { $gte: yearAgo, $lte: new Date() } };
//         break;
//       default:
//         dateFilter = {};
//     }
    
//     const orders = await Order.find(dateFilter).populate('user', 'name email');
    
//     const totalOrders = orders.length;
//     const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
//     const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
//     const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;
//     const completedOrders = orders.filter(o => o.status === 'delivered').length;
//     const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
//     // Daily sales
//     const dailySales = {};
//     orders.forEach(order => {
//       const date = order.createdAt.toISOString().split('T')[0];
//       if (!dailySales[date]) {
//         dailySales[date] = { date, count: 0, revenue: 0 };
//       }
//       dailySales[date].count++;
//       dailySales[date].revenue += order.totalPrice;
//     });
    
//     // Top products
//     const productSales = {};
//     orders.forEach(order => {
//       order.orderItems.forEach(item => {
//         if (!productSales[item.name]) {
//           productSales[item.name] = { name: item.name, quantity: 0, revenue: 0 };
//         }
//         productSales[item.name].quantity += item.quantity;
//         productSales[item.name].revenue += item.price * item.quantity;
//       });
//     });
    
//     const topProducts = Object.values(productSales)
//       .sort((a, b) => b.quantity - a.quantity)
//       .slice(0, 5);
    
//     // Category sales
//     const categorySales = {};
//     orders.forEach(order => {
//       order.orderItems.forEach(item => {
//         if (!categorySales[item.category]) {
//           categorySales[item.category] = { category: item.category, revenue: 0 };
//         }
//         categorySales[item.category].revenue += item.price * item.quantity;
//       });
//     });
    
//     res.json({
//       success: true,
//       report: {
//         period,
//         summary: {
//           totalOrders,
//           totalRevenue,
//           averageOrderValue,
//           paidOrders,
//           pendingOrders,
//           completedOrders
//         },
//         dailySales: Object.values(dailySales).sort((a, b) => a.date.localeCompare(b.date)),
//         topProducts,
//         categorySales: Object.values(categorySales)
//       }
//     });
//   } catch (error) {
//     console.error('Sales report error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get product report
// // @route   GET /api/admin/reports/products
// // @access  Private/Admin
// export const getProductReport = async (req, res) => {
//   try {
//     const products = await Product.find({});
    
//     const totalProducts = products.length;
//     const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
//     const outOfStock = products.filter(p => p.stock === 0).length;
//     const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
//     const featuredProducts = products.filter(p => p.featured).length;
//     const averagePrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    
//     const categoryCount = {};
//     products.forEach(p => {
//       categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
//     });
    
//     res.json({
//       success: true,
//       report: {
//         summary: {
//           totalProducts,
//           totalStock,
//           outOfStock,
//           lowStock,
//           featuredProducts,
//           averagePrice: averagePrice.toFixed(2)
//         },
//         categoryDistribution: Object.entries(categoryCount).map(([category, count]) => ({ category, count })),
//         products: products.map(p => ({
//           id: p._id,
//           name: p.name,
//           price: p.price,
//           stock: p.stock,
//           category: p.category,
//           featured: p.featured
//         }))
//       }
//     });
//   } catch (error) {
//     console.error('Product report error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get user report
// // @route   GET /api/admin/reports/users
// // @access  Private/Admin
// export const getUserReport = async (req, res) => {
//   try {
//     const users = await User.find({});
    
//     const totalUsers = users.length;
//     const adminUsers = users.filter(u => u.role === 'admin').length;
//     const regularUsers = users.filter(u => u.role === 'user').length;
//     const activeUsers = users.filter(u => u.isActive).length;
    
//     const registrationsByMonth = {};
//     users.forEach(user => {
//       const month = user.createdAt.toISOString().slice(0, 7);
//       registrationsByMonth[month] = (registrationsByMonth[month] || 0) + 1;
//     });
    
//     res.json({
//       success: true,
//       report: {
//         summary: {
//           totalUsers,
//           adminUsers,
//           regularUsers,
//           activeUsers,
//           inactiveUsers: totalUsers - activeUsers
//         },
//         registrationsByMonth: Object.entries(registrationsByMonth).map(([month, count]) => ({ month, count })),
//         users: users.map(u => ({
//           id: u._id,
//           name: u.name,
//           email: u.email,
//           role: u.role,
//           isActive: u.isActive,
//           createdAt: u.createdAt
//         }))
//       }
//     });
//   } catch (error) {
//     console.error('User report error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // ============= EXPORT FUNCTIONS =============

// // @desc    Export sales report to CSV
// // @route   GET /api/admin/reports/export/sales
// // @access  Private/Admin
// export const exportSalesReport = async (req, res) => {
//   try {
//     const { period = 'month' } = req.query;
    
//     let dateFilter = {};
//     const now = new Date();
    
//     switch (period) {
//       case 'day':
//         dateFilter = { createdAt: { $gte: new Date(now.setHours(0, 0, 0, 0)), $lte: new Date() } };
//         break;
//       case 'week':
//         const weekAgo = new Date();
//         weekAgo.setDate(weekAgo.getDate() - 7);
//         dateFilter = { createdAt: { $gte: weekAgo, $lte: new Date() } };
//         break;
//       case 'month':
//         const monthAgo = new Date();
//         monthAgo.setMonth(monthAgo.getMonth() - 1);
//         dateFilter = { createdAt: { $gte: monthAgo, $lte: new Date() } };
//         break;
//       default:
//         dateFilter = {};
//     }
    
//     const orders = await Order.find(dateFilter).populate('user', 'name email');
    
//     let csvContent = 'Order ID,Date,Customer,Email,Items Price,Shipping Price,Tax,Total Price,Status,Payment Status,Payment Method\n';
    
//     orders.forEach(order => {
//       csvContent += `${order._id},${new Date(order.createdAt).toLocaleDateString()},${order.user?.name || 'N/A'},${order.user?.email || 'N/A'},${order.itemsPrice},${order.shippingPrice},${order.taxPrice},${order.totalPrice},${order.status},${order.paymentStatus},${order.paymentMethod}\n`;
//     });
    
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', `attachment; filename=sales_report_${Date.now()}.csv`);
//     res.send(csvContent);
//   } catch (error) {
//     console.error('Export sales error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Export products report to CSV
// // @route   GET /api/admin/reports/export/products
// // @access  Private/Admin
// export const exportProductsReport = async (req, res) => {
//   try {
//     const products = await Product.find({});
    
//     let csvContent = 'Product ID,Name,Category,Price,Stock,Featured,Created At\n';
    
//     products.forEach(product => {
//       csvContent += `${product._id},${product.name},${product.category},${product.price},${product.stock},${product.featured ? 'Yes' : 'No'},${new Date(product.createdAt).toLocaleDateString()}\n`;
//     });
    
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', `attachment; filename=products_report_${Date.now()}.csv`);
//     res.send(csvContent);
//   } catch (error) {
//     console.error('Export products error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // @desc    Export users report to CSV
// // @route   GET /api/admin/reports/export/users
// // @access  Private/Admin
// export const exportUsersReport = async (req, res) => {
//   try {
//     const users = await User.find({});
    
//     let csvContent = 'User ID,Name,Email,Role,Status,Joined Date\n';
    
//     users.forEach(user => {
//       csvContent += `${user._id},${user.name},${user.email},${user.role},${user.isActive ? 'Active' : 'Inactive'},${new Date(user.createdAt).toLocaleDateString()}\n`;
//     });
    
//     res.setHeader('Content-Type', 'text/csv');
//     res.setHeader('Content-Disposition', `attachment; filename=users_report_${Date.now()}.csv`);
//     res.send(csvContent);
//   } catch (error) {
//     console.error('Export users error:', error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/reports/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    
    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    
    const recentOrders = await Order.find()
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(10);
    
    // Monthly sales data for chart
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          total: { $sum: '$totalPrice' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue: revenue[0]?.total || 0
      },
      recentOrders,
      monthlySales
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get sales report
// @route   GET /api/admin/reports/sales
// @access  Private/Admin
export const getSalesReport = async (req, res) => {
  try {
    const { period = 'month', startDate, endDate } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    } else {
      switch (period) {
        case 'today':
          dateFilter = {
            createdAt: {
              $gte: new Date(now.setHours(0, 0, 0, 0)),
              $lte: new Date()
            }
          };
          break;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          dateFilter = { createdAt: { $gte: weekAgo, $lte: new Date() } };
          break;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          dateFilter = { createdAt: { $gte: monthAgo, $lte: new Date() } };
          break;
        case 'year':
          const yearAgo = new Date();
          yearAgo.setFullYear(yearAgo.getFullYear() - 1);
          dateFilter = { createdAt: { $gte: yearAgo, $lte: new Date() } };
          break;
        default:
          dateFilter = {};
      }
    }
    
    const orders = await Order.find(dateFilter).populate('user', 'name email');
    
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    const paidOrders = orders.filter(o => o.paymentStatus === 'paid').length;
    const pendingOrders = orders.filter(o => o.paymentStatus === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Daily sales for chart
    const dailySales = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = { date, count: 0, revenue: 0 };
      }
      dailySales[date].count++;
      dailySales[date].revenue += order.totalPrice;
    });
    
    // Top selling products
    const productSales = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = { name: item.name, quantity: 0, revenue: 0 };
        }
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });
    
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);
    
    // Category sales
    const categorySales = {};
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (!categorySales[item.category]) {
          categorySales[item.category] = { category: item.category, revenue: 0 };
        }
        categorySales[item.category].revenue += item.price * item.quantity;
      });
    });
    
    res.json({
      success: true,
      report: {
        period,
        dateRange: { start: startDate || null, end: endDate || null },
        summary: {
          totalOrders,
          totalRevenue,
          averageOrderValue,
          paidOrders,
          pendingOrders,
          completedOrders
        },
        dailySales: Object.values(dailySales).sort((a, b) => a.date.localeCompare(b.date)),
        topProducts,
        categorySales: Object.values(categorySales),
        orders: orders.map(o => ({
          id: o._id,
          date: o.createdAt,
          customer: o.user?.name,
          email: o.user?.email,
          total: o.totalPrice,
          status: o.status,
          paymentStatus: o.paymentStatus,
          paymentMethod: o.paymentMethod
        }))
      }
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get product report
// @route   GET /api/admin/reports/products
// @access  Private/Admin
export const getProductReport = async (req, res) => {
  try {
    const products = await Product.find({}).sort('-createdAt');
    
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock < 10).length;
    const featuredProducts = products.filter(p => p.featured).length;
    const averagePrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
    
    // Category distribution
    const categoryCount = {};
    products.forEach(p => {
      categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
    });
    
    // Price distribution
    const priceDistribution = {
      under50: products.filter(p => p.price < 50).length,
      under100: products.filter(p => p.price >= 50 && p.price < 100).length,
      under200: products.filter(p => p.price >= 100 && p.price < 200).length,
      over200: products.filter(p => p.price >= 200).length
    };
    
    res.json({
      success: true,
      report: {
        summary: {
          totalProducts,
          totalStock,
          totalValue,
          outOfStock,
          lowStock,
          featuredProducts,
          averagePrice: averagePrice.toFixed(2)
        },
        categoryDistribution: Object.entries(categoryCount).map(([category, count]) => ({ category, count })),
        priceDistribution,
        products: products.map(p => ({
          id: p._id,
          name: p.name,
          price: p.price,
          stock: p.stock,
          category: p.category,
          featured: p.featured,
          createdAt: p.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Product report error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user report
// @route   GET /api/admin/reports/users
// @access  Private/Admin
export const getUserReport = async (req, res) => {
  try {
    const users = await User.find({}).sort('-createdAt');
    
    const totalUsers = users.length;
    const adminUsers = users.filter(u => u.role === 'admin').length;
    const regularUsers = users.filter(u => u.role === 'user').length;
    const activeUsers = users.filter(u => u.isActive).length;
    const inactiveUsers = users.filter(u => !u.isActive).length;
    
    // User registrations by month
    const registrationsByMonth = {};
    users.forEach(user => {
      const month = user.createdAt.toISOString().slice(0, 7);
      registrationsByMonth[month] = (registrationsByMonth[month] || 0) + 1;
    });
    
    // User registrations by day (last 30 days)
    const registrationsByDay = {};
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    users.forEach(user => {
      if (user.createdAt >= thirtyDaysAgo) {
        const day = user.createdAt.toISOString().split('T')[0];
        registrationsByDay[day] = (registrationsByDay[day] || 0) + 1;
      }
    });
    
    res.json({
      success: true,
      report: {
        summary: {
          totalUsers,
          adminUsers,
          regularUsers,
          activeUsers,
          inactiveUsers,
          activePercentage: ((activeUsers / totalUsers) * 100).toFixed(1)
        },
        registrationsByMonth: Object.entries(registrationsByMonth).map(([month, count]) => ({ month, count })),
        registrationsByDay: Object.entries(registrationsByDay).map(([day, count]) => ({ day, count })),
        users: users.map(u => ({
          id: u._id,
          name: u.name,
          email: u.email,
          role: u.role,
          isActive: u.isActive,
          createdAt: u.createdAt,
          lastLogin: u.lastLogin
        }))
      }
    });
  } catch (error) {
    console.error('User report error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Export sales report to CSV
// @route   GET /api/admin/reports/export/sales
// @access  Private/Admin
export const exportSalesReport = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'today':
        dateFilter = { createdAt: { $gte: new Date(now.setHours(0, 0, 0, 0)), $lte: new Date() } };
        break;
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        dateFilter = { createdAt: { $gte: weekAgo, $lte: new Date() } };
        break;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        dateFilter = { createdAt: { $gte: monthAgo, $lte: new Date() } };
        break;
      default:
        dateFilter = {};
    }
    
    const orders = await Order.find(dateFilter).populate('user', 'name email');
    
    let csvContent = 'Order ID,Date,Customer,Email,Items Price,Shipping,Tax,Total,Status,Payment Status,Payment Method\n';
    
    orders.forEach(order => {
      csvContent += `${order._id},${new Date(order.createdAt).toLocaleDateString()},${order.user?.name || 'N/A'},${order.user?.email || 'N/A'},${order.itemsPrice},${order.shippingPrice},${order.taxPrice},${order.totalPrice},${order.status},${order.paymentStatus},${order.paymentMethod}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=sales_report_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('Export sales error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export products report to CSV
// @route   GET /api/admin/reports/export/products
// @access  Private/Admin
export const exportProductsReport = async (req, res) => {
  try {
    const products = await Product.find({});
    
    let csvContent = 'Product ID,Name,Category,Price,Stock,Featured,Total Value,Created At\n';
    
    products.forEach(product => {
      csvContent += `${product._id},${product.name},${product.category},${product.price},${product.stock},${product.featured ? 'Yes' : 'No'},${product.price * product.stock},${new Date(product.createdAt).toLocaleDateString()}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=products_report_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('Export products error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Export users report to CSV
// @route   GET /api/admin/reports/export/users
// @access  Private/Admin
export const exportUsersReport = async (req, res) => {
  try {
    const users = await User.find({});
    
    let csvContent = 'User ID,Name,Email,Role,Status,Joined Date,Last Login\n';
    
    users.forEach(user => {
      csvContent += `${user._id},${user.name},${user.email},${user.role},${user.isActive ? 'Active' : 'Inactive'},${new Date(user.createdAt).toLocaleDateString()},${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=users_report_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('Export users error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};