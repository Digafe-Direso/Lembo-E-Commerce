// import express from 'express';
// import { 
//   getProducts, 
//   getProductById, 
//   getFeaturedProducts,
//   getProductsByCategory 
// } from '../controllers/productController.js';

// const router = express.Router();

// router.get('/', getProducts);
// router.get('/featured', getFeaturedProducts);
// router.get('/category/:category', getProductsByCategory);
// router.get('/:id', getProductById);

// export default router;

import express from 'express';
import { 
  getProducts, 
  getProductById, 
  getFeaturedProducts,
  getProductsByCategory 
} from '../controllers/productController.js';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

export default router;