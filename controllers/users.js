const users = require('../dev-data/data/users.json');

const checkBody = (req, res, next) => {
  if (!req.body.name) {
    console.log('asd');
    return res.status(404).json({
      message: 'name is missing',
    });
  }

  next();
};

const checkID = (req, res, next, val) => {
  if (val * 1 > users.length) {
    return res.status(404).json({
      error: 'invalid ID',
    });
  }
  next();
};

const getAllUsers = (req, res) => {
  res.status(200).json({
    message: 'Success',
    data: users,
  });
};

const createUser = (req, res) => {
  const user = req.body;
  res.status(200).json({
    message: 'user created successfully',
    data: user,
  });
};

const getUser = (req, res) => {
  const user = users.find((e) => e.id == req.params.id);
  res.status(200).json({
    messages: 'user found',
    data: user,
  });
};

const deleteUser = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: 'user deleted',
  });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    message: 'user details updated',
  });
};

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  checkID,
  checkBody,
};
