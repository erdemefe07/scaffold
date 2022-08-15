const me = require('./me');
const refreshPassword = require('./refreshPassword');
const logout = require('./logout');
const middleware = require('./middleware');

module.exports = {
  me,
  refreshPassword,
  logout,
  middleware,
};
