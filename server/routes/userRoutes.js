import express from 'express';
import { 
  getMyOrders, 
  getOrderById, 
  createOrder,
  updateUserProfile 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { user as userRole } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);
router.use(userRole);

// Order routes
router.get('/orders', getMyOrders);
router.get('/orders/:id', getOrderById);
router.post('/orders', createOrder);

// Profile routes
router.put('/profile', updateUserProfile);

export default router;