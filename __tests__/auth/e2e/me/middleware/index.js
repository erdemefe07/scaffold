/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const app = require('@app');

const url = '/me';

module.exports = () => {
  describe('Middlewares - authenticateMiddleware', () => {
    describe('GET /', () => {
      test('Should return 401 when session is not found', async () => {
        const res = await request(app).get(url).expect(401);

        expect(res.body.success).toBe(false);
        expect(res.body.msg).toBe('Unauth');
      });
    });
  });
};
