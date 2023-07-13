const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const indexRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { reqLogger, errLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3001, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

const allowedCors = [
  'https://mesto-ghostmodd.nomoredomains.work',
  'http://mesto-ghostmodd.nomoredomains.work',
];
const allowedMethods = 'GET,HEAD,PUT,PATCH,POST,DELETE';

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
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
});
app.use(reqLogger);
app.use('/', indexRouter);
app.use(errLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, 'localhost');
