const jwt = require('jsonwebtoken');

function authentication(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization && !authorization.startWith('BEARER')) {
    return res.status(401).send({ message: 'Error: authorization required' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'simpleSecretKey');
  } catch (err) {
    return res.status(401).send({ message: 'Error: authorization required' });
  }

  req.user = payload;
  next();
}

module.exports = authentication;
