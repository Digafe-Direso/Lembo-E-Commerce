import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// ============= AI CHATBOT ROUTES =============

// Store conversation history (in production, use Redis or database)
const conversations = new Map();

// @desc    AI Chatbot endpoint - Main chat interface
// @route   POST /api/ai/chat
// @access  Public
router.post('/chat', async (req, res) => {
  try {
    const { message, sessionId, userId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    // Get conversation history
    let conversation = conversations.get(sessionId) || [];
    
    // Get user info if logged in
    let userInfo = null;
    if (userId) {
      const user = await User.findById(userId).select('name email role');
      if (user) {
        userInfo = user;
      }
    }
    
    // Get products for context
    const products = await Product.find({ stock: { $gt: 0 } })
      .select('_id name price category description image stock ratings')
      .limit(50);
    
    // Analyze user intent based on message
    const lowerMessage = message.toLowerCase();
    let intent = {
      type: 'general',
      category: null,
      sentiment: 'neutral'
    };
    
    // Detect intent
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      intent.type = 'price_check';
    } else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best')) {
      intent.type = 'recommendation';
    } else if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('delivery')) {
      intent.type = 'order_tracking';
    } else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
      intent.type = 'support';
    } else if (lowerMessage.includes('electronics')) {
      intent.category = 'Electronics';
      intent.type = 'category_search';
    } else if (lowerMessage.includes('fashion') || lowerMessage.includes('clothing') || lowerMessage.includes('shoes')) {
      intent.category = 'Fashion';
      intent.type = 'category_search';
    } else if (lowerMessage.includes('books')) {
      intent.category = 'Books';
      intent.type = 'category_search';
    } else if (lowerMessage.includes('home') || lowerMessage.includes('furniture')) {
      intent.category = 'Home';
      intent.type = 'category_search';
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      intent.type = 'greeting';
    } else {
      intent.type = 'product_search';
    }
    
    // Get recommended products based on intent
    let recommendedProducts = [];
    
    if (intent.type === 'category_search' && intent.category) {
      recommendedProducts = products.filter(p => p.category === intent.category).slice(0, 5);
    } else if (intent.type === 'price_check') {
      const priceMatch = lowerMessage.match(/\$?(\d+)/);
      if (priceMatch) {
        const price = parseInt(priceMatch[1]);
        recommendedProducts = products.filter(p => p.price <= price).slice(0, 5);
      } else {
        recommendedProducts = products.slice(0, 5);
      }
    } else if (intent.type === 'recommendation') {
      recommendedProducts = products.sort((a, b) => (b.ratings || 0) - (a.ratings || 0)).slice(0, 5);
    } else {
      const keywords = message.split(' ').filter(w => w.length > 3);
      if (keywords.length > 0) {
        recommendedProducts = products.filter(p => 
          keywords.some(k => 
            p.name.toLowerCase().includes(k.toLowerCase()) ||
            p.category.toLowerCase().includes(k.toLowerCase()) ||
            p.description.toLowerCase().includes(k.toLowerCase())
          )
        ).slice(0, 5);
      }
    }
    
    // Get user's order history if authenticated
    let orderHistory = null;
    if (userId) {
      const orders = await Order.find({ user: userId })
        .sort('-createdAt')
        .limit(5);
      
      if (orders.length > 0) {
        orderHistory = orders.map(o => ({
          orderId: o._id,
          total: o.totalPrice,
          status: o.status,
          date: o.createdAt
        }));
      }
    }
    
    // Generate intelligent response based on intent and context
    let response = '';
    
    if (intent.type === 'greeting') {
      response = `👋 Hello${userInfo ? ' ' + userInfo.name : ''}! Welcome to E-Shop! I'm your AI shopping assistant. How can I help you today? You can ask me about products, prices, recommendations, or track your orders.`;
    } else if (intent.type === 'price_check') {
      if (recommendedProducts.length > 0) {
        response = `💰 Here are some products within your price range:\n\n`;
        recommendedProducts.slice(0, 5).forEach(p => {
          response += `• ${p.name}: $${p.price}\n`;
        });
        response += `\nWould you like more details about any of these?`;
      } else {
        response = `💰 I couldn't find products matching your price criteria. Our products range from $10 to $1000. Could you specify a different price range?`;
      }
    } else if (intent.type === 'recommendation') {
      if (recommendedProducts.length > 0) {
        response = `⭐ Based on customer ratings, here are our top recommendations:\n\n`;
        recommendedProducts.slice(0, 5).forEach(p => {
          response += `• ${p.name}: $${p.price} (${p.ratings || 0}⭐)\n`;
        });
        response += `\nWould you like to see more details about any of these?`;
      } else {
        response = `⭐ Our best-selling categories include Electronics, Fashion, and Books. What type of products are you interested in?`;
      }
    } else if (intent.type === 'category_search') {
      if (recommendedProducts.length > 0) {
        response = `📂 Here are some popular ${intent.category} products:\n\n`;
        recommendedProducts.slice(0, 5).forEach(p => {
          response += `• ${p.name}: $${p.price}\n`;
        });
        response += `\nWould you like to see more ${intent.category} products?`;
      } else {
        response = `📂 We have a great selection of products in the ${intent.category} category! Check our products page to explore them.`;
      }
    } else if (intent.type === 'order_tracking') {
      if (orderHistory && orderHistory.length > 0) {
        response = `📦 Here are your recent orders:\n\n`;
        orderHistory.slice(0, 5).forEach(o => {
          response += `• Order #${o.orderId.toString().slice(-8)}: ${o.status} - $${o.total}\n`;
        });
        response += `\nWould you like to track a specific order?`;
      } else {
        response = `📦 You don't have any orders yet. Would you like me to help you find some products to get started?`;
      }
    } else if (intent.type === 'support') {
      response = `🛡️ I'd be happy to help with returns or exchanges!\n\nOur policy:\n• 30-day easy returns\n• Free exchanges on damaged items\n• Full refund for defective products\n\nWould you like to initiate a return or learn more about our policies?`;
    } else if (intent.type === 'product_search' && recommendedProducts.length > 0) {
      response = `🔍 I found ${recommendedProducts.length} product(s) matching your search:\n\n`;
      recommendedProducts.slice(0, 5).forEach(p => {
        response += `• ${p.name}: $${p.price} (${p.category})\n`;
      });
      response += `\nWould you like more information about any of these products?`;
    } else {
      response = `🤔 I'm here to help! You can ask me about:\n\n• 🔍 Finding products (e.g., "show me laptops")\n• 💰 Pricing information (e.g., "how much is iPhone?")\n• ⭐ Product recommendations (e.g., "best sellers")\n• 📂 Categories (e.g., "electronics")\n• 📦 Order tracking (e.g., "where is my order?")\n\nWhat would you like to know?`;
    }
    
    // Update conversation history
    conversation.push({ role: 'user', message, timestamp: new Date(), intent });
    conversation.push({ role: 'assistant', message: response, timestamp: new Date() });
    
    if (conversation.length > 15) {
      conversation = conversation.slice(-15);
    }
    conversations.set(sessionId, conversation);
    
    res.json({
      success: true,
      response: response,
      recommendedProducts: recommendedProducts.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        rating: p.ratings || 0,
        inStock: p.stock > 0
      })),
      intent: intent,
      conversationId: sessionId,
      timestamp: new Date()
    });
    
  } catch (error) {
    console.error('AI Chatbot error:', error);
    res.status(500).json({
      success: false,
      response: "Sorry, I'm having trouble right now. Please try again later.",
      recommendedProducts: []
    });
  }
});

// @desc    Clear conversation history
// @route   DELETE /api/ai/chat/history
// @access  Public
router.delete('/chat/history', async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (sessionId) {
      conversations.delete(sessionId);
    }
    res.json({
      success: true,
      message: 'Conversation history cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get conversation history
// @route   GET /api/ai/chat/history/:sessionId
// @access  Public
router.get('/chat/history/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const history = conversations.get(sessionId) || [];
    res.json({
      success: true,
      history
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// ============= AI SEARCH ROUTES =============

// @desc    AI-powered product search with natural language
// @route   GET /api/ai/search
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required (minimum 2 characters)'
      });
    }
    
    const lowerQuery = q.toLowerCase();
    let filter = {};
    let sort = { createdAt: -1 };
    
    // Price filters
    const underMatch = lowerQuery.match(/under\s*\$?(\d+)/);
    const belowMatch = lowerQuery.match(/below\s*\$?(\d+)/);
    const betweenMatch = lowerQuery.match(/between\s*\$?(\d+)\s*(?:and|-)\s*\$?(\d+)/);
    const lessThanMatch = lowerQuery.match(/less than\s*\$?(\d+)/);
    
    if (underMatch || belowMatch || lessThanMatch) {
      const price = parseInt(underMatch?.[1] || belowMatch?.[1] || lessThanMatch?.[1]);
      filter.price = { $lte: price };
    }
    
    if (betweenMatch) {
      filter.price = {
        $gte: parseInt(betweenMatch[1]),
        $lte: parseInt(betweenMatch[2])
      };
    }
    
    // Category filters
    if (lowerQuery.includes('electronics')) {
      filter.category = 'Electronics';
    } else if (lowerQuery.includes('fashion') || lowerQuery.includes('clothing') || lowerQuery.includes('shoes')) {
      filter.category = 'Fashion';
    } else if (lowerQuery.includes('books')) {
      filter.category = 'Books';
    } else if (lowerQuery.includes('home') || lowerQuery.includes('furniture')) {
      filter.category = 'Home';
    }
    
    // Sort filters
    if (lowerQuery.includes('cheapest') || lowerQuery.includes('price low to high')) {
      sort = { price: 1 };
    } else if (lowerQuery.includes('expensive') || lowerQuery.includes('price high to low')) {
      sort = { price: -1 };
    } else if (lowerQuery.includes('newest') || lowerQuery.includes('latest')) {
      sort = { createdAt: -1 };
    }
    
    // Build text search
    const searchWords = q.split(' ').filter(w => w.length > 2 && !['the', 'and', 'for', 'under', 'below', 'between', 'less', 'than'].includes(w.toLowerCase()));
    
    if (searchWords.length > 0 && Object.keys(filter).length === 0) {
      filter.$or = [
        { name: { $regex: searchWords.join('|'), $options: 'i' } },
        { description: { $regex: searchWords.join('|'), $options: 'i' } },
        { category: { $regex: searchWords.join('|'), $options: 'i' } }
      ];
    } else if (searchWords.length > 0) {
      filter.$and = [
        filter,
        {
          $or: [
            { name: { $regex: searchWords.join('|'), $options: 'i' } },
            { description: { $regex: searchWords.join('|'), $options: 'i' } }
          ]
        }
      ];
      delete filter.$or;
    }
    
    const products = await Product.find(filter).sort(sort).limit(30);
    
    let recommendations = [];
    if (products.length > 0) {
      const categories = [...new Set(products.map(p => p.category))];
      recommendations = await Product.find({
        category: { $in: categories },
        _id: { $nin: products.map(p => p._id) }
      }).limit(5);
    }
    
    res.json({
      success: true,
      products: products,
      recommendations: recommendations,
      searchQuery: q,
      count: products.length,
      filters: {
        priceFilter: filter.price || null,
        categoryFilter: filter.category || null
      }
    });
    
  } catch (error) {
    console.error('AI Search error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get search suggestions (autocomplete)
// @route   GET /api/ai/suggestions
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, suggestions: [] });
    }
    
    const products = await Product.find({
      name: { $regex: q, $options: 'i' }
    })
    .select('name category price')
    .limit(8);
    
    const suggestions = products.map(p => ({
      text: p.name,
      category: p.category,
      price: p.price
    }));
    
    res.json({
      success: true,
      suggestions: suggestions
    });
    
  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// @desc    Get popular search terms
// @route   GET /api/ai/popular-searches
// @access  Public
router.get('/popular-searches', async (req, res) => {
  try {
    const popularCategories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    
    res.json({
      success: true,
      popularSearches: popularCategories.map(c => c._id)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;