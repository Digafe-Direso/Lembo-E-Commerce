import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aiSearchQuery, setAiSearchQuery] = useState('');
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [searchIntent, setSearchIntent] = useState(null);
  
  // Filters state
  const [filters, setFilters] = useState({
    category: 'All',
    sort: 'newest',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    featured: false
  });

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 8
  });

  // Get search query from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get('aiSearch');
    const categoryParam = params.get('category');
    const pageParam = params.get('page');
    
    if (searchQuery) {
      setAiSearchQuery(searchQuery);
      performAISearch(searchQuery, parseInt(pageParam) || 1);
    } else if (categoryParam && categoryParam !== 'All') {
      setFilters(prev => ({ ...prev, category: categoryParam }));
      fetchProductsByCategory(categoryParam, parseInt(pageParam) || 1);
    } else {
      fetchProducts(parseInt(pageParam) || 1);
    }
    
   
  }, [location.search]);

  // Fetch all products with pagination
  const fetchProducts = async (page = 1) => {
    setLoading(true);
    setError(null);
    setAiSearchQuery('');
    setRecommendations([]);
    
    try {
      const params = new URLSearchParams({
        page: page,
        limit: pagination.limit,
        ...(filters.category !== 'All' && { category: filters.category }),
        ...(filters.sort && { sort: filters.sort }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }),
        ...(filters.inStock && { inStock: true }),
        ...(filters.featured && { featured: true })
      });
      
      const response = await axios.get(`http://localhost:5000/api/products?${params}`);
      
      if (response.data.success) {
        setProducts(response.data.products);
        setPagination({
          ...pagination,
          page: page,
          total: response.data.total || response.data.count,
          pages: response.data.pages || Math.ceil((response.data.total || response.data.count) / pagination.limit)
        });
      }
    } catch (error) {
      console.error('Fetch products error:', error);
      setError('Failed to load products. Please try again.');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // AI-powered search
  const performAISearch = async (query, page = 1) => {
    setLoading(true);
    setError(null);
    setAiSearchQuery(query);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/ai/search?q=${encodeURIComponent(query)}&page=${page}&limit=${pagination.limit}`);
      
      if (response.data.success) {
        setProducts(response.data.products);
        setRecommendations(response.data.recommendations || []);
        setAiEnhanced(response.data.aiEnhanced || false);
        setSearchIntent(response.data.searchIntent || null);
        setPagination({
          ...pagination,
          page: page,
          total: response.data.count || response.data.products?.length || 0,
          pages: Math.ceil((response.data.count || response.data.products?.length || 0) / pagination.limit)
        });
        
        if (response.data.products?.length === 0) {
          toast.error(`No products found for "${query}"`);
        } else {
          toast.success(`AI found ${response.data.products?.length || 0} products for "${query}"`);
        }
      }
    } catch (error) {
      console.error('AI Search error:', error);
      setError('AI search failed. Please try again.');
      toast.error('AI search failed');
      // Fallback to regular search
      fetchProducts(page);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products by category
  const fetchProductsByCategory = async (category, page = 1) => {
    setLoading(true);
    setError(null);
    setAiSearchQuery('');
    setRecommendations([]);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/products?category=${category}&page=${page}&limit=${pagination.limit}`);
      
      if (response.data.success) {
        setProducts(response.data.products);
        setPagination({
          ...pagination,
          page: page,
          total: response.data.total || response.data.count,
          pages: response.data.pages || Math.ceil((response.data.total || response.data.count) / pagination.limit)
        });
      }
    } catch (error) {
      console.error('Category fetch error:', error);
      setError('Failed to load products');
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

 

  // Clear AI search
  const clearAISearch = () => {
    setAiSearchQuery('');
    setRecommendations([]);
    setSearchIntent(null);
    navigate('/products');
    fetchProducts(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (aiSearchQuery) {
      performAISearch(aiSearchQuery, newPage);
    } else if (filters.category !== 'All') {
      fetchProductsByCategory(filters.category, newPage);
    } else {
      fetchProducts(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add to cart function
  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      if (existingItem.quantity + 1 <= product.stock) {
        existingItem.quantity += 1;
        toast.success(`Added another ${product.name} to cart`);
      } else {
        toast.error(`Only ${product.stock} items available in stock`);
        return;
      }
    } else {
      if (product.stock > 0) {
        cart.push({ 
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          stock: product.stock,
          quantity: 1 
        });
        toast.success(`${product.name} added to cart`);
      } else {
        toast.error(`${product.name} is out of stock`);
        return;
      }
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <p>{error}</p>
        <button onClick={() => aiSearchQuery ? performAISearch(aiSearchQuery) : fetchProducts()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    
<div>
        {/* Products Main Content */}
        <main className="products-main">
          <div className="products-header">
            <div>
              {aiSearchQuery ? (
                <div className="ai-search-header">
                  <h2>🤖 AI Search Results</h2>
                  <div className="search-query-badge">
                    "{aiSearchQuery}"
                    {aiEnhanced && <span className="ai-badge">✨ AI Enhanced</span>}
                  </div>
                  {searchIntent && (
                    <div className="search-intent">
                      <small>Detected: {searchIntent.category && `Category: ${searchIntent.category} `}</small>
                      <small>{searchIntent.priceMin && `Min: $${searchIntent.priceMin} `}</small>
                      <small>{searchIntent.priceMax && `Max: $${searchIntent.priceMax}`}</small>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <h2>All Products</h2>
                  <p className="products-count">{pagination.total} products found</p>
                </>
              )}
            </div>
            {aiSearchQuery && (
              <button onClick={clearAISearch} className="clear-search-btn">
                ✕ Clear AI Search
              </button>
            )}
          </div>

          {/* AI Recommendations Section */}
          {recommendations.length > 0 && (
            <div className="ai-recommendations">
              <h3>🤖 You might also like:</h3>
              <div className="recommendations-grid">
                {recommendations.map(product => (
                  <div key={product._id} className="recommendation-card">
                    <img src={product.image} alt={product.name} />
                    <div className="recommendation-info">
                      <h4>{product.name}</h4>
                      <p className="price">${product.price}</p>
                      <Link to={`/product/${product._id}`}>View</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="no-products">
              <p>No products found. Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <>
              <div className="products-grid">
                {products.map((product) => (
                  <div key={product._id} className="product-card">
                    <Link to={`/product/${product._id}`} className="product-link">
                      <div className="product-image-container">
                        <img 
                          src={product.image || 'https://via.placeholder.com/300'} 
                          alt={product.name} 
                          className="product-image"
                          loading="lazy"
                        />
                        {product.featured && (
                          <span className="product-badge featured">⭐ Featured</span>
                        )}
                        {product.stock === 0 && (
                          <span className="product-badge out-of-stock">Out of Stock</span>
                        )}
                        {product.stock > 0 && product.stock < 10 && (
                          <span className="product-badge low-stock">Only {product.stock} left!</span>
                        )}
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-category">{product.category}</p>
                        <div className="product-rating">
                          {'★'.repeat(Math.floor(product.ratings || 0))}
                          {'☆'.repeat(5 - Math.floor(product.ratings || 0))}
                          <span>({product.numReviews || 0})</span>
                        </div>
                        <p className="product-price">${(product.price || 0).toFixed(2)}</p>
                      </div>
                    </Link>
                    <button 
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart 🛒'}
                    </button>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="page-btn"
                  >
                    ← Previous
                  </button>
                  
                  <div className="page-numbers">
                    {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`page-btn ${pagination.page === pageNum ? 'active' : ''}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className="page-btn"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
   
  );
};

export default Products;


