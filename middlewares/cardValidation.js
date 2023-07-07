const { celebrate, Joi } = require('celebrate');

const validateCreateCardBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().pattern(/^https?:\/\/[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]{5,}$/m),
  }).unknown(true),
});

const validateCardIdParams = celebrate({
  params: Joi.object().keys(({
    cardId: Joi.string().length(24).pattern(/[a-z0-9]{24}/m).required(),
  })),
});

module.exports = {
  validateCreateCardBody,
  validateCardIdParams,
};
