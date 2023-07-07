const mongoose = require('mongoose');

const urlRegexp = /^https?:\/\/[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]{5,}$/gm;

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(url) {
        return !urlRegexp.test(url);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: '',
  }],
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
