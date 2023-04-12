const express = require('express');

const controller = require('../controllers/users');

const router = express.Router();

router.param('id', controller.checkID);

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
