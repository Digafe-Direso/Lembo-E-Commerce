// API Constants
export const API_URL = 'http://localhost:5000/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  PROFILE: `${API_URL}/auth/profile`,
  
  // Products
  PRODUCTS: `${API_URL}/products`,
  PRODUCT: (id) => `${API_URL}/products/${id}`,
  
  // Orders
  ORDERS: `${API_URL}/orders`,
  MY_ORDERS: `${API_URL}/orders/myorders`,
  
  // AI
  AI_CHAT: `${API_URL}/ai/chat`,
  AI_SEARCH: `${API_URL}/ai/search`,
  AI_SUGGESTIONS: `${API_URL}/ai/suggestions`,
  
  // Admin
  ADMIN_USERS: `${API_URL}/admin/users`,
  ADMIN_PRODUCTS: `${API_URL}/admin/products`,
  ADMIN_ORDERS: `${API_URL}/admin/orders`,
  ADMIN_STATS: `${API_URL}/admin/stats`,
};