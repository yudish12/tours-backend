const Booking = require('../models/bookings');
const tours = require('../models/tours');
const reviews = require('../models/review');
const catchAsync = require('../utils/catchAsync');
const axios = require('axios');

const showLandingPage = catchAsync(async (req, res) => {
  const response = await axios.get(
    'http://localhost:5000/api/v1/tours/top5cheap'
  );
  res.status(200).render('landing', {
    title: 'Welcome to Natours',
    response: response.data.data,
  });
});

const getOverview = catchAsync(async (req, res) => {
  const tourArr = await tours.find();
  res.status(200).render('overview', {
    title: 'All Tours',
    tourArr,
  });
});

const getTour = catchAsync(async (req, res) => {
  const { slug } = req.params;

  const tourData = await tours.findOne({ slug: slug }).populate({
    path: 'reviews',
  });

  res.status(200).render('tour', {
    title: tourData.name,
    tourData,
  });
});

const getLoginForm = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'Login to your account',
  });
});

const getSignupForm = catchAsync(async (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up',
  });
});

const getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your account',
  });
});

const getForgotPassword = catchAsync(async (req, res, next) => {
  res.status(200).render('forgotPassword', {
    title: 'Reset Password',
  });
});

const getMytours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user._id });

  const tourIds = bookings.map((el) => el.tour);

  const tourArr = await tours.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tourArr,
  });
});

const getMyReviewPage = catchAsync(async (req, res, next) => {
  res.status(200).render('review', {
    title: 'Share Your Experience',
  });
});

const canAddReview = catchAsync(async (req, res, next) => {
  const bookingIds = await Booking.find({
    $and: [{ user: req.user._id }, { tour: req.params.tourId }],
  });

  if (bookingIds.length === 0) {
    return res.render('error', {
      title: 'Bad Request',
      code: 400,
      message: 'User Must buy a tour before reviewing it',
    });
  }

  next();
});

const getMyReviews = catchAsync(async (req, res, next) => {
  const reviewsArr = await reviews.find({ user: req.user._id });

  res.status(200).render('myReviews', {
    title: `${req.user.name}'s reviews`,
    reviewsArr,
  });
});

const manageReviewPage = catchAsync(async (req, res, next) => {
  const reviewsArr = await reviews.find({ approved: false });

  res.status(200).render('adminReviews', {
    title: 'Manage Reviews',
    reviewsArr,
  });
});

module.exports = {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getMyReviewPage,
  getForgotPassword,
  getMytours,
  getAccount,
  canAddReview,
  getMyReviews,
  manageReviewPage,
  showLandingPage,
};
