const Card = require('../models/card');

let errCode = 500;

function getAllCards(req, res) {
  Card.find({})
    .populate('owner')
    .then((cardList) => {
      res.send({
        cardList,
      });
    })
    .catch((err) => {
      res.status(errCode).send({ message: `${err.message}` });
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
        errCode = 400;
      }

      res.status(errCode).send({ message: `${err.message}` });
    });
}

function deleteCard(req, res) {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .then(() => {
      res.send({ status: 'OK' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errCode = 404;
      }
      res.status(errCode).send({ message: `${err.message}` });
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
      res.send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errCode = 404;
      }

      res.status(errCode).send({ message: `${err.message}` });
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
      res.send(result);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        errCode = 404;
      }

      res.status(errCode).send({ message: `${err.message}` });
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
