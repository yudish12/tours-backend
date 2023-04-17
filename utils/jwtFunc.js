const jwt = require('jsonwebtoken');

const signToken = (obj) => {
  return jwt.sign({ obj }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

module.exports = { signToken };
