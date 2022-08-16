const { checkSchema } = require('express-validator');
const validator = require('validator');

module.exports = {
  validateUsername(str) {
    return validator.isLength(str, { min: 1, max: 30 });
  },
  validatePassword(str) {
    return validator.isStrongPassword(str);
  },
  changePassword: checkSchema({
    oldPassword: {
      isString: {
        errorMessage: 'Old password must be string',
      },
      isLength: {
        errorMessage: 'Old password required',
        options: {
          min: 1,
        },
      },
    },
    password: {
      isString: {
        errorMessage: 'Password must be string',
      },
      isLength: {
        errorMessage: 'Password can be max 72 letters',
        options: {
          max: 72,
        },
      },
      isStrongPassword: {
        errorMessage: 'Password is not strong',
      },
      custom: {
        errorMessage: 'Password cannot be equal with old password',
        options: (value, { req }) => {
          return value !== req.body.oldPassword;
        },
      },
    },
    repeatPassword: {
      isString: {
        errorMessage: 'Repeat password must be string',
      },
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
      isString: {
        errorMessage: 'Username must be string',
      },
      isLength: {
        errorMessage: 'Username must be between 1 and 30 letters',
        options: {
          min: 1,
          max: 30,
        },
      },
    },
    password: {
      isString: {
        errorMessage: 'Password must be string',
      },
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
      isString: {
        errorMessage: 'Username must be string',
      },
      isLength: {
        errorMessage: 'Username must be between 1 and 30 letters',
        options: {
          min: 1,
          max: 30,
        },
      },
    },
    password: {
      isString: {
        errorMessage: 'Password must be string',
      },
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
