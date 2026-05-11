import express from 'express';
import {
  trackAction,
  getRecommendations,
  getPopular
} from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/track', protect, trackAction);
router.get('/personalized', protect, getRecommendations);
router.get('/popular', getPopular);

export default router;