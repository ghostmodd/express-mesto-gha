const usersRouter = require('express').Router();
const {
  getAllUsers, getUser, createUser, updateUserInfo, updateAvatar,
} = require('../controllers/user');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUser);
usersRouter.post('/', createUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports.usersRouter = usersRouter;
