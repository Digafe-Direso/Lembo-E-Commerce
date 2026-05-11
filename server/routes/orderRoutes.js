// import express from 'express';
// import { 
//   createOrder, 
//   getMyOrders, 
//   getOrderById, 
//   updateOrderToPaid,
//   cancelOrder 
// } from '../controllers/orderController.js';
// import { protect } from '../middleware/authMiddleware.js';

// const router = express.Router();
// z
// // All order routes require authentication
// router.use(protect);

// router.post('/', createOrder);
// router.get('/myorders', getMyOrders);
// router.get('/:id', getOrderById);
// router.put('/:id/pay', updateOrderToPaid);
// router.put('/:id/cancel', cancelOrder);

// export default router;
import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  cancelOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All order routes require authentication
router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);
router.put('/:id/cancel', cancelOrder);

export default router;