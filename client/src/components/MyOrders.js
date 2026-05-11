import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const MyOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.orders);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      processing: 'info',
      shipped: 'primary',
      delivered: 'success',
      cancelled: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      paid: 'success',
      failed: 'danger'
    };
    return colors[status] || 'secondary';
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-empty">
        <div className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="shop-now-btn">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <span className="order-number">Order #{order._id.slice(-8)}</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="order-status">
                <span className={`status-badge ${getStatusColor(order.status)}`}>
                  {order.status.toUpperCase()}
                </span>
                <span className={`payment-badge ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                  </div>
                  <div className="order-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-summary">
                <div className="summary-line">
                  <span>Subtotal:</span>
                  <span>${order.itemsPrice?.toFixed(2) || 0}</span>
                </div>
                <div className="summary-line">
                  <span>Shipping:</span>
                  <span>${order.shippingPrice?.toFixed(2) || 0}</span>
                </div>
                <div className="summary-line">
                  <span>Tax:</span>
                  <span>${order.taxPrice?.toFixed(2) || 0}</span>
                </div>
                <div className="summary-line total">
                  <span>Total:</span>
                  <span>${order.totalPrice?.toFixed(2) || 0}</span>
                </div>
              </div>
              
              <div className="order-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                >
                  {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            </div>

            {selectedOrder === order._id && (
              <div className="order-details">
                <h3>Shipping Information</h3>
                <div className="shipping-address">
                  <p><strong>Address:</strong> {order.shippingAddress?.street}</p>
                  <p><strong>City:</strong> {order.shippingAddress?.city}</p>
                  <p><strong>State:</strong> {order.shippingAddress?.state}</p>
                  <p><strong>ZIP:</strong> {order.shippingAddress?.zipCode}</p>
                  <p><strong>Country:</strong> {order.shippingAddress?.country}</p>
                </div>
                
                <h3>Payment Information</h3>
                <div className="payment-info">
                  <p><strong>Method:</strong> {order.paymentMethod?.toUpperCase()}</p>
                  <p><strong>Status:</strong> {order.paymentStatus}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;