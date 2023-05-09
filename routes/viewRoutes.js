const express = require('express');

const controllers = require('../controllers/viewController');
const {
  isLoggedIn,
  authMiddleware,
  resetPassword,
  roleMiddleware,
} = require('../controllers/authController');
const { createBooking } = require('../controllers/BookingController');

const router = express.Router();

router.get('/', createBooking, isLoggedIn, controllers.getOverview);

router.get('/overview', isLoggedIn, controllers.showLandingPage);

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
router.get(
  '/addMyReview/:tourId',
  authMiddleware,
  controllers.canAddReview,
  controllers.getMyReviewPage
);
router.get('/my-reviews', authMiddleware, controllers.getMyReviews);

router.use(authMiddleware);
router.use(roleMiddleware('admin', 'lead-guide'));

router.get('/manageReview', controllers.manageReviewPage);

module.exports = router;
