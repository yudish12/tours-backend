const express = require('express');

const controller = require('../controllers/users');
const authController = require('../controllers/authController');

const router = express.Router();

router.param('id', controller.checkID);

router.route('/signup').post(authController.signupController);
router.route('/login').post(authController.loginController);
router.route('/forgotPassword').post(authController.passwordForget);
router.route('/resetPassword/:token').patch(authController.resetPassword);
router
  .route('/updateMypassword')
  .patch(authController.authMiddleware, authController.updatePassword);

router
  .route('/updateMe')
  .patch(authController.authMiddleware, controller.updateMe);

router
  .route('/deleteMe')
  .patch(authController.authMiddleware, controller.deleteMe);

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
