const express = require('express');

const controller = require('../controllers/users');
const authController = require('../controllers/authController');

const router = express.Router();

router.param('id', controller.checkID);

//not logged in
router.route('/signup').post(authController.signupController);
router.route('/login').post(authController.loginController);
router.route('/logout').get(authController.logout);
router.route('/forgotPassword').post(authController.passwordForget);
router
  .route('/resetPassword/:token')
  .patch(authController.resetPassword, authController.updateForgotPassword);

router.use(authController.authMiddleware);
//logged in

router.route('/updateMypassword').patch(authController.updatePassword);

router.route('/getMe').get(controller.getMe);

router
  .route('/updateMe')
  .patch(
    controller.uploadUserPhoto,
    controller.resizeUserPhoto,
    controller.updateMe
  );

router.route('/deleteMe').patch(controller.deleteMe);

router.use(authController.roleMiddleware('admin', 'lead-guide'));
//admin and lead guide routes

router
  .route('/')
  .get(controller.getAllUsers)
  .post(controller.checkBody, controller.createUser);

router
  .route('/:id')
  .get(controller.getUser)
  .patch(controller.updateUser)
  .delete(controller.deleteUser);

module.exports = router;
