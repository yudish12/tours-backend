//AppError extends Error to have access of Error class for creating error object

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); //calls constructor of Error class to create error object with message string

    this.statusCode = statusCode;
    this.status = ` ${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
