const express = require('express');
const reviewController = require('../controllers/review');
const auth = require('../middleware/auth');

const router = express.Router();

router.get(
  '/',
  reviewController.getReviews,
);

router.post(
  '/',
  auth.verifyToken,
  auth.checkAccess(['guest']),
  reviewController.createReview,
);

router.patch(
  '/:id',
  auth.verifyToken,
  auth.checkAccess(['owner', 'admin']),
  reviewController.updateReview,
);

router.delete(
  '/:id',
  auth.verifyToken,
  auth.checkAccess(['admin']),
  reviewController.deleteReview,
);

module.exports = router;
