const users = require('../models/users');
const catchAsync = require('../utils/catchAsync');

const checkBody = (req, res, next) => {
  if (!req.body.name) {
    console.log('asd');
    return res.status(404).json({
      message: 'name is missing',
    });
  }

  next();
};

const checkID = (req, res, next, val) => {
  if (val * 1 > users.length) {
    return res.status(404).json({
      error: 'invalid ID',
    });
  }
  next();
};

const getAllUsers = catchAsync(async (req, res) => {
  const User = await users.find();
  res.status(200).json({
    message: 'Success',
    data: User,
  });
});

const createUser = (req, res) => {
  const user = req.body;
  res.status(200).json({
    message: 'user created successfully',
    data: user,
  });
};

const getUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const User = await users.findById(id);
  return res.status(200).json({
    messages: 'user found',
    data: User,
  });
});

const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const User = await users.findByIdAndDelete(id);

  return res.status(200).json({
    message: 'user deleted',
    data: User,
  });
});

const updateUser = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: 'user details updated',
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkID,
  checkBody,
};
