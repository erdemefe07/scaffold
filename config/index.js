const config = require('yaml-env-load');

module.exports = () =>
  new Promise(async (resolve, reject) => {
    config('.env.yaml');
    resolve();
  });
