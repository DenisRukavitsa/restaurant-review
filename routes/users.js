const express = require('express');
const userController = require('../controllers/user');
const auth = require('../middleware/auth');

const router = express.Router();

router.get(
  '/',
  auth.verifyToken,
  auth.checkAccess(['admin']),
  userController.getUsers,
);

router.post(
  '/login',
  userController.loginUser,
);

router.post(
  '/',
  userController.createUser,
);

router.patch(
  '/:id',
  auth.verifyToken,
  auth.checkAccess(['admin']),
  userController.updateUser,
);

router.delete(
  '/:id',
  auth.verifyToken,
  auth.checkAccess(['admin']),
  userController.deleteUser,
);

module.exports = router;
