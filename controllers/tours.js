const tours = require('../models/tours');

const stringData = JSON.stringify(tours);

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

const getAllTours = async (req, res) => {
  try {
    const queryObj = { ...req.query };

    //filtering
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((e) => delete queryObj[e]);

    //create query
    const query = await tours.find(queryObj);

    //Advanced Filtering

    //execute query
    const tour = await query;
    res.status(200).json({
      message: 'success',
      data: tour,
    });
  } catch (error) {
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
};
