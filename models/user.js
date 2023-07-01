const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
    },
    default: this.password,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: true,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  userSchema.find({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new UnauthorizedError('Ошибка: электронная почта или пароль введены неправильно'));
      }

      bcrypt.compare(password, user.password)
        .then((result) => {
          if (!result) {
            return Promise.reject(new UnauthorizedError('Ошибка: не удалось авторизоваться'));
          }

          return jwt.sign({ _id: user._id }, 'simpleSecretKey', { expiresIn: '7d' });
        });
    });
};

module.exports = mongoose.model('user', userSchema);
