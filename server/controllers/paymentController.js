// import Stripe from 'stripe';
// import Order from '../models/Order.js';

// // Initialize Stripe
// let stripe = null;
// try {
//   if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_51Qxxxxxx') {
//     stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
//     console.log('✅ Stripe initialized successfully');
//   } else {
//     console.log('⚠️ Stripe not configured. Add STRIPE_SECRET_KEY to .env');
//   }
// } catch (error) {
//   console.error('❌ Stripe error:', error.message);
// }

// // @desc    Create Payment Intent
// // @route   POST /api/payments/create-payment-intent
// // @access  Private
// export const createPaymentIntent = async (req, res) => {
//   try {
//     if (!stripe) {
//       return res.status(400).json({
//         success: false,
//         message: 'Stripe not configured. Please add Stripe keys to .env'
//       });
//     }

//     const { orderId } = req.body;
    
//     const order = await Order.findById(orderId);
    
//     if (!order) {
//       return res.status(404).json({
//         success: false,
//         message: 'Order not found'
//       });
//     }
    
//     if (order.user.toString() !== req.user._id.toString()) {
//       return res.status(403).json({
//         success: false,
//         message: 'Not authorized'
//       });
//     }
    
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(order.totalPrice * 100),
//       currency: 'usd',
//       metadata: { orderId: order._id.toString() }
//     });
    
//     res.json({
//       success: true,
//       clientSecret: paymentIntent.client_secret
//     });
    
//   } catch (error) {
//     console.error('Create payment intent error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Confirm Payment
// // @route   POST /api/payments/confirm-payment
// // @access  Private
// export const confirmPayment = async (req, res) => {
//   try {
//     const { paymentIntentId, orderId } = req.body;
    
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
//     if (paymentIntent.status !== 'succeeded') {
//       return res.status(400).json({
//         success: false,
//         message: 'Payment not successful'
//       });
//     }
    
//     const order = await Order.findById(orderId);
//     order.paymentStatus = 'paid';
//     order.status = 'processing';
//     await order.save();
    
//     res.json({
//       success: true,
//       message: 'Payment confirmed'
//     });
    
//   } catch (error) {
//     console.error('Confirm payment error:', error);
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };

// // @desc    Get Stripe Config
// // @route   GET /api/payments/config
// // @access  Public
// export const getStripeConfig = async (req, res) => {
//   res.json({
//     publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
//     isConfigured: !!process.env.STRIPE_PUBLISHABLE_KEY
//   });
// };
import Stripe from 'stripe';
import Order from '../models/Order.js';

let stripe = null;

// Initialize Stripe
try {
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_SECRET_KEY !== 'sk_test_your_secret_key_here') {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    console.log('✅ Stripe initialized successfully');
  } else {
    console.log('⚠️ Stripe not configured. Add STRIPE_SECRET_KEY to .env');
  }
} catch (error) {
  console.error('❌ Stripe initialization error:', error.message);
}

// @desc    Create payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({
        success: false,
        message: 'Payment system not configured. Please use Cash on Delivery.'
      });
    }

    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    // Verify order belongs to user
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }
    
    // Check if already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Order already paid'
      });
    }
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString()
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      }
    });
    
    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
    
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Confirm payment and update order
// @route   POST /api/payments/confirm-payment
// @access  Private
export const confirmPayment = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({
        success: false,
        message: 'Payment system not configured'
      });
    }

    const { paymentIntentId, orderId } = req.body;
    
    // Retrieve payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not successful'
      });
    }
    
    // Update order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    order.paymentStatus = 'paid';
    order.status = 'processing';
    order.paymentResult = {
      id: paymentIntent.id,
      status: paymentIntent.status,
      updateTime: new Date().toISOString()
    };
    
    await order.save();
    
    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      order
    });
    
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get Stripe publishable key
// @route   GET /api/payments/config
// @access  Public
export const getStripeConfig = async (req, res) => {
  try {
    const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
    const isConfigured = publishableKey && publishableKey !== 'pk_test_your_publishable_key_here';
    
    res.json({
      publishableKey: isConfigured ? publishableKey : '',
      isConfigured: isConfigured
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};