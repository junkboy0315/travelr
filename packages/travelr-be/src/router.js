const AuthenticationController = require('./controllers/authentication');
const UsersController = require('./controllers/users');

const { checkToken } = AuthenticationController;

module.exports = app => {
  app.post('/users', checkToken, UsersController.createUser);
  app.get('/users/:userId', UsersController.getUser);
  app.put('/users/:userId', checkToken, UsersController.updateUser);
  app.delete('/users/:userId', checkToken, UsersController.deleteUser);
};
