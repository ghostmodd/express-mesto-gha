const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '648900d021ef92f08b97d618',
  };
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.listen(PORT, 'localhost');

app.use((req, res) => {
  res.status(404).send({ message: 'The route does not exist' });
});
