import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#ff9800',
      processing: '#2196f3',
      shipped: '#9c27b0',
      delivered: '#4caf50',
      cancelled: '#f44336'
    };
    return colors[status] || '#666';
  };

  const getFilteredOrders = () => {
    if (filter === 'all') return orders;
    return orders.filter(order => order.status === filter);
  };

  const getStats = () => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  });

  const stats = getStats();

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div className="admin-dashboard">
      <h1>Order Management</h1>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card"><h3>Total Orders</h3><p>{stats.total}</p></div>
        <div className="stat-card"><h3>Pending</h3><p>{stats.pending}</p></div>
        <div className="stat-card"><h3>Processing</h3><p>{stats.processing}</p></div>
        <div className="stat-card"><h3>Shipped</h3><p>{stats.shipped}</p></div>
        <div className="stat-card"><h3>Delivered</h3><p>{stats.delivered}</p></div>
        <div className="stat-card"><h3>Cancelled</h3><p>{stats.cancelled}</p></div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <button onClick={() => setFilter('all')} style={{ padding: '0.5rem 1rem', background: filter === 'all' ? '#667eea' : '#f8f9fa', color: filter === 'all' ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          All ({stats.total})
        </button>
        <button onClick={() => setFilter('pending')} style={{ padding: '0.5rem 1rem', background: filter === 'pending' ? '#ff9800' : '#f8f9fa', color: filter === 'pending' ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Pending ({stats.pending})
        </button>
        <button onClick={() => setFilter('processing')} style={{ padding: '0.5rem 1rem', background: filter === 'processing' ? '#2196f3' : '#f8f9fa', color: filter === 'processing' ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Processing ({stats.processing})
        </button>
        <button onClick={() => setFilter('shipped')} style={{ padding: '0.5rem 1rem', background: filter === 'shipped' ? '#9c27b0' : '#f8f9fa', color: filter === 'shipped' ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Shipped ({stats.shipped})
        </button>
        <button onClick={() => setFilter('delivered')} style={{ padding: '0.5rem 1rem', background: filter === 'delivered' ? '#4caf50' : '#f8f9fa', color: filter === 'delivered' ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Delivered ({stats.delivered})
        </button>
        <button onClick={() => setFilter('cancelled')} style={{ padding: '0.5rem 1rem', background: filter === 'cancelled' ? '#f44336' : '#f8f9fa', color: filter === 'cancelled' ? 'white' : '#333', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          Cancelled ({stats.cancelled})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div>
          {filteredOrders.map(order => (
            <div key={order._id} style={{ background: 'white', borderRadius: '10px', marginBottom: '1.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <div style={{ padding: '1rem', background: '#f8f9fa', borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                <div>
                  <strong>Order #{order._id.slice(-8)}</strong>
                  <span style={{ marginLeft: '1rem' }}>{order.user?.name}</span>
                  <span style={{ marginLeft: '1rem', color: '#666' }}>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '5px',
                      border: 'none',
                      backgroundColor: getStatusColor(order.status),
                      color: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <span style={{ marginLeft: '0.5rem', padding: '0.25rem 0.5rem', borderRadius: '5px', background: order.paymentStatus === 'paid' ? '#4caf50' : '#ff9800', color: 'white' }}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              <div style={{ padding: '1rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Items:</strong>
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div style={{ textAlign: 'right', paddingTop: '1rem', borderTop: '1px solid #e0e0e0' }}>
                  <strong>Total: ${order.totalPrice?.toFixed(2)}</strong>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                style={{ width: '100%', padding: '0.75rem', background: '#f8f9fa', border: 'none', borderTop: '1px solid #e0e0e0', cursor: 'pointer', color: '#667eea' }}
              >
                {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
              </button>

              {selectedOrder === order._id && (
                <div style={{ padding: '1rem', background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
                  <h4>Customer Information</h4>
                  <p><strong>Name:</strong> {order.user?.name}</p>
                  <p><strong>Email:</strong> {order.user?.email}</p>
                  <h4 style={{ marginTop: '1rem' }}>Shipping Address</h4>
                  <p>{order.shippingAddress?.street}</p>
                  <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                  <p>{order.shippingAddress?.country}</p>
                  <h4 style={{ marginTop: '1rem' }}>Payment Method</h4>
                  <p>{order.paymentMethod?.toUpperCase()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;