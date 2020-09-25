const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const ReviewSchema = new Schema({
  _id: ObjectId,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: { type: String, required: true },
  dateOfVisit: { type: Date, required: true },
  reply: String,
  authorId: { type: ObjectId, ref: 'User', required: true },
  restaurantId: { type: ObjectId, ref: 'Restaurant', required: true },
  createdAt: { type: Date, required: true },
}, { versionKey: false });

module.exports = mongoose.model('Review', ReviewSchema);
