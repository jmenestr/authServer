const jwt = require('jwt-simple')
const config = require('../config');
const User = require('../models/User');

const to = (promise) => promise.then(r => [null, r]).catch(err => [err]);

const tokenForUser = (user) => {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user._id, iat: timestamp }, config.secret);
}

exports.signup = async function(req, res, next) {
  const email = req.body.email
  const password = req.body.password

  if (!email || !password) {
    res.status(422).send({ error: 'You must provide and email and password' })
  }
  
  // See if a user with a given email exists (no dups)
  const [err, exisitingUser] = await to(User.findOne({ email }));
  if (err) {
    next(err);
  }
  // If a user does exist, notify the user that an error
  if (exisitingUser) {
    res.status(422).send({ error: 'Email is in use' });
    next();
  } else {
  //If user does not exist, create and save user record
  const user = new User({
    email,
    password,
  })

  const [e, newUser] = await to(user.save());

  if (e) {
    next(e);
  }
  // Respond to client
  res.json({ token: tokenForUser(newUser) })
  }
}

exports.signin = async function(req, res) {
  // User as already been verified, so now we need to generate a new token
  res.send({ token: tokenForUser(req.user)})
}
