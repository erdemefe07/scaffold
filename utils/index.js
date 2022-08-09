const { SESSION_MAX_AGE } = require('@constants');
const { client } = require('@redisClient');
const { nanoid } = require('nanoid/async');

async function cookie(res, response) {
  const session = await nanoid();
  await client().pSetEx(`session:${session}`, SESSION_MAX_AGE, JSON.stringify(response));
  res.cookie('session', session, {
    maxAge: SESSION_MAX_AGE,
    httpOnly: true,
    secure: true,
  });
}

async function removeSession(session) {
  await client().del(`session:${session}`);
}

module.exports = {
  cookie,
  removeSession,
};
