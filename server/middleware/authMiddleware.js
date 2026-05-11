// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// // Protect middleware - checks if user is authenticated
// export const protect = async (req, res, next) => {
//   let token;

//   if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
//     try {
//       token = req.headers.authorization.split(' ')[1];
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = await User.findById(decoded.id).select('-password');
      
//       if (!req.user) {
//         return res.status(401).json({
//           success: false,
//           message: 'User not found'
//         });
//       }
      
//       if (!req.user.isActive) {
//         return res.status(401).json({
//           success: false,
//           message: 'Account is deactivated. Please contact admin.'
//         });
//       }
      
//       next();
//     } catch (error) {
//       console.error('Auth error:', error);
//       return res.status(401).json({
//         success: false,
//         message: 'Not authorized, token failed'
//       });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: 'Not authorized, no token'
//     });
//   }
// };

// // Admin middleware - checks if user has admin role
// export const admin = (req, res, next) => {
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     return res.status(403).json({
//       success: false,
//       message: 'Access denied. Admin only.'
//     });
//   }
// };

// // User middleware - checks if user has user role
// export const user = (req, res, next) => {
//   if (req.user && req.user.role === 'user') {
//     next();
//   } else {
//     return res.status(403).json({
//       success: false,
//       message: 'Access denied. User only.'
//     });
//   }
// };

// // Check if user is admin or the specific user
// export const adminOrSelf = (req, res, next) => {
//   if (req.user && (req.user.role === 'admin' || req.user._id.toString() === req.params.id)) {
//     next();
//   } else {
//     return res.status(403).json({
//       success: false,
//       message: 'Access denied. You can only access your own data.'
//     });
//   }
// };

// // Check multiple roles
// export const hasRole = (roles) => {
//   return (req, res, next) => {
//     if (req.user && roles.includes(req.user.role)) {
//       next();
//     } else {
//       return res.status(403).json({
//         success: false,
//         message: `Access denied. Required roles: ${roles.join(', ')}`
//       });
//     }
//   };
// };
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }
      
      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Account is deactivated. Please contact admin.'
        });
      }
      
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};