import express from 'express';
import { sendMessage, clearConversation } from '../controllers/aiChatbotController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/message', sendMessage);
router.delete('/clear', clearConversation);

export default router;