const connectToMongo = require('./mongo');
const { connect: connectToRedis } = require('./redis');

module.exports = () =>
  new Promise(async (resolve, reject) => {
    Promise.all([await connectToMongo(), await connectToRedis()]);
    resolve();
  });
