// eslint-disable-next-line node/no-unpublished-require
const aliases = require('module-alias-jest/register');

module.exports = {
  clearMocks: true,
  // collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: aliases.jest,
};
