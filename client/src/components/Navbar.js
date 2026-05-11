import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SmartSearch from './SmartSearch';
// import VoiceAssistant from './VoiceAssistant';
import AIChatbot from './AIChatbot';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    setCartCount(total);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    navbar: {
      background: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#667eea',
      textDecoration: 'none'
    },
    aiControls: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      flex: 1,
      maxWidth: '500px'
    },
    menu: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    link: {
      textDecoration: 'none',
      color: '#333',
      transition: 'color 0.3s'
    },
    cartBadge: {
      position: 'absolute',
      top: '-8px',
      right: '-12px',
      background: '#f44336',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '10px',
      fontWeight: 'bold'
    },
    logoutBtn: {
      background: '#f44336',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer'
    },
    signupBtn: {
      background: '#667eea',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      textDecoration: 'none'
    }
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>🛍️ E-Shop</Link>
        
        <div style={styles.aiControls}>
          <SmartSearch />
          {/* <VoiceAssistant /> */}
        </div>
        
        <div style={styles.menu}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/products" style={styles.link}>Products</Link>
          
          <Link to="/cart" style={{ ...styles.link, position: 'relative' }}>
            🛒 Cart
            {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
          </Link>
          
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <>
                  <Link to="/admin/dashboard" style={styles.link}>Dashboard</Link>
                  <Link to="/admin/products" style={styles.link}>Products</Link>
                </>
              )}
              
              {!isAdmin && (
                <>
                  <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                  <Link to="/my-orders" style={styles.link}>Orders</Link>
                </>
              )}
              
              <Link to="/profile" style={styles.link}>👤 {user?.name}</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/signup" style={styles.signupBtn}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
      
      <AIChatbot />
    </nav>
  );
};

export default Navbar;