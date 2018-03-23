const mongoose = require('mongoose');
const {
  hashPassword,
  comparePassword,
} = require('../services/bcrypt');
const Scheme = mongoose.Schema;

const userScheme = new Scheme({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true},
  password: { type: String, required: true},
});

userScheme.pre('save', async function(next) {
  const user = this;

  const [hashErr, hash] = await hashPassword(user.password);
  if (hashErr) {
    next(hashErr);
  }
  user.password = hash;
  next();
})

const ModelClass = mongoose.model('user', userScheme);

module.exports = ModelClass;
