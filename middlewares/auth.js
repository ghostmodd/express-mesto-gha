const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

function authentication(req, res, next) {
  const { token } = req.cookies;

  if (!token) {
    next(new UnauthorizedError('Ошибка: необходимо авторизоваться!'));
  }

  let payload;
  try {
    payload = jwt.verify(token, 'simpleSecretKey');
  } catch (err) {
    next(new UnauthorizedError('Ошибка: необходимо авторизоваться!'));
  }

  req.user = payload;
  return next();
}

module.exports = authentication;
