import React, { useState } from 'react';

const MicrophoneTest = () => {
  const [status, setStatus] = useState('Click to test microphone');

  const testMicrophone = async () => {
    setStatus('Requesting microphone permission...');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStatus('✅ Microphone is working! Voice search should work.');
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      console.error('Microphone error:', err);
      setStatus('❌ Microphone access denied. Please allow microphone access in browser settings.');
    }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button onClick={testMicrophone} style={{
        padding: '10px 20px',
        background: '#667eea',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}>
        Test Microphone
      </button>
      <p style={{ marginTop: '10px' }}>{status}</p>
    </div>
  );
};

export default MicrophoneTest;