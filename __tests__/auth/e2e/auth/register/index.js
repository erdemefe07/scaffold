/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const { nanoid } = require('nanoid');
const { isMongoId } = require('validator');
const { UnSuccess } = require('@exceptions');
const { User } = require('@models');
const app = require('@app');

const url = '/auth/register';

module.exports = user => {
  describe('Auth Route DTO', () => {
    describe('POST /register', () => {
      test('RegisterDTO validate should fail when body is empty', async () => {
        const res = await request(app).post(url).send({}).expect(400);

        expect(res.body.success).toBe(false);
      });

      test('RegisterDTO validate should fail check username.isString, password.isString', async () => {
        const value = {};
        const res = await request(app).post(url).send({ username: value, password: value }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({ msg: 'Username must be string', param: 'username', value });
        expect(res.body.errors).toContainObject({ msg: 'Password must be string', param: 'password', value });
      });

      test('RegisterDTO validate should fail check username.isLength min 1, password isLength max 72', async () => {
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

      test('RegisterDTO validate should fail check username.isLength max 30, password isStrongPassword', async () => {
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

      test('RegisterDTO validate should success', async () => {
        const { username, password } = user;

        const res = await request(app).post(url).send({ username, password }).expect(200);

        expect(res.body.username).toBe(user.username);
        expect(isMongoId(res.body._id)).toBe(true);
        const session = res.get('Set-Cookie')[0].split('=')[1].split(';')[0];
        expect(session).not.toBeFalsy();
        user._id = res.body._id;
      });

      test('RegisterDTO should fail when user is already exists', async () => {
        const { username, password } = user;

        const res = await request(app).post(url).send({ username, password }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('User already exists');
      });

      test('RegisterDTO should fail when unknown error occued and it must be log', async () => {
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
