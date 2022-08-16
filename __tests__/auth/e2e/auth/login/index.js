/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const { nanoid } = require('nanoid');
const app = require('@app');

const url = '/auth/login';

module.exports = user => {
  describe('/auth/login', () => {
    describe('Logging in', () => {
      test('When body is empty, status should 400 and success should be false', async () => {
        const res = await request(app).post(url).send({}).expect(400);

        expect(res.body.success).toBe(false);
      });

      test('When username and password is not string, success should be false and necessary information should be provided', async () => {
        const value = {};
        const res = await request(app).post(url).send({ username: value, password: value }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({ msg: 'Username must be string', param: 'username', value });
        expect(res.body.errors).toContainObject({ msg: 'Password must be string', param: 'password', value });
      });

      test('When username and password is less than 1 letters, success should be false and necessary information should be provided', async () => {
        const usernameValue = '';
        const passwordValue = '';
        const res = await request(app).post(url).send({ username: usernameValue, password: passwordValue }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({
          msg: 'Username must be between 1 and 30 letters',
          param: 'username',
          value: usernameValue,
        });
        expect(res.body.errors).toContainObject({
          msg: 'Password required',
          param: 'password',
          value: passwordValue,
        });
      });

      test('When username is longer than 30 letters, success should be false and necessary information should be provided', async () => {
        const usernameValue = nanoid(31);
        const passwordValue = 'randomPass';

        const res = await request(app).post(url).send({ username: usernameValue, password: passwordValue }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({
          msg: 'Username must be between 1 and 30 letters',
          param: 'username',
          value: usernameValue,
        });
      });

      test('Wnen user not found, success should be false and should return Username or Password is wrong message', async () => {
        let { username, password } = user;
        username += 'salt';
        const res = await request(app).post(url).send({ username, password }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Username or Password is wrong!');
      });

      test('Wnen username and password not matched, success should be false and should return Username or Password is wrong message', async () => {
        let { username, password } = user;
        password += 'salt';
        const res = await request(app).post(url).send({ username, password }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Username or Password is wrong!');
      });

      test('When everything is correct, status should be 200, cookies must be provided and user information should returned', async () => {
        const { username, password, _id } = user;
        const res = await request(app).post(url).send({ username, password }).expect(200);

        expect(res.body.username).toBe(username);
        expect(res.body._id).toBe(_id);
        const session = res.get('Set-Cookie')[0].split('=')[1].split(';')[0];
        expect(session).not.toBeFalsy();
        user.session = session;
      });
    });
  });
};
