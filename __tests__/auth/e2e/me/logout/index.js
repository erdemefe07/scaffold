/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const app = require('@app');

const url = '/me/logout';

module.exports = user => {
  describe('/me/logout', () => {
    describe('Logging out', () => {
      test('Status should be 200 and session value should be logout', async () => {
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
