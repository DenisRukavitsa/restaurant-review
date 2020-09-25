const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');
const Review = require('../models/review');
const { errorHandler } = require('./helper');

const restaurantFields = ['name', 'description', 'ownerId'];

/**
 * Fetching list of restaurants sorted by the average rating
 */
exports.getRestaurants = (req, res) => {
  // Aggregating reviews by the restaurant average rating
  const aggregatePipeline = [
    {
      $group: {
        _id: '$restaurantId',
        averageRating: { $avg: '$rating' },
      },
    },
  ];

  // Combining query for fetching restaurants
  const restaurantsQuery = {};
  if (req.query.id) restaurantsQuery._id = req.query.id;
  if (req.query.ownerId) restaurantsQuery.ownerId = req.query.ownerId;

  return Promise
    .all([
      Review.aggregate(aggregatePipeline),
      Restaurant
        .find(restaurantsQuery)
        .select(restaurantFields.join(' '))
        .lean(),
    ])
    .then(([ratings, restaurants]) => {
      // Transforming ratings array to a map for quicker access
      const ratingsMap = {};
      ratings.forEach(rating => {
        ratingsMap[rating._id] = rating.averageRating;
      });

      // Merging restaurant data with its average rating and sorting by it
      restaurants.forEach(restaurant => {
        restaurant.averageRating = ratingsMap[restaurant._id]
          ? parseFloat(ratingsMap[restaurant._id].toFixed(1))
          : null;
      });

      // Filtering by rating
      if (req.query.rating) {
        restaurants = restaurants.filter(restaurant => {
          return restaurant.averageRating >= req.query.rating;
        });
      }

      restaurants.sort((a, b) => b.averageRating - a.averageRating);
      res.status(200).json(restaurants);
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Fetching list of restaurants with count of not replied reviews
 */
exports.getRestaurantsReviewsCount = (req, res) => {
  return Restaurant
    .find(req.query)
    .select('_id')
    .populate({
      path: 'reviews',
      select: '_id',
      match: {
        reply: { $exists: false },
      },
    })
    .lean()
    .then(restaurants => {
      // Transforming array to a map
      const result = {};
      restaurants.forEach(restaurant => {
        result[restaurant._id] = restaurant.reviews.length;
      });

      res.status(200).json(result);
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Creating a new restaurant
 */
exports.createRestaurant = (req, res) => {
  const restaurant = { _id: new mongoose.Types.ObjectId() };
  restaurantFields.forEach(field => {
    restaurant[field] = req.body[field];
  });
  restaurant.ownerId = req.user._id;

  return new Restaurant(restaurant)
    .save()
    .then(result => {
      res.status(201).json(result);
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Updating an existing restaurant by ID
 */
exports.updateRestaurant = (req, res) => {
  const restaurant = {};
  restaurantFields.forEach(field => {
    if (req.body[field]) restaurant[field] = req.body[field];
  });

  return Restaurant
    .updateOne({ _id: req.params.id }, { $set: restaurant })
    .then(() => {
      res.status(200).json({ ok: 1 });
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Deleting an existing restaurant by ID
 */
exports.deleteRestaurant = (req, res) => {
  return Restaurant
    .remove({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ ok: 1 });
    })
    .catch(err => errorHandler(err, res));
};
