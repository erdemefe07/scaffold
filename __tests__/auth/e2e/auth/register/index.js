/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const { nanoid } = require('nanoid');
const { isMongoId } = require('validator');
const { UnSuccess } = require('@exceptions');
const { User } = require('@models');
const app = require('@app');

const url = '/auth/register';

module.exports = user => {
  describe('/auth/register', () => {
    describe('New User Registration', () => {
      test('When body is empty, status should 400 and success should be false', async () => {
        const res = await request(app).post(url).send({}).expect(400);
        expect(res.body).toEqual({
          success: false,
          errors: expect.any(Array),
        });
      });

      test('When username and password is not string, success should be false and necessary information should be provided', async () => {
        const value = {};
        const res = await request(app).post(url).send({ username: value, password: value }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({ msg: 'Username must be string', param: 'username', value });
        expect(res.body.errors).toContainObject({ msg: 'Password must be string', param: 'password', value });
      });

      test('When username is less than 1 letters and password is longer than 72 letters, success should be false and necessary information should be provided ', async () => {
        const usernameValue = '';
        const passwordValue = nanoid(73);
        const res = await request(app).post(url).send({ username: usernameValue, password: passwordValue }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({
          msg: 'Username must be between 1 and 30 letters',
          param: 'username',
          value: usernameValue,
        });
        expect(res.body.errors).toContainObject({
          msg: 'Password can be max 72 letters',
          param: 'password',
          value: passwordValue,
        });
      });

      test('When username longer than 30 letters and password is not strong, success should be false and necessary information should be provided', async () => {
        const usernameValue = nanoid(31);
        const passwordValue = 'thisisnotstrong';
        const res = await request(app).post(url).send({ username: usernameValue, password: passwordValue }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({
          msg: 'Username must be between 1 and 30 letters',
          param: 'username',
          value: usernameValue,
        });
        expect(res.body.errors).toContainObject({
          msg: 'Password is not strong',
          param: 'password',
          value: passwordValue,
        });
      });

      test('When everything is correct, status should be 200, cookies must be provided and user information should returned', async () => {
        const { username, password } = user;

        const res = await request(app).post(url).send({ username, password }).expect(200);

        expect(res.body.username).toBe(user.username);
        expect(isMongoId(res.body._id)).toBe(true);
        const session = res.get('Set-Cookie')[0].split('=')[1].split(';')[0];
        expect(session).not.toBeFalsy();
        user._id = res.body._id;
      });

      test('When user is already exists, success should be false and necessary information should be provided', async () => {
        const { username, password } = user;

        const res = await request(app).post(url).send({ username, password }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('User already exists');
      });

      test('When unknown error has occured on saving, success should be false and should be logged', async () => {
        const logFunction = jest.spyOn(UnSuccess.prototype, 'log');

        jest.spyOn(User.prototype, 'save').mockImplementation(() => {
          throw new Error();
        });

        const { username, password } = user;

        const res = await request(app).post(url).send({ username, password }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Unknown Error');
        expect(logFunction).toHaveBeenCalled();
      });
    });
  });
};
