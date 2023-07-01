const usersRouter = require('express').Router();
const {
  getAllUsers, getUser, getUserById, updateUserInfo, updateAvatar,
} = require('../controllers/user');

usersRouter.get('/', getAllUsers);
usersRouter.get('/:userId', getUserById);
usersRouter.patch('/me', updateUserInfo);
usersRouter.get('/me', getUser);
usersRouter.patch('/me/avatar', updateAvatar);

module.exports.usersRouter = usersRouter;
