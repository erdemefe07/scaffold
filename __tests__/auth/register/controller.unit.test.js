// eslint-disable-next-line node/no-unpublished-require
const omit = require('lodash/omit');
const { SESSION_MAX_AGE } = require('@constants');

const user = {
  username: 'huxername',
  password: 'passwd',
};

const session = 'sexsion';

const { userService, sessionService } = require('@services');
const { authController } = require('@controllers');

describe('Auth Register Controller', () => {
  describe('authController.register', () => {
    test('should success', async () => {
      const omittedUser = omit(user, 'password');

      jest.spyOn(userService, 'createUser').mockReturnValue(user);
      jest.spyOn(userService, 'deletePassword').mockReturnValue(omittedUser);
      jest.spyOn(sessionService, 'createSession').mockReturnValue(session);

      const req = {
        body: user,
      };

      const res = {
        cookie: jest.fn(),
        send: jest.fn(),
      };

      await authController.register(req, res);
      expect(userService.createUser).toHaveBeenCalledWith(user.username, user.password);
      expect(userService.deletePassword).toHaveBeenCalledWith(user);
      expect(sessionService.createSession).toHaveBeenCalledWith(omittedUser);
      expect(res.cookie).toHaveBeenCalledWith('session', session, {
        maxAge: SESSION_MAX_AGE,
        httpOnly: true,
        secure: true,
      });
      expect(res.send).toHaveBeenCalledWith(omittedUser);
    });
  });
});
