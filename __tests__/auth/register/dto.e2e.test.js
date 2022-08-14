/* eslint-disable import/no-unresolved */
/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const { nanoid } = require('nanoid');
const mongoose = require('mongoose');
const { isMongoId } = require('validator');
const { User } = require('@models');
const { client } = require('@redisClient');
const app = require('@app');
const { extendations } = require('@testUtils');

const user = {};

beforeAll(async () => {
  extendations();
  await require('@config')('.env.test.yaml');
  await require('@db')();
});

afterAll(async () => {
  await User.findByIdAndRemove(user.id);
  await client().del(`session:${user.session}`);
  await client().disconnect();
  await mongoose.disconnect();
});

describe('Auth Route DTO', () => {
  describe('POST /register', () => {
    test('RegisterDTO validate should fail when body is empty', async () => {
      const res = await request(app).post('/auth/register').send({}).expect(400);

      expect(res.body.success).toBe(false);
    });

    test('RegisterDTO validate should fail check username.isString, password.isString', async () => {
      const value = {};
      const res = await request(app).post('/auth/register').send({ username: value, password: value }).expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errors).toContainObject({ msg: 'Username must be string.', param: 'username', value });
      expect(res.body.errors).toContainObject({ msg: 'Password must be string.', param: 'password', value });
    });

    test('RegisterDTO validate should fail check username.isLength min 0, password isLength max 72', async () => {
      const usernameValue = '';
      const passwordValue = nanoid(73);
      const res = await request(app)
        .post('/auth/register')
        .send({ username: usernameValue, password: passwordValue })
        .expect(400);

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
      const res = await request(app)
        .post('/auth/register')
        .send({ username: usernameValue, password: passwordValue })
        .expect(400);

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
      const username = 'username';
      const password = 'isStrong=1';

      const res = await request(app).post('/auth/register').send({ username, password }).expect(200);

      expect(res.body.username).toBe(username);
      expect(isMongoId(res.body._id)).toBe(true);
      const session = res.get('Set-Cookie')[0].split('=')[1].split(';')[0];
      expect(session).not.toBeFalsy();

      user.id = res.body._id;
      user.session = session;
    });
  });
});
