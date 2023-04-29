const express = require('express');

const controllers = require('../controllers/viewController');
const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', controllers.getOverview);

router.get('/tour/:slug', controllers.getTour);

router.get('/login', controllers.getLoginForm);
router.get('/signup', controllers.getSignupForm);

module.exports = router;
