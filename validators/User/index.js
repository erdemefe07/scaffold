const { checkSchema } = require('express-validator');
const validator = require('validator');

module.exports = {
  validateUsername(str) {
    return validator.isLength(str, { min: 1, max: 30 });
  },
  validatePassword(str) {
    return validator.isStrongPassword(str);
  },
  refreshPassword: checkSchema({
    oldPassword: {
      isLength: {
        errorMessage: 'Old password required',
        options: {
          min: 1,
        },
      },
    },
    password: {
      isLength: {
        errorMessage: 'Password can be max 72 letters',
        options: {
          max: 72,
        },
      },
      isStrongPassword: {
        errorMessage: 'Password is not strong',
      },
    },
    repeatPassword: {
      custom: {
        errorMessage: 'Repeat password not equal with password',
        options: (value, { req }) => {
          return value === req.body.password;
        },
      },
    },
  }),
  login: checkSchema({
    username: {
      isLength: {
        errorMessage: 'Username must be between 1 and 30',
        options: {
          min: 1,
          max: 30,
        },
      },
    },
    password: {
      isLength: {
        errorMessage: 'Password required',
        options: {
          min: 1,
        },
      },
    },
  }),
  register: checkSchema({
    username: {
      isLength: {
        errorMessage: 'Username must be between 1 and 30 letters',
        options: {
          min: 1,
          max: 30,
        },
      },
    },
    password: {
      isLength: {
        errorMessage: 'Password can be max 72 letters',
        options: {
          max: 72,
        },
      },
      isStrongPassword: {
        errorMessage: 'Password is not strong',
      },
    },
  }),
};
