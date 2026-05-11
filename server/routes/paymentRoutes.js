// import express from 'express';
// import {
//   createPaymentIntent,
//   confirmPayment,
//   getStripeConfig
// } from '../controllers/paymentController.js';
// import { protect } from '../middleware/authMiddleware.js';

// const router = express.Router();

// router.get('/config', getStripeConfig);
// router.post('/create-payment-intent', protect, createPaymentIntent);
// router.post('/confirm-payment', protect, confirmPayment);

// export default router;
import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getStripeConfig
} from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm-payment', protect, confirmPayment);

export default router;