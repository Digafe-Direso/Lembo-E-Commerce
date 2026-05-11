import Product from '../models/Product.js';
import Order from '../models/Order.js';

class AIChatbotService {
  constructor() {
    this.conversations = new Map();
  }

  // Get conversation history
  getConversation(sessionId) {
    if (!this.conversations.has(sessionId)) {
      this.conversations.set(sessionId, []);
    }
    return this.conversations.get(sessionId);
  }

  // Save conversation
  saveConversation(sessionId, messages) {
    this.conversations.set(sessionId, messages);
  }

  // Clear conversation
  clearConversation(sessionId) {
    this.conversations.delete(sessionId);
  }

  // Generate AI response based on user message
  async generateResponse(message, sessionId, userId = null) {
    const lowerMessage = message.toLowerCase();
    const conversation = this.getConversation(sessionId);
    
    // Add user message to conversation
    conversation.push({ role: 'user', content: message, timestamp: new Date() });
    
    let response = '';
    let recommendedProducts = [];
    
    // Get products from database
    const products = await Product.find({ stock: { $gt: 0 } }).limit(30);
    
    // ============= GREETING RESPONSES =============
    if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
      response = "👋 Hello! Welcome to E-Shop! I'm your AI shopping assistant. How can I help you today? You can ask me about:\n\n• 📱 Products and prices\n• 🔍 Finding specific items\n• ⭐ Recommendations\n• 📦 Order tracking\n• 🚚 Shipping information";
    }
    
    // ============= PRODUCT SEARCH =============
    else if (lowerMessage.includes('search') || lowerMessage.includes('find') || lowerMessage.includes('looking for')) {
      let searchTerm = message.replace(/search for|search|find|looking for|show me|show/i, '').trim();
      if (searchTerm.length < 2) {
        searchTerm = lowerMessage.split(' ').slice(-2).join(' ');
      }
      
      const foundProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      
      if (foundProducts.length > 0) {
        response = `🔍 I found ${foundProducts.length} product(s) matching "${searchTerm}":\n\n`;
        foundProducts.forEach(p => {
          response += `• **${p.name}** - $${p.price} (${p.category})\n`;
        });
        response += `\nWould you like more details about any of these products?`;
        recommendedProducts = foundProducts;
      } else {
        response = `❌ I couldn't find any products matching "${searchTerm}". Try searching for something else like "laptop", "shoes", "headphones", or "books".`;
      }
    }
    
    // ============= CATEGORY BROWSING =============
    else if (lowerMessage.includes('electronics')) {
      const electronics = products.filter(p => p.category === 'Electronics').slice(0, 5);
      if (electronics.length > 0) {
        response = "📱 Here are our top electronics:\n\n";
        electronics.forEach(p => {
          response += `• **${p.name}** - $${p.price}\n`;
        });
        response += `\nWant to see more electronics? Visit our Electronics category!`;
        recommendedProducts = electronics;
      } else {
        response = "📱 We have a great selection of electronics including laptops, smartphones, headphones, and smartwatches!";
      }
    }
    
    else if (lowerMessage.includes('fashion') || lowerMessage.includes('clothing') || lowerMessage.includes('shoes')) {
      const fashion = products.filter(p => p.category === 'Fashion').slice(0, 5);
      if (fashion.length > 0) {
        response = "👕 Check out our fashionable items:\n\n";
        fashion.forEach(p => {
          response += `• **${p.name}** - $${p.price}\n`;
        });
        response += `\nExplore more in our Fashion section!`;
        recommendedProducts = fashion;
      } else {
        response = "👕 We have trendy fashion items including clothes, shoes, bags, and accessories!";
      }
    }
    
    else if (lowerMessage.includes('books')) {
      const books = products.filter(p => p.category === 'Books').slice(0, 5);
      if (books.length > 0) {
        response = "📚 Here are some popular books:\n\n";
        books.forEach(p => {
          response += `• **${p.name}** - $${p.price}\n`;
        });
        response += `\nCheck out our complete book collection!`;
        recommendedProducts = books;
      } else {
        response = "📚 We have a wide selection of books across various genres!";
      }
    }
    
    // ============= PRICE INQUIRY =============
    else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('how much')) {
      const words = message.split(' ');
      let productName = '';
      for (const word of words) {
        if (!['price', 'cost', 'how', 'much', 'what', 'is', 'the', 'of', 'for'].includes(word.toLowerCase())) {
          productName += word + ' ';
        }
      }
      productName = productName.trim();
      
      if (productName) {
        const product = products.find(p => p.name.toLowerCase().includes(productName.toLowerCase()));
        if (product) {
          response = `💰 The **${product.name}** costs $${product.price}. Stock available: ${product.stock} units.\n\nWould you like to add it to your cart?`;
          recommendedProducts = [product];
        } else {
          response = `💰 I couldn't find pricing for "${productName}". Could you be more specific with the product name?`;
        }
      } else {
        response = "💰 Our products range from affordable to premium. Our cheapest items start at $10, and premium products go up to $1000. Is there a specific product you're interested in?";
      }
    }
    
    // ============= RECOMMENDATIONS =============
    else if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best') || lowerMessage.includes('top')) {
      const topProducts = [...products].sort((a, b) => (b.ratings || 0) - (a.ratings || 0)).slice(0, 5);
      response = "⭐ Based on customer ratings, here are our top recommendations:\n\n";
      topProducts.forEach(p => {
        response += `• **${p.name}** - $${p.price} (${p.ratings || 0}⭐)\n`;
      });
      response += `\nThese are our best-selling products with the highest customer satisfaction!`;
      recommendedProducts = topProducts;
    }
    
    // ============= AFFORDABLE PRODUCTS =============
    else if (lowerMessage.includes('affordable') || lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('under')) {
      let priceLimit = 50;
      const priceMatch = lowerMessage.match(/under\s*\$?(\d+)/);
      if (priceMatch) {
        priceLimit = parseInt(priceMatch[1]);
      }
      
      const affordable = products.filter(p => p.price <= priceLimit).slice(0, 5);
      if (affordable.length > 0) {
        response = `💵 Here are affordable products under $${priceLimit}:\n\n`;
        affordable.forEach(p => {
          response += `• **${p.name}** - $${p.price}\n`;
        });
        response += `\nGreat value for money!`;
        recommendedProducts = affordable;
      } else {
        response = `💵 I couldn't find products under $${priceLimit}. Try increasing your budget or check our sale section!`;
      }
    }
    
    // ============= ORDER HELP =============
    else if (lowerMessage.includes('order') || lowerMessage.includes('track')) {
      if (userId) {
        const userOrders = await Order.find({ user: userId }).limit(3);
        if (userOrders.length > 0) {
          response = "📦 Here are your recent orders:\n\n";
          userOrders.forEach(order => {
            response += `• Order #${order._id.toString().slice(-8)} - Status: ${order.status} - Total: $${order.totalPrice}\n`;
          });
          response += `\nYou can view full order details in your Dashboard.`;
        } else {
          response = "📦 You don't have any orders yet. Would you like me to help you find some products to get started?";
        }
      } else {
        response = "📦 To track your orders, please login to your account first. You can then view all your orders in the Dashboard.";
      }
    }
    
    // ============= SHIPPING HELP =============
    else if (lowerMessage.includes('shipping') || lowerMessage.includes('delivery')) {
      response = "🚚 **Shipping Information:**\n\n• Free shipping on orders over $50\n• Standard delivery: 3-5 business days\n• Express delivery: 1-2 business days (additional $10)\n• International shipping available to select countries\n\nWould you like to know more about our shipping policy?";
    }
    
    // ============= RETURN POLICY =============
    else if (lowerMessage.includes('return') || lowerMessage.includes('refund') || lowerMessage.includes('exchange')) {
      response = "🔄 **Return Policy:**\n\n• 30-day easy returns\n• Free returns for defective items\n• Refund processed within 5-7 business days\n• Items must be in original condition\n\nContact our support team for return assistance.";
    }
    
    // ============= CART HELP =============
    else if (lowerMessage.includes('cart')) {
      response = "🛒 **Shopping Cart Help:**\n\n• Add items by clicking 'Add to Cart'\n• Update quantities in cart page\n• Apply coupon codes at checkout\n• Save items for later with wishlist\n\nReady to checkout? Go to your cart and click 'Proceed to Checkout'!";
    }
    
    // ============= PAYMENT HELP =============
    else if (lowerMessage.includes('payment') || lowerMessage.includes('pay')) {
      response = "💳 **Payment Methods:**\n\n• Credit/Debit Cards (Visa, Mastercard, American Express)\n• PayPal\n• Cash on Delivery (COD)\n• Mobile Money\n\nAll payments are 100% secure and encrypted.";
    }
    
    // ============= HELP MENU =============
    else if (lowerMessage.includes('help') || lowerMessage === 'menu' || lowerMessage === 'options') {
      response = "🤖 **I can help you with:**\n\n• 🔍 **Find products** - 'Search for laptop'\n• 💰 **Check prices** - 'How much is iPhone?'\n• ⭐ **Get recommendations** - 'Show me best sellers'\n• 📂 **Browse categories** - 'Show electronics'\n• 📦 **Track orders** - 'Where is my order?'\n• 🚚 **Shipping info** - 'Shipping policy'\n• 🔄 **Returns** - 'Return policy'\n\nWhat would you like to know?";
    }
    
    // ============= DEFAULT RESPONSE =============
    else {
      response = "🤔 I'm here to help! Here's what I can do:\n\n• 🔍 Search for products\n• 💰 Check prices\n• ⭐ Get recommendations\n• 📦 Track orders\n• 🚚 Shipping information\n\nTry asking: 'Search for laptop under $500' or 'Show me popular electronics'";
      
      // Try to find relevant products based on any keyword
      const keywords = message.split(' ');
      for (const keyword of keywords) {
        if (keyword.length > 3) {
          const matches = products.filter(p => 
            p.name.toLowerCase().includes(keyword.toLowerCase()) ||
            p.category.toLowerCase().includes(keyword.toLowerCase())
          ).slice(0, 3);
          
          if (matches.length > 0) {
            response = `🔍 Did you mean something like this?\n\n`;
            matches.forEach(p => {
              response += `• **${p.name}** - $${p.price}\n`;
            });
            response += `\nClick on any product to view details!`;
            recommendedProducts = matches;
            break;
          }
        }
      }
    }
    
    // Add assistant response to conversation
    conversation.push({ role: 'assistant', content: response, timestamp: new Date(), products: recommendedProducts });
    
    // Keep only last 10 messages
    if (conversation.length > 20) {
      const trimmed = conversation.slice(-20);
      this.saveConversation(sessionId, trimmed);
    } else {
      this.saveConversation(sessionId, conversation);
    }
    
    return { response, recommendedProducts };
  }
}

export default new AIChatbotService();