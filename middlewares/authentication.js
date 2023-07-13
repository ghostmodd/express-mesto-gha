const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'simpleSecretKey' } = process.env;
const UnauthorizedError = require('../errors/UnauthorizedError');

function authentication(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer: ')) {
    return next(new UnauthorizedError('Ошибка: токен не передан!'));
  }

  const token = authorization.replace('Bearer: ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Ошибка: необходимо авторизоваться!'));
  }

  req.user = payload;
  return next();
}

module.exports = authentication;
