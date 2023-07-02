const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

function authentication(req, res, next) {
  const { authorization } = req.body;

  if (!authorization || !authorization.startsWith('Bearer: ')) {
    next(new UnauthorizedError('Ошибка: токен не передан!'));
  }

  const token = authorization.replace('Bearer: ', '');

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
