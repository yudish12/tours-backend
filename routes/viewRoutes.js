const express = require('express');

const controllers = require('../controllers/viewController');
const { isLoggedIn, authMiddleware } = require('../controllers/authController');

const router = express.Router();

router.get('/', isLoggedIn, controllers.getOverview);

router.get('/tour/:slug', isLoggedIn, controllers.getTour);

router.get('/login', isLoggedIn, controllers.getLoginForm);
router.get('/signup', isLoggedIn, controllers.getSignupForm);
router.get('/me', authMiddleware, controllers.getAccount);

module.exports = router;
