const mongoose = require('mongoose');
const Review = require('../models/review');
const Restaurant = require('../models/restaurant');
const { errorHandler } = require('./helper');

const reviewFields = ['rating', 'comment', 'dateOfVisit', 'reply', 'authorId', 'restaurantId', 'createdAt'];

/**
 * Fetching all reviews
 */
exports.getReviews = (req, res) => {
  return Review
    .find(req.query)
    .select(reviewFields.join(' '))
    .populate('authorId', 'name')
    .sort({ createdAt: -1 })
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Creating a new review
 */
exports.createReview = (req, res) => {
  const review = { _id: new mongoose.Types.ObjectId() };
  reviewFields.forEach(field => {
    review[field] = req.body[field];
  });
  review.authorId = req.user._id;
  review.createdAt = new Date();

  // Saving the new review to the DB
  let createdReview = null;
  return new Review(review)
    .save()
    .then(result => {
      createdReview = result.toObject();
      createdReview.userName = req.user.name;

      // Adding the newly created review ID to the list of reviews of the appropriate restaurant
      return Restaurant.update(
        { _id: req.body.restaurantId },
        {
          $push: {
            reviews: createdReview._id,
          },
        },
      );
    })
    .then(() => {
      res.status(201).json(createdReview);
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Updating an existing review by ID
 */
exports.updateReview = (req, res) => {
  const review = {};
  reviewFields.forEach(field => {
    if (req.body[field]) review[field] = req.body[field];
  });

  return Review
    .updateOne({ _id: req.params.id }, { $set: review })
    .then(() => {
      res.status(200).json({ ok: 1 });
    })
    .catch(err => errorHandler(err, res));
};

/**
 * Deleting an existing review by ID
 */
exports.deleteReview = (req, res) => {
  return Review
    .remove({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ ok: 1 });
    })
    .catch(err => errorHandler(err, res));
};
