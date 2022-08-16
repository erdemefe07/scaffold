const { userValidator, validate } = require('@validators');
const express = require('express');
const router = express.Router();
const { meController } = require('@controllers');

router.get('/', meController.getMe);
router.post('/changePassword', validate(userValidator.changePassword), meController.changePassword);
router.post('/logout', meController.logout);

module.exports = router;
