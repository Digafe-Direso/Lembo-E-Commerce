import React, { useState } from 'react';
import axios from 'axios';

const NetworkTest = () => {
  const [status, setStatus] = useState('Click to test connection');

  const testConnection = async () => {
    setStatus('Testing connection to backend...');
    
    try {
      const response = await axios.get('http://localhost:5000/');
      setStatus(`✅ Connected! Backend says: ${response.data.message}`);
    } catch (error) {
      console.error('Connection error:', error);
      setStatus(`❌ Connection failed: ${error.message}\n\nMake sure backend is running on port 5000`);
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h3>Network Connection Test</h3>
      <button
        onClick={testConnection}
        style={{
          padding: '10px 20px',
          background: '#667eea',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Test Backend Connection
      </button>
      <p style={{ whiteSpace: 'pre-wrap' }}>{status}</p>
    </div>
  );
};

export default NetworkTest;