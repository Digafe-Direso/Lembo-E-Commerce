// import express from 'express';
// import {
//   getDashboardStats,
//   getSalesReport,
//   getProductReport,
//   getUserReport,
//   exportSalesReport,
//   exportProductsReport,
//   exportUsersReport
// } from '../controllers/reportController.js';
// import { protect } from '../middleware/authMiddleware.js';
// import { admin } from '../middleware/roleMiddleware.js';

// const router = express.Router();

// // All report routes require authentication and admin role
// router.use(protect);
// router.use(admin);

// // Data routes
// router.get('/dashboard', getDashboardStats);
// router.get('/sales', getSalesReport);
// router.get('/products', getProductReport);
// router.get('/users', getUserReport);

// // Export routes
// router.get('/export/sales', exportSalesReport);
// router.get('/export/products', exportProductsReport);
// router.get('/export/users', exportUsersReport);

// export default router;
import express from 'express';
import {
  getDashboardStats,
  getSalesReport,
  getProductReport,
  getUserReport,
  exportSalesReport,
  exportProductsReport,
  exportUsersReport
} from '../controllers/reportController.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All report routes require authentication and admin role
router.use(protect);
router.use(admin);

// Data routes
router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesReport);
router.get('/products', getProductReport);
router.get('/users', getUserReport);

// Export routes
router.get('/export/sales', exportSalesReport);
router.get('/export/products', exportProductsReport);
router.get('/export/users', exportUsersReport);

export default router;