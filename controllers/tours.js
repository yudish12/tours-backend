const tours = require('../models/tours');

const alias = (req, res, next) => {
  req.query.sort = 'price -ratingsAverage';
  req.query.limit = '5';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

const checkBody = (req, res, next) => {
  if (!req.body.name) {
    return res.status(404).json({
      message: 'name is missing',
    });
  }

  if (!req.body.price) {
    return res.status(404).json({
      message: 'price is missing',
    });
  }

  next();
};

const checkID = async (req, res, next, val) => {
  const x = val * 1;
  const tour = await tours.find({ id: x });
  if (tour.length === 0) {
    return res.status(404).json({
      error: 'invalid ID',
    });
  }
  next();
};

const getTourStats = async (req, res) => {
  try {
    const stats = await tours.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.7 } },
      },
      {
        $group: {
          _id: '$difficulty',
          totalCost: { $sum: '$price' },
          minimumPrice: { $min: '$price' },
          maximumPrice: { $max: '$price' },
          averagePrice: { $avg: '$price' },
          averageRating: { $avg: '$ratingsAverage' },
          numberOfTours: { $sum: 1 },
          TotalRating: { $sum: '$ratingsQuantity' },
        },
      },
    ]);

    res.status(200).json({
      message: 'success',
      data: stats,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: 'Failed',
      data: error,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const startDate = new Date(`${year}-01-01`).toISOString();
    const endDate = new Date(`${year}-12-31`).toISOString();

    const stats = await tours.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: '$difficulty',
          year: { $first: year },
          totalCost: { $sum: '$price' },
          minimumPrice: { $min: '$price' },
          maximumPrice: { $max: '$price' },
          averagePrice: { $avg: '$price' },
          averageRating: { $avg: '$ratingsAverage' },
          numberOfTours: { $sum: 1 },
          TotalRating: { $sum: '$ratingsQuantity' },
        },
      },
    ]);

    res.status(200).json({
      message: 'success',
      data: stats,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      message: 'Failed',
      data: error,
    });
  }
};

const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    // 1A) filtering
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((e) => delete queryObj[e]);

    // 1B) Advanced Filtering
    Object.keys(queryObj).map((e) => {
      if (typeof queryObj[e] == 'object') {
        const child = queryObj[e];
        Object.keys(child).map((el) => {
          child['$' + el] = child[el];
          delete child[el];
        });
      }
    });

    //create query
    let query = tours.find(queryObj);

    // //2)Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('id');
    }

    //3) field limiting
    if (req.query.fields) {
      const fieldNames = req.query.fields.split(',').join(' ');
      query = query.select(fieldNames);
    }

    //4) Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(limit);

    //execute query
    const tour = await query;
    res.status(200).json({
      message: 'success',
      data: tour,
    });
  } catch (error) {
    // console.log(error);
    res.status(404).json({
      message: 'failed',
      error: error,
    });
  }
};

const createTour = (req, res) => {
  const tour = req.body;

  const newTour = new tours(req.body);
  newTour
    .save()
    .then((doc) => res.status(200).json(doc))
    .catch((e) => res.status(404).json(e));
};

const getTour = async (req, res) => {
  const { id } = req.params;
  try {
    const tour = await tours.find({ id: id * 1 });
    res.status(200).json({
      message: 'Success',
      data: tour,
    });
  } catch (error) {
    res.status(404).json({
      message: 'Failed',
      error: error,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const tour = await tours.findOneAndUpdate({ id: id * 1 }, body, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json(tour);
  } catch (error) {
    return res.status(404).json({
      error: error,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const tour = await tours.findOneAndDelete({ id: id * 1 });

    return res.status(200).json(tour);
  } catch (error) {
    return res.status(404).json({
      error: error,
    });
  }
};

module.exports = {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checkID,
  checkBody,
  alias,
  getTourStats,
  getMonthlyPlan,
};
