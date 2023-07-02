require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { validateUserRegistrationBody, validateUserLoginBody } = require('./middlewares/validate');
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const { login, createUser } = require('./controllers/user');
const authentication = require('./middlewares/auth');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/signin', validateUserLoginBody, login);
app.use('/signup', validateUserRegistrationBody, createUser);
app.use(authentication);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use(errors());
app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});

app.listen(PORT, 'localhost');
