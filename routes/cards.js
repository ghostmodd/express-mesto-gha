const cardsRouter = require('express').Router();
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { validateCreateCardBody, validateCardIdParams } = require('../middlewares/cardValidation');

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', validateCreateCardBody, createCard);
cardsRouter.delete('/:cardId', validateCardIdParams, deleteCard);
cardsRouter.put('/:cardId/likes', validateCardIdParams, likeCard);
cardsRouter.delete('/:cardId/likes', validateCardIdParams, dislikeCard);

module.exports.cardsRouter = cardsRouter;
