// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { useAuth } from '../context/AuthContext';
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
// import toast from 'react-hot-toast';
// import StripePayment from './StripePayment';

// const Checkout = () => {
//   const navigate = useNavigate();
//   const { token, user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [cartItems, setCartItems] = useState([]);
//   const [paymentMethod, setPaymentMethod] = useState('cod');
//   const [createdOrder, setCreatedOrder] = useState(null);
//   const [stripePromise, setStripePromise] = useState(null);
//   const [shippingAddress, setShippingAddress] = useState({
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: ''
//   });

//   useEffect(() => {
//     loadCart();
//     loadUserAddress();
//     initStripe();
//   }, []);

//   const initStripe = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/payments/config');
//       if (response.data.publishableKey && response.data.isConfigured) {
//         const stripe = await loadStripe(response.data.publishableKey);
//         setStripePromise(stripe);
//       }
//     } catch (error) {
//       console.error('Stripe init error:', error);
//     }
//   };

//   const loadCart = () => {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     if (cart.length === 0) {
//       toast.error('Your cart is empty');
//       navigate('/cart');
//     }
//     setCartItems(cart);
//   };

//   const loadUserAddress = () => {
//     if (user?.address) {
//       setShippingAddress({
//         street: user.address.street || '',
//         city: user.address.city || '',
//         state: user.address.state || '',
//         zipCode: user.address.zipCode || '',
//         country: user.address.country || ''
//       });
//     }
//   };

//   const getSubtotal = () => {
//     return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//   };

//   const getShipping = () => {
//     const subtotal = getSubtotal();
//     return subtotal > 100 ? 0 : 10;
//   };

//   const getTax = () => {
//     return getSubtotal() * 0.1;
//   };

//   const getTotal = () => {
//     return getSubtotal() + getShipping() + getTax();
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setShippingAddress(prev => ({ ...prev, [name]: value }));
//   };

//   const createOrder = async () => {
//     if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
//       toast.error('Please fill all shipping address fields');
//       return null;
//     }
    
//     if (cartItems.length === 0) {
//       toast.error('Your cart is empty');
//       return null;
//     }
    
//     setLoading(true);
    
//     const orderItems = cartItems.map(item => ({
//       product: item._id,
//       name: item.name,
//       price: item.price,
//       quantity: item.quantity,
//       image: item.image
//     }));
    
//     const orderData = {
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice: getSubtotal(),
//       taxPrice: getTax(),
//       shippingPrice: getShipping(),
//       totalPrice: getTotal()
//     };
    
//     try {
//       const response = await axios.post('http://localhost:5000/api/orders', orderData, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       if (response.data.success) {
//         return response.data.order;
//       }
//       return null;
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to create order');
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePlaceOrder = async () => {
//     const order = await createOrder();
//     if (order) {
//       if (paymentMethod === 'cod') {
//         localStorage.removeItem('cart');
//         window.dispatchEvent(new Event('cartUpdated'));
//         toast.success('Order placed successfully!');
//         navigate('/my-orders');
//       } else {
//         setCreatedOrder(order);
//         toast.success('Order created! Please complete payment.');
//       }
//     }
//   };

//   const handlePaymentSuccess = () => {
//     localStorage.removeItem('cart');
//     window.dispatchEvent(new Event('cartUpdated'));
//     navigate('/my-orders');
//   };

//   const handlePaymentError = (error) => {
//     toast.error(error || 'Payment failed. Please try again.');
//   };

//   if (cartItems.length === 0) return null;

//   if (createdOrder && paymentMethod === 'card' && stripePromise) {
//     return (
//       <div className="container" style={{ padding: '40px 20px' }}>
//         <h1>Complete Payment</h1>
//         <div style={{ maxWidth: '500px', margin: '40px auto' }}>
//           <Elements stripe={stripePromise}>
//             <StripePayment
//               orderId={createdOrder._id}
//               amount={createdOrder.totalPrice}
//               onSuccess={handlePaymentSuccess}
//               onError={handlePaymentError}
//             />
//           </Elements>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container" style={{ padding: '40px 20px' }}>
//       <h1>Checkout</h1>
      
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', marginTop: '30px' }}>
//         {/* Left Column */}
//         <div>
//           {/* Shipping Address */}
//           <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
//             <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>
            
//             <div className="form-group" style={{ marginBottom: '15px' }}>
//               <label>Street Address *</label>
//               <input type="text" name="street" value={shippingAddress.street} onChange={handleInputChange} required />
//             </div>
            
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
//               <div className="form-group">
//                 <label>City *</label>
//                 <input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} required />
//               </div>
//               <div className="form-group">
//                 <label>State</label>
//                 <input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} />
//               </div>
//             </div>
            
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
//               <div className="form-group">
//                 <label>ZIP Code *</label>
//                 <input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleInputChange} required />
//               </div>
//               <div className="form-group">
//                 <label>Country *</label>
//                 <input type="text" name="country" value={shippingAddress.country} onChange={handleInputChange} required />
//               </div>
//             </div>
//           </div>
          
//           {/* Payment Method */}
//           <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px' }}>
//             <h2 style={{ marginBottom: '20px' }}>Payment Method</h2>
            
//             <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' }}>
//               <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
//               <span>💵 Cash on Delivery (Pay when you receive)</span>
//             </label>
            
//             <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>
//               <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
//               <span>💳 Credit/Debit Card (Pay now with Stripe)</span>
//             </label>
            
//             {paymentMethod === 'card' && (
//               <div style={{ marginTop: '15px', padding: '12px', background: '#e3f2fd', borderRadius: '8px', fontSize: '13px' }}>
//                 💳 You'll pay securely using Stripe. Test Card: 4242 4242 4242 4242
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Order Summary */}
//         <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px', height: 'fit-content' }}>
//           <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
          
//           {cartItems.map((item, idx) => (
//             <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #e0e0e0' }}>
//               <span>{item.name} x{item.quantity}</span>
//               <span>${(item.price * item.quantity).toFixed(2)}</span>
//             </div>
//           ))}
          
//           <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//               <span>Subtotal:</span> <span>${getSubtotal().toFixed(2)}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//               <span>Shipping:</span> <span>{getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}</span>
//             </div>
//             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
//               <span>Tax (10%):</span> <span>${getTax().toFixed(2)}</span>
//             </div>
//             <div style={{ borderTop: '2px solid #667eea', marginTop: '12px', paddingTop: '12px' }}>
//               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
//                 <span>Total:</span> <span style={{ color: '#667eea' }}>${getTotal().toFixed(2)}</span>
//               </div>
//             </div>
//           </div>
          
//           <button onClick={handlePlaceOrder} disabled={loading} className="auth-btn" style={{ marginTop: '20px', width: '100%' }}>
//             {loading ? 'Processing...' : (paymentMethod === 'card' ? 'Proceed to Payment' : 'Place Order')}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Checkout;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import StripePayment from './StripePayment';

const Checkout = () => {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [createdOrder, setCreatedOrder] = useState(null);
  const [stripePromise, setStripePromise] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  useEffect(() => {
    loadCart();
    loadUserAddress();
    initStripe();
  }, []);

  const initStripe = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/payments/config');
      if (response.data.publishableKey && response.data.isConfigured) {
        const stripe = await loadStripe(response.data.publishableKey);
        setStripePromise(stripe);
        console.log('✅ Stripe initialized');
      }
    } catch (error) {
      console.error('Stripe init error:', error);
    }
  };

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
    setCartItems(cart);
  };

  const loadUserAddress = () => {
    if (user?.address) {
      setShippingAddress({
        street: user.address.street || '',
        city: user.address.city || '',
        state: user.address.state || '',
        zipCode: user.address.zipCode || '',
        country: user.address.country || ''
      });
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    return subtotal > 100 ? 0 : 10;
  };

  const getTax = () => {
    return getSubtotal() * 0.1;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping() + getTax();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const createOrder = async () => {
    if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.zipCode) {
      toast.error('Please fill in all shipping address fields');
      return null;
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return null;
    }
    
    setLoading(true);
    
    const orderItems = cartItems.map(item => ({
      product: item._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));
    
    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: getSubtotal(),
      taxPrice: getTax(),
      shippingPrice: getShipping(),
      totalPrice: getTotal()
    };
    
    try {
      const response = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        return response.data.order;
      }
      return null;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create order');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    const order = await createOrder();
    
    if (order) {
      if (paymentMethod === 'cod') {
        localStorage.removeItem('cart');
        window.dispatchEvent(new Event('cartUpdated'));
        toast.success('Order placed successfully!');
        navigate('/my-orders');
      } else {
        setCreatedOrder(order);
        toast.success('Order created! Please complete payment.');
      }
    }
  };

  const handlePaymentSuccess = () => {
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    navigate('/my-orders');
  };

  const handlePaymentError = (error) => {
    toast.error(error || 'Payment failed. Please try again.');
  };

  if (cartItems.length === 0) {
    return null;
  }

  if (createdOrder && paymentMethod === 'card' && stripePromise) {
    return (
      <div className="container" style={{ padding: '40px 20px' }}>
        <h1>Complete Payment</h1>
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
          <Elements stripe={stripePromise}>
            <StripePayment
              orderId={createdOrder._id}
              amount={createdOrder.totalPrice}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px' }}>
      <h1>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '40px' }}>
        {/* Left Column */}
        <div>
          <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
            <h2 style={{ marginBottom: '20px' }}>Shipping Address</h2>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label>Street Address *</label>
              <input type="text" name="street" value={shippingAddress.street} onChange={handleInputChange} required />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group"><label>City *</label><input type="text" name="city" value={shippingAddress.city} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>State</label><input type="text" name="state" value={shippingAddress.state} onChange={handleInputChange} /></div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group"><label>ZIP Code *</label><input type="text" name="zipCode" value={shippingAddress.zipCode} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Country *</label><input type="text" name="country" value={shippingAddress.country} onChange={handleInputChange} required /></div>
            </div>
          </div>
          
          <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px' }}>
            <h2 style={{ marginBottom: '20px' }}>Payment Method</h2>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', borderRadius: '8px', marginBottom: '12px', cursor: 'pointer' }}>
              <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>💵 Cash on Delivery (Pay when you receive)</span>
            </label>
            
            <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'white', borderRadius: '8px', cursor: 'pointer' }}>
              <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} />
              <span>💳 Credit/Debit Card (Pay now with Stripe)</span>
            </label>
            
            {paymentMethod === 'card' && (
              <div style={{ marginTop: '15px', padding: '12px', background: '#e3f2fd', borderRadius: '8px', fontSize: '13px' }}>
                💳 You'll pay securely using Stripe. Your card information is encrypted and secure.<br />
                <strong>Test Card:</strong> 4242 4242 4242 4242 (any future expiry, any CVC)
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div style={{ background: '#f8f9fa', padding: '24px', borderRadius: '12px', height: 'fit-content' }}>
          <h2 style={{ marginBottom: '20px' }}>Order Summary</h2>
          
          {cartItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #e0e0e0' }}>
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Subtotal:</span> <span>${getSubtotal().toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Shipping:</span> <span>{getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>Tax (10%):</span> <span>${getTax().toFixed(2)}</span>
            </div>
            <div style={{ borderTop: '2px solid #667eea', marginTop: '12px', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold' }}>
                <span>Total:</span> <span style={{ color: '#667eea' }}>${getTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <button onClick={handlePlaceOrder} disabled={loading} className="auth-btn" style={{ marginTop: '20px', width: '100%' }}>
            {loading ? 'Processing...' : (paymentMethod === 'card' ? 'Proceed to Payment' : 'Place Order')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;