const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const indexRouter = require('./routes/index');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', indexRouter);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, 'localhost');
