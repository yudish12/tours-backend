const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');
const validator = require('validator');

const tours_schema = new Schema(
  {
    id: {
      type: Number,
      required: [true, 'A tour must have an id'],
      unique: [true, 'Duplicate id found'],
    },
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'A tour already exists by that name'],
    },
    slug: String,
    duration: Number,
    maxGroupSize: Number,
    difficulty: {
      type: String,
      enum: {
        values: ['difficult', 'medium', 'easy'],
        message: 'Difficulty can either be easy,medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      max: 5,
      min: 0,
      default: 3,
      set: (val) => Math.round(val * 10) / 10,
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
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount Price should be below regular price',
      },
    },
    summary: {
      type: String,
    },
    description: String,
    imageCover: String,
    images: [String],
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    guides: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tours_schema.index({ price: 1, ratingsAverage: -1 });

tours_schema.index({ slug: 1 });

tours_schema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

//populating reviews virtually
tours_schema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//Document Middleware runs before .save() and .create() but not on .insertMany()
tours_schema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

//Query middleware runs before .find()
tours_schema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

tours_schema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name email _id',
  });
  next();
});

//aggregation middleware runs before .aggregate
tours_schema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tours_schema);

module.exports = Tour;
