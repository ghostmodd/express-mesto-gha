const indexRouter = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const { validateUserRegistrationBody, validateUserLoginBody } = require('../middlewares/userValidation');
const { cardsRouter } = require('./cards');
const { usersRouter } = require('./users');
const { login, createUser } = require('../controllers/user');
const authentication = require('../middlewares/authentication');

indexRouter.use('/signin', validateUserLoginBody, login);
indexRouter.use('/signup', validateUserRegistrationBody, createUser);
indexRouter.use('/users', authentication, usersRouter);
indexRouter.use('/cards', authentication, cardsRouter);
indexRouter.use((req, res, next) => {
  next(new NotFoundError('Ошибка: страница не найдена!'));
});

module.exports = indexRouter;
