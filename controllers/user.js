const User = require('../models/user');

const defaultErrCode = 500;
const notFoundErrCode = 404;
const incorrectInputErrCode = 400;

function getAllUsers(req, res) {
  User.find({})
    .then((users) => {
      res.send({
        usersList: users,
      });
    })
    .catch(() => {
      res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
    });
}

function getUser(req, res) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
      } else {
        const error = new Error('The inputted user does not exist');
        error.name = 'InputData';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectInputErrCode).send({ message: `${err.message}` });
      } else if (err.name === 'InputData') {
        res.status(notFoundErrCode).send({ message: `${err.message}` });
      } else {
        res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
      }
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
        res.status(incorrectInputErrCode).send({ message: `${err.message}` });
      } else {
        res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
      }
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
        res.status(incorrectInputErrCode).send({ message: `${err.message}` });
      } else {
        res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
      }
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
        res.status(incorrectInputErrCode).send({ message: `${err.message}` });
      } else {
        res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
}

module.exports = {
  getAllUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateAvatar,
};
