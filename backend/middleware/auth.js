const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Middleware: Verify JWT and attach decoded user to req.user
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : null;

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Authentication token is required',
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid or expired token. Please log in again.',
    });
  }
};

/**
 * Middleware: Allow only admin users (must be used after authenticateToken)
 */
const requireAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('role');
    if (!user) {
      return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    if (user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Admin access required' });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'Authorization check failed' });
  }
};

module.exports = { authenticateToken, requireAdmin };
