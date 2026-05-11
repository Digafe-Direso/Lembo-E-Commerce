// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';

// const AdminDashboard = () => {
//   const { token } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalProducts: 0,
//     totalOrders: 0,
//     pendingOrders: 0,
//     totalRevenue: 0
//   });
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [salesReport, setSalesReport] = useState(null);
//   const [productReport, setProductReport] = useState(null);
//   const [userReport, setUserReport] = useState(null);

//   useEffect(() => {
//     fetchDashboard();
//     fetchSalesReport();
//     fetchProductReport();
//     fetchUserReport();
//   }, []);

//   const fetchDashboard = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/reports/dashboard', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setStats(response.data.stats);
//         setRecentOrders(response.data.recentOrders);
//       }
//     } catch (error) {
//       console.error('Dashboard error:', error);
//       toast.error('Failed to load dashboard');
//     }
//   };

//   const fetchSalesReport = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/reports/sales', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setSalesReport(response.data.report);
//       }
//     } catch (error) {
//       console.error('Sales report error:', error);
//     }
//   };

//   const fetchProductReport = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/reports/products', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setProductReport(response.data.report);
//       }
//     } catch (error) {
//       console.error('Product report error:', error);
//     }
//   };

//   const fetchUserReport = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/reports/users', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setUserReport(response.data.report);
//       }
//     } catch (error) {
//       console.error('User report error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const styles = {
//     container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
//     header: { marginBottom: '24px' },
//     headerTitle: { fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' },
//     tabs: { display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px', flexWrap: 'wrap' },
//     tab: { padding: '10px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s' },
//     statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
//     statCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' },
//     table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden' },
//     th: { padding: '12px', textAlign: 'left', background: '#f8f9fa', fontWeight: '600' },
//     td: { padding: '12px', borderBottom: '1px solid #e0e0e0' },
//     statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: 'white' }
//   };

//   if (loading) {
//     return <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.headerTitle}>👑 Admin Dashboard</h1>
//         <p>Manage your store and view analytics</p>
//       </div>

//       <div style={styles.tabs}>
//         <button onClick={() => setActiveTab('overview')} style={{ ...styles.tab, background: activeTab === 'overview' ? '#667eea' : '#f0f0f0', color: activeTab === 'overview' ? 'white' : '#333' }}>📊 Overview</button>
//         <button onClick={() => setActiveTab('sales')} style={{ ...styles.tab, background: activeTab === 'sales' ? '#667eea' : '#f0f0f0', color: activeTab === 'sales' ? 'white' : '#333' }}>💰 Sales Report</button>
//         <button onClick={() => setActiveTab('products')} style={{ ...styles.tab, background: activeTab === 'products' ? '#667eea' : '#f0f0f0', color: activeTab === 'products' ? 'white' : '#333' }}>📦 Product Report</button>
//         <button onClick={() => setActiveTab('users')} style={{ ...styles.tab, background: activeTab === 'users' ? '#667eea' : '#f0f0f0', color: activeTab === 'users' ? 'white' : '#333' }}>👥 User Report</button>
//       </div>

//       {activeTab === 'overview' && (
//         <div>
//           <div style={styles.statsGrid}>
//             <div style={styles.statCard}><h3>Total Users</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalUsers}</p></div>
//             <div style={styles.statCard}><h3>Total Products</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>{stats.totalProducts}</p></div>
//             <div style={styles.statCard}><h3>Total Orders</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff9800' }}>{stats.totalOrders}</p></div>
//             <div style={styles.statCard}><h3>Pending Orders</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#9c27b0' }}>{stats.pendingOrders}</p></div>
//             <div style={styles.statCard}><h3>Total Revenue</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f44336' }}>${stats.totalRevenue.toFixed(2)}</p></div>
//           </div>
//           <div style={styles.table}>
//             <h3 style={{ padding: '16px' }}>Recent Orders</h3>
//             <table style={{ width: '100%' }}>
//               <thead><tr><th style={styles.th}>Order ID</th><th style={styles.th}>Customer</th><th style={styles.th}>Amount</th><th style={styles.th}>Status</th><th style={styles.th}>Date</th></tr></thead>
//               <tbody>
//                 {recentOrders.map(order => (
//                   <tr key={order._id}>
//                     <td style={styles.td}>#{order._id.slice(-8)}</td>
//                     <td style={styles.td}>{order.user?.name}</td>
//                     <td style={styles.td}>${order.totalPrice}</td>
//                     <td style={styles.td}><span style={{ ...styles.statusBadge, background: order.status === 'delivered' ? '#4caf50' : '#ff9800' }}>{order.status}</span></td>
//                     <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {activeTab === 'sales' && salesReport && (
//         <div>
//           <div style={styles.statsGrid}>
//             <div style={styles.statCard}><h3>Total Orders</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{salesReport.summary?.totalOrders}</p></div>
//             <div style={styles.statCard}><h3>Total Revenue</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>${salesReport.summary?.totalRevenue?.toFixed(2)}</p></div>
//             <div style={styles.statCard}><h3>Avg Order Value</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>${salesReport.summary?.averageOrderValue?.toFixed(2)}</p></div>
//             <div style={styles.statCard}><h3>Completed Orders</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>{salesReport.summary?.completedOrders}</p></div>
//           </div>
//           <div style={styles.table}>
//             <h3 style={{ padding: '16px' }}>Top Products</h3>
//             <table style={{ width: '100%' }}>
//               <thead><tr><th style={styles.th}>Product</th><th style={styles.th}>Quantity Sold</th><th style={styles.th}>Revenue</th></tr></thead>
//               <tbody>
//                 {salesReport.topProducts?.map((p, i) => (
//                   <tr key={i}><td style={styles.td}>{p.name}</td><td style={styles.td}>{p.quantity}</td><td style={styles.td}>${p.revenue.toFixed(2)}</td></tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {activeTab === 'products' && productReport && (
//         <div style={styles.table}>
//           <h3 style={{ padding: '16px' }}>Product List</h3>
//           <table style={{ width: '100%' }}>
//             <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Category</th><th style={styles.th}>Price</th><th style={styles.th}>Stock</th><th style={styles.th}>Featured</th></tr></thead>
//             <tbody>
//               {productReport.products?.map(p => (
//                 <tr key={p.id}>
//                   <td style={styles.td}>{p.name}</td>
//                   <td style={styles.td}>{p.category}</td>
//                   <td style={styles.td}>${p.price}</td>
//                   <td style={styles.td}>{p.stock}</td>
//                   <td style={styles.td}>{p.featured ? '⭐ Yes' : 'No'}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {activeTab === 'users' && userReport && (
//         <div style={styles.table}>
//           <h3 style={{ padding: '16px' }}>User List</h3>
//           <table style={{ width: '100%' }}>
//             <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Email</th><th style={styles.th}>Role</th><th style={styles.th}>Status</th><th style={styles.th}>Joined</th></tr></thead>
//             <tbody>
//               {userReport.users?.map(u => (
//                 <tr key={u.id}>
//                   <td style={styles.td}>{u.name}</td>
//                   <td style={styles.td}>{u.email}</td>
//                   <td style={styles.td}>{u.role}</td>
//                   <td style={styles.td}><span style={{ ...styles.statusBadge, background: u.isActive ? '#4caf50' : '#f44336' }}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
//                   <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';

// const AdminReports = () => {
//   const { token } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [exporting, setExporting] = useState(false);
//   const [activeTab, setActiveTab] = useState('dashboard');
//   const [period, setPeriod] = useState('month');
//   const [dashboard, setDashboard] = useState({
//     stats: {},
//     recentOrders: [],
//     monthlySales: []
//   });
//   const [salesReport, setSalesReport] = useState(null);
//   const [productReport, setProductReport] = useState(null);
//   const [userReport, setUserReport] = useState(null);

//   useEffect(() => {
//     fetchDashboard();
//     fetchSalesReport();
//     fetchProductReport();
//     fetchUserReport();
//   }, [period]);

//   const fetchDashboard = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/reports/dashboard', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setDashboard(response.data);
//       }
//     } catch (error) {
//       console.error('Dashboard error:', error);
//       toast.error('Failed to load dashboard');
//     }
//   };

//   const fetchSalesReport = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/admin/reports/sales?period=${period}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setSalesReport(response.data.report);
//       }
//     } catch (error) {
//       console.error('Sales report error:', error);
//     }
//   };

//   const fetchProductReport = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/reports/products', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setProductReport(response.data.report);
//       }
//     } catch (error) {
//       console.error('Product report error:', error);
//     }
//   };

//   const fetchUserReport = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/admin/reports/users', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       if (response.data.success) {
//         setUserReport(response.data.report);
//       }
//     } catch (error) {
//       console.error('User report error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleExport = async (type) => {
//     setExporting(true);
//     try {
//       let url = '';
//       let filename = '';
      
//       switch (type) {
//         case 'sales':
//           url = `http://localhost:5000/api/admin/reports/export/sales?period=${period}`;
//           filename = `sales_report_${new Date().toISOString().slice(0, 19)}.csv`;
//           break;
//         case 'products':
//           url = 'http://localhost:5000/api/admin/reports/export/products';
//           filename = `products_report_${new Date().toISOString().slice(0, 19)}.csv`;
//           break;
//         case 'users':
//           url = 'http://localhost:5000/api/admin/reports/export/users';
//           filename = `users_report_${new Date().toISOString().slice(0, 19)}.csv`;
//           break;
//         default:
//           return;
//       }
      
//       const response = await axios.get(url, {
//         headers: { Authorization: `Bearer ${token}` },
//         responseType: 'blob'
//       });
      
//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const link = document.createElement('a');
//       link.href = URL.createObjectURL(blob);
//       link.download = filename;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(link.href);
      
//       toast.success(`${type.toUpperCase()} report exported successfully`);
//     } catch (error) {
//       console.error('Export error:', error);
//       toast.error('Failed to export report');
//     } finally {
//       setExporting(false);
//     }
//   };

//   const styles = {
//     container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
//     header: { marginBottom: '24px' },
//     title: { fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' },
//     subtitle: { color: '#666', marginBottom: '20px' },
//     exportButtons: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
//     exportBtn: { padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s' },
//     tabs: { display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px', flexWrap: 'wrap' },
//     tab: { padding: '10px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s' },
//     statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
//     statCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' },
//     periodSelect: { padding: '8px 16px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' },
//     table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
//     th: { padding: '12px', textAlign: 'left', background: '#f8f9fa', fontWeight: '600', borderBottom: '1px solid #e0e0e0' },
//     td: { padding: '12px', borderBottom: '1px solid #e0e0e0' },
//     statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: 'white', display: 'inline-block' }
//   };

//   if (loading) {
//     return <div style={{ textAlign: 'center', padding: '50px' }}>Loading reports...</div>;
//   }

//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.title}>📊 Reports & Analytics</h1>
//         <p style={styles.subtitle}>View and export your store's performance data</p>
        
//         <div style={styles.exportButtons}>
//           <button onClick={() => handleExport('sales')} disabled={exporting} style={{ ...styles.exportBtn, background: '#4caf50', color: 'white' }}>📊 Export Sales Report</button>
//           <button onClick={() => handleExport('products')} disabled={exporting} style={{ ...styles.exportBtn, background: '#2196f3', color: 'white' }}>📦 Export Products Report</button>
//           <button onClick={() => handleExport('users')} disabled={exporting} style={{ ...styles.exportBtn, background: '#ff9800', color: 'white' }}>👥 Export Users Report</button>
//         </div>
//       </div>

//       <div style={styles.tabs}>
//         <button onClick={() => setActiveTab('dashboard')} style={{ ...styles.tab, background: activeTab === 'dashboard' ? '#667eea' : '#f0f0f0', color: activeTab === 'dashboard' ? 'white' : '#333' }}>📈 Dashboard</button>
//         <button onClick={() => setActiveTab('sales')} style={{ ...styles.tab, background: activeTab === 'sales' ? '#667eea' : '#f0f0f0', color: activeTab === 'sales' ? 'white' : '#333' }}>💰 Sales Report</button>
//         <button onClick={() => setActiveTab('products')} style={{ ...styles.tab, background: activeTab === 'products' ? '#667eea' : '#f0f0f0', color: activeTab === 'products' ? 'white' : '#333' }}>📦 Product Report</button>
//         <button onClick={() => setActiveTab('users')} style={{ ...styles.tab, background: activeTab === 'users' ? '#667eea' : '#f0f0f0', color: activeTab === 'users' ? 'white' : '#333' }}>👥 User Report</button>
//       </div>

//       {/* Dashboard Tab */}
//       {activeTab === 'dashboard' && (
//         <div>
//           <div style={styles.statsGrid}>
//             <div style={styles.statCard}><h3>Total Users</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>{dashboard.stats?.totalUsers || 0}</p></div>
//             <div style={styles.statCard}><h3>Total Products</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>{dashboard.stats?.totalProducts || 0}</p></div>
//             <div style={styles.statCard}><h3>Total Orders</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff9800' }}>{dashboard.stats?.totalOrders || 0}</p></div>
//             <div style={styles.statCard}><h3>Pending Orders</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#9c27b0' }}>{dashboard.stats?.pendingOrders || 0}</p></div>
//             <div style={styles.statCard}><h3>Total Revenue</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f44336' }}>${dashboard.stats?.totalRevenue?.toFixed(2) || 0}</p></div>
//           </div>
          
//           <div style={styles.table}>
//             <h3 style={{ padding: '16px' }}>Recent Orders</h3>
//             <table style={{ width: '100%' }}>
//               <thead><tr><th style={styles.th}>Order ID</th><th style={styles.th}>Customer</th><th style={styles.th}>Amount</th><th style={styles.th}>Status</th><th style={styles.th}>Date</th></tr></thead>
//               <tbody>
//                 {dashboard.recentOrders?.map(order => (
//                   <tr key={order._id}>
//                     <td style={styles.td}>#{order._id.slice(-8)}</td>
//                     <td style={styles.td}>{order.user?.name}</td>
//                     <td style={styles.td}>${order.totalPrice}</td>
//                     <td style={styles.td}><span style={{ ...styles.statusBadge, background: order.status === 'delivered' ? '#4caf50' : '#ff9800' }}>{order.status}</span></td>
//                     <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Sales Report Tab */}
//       {activeTab === 'sales' && salesReport && (
//         <div>
//           <div style={{ marginBottom: '20px' }}>
//             <select value={period} onChange={(e) => setPeriod(e.target.value)} style={styles.periodSelect}>
//               <option value="today">Today</option>
//               <option value="week">Last 7 Days</option>
//               <option value="month">Last 30 Days</option>
//               <option value="all">All Time</option>
//             </select>
//           </div>
          
//           <div style={styles.statsGrid}>
//             <div style={styles.statCard}><h3>Total Orders</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{salesReport.summary?.totalOrders}</p></div>
//             <div style={styles.statCard}><h3>Total Revenue</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>${salesReport.summary?.totalRevenue?.toFixed(2)}</p></div>
//             <div style={styles.statCard}><h3>Average Order</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>${salesReport.summary?.averageOrderValue?.toFixed(2)}</p></div>
//             <div style={styles.statCard}><h3>Completed Orders</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>{salesReport.summary?.completedOrders}</p></div>
//           </div>
          
//           <div style={styles.table}>
//             <h3 style={{ padding: '16px' }}>Top Selling Products</h3>
//             <table style={{ width: '100%' }}>
//               <thead><tr><th style={styles.th}>Product</th><th style={styles.th}>Quantity Sold</th><th style={styles.th}>Revenue</th></tr></thead>
//               <tbody>
//                 {salesReport.topProducts?.map((p, i) => (
//                   <tr key={i}><td style={styles.td}>{p.name}</td><td style={styles.td}>{p.quantity}</td><td style={styles.td}>${p.revenue.toFixed(2)}</td></tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* Product Report Tab */}
//       {activeTab === 'products' && productReport && (
//         <div>
//           <div style={styles.statsGrid}>
//             <div style={styles.statCard}><h3>Total Products</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{productReport.summary?.totalProducts}</p></div>
//             <div style={styles.statCard}><h3>Total Stock</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{productReport.summary?.totalStock}</p></div>
//             <div style={styles.statCard}><h3>Total Value</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>${productReport.summary?.totalValue?.toFixed(2)}</p></div>
//             <div style={styles.statCard}><h3>Out of Stock</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#f44336' }}>{productReport.summary?.outOfStock}</p></div>
//             <div style={styles.statCard}><h3>Low Stock</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800' }}>{productReport.summary?.lowStock}</p></div>
//             <div style={styles.statCard}><h3>Featured</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#9c27b0' }}>{productReport.summary?.featuredProducts}</p></div>
//           </div>
          
//           <div style={styles.table}>
//             <h3 style={{ padding: '16px' }}>Product List</h3>
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%' }}>
//                 <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Category</th><th style={styles.th}>Price</th><th style={styles.th}>Stock</th><th style={styles.th}>Featured</th></tr></thead>
//                 <tbody>
//                   {productReport.products?.map(p => (
//                     <tr key={p.id}>
//                       <td style={styles.td}>{p.name}</td>
//                       <td style={styles.td}>{p.category}</td>
//                       <td style={styles.td}>${p.price}</td>
//                       <td style={styles.td}>{p.stock}</td>
//                       <td style={styles.td}>{p.featured ? '⭐ Yes' : 'No'}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* User Report Tab */}
//       {activeTab === 'users' && userReport && (
//         <div>
//           <div style={styles.statsGrid}>
//             <div style={styles.statCard}><h3>Total Users</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{userReport.summary?.totalUsers}</p></div>
//             <div style={styles.statCard}><h3>Active Users</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#4caf50' }}>{userReport.summary?.activeUsers}</p></div>
//             <div style={styles.statCard}><h3>Admin Users</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{userReport.summary?.adminUsers}</p></div>
//             <div style={styles.statCard}><h3>Regular Users</h3><p style={{ fontSize: '24px', fontWeight: 'bold' }}>{userReport.summary?.regularUsers}</p></div>
//             <div style={styles.statCard}><h3>Active %</h3><p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2196f3' }}>{userReport.summary?.activePercentage}%</p></div>
//           </div>
          
//           <div style={styles.table}>
//             <h3 style={{ padding: '16px' }}>User List</h3>
//             <div style={{ overflowX: 'auto' }}>
//               <table style={{ width: '100%' }}>
//                 <thead><tr><th style={styles.th}>Name</th><th style={styles.th}>Email</th><th style={styles.th}>Role</th><th style={styles.th}>Status</th><th style={styles.th}>Joined</th></tr></thead>
//                 <tbody>
//                   {userReport.users?.map(u => (
//                     <tr key={u.id}>
//                       <td style={styles.td}>{u.name}</td>
//                       <td style={styles.td}>{u.email}</td>
//                       <td style={styles.td}>{u.role}</td>
//                       <td style={styles.td}><span style={{ ...styles.statusBadge, background: u.isActive ? '#4caf50' : '#f44336' }}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
//                       <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminReports;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [generatingReport, setGeneratingReport] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchDashboard();
    fetchUsers();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/reports/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setStats(response.data.stats);
        setRecentOrders(response.data.recentOrders);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Users error:', error);
      toast.error('Failed to load users');
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error('Products error:', error);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}`, 
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('User role updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}`,
        { isActive: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`User ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user status');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Order status updated');
      fetchOrders();
      fetchDashboard();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/products/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  // Report Generation Functions
  const generateSalesReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/reports/export/sales', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `sales_report_${new Date().toISOString().slice(0, 19)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Sales report downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate sales report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const generateProductsReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/reports/export/products', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `products_report_${new Date().toISOString().slice(0, 19)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Products report downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate products report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const generateUsersReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await axios.get('http://localhost:5000/api/admin/reports/export/users', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_report_${new Date().toISOString().slice(0, 19)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Users report downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate users report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const generateFullReport = async () => {
    setGeneratingReport(true);
    try {
      // Generate summary data
      const summaryData = {
        generatedAt: new Date().toISOString(),
        totalUsers: stats.totalUsers,
        totalProducts: stats.totalProducts,
        totalOrders: stats.totalOrders,
        totalRevenue: stats.totalRevenue,
        pendingOrders: stats.pendingOrders,
        activeUsers: users.filter(u => u.isActive).length,
        featuredProducts: products.filter(p => p.featured).length,
        completedOrders: orders.filter(o => o.status === 'delivered').length
      };
      
      // Create CSV content
      let csvContent = 'E-SHOP ADMIN REPORT\n';
      csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;
      csvContent += 'SUMMARY STATISTICS\n';
      csvContent += `Total Users,${summaryData.totalUsers}\n`;
      csvContent += `Active Users,${summaryData.activeUsers}\n`;
      csvContent += `Total Products,${summaryData.totalProducts}\n`;
      csvContent += `Featured Products,${summaryData.featuredProducts}\n`;
      csvContent += `Total Orders,${summaryData.totalOrders}\n`;
      csvContent += `Completed Orders,${summaryData.completedOrders}\n`;
      csvContent += `Pending Orders,${summaryData.pendingOrders}\n`;
      csvContent += `Total Revenue,$${summaryData.totalRevenue.toFixed(2)}\n\n`;
      
      csvContent += 'RECENT ORDERS\n';
      csvContent += 'Order ID,Customer,Amount,Status,Date\n';
      recentOrders.forEach(order => {
        csvContent += `${order._id.slice(-8)},${order.user?.name || 'N/A'},$${order.totalPrice},${order.status},${new Date(order.createdAt).toLocaleDateString()}\n`;
      });
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `full_report_${new Date().toISOString().slice(0, 19)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Full report downloaded successfully');
    } catch (error) {
      toast.error('Failed to generate full report');
    } finally {
      setGeneratingReport(false);
    }
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { marginBottom: '24px' },
    headerTitle: { fontSize: '28px', fontWeight: 'bold', color: '#333', marginBottom: '8px' },
    reportButtons: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' },
    reportBtn: { 
      padding: '10px 20px', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      fontSize: '14px', 
      fontWeight: '500',
      transition: 'all 0.3s',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    tabs: { display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid #e0e0e0', paddingBottom: '12px', flexWrap: 'wrap' },
    tab: { padding: '10px 24px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500', transition: 'all 0.3s' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' },
    statCard: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.08)', textAlign: 'center' },
    table: { width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '12px', overflow: 'auto', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
    th: { padding: '12px', textAlign: 'left', background: '#f8f9fa', fontWeight: '600', borderBottom: '1px solid #e0e0e0' },
    td: { padding: '12px', borderBottom: '1px solid #e0e0e0' },
    statusBadge: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: 'white', display: 'inline-block' },
    actionBtn: { padding: '6px 12px', margin: '0 4px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', transition: 'all 0.3s' }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading dashboard...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>👑 Admin Dashboard</h1>
        <p>Manage your store - View and control all users, products, and orders</p>
      </div>

      {/* Report Generation Buttons */}
      <div style={styles.reportButtons}>
        <button 
          onClick={generateSalesReport} 
          disabled={generatingReport}
          style={{ ...styles.reportBtn, background: '#4caf50', color: 'white' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          📊 Generate Sales Report
        </button>
        <button 
          onClick={generateProductsReport} 
          disabled={generatingReport}
          style={{ ...styles.reportBtn, background: '#2196f3', color: 'white' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          📦 Generate Products Report
        </button>
        <button 
          onClick={generateUsersReport} 
          disabled={generatingReport}
          style={{ ...styles.reportBtn, background: '#ff9800', color: 'white' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          👥 Generate Users Report
        </button>
        <button 
          onClick={generateFullReport} 
          disabled={generatingReport}
          style={{ ...styles.reportBtn, background: '#9c27b0', color: 'white' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          📋 Generate Full Report
        </button>
      </div>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('overview')} style={{ ...styles.tab, background: activeTab === 'overview' ? '#667eea' : '#f0f0f0', color: activeTab === 'overview' ? 'white' : '#333' }}>📊 Overview</button>
        <button onClick={() => setActiveTab('users')} style={{ ...styles.tab, background: activeTab === 'users' ? '#667eea' : '#f0f0f0', color: activeTab === 'users' ? 'white' : '#333' }}>👥 Users ({users.length})</button>
        <button onClick={() => setActiveTab('orders')} style={{ ...styles.tab, background: activeTab === 'orders' ? '#667eea' : '#f0f0f0', color: activeTab === 'orders' ? 'white' : '#333' }}>📋 Orders ({orders.length})</button>
        <button onClick={() => setActiveTab('products')} style={{ ...styles.tab, background: activeTab === 'products' ? '#667eea' : '#f0f0f0', color: activeTab === 'products' ? 'white' : '#333' }}>📦 Products ({products.length})</button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}><h3>Total Users</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#667eea' }}>{stats.totalUsers}</p></div>
            <div style={styles.statCard}><h3>Total Products</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>{stats.totalProducts}</p></div>
            <div style={styles.statCard}><h3>Total Orders</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff9800' }}>{stats.totalOrders}</p></div>
            <div style={styles.statCard}><h3>Pending Orders</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#9c27b0' }}>{stats.pendingOrders}</p></div>
            <div style={styles.statCard}><h3>Total Revenue</h3><p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f44336' }}>${stats.totalRevenue.toFixed(2)}</p></div>
          </div>
          
          <div style={styles.table}>
            <h3 style={{ padding: '16px' }}>Recent Orders</h3>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order._id}>
                    <td style={styles.td}>#{order._id.slice(-8)}</td>
                    <td style={styles.td}>{order.user?.name}</td>
                    <td style={styles.td}>${order.totalPrice}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: order.status === 'delivered' ? '#4caf50' : order.status === 'cancelled' ? '#f44336' : '#ff9800' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div style={styles.table}>
          <h3 style={{ padding: '16px' }}>All Users</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={styles.th}>ID</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Joined</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td style={styles.td}>#{user._id.slice(-8)}</td>
                    <td style={styles.td}>{user.name}</td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>
                      <select 
                        value={user.role} 
                        onChange={(e) => updateUserRole(user._id, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd' }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: user.isActive ? '#4caf50' : '#f44336' }}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <button onClick={() => toggleUserStatus(user._id, user.isActive)} style={{ ...styles.actionBtn, background: user.isActive ? '#ff9800' : '#4caf50', color: 'white' }}>
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => deleteUser(user._id)} style={{ ...styles.actionBtn, background: '#f44336', color: 'white' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={styles.table}>
          <h3 style={{ padding: '16px' }}>All Orders</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Amount</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td style={styles.td}>#{order._id.slice(-8)}</td>
                    <td style={styles.td}>{order.user?.name}</td>
                    <td style={styles.td}>{order.orderItems?.length || 0} items</td>
                    <td style={styles.td}>${order.totalPrice?.toFixed(2)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: order.status === 'delivered' ? '#4caf50' : order.status === 'cancelled' ? '#f44336' : '#ff9800' }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: order.paymentStatus === 'paid' ? '#4caf50' : '#ff9800' }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <select 
                        value={order.status} 
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #ddd' }}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div style={styles.table}>
          <h3 style={{ padding: '16px' }}>Product List</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th style={styles.th}>Image</th>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Price</th>
                  <th style={styles.th}>Stock</th>
                  <th style={styles.th}>Featured</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id}>
                    <td style={styles.td}>
                      <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} />
                    </td>
                    <td style={styles.td}>{product.name}</td>
                    <td style={styles.td}>{product.category}</td>
                    <td style={styles.td}>${product.price}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, background: product.stock > 10 ? '#4caf50' : product.stock > 0 ? '#ff9800' : '#f44336' }}>
                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                      </span>
                    </td>
                    <td style={styles.td}>{product.featured ? '⭐ Yes' : 'No'}</td>
                    <td style={styles.td}>
                      <button onClick={() => deleteProduct(product._id)} style={{ ...styles.actionBtn, background: '#f44336', color: 'white' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;