module.exports = {
  settings: {
    'import/resolver': {
      alias: [
        ['@app', './app.js'],
        ['@services', './services'],
        ['@config', './config'],
        ['@db', './db'],
        ['@constants', './constants'],
        ['@redisClient', './db/redis'],
        ['@validators', './validators'],
        ['@models', './models'],
        ['@constants', './constants'],
        ['@middlewares', './middlewares'],
        ['@exceptions', './exceptions'],
      ],
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    'jest/globals': true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:json/recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['jest'],
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': [
      'error',
      {
        commonjs: true,
      },
    ],
    'node/no-missing-require': 'off',
    'no-async-promise-executor': 'off',
  },
};
