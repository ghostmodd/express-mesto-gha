const allowedCors = [
  'https://mesto-ghostmodd.nomoredomains.work',
  'http://mesto-ghostmodd.nomoredomains.work',
];
const allowedMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const corsHandling = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', allowedMethods);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};

module.exports = {
  corsHandling,
};
