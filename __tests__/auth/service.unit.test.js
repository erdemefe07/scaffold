/* eslint-disable node/no-unpublished-require */
const { User } = require('@models');
const argon2 = require('argon2');
const { UnSuccess } = require('@exceptions');

const user = {
  username: 'huxername',
  password: 'passwd',
  toJSON() {
    return { ...this };
  },
};

const { userService } = require('@services');
const omit = require('lodash/omit');

describe('Auth Service', () => {
  describe('authService.createUser', () => {
    test('should throw error', async () => {
      jest.spyOn(User.prototype, 'save').mockImplementation(() => {
        throw new Error('Custom error');
      });

      userService
        .createUser(user.username, user.password)
        .then(result => {
          expect(result).toBe(undefined);
        })
        .catch(e => {
          expect(e).toBeInstanceOf(UnSuccess);
        });
    });

    test('should pass', async () => {
      jest.spyOn(User.prototype, 'save').mockImplementation(() => user);

      const result = await userService.createUser(user.username, user.password);
      expect(result).toEqual(user);
    });
  });

  describe('authService.deletePassword', () => {
    test('should pass', () => {
      const result = userService.deletePassword(user);
      expect(result).toEqual(omit(user, 'password'));
    });
  });

  describe('authService.validatePassword', () => {
    test('should throw error when user not found', async () => {
      jest.spyOn(User, 'findOne').mockReturnValue({
        select: jest.fn(() => undefined),
      });

      userService
        .validatePassword(user)
        .then(result => {
          expect(result).toBe(undefined);
        })
        .catch(e => {
          expect(e).toBeInstanceOf(UnSuccess);
        });
    });

    test('should throw error when password is not valid', async () => {
      jest.spyOn(User, 'findOne').mockReturnValue({
        select: jest.fn(() => user),
      });

      jest.spyOn(argon2, 'verify').mockReturnValue(false);

      userService
        .validatePassword(user)
        .then(result => {
          expect(result).toBe(undefined);
        })
        .catch(e => {
          expect(e).toBeInstanceOf(UnSuccess);
        });
    });

    test('should pass', async () => {
      jest.spyOn(User, 'findOne').mockReturnValue({
        select: jest.fn(() => user),
      });
      jest.spyOn(argon2, 'verify').mockReturnValue(true);

      const result = await userService.validatePassword(user);
      expect(result).toEqual(user);
    });
  });

  describe('authService.changePassword', () => {
    test('should pass', async () => {
      const _user = {
        username: user.username,
        password: 'newPass',
      };

      jest.spyOn(userService, 'validatePassword').mockImplementation((username, password) => {
        return {
          username,
          password,
          save: jest.fn(() => _user),
        };
      });

      const result = await userService.changePassword(user.username, user.password, _user.password);
      expect(result).toEqual(_user);
    });
  });
});
