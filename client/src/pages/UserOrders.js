// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import toast from 'react-hot-toast';

// const UserOrders = () => {
//   const { token } = useAuth();
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/orders/myorders', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setOrders(response.data.orders);
//     } catch (error) {
//       console.error('Fetch orders error:', error);
//       toast.error('Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelOrder = async (orderId) => {
//     if (window.confirm('Are you sure you want to cancel this order?')) {
//       try {
//         const response = await axios.put(
//           `http://localhost:5000/api/orders/${orderId}/cancel`,
//           {},
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         if (response.data.success) {
//           toast.success('Order cancelled successfully');
//           fetchOrders();
//         }
//       } catch (error) {
//         toast.error(error.response?.data?.message || 'Failed to cancel order');
//       }
//     }
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: '#ff9800',
//       processing: '#2196f3',
//       shipped: '#9c27b0',
//       delivered: '#4caf50',
//       cancelled: '#f44336'
//     };
//     return colors[status] || '#666';
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       pending: '#ff9800',
//       paid: '#4caf50',
//       failed: '#f44336'
//     };
//     return colors[status] || '#666';
//   };

//   if (loading) {
//     return <div className="loading">Loading your orders...</div>;
//   }

//   if (orders.length === 0) {
//     return (
//       <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
//         <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
//         <h2>No Orders Yet</h2>
//         <p>You haven't placed any orders yet.</p>
//         <Link to="/products" className="hero-btn" style={{ display: 'inline-block', marginTop: '1rem' }}>
//           Start Shopping
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <h1>My Orders</h1>
//       <p style={{ color: '#666', marginBottom: '2rem' }}>Track and manage your orders</p>

//       <div className="orders-list">
//         {orders.map(order => (
//           <div key={order._id} style={{
//             background: 'white',
//             borderRadius: '10px',
//             marginBottom: '1.5rem',
//             boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//             overflow: 'hidden'
//           }}>
//             <div style={{
//               padding: '1rem',
//               background: '#f8f9fa',
//               borderBottom: '1px solid #e0e0e0',
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               flexWrap: 'wrap',
//               gap: '0.5rem'
//             }}>
//               <div>
//                 <strong>Order #{order._id.slice(-8)}</strong>
//                 <span style={{ marginLeft: '1rem', color: '#666' }}>
//                   {new Date(order.createdAt).toLocaleDateString()}
//                 </span>
//               </div>
//               <div style={{ display: 'flex', gap: '0.5rem' }}>
//                 <span style={{
//                   padding: '0.25rem 0.75rem',
//                   borderRadius: '20px',
//                   fontSize: '0.85rem',
//                   fontWeight: 'bold',
//                   backgroundColor: getStatusColor(order.status),
//                   color: 'white'
//                 }}>
//                   {order.status.toUpperCase()}
//                 </span>
//                 <span style={{
//                   padding: '0.25rem 0.75rem',
//                   borderRadius: '20px',
//                   fontSize: '0.85rem',
//                   backgroundColor: getPaymentStatusColor(order.paymentStatus),
//                   color: 'white'
//                 }}>
//                   {order.paymentStatus.toUpperCase()}
//                 </span>
//               </div>
//             </div>

//             <div style={{ padding: '1rem' }}>
//               {order.orderItems.map((item, idx) => (
//                 <div key={idx} style={{
//                   display: 'flex',
//                   gap: '1rem',
//                   padding: '0.5rem 0',
//                   borderBottom: idx !== order.orderItems.length - 1 ? '1px solid #f0f0f0' : 'none'
//                 }}>
//                   <img 
//                     src={item.image} 
//                     alt={item.name} 
//                     style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
//                   />
//                   <div style={{ flex: 1 }}>
//                     <h4>{item.name}</h4>
//                     <p>Quantity: {item.quantity} × ${item.price}</p>
//                   </div>
//                   <div style={{ fontWeight: 'bold' }}>
//                     ${(item.price * item.quantity).toFixed(2)}
//                   </div>
//                 </div>
//               ))}

//               <div style={{
//                 marginTop: '1rem',
//                 paddingTop: '1rem',
//                 borderTop: '1px solid #e0e0e0',
//                 textAlign: 'right'
//               }}>
//                 <p><strong>Subtotal:</strong> ${order.itemsPrice?.toFixed(2)}</p>
//                 <p><strong>Shipping:</strong> ${order.shippingPrice?.toFixed(2)}</p>
//                 <p><strong>Tax:</strong> ${order.taxPrice?.toFixed(2)}</p>
//                 <h3 style={{ color: '#667eea', marginTop: '0.5rem' }}>
//                   Total: ${order.totalPrice?.toFixed(2)}
//                 </h3>
//               </div>
//             </div>

//             <div style={{ display: 'flex', borderTop: '1px solid #e0e0e0' }}>
//               <button
//                 onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
//                 style={{
//                   flex: 1,
//                   padding: '0.75rem',
//                   background: '#f8f9fa',
//                   border: 'none',
//                   cursor: 'pointer',
//                   color: '#667eea'
//                 }}
//               >
//                 {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
//               </button>
              
//               {(order.status === 'pending' || order.status === 'processing') && (
//                 <button
//                   onClick={() => cancelOrder(order._id)}
//                   style={{
//                     flex: 1,
//                     padding: '0.75rem',
//                     background: '#f8f9fa',
//                     border: 'none',
//                     borderLeft: '1px solid #e0e0e0',
//                     cursor: 'pointer',
//                     color: '#f44336'
//                   }}
//                 >
//                   Cancel Order
//                 </button>
//               )}
//             </div>

//             {selectedOrder === order._id && (
//               <div style={{ padding: '1rem', background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
//                 <h4>Shipping Address</h4>
//                 <p>{order.shippingAddress?.street}</p>
//                 <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
//                 <p>{order.shippingAddress?.country}</p>
//                 <h4 style={{ marginTop: '1rem' }}>Payment Method</h4>
//                 <p>{order.paymentMethod?.toUpperCase()}</p>
//                 {order.deliveredAt && (
//                   <>
//                     <h4 style={{ marginTop: '1rem' }}>Delivered On</h4>
//                     <p>{new Date(order.deliveredAt).toLocaleDateString()}</p>
//                   </>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default UserOrders;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const UserOrders = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
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
  };

  const cancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const response = await axios.put(
          `http://localhost:5000/api/orders/${orderId}/cancel`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          toast.success('Order cancelled successfully');
          fetchOrders();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel order');
      }
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <div className="empty-icon">📦</div>
        <h2>No Orders Yet</h2>
        <p>You haven't placed any orders yet.</p>
        <Link to="/products" className="shop-now-btn">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders</h1>
      <p className="orders-count">{orders.length} order(s) found</p>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <span className="order-id">Order #{order._id.slice(-8)}</span>
                <span className="order-date">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="order-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.toUpperCase()}
                </span>
                <span 
                  className="payment-badge"
                  style={{ 
                    backgroundColor: order.paymentStatus === 'paid' ? '#4caf50' : '#ff9800',
                    marginLeft: '8px'
                  }}
                >
                  {order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.orderItems.map((item, index) => (
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
                  <span><strong>${order.totalPrice?.toFixed(2)}</strong></span>
                </div>
              </div>
              
              <div className="order-actions">
                <button 
                  className="view-details-btn"
                  onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                >
                  {selectedOrder === order._id ? 'Hide Details' : 'View Details'}
                </button>
                {order.status === 'pending' && (
                  <button 
                    className="cancel-order-btn"
                    onClick={() => cancelOrder(order._id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>

            {selectedOrder === order._id && (
              <div className="order-details">
                <h3>Shipping Information</h3>
                <div className="shipping-address">
                  <p><strong>Address:</strong> {order.shippingAddress?.street}</p>
                  <p><strong>City:</strong> {order.shippingAddress?.city}</p>
                  <p><strong>State:</strong> {order.shippingAddress?.state}</p>
                  <p><strong>ZIP Code:</strong> {order.shippingAddress?.zipCode}</p>
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

      <style>{`
        .orders-container {
          max-width: 1200px;
          margin: 40px auto;
          padding: 0 20px;
        }
        
        .orders-container h1 {
          margin-bottom: 10px;
          color: #333;
        }
        
        .orders-count {
          color: #666;
          margin-bottom: 30px;
        }
        
        .order-card {
          background: white;
          border-radius: 12px;
          margin-bottom: 24px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          overflow: hidden;
        }
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8f9fa;
          border-bottom: 1px solid #e0e0e0;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .order-id {
          font-weight: bold;
          color: #333;
        }
        
        .order-date {
          color: #666;
          margin-left: 15px;
          font-size: 13px;
        }
        
        .status-badge, .payment-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          color: white;
        }
        
        .order-items {
          padding: 20px;
        }
        
        .order-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .order-item:last-child {
          border-bottom: none;
        }
        
        .order-item-image {
          width: 70px;
          height: 70px;
          object-fit: cover;
          border-radius: 8px;
        }
        
        .order-item-details {
          flex: 1;
        }
        
        .order-item-details h4 {
          margin-bottom: 4px;
          font-size: 15px;
        }
        
        .order-item-details p {
          color: #666;
          font-size: 13px;
          margin: 2px 0;
        }
        
        .order-item-total {
          font-weight: bold;
          color: #667eea;
        }
        
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .order-summary {
          text-align: right;
        }
        
        .summary-line {
          display: flex;
          justify-content: space-between;
          gap: 30px;
          margin: 4px 0;
        }
        
        .summary-line.total {
          font-size: 16px;
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid #ddd;
        }
        
        .order-actions {
          display: flex;
          gap: 10px;
        }
        
        .view-details-btn, .cancel-order-btn {
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 13px;
          transition: all 0.3s;
        }
        
        .view-details-btn {
          background: #667eea;
          color: white;
        }
        
        .cancel-order-btn {
          background: #f44336;
          color: white;
        }
        
        .view-details-btn:hover, .cancel-order-btn:hover {
          transform: translateY(-2px);
        }
        
        .order-details {
          padding: 20px;
          background: #f8f9fa;
          border-top: 1px solid #e0e0e0;
        }
        
        .order-details h3 {
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .shipping-address, .payment-info {
          margin-bottom: 20px;
          background: white;
          padding: 15px;
          border-radius: 8px;
        }
        
        .empty-orders {
          text-align: center;
          padding: 80px 20px;
        }
        
        .empty-icon {
          font-size: 64px;
          margin-bottom: 20px;
        }
        
        .shop-now-btn {
          display: inline-block;
          margin-top: 20px;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 30px;
        }
        
        .loading-container {
          text-align: center;
          padding: 80px;
        }
        
        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #f3f3f3;
          border-top: 3px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .order-footer {
            flex-direction: column;
            align-items: stretch;
          }
          
          .order-summary {
            text-align: left;
          }
          
          .order-actions {
            justify-content: flex-end;
          }
          
          .order-item {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
};

export default UserOrders;