/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const { nanoid } = require('nanoid');
const app = require('@app');

const url = '/me/refreshPassword';

module.exports = user => {
  describe('RefreshPassword DTO', () => {
    describe('POST /refreshPassword', () => {
      test('Validate should fail when body is empty', async () => {
        const res = await request(app)
          .post(url)
          .send({})
          .set('Cookie', [`session=${user.session}`])
          .expect(400);

        expect(res.body).toEqual({
          success: false,
          errors: expect.any(Array),
        });
      });

      test('Validate should fail when params not string', async () => {
        const value = {};

        const res = await request(app)
          .post(url)
          .send({ oldPassword: value, password: value, repeatPassword: value })
          .set('Cookie', [`session=${user.session}`])
          .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({
          msg: 'Old password must be string',
          param: 'oldPassword',
          value,
        });
        expect(res.body.errors).toContainObject({
          msg: 'Repeat password must be string',
          param: 'repeatPassword',
          value,
        });
        expect(res.body.errors).toContainObject({
          msg: 'Password is not strong',
          param: 'password',
          value,
        });
      });

      test('oldPassword islength min 1, password maxlength 72, repeatPassword is not equal with password', async () => {
        const oldPassword = '';
        const repeatPassword = '';
        const password = nanoid(73);

        const res = await request(app)
          .post(url)
          .send({ oldPassword, password, repeatPassword })
          .set('Cookie', [`session=${user.session}`])
          .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({
          msg: 'Old password required',
          param: 'oldPassword',
          value: oldPassword,
        });
        expect(res.body.errors).toContainObject({
          msg: 'Password can be max 72 letters',
          param: 'password',
          value: password,
        });
        expect(res.body.errors).toContainObject({
          msg: 'Repeat password not equal with password',
          param: 'repeatPassword',
          value: repeatPassword,
        });
      });

      test('password equal with oldPassword and not strong', async () => {
        const oldPassword = 'passwd';
        const password = 'passwd';
        const repeatPassword = password;

        const res = await request(app)
          .post(url)
          .send({ oldPassword, password, repeatPassword })
          .set('Cookie', [`session=${user.session}`])
          .expect(400);

        expect(res.body.success).toBe(false);
        expect(res.body.errors).toContainObject({
          msg: 'Password is not strong',
          param: 'password',
          value: password,
        });
        expect(res.body.errors).toContainObject({
          msg: 'Password cannot be equal with old password',
          param: 'password',
          value: password,
        });
      });

      test('Should Pass', async () => {
        const oldPassword = user.password;
        const password = user.password + '.';
        const repeatPassword = password;

        const res = await request(app)
          .post(url)
          .send({ oldPassword, password, repeatPassword })
          .set('Cookie', [`session=${user.session}`])
          .expect(200);

        expect(res.body.username).toBe(user.username);
        expect(res.body._id).toBe(user._id);
        const session = res.get('Set-Cookie')[0].split('=')[1].split(';')[0];
        expect(session).not.toBeFalsy();
        user.session = session;
      });
    });
  });
};
