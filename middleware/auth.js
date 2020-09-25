const jwt = require('jsonwebtoken');
const Restaurant = require('../models/restaurant');

// Verifying token passed in the request header
exports.verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Auth failed' });
  }
};

// Checking if user is among the roles which have access to the resource
exports.checkAccess = (roles) => {
  return (req, res, next) => {
    if (roles.includes(req.user.role)) next();
    else res.status(403).json({ error: 'Access restricted' });
  };
};

// Checking if owner owns the restaurant he tries to modify
exports.checkOwnerId = (req, res, next) => {
  return Restaurant
    .findOne({ _id: req.params.id })
    .then(restaurant => {
      if (req.user.role === 'owner' && restaurant.ownerId.toString() !== req.user._id) {
        return res.status(403).json({ error: 'Access restricted' });
      }

      next();
    });
};
