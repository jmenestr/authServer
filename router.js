const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport')
const passport = require('passport')

const requireAuth = passport.authenticate('jwt', { session: false })
const signIn = passport.authenticate('local', { session: false,  failureRedirect: '/signup' })
module.exports = app => {
  app.get('/', requireAuth, (req, res) => res.send({ hi: 'there'}))
  app.post('/signup', Authentication.signup)
  app.post('/signin', signIn, Authentication.signin )
}
