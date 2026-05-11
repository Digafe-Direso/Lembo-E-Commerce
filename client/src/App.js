// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext';
// import Navbar from './components/Navbar';
// import Home from './components/Home';
// import Login from './components/Login';
// import Signup from './components/Signup';
// import Products from './components/Products';
// import ProductDetail from './components/ProductDetail';
// import Cart from './components/Cart';
// import Checkout from './components/Checkout';
// import PrivateRoute from './components/PrivateRoute';
// import AdminRoute from './components/AdminRoute';
// import UserDashboard from './pages/UserDashboard';
// import UserOrders from './pages/UserOrders';
// import UserProfile from './pages/UserProfile';
// import AdminDashboard from './pages/AdminDashboard';
// import AdminUsers from './pages/AdminUsers';
// import AdminProducts from './pages/AdminProducts';
// import AdminOrders from './pages/AdminOrders';
// import MicrophoneTest from './components/MicrophoneTest';
// import NetworkTest from './components/NetworkTest';
// import AdminReports from './pages/AdminReports';
// import AIChatbot from './components/AIChatbot';

// import './App.css';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="app">
//           <Navbar />
//           <Toaster position="top-right" />
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/products" element={<Products />} />
//             <Route path="/product/:id" element={<ProductDetail />} />
//             <Route path="/cart" element={<Cart />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/signup" element={<Signup />} />
            
//             {/* User Routes (Protected) */}
//             <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
//             <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
//             <Route path="/my-orders" element={<PrivateRoute><UserOrders /></PrivateRoute>} />
//             <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            
//             {/* Admin Routes */}
//             <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
//             <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
//             <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
//             <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
//             <Route path="/test-mic" element={<MicrophoneTest />} />
//             <Route path="/test" element={<NetworkTest />} />
//             <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
//             <Route path="/my-orders" element={
//   <PrivateRoute>
//     <UserOrders />
//   </PrivateRoute>
// } />
//           </Routes>
//           <AIChatbot />
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import UserDashboard from './pages/UserDashboard';
import UserOrders from './pages/UserOrders';
import UserProfile from './pages/UserProfile';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminReports from './pages/AdminReports';
import MicrophoneTest from './components/MicrophoneTest';
import NetworkTest from './components/NetworkTest';
import AIChatbot from './components/AIChatbot';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Toaster position="top-right" />
          <Routes>
            {/* ========== PUBLIC ROUTES ========== */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Test Routes */}
            <Route path="/test-mic" element={<MicrophoneTest />} />
            <Route path="/test" element={<NetworkTest />} />
            
            {/* ========== USER PROTECTED ROUTES ========== */}
            <Route path="/checkout" element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            } />
            <Route path="/my-orders" element={
              <PrivateRoute>
                <UserOrders />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } />
            
            {/* ========== ADMIN PROTECTED ROUTES ========== */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/reports" element={
              <AdminRoute>
                <AdminReports />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            } />
            <Route path="/admin/products" element={
              <AdminRoute>
                <AdminProducts />
              </AdminRoute>
            } />
            <Route path="/admin/orders" element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            } />
          </Routes>
          
          {/* AI Chatbot - appears on all pages */}
          <AIChatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;