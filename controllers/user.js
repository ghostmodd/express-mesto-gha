const bcrypt = require('bcryptjs');
const User = require('../models/user');
const DefaultError = require('../errors/DefaultError');
const IncorrectInputError = require('../errors/IncorrectInputError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

function getAllUsers(req, res, next) {
  User.find({})
    .then((users) => {
      res.send({
        usersList: users,
      });
    })
    .catch(() => {
      next(new DefaultError());
    });
}

function getUser(req, res, next) {
  const userId = req.user._id;

  User.findOne({ userId })
    .then((user) => {
      if (!user.length > 0) {
        next(new NotFoundError('Ошибка: введенный пользователь не найден'));
      }

      res.send({ user });
    })
    .catch(() => {
      next(new DefaultError());
    });
}

function getUserById(req, res, next) {
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
        next(new NotFoundError('Ошибка: введенный пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      } else if (err.name === 'InputData') {
        next(new NotFoundError('Ошибка: введенный пользователь не найден'));
      } else {
        next(new DefaultError());
      }
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
          if (err.name === 'ValidationError') {
            next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
          } else {
            next(new DefaultError());
          }
        });
    });
}

function updateUserInfo(req, res, next) {
  const { name, about } = req.body;
  const userId = req.user._id;

  if (!name && !about) {
    next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
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
        next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      } else {
        next(new DefaultError());
      }
    });
}

function updateAvatar(req, res, next) {
  const { avatar } = req.body;
  const userId = req.user._id;

  if (!avatar) {
    next(new IncorrectInputError(''));
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
        next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      } else {
        next(new DefaultError());
      }
    });
}

function login(req, res, next) {
  const { email, password } = req;

  User.findUserByCredentials(email, password, next)
    .then((token) => {
      res.cookie('token', token, {
        maxAge: '7d',
        httpOnly: true,
      });
    })
    .catch(() => {
      next(new UnauthorizedError('Ошибка: электронная почта или пороль введены некорректно'));
    });
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
