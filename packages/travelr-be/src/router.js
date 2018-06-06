const passport = require('passport');

const AuthenticationController = require('./controllers/authentication');
const UsersController = require('./controllers/users');

require('./services/passport'); // 単に実行するだけ

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = app => {
  app.post('/users', UsersController.createUser);
  app.get('/users/:userId', UsersController.getUser);
  app.put('/users/:userId', UsersController.updateUser);
  app.delete('/users/:userId', UsersController.deleteUser);

  app.get('/', requireAuth, (req, res) => {
    res.json({ hi: 'there' });
  });
  app.post('/signin', requireSignin, AuthenticationController.signin);
  app.post('/signup', AuthenticationController.signup);
};
