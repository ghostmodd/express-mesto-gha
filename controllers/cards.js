const Card = require('../models/card');

const defaultErrCode = 500;
const notFoundErrCode = 404;
const incorrectInputErrCode = 400;

function getAllCards(req, res) {
  Card.find({})
    .populate('owner')
    .then((cardList) => {
      res.send({
        cardList,
      });
    })
    .catch(() => {
      res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
    });
}

function createCard(req, res) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCardData) => {
      res.send({
        newCardData,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(incorrectInputErrCode).send({ message: `${err.message}` });
        return;
      }

      res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
    });
}

function deleteCard(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then((result) => {
      if (result) {
        res.send({ status: 'OK' });
      } else {
        const error = new Error('The inputted card does not exist');
        error.name = 'InputData';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectInputErrCode).send({ message: `${err.message}` });
      } else if (err.name === 'InputData') {
        res.status(notFoundErrCode).send({ message: `${err.message}` });
      } else {
        res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
}

function likeCard(req, res) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        const error = new Error('The inputted card does not exist');
        error.name = 'InputData';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectInputErrCode).send({ message: `${err.message}` });
      } else if (err.name === 'InputData') {
        res.status(notFoundErrCode).send({ message: `${err.message}` });
      } else {
        res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
}

function dislikeCard(req, res) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((result) => {
      if (result) {
        res.send(result);
      } else {
        const error = new Error('The inputted card does not exist');
        error.name = 'InputData';
        throw error;
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(incorrectInputErrCode).send({ message: `${err.message}` });
      } else if (err.name === 'InputData') {
        res.status(notFoundErrCode).send({ message: `${err.message}` });
      } else {
        res.status(defaultErrCode).send({ message: 'На сервере произошла ошибка' });
      }
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
