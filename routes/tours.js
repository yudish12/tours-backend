const express = require('express');

const controllers = require('../controllers/tours');

const router = express.Router();

router.param('id', controllers.checkID);

router
  .route('/')
  .get(controllers.getAllTours)
  .post(controllers.checkBody, controllers.createTour);

router
  .route('/:id')
  .get(controllers.getTour)
  .patch(controllers.updateTour)
  .delete(controllers.deleteTour);

module.exports = router;
