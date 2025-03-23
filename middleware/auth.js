const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Store userId in req.user
    req.role = decoded.role; // Store role in req.role
    next();
  } catch (error) {
    console.error('Error in authMiddleware:', error.message, error.stack);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
