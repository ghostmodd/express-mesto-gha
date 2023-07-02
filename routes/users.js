const usersRouter = require('express').Router();
const {
  getAllUsers, getUser, getUserById, updateUserInfo, updateAvatar,
} = require('../controllers/user');

usersRouter.get('/', getAllUsers);
usersRouter.get('/me', getUser);
usersRouter.patch('/me', updateUserInfo);
usersRouter.patch('/me/avatar', updateAvatar);
usersRouter.get('/:userId', getUserById);

module.exports.usersRouter = usersRouter;
