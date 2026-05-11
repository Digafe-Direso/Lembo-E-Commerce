// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import toast from 'react-hot-toast';

// // const Cart = () => {
// //   const navigate = useNavigate();
// //   const { isAuthenticated } = useAuth();
// //   const [cartItems, setCartItems] = useState([]);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     loadCart();
// //     // Listen for cart updates
// //     window.addEventListener('cartUpdated', loadCart);
// //     return () => window.removeEventListener('cartUpdated', loadCart);
// //   }, []);

// //   const loadCart = () => {
// //     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
// //     console.log('Cart loaded:', cart);
// //     setCartItems(cart);
// //   };

// //   const updateQuantity = (productId, newQuantity) => {
// //     if (newQuantity < 1) return;
    
// //     const updatedCart = cartItems.map(item =>
// //       item._id === productId ? { ...item, quantity: newQuantity } : item
// //     );
    
// //     localStorage.setItem('cart', JSON.stringify(updatedCart));
// //     setCartItems(updatedCart);
// //     window.dispatchEvent(new Event('cartUpdated'));
// //     toast.success('Cart updated');
// //   };

// //   const removeItem = (productId) => {
// //     const updatedCart = cartItems.filter(item => item._id !== productId);
// //     localStorage.setItem('cart', JSON.stringify(updatedCart));
// //     setCartItems(updatedCart);
// //     window.dispatchEvent(new Event('cartUpdated'));
// //     toast.success('Item removed from cart');
// //   };

// //   const clearCart = () => {
// //     if (window.confirm('Are you sure you want to clear your cart?')) {
// //       localStorage.setItem('cart', '[]');
// //       setCartItems([]);
// //       window.dispatchEvent(new Event('cartUpdated'));
// //       toast.success('Cart cleared');
// //     }
// //   };

// //   const getTotalPrice = () => {
// //     return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
// //   };

// //   const getTotalItems = () => {
// //     return cartItems.reduce((total, item) => total + item.quantity, 0);
// //   };

// //   const handleCheckout = () => {
// //     if (!isAuthenticated) {
// //       toast.error('Please login to proceed to checkout');
// //       navigate('/login');
// //     } else {
// //       navigate('/checkout');
// //     }
// //   };

// //   if (cartItems.length === 0) {
// //     return (
// //       <div className="container" style={{ 
// //         textAlign: 'center', 
// //         padding: '4rem',
// //         minHeight: '60vh',
// //         display: 'flex',
// //         flexDirection: 'column',
// //         alignItems: 'center',
// //         justifyContent: 'center'
// //       }}>
// //         <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
// //         <h2>Your cart is empty</h2>
// //         <p style={{ marginBottom: '1.5rem', color: '#666' }}>Add some products to your cart!</p>
// //         <Link to="/products" className="hero-btn" style={{ display: 'inline-block' }}>
// //           Continue Shopping
// //         </Link>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="container" style={{ padding: '2rem' }}>
// //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
// //         <h1>Shopping Cart ({getTotalItems()} items)</h1>
// //         <button 
// //           onClick={clearCart}
// //           style={{
// //             padding: '0.5rem 1rem',
// //             background: '#f44336',
// //             color: 'white',
// //             border: 'none',
// //             borderRadius: '5px',
// //             cursor: 'pointer'
// //           }}
// //         >
// //           Clear Cart
// //         </button>
// //       </div>
      
// //       <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
// //         {/* Cart Items */}
// //         <div>
// //           {cartItems.map((item) => (
// //             <div key={item._id} style={{ 
// //               display: 'flex', 
// //               gap: '1rem', 
// //               padding: '1rem', 
// //               borderBottom: '1px solid #e0e0e0', 
// //               alignItems: 'center',
// //               background: 'white',
// //               borderRadius: '8px',
// //               marginBottom: '0.5rem'
// //             }}>
// //               <img 
// //                 src={item.image || 'https://via.placeholder.com/100'} 
// //                 alt={item.name} 
// //                 style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} 
// //               />
// //               <div style={{ flex: 1 }}>
// //                 <h3 style={{ marginBottom: '0.5rem' }}>{item.name}</h3>
// //                 <p style={{ color: '#666', marginBottom: '0.5rem' }}>{item.category}</p>
// //                 <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea' }}>${item.price}</p>
// //               </div>
// //               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
// //                 <button 
// //                   onClick={() => updateQuantity(item._id, item.quantity - 1)} 
// //                   style={{ 
// //                     padding: '0.5rem 0.75rem', 
// //                     cursor: 'pointer',
// //                     background: '#f0f0f0',
// //                     border: 'none',
// //                     borderRadius: '5px',
// //                     fontSize: '1rem'
// //                   }}
// //                 >
// //                   -
// //                 </button>
// //                 <span style={{ width: '40px', textAlign: 'center', fontSize: '1.1rem' }}>{item.quantity}</span>
// //                 <button 
// //                   onClick={() => updateQuantity(item._id, item.quantity + 1)} 
// //                   style={{ 
// //                     padding: '0.5rem 0.75rem', 
// //                     cursor: 'pointer',
// //                     background: '#f0f0f0',
// //                     border: 'none',
// //                     borderRadius: '5px',
// //                     fontSize: '1rem'
// //                   }}
// //                 >
// //                   +
// //                 </button>
// //               </div>
// //               <div style={{ fontWeight: 'bold', fontSize: '1.1rem', minWidth: '100px', textAlign: 'right' }}>
// //                 ${(item.price * item.quantity).toFixed(2)}
// //               </div>
// //               <button 
// //                 onClick={() => removeItem(item._id)} 
// //                 style={{ 
// //                   background: 'none', 
// //                   border: 'none', 
// //                   fontSize: '1.2rem', 
// //                   cursor: 'pointer', 
// //                   color: '#f44336',
// //                   padding: '0.5rem'
// //                 }}
// //               >
// //                 🗑️
// //               </button>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Order Summary */}
// //         <div style={{ 
// //           background: '#f8f9fa', 
// //           padding: '1.5rem', 
// //           borderRadius: '10px', 
// //           height: 'fit-content', 
// //           position: 'sticky', 
// //           top: '100px' 
// //         }}>
// //           <h3 style={{ marginBottom: '1rem' }}>Order Summary</h3>
          
// //           <div style={{ margin: '1rem 0' }}>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
// //               <span>Subtotal ({getTotalItems()} items):</span>
// //               <span>${getTotalPrice().toFixed(2)}</span>
// //             </div>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
// //               <span>Shipping:</span>
// //               <span>{getTotalPrice() > 100 ? 'Free' : '$10.00'}</span>
// //             </div>
// //             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
// //               <span>Tax (10%):</span>
// //               <span>${(getTotalPrice() * 0.1).toFixed(2)}</span>
// //             </div>
// //             <div style={{ borderTop: '2px solid #ddd', margin: '1rem 0', paddingTop: '1rem' }}>
// //               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
// //                 <span>Total:</span>
// //                 <span style={{ color: '#667eea' }}>
// //                   ${(getTotalPrice() + (getTotalPrice() > 100 ? 0 : 10) + (getTotalPrice() * 0.1)).toFixed(2)}
// //                 </span>
// //               </div>
// //             </div>
// //           </div>
          
// //           <button 
// //             onClick={handleCheckout} 
// //             className="auth-btn" 
// //             style={{ 
// //               width: '100%', 
// //               textAlign: 'center',
// //               padding: '1rem',
// //               fontSize: '1.1rem'
// //             }}
// //           >
// //             Proceed to Checkout
// //           </button>
          
// //           <Link 
// //             to="/products" 
// //             style={{ 
// //               display: 'block', 
// //               textAlign: 'center', 
// //               marginTop: '1rem', 
// //               color: '#667eea', 
// //               textDecoration: 'none' 
// //             }}
// //           >
// //             Continue Shopping
// //           </Link>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Cart;
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     loadCart();
//   }, []);

//   const loadCart = () => {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     setCartItems(cart);
//   };

//   const updateQuantity = (id, newQty) => {
//     if (newQty < 1) return;
//     const updated = cartItems.map(item => item._id === id ? { ...item, quantity: newQty } : item);
//     localStorage.setItem('cart', JSON.stringify(updated));
//     setCartItems(updated);
//     window.dispatchEvent(new Event('cartUpdated'));
//   };

//   const removeItem = (id) => {
//     const updated = cartItems.filter(item => item._id !== id);
//     localStorage.setItem('cart', JSON.stringify(updated));
//     setCartItems(updated);
//     window.dispatchEvent(new Event('cartUpdated'));
//     toast.success('Item removed');
//   };

//   const getTotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

//   if (cartItems.length === 0) {
//     return (
//       <div className="container empty-cart">
//         <h2>Your cart is empty</h2>
//         <Link to="/products">Continue Shopping</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <h1>Shopping Cart</h1>
//       <div className="cart-grid">
//         <div className="cart-items">
//           {cartItems.map(item => (
//             <div key={item._id} className="cart-item">
//               <img src={item.image} alt={item.name} />
//               <div><h3>{item.name}</h3><p>${item.price}</p></div>
//               <div className="cart-quantity">
//                 <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
//                 <span>{item.quantity}</span>
//                 <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
//               </div>
//               <div>${(item.price * item.quantity).toFixed(2)}</div>
//               <button onClick={() => removeItem(item._id)}>🗑️</button>
//             </div>
//           ))}
//         </div>
//         <div className="cart-summary">
//           <h3>Order Summary</h3>
//           <p>Total: <strong>${getTotal().toFixed(2)}</strong></p>
//           <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const product = cartItems.find(item => item._id === productId);
    if (newQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Cart updated');
  };

  const removeItem = (productId) => {
    const updatedCart = cartItems.filter(item => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your entire cart?')) {
      localStorage.setItem('cart', '[]');
      setCartItems([]);
      window.dispatchEvent(new Event('cartUpdated'));
      toast.success('Cart cleared');
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    if (subtotal === 0) return 0;
    return subtotal > 100 ? 0 : 10;
  };

  const getTax = () => {
    return getSubtotal() * 0.1;
  };

  const getDiscountAmount = () => {
    return (getSubtotal() * discount) / 100;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping() + getTax() - getDiscountAmount();
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'SAVE10') {
      setDiscount(10);
      toast.success('Coupon applied! 10% discount');
    } else if (couponCode.toUpperCase() === 'SAVE20') {
      setDiscount(20);
      toast.success('Coupon applied! 20% discount');
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      toast.success('Free shipping coupon applied!');
    } else {
      toast.error('Invalid coupon code');
    }
    setCouponCode('');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 20px',
        textAlign: 'center',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 2px 20px rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.5 }}>🛒</div>
        <h2 style={{ marginBottom: '10px', color: '#333' }}>Your cart is empty</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Looks like you haven't added any items to your cart yet.</p>
        <Link to="/products" style={{
          display: 'inline-block',
          padding: '12px 30px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '30px',
          fontWeight: '500',
          transition: 'all 0.3s'
        }}>
          🛍️ Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px', minHeight: '70vh' }}>
      <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 2px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '25px 30px',
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: 'white'
        }}>
          <h1 style={{ fontSize: '24px', margin: 0 }}>Shopping Cart</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ background: 'rgba(255,255,255,0.2)', padding: '6px 14px', borderRadius: '30px', fontSize: '14px' }}>
              {getTotalItems()} items
            </span>
            <button onClick={clearCart} style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              color: 'white',
              padding: '6px 14px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}>Clear Cart</button>
          </div>
        </div>

        {/* Cart Content */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '30px', padding: '30px' }}>
          
          {/* Cart Items Section */}
          <div>
            {/* Header Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '3fr 1fr 1.5fr 1fr 0.5fr',
              gap: '15px',
              padding: '12px 0',
              borderBottom: '2px solid #f0f0f0',
              color: '#666',
              fontSize: '13px',
              fontWeight: '500',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              <div style={{ textAlign: 'left' }}>Product</div>
              <div style={{ textAlign: 'center' }}>Price</div>
              <div style={{ textAlign: 'center' }}>Quantity</div>
              <div style={{ textAlign: 'center' }}>Total</div>
              <div style={{ textAlign: 'center' }}></div>
            </div>

            {/* Cart Items List */}
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {cartItems.map((item) => (
                <div key={item._id} style={{
                  display: 'grid',
                  gridTemplateColumns: '3fr 1fr 1.5fr 1fr 0.5fr',
                  gap: '15px',
                  alignItems: 'center',
                  padding: '20px 0',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'background 0.3s'
                }}>
                  {/* Product Info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src={item.image} alt={item.name} style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      background: '#f8f9fa'
                    }} />
                    <div>
                      <h3 style={{ fontSize: '15px', marginBottom: '4px', color: '#333' }}>{item.name}</h3>
                      <p style={{ fontSize: '12px', color: '#999', marginBottom: '6px' }}>{item.category}</p>
                      <div>
                        {item.stock > 10 ? (
                          <span style={{ color: '#4caf50', fontSize: '11px', fontWeight: '500' }}>✓ In Stock</span>
                        ) : item.stock > 0 ? (
                          <span style={{ color: '#ff9800', fontSize: '11px', fontWeight: '500' }}>⚠️ Only {item.stock} left</span>
                        ) : (
                          <span style={{ color: '#f44336', fontSize: '11px', fontWeight: '500' }}>✗ Out of Stock</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div style={{ textAlign: 'center', fontWeight: '500', color: '#333' }}>
                    ${item.price.toFixed(2)}
                  </div>
                  
                  {/* Quantity */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1} style={{
                        width: '32px',
                        height: '32px',
                        border: '1px solid #e0e0e0',
                        background: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'all 0.3s',
                        opacity: item.quantity <= 1 ? 0.5 : 1
                      }}>−</button>
                      <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '500' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock} style={{
                        width: '32px',
                        height: '32px',
                        border: '1px solid #e0e0e0',
                        background: 'white',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        transition: 'all 0.3s',
                        opacity: item.quantity >= item.stock ? 0.5 : 1
                      }}>+</button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div style={{ textAlign: 'center', fontWeight: '600', color: '#667eea' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  
                  {/* Remove Button */}
                  <div style={{ textAlign: 'center' }}>
                    <button onClick={() => removeItem(item._id)} style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '18px',
                      opacity: 0.6,
                      transition: 'all 0.3s'
                    }}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: '#f8f9fa',
            borderRadius: '16px',
            padding: '24px',
            position: 'sticky',
            top: '20px',
            height: 'fit-content'
          }}>
            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#333' }}>Order Summary</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#666' }}>
                <span>Subtotal ({getTotalItems()} items)</span>
                <span>${getSubtotal().toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#666' }}>
                <span>Shipping</span>
                <span>{getShipping() === 0 ? 'Free' : `$${getShipping().toFixed(2)}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#666' }}>
                <span>Tax (10%)</span>
                <span>${getTax().toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', color: '#4caf50' }}>
                  <span>Discount ({discount}%)</span>
                  <span>-${getDiscountAmount().toFixed(2)}</span>
                </div>
              )}
              <div style={{ height: '1px', background: '#e0e0e0', margin: '12px 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: '#333', paddingTop: '12px' }}>
                <span>Total</span>
                <span style={{ color: '#667eea' }}>${getTotal().toFixed(2)}</span>
              </div>
            </div>

            {/* Coupon Code */}
            <div style={{ margin: '20px 0', paddingTop: '20px', borderTop: '1px solid #e0e0e0' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '12px', color: '#333' }}>Coupon Code</h4>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '10px 15px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <button onClick={applyCoupon} style={{
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}>Apply</button>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: '#999', marginBottom: '8px' }}>Available coupons:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span onClick={() => setCouponCode('SAVE10')} style={{
                    padding: '4px 12px',
                    background: '#e8eefe',
                    color: '#667eea',
                    borderRadius: '20px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}>SAVE10</span>
                  <span onClick={() => setCouponCode('SAVE20')} style={{
                    padding: '4px 12px',
                    background: '#e8eefe',
                    color: '#667eea',
                    borderRadius: '20px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}>SAVE20</span>
                  <span onClick={() => setCouponCode('FREESHIP')} style={{
                    padding: '4px 12px',
                    background: '#e8eefe',
                    color: '#667eea',
                    borderRadius: '20px',
                    fontSize: '11px',
                    cursor: 'pointer'
                  }}>FREESHIP</span>
                </div>
              </div>
            </div>

            <button onClick={handleCheckout} style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              marginBottom: '12px'
            }}>
              Proceed to Checkout →
            </button>
            
            <Link to="/products" style={{
              display: 'block',
              textAlign: 'center',
              color: '#666',
              textDecoration: 'none',
              fontSize: '13px'
            }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;