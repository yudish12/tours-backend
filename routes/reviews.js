const express = require('express');

const controllers = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.authMiddleware);
router.use(authController.roleMiddleware('user'));

router
  .route('/:reviewId')
  .patch(controllers.updateReview)
  .delete(controllers.deleteReview);

router.use(authController.roleMiddleware('admin', 'lead-guide'));
router.route('/').get(controllers.getAllReviews).post(controllers.createReview);

module.exports = router;
