const user = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const jwtFunc = require('../utils/jwtFunc');
const AppError = require('../utils/appError');
const emailFunc = require('../utils/email');
const crypto = require('crypto');

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
    token: jwtFunc.signToken(userObj, res),
    userObj,
  });
});

const loginController = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email);
  if (!email || !password) {
    next(new AppError('Missing Email or Password'));
  }

  const User = await user.find({ email: email }).select('+password');
  // if (User) {
  //   return res.json({ token: jwtFunc.signToken(User[0], res), User: User[0] });
  // }

  if (User && (await User[0].matchPasswords(password))) {
    const userObj = {
      _id: User[0]._id,
      email: User[0].email,
      name: User[0].name,
      role: User[0].role,
    };

    res.status(200).json({
      message: 'Logged in successfully',
      token: jwtFunc.signToken(userObj, res),
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

const passwordForget = catchAsync(async (req, res, next) => {
  //Get user based on email
  const { email } = req.body;
  const User = await user.findOne({ email: email });

  if (!User) {
    return next(new AppError('User does not exist', 404));
  }

  const resetToken = User.createResetToken();
  const data = await User.save({ validateBeforeSave: false });

  let url = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Set a new password by clicking on this link ${url} If you didnt forgot your password please ignore this message`;
  try {
    await emailFunc({
      email: User.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'token sent successfully check your email',
    });
  } catch (error) {
    User.resetToken = undefined;
    User.resetTokenExpires = undefined;
    User.save();
    next(
      new AppError(
        'something went wrong while sending email please try again later',
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const User = await user.findOne({
    resetToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() },
  });

  if (!User) {
    return next(new AppError('Token is invalid or expired', 404));
  }

  console.log(User);

  User.password = req.body.password;
  User.passwordConfirm = req.body.passwordConfirm;
  User.resetToken = undefined;
  User.resetTokenExpires = undefined;
  await User.save();

  console.log(User);

  const token = jwtFunc.signToken(User, res);

  res.status(200).json({
    message: 'Password changed sucessfully',
    token,
    data: User,
  });
});

const updatePassword = catchAsync(async (req, res, next) => {
  const { email, password, newPassword, confirmNewPassword } = req.body;

  const User = await user.findOne({ email: email }).select('+password');

  if (!User || !(await User.matchPasswords(password))) {
    next(new AppError('Please provide correct email and password'), 401);
  }

  User.password = newPassword;
  User.passwordConfirm = confirmNewPassword;
  await User.save();

  const token = jwtFunc.signToken(
    {
      _id: User._id,
      name: User.name,
      email: User.email,
      role: User.role,
    },
    res
  );

  res.status(200).json({
    message: 'password updated sucessfully',
    token,
    User,
  });
});

module.exports = {
  signupController,
  loginController,
  authMiddleware,
  roleMiddleware,
  passwordForget,
  resetPassword,
  updatePassword,
};
