const User = require('../models/user');

let errCode = 500;

function getAllUsers(req, res) {
  User.find({})
    .then((users) => {
      res.send({
        usersList: users,
      });
    })
    .catch((err) => {
      res.status(errCode).send({ message: `${err.message}` });
    });
}

function getUser(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errCode = 400;
      }
      res.status(errCode).send({ message: `${err.message}` });
    });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.send({
        data: user,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errCode = 400;
      }

      res.status(errCode).send({ message: `${err.message}` });
    });
}

function updateUserInfo(req, res) {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (!name && !about) {
    res.status(400).send({ message: 'Input data is empty' });
    return;
  }

  User.findByIdAndUpdate(
    userId,
    {
      [`${name ? 'name' : null}`]: name,
      [`${about ? 'about' : null}`]: about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errCode = 400;
      }

      res.status(errCode).send({ message: `${err.message}` });
    });
}

function updateAvatar(req, res) {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (!avatar) {
    res.status(400).send({ message: 'Input data is empty' });
    return;
  }

  User.findByIdAndUpdate(
    userId,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        errCode = 400;
      }

      res.status(errCode).send({ message: `${err.message}` });
    });
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
};
