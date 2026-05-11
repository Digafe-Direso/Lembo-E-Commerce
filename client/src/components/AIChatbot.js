import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AIChatbot = () => {
  const { token, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Generate unique session ID
    setSessionId('session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9));
    
    // Welcome message
    setMessages([
      {
        id: 1,
        text: "👋 Hi! I'm your AI shopping assistant. Ask me about products, prices, recommendations, or help with your order!",
        sender: 'bot',
        time: new Date().toLocaleTimeString(),
        products: []
      }
    ]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      time: new Date().toLocaleTimeString(),
      products: []
    };
    
    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputMessage;
    setInputMessage('');
    setLoading(true);
    
    try {
      const headers = isAuthenticated ? { Authorization: `Bearer ${token}` } : {};
      const response = await axios.post('http://localhost:5000/api/chatbot/message', {
        message: messageToSend,
        sessionId: sessionId
      }, { headers });
      
      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'bot',
          time: new Date().toLocaleTimeString(),
          products: response.data.recommendedProducts || []
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        time: new Date().toLocaleTimeString(),
        isError: true,
        products: []
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = async () => {
    try {
      await axios.delete('http://localhost:5000/api/chatbot/clear', {
        data: { sessionId }
      });
      setMessages([{
        id: Date.now(),
        text: "Conversation cleared. How can I help you today?",
        sender: 'bot',
        time: new Date().toLocaleTimeString(),
        products: []
      }]);
    } catch (error) {
      console.error('Clear chat error:', error);
    }
  };

  const suggestedQuestions = [
    "Search for laptop under $500",
    "Show me popular electronics",
    "What are your best sellers?",
    "How do I track my order?",
    "What's your return policy?",
    "Show me affordable gifts"
  ];

  const styles = {
    button: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      cursor: 'pointer',
      fontSize: '28px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      zIndex: 1000,
      transition: 'transform 0.3s'
    },
    window: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '380px',
      height: '550px',
      background: 'white',
      borderRadius: '15px',
      boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1001,
      overflow: 'hidden'
    },
    header: {
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: 'white',
      padding: '15px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    messagesArea: {
      flex: 1,
      overflowY: 'auto',
      padding: '15px',
      background: '#f8f9fa'
    },
    userMessage: {
      display: 'flex',
      justifyContent: 'flex-end',
      marginBottom: '15px'
    },
    botMessage: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: '15px'
    },
    userBubble: {
      background: '#667eea',
      color: 'white',
      padding: '10px 15px',
      borderRadius: '18px',
      borderBottomRightRadius: '4px',
      maxWidth: '80%',
      wordWrap: 'break-word'
    },
    botBubble: {
      background: 'white',
      color: '#333',
      padding: '10px 15px',
      borderRadius: '18px',
      borderBottomLeftRadius: '4px',
      maxWidth: '80%',
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      wordWrap: 'break-word',
      whiteSpace: 'pre-wrap'
    },
    inputArea: {
      padding: '15px',
      borderTop: '1px solid #e0e0e0',
      display: 'flex',
      gap: '10px',
      background: 'white'
    },
    textarea: {
      flex: 1,
      padding: '10px',
      border: '1px solid #e0e0e0',
      borderRadius: '25px',
      resize: 'none',
      fontFamily: 'inherit',
      fontSize: '14px',
      minHeight: '40px'
    },
    sendButton: {
      padding: '10px 20px',
      background: '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '25px',
      cursor: 'pointer'
    },
    productCard: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '8px',
      background: '#f8f9fa',
      borderRadius: '8px',
      marginTop: '10px',
      textDecoration: 'none',
      color: '#333'
    },
    productImage: {
      width: '40px',
      height: '40px',
      objectFit: 'cover',
      borderRadius: '5px'
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          style={styles.button}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          onClick={() => setIsOpen(true)}
        >
          💬
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#f44336',
            color: 'white',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '10px'
          }}>AI</span>
        </button>
      )}
      
      {isOpen && (
        <div style={styles.window}>
          <div style={styles.header}>
            <div>
              <strong>🤖 AI Assistant</strong>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Online • 24/7</div>
            </div>
            <div>
              <button onClick={clearChat} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', marginRight: '10px' }}>🗑️</button>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>
          </div>
          
          <div style={styles.messagesArea}>
            {messages.map((msg) => (
              <div key={msg.id}>
                <div style={msg.sender === 'user' ? styles.userMessage : styles.botMessage}>
                  <div style={msg.sender === 'user' ? styles.userBubble : styles.botBubble}>
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                    
                    {msg.products && msg.products.length > 0 && (
                      <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e0e0e0' }}>
                        <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>🛍️ Recommended:</div>
                        {msg.products.map(product => (
                          <Link
                            key={product._id}
                            to={`/product/${product._id}`}
                            style={styles.productCard}
                            onClick={() => setIsOpen(false)}
                          >
                            <img src={product.image} alt={product.name} style={styles.productImage} />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{product.name}</div>
                              <div style={{ fontSize: '11px', color: '#666' }}>${product.price}</div>
                            </div>
                            <div>👉</div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{
                  fontSize: '9px',
                  color: '#999',
                  marginTop: '-8px',
                  marginBottom: '8px',
                  textAlign: msg.sender === 'user' ? 'right' : 'left'
                }}>
                  {msg.time}
                </div>
              </div>
            ))}
            
            {loading && (
              <div style={styles.botMessage}>
                <div style={styles.botBubble}>
                  <div style={{ display: 'flex', gap: '4px', padding: '4px 0' }}>
                    <span style={{ width: '8px', height: '8px', background: '#999', borderRadius: '50%', animation: 'bounce 1.4s infinite' }}></span>
                    <span style={{ width: '8px', height: '8px', background: '#999', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.2s' }}></span>
                    <span style={{ width: '8px', height: '8px', background: '#999', borderRadius: '50%', animation: 'bounce 1.4s infinite 0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested Questions */}
          {messages.length < 3 && (
            <div style={{ padding: '10px', background: '#f8f9fa', borderTop: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '11px', color: '#666', marginBottom: '8px' }}>💡 Suggested questions:</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputMessage(q);
                      setTimeout(sendMessage, 100);
                    }}
                    style={{
                      background: '#f0f0f0',
                      border: 'none',
                      padding: '5px 12px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div style={styles.inputArea}>
            <textarea
              style={styles.textarea}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              rows="1"
            />
            <button
              style={styles.sendButton}
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim()}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-10px); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default AIChatbot;