import Product from '../models/Product.js';
import geminiService from '../services/geminiService.js';

// @desc    AI-powered search
// @route   GET /api/ai/search
// @access  Public
export const aiSearch = async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    
    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }
    
    // Check if AI is available
    if (!geminiService.isAIAvailable()) {
      // Fallback to regular search
      const products = await Product.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      }).limit(limit);
      
      return res.json({
        success: true,
        products,
        aiEnhanced: false,
        message: 'AI search not available, showing regular results'
      });
    }
    
    // Extract search intent using AI
    const searchIntent = await geminiService.extractSearchIntent(q);
    
    // Build MongoDB query based on AI-extracted intent
    let query = {};
    
    if (searchIntent) {
      if (searchIntent.category && searchIntent.category !== 'null') {
        query.category = { $regex: searchIntent.category, $options: 'i' };
      }
      
      if (searchIntent.keywords && searchIntent.keywords.length > 0) {
        query.$or = searchIntent.keywords.map(keyword => ({
          $or: [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { category: { $regex: keyword, $options: 'i' } }
          ]
        }));
      }
      
      if (searchIntent.priceMin) {
        query.price = { ...query.price, $gte: parseFloat(searchIntent.priceMin) };
      }
      
      if (searchIntent.priceMax) {
        query.price = { ...query.price, $lte: parseFloat(searchIntent.priceMax) };
      }
    }
    
    // If AI couldn't extract intent, use simple text search
    if (Object.keys(query).length === 0) {
      query = {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      };
    }
    
    const products = await Product.find(query).limit(limit);
    
    // Get AI recommendations based on search
    let recommendations = [];
    if (products.length > 0) {
      const productIds = await geminiService.getPersonalizedRecommendations(q, products);
      if (productIds && productIds.length > 0) {
        recommendations = await Product.find({ _id: { $in: productIds } }).limit(5);
      }
    }
    
    res.json({
      success: true,
      products,
      recommendations,
      searchIntent: searchIntent || null,
      aiEnhanced: true,
      count: products.length
    });
  } catch (error) {
    console.error('AI Search error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get search suggestions
// @route   GET /api/ai/suggestions
// @access  Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({ success: true, suggestions: [] });
    }
    
    const suggestions = await Product.aggregate([
      {
        $search: {
          autocomplete: {
            query: q,
            path: "name",
            fuzzy: { maxEdits: 1 }
          }
        }
      },
      { $limit: 5 },
      { $project: { name: 1, category: 1 } }
    ]);
    
    res.json({
      success: true,
      suggestions: suggestions.map(s => ({
        text: s.name,
        category: s.category
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};