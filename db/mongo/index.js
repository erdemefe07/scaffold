const mongoose = require('mongoose');

module.exports = () =>
  new Promise(async (resolve, reject) => {
    await mongoose.connect(process.env.db.mongo.uri);
    console.log('mongo connected');
    resolve();
  });
