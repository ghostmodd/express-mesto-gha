const usersRouter = require('express').Router();
const {
  getAllUsers, getUser, getUserById, updateUserInfo, updateAvatar,
} = require('../controllers/user');
const { validateUserIdParams } = require('../middlewares/userValidation');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.get('/:userId', validateUserIdParams, getUserById);

module.exports.usersRouter = usersRouter;
