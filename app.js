const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const corsHandling = require('./middlewares/corsHandling');
const indexRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');
const { reqLogger, errLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(reqLogger);
app.use(corsHandling);
app.use('/', indexRouter);
app.use(errLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, 'localhost');
