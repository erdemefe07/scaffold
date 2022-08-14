const express = require('express');
const router = express.Router();
const { userValidator, validate } = require('@validators');
const { authController } = require('@controllers');

router.post('/register', validate(userValidator.register), authController.register);
router.post('/login', validate(userValidator.login), authController.login);

module.exports = router;
