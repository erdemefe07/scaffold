/* eslint-disable import/no-unresolved */
const authRoute = require('./e2e/auth');
const meRoute = require('./e2e/me');
const { extendations, startDb, stopDb } = require('@testUtils');

const user = {
  username: 'username',
  password: 'isStrong=1',
  session: null,
  _id: null,
};

beforeAll(async () => {
  extendations();
  await startDb();
});

afterAll(async () => {
  await stopDb();
});

describe('End to End tests', () => {
  authRoute.register(user);
  authRoute.login(user);
  meRoute.middleware(user);
  meRoute.me(user);
  meRoute.changePassword(user);
  meRoute.logout(user);
});
