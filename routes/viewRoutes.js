const express = require('express');

const controllers = require('../controllers/viewController');
const {
  isLoggedIn,
  authMiddleware,
  resetPassword,
} = require('../controllers/authController');
const { createBooking } = require('../controllers/BookingController');

const router = express.Router();

router.get('/', createBooking, isLoggedIn, controllers.getOverview);

router.get('/tour/:slug', isLoggedIn, controllers.getTour);

router.get('/login', isLoggedIn, controllers.getLoginForm);
router.get('/signup', isLoggedIn, controllers.getSignupForm);
router.get('/me', authMiddleware, controllers.getAccount);
router.get(
  '/forgotPassword/:token',
  resetPassword,
  controllers.getForgotPassword
);

router.get('/my-tours', authMiddleware, controllers.getMytours);

module.exports = router;
