// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Configure axios defaults
//   useEffect(() => {
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//     } else {
//       delete axios.defaults.headers.common['Authorization'];
//     }
//   }, [token]);

//   useEffect(() => {
//     if (token) {
//       loadUser();
//     } else {
//       setLoading(false);
//     }
//   }, [token]);

//   const loadUser = async () => {
//     try {
//       const response = await axios.get('http://localhost:5000/api/auth/profile');
//       setUser(response.data.user);
//       setError(null);
//     } catch (error) {
//       console.error('Load user error:', error);
//       localStorage.removeItem('token');
//       setToken(null);
//       setUser(null);
//       setError(error.response?.data?.message || 'Authentication failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
//       if (response.data.success) {
//         localStorage.setItem('token', response.data.token);
//         setToken(response.data.token);
//         setUser(response.data.user);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
//         return { success: true, data: response.data };
//       }
//       return { success: false, message: response.data.message };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed. Please check your credentials.'
//       };
//     }
//   };

//   const register = async (name, email, password) => {
//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      
//       if (response.data.success) {
//         localStorage.setItem('token', response.data.token);
//         setToken(response.data.token);
//         setUser(response.data.user);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
//         return { success: true, data: response.data };
//       }
//       return { success: false, message: response.data.message };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Registration failed. Please try again.'
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//     setUser(null);
//     delete axios.defaults.headers.common['Authorization'];
//   };

//   // Values (not functions)
//   const isAuthenticated = !!user;
//   const isAdmin = user?.role === 'admin';
//   const isUser = user?.role === 'user';

//   return (
//     <AuthContext.Provider value={{
//       user,
//       token,
//       loading,
//       error,
//       login,
//       register,
//       logout,
//       isAuthenticated,
//       isAdmin,
//       isUser
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user on token change
  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/profile');
      setUser(response.data.user);
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem('token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        setUser(response.data.user);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  // These are VALUES (booleans), not functions
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      register,
      logout,
      isAuthenticated,  // This is a boolean value
      isAdmin,          // This is a boolean value
      isUser            // This is a boolean value
    }}>
      {children}
    </AuthContext.Provider>
  );
};