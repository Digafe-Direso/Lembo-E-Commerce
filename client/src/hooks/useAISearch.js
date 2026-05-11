import { useState, useEffect } from 'react';
import axios from 'axios';

const useAISearch = (query) => {
  const [results, setResults] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiEnhanced, setAiEnhanced] = useState(false);
  const [searchIntent, setSearchIntent] = useState(null);

  useEffect(() => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }
    
    const searchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/ai/search?q=${encodeURIComponent(query)}`);
        
        if (response.data.success) {
          setResults(response.data.products);
          setRecommendations(response.data.recommendations || []);
          setAiEnhanced(response.data.aiEnhanced || false);
          setSearchIntent(response.data.searchIntent);
        }
      } catch (error) {
        console.error('AI Search error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const delayDebounce = setTimeout(() => {
      searchProducts();
    }, 500);
    
    return () => clearTimeout(delayDebounce);
  }, [query]);

  return { results, recommendations, loading, aiEnhanced, searchIntent };
};

export default useAISearch;