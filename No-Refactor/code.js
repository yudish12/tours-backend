//Without AppError Class code will be this

app.all('*', (req, res, next) => {
  const err = new Error(`Cannot find route ${req.originalUrl} in the server`); //this string in err object is message of error
  err.status = 'Fail'; //this assigns status property to err object
  err.statusCode = 404; //this assigns status code to err object
  next(err); //next with argument denotes an error if found and calls the middleware of error
});

//error middle ware whenever first arg is err object it is error middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500; //checking weather statuscode is there if not assign 500
  err.status = err.status || 'error'; //if status not there just assign error

  //returns the error response in json to user
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
