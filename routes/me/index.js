const { userValidator, validate } = require('@validators');
const express = require('express');
const router = express.Router();
const { meController } = require('@controllers');

router.get('/', meController.getMe);
router.post('/refreshPassword', validate(userValidator.refreshPassword), meController.refreshPassword);
router.post('/logout', meController.logout);

module.exports = router;
