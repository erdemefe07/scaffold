/* eslint-disable node/no-unpublished-require */
const request = require('supertest');
const app = require('@app');

const url = '/me';

module.exports = user => {
  describe('/me', () => {
    describe('User informations', () => {
      test('Status should 200 and user information should occured', async () => {
        const { username, _id } = user;

        const res = await request(app)
          .get(url)
          .set('Cookie', [`session=${user.session}`])
          .expect(200);

        expect(res.body.username).toBe(username);
        expect(res.body._id).toBe(_id);
        expect(res.body).toBeTruthy();
      });
    });
  });
};
