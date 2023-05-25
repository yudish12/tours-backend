const jwt = require('jsonwebtoken');

const signToken = (obj, req, res) => {
  const token = jwt.sign({ obj }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600 * 1000
    ),
    secure: req.secure,
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  return token;
};

module.exports = { signToken };
