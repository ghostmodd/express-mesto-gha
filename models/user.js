require('dotenv').config();
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
    default: this.password,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(url) {
        return /^https?:\/\/[0-9a-zA-Z/\-._~:?#[\]@!$&'()*+,;=]{5,}$/.test(url);
      },
    },
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Ошибка: электронная почта или пароль введены неправильно'));
      }

      return bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            return Promise.reject(new UnauthorizedError('Ошибка: не удалось авторизоваться'));
          }

          return jwt.sign({ _id: user._id }, 'simpleSecretKey', { expiresIn: '7d' });
        });
    });
};

module.exports = mongoose.model('user', userSchema);
