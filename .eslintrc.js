module.exports = {
  settings: {
    'import/resolver': {
      alias: [
        ['@config', './config'],
        ['@db', './db'],
        ['@constants', './constants'],
        ['@redisClient', './db/redis'],
        ['@validators', './validators'],
        ['@models', './models'],
        ['@constants', './constants'],
        ['@middlewares', './middlewares'],
        ['@utils', './utils'],
      ],
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  extends: [
    'prettier',
    'plugin:json/recommended',
    'plugin:node/recommended',
    'plugin:security/recommended',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'import/no-unresolved': [
      'error',
      {
        commonjs: true,
      },
    ],
    'node/no-missing-require': 'off',
  },
};
