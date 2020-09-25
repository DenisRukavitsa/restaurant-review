const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { errorHandler } = require('./helper');

const userFields = ['name', 'email', 'role'];

/**
 * Generating JSON web token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
};

/**
 * Fetching all the users
 */
exports.getUsers = (req, res) => {
  return User
    .find()
    .select(userFields.join(' '))
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => errorHandler(err, res));
};

/**
 * User login
 */
exports.loginUser = (req, res) => {
  let user = null;

  // Finding user by email
  return User
    .findOne({ email: req.body.email })
    .select(`${userFields.join(' ')} password`)
    .then(result => {
      if (!result) return res.status(401).json({ error: 'Auth failed' });
      user = result;

      // Comparing the password
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (res.headersSent) return;
      if (!result) return res.status(401).json({ error: 'Auth failed' });

      res.status(200).json({
        token: generateToken(user),
        id: user._id,
        name: user.name,
        role: user.role,
      });
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Creating a new user
 */
exports.createUser = (req, res) => {
  // Password length validation
  if (!req.body.password || req.body.password.length < 4) res.status(400).json({ error: 'Too short password' });

  const user = { _id: new mongoose.Types.ObjectId() };
  userFields.forEach(field => {
    user[field] = req.body[field];
  });

  // Hashing password and saving the user
  bcrypt
    .hash(req.body.password, 10)
    .then(hash => {
      user.password = hash;
      return new User(user).save();
    })
    .then(result => {
      res.status(201).json({
        token: generateToken(result),
        id: result._id,
        name: result.name,
        role: result.role,
      });
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Updating user by ID
 */
exports.updateUser = (req, res) => {
  const user = {};
  userFields.forEach(field => {
    if (req.body[field]) user[field] = req.body[field];
  });

  return User
    .updateOne({ _id: req.params.id }, { $set: user })
    .then(() => {
      res.status(200).json({ ok: 1 });
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Deleting user by ID
 */
exports.deleteUser = (req, res) => {
  return User
    .remove({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ ok: 1 });
    })
    .catch(err => errorHandler(err, res));
};
