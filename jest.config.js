/* eslint-disable node/no-unpublished-require */
const path = require('path');
const aliases = require('module-alias-jest/register');

aliases.jest['@testUtils(.*)'] = path.resolve(__dirname, '__tests__', 'utils' + '$1');

module.exports = {
  restoreMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: aliases.jest,
};
