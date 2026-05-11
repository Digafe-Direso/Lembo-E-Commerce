// // Check if user is admin
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

// // Check if user is regular user
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
// Check if user is admin
// Check if user is admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
};

// Check if user is regular user
export const user = (req, res, next) => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. User only.'
    });
  }
};

// Check if user is admin or the specific user
export const adminOrSelf = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user._id.toString() === req.params.id)) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own data.'
    });
  }
};

// Check multiple roles
export const hasRole = (roles) => {
  return (req, res, next) => {
    if (req.user && roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }
  };
};