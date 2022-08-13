const mongoose = require('mongoose');

module.exports = () =>
  // eslint-disable-next-line no-async-promise-executor
  new Promise(async resolve => {
    await mongoose.connect(process.env.db.mongo.uri);
    console.log('mongo connected');
    resolve();
  });
