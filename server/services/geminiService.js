import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
let model = null;

// Initialize Gemini AI
const initializeGemini = () => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      console.log('⚠️ Gemini API key not configured. AI features will be disabled.');
      return false;
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
    console.log('✅ Gemini AI initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Gemini initialization failed:', error.message);
    return false;
  }
};

// Generate AI response for chatbot with context
export const generateChatResponse = async (message, productContext, userHistory = null, userInfo = null) => {
  if (!model) return null;
  
  try {
    const systemPrompt = `You are a professional, friendly e-commerce shopping assistant for an online store called "E-Shop".

STORE INFORMATION:
- Store Name: E-Shop
- Products available: ${productContext || 'Various products across electronics, fashion, books, and home goods'}
- Return Policy: 30-day easy returns
- Shipping: Free shipping on orders over $50
- Payment: Cash on Delivery & Credit/Debit Cards

CURRENT USER: ${userInfo ? `${userInfo.name} (${userInfo.role})` : 'Not logged in'}

PREVIOUS CONVERSATION: ${userHistory || 'No previous conversation'}

INSTRUCTIONS:
1. Be extremely helpful, friendly, and professional
2. Recommend specific products from the available list
3. Include product names and prices when recommending
4. Ask clarifying questions if needed to understand user needs
5. Keep responses concise but informative (max 200 words)
6. Suggest alternatives if product not available
7. Help with navigation, orders, returns, and general inquiries
8. Use emojis occasionally to make responses engaging but professional

HUMAN QUERY: ${message}

ASSISTANT RESPONSE:`;
    
    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return null;
  }
};

// Analyze user sentiment and intent
export const analyzeIntent = async (message) => {
  if (!model) return null;
  
  try {
    const prompt = `Analyze this customer message and return ONLY JSON:
    Message: "${message}"
    
    Return JSON format:
    {
      "intent": "product_search|price_check|recommendation|support|order_tracking|complaint|greeting|other",
      "category": "electronics|fashion|books|home|unknown",
      "sentiment": "positive|neutral|negative",
      "urgency": "high|medium|low",
      "price_range": {"min": null, "max": null},
      "keywords": []
    }`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return null;
  } catch (error) {
    console.error('Intent analysis error:', error);
    return null;
  }
};

// Generate product recommendations based on user query
export const generateRecommendations = async (query, products) => {
  if (!model) return null;
  
  try {
    const prompt = `Based on user query: "${query}"
    
    Available products: ${JSON.stringify(products.map(p => ({ id: p._id, name: p.name, price: p.price, category: p.category })))}
    
    Return ONLY a JSON array of product IDs (5 maximum) that best match the user's request, ordered by relevance.
    Example: ["productId1", "productId2", "productId3"]`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch (error) {
    console.error('Recommendation error:', error);
    return [];
  }
};

// Generate product description
export const generateProductDescription = async (name, category, features) => {
  if (!model) return null;
  
  try {
    const prompt = `Write an SEO-optimized product description for:
    Product Name: ${name}
    Category: ${category}
    Features: ${features.join(', ')}
    
    Requirements:
    - Engaging and persuasive
    - Include SEO keywords naturally
    - Highlight benefits, not just features
    - 150-200 words
    - End with a call to action`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Description generation error:', error);
    return null;
  }
};

// Check if AI is available
export const isAIAvailable = () => {
  return model !== null;
};

// Initialize AI on module load
initializeGemini();

export default {
  generateChatResponse,
  analyzeIntent,
  generateRecommendations,
  generateProductDescription,
  isAIAvailable
};