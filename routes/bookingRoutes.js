const express = require('express');
const { authMiddleware } = require('../controllers/authController');
const controller = require('../controllers/BookingController');

const router = express.Router();

router.get(
  '/chechout-session/:tourId',
  authMiddleware,
  controller.getCheckoutSession
);

module.exports = router;
