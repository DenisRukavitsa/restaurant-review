const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const RestaurantSchema = new Schema({
  _id: ObjectId,
  name: { type: String, required: true },
  description: { type: String, required: true },
  ownerId: { type: ObjectId, ref: 'User', required: true },
  reviews: [{ type: ObjectId, ref: 'Review' }],
}, { versionKey: false });

module.exports = mongoose.model('Restaurant', RestaurantSchema);
