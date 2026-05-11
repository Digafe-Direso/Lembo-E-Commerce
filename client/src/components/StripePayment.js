// import React, { useState, useEffect } from 'react';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const StripePayment = ({ orderId, amount, onSuccess, onError }) => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [loading, setLoading] = useState(false);
//   const [clientSecret, setClientSecret] = useState('');
//   const [cardComplete, setCardComplete] = useState(false);

//   useEffect(() => {
//     const createPaymentIntent = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const response = await axios.post(
//           'http://localhost:5000/api/payments/create-payment-intent',
//           { orderId },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         if (response.data.success) {
//           setClientSecret(response.data.clientSecret);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//         toast.error('Payment initialization failed');
//       }
//     };
    
//     if (orderId) {
//       createPaymentIntent();
//     }
//   }, [orderId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!stripe || !elements || !clientSecret) {
//       toast.error('Payment system not ready');
//       return;
//     }
    
//     if (!cardComplete) {
//       toast.error('Please complete card details');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const cardElement = elements.getElement(CardElement);
      
//       const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: { card: cardElement }
//       });
      
//       if (error) {
//         toast.error(error.message);
//         if (onError) onError(error.message);
//       } else if (paymentIntent.status === 'succeeded') {
//         const token = localStorage.getItem('token');
//         await axios.post(
//           'http://localhost:5000/api/payments/confirm-payment',
//           { paymentIntentId: paymentIntent.id, orderId },
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
        
//         toast.success('Payment successful!');
//         if (onSuccess) onSuccess();
//       }
//     } catch (error) {
//       toast.error('Payment failed');
//       if (onError) onError('Payment failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cardElementOptions = {
//     style: {
//       base: {
//         fontSize: '16px',
//         color: '#424770',
//         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
//         '::placeholder': { color: '#aab7c4' }
//       },
//       invalid: { color: '#9e2146' }
//     }
//   };

//   return (
//     <div style={{ background: 'white', padding: '24px', borderRadius: '10px', border: '1px solid #e0e0e0' }}>
//       <h3 style={{ marginBottom: '20px' }}>💳 Card Payment</h3>
      
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '20px' }}>
//           <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Card Details</label>
//           <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}>
//             <CardElement options={cardElementOptions} onChange={(e) => setCardComplete(e.complete)} />
//           </div>
//         </div>
        
//         <button
//           type="submit"
//           disabled={!stripe || loading || !clientSecret || !cardComplete}
//           style={{
//             width: '100%',
//             padding: '14px',
//             background: '#4caf50',
//             color: 'white',
//             border: 'none',
//             borderRadius: '8px',
//             fontSize: '16px',
//             fontWeight: 'bold',
//             cursor: 'pointer',
//             opacity: (!stripe || loading || !clientSecret || !cardComplete) ? 0.6 : 1
//           }}
//         >
//           {loading ? 'Processing...' : `Pay $${amount}`}
//         </button>
//       </form>
      
//       <div style={{ marginTop: '16px', textAlign: 'center' }}>
//         <p style={{ fontSize: '12px', color: '#666' }}>🔒 Secure payment powered by Stripe</p>
//         <p style={{ fontSize: '11px', color: '#999', marginTop: '8px' }}>
//           <strong>Test Card:</strong> 4242 4242 4242 4242<br />
//           Any future expiry, any CVC
//         </p>
//       </div>
//     </div>
//   );
// };

// export default StripePayment;
import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import toast from 'react-hot-toast';

const StripePayment = ({ orderId, amount, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [cardComplete, setCardComplete] = useState(false);
  const [cardholderName, setCardholderName] = useState('');
  const [cardError, setCardError] = useState('');

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/payments/create-payment-intent',
          { orderId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          setClientSecret(response.data.clientSecret);
        } else {
          toast.error(response.data.message);
          if (onError) onError(response.data.message);
        }
      } catch (error) {
        console.error('Error creating payment intent:', error);
        toast.error(error.response?.data?.message || 'Payment initialization failed');
        if (onError) onError('Payment initialization failed');
      }
    };
    
    if (orderId) {
      createPaymentIntent();
    }
  }, [orderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      toast.error('Payment system not ready. Please try again.');
      return;
    }
    
    if (!cardComplete) {
      toast.error('Please complete your card details');
      return;
    }
    
    if (!cardholderName.trim()) {
      toast.error('Please enter cardholder name');
      return;
    }
    
    setLoading(true);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
          },
        },
      });
      
      if (error) {
        console.error('Payment error:', error);
        toast.error(error.message || 'Payment failed');
        if (onError) onError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        const token = localStorage.getItem('token');
        await axios.post(
          'http://localhost:5000/api/payments/confirm-payment',
          {
            paymentIntentId: paymentIntent.id,
            orderId: orderId
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        toast.success('Payment successful!');
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      toast.error(error.response?.data?.message || 'Payment failed');
      if (onError) onError(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        letterSpacing: '0.025em',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
    setCardError(event.error ? event.error.message : '');
  };

  return (
    <div className="stripe-payment-container">
      <h3 style={{ marginBottom: '20px' }}>💳 Card Payment Details</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="payment-form-group">
          <label>Cardholder Name</label>
          <input
            type="text"
            placeholder="Name on card"
            value={cardholderName}
            onChange={(e) => setCardholderName(e.target.value)}
            required
            className="payment-input"
          />
        </div>
        
        <div className="payment-form-group">
          <label>Card Information</label>
          <div className="stripe-element">
            <CardElement
              options={cardElementOptions}
              onChange={handleCardChange}
            />
          </div>
          {cardError && <div className="card-error">{cardError}</div>}
        </div>
        
        <button
          type="submit"
          className="pay-now-btn"
          disabled={!stripe || loading || !clientSecret || !cardComplete}
        >
          {loading ? 'Processing...' : `Pay $${amount}`}
        </button>
      </form>
      
      <div className="secure-notice">
        <p>🔒 Your payment is secure and encrypted</p>
        <p className="test-note">
          <strong>Test Card:</strong> 4242 4242 4242 4242<br />
          Any future expiry date, any 3-digit CVC
        </p>
      </div>

      <style>{`
        .stripe-payment-container {
          background: white;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #e0e0e0;
          margin-top: 20px;
        }
        
        .payment-form-group {
          margin-bottom: 20px;
        }
        
        .payment-form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }
        
        .payment-input {
          width: 100%;
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
        }
        
        .stripe-element {
          padding: 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: white;
        }
        
        .pay-now-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #4caf50, #45a049);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
          margin-top: 10px;
        }
        
        .pay-now-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(76,175,80,0.3);
        }
        
        .pay-now-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .card-error {
          color: #f44336;
          font-size: 12px;
          margin-top: 5px;
        }
        
        .secure-notice {
          margin-top: 20px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
        
        .test-note {
          margin-top: 10px;
          padding: 8px;
          background: #f0f0f0;
          border-radius: 6px;
          font-size: 11px;
        }
      `}</style>
    </div>
  );
};

export default StripePayment;