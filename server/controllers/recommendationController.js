import * as recommendationService from '../services/recommendationService.js';

// Track user action
export const trackAction = async (req, res) => {
  try {
    const { productId, action } = req.body;
    const userId = req.user._id;
    
    await recommendationService.trackAction(userId, productId, action);
    
    res.json({
      success: true,
      message: 'Action tracked'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get personalized recommendations
export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 8 } = req.query;
    
    const recommendations = await recommendationService.getRecommendations(userId, parseInt(limit));
    
    res.json({
      success: true,
      count: recommendations.length,
      recommendations: recommendations.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category,
        stock: p.stock
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get popular products
export const getPopular = async (req, res) => {
  try {
    const { limit = 8 } = req.query;
    const products = await recommendationService.getPopularProducts(parseInt(limit));
    
    res.json({
      success: true,
      count: products.length,
      recommendations: products.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: p.image,
        category: p.category
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};