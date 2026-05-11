// import Product from '../models/Product.js';
// import Order from '../models/Order.js';
// import geminiService from '../services/geminiService.js';

// // Store conversation history (in production, use Redis or database)
// const conversationHistory = new Map();

// // @desc    AI Chatbot endpoint
// // @route   POST /api/ai/chat
// // @access  Public
// export const aiChatbot = async (req, res) => {
//   try {
//     const { message, sessionId } = req.body;
    
//     if (!message) {
//       return res.status(400).json({
//         success: false,
//         message: 'Message is required'
//       });
//     }
    
//     // Check if AI is available
//     if (!geminiService.isAIAvailable()) {
//       return res.status(503).json({
//         success: false,
//         message: 'AI service is not available. Please try again later.',
//         fallback: true
//       });
//     }
    
//     // Get conversation history for this session
//     let history = conversationHistory.get(sessionId) || [];
    
//     // Get products for context
//     const products = await Product.find({ stock: { $gt: 0 } })
//       .select('name price category description image')
//       .limit(50);
    
//     const productContext = products.map(p => ({
//       id: p._id,
//       name: p.name,
//       price: p.price,
//       category: p.category,
//       description: p.description.substring(0, 100)
//     }));
    
//     // Get user order history if authenticated
//     let userHistory = null;
//     if (req.user) {
//       const orders = await Order.find({ user: req.user._id })
//         .populate('orderItems.product', 'name category')
//         .limit(5);
//       userHistory = orders.map(o => ({
//         products: o.orderItems.map(i => i.product.name),
//         total: o.totalPrice,
//         date: o.createdAt
//       }));
//     }
    
//     // Generate AI response
//     const aiResponse = await geminiService.generateChatResponse(
//       message,
//       productContext,
//       history.slice(-5) // Last 5 messages for context
//     );
    
//     if (!aiResponse) {
//       return res.status(500).json({
//         success: false,
//         message: 'Failed to generate AI response',
//         fallback: true
//       });
//     }
    
//     // Update conversation history
//     history.push({ role: 'user', message, timestamp: new Date() });
//     history.push({ role: 'assistant', message: aiResponse, timestamp: new Date() });
    
//     // Keep only last 20 messages to prevent memory issues
//     if (history.length > 20) {
//       history = history.slice(-20);
//     }
//     conversationHistory.set(sessionId, history);
    
//     // Extract recommended product IDs from response (simple matching)
//     const recommendedProducts = products.filter(p => 
//       aiResponse.toLowerCase().includes(p.name.toLowerCase())
//     ).slice(0, 4);
    
//     res.json({
//       success: true,
//       response: aiResponse,
//       recommendedProducts: recommendedProducts.map(p => ({
//         _id: p._id,
//         name: p.name,
//         price: p.price,
//         image: p.image
//       })),
//       timestamp: new Date()
//     });
//   } catch (error) {
//     console.error('AI Chatbot error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//       fallback: true
//     });
//   }
// };

// // @desc    Clear conversation history
// // @route   DELETE /api/ai/chat/history
// // @access  Public
// export const clearChatHistory = async (req, res) => {
//   try {
//     const { sessionId } = req.body;
//     conversationHistory.delete(sessionId);
//     res.json({
//       success: true,
//       message: 'Conversation history cleared'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message
//     });
//   }
// };
import aiChatbotService from '../services/aiChatbotService.js';

// @desc    Send message to AI chatbot
// @route   POST /api/chatbot/message
// @access  Public
export const sendMessage = async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user?._id;
    
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    const { response, recommendedProducts } = await aiChatbotService.generateResponse(
      message.trim(),
      sessionId,
      userId
    );
    
    res.json({
      success: true,
      response,
      recommendedProducts: recommendedProducts.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category
      }))
    });
  } catch (error) {
    console.error('AI Chatbot error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate response'
    });
  }
};

// @desc    Clear conversation history
// @route   DELETE /api/chatbot/clear
// @access  Public
export const clearConversation = async (req, res) => {
  try {
    const { sessionId } = req.body;
    aiChatbotService.clearConversation(sessionId);
    res.json({
      success: true,
      message: 'Conversation cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};