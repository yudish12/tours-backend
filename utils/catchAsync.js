module.exports = catchAsync = (fn) => {
  return function (req, res, next) {
    return fn(req, res, next).catch((err) => {
      return next(err);
    });
  };
};
