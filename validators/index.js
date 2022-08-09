const { validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const userValidator = require('./User');

module.exports = {
  userValidator,
  validate: validations => {
    return asyncHandler(async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      res.status(400).json({ success: false, errors: errors.array() });
    });
  },
};
