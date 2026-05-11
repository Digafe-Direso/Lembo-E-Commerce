import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Recommendations = ({ type, title, limit = 8 }) => {
  const { token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      let url = '';
      let headers = {};
      
      if (isAuthenticated && type === 'personalized') {
        headers = { Authorization: `Bearer ${token}` };
        url = `http://localhost:5000/api/recommendations/personalized?limit=${limit}`;
      } else {
        url = `http://localhost:5000/api/recommendations/popular?limit=${limit}`;
      }
      
      const response = await axios.get(url, { headers });
      if (response.data.success) {
        setProducts(response.data.recommendations);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '30px' }}>
        <div className="loader"></div>
        <style>{`
          .loader { width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <p>Loading...</p>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div style={{ margin: '40px 0' }}>
      <h3 style={{ marginBottom: '20px' }}>{title || 'Recommended For You'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
        {products.map(product => (
          <div key={product._id} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Link to={`/product/${product._id}`}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />
              <div style={{ padding: '12px' }}>
                <h4 style={{ margin: '0 0 5px', fontSize: '14px' }}>{product.name}</h4>
                <p style={{ color: '#999', fontSize: '12px', margin: '0 0 8px' }}>{product.category}</p>
                <p style={{ color: '#667eea', fontWeight: 'bold', margin: '0' }}>${product.price}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;