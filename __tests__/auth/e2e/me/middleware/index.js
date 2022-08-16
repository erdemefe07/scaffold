/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const app = require('@app');

const url = '/me';

module.exports = user => {
  describe('Authenticate Middleware', () => {
    describe('User Authentication', () => {
      test('When session is not found, status should 401 and success should be false', async () => {
        const res = await request(app).get(url).expect(401);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Unauth');
      });

      test('When session is invalid, status should 401 and success should be false', async () => {
        const res = await request(app)
          .get(url)
          .set('Cookie', [`session=${user.session}salt`])
          .expect(401);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Unauth');
      });
    });
  });
};
