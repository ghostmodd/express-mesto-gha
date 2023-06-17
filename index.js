const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { cardsRouter } = require('./routes/cards');
const { usersRouter } = require('./routes/users');

const index = express();
const { PORT = 3001 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

index.use((req, res, next) => {
  req.user = {
    _id: '648900d021ef92f08b97d618',
  };
  next();
});

index.use(bodyParser.json());
index.use(bodyParser.urlencoded({ extended: true }));
index.use('/cards', cardsRouter);
index.use('/users', usersRouter);

index.listen(PORT, 'localhost');
