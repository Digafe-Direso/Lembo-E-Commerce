import UserAction from '../models/UserAction.js';
import Product from '../models/Product.js';

// Get user's preferred categories based on their actions
const getUserPreferredCategories = async (userId) => {
  const actions = await UserAction.find({ userId });
  
  const categoryScores = {};
  
  for (const action of actions) {
    const weight = action.action === 'purchase' ? 5 : 
                   action.action === 'click' ? 2 : 1;
    
    if (action.productCategory) {
      categoryScores[action.productCategory] = (categoryScores[action.productCategory] || 0) + weight;
    }
  }
  
  const sortedCategories = Object.entries(categoryScores)
    .sort((a, b) => b[1] - a[1])
    .map(([category]) => category);
  
  return sortedCategories.slice(0, 3); // Top 3 categories
};

// Get user's price range preference
const getUserPriceRange = async (userId) => {
  const actions = await UserAction.find({ userId });
  
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  
  for (const action of actions) {
    if (action.productPrice) {
      minPrice = Math.min(minPrice, action.productPrice);
      maxPrice = Math.max(maxPrice, action.productPrice);
    }
  }
  
  return {
    min: minPrice === Infinity ? 0 : minPrice * 0.8,
    max: maxPrice === -Infinity ? 1000 : maxPrice * 1.2
  };
};

// Get products user has already interacted with
const getInteractedProductIds = async (userId) => {
  const actions = await UserAction.find({ userId });
  return [...new Set(actions.map(a => a.productId.toString()))];
};

// Main recommendation function
export const getRecommendations = async (userId, limit = 8) => {
  try {
    // Check if user has any actions
    const actionCount = await UserAction.countDocuments({ userId });
    
    // If new user (no actions), return popular products
    if (actionCount === 0) {
      return await getPopularProducts(limit);
    }
    
    // Get user preferences
    const preferredCategories = await getUserPreferredCategories(userId);
    const priceRange = await getUserPriceRange(userId);
    const interactedProducts = await getInteractedProductIds(userId);
    
    let recommendations = [];
    
    // Recommend from preferred categories first
    if (preferredCategories.length > 0) {
      recommendations = await Product.find({
        _id: { $nin: interactedProducts },
        stock: { $gt: 0 },
        category: { $in: preferredCategories }
      }).limit(limit);
    }
    
    // If not enough, recommend within price range
    if (recommendations.length < limit) {
      const remaining = limit - recommendations.length;
      const priceBased = await Product.find({
        _id: { $nin: interactedProducts },
        stock: { $gt: 0 },
        price: { $gte: priceRange.min, $lte: priceRange.max }
      }).limit(remaining);
      
      recommendations = [...recommendations, ...priceBased];
    }
    
    // If still not enough, fill with popular products
    if (recommendations.length < limit) {
      const remaining = limit - recommendations.length;
      const popular = await getPopularProducts(remaining);
      recommendations = [...recommendations, ...popular];
    }
    
    // Remove duplicates
    const uniqueRecommendations = [];
    const seenIds = new Set();
    for (const product of recommendations) {
      if (!seenIds.has(product._id.toString())) {
        seenIds.add(product._id.toString());
        uniqueRecommendations.push(product);
      }
    }
    
    return uniqueRecommendations.slice(0, limit);
    
  } catch (error) {
    console.error('Recommendation error:', error);
    return await getPopularProducts(limit);
  }
};

// Get popular products (based on purchases)
export const getPopularProducts = async (limit = 8) => {
  const popular = await UserAction.aggregate([
    { $match: { action: 'purchase' } },
    { $group: { _id: '$productId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product'
      }
    },
    { $unwind: '$product' }
  ]);
  
  if (popular.length === 0) {
    return await Product.find({ stock: { $gt: 0 } }).limit(limit);
  }
  
  return popular.map(p => p.product);
};

// Track user action
export const trackAction = async (userId, productId, actionType) => {
  try {
    const product = await Product.findById(productId);
    if (!product) return false;
    
    await UserAction.create({
      userId,
      productId,
      action: actionType,
      productCategory: product.category,
      productPrice: product.price
    });
    
    return true;
  } catch (error) {
    console.error('Track error:', error);
    return false;
  }
};