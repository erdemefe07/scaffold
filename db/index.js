/* eslint-disable no-async-promise-executor */
const connectToMongo = require('./mongo');
const { connect: connectToRedis } = require('./redis');

module.exports = () =>
  new Promise(async resolve => {
    Promise.all([await connectToMongo(), await connectToRedis()]);
    resolve();
  });
