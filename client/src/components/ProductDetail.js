// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// const ProductDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     fetchProduct();
//   }, [id]);

//   const fetchProduct = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/products/${id}`);
//       setProduct(response.data.product);
//     } catch (error) {
//       toast.error('Product not found');
//       navigate('/products');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const addToCart = () => {
//     const cart = JSON.parse(localStorage.getItem('cart') || '[]');
//     const existingItem = cart.find(item => item._id === product._id);
    
//     if (existingItem) {
//       existingItem.quantity += quantity;
//       toast.success(`Added ${quantity} more ${product.name} to cart`);
//     } else {
//       cart.push({ 
//         _id: product._id,
//         name: product.name,
//         price: product.price,
//         image: product.image,
//         category: product.category,
//         stock: product.stock,
//         quantity: quantity 
//       });
//       toast.success(`${quantity} x ${product.name} added to cart`);
//     }
    
//     localStorage.setItem('cart', JSON.stringify(cart));
//     window.dispatchEvent(new Event('cartUpdated'));
//   };

//   if (loading) {
//     return <div className="loading">Loading product details...</div>;
//   }
//   if (!product) {
//     return (
//       <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
//         <h2>Product Not Found</h2>
//         <Link to="/products">Back to Products</Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container">
//       <Link to="/products" style={{ display: 'inline-block', marginBottom: '2rem', color: '#667eea' }}>
//         ← Back to Products
//       </Link>
      
//       <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
//         <div>
//           <img src={product.image} alt={product.name} style={{ width: '100%', borderRadius: '10px' }} />
//         </div>
        
//         <div>
//           <h1>{product.name}</h1>
//           <p style={{ color: '#667eea', marginBottom: '1rem' }}>{product.category}</p>
//           <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>${product.price}</p>
//           <p style={{ margin: '1rem 0', lineHeight: '1.6' }}>{product.description}</p>
//           <p>Stock: {product.stock} units</p>
          
//           <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '2rem' }}>
//             <select 
//               value={quantity} 
//               onChange={(e) => setQuantity(Number(e.target.value))}
//               style={{ padding: '0.5rem', borderRadius: '5px' }}
//             >
//               {[...Array(Math.min(product.stock, 10))].map((_, i) => (
//                 <option key={i + 1} value={i + 1}>{i + 1}</option>
//               ))}
//             </select>
//             <button 
//               onClick={addToCart} 
//               className="add-to-cart-btn"
//               style={{ padding: '0.75rem 2rem', width: 'auto' }}
//             >
//               Add to Cart 🛒
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    if (product && isAuthenticated) {
      trackProductView();
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data.product);
      
      // Fetch related products from same category
      if (response.data.product) {
        fetchRelatedProducts(response.data.product.category);
      }
    } catch (error) {
      toast.error('Product not found');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products?category=${category}&limit=4`);
      if (response.data.success) {
        const filtered = response.data.products.filter(p => p._id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (error) {
      console.error('Fetch related error:', error);
    }
  };

  const trackProductView = async () => {
    try {
      await axios.post('http://localhost:5000/api/ml/track-behavior', {
        productId: id,
        action: 'view',
        timeSpent: 0
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Track view error:', error);
    }
  };

  const trackAddToCart = async () => {
    if (isAuthenticated) {
      try {
        await axios.post('http://localhost:5000/api/ml/track-behavior', {
          productId: id,
          action: 'click'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Track add to cart error:', error);
      }
    }
  };

  const addToCart = () => {
    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    if (quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    
    setAddingToCart(true);
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
      toast.success(`Added ${quantity} more ${product.name} to cart`);
    } else {
      cart.push({ 
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        stock: product.stock,
        quantity: quantity 
      });
      toast.success(`${quantity} x ${product.name} added to cart`);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    trackAddToCart();
    
    setTimeout(() => setAddingToCart(false), 500);
  };

  const buyNow = () => {
    addToCart();
    setTimeout(() => {
      navigate('/checkout');
    }, 500);
  };

  // Track recently viewed
  useEffect(() => {
    if (product) {
      let recent = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      recent = [id, ...recent.filter(pid => pid !== id)].slice(0, 10);
      localStorage.setItem('recentlyViewed', JSON.stringify(recent));
    }
  }, [product, id]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Product Not Found</h2>
        <Link to="/products" className="back-btn">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span> / </span>
          <Link to="/products">Products</Link>
          <span> / </span>
          <span className="current">{product.name}</span>
        </div>

        {/* Product Main Info */}
        <div className="product-detail-content">
          {/* Product Image Section */}
          <div className="product-images">
            <div className="main-image">
              <img src={product.image || 'https://via.placeholder.com/500'} alt={product.name} />
              {product.featured && <span className="featured-badge">⭐ Featured</span>}
              {product.stock === 0 && <span className="stock-badge out">Out of Stock</span>}
              {product.stock > 0 && product.stock < 10 && (
                <span className="stock-badge low">Only {product.stock} left!</span>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-category">{product.category}</p>
            
            <div className="product-rating">
              <div className="stars">
                {'★'.repeat(Math.floor(product.ratings || 0))}
                {'☆'.repeat(5 - Math.floor(product.ratings || 0))}
              </div>
              <span className="rating-count">({product.numReviews || 0} reviews)</span>
            </div>
            
            <div className="product-price-section">
              <span className="current-price">${(product.price || 0).toFixed(2)}</span>
              {product.oldPrice && (
                <span className="old-price">${product.oldPrice}</span>
              )}
            </div>
            
            <div className="product-stock-info">
              {product.stock > 0 ? (
                <span className="in-stock">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="out-stock">✗ Out of Stock</span>
              )}
            </div>
            
            <div className="product-description">
              <div className="tabs">
                <button 
                  className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                  onClick={() => setActiveTab('description')}
                >
                  Description
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                  onClick={() => setActiveTab('details')}
                >
                  Product Details
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                  onClick={() => setActiveTab('shipping')}
                >
                  Shipping Info
                </button>
              </div>
              
              <div className="tab-content">
                {activeTab === 'description' && (
                  <p>{product.description}</p>
                )}
                {activeTab === 'details' && (
                  <ul>
                    <li><strong>Category:</strong> {product.category}</li>
                    <li><strong>Product ID:</strong> {product._id.slice(-8)}</li>
                    <li><strong>Added:</strong> {new Date(product.createdAt).toLocaleDateString()}</li>
                    <li><strong>Rating:</strong> {product.ratings || 0} / 5</li>
                    <li><strong>Reviews:</strong> {product.numReviews || 0}</li>
                  </ul>
                )}
                {activeTab === 'shipping' && (
                  <ul>
                    <li>🚚 Free shipping on orders over $50</li>
                    <li>📦 Estimated delivery: 3-5 business days</li>
                    <li>🔄 30-day easy returns</li>
                    <li>📞 24/7 customer support</li>
                    <li>🌍 International shipping available</li>
                  </ul>
                )}
              </div>
            </div>
            
            {product.stock > 0 && (
              <div className="product-actions">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-controls">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                  <span className="max-qty">Max {product.stock}</span>
                </div>
                
                <div className="action-buttons">
                  <button 
                    onClick={addToCart} 
                    className="add-to-cart-btn"
                    disabled={addingToCart}
                  >
                    {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
                  </button>
                  <button onClick={buyNow} className="buy-now-btn">
                    ⚡ Buy Now
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="delivery-info">
              <div className="delivery-item">
                <span>🚚</span>
                <div>
                  <strong>Free Shipping</strong>
                  <p>On orders over $50</p>
                </div>
              </div>
              <div className="delivery-item">
                <span>🔄</span>
                <div>
                  <strong>30-Day Returns</strong>
                  <p>Easy & hassle-free</p>
                </div>
              </div>
              <div className="delivery-item">
                <span>🛡️</span>
                <div>
                  <strong>Secure Checkout</strong>
                  <p>100% secure payments</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h3>🔍 You May Also Like</h3>
            <div className="related-products-grid">
              {relatedProducts.map(related => (
                <Link to={`/product/${related._id}`} key={related._id} className="related-card">
                  <img src={related.image} alt={related.name} />
                  <div className="related-info">
                    <h4>{related.name}</h4>
                    <p>${related.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .product-detail-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        
        .product-detail-container {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
        }
        
        .breadcrumb {
          margin-bottom: 30px;
          font-size: 14px;
        }
        
        .breadcrumb a {
          color: #667eea;
          text-decoration: none;
        }
        
        .breadcrumb .current {
          color: #666;
        }
        
        .product-detail-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          margin-bottom: 50px;
        }
        
        .main-image {
          position: relative;
          background: #f8f9fa;
          border-radius: 16px;
          overflow: hidden;
        }
        
        .main-image img {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
        
        .featured-badge, .stock-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .featured-badge {
          background: #ff9800;
          color: white;
        }
        
        .stock-badge.out {
          background: #f44336;
          color: white;
        }
        
        .stock-badge.low {
          background: #ff9800;
          color: white;
        }
        
        .product-title {
          font-size: 28px;
          margin-bottom: 10px;
          color: #333;
        }
        
        .product-category {
          color: #667eea;
          margin-bottom: 15px;
        }
        
        .product-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }
        
        .stars {
          color: #ffc107;
          font-size: 16px;
        }
        
        .product-price-section {
          margin-bottom: 20px;
        }
        
        .current-price {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
        }
        
        .old-price {
          font-size: 20px;
          color: #999;
          text-decoration: line-through;
          margin-left: 10px;
        }
        
        .in-stock {
          color: #4caf50;
          font-weight: bold;
        }
        
        .out-stock {
          color: #f44336;
          font-weight: bold;
        }
        
        .tabs {
          display: flex;
          gap: 10px;
          border-bottom: 1px solid #e0e0e0;
          margin: 20px 0;
        }
        
        .tab-btn {
          padding: 10px 20px;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .tab-btn.active {
          color: #667eea;
          border-bottom: 2px solid #667eea;
        }
        
        .tab-content {
          padding: 20px 0;
          line-height: 1.6;
          color: #666;
        }
        
        .tab-content ul {
          margin: 0;
          padding-left: 20px;
        }
        
        .quantity-selector {
          display: flex;
          align-items: center;
          gap: 15px;
          margin: 20px 0;
        }
        
        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .qty-btn {
          width: 32px;
          height: 32px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
        }
        
        .action-buttons {
          display: flex;
          gap: 15px;
        }
        
        .add-to-cart-btn, .buy-now-btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .add-to-cart-btn {
          background: #667eea;
          color: white;
        }
        
        .add-to-cart-btn:hover:not(:disabled) {
          background: #5a67d8;
          transform: translateY(-2px);
        }
        
        .buy-now-btn {
          background: #4caf50;
          color: white;
        }
        
        .buy-now-btn:hover {
          background: #45a049;
          transform: translateY(-2px);
        }
        
        .delivery-info {
          display: flex;
          gap: 20px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }
        
        .delivery-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 12px;
        }
        
        .delivery-item strong {
          display: block;
          font-size: 13px;
        }
        
        .delivery-item p {
          margin: 0;
          color: #666;
        }
        
        .related-products {
          margin-top: 50px;
          padding-top: 30px;
          border-top: 1px solid #e0e0e0;
        }
        
        .related-products h3 {
          margin-bottom: 20px;
        }
        
        .related-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 20px;
        }
        
        .related-card {
          text-decoration: none;
          color: inherit;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          transition: transform 0.3s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .related-card:hover {
          transform: translateY(-3px);
        }
        
        .related-card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }
        
        .related-info {
          padding: 10px;
          text-align: center;
        }
        
        .related-info h4 {
          font-size: 14px;
          margin-bottom: 5px;
        }
        
        .ml-recommendations-section {
          margin-top: 40px;
        }
        
        .product-detail-loading {
          text-align: center;
          padding: 100px;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
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
          .product-detail-content {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          
          .delivery-info {
            flex-direction: column;
          }
          
          .related-products-grid {
            grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          }
          
          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;