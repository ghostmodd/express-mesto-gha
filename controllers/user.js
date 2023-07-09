const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const DefaultError = require('../errors/DefaultError');
const IncorrectInputError = require('../errors/IncorrectInputError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

function getAllUsers(req, res, next) {
  User.find({})
    .then((users) => {
      res.send({
        usersList: users,
      });
    })
    .catch(() => next(new DefaultError('На сервере произошла ошибка')));
}

function getUser(req, res, next) {
  const userId = req.user._id;

  User.findOne({ _id: userId })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Ошибка: введенный пользователь не найден'));
      }

      return res.send({ user });
    })
    .catch(() => next(new DefaultError('На сервере произошла ошибка')));
}

function getUserById(req, res, next) {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (user) {
        return res.send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
      }

      return next(new NotFoundError('Ошибка: введенный пользователь не найден'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      }

      return next(new DefaultError('На сервере произошла ошибка'));
    });
}

function createUser(req, res, next) {
  const {
    email, password, name, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((result) => {
      User.create({
        email, password: result, name, about, avatar,
      })
        .then((user) => {
          res.send({
            data: {
              _id: user._id,
              email: user.email,
              name: user.name,
              about: user.about,
              avatar: user.avatar,
            },
          });
        })
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Ошибка: пользователь с введенным email уже существует'));
          } else if (err instanceof mongoose.Error.ValidationError) {
            next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
          } else {
            next(new DefaultError('На сервере произошла ошибка'));
          }
        });
    });
}

function updateUserInfo(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;

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
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      }

      return next(new DefaultError('На сервере произошла ошибка'));
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const userId = req.user._id;

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
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      }

      return next(new DefaultError('На сервере произошла ошибка'));
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((token) => {
      res.send({ token });
    })
    .catch((err) => next(err));
}

module.exports = {
  getAllUsers,
  getUser,
  getUserById,
  createUser,
  updateUserInfo,
  updateAvatar,
  login,
};
