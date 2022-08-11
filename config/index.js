const config = require('yaml-env-load');

module.exports = (file = '.env.yaml') =>
  new Promise(async (resolve, reject) => {
    config(file);
    resolve();
  });
