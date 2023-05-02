const tours = require('../models/tours');
const catchAsync = require('../utils/catchAsync');

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

module.exports = {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getForgotPassword,
  getAccount,
};
