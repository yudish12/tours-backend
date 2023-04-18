const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

dotenv.config({ path: './.env' });

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const dbString = process.env.URI;
mongoose
  .connect(dbString, {
    useNewUrlParser: true,
  })
  .then((con) => {
    // console.log(con.connections);
    console.log('DB connection completed');
  })
  .catch((e) => console.log(e));

const toursRoutes = require('./routes/tours');
const userRoutes = require('./routes/users');

const app = express();

app.use(helmet());
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'difficulty',
      'maxGroupSize',
      'price',
    ],
  })
);

app.use(mongoSanitize()); //filters out mongodb code hence prevents nosql injection
app.use(xss()); //filters out xss cross server scripting code hence prevents cross server scripting

const morgan = require('morgan');

app.use(express.json({ limit: '10kb' }));

app.use(morgan('dev'));

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

const limiter = rateLimit({
  max: 10,
  windowMS: 60 * 30 * 1000,
  message: `too many requests from the same ip,please try after an hour`,
});

app.use('/api', limiter);

app.use('/api/v1/tours', toursRoutes);

app.use('/api/v1/users', userRoutes);

app.all('*', (req, res, next) => {
  //AppError class for error handler object
  next(new AppError(`Cannot find route ${req.originalUrl} in the server`));
});

//error middle ware whenever first arg is err object it is error middleware
app.use(globalErrorHandler);

const server = app.listen(5000, () => {
  console.log('server started');
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! ');
  server.close(() => {
    process.exit(1);
  });
});
