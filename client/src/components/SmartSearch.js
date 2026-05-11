import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SmartSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchSuggestions = useCallback(async (searchTerm) => {
    if (searchTerm.length < 2) {
      setSuggestions([]);
      return;
    }
    
    try {
      const response = await axios.get(`http://localhost:5000/api/ai/suggestions?q=${encodeURIComponent(searchTerm)}`);
      if (response.data.success) {
        setSuggestions(response.data.suggestions);
      }
    } catch (error) {
      console.error('Suggestions error:', error);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length >= 2) {
        fetchSuggestions(query);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);
    
    return () => clearTimeout(delayDebounce);
  }, [query, fetchSuggestions]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (query.trim().length < 2) {
      alert('Please enter at least 2 characters');
      return;
    }
    
    setLoading(true);
    navigate(`/products?aiSearch=${encodeURIComponent(query)}`);
    setShowSuggestions(false);
    setLoading(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    navigate(`/products?aiSearch=${encodeURIComponent(suggestion.text)}`);
    setShowSuggestions(false);
  };

  const styles = {
    container: {
      position: 'relative',
      flex: 1,
      maxWidth: '400px'
    },
    form: {
      width: '100%'
    },
    wrapper: {
      display: 'flex',
      alignItems: 'center',
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '25px',
      overflow: 'hidden'
    },
    input: {
      flex: 1,
      padding: '10px 15px',
      border: 'none',
      outline: 'none',
      fontSize: '14px'
    },
    button: {
      padding: '10px 15px',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '16px'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: '10px',
      marginTop: '5px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      zIndex: 100
    },
    suggestion: {
      padding: '10px 15px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'background 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSearch} style={styles.form}>
        <div style={styles.wrapper}>
          <input
            type="text"
            style={styles.input}
            placeholder="🔍 AI search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? '🤖' : '🔍'}
          </button>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <div style={styles.dropdown}>
            {suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                style={styles.suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
              >
                <span>🔍</span>
                <span style={{ flex: 1 }}>{suggestion.text}</span>
                <span style={{ fontSize: '11px', color: '#999' }}>{suggestion.category}</span>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default SmartSearch;