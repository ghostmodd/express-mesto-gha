const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { validateUserRegistrationBody, validateUserLoginBody } = require('./middlewares/userValidation');
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const { login, createUser } = require('./controllers/user');
const authentication = require('./middlewares/authentication');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/signin', validateUserLoginBody, login);
app.use('/signup', validateUserRegistrationBody, createUser);
app.use('/cards', authentication, cardsRouter);
app.use('/users', authentication, usersRouter);
app.use((req, res, next) => {
  next(new NotFoundError('Ошибка: страница не найдена!'));
});
app.use(errors());
app.use(errorHandler);

app.listen(PORT, 'localhost');
