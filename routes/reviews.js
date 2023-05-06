const express = require('express');

const controllers = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.authMiddleware);
router.use(authController.roleMiddleware('admin', 'user'));

router
  .route('/:reviewId')
  .patch(controllers.updateReview)
  .delete(controllers.deleteReview);

//CREATE un approved reviews
router.route('/').post(controllers.createReview);

router.use(authController.roleMiddleware('admin', 'lead-guide'));
//GET ALL REVIEWS
router.route('/').get(controllers.getAllReviews);

//APPROVE REVIEW
router.route('/approve/:id').patch(controllers.approveReview);
router.route('/decline/:id').patch(controllers.declineReview);

module.exports = router;
