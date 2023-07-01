require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');
const { login, createUser } = require('./controllers/user');
const authentication = require('./middlewares/auth');

const app = express();
const { PORT = 3000, DB_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(DB_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/signin', login);
app.use('/signup', createUser);
app.use(authentication);
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.listen(PORT, 'localhost');

app.use((err, req, res) => {
  res.status(err.statusCode).send({ message: err.message });
});