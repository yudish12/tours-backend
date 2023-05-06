const mongoose = require('mongoose');
const tour = require('./tours');

const review_schema = mongoose.Schema(
  {
    review: {
      type: String,
      maxlength: [300, 'maximum 300 characters allowed in review'],
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      max: 5,
      min: 1,
      required: [true, 'Rating must be provided with review'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'review must belong to a tour'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'review must belong to a user'],
    },
    approved: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

review_schema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

review_schema.post('save', async function () {
  if (this.approved === true)
    await this.constructor.calcAverageRatings(this.tour);
});

review_schema.index(
  { tour: 1, user: 1 },
  {
    unique: true,
  }
);

// review_schema.pre(/^findOneAnd/, async function (next) {
//   console.log('x');
//   console.log(this);
//   next();
// });

// review_schema.post(/^findOneAnd/, async function (doc) {
//   console.log(doc);
//   console.log()
//   // const tourId = doc.tour;

//   // await tour.findByIdAndUpdate(tourId, {
//   //   ratingsQuantity: stats[0].nRating,
//   //   ratingsAverage: stats[0].avgRating,
//   // });
// });

review_schema.pre(/^find/, function (next) {
  console.log(this);
  this.populate({
    path: 'user',
    select: 'name email _id photo',
  });

  next();
});

const Review = mongoose.model('Review', review_schema);

module.exports = Review;
