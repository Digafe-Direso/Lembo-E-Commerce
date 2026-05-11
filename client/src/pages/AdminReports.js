import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
);

const AdminReports = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    recentOrders: [],
    monthlySales: [],
    topProducts: []
  });
  const [salesReport, setSalesReport] = useState({
    summary: {},
    dailySales: [],
    topProducts: [],
    categorySales: []
  });
  const [productReport, setProductReport] = useState({
    summary: {},
    productList: []
  });
  const [userReport, setUserReport] = useState({
    summary: {},
    userList: []
  });
  const [period, setPeriod] = useState('month');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadDashboard();
    loadSalesReport();
    loadProductReport();
    loadUserReport();
  }, []);

  const loadDashboard = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/reports/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setDashboardData(response.data);
      }
    } catch (error) {
      console.error('Dashboard error:', error);
      toast.error('Failed to load dashboard');
    }
  };

  const loadSalesReport = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateRange.start && dateRange.end) {
        params.append('startDate', dateRange.start);
        params.append('endDate', dateRange.end);
      } else {
        params.append('period', period);
      }
      
      const response = await axios.get(`http://localhost:5000/api/admin/reports/sales?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSalesReport(response.data.report);
      }
    } catch (error) {
      console.error('Sales report error:', error);
      toast.error('Failed to load sales report');
    } finally {
      setLoading(false);
    }
  };

  const loadProductReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/reports/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setProductReport(response.data.report);
      }
    } catch (error) {
      console.error('Product report error:', error);
      toast.error('Failed to load product report');
    }
  };

  const loadUserReport = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/reports/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setUserReport(response.data.report);
      }
    } catch (error) {
      console.error('User report error:', error);
      toast.error('Failed to load user report');
    }
  };

  const exportCSV = async () => {
    try {
      let data = {};
      if (activeTab === 'sales') {
        data = {
          summary: salesReport.summary,
          orders: salesReport.dailySales
        };
      } else if (activeTab === 'products') {
        data = { productList: productReport.productList };
      } else if (activeTab === 'users') {
        data = { userList: userReport.userList };
      }
      
      const response = await axios.post('http://localhost:5000/api/admin/reports/export-csv', {
        reportType: activeTab,
        data
      }, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${activeTab}_report_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Report exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export report');
    }
  };

  // Chart data configurations
  const salesChartData = {
    labels: salesReport.dailySales?.map(d => d.date) || [],
    datasets: [
      {
        label: 'Revenue ($)',
        data: salesReport.dailySales?.map(d => d.revenue) || [],
        backgroundColor: 'rgba(102, 126, 234, 0.5)',
        borderColor: '#667eea',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Orders Count',
        data: salesReport.dailySales?.map(d => d.count) || [],
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        borderColor: '#4caf50',
        borderWidth: 2,
        tension: 0.4,
        fill: true
      }
    ]
  };

  const topProductsData = {
    labels: salesReport.topProducts?.map(p => p.name) || [],
    datasets: [
      {
        label: 'Units Sold',
        data: salesReport.topProducts?.map(p => p.quantity) || [],
        backgroundColor: '#4caf50',
        borderRadius: 8,
        barPercentage: 0.7
      }
    ]
  };

  const categorySalesData = {
    labels: salesReport.categorySales?.map(c => c.category) || [],
    datasets: [
      {
        data: salesReport.categorySales?.map(c => c.revenue) || [],
        backgroundColor: ['#667eea', '#764ba2', '#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0', '#00bcd4'],
        borderWidth: 0
      }
    ]
  };

  const productCategoryData = {
    labels: productReport.categoryDistribution?.map(c => c.category) || [],
    datasets: [
      {
        data: productReport.categoryDistribution?.map(c => c.count) || [],
        backgroundColor: ['#667eea', '#764ba2', '#4caf50', '#ff9800', '#f44336', '#2196f3'],
        borderWidth: 0
      }
    ]
  };

  const styles = {
    container: { padding: '24px', maxWidth: '1400px', margin: '0 auto' },
    header: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '24px', 
      flexWrap: 'wrap', 
      gap: '16px' 
    },
    tabs: { 
      display: 'flex', 
      gap: '12px', 
      flexWrap: 'wrap',
      borderBottom: '1px solid #e0e0e0',
      paddingBottom: '12px',
      marginBottom: '24px'
    },
    tab: { 
      padding: '10px 24px', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      fontSize: '14px', 
      fontWeight: '500',
      transition: 'all 0.3s'
    },
    statsGrid: { 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
      gap: '20px', 
      marginBottom: '30px' 
    },
    statCard: { 
      background: 'white', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)', 
      textAlign: 'center',
      transition: 'transform 0.3s, box-shadow 0.3s',
      cursor: 'pointer'
    },
    chartCard: { 
      background: 'white', 
      padding: '20px', 
      borderRadius: '12px', 
      boxShadow: '0 2px 10px rgba(0,0,0,0.08)', 
      marginBottom: '24px' 
    },
    buttonGroup: { display: 'flex', gap: '12px' },
    exportBtn: { 
      padding: '10px 20px', 
      border: 'none', 
      borderRadius: '8px', 
      cursor: 'pointer', 
      fontSize: '14px', 
      fontWeight: '500',
      transition: 'all 0.3s'
    },
    filterGroup: { 
      display: 'flex', 
      gap: '16px', 
      alignItems: 'center', 
      flexWrap: 'wrap',
      marginBottom: '24px',
      padding: '16px',
      background: '#f8f9fa',
      borderRadius: '12px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '16px'
    },
    th: {
      padding: '12px',
      textAlign: 'left',
      background: '#f8f9fa',
      fontWeight: '600',
      borderBottom: '2px solid #e0e0e0'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid #e0e0e0'
    }
  };

  const renderDashboard = () => (
    <div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>👥</div>
          <h3 style={{ marginBottom: '8px', color: '#666' }}>Total Users</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#667eea' }}>{dashboardData.stats?.totalUsers || 0}</p>
        </div>
        <div style={styles.statCard}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
          <h3 style={{ marginBottom: '8px', color: '#666' }}>Total Products</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#4caf50' }}>{dashboardData.stats?.totalProducts || 0}</p>
        </div>
        <div style={styles.statCard}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>🛒</div>
          <h3 style={{ marginBottom: '8px', color: '#666' }}>Total Orders</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800' }}>{dashboardData.stats?.totalOrders || 0}</p>
        </div>
        <div style={styles.statCard}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
          <h3 style={{ marginBottom: '8px', color: '#666' }}>Total Revenue</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#f44336' }}>${dashboardData.stats?.totalRevenue?.toFixed(2) || 0}</p>
        </div>
        <div style={styles.statCard}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>⏳</div>
          <h3 style={{ marginBottom: '8px', color: '#666' }}>Pending Orders</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#9c27b0' }}>{dashboardData.stats?.pendingOrders || 0}</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={styles.chartCard}>
          <h3 style={{ marginBottom: '16px' }}>📈 Monthly Sales Trend</h3>
          <Line 
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              datasets: [{
                label: 'Sales ($)',
                data: dashboardData.monthlySales?.map(m => m.total) || [],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                fill: true,
                tension: 0.4
              }]
            }} 
            options={{ responsive: true }} 
          />
        </div>
        <div style={styles.chartCard}>
          <h3 style={{ marginBottom: '16px' }}>🏆 Top Selling Products</h3>
          <Bar 
            data={{
              labels: dashboardData.topProducts?.map(p => p.name?.slice(0, 15)) || [],
              datasets: [{
                label: 'Units Sold',
                data: dashboardData.topProducts?.map(p => p.totalSold) || [],
                backgroundColor: '#4caf50'
              }]
            }} 
            options={{ responsive: true }} 
          />
        </div>
      </div>
      
      <div style={styles.chartCard}>
        <h3 style={{ marginBottom: '16px' }}>📋 Recent Orders</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.table}>
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
              {dashboardData.recentOrders?.map(order => (
                <tr key={order._id}>
                  <td style={styles.td}>#{order._id?.slice(-8)}</td>
                  <td style={styles.td}>{order.user?.name}</td>
                  <td style={styles.td}>${order.totalPrice?.toFixed(2)}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '20px', 
                      background: order.status === 'delivered' ? '#4caf50' : order.status === 'cancelled' ? '#f44336' : '#ff9800', 
                      color: 'white',
                      fontSize: '12px'
                    }}>
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
    </div>
  );

  const renderSalesReport = () => (
    <div>
      <div style={styles.filterGroup}>
        <div>
          <label style={{ marginRight: '8px' }}>Period:</label>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)} 
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
          >
            <option value="day">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
        <div>
          <label style={{ marginRight: '8px' }}>From:</label>
          <input 
            type="date" 
            value={dateRange.start} 
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })} 
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }} 
          />
        </div>
        <div>
          <label style={{ marginRight: '8px' }}>To:</label>
          <input 
            type="date" 
            value={dateRange.end} 
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })} 
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }} 
          />
        </div>
        <button 
          onClick={loadSalesReport} 
          style={{ padding: '8px 20px', background: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Apply Filters
        </button>
      </div>
      
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total Orders</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{salesReport.summary?.totalOrders || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Total Revenue</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>${salesReport.summary?.totalRevenue?.toFixed(2) || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Average Order</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>${salesReport.summary?.averageOrderValue?.toFixed(2) || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Completed Orders</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#2196f3' }}>{salesReport.summary?.completedOrders || 0}</p>
        </div>
      </div>
      
      <div style={styles.chartCard}>
        <h3 style={{ marginBottom: '16px' }}>📈 Sales Trend</h3>
        <Line data={salesChartData} options={{ responsive: true }} />
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div style={styles.chartCard}>
          <h3 style={{ marginBottom: '16px' }}>🏆 Top Selling Products</h3>
          <Bar data={topProductsData} options={{ responsive: true }} />
        </div>
        <div style={styles.chartCard}>
          <h3 style={{ marginBottom: '16px' }}>📊 Sales by Category</h3>
          <Pie data={categorySalesData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );

  const renderProductReport = () => (
    <div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total Products</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{productReport.summary?.totalProducts || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Total Stock</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{productReport.summary?.totalStock || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Out of Stock</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f44336' }}>{productReport.summary?.outOfStock || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Low Stock ({'<10'})</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#ff9800' }}>{productReport.summary?.lowStock || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Featured Products</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#9c27b0' }}>{productReport.summary?.featuredProducts || 0}</p>
        </div>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        <div style={styles.chartCard}>
          <h3 style={{ marginBottom: '16px' }}>Products by Category</h3>
          <Doughnut data={productCategoryData} options={{ responsive: true }} />
        </div>
        <div style={styles.chartCard}>
          <h3 style={{ marginBottom: '16px' }}>Summary</h3>
          <div style={{ padding: '20px' }}>
            <p><strong>Average Price:</strong> ${productReport.summary?.averagePrice || 0}</p>
            <p><strong>Categories:</strong> {productReport.categoryDistribution?.length || 0}</p>
            <p><strong>Total Value:</strong> ${(productReport.summary?.totalStock * productReport.summary?.averagePrice).toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      <div style={styles.chartCard}>
        <h3 style={{ marginBottom: '16px' }}>📋 Product List</h3>
        <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Category</th>
                <th style={styles.th}>Price</th>
                <th style={styles.th}>Stock</th>
                <th style={styles.th}>Featured</th>
              </tr>
            </thead>
            <tbody>
              {productReport.productList?.map(product => (
                <tr key={product.id}>
                  <td style={styles.td}>{product.name}</td>
                  <td style={styles.td}>{product.category}</td>
                  <td style={styles.td}>${product.price?.toFixed(2)}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: product.stock === 0 ? '#f44336' : product.stock < 10 ? '#ff9800' : '#4caf50', 
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {product.stock}
                    </span>
                  </td>
                  <td style={styles.td}>{product.featured ? '⭐ Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUserReport = () => (
    <div>
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <h3>Total Users</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{userReport.summary?.totalUsers || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Active Users</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4caf50' }}>{userReport.summary?.activeUsers || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Admin Users</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{userReport.summary?.adminUsers || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Regular Users</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{userReport.summary?.regularUsers || 0}</p>
        </div>
        <div style={styles.statCard}>
          <h3>Inactive Users</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#f44336' }}>{userReport.summary?.inactiveUsers || 0}</p>
        </div>
      </div>
      
      <div style={styles.chartCard}>
        <h3 style={{ marginBottom: '16px' }}>📈 User Registrations by Month</h3>
        <Bar 
          data={{
            labels: userReport.registrationsByMonth?.map(r => r.month) || [],
            datasets: [{
              label: 'New Users',
              data: userReport.registrationsByMonth?.map(r => r.count) || [],
              backgroundColor: '#667eea'
            }]
          }} 
          options={{ responsive: true }} 
        />
      </div>
      
      <div style={styles.chartCard}>
        <h3 style={{ marginBottom: '16px' }}>👥 User List</h3>
        <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto' }}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {userReport.userList?.map(user => (
                <tr key={user.id}>
                  <td style={styles.td}>{user.name}</td>
                  <td style={styles.td}>{user.email}</td>
                  <td style={styles.td}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: user.role === 'admin' ? '#f44336' : '#4caf50', 
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: user.isActive ? '#4caf50' : '#f44336', 
                      color: 'white',
                      fontSize: '12px'
                    }}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={styles.td}>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  if (loading && activeTab === 'dashboard') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📊 Reports & Analytics Dashboard</h1>
        <div style={styles.buttonGroup}>
          <button 
            onClick={exportCSV} 
            style={{ ...styles.exportBtn, background: '#4caf50', color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            📊 Export CSV
          </button>
        </div>
      </div>
      
      <div style={styles.tabs}>
        <button 
          onClick={() => setActiveTab('dashboard')} 
          style={{ 
            ...styles.tab, 
            background: activeTab === 'dashboard' ? '#667eea' : '#f0f0f0', 
            color: activeTab === 'dashboard' ? 'white' : '#333',
            borderBottom: activeTab === 'dashboard' ? '3px solid #667eea' : 'none'
          }}
        >
          📈 Dashboard
        </button>
        <button 
          onClick={() => setActiveTab('sales')} 
          style={{ 
            ...styles.tab, 
            background: activeTab === 'sales' ? '#667eea' : '#f0f0f0', 
            color: activeTab === 'sales' ? 'white' : '#333'
          }}
        >
          💰 Sales Report
        </button>
        <button 
          onClick={() => setActiveTab('products')} 
          style={{ 
            ...styles.tab, 
            background: activeTab === 'products' ? '#667eea' : '#f0f0f0', 
            color: activeTab === 'products' ? 'white' : '#333'
          }}
        >
          📦 Product Report
        </button>
        <button 
          onClick={() => setActiveTab('users')} 
          style={{ 
            ...styles.tab, 
            background: activeTab === 'users' ? '#667eea' : '#f0f0f0', 
            color: activeTab === 'users' ? 'white' : '#333'
          }}
        >
          👥 User Report
        </button>
      </div>
      
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'sales' && renderSalesReport()}
      {activeTab === 'products' && renderProductReport()}
      {activeTab === 'users' && renderUserReport()}
    </div>
  );
};

export default AdminReports;