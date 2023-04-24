const mongoose = require('mongoose');
const { Schema } = mongoose;
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { type } = require('os');

const user_schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'User Must have a name'],
      validate: validator.isAlpha,
    },
    password: {
      type: String,
      required: [true, 'User must have a password'],
      minlength: [8, 'minimum 8 characters must be in password'],
      select: false,
    },
    email: {
      type: String,
      required: [true, 'user must have an email'],
      unique: [true, 'user with this email already exists'],
      lowercase: true,
      validate: [validator.isEmail, 'please enter valid email'],
    },
    role: {
      type: String,
      enum: ['admin', 'guide', 'lead-guide', 'user'],
      default: 'user',
    },
    passwordConfirm: {
      type: String,
      required: [true, 'User must have a password'],
      minlength: [8, 'minimum 8 characters must be in password'],
      validate: {
        //only runs on create and save
        validator: function (el) {
          return el === this.password;
        },
      },
      select: false,
    },
    passwordChangedAt: Date,
    resetToken: String,
    resetTokenExpires: Date,
    photo: {
      type: String,
    },
    active: {
      type: Boolean,
      select: false,
      default: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

user_schema.methods.matchPasswords = async function (enteredPassword) {
  console.log(this);
  console.log(enteredPassword, this.password);

  return await bcrypt.compare(enteredPassword, this.password);
};

user_schema.methods.changedPasswordAfter = function (JWTtimestamp) {
  if (this.passwordChangedAt) {
    const time = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTtimestamp < time;
  }
  return false;
};

user_schema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.resetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;

  console.log(resetToken, this.resetToken);
  return resetToken;
};

user_schema.pre('save', async function (next) {
  //is modified is a mongoose method which tells weather a field was modified or not
  if (!this.isModified('password')) {
    return next();
  }

  //if not modified then hash the password
  this.password = await bcrypt.hash(this.password, 12);

  //password confirm is not needed so we set it to undefined
  this.passwordConfirm = undefined;
  next();
});

user_schema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

user_schema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// user_schema.pre('save', async function (next) {

//   next();
// });

const User = mongoose.model('User', user_schema);

module.exports = User;
