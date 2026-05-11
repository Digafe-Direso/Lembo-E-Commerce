import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Recommendations from './Recommendations';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const heroRef = useRef(null);

  // Hero slides data
  const heroSlides = [
    {
      title: "Summer Sale Extravaganza",
      subtitle: "Up to 70% off on selected items",
      cta: "Shop Now",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
      color: "#667eea"
    },
    {
      title: "New Electronics Arrivals",
      subtitle: "Latest tech at unbeatable prices",
      cta: "Explore",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200",
      color: "#764ba2"
    },
    {
      title: "Fashion Week Deals",
      subtitle: "Trendy styles for every season",
      cta: "Shop Collection",
      image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1200",
      color: "#f093fb"
    }
  ];

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products');
      const allProducts = response.data.products || [];
      setFeaturedProducts(allProducts.filter(p => p.featured).slice(0, 4));
      setNewArrivals([...allProducts].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 4));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item._id === product._id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="modern-home">
      {/* Hero Section */}
      <div className="hero-section" ref={heroRef}>
        {heroSlides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide ${activeSlide === index ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="hero-overlay" style={{ background: `linear-gradient(135deg, ${slide.color}80, ${slide.color}40)` }}></div>
            <div className="hero-content">
              <h1 className="hero-title animate-fadeInUp">{slide.title}</h1>
              <p className="hero-subtitle animate-fadeInUp delay-1">{slide.subtitle}</p>
              <Link to="/products" className="hero-btn animate-fadeInUp delay-2">
                {slide.cta} → 
                <span className="btn-glow"></span>
              </Link>
            </div>
          </div>
        ))}
        <div className="hero-dots">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`hero-dot ${activeSlide === index ? 'active' : ''}`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="container">
         <div className="fas fa-container-storage" style={{ textAlign: "center" }}>
  <h1>WHY CHOOSE US?</h1>
</div>
          <div className="features-grid">
            <div className="feature-card glass">
              <div className="feature-icon">🚚</div>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
              <div className="feature-bg"></div>
            </div>
            <div className="feature-card glass">
              <div className="feature-icon">🛡️</div>
              <h3>Secure Payment</h3>
              <p>100% secure transactions</p>
              <div className="feature-bg"></div>
            </div>
            <div className="feature-card glass">
              <div className="feature-icon">🔄</div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
              <div className="feature-bg"></div>
            </div>
            <div className="feature-card glass">
              <div className="feature-icon">💬</div>
              <h3>24/7 Support</h3>
              <p>Customer service anytime</p>
              <div className="feature-bg"></div>
            </div>
          </div>
        </div>
        
      </div>
      {/* Featured Products */}
      <div className="featured-section">
        <div className="container">
          <div className="section-header">
            <div   >
              <h2 className="section-title">⭐ Featured <span className="gradient-text">Products</span></h2>
              <p className="section-subtitle">Hand-picked just for you</p>
            </div>
            <Link to="/products" className="view-all-btn">View All →</Link>
          </div>
          {loading ? (
            <div className="loading-skeleton">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product, idx) => (
                <div key={product._id} className="product-card glass" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div className="product-actions">
                      <button className="quick-view" onClick={() => window.location.href = `/product/${product._id}`}>
                        Quick View
                      </button>
                    </div>
                    {product.featured && <span className="featured-badge">⭐ Featured</span>}
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price-row">
                      <span className="product-price">${product.price}</span>
                      <button 
                        className="add-to-cart-icon"
                        onClick={() => addToCart(product)}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* New Arrivals */}
      <div className="new-arrivals-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">🆕 New <span className="gradient-text">Arrivals</span></h2>
              <p className="section-subtitle">Fresh products added recently</p>
            </div>
            <Link to="/products" className="view-all-btn">View All →</Link>
          </div>
          {loading ? (
            <div className="loading-skeleton">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton-card"></div>
              ))}
            </div>
          ) : (
            <div className="products-grid">
              {newArrivals.map((product, idx) => (
                <div key={product._id} className="product-card glass" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="product-image-wrapper">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <span className="new-badge">New</span>
                  </div>
                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <div className="product-price-row">
                      <span className="product-price">${product.price}</span>
                      <button 
                        className="add-to-cart-icon"
                        onClick={() => addToCart(product)}
                      >
                        🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      const { isAuthenticated } = useAuth();

{/* // Add this after your hero section */}
<div className="container">
  {isAuthenticated && (
    <Recommendations type="personalized" title="🎯 Recommended For You" limit={8} />
  )}
  <Recommendations type="popular" title="🔥 Popular Products" limit={8} />
</div>

      <style>{`
        .modern-home {
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          height: 85vh;
          min-height: 600px;
          overflow: hidden;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1s ease;
          z-index: 0;
        }

        .hero-slide.active {
          opacity: 1;
          z-index: 1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          color: white;
          padding: 0 20px;
        }

        .hero-title {
          font-size: 56px;
          font-weight: 800;
          margin-bottom: 20px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .hero-subtitle {
          font-size: 20px;
          margin-bottom: 30px;
          opacity: 0.95;
        }

        .hero-btn {
          position: relative;
          padding: 14px 40px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .hero-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .btn-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .hero-btn:hover .btn-glow {
          width: 200px;
          height: 200px;
        }

        .hero-dots {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 12px;
          z-index: 10;
        }

        .hero-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }

        .hero-dot.active {
          background: white;
          width: 30px;
          border-radius: 10px;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease forwards;
          opacity: 0;
        }

        .delay-1 { animation-delay: 0.2s; }
        .delay-2 { animation-delay: 0.4s; }

        /* Container */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 50px;
          flex-wrap: wrap;
          gap: 20px;
        }

        .section-title {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .gradient-text {
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .section-subtitle {
          color: #666;
          font-size: 16px;
        }

        .view-all-btn {
          padding: 10px 24px;
          background: white;
          color: #667eea;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 500;
          transition: all 0.3s;
          border: 1px solid #e0e0e0;
        }

        .view-all-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
          transform: translateX(5px);
        }

        /* Products */
        .featured-section, .new-arrivals-section {
          padding: 80px 0;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 30px;
        }

        .product-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s;
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
        }

        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.12);
        }

        .glass {
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
        }

        .product-image-wrapper {
          position: relative;
          padding-top: 100%;
          overflow: hidden;
        }

        .product-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s;
        }

        .product-card:hover .product-image {
          transform: scale(1.08);
        }

        .product-actions {
          position: absolute;
          bottom: -50px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          padding: 15px;
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
          transition: bottom 0.3s;
        }

        .product-card:hover .product-actions {
          bottom: 0;
        }

        .quick-view {
          padding: 8px 20px;
          background: white;
          border: none;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s;
        }

        .quick-view:hover {
          background: #667eea;
          color: white;
          transform: scale(1.05);
        }

        .featured-badge, .new-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: bold;
        }

        .featured-badge {
          background: linear-gradient(135deg, #ff9800, #ff5722);
          color: white;
        }

        .new-badge {
          background: linear-gradient(135deg, #4caf50, #45a049);
          color: white;
        }

        .product-info {
          padding: 18px;
        }

        .product-name {
          font-size: 16px;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .product-category {
          font-size: 12px;
          color: #999;
          margin-bottom: 10px;
        }

        .product-price-row {
          display: flex;
          justifyContent: space-between;
          align-items: center;
        }

        .product-price {
          font-size: 18px;
          font-weight: bold;
          color: #667eea;
        }

        .add-to-cart-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f0f0f0;
          border: none;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.3s;
        }

        .add-to-cart-icon:hover {
          background: #667eea;
          transform: scale(1.1);
        }

        /* Banner */
        .banner-section {
          margin: 40px 0;
          padding: 0 20px;
        }

        .banner-content {
          max-width: 1200px;
          margin: 0 auto;
          background: linear-gradient(135deg, #667eea20, #764ba220);
          border-radius: 40px;
          padding: 60px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 40px;
          position: relative;
          overflow: hidden;
        }

        .banner-text {
          flex: 1;
        }

        .banner-badge {
          display: inline-block;
          padding: 6px 16px;
          background: #ff9800;
          color: white;
          border-radius: 30px;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .banner-text h2 {
          font-size: 48px;
          margin-bottom: 15px;
        }

        .banner-text p {
          color: #666;
          margin-bottom: 25px;
        }

        .banner-btn {
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s;
          display: inline-block;
        }

        .banner-btn:hover {
          transform: translateX(5px);
          background: #5a67d8;
        }

        .floating-cards {
          display: flex;
          gap: 20px;
        }

        .float-card {
          width: 80px;
          height: 80px;
          background: white;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        .float-card:nth-child(2) { animation-delay: 0.5s; }
        .float-card:nth-child(3) { animation-delay: 1s; }

        /* Features */
        .features-section {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 30px;
        }

        .feature-card {
          text-align: center;
          padding: 40px 20px;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }

        .feature-card h3 {
          margin-bottom: 10px;
        }

        .feature-card p {
          color: #666;
        }

        .feature-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea10, #764ba210);
          z-index: -1;
          transition: transform 0.3s;
        }

        .loading-skeleton {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 30px;
        }

        .skeleton-card {
          height: 350px;
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: loading 1.5s infinite;
          border-radius: 20px;
        }

        @keyframes loading {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 32px;
          }
          
          .hero-subtitle {
            font-size: 16px;
          }
          
          .section-title {
            font-size: 28px;
          }
          
          .banner-text h2 {
            font-size: 32px;
          }
          
          .banner-content {
            padding: 40px;
            flex-direction: column;
            text-align: center;
          }
          
          .floating-cards {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;