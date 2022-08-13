const config = require('yaml-env-load');

module.exports = (file = '.env.yaml') =>
  new Promise(resolve => {
    config(file);
    resolve();
  });
