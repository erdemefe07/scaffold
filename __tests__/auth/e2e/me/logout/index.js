/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const app = require('@app');

const url = '/me/logout';

module.exports = user => {
  describe('Auth Route DTO', () => {
    describe('POST /logout', () => {
      test('Should return 401 with UnAuth message', async () => {
        const res = await request(app)
          .get(url)
          .set('Cookie', [`session=${user.session}salt`])
          .expect(401);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Unauth');
      });

      test('Should logout', async () => {
        const res = await request(app)
          .post(url)
          .set('Cookie', [`session=${user.session}`])
          .expect(200);

        expect(res.body.success).toBe(true);
        const session = res.get('Set-Cookie')[0].split('=')[1].split(';')[0];
        expect(session).toBe('logout');
      });
    });
  });
};
