const express = require('express');
const auth = require('../middleware/auth');
const restaurantController = require('../controllers/restaurant');

const router = express.Router();

router.get('/', restaurantController.getRestaurants);

router.get(
  '/reviews-count',
  auth.verifyToken,
  auth.checkAccess(['owner']),
  restaurantController.getRestaurantsReviewsCount,
);

router.post(
  '/',
  auth.verifyToken,
  auth.checkAccess(['owner']),
  restaurantController.createRestaurant,
);

router.patch(
  '/:id',
  auth.verifyToken,
  auth.checkAccess(['owner', 'admin']),
  auth.checkOwnerId,
  restaurantController.updateRestaurant,
);

router.delete(
  '/:id',
  auth.verifyToken,
  auth.checkAccess(['owner', 'admin']),
  auth.checkOwnerId,
  restaurantController.deleteRestaurant,
);

module.exports = router;
