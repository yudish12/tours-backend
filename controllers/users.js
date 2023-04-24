const users = require('../models/users');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...fields) => {
  const newObj = {};
  console.log(obj);
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

const createUser = catchAsync(async (req, res) => {
  const User = new users({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role,
  });
  await User.save();
  res.status(200).json({
    message: 'user created successfully',
    data: User,
  });
});

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

const getMe = catchAsync(async (req, res, next) => {
  const id = req.user._id;
  const data = await users.findById(id);
  res.status(200).json({
    status: 'Success',
    data: data,
  });
});

const deleteMe = catchAsync(async (req, res, next) => {
  const User = users.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    message: 'Success',
    data: null,
  });
});

const updateMe = catchAsync(async (req, res, next) => {
  const obj = filterObj(req.body, 'name', 'email');

  const User = await users.findByIdAndUpdate(req.user._id, obj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    message: 'success',
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
  updateMe,
  deleteMe,
  checkBody,
  getMe,
};
