// server/controllers/searchController.js
export const aiSearch = async (req, res) => {
  try {
    const { query } = req.query;
    
    // Use Gemini for semantic understanding
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `Extract search intent from: "${query}"
    Output JSON with: category, priceRange, brand, keywords, productType`;
    
    const result = await model.generateContent(prompt);
    const searchIntent = JSON.parse(result.response.text());
    
    // Build MongoDB query from AI-extracted intent
    const products = await Product.find({
      $or: [
        { name: { $regex: searchIntent.keywords, $i: true } },
        { category: searchIntent.category },
        { description: { $regex: searchIntent.keywords, $i: true } }
      ]
    }).limit(20);
    
    res.json({ success: true, products, searchIntent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};