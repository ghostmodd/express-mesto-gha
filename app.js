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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
app.use(reqLogger);
app.use('/', indexRouter);
app.use(errLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, 'localhost');
