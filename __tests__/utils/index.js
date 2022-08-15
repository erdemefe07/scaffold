/* eslint-disable node/no-unpublished-require */
const { RedisMemoryServer } = require('redis-memory-server');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const { client } = require('@redisClient');
const redisServer = new RedisMemoryServer();
let mongod;

function extendations() {
  expect.extend({
    toContainObject(received, argument) {
      const pass = this.equals(received, expect.arrayContaining([expect.objectContaining(argument)]));

      if (pass) {
        return {
          message: () =>
            `expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(
              argument
            )}`,
          pass: true,
        };
      } else {
        return {
          message: () =>
            `expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`,
          pass: false,
        };
      }
    },
  });
}

async function startDb() {
  const host = await redisServer.getHost();
  const port = await redisServer.getPort();
  mongod = await MongoMemoryServer.create();

  const env = {
    db: {
      redis: {
        uri: `redis://${host}:${port}`,
      },
      mongo: {
        uri: mongod.getUri(),
      },
    },
  };

  Object.defineProperty(process, 'env', {
    value: {
      ...process.env,
      ...env,
    },
  });

  await require('@db')();
}

async function stopDb() {
  await client().disconnect();
  await mongoose.disconnect();
  await redisServer.stop();
  await mongod.stop();
}

module.exports = {
  extendations,
  startDb,
  stopDb,
};
