const { client } = require('@redisClient');
const { nanoid } = require('nanoid/async');
const { SESSION_MAX_AGE } = require('@constants');

module.exports = {
  async createSession(data) {
    const session = await nanoid();
    await client().pSetEx(`session:${session}`, SESSION_MAX_AGE, JSON.stringify(data));
    return session;
  },

  async removeSession(session) {
    await client().del(`session:${session}`);
  },
};
