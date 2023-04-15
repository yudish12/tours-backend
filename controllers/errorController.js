module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //checking weather statuscode is there if not assign 500
  err.status = err.status || 'error'; //if status not there just assign error

  if (err.code === 11000) {
    const str = JSON.stringify(err.keyValue);
    return res.status(err.statusCode).json({
      status: err.status,
      message: `Duplicated key value pair found ${str}`,
      obj: err.keyValue,
    });
  }

  //returns the error response in json to user
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
