const mongoose = require('mongoose');
const argon2 = require('argon2');
const { userValidator } = require('@validators');

const schema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: v => userValidator.validateUsername(v),
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: v => userValidator.validatePassword(v),
    },
    select: false,
  },
});

schema.pre('save', async function next() {
  if (!this.isModified('password')) {
    return next();
  }

  const pass = await argon2.hash(this.password, {
    memoryCost: 15 * 1024,
    timeCost: 2,
    parallelism: 1,
    type: 2,
  });
  this.password = pass;
});

module.exports = mongoose.model('User', schema);
