/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const { nanoid } = require('nanoid');
const app = require('@app');

const url = '/auth/login';

module.exports = user => {
  describe('Auth Route DTO', () => {
    describe('POST /login', () => {
      test('LoginDTO validate should fail when body is empty', async () => {
        const res = await request(app).post(url).send({}).expect(400);

        expect(res.body.success).toBe(false);
      });

      test('LoginDTO validate should fail check username.isString, password.isString', async () => {
        const value = {};
        const res = await request(app).post(url).send({ username: value, password: value }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({ msg: 'Username must be string', param: 'username', value });
        expect(res.body.errors).toContainObject({ msg: 'Password must be string', param: 'password', value });
      });

      test('LoginDTO validate should fail check username.isLength min 1, password isLength min 1', async () => {
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

      test('LoginDTO validate should fail check username.isLength max 30', async () => {
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

      test('LoginDTO validate should fail when user not found', async () => {
        let { username, password } = user;
        username += 'salt';
        const res = await request(app).post(url).send({ username, password }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Username or Password is wrong!');
      });

      test('LoginDTO validate should fail when password is incorrect', async () => {
        let { username, password } = user;
        password += 'salt';
        const res = await request(app).post(url).send({ username, password }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Username or Password is wrong!');
      });

      test('LoginDTO validate should fail when password is incorrect', async () => {
        let { username, password } = user;
        password += 'salt';
        const res = await request(app).post(url).send({ username, password }).expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Username or Password is wrong!');
      });

      test('LoginDTO validate should success', async () => {
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
