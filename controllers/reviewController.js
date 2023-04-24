const reviews = require('../models/review');
const tours = require('../models/tours');
const catchAsync = require('../utils/catchAsync');

const getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }

  const data = await reviews.find(filter);

  res.status(200).json({
    status: 'Success',
    size: data.length,
    data: data,
  });
});

const createReview = catchAsync(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user._id;
  if (!req.body.tour) req.body.tour = req.params.tourId;

  const newReview = await reviews.create(req.body);

  res.status(200).json({
    status: 'Success',
    data: {
      review: newReview,
    },
  });
});

const updateReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;
  const doc = await reviews.findOne({ _id: reviewId });
  const oldRating = doc.rating;
  const newRating = req.body.rating;

  const data = await reviews.findByIdAndUpdate(reviewId, req.body);

  const tourId = doc.tour;

  if (newRating) {
    console.log('x');
    const tourData = await tours.findById(tourId);
    const { ratingsQuantity } = tourData;
    const { ratingsAverage } = tourData;
    let sum = ratingsAverage * ratingsQuantity;

    sum -= oldRating;

    const avg = (sum + newRating) / ratingsQuantity;

    await tours.findByIdAndUpdate(tourId, { ratingsAverage: avg });
  }
  return res.status(200).json({
    status: 'Success',
    data: data,
  });
});

const deleteReview = catchAsync(async (req, res, next) => {
  const { reviewId } = req.params;
  const doc = await reviews.findById(reviewId);
  console.log(doc);
  const tourId = doc.tour;
  const rating = doc.rating;
  const data = await reviews.findByIdAndDelete(reviewId);
  const { ratingsAverage, ratingsQuantity } = await tours.findById(tourId);
  if (data) {
    let sum = ratingsAverage * ratingsQuantity;
    sum -= rating;
    const avg = sum / ratingsQuantity;
    await tours.findByIdAndUpdate(tourId, {
      $inc: { ratingsQuantity: -1 },
      ratingsAverage: avg,
    });
  }

  res.status(200).json({
    status: 'Success',
    data: data,
  });
});

module.exports = { getAllReviews, createReview, updateReview, deleteReview };
