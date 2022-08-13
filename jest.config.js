/* eslint-disable node/no-unpublished-require */
const path = require('path');
const aliases = require('module-alias-jest/register');

aliases.jest['@testUtils(.*)'] = path.resolve(__dirname, 'tests', 'utils' + '$1');

module.exports = {
  clearMocks: true,
  // collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  moduleNameMapper: aliases.jest,
};
