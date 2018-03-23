const {comparePassword} = require('./bcrypt')

const passport = require('passport');
const User = require('../models/User');
const config = require('../config');

const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;

const ExtractJwt = require('passport-jwt').ExtractJwt;
const to = (promise) => promise.then(r => [null, r]).catch(err => [err]);

// Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret,
};
// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, async function(payload, done) {
  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // Otherwise, call done without a user object
  const [err, user] = await to(User.findById(payload.sub));
  if (err) {
    return done(err, false)
  } else {
    return done(null, user)
  }
})
// Tell passport to use this strategy
passport.use(jwtLogin);


const localOptions = {
  usernameField: 'email',
  session: false,
}

const localLogin = new LocalStrategy(localOptions, async function (email, password, done) {
  console.log(to)
  const [err, user] = await to(User.findOne({ email: email }));
  if (err) { return done(err); }
  if (!user) { return done(null, false) }
  const userHash = user.password;
  const [e, isMatch] = await comparePassword(password, userHash);
  if (e) {
    done(e)
  }
  if (isMatch) {
    done(null, true)
  } else {
    done(null, false)
  }
})

passport.use(localLogin);
