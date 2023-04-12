const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

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

const morgan = require('morgan');

app.use(express.json());

app.use(morgan('dev'));

// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello from server',
//     app: 'natours',
//   });
// });

// app.post('/', (req, res) => {
//   res.send('hello');
// });

app.use((req, res, next) => {
  req.reqTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', toursRoutes);

app.use('/api/v1/users', userRoutes);

// app.route('/api/v1/tours').get(getAllTours).post(createTour);

// app
//   .route('/api/v1/tours/:id')
//   .get(getTour)
//   .delete(deleteTour)
//   .patch(updateTour);

app.listen(5000, () => {
  console.log('server started');
});
