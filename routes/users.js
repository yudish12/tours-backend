const express = require('express');

const controller = require('../controllers/users');
const authController = require('../controllers/authController');

const router = express.Router();

router.param('id', controller.checkID);

router.route('/signup').post(authController.signupController);
router.route('/login').post(authController.loginController);

router
  .route('/')
  .get(authController.authMiddleware, controller.getAllUsers)
  .post(controller.checkBody, controller.createUser);

router
  .route('/:id')
  .get(authController.authMiddleware, controller.getUser)
  .patch(controller.updateUser)
  .delete(
    authController.authMiddleware,
    authController.roleMiddleware('admin', 'lead-guide'),
    controller.deleteUser
  );

module.exports = router;
