const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');

const isAuthenticatedAndAuthorized = (req, res, next) => {
  try {
      // First check session authentication
      if (req.isAuthenticated() && req.user) {
          req.userId = req.user.userId || req.user._id;
          return next();
      }

      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
              success: false,
              message: 'Access denied. No token provided.'
          });
      }

      const token = authHeader.split(' ')[1];
      
      try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
          req.userId = decoded.id;
          next();
      } catch (error) {
          return res.status(401).json({
              success: false,
              message: 'Invalid token.'
          });
      }
  } catch (error) {
      return res.status(500).json({
          success: false,
          message: 'Internal server error during authentication.'
      });
  }
};

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
};

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later.'
});

module.exports = {
    isAuthenticatedAndAuthorized,
    isAuthenticated,
    authLimiter
};
