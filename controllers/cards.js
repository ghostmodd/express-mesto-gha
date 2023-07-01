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
    .catch(() => {
      next(new DefaultError());
    });
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
      if (err.name === 'ValidationError') {
        next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      }

      next(new DefaultError());
    });
}

function deleteCard(req, res, next) {
  const userId = req.user._id;
  const { cardId } = req.params;

  Card.findById({ cardId })
    .then((card) => {
      if (card.owner !== userId) {
        next(new ConflictError('Вы не можете удалить карточку, так как не являетесь ее владельцем!'));
      }

      Card.findByIdAndRemove(cardId)
        .then((result) => {
          if (result) {
            res.send({ status: 'OK' });
          } else {
            next(new IncorrectInputError('Введенные данные не прошли валидацию'));
          }
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      } else if (err.name === 'InputData') {
        next(new NotFoundError('Ошибка: введеная карточка не найдена'));
      } else {
        next(new DefaultError());
      }
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
        res.send(result);
      } else {
        next(new NotFoundError('Ошибка: введеная карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      } else if (err.name === 'InputData') {
        next(new NotFoundError('Ошибка: введеная карточка не найдена'));
      } else {
        next(new DefaultError());
      }
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
        res.send(result);
      } else {
        next(new NotFoundError('Ошибка: введеная карточка не найдена'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectInputError('Ошибка: введенные данные не прошли валидацию'));
      } else if (err.name === 'InputData') {
        next(new NotFoundError('Ошибка: введеная карточка не найдена'));
      } else {
        next(new DefaultError());
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
