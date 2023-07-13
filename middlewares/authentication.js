const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

function authentication(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer: ')) {
    return next(new UnauthorizedError('Ошибка: токен не передан!'));
  }

  const token = authorization.replace('Bearer: ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'simpleSecretKey');
  } catch (err) {
    return next(new UnauthorizedError('Ошибка: необходимо авторизоваться!'));
  }

  req.user = payload;
  return next();
}

module.exports = authentication;
