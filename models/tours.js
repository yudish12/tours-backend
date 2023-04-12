const mongoose = require('mongoose');
const { Schema } = mongoose;

const tours_schema = new Schema({
  id: {
    type: Number,
    required: [true, 'A tour must have an id'],
  },
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  duration: Number,
  maxGroupSize: Number,
  difficulty: String,
  ratingsAverage: {
    type: Number,
    max: 5,
    min: 0,
    default: 3,
  },
  ratingsQuantity: {
    type: Number,
    min: 0,
    default: 10,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  summary: {
    type: String,
  },
  description: String,
  imageCover: String,
  images: [String],
  startDates: [Date],
});

const Tour = mongoose.model('Tour', tours_schema);

module.exports = Tour;
