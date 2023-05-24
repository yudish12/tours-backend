const users = require('../models/users');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const sharp = require('sharp');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
//   },
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.split('/')[1] === 'jpg' ||
    file.mimetype.split('/')[1] === 'jpeg' ||
    file.mimetype.split('/')[1] === 'png'
  ) {
    cb(null, true);
  } else {
    cb(new Error('This extension is not supported'), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const filterObj = (obj, ...fields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (fields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

const checkBody = (req, res, next) => {
  if (!req.body.name) {
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

  if (req.file) obj.photo = req.file.filename;

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

const uploadUserPhoto = upload.single('photo');
// const uploadUserPhoto = (req, res, next) => {
//   console.log(upload);
//   upload.single('photo');
//   console.log(req.body);
//   next();
// };

const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user._id}-${Date.now()}.jpg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
  next();
});

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
  uploadUserPhoto,
  resizeUserPhoto,
  getMe,
};
