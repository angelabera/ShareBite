const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Ngo = require('../models/Ngo');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Try to find user or NGO
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      req.user = await Ngo.findById(decoded.id).select('-password');
    }
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user.role = decoded.role || 'user';
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};
