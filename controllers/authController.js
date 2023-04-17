const user = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const jwtFunc = require('../utils/jwtFunc');
const AppError = require('../utils/appError');

const signupController = catchAsync(async (req, res, next) => {
  const User = new user({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const data = await User.save();

  const userObj = {
    _id: data._id,
    name: data.name,
    email: data.email,
  };

  res.status(200).json({
    message: 'User signed up successfully',
    token: jwtFunc.signToken(userObj),
    userObj,
  });
});

const loginController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new AppError('Missing Email or Password'));
  }

  const User = await user.find({ email: email }).select('+password');

  if (User && (await User[0].matchPasswords(password))) {
    const userObj = {
      _id: User[0]._id,
      email: User[0].email,
      name: User[0].name,
      role: User[0].role,
    };

    res.status(200).json({
      message: 'Logged in successfully',
      token: jwtFunc.signToken(userObj),
      userObj,
    });
  } else {
    next(new AppError('Incorrect email or password', 401));
  }
});

const authMiddleware = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in or token provided is wrong', 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const User = await user.findById(decoded.obj._id).select('-password');
  if (!User) {
    return next(
      new AppError('User belonging to this token does no longer exist', 401)
    );
  }

  if (User.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User changed password please login again'), 401);
  }

  req.user = User;
  next();
});

const roleMiddleware = (...roles) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You dont have access to this route'));
    }
    return next();
  };
};

module.exports = {
  signupController,
  loginController,
  authMiddleware,
  roleMiddleware,
};
