const { createClient } = require('redis');

/** @type {import('redis').RedisClientType} */
let _client = null;

function connect() {
  return new Promise(async (resolve, reject) => {
    _client = createClient({ url: process.env.db.redis.uri });
    await _client.connect();
    console.log('redis connected');
    resolve();
  });
}

module.exports = {
  connect,
  client() {
    return _client;
  },
};
