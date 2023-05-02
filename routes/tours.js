const express = require('express');

const controllers = require('../controllers/tours');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/top5cheap').get(controllers.alias, controllers.getAllTours);
router.route('/stats').get(controllers.getTourStats);

router
  .route('/')
  .get(controllers.getAllTours)
  .post(
    authController.authMiddleware,
    authController.roleMiddleware('admin', 'lead-guide'),
    controllers.checkBody,
    controllers.createTour
  );

//tours-within/120/center/-40,45/unit/mi
router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(controllers.getToursWithin);

router.route('/distance/center/:latlng/unit/mi').get(controllers.getDistances);

router
  .route('/monthly-plan/:year')
  .get(
    authController.authMiddleware,
    authController.roleMiddleware('admin', 'lead-guide', 'guide'),
    controllers.getMonthlyPlan
  );

router
  .route('/:id')
  .get(controllers.getTour)
  .patch(
    authController.authMiddleware,
    authController.roleMiddleware('admin', 'lead-guide'),
    controllers.uploadTourImages,
    controllers.resizeTourImages,
    controllers.updateTour
  )
  .delete(
    authController.authMiddleware,
    authController.roleMiddleware('admin', 'lead-guide'),
    controllers.deleteTour
  );

router.use(
  authController.authMiddleware,
  authController.roleMiddleware('user')
);

router
  .route('/:tourId/reviews')
  .post(reviewController.createReview)
  .get(reviewController.getAllReviews)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
