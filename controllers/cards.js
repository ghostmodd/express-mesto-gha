const mongoose = require('mongoose');
const Card = require('../models/card');
const DefaultError = require('../errors/DefaultError');
const IncorrectInputError = require('../errors/IncorrectInputError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

function getAllCards(req, res, next) {
  Card.find({})
    .populate('owner')
    .then((cardList) => {
      res.send({
        cardList,
      });
    })
    .catch(() => next(new DefaultError('На сервере произошла ошибка')));
}

function createCard(req, res, next) {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((newCardData) => {
      res.send({
        newCardData,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      }

      return next(new DefaultError('На сервере произошла ошибка'));
    });
}

function deleteCard(req, res, next) {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Ошибка: указанная вами карточка не найдена'));
      }

      if (card.owner.toString() !== userId) {
        return next(new ConflictError('Ошибка: Вы не можете удалить карточку, так как не являетесь ее владельцем!'));
      }

      return Card.deleteOne(card)
        .then((result) => {
          if (result) {
            return res.send({ status: 'OK' });
          }

          return next(new NotFoundError('Ошибка: введеная карточка не найдена'));
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      }

      return next(new NotFoundError('Ошибка: введеная карточка не найдена'));
    });
}

function likeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((result) => {
      if (result) {
        return res.send(result);
      }

      return next(new NotFoundError('Ошибка: введеная карточка не найдена'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      }

      return next(new NotFoundError('Ошибка: введеная карточка не найдена'));
    });
}

function dislikeCard(req, res, next) {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((result) => {
      if (result) {
        return res.send(result);
      }

      return next(new NotFoundError('Ошибка: введеная карточка не найдена'));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      }

      return next(new NotFoundError('Ошибка: введеная карточка не найдена'));
    });
}

module.exports = {
  getAllCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
