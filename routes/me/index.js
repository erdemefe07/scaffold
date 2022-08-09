const { userValidator, validate } = require('@validators');
const express = require('express');
const asyncHandler = require('express-async-handler');
const router = express.Router();
const { cookie, removeSession } = require('@utils');
const { User } = require('@models');
const argon2 = require('argon2');

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.send(req.user);
  })
);

router.post(
  '/refreshPassword',
  validate(userValidator.refreshPassword),
  asyncHandler(async (req, res) => {
    const { oldPassword, password } = req.body;
    // eslint-disable-next-line security/detect-possible-timing-attacks
    if (oldPassword === password) {
      return res.json({
        success: false,
        msg: 'New password cannot be equal with old password',
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isValidPass = await argon2.verify(user.password, oldPassword);
    if (!isValidPass) return res.json({ success: false, msg: 'Password not valid' });

    user.password = password;
    await user.save();

    const response = user.toJSON();
    delete response.password;
    await removeSession(req.cookies.session);
    await cookie(res, response);

    res.send(response);
  })
);

module.exports = router;
