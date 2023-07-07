const { celebrate, Joi } = require('celebrate');

const validateUserRegistrationBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png').pattern(/^https?:\/\/[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]{5,}$/m),
  }),
});

const validateUserLoginBody = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUserIdParams = celebrate({
  params: Joi.object().keys(({
    userId: Joi.string().length(24).pattern(/[a-z0-9]{24}/m).required(),
  })),
});

module.exports = {
  validateUserRegistrationBody,
  validateUserLoginBody,
  validateUserIdParams,
};
