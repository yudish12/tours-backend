const express = require('express');

const controllers = require('../controllers/tours');

const router = express.Router();

router.param('id', controllers.checkID);

router
  .route('/')
  .get(controllers.getAllTours)
  .post(controllers.checkBody, controllers.createTour);

router.route('/top5cheap').get(controllers.alias, controllers.getAllTours);

router.route('/stats').get(controllers.getTourStats);

router.route('/monthly-plan/:year').get(controllers.getMonthlyPlan);

router
  .route('/:id')
  .get(controllers.getTour)
  .patch(controllers.updateTour)
  .delete(controllers.deleteTour);

module.exports = router;
